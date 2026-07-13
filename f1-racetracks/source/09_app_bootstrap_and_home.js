/* Runtime boot + home surface for the circuit guide.
 v6.1 (2026-07-10): PER-CIRCUIT DATA LAYER + PER-YEAR SEASON INDEX. Track data
 is no longer inline JS modules. Each circuit is its own file: circuits/<slug>.json,
 holding TIMELESS identity + layout only. The per-year fields (round/date/status/
 sessions) live in circuits/index_circuits.json keyed by slug. Boot fetches the index,
 loads each circuit file (Promise.all), merges the per-year fields onto each circuit
 object, assembles TRACKS in index order, and renders. Completed-race results come from
 the canonical store via module 12 (window.raceResults + its router()). Soft-fail per
 file. Home surface keeps the header carousel (two condensed tiles + chevrons).

 v8 (2026-07-13): CIRCUITS card + jump restyle, self-contained in this module.
 - Home grid cards reworked to a database/table-row feel (.rcard / .rc-*): leading mono
 Rxx + status dot, hairline dividers, tabular date, no side-stripe. New scoped classes
 so the old 02css .race/.status-stripe rules stop matching (left as dead CSS for now).
 - The topbar <select id="jump"> is replaced at runtime by a styled right-side DRAWER
 (trigger + scrim + filter + full round list). All markup/CSS injected here; scoped to
 .jump-* so circuits.html is untouched and it works embedded under the v7 shell. */

const APP_VERSION = "v8";
const APP_DATE = "2026-07-13";
const SEASON = "2026";
const CIRCUITS_BASE = "circuits/";

const TEAM_COLORS = {
 Mercedes: "#6CD3BF",
 Ferrari: "#FF5A60",
 McLaren: "#FF9B3B",
 "Red Bull": "#6EA8FF",
 RedBull: "#6EA8FF",
 Williams: "#7DB6FF",
 Alpine: "#7DE3FF",
 "Racing Bulls": "#C0C8FF",
 AstonMartin: "#66D1A7",
 Aston: "#66D1A7"
};

let TRACKS = [];
let bySlug = {};
let reportTracks = [];
// bound to the same window.* objects module 12 mutates in place.
let raceResults = window.raceResults = window.raceResults || {};
let historicWinners = window.historicWinners = window.historicWinners || {};
let appDataMeta = window.appDataMeta = window.appDataMeta || {};

// Carousel window: index (into TRACKS) of the LEFT tile. -1 = not yet set.
let carouselStart = -1;

const SECCOL = { s1: "var(--s1)", s2: "var(--s2)", s3: "var(--s3)" };
const SN = { s1: "S1", s2: "S2", s3: "S3" };

const app = document.getElementById("app");
const NS = "http://www.w3.org/2000/svg";

const E = (t, a = {}) => {
 const e = document.createElementNS(NS, t);
 for (const k in a) e.setAttribute(k, a[k]);
 return e;
};

const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const lastName = name => String(name || "").trim().split(/\s+/).slice(-1)[0] || name || "";
const teamTone = team => TEAM_COLORS[team] || "#D7DCE4";

function footerText(target) {
 return target
 ? `F1 Racetracks ${APP_VERSION} \u00b7 Round ${target.round} \u00b7 ${target.title}`
 : `F1 Racetracks ${APP_VERSION} \u00b7 ${reportTracks.length} breakdowns \u00b7 ${TRACKS.length} rounds`;
}

function updateFooterMeta(target) {
 const el = document.getElementById("foot-meta");
 if (el) el.textContent = footerText(target || null);
}

/* ---------------------------------------------------------------------------
 Injected styles (v8): database-feel cards + jump drawer. Scoped to new class
 names (#grid / .rcard / .rc-* / .jump-*) so load order vs the async 02..07
 style band doesn't matter and nothing in 02css needs editing. Uses the
 circuit-guide tokens (--surface/--bg2/--line/--grid/--faint/--muted/--done/
 --active/--red/--ease) that already exist in 02css :root.
--------------------------------------------------------------------------- */
(function injectV8Styles() {
 if (document.getElementById("v8-circuits-css")) return;
 const css = `
/* database-feel circuit cards */
#grid{grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.rcard{display:flex;flex-direction:column;text-align:left;width:100%;font:inherit;color:inherit;cursor:pointer;background:var(--surface);border:1px solid var(--line);border-radius:7px;padding:0;overflow:hidden;transition:background .16s var(--ease),border-color .16s var(--ease)}
.rcard:hover{background:var(--bg2);border-color:oklch(0.42 0.02 268)}
.rcard:disabled{cursor:default;opacity:.55}
.rcard:disabled:hover{background:var(--surface);border-color:var(--line)}
.rcard:focus-visible{outline:2px solid var(--red);outline-offset:2px}
.rc-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;border-bottom:1px solid var(--grid)}
.rc-rn{font-family:'JetBrains Mono',monospace;font-size:.64rem;font-weight:700;letter-spacing:.12em;color:var(--faint)}
.rc-status{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:.55rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.rc-dot{width:7px;height:7px;border-radius:50%;flex:none;background:var(--faint)}
.rc-status.done .rc-dot{background:var(--done)}
.rc-status.active .rc-dot{background:var(--active)}
.rc-body{padding:11px 12px 12px}
.rc-gp{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:1.02rem;letter-spacing:-0.01em;line-height:1.15}
.rc-circ{font-size:.81rem;color:var(--muted);margin-top:3px}
.rc-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;border-top:1px solid var(--grid);margin-top:auto}
.rc-date{font-family:'JetBrains Mono',monospace;font-size:.67rem;color:var(--faint);font-variant-numeric:tabular-nums;letter-spacing:.02em}
.rc-tag{font-family:'JetBrains Mono',monospace;font-size:.55rem;letter-spacing:.08em;text-transform:uppercase;font-weight:600;border-radius:4px;padding:3px 6px;white-space:nowrap}
.rc-tag.ready{color:var(--done);border:1px solid color-mix(in oklch,var(--done) 40%,var(--line))}
.rc-tag.soon{color:var(--faint);border:1px solid var(--line)}

/* jump-to-circuit side drawer */
.jump-trigger{font-family:'JetBrains Mono',monospace;font-size:.72rem;font-weight:600;letter-spacing:.04em;display:inline-flex;align-items:center;gap:8px;background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:9px;padding:8px 13px;cursor:pointer;transition:background .15s var(--ease),border-color .15s var(--ease)}
.jump-trigger:hover{background:var(--surface2);border-color:oklch(0.42 0.02 268)}
.jump-trigger svg{width:15px;height:15px;flex:none}
.jump-scrim{position:fixed;inset:0;background:oklch(0.10 0.01 268/0.6);opacity:0;pointer-events:none;transition:opacity .25s var(--ease);z-index:80}
.jump-scrim.open{opacity:1;pointer-events:auto}
.jump-drawer{position:fixed;top:0;right:0;height:100dvh;width:min(340px,88vw);background:var(--bg2);border-left:1px solid var(--line);transform:translateX(102%);transition:transform .3s var(--ease);z-index:81;display:flex;flex-direction:column;box-shadow:-24px 0 60px -30px oklch(0 0 0/0.8)}
.jump-drawer.open{transform:none}
.jd-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 13px;border-bottom:1px solid var(--line)}
.jd-title{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:1rem;letter-spacing:-0.01em}
.jd-x{flex:none;width:30px;height:30px;border:1px solid var(--line);background:var(--surface);color:var(--muted);border-radius:8px;cursor:pointer;font-size:1.15rem;line-height:1;display:grid;place-items:center;transition:background .15s var(--ease),color .15s var(--ease)}
.jd-x:hover{background:var(--surface2);color:var(--text)}
.jd-search{flex:none;padding:12px 16px 8px}
.jd-search input{width:100%;font-family:'JetBrains Mono',monospace;font-size:.78rem;background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:9px 11px;outline:none;transition:border-color .15s var(--ease)}
.jd-search input:focus{border-color:var(--red)}
.jd-search input::placeholder{color:var(--faint)}
.jd-list{flex:1;min-height:0;overflow-y:auto;padding:4px 10px 16px}
.jd-row{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid var(--grid);color:var(--text);font:inherit;cursor:pointer;padding:11px 8px;transition:background .12s var(--ease)}
.jd-row:last-child{border-bottom:0}
.jd-row:hover{background:var(--surface)}
.jd-row[aria-current="true"]{background:var(--surface2)}
.jd-row[data-soon]{opacity:.5}
.jd-rn{font-family:'JetBrains Mono',monospace;font-size:.64rem;font-weight:700;color:var(--faint);letter-spacing:.08em;min-width:30px}
.jd-dot{width:8px;height:8px;border-radius:50%;flex:none;background:var(--faint)}
.jd-dot.done{background:var(--done)}.jd-dot.active{background:var(--active)}
.jd-gp{font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:.9rem;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jd-flag{font-size:1rem;flex:none}
.jd-empty{padding:26px 12px;text-align:center;color:var(--faint);font-size:.82rem}
@media(max-width:560px){.jump-drawer{width:100vw}}
`;
 const st = document.createElement("style");
 st.id = "v8-circuits-css";
 st.textContent = css;
 document.head.appendChild(st);
})();

/* ---- jump drawer machinery ---- */
let jumpEls = null;

function setupJump() {
 if (jumpEls) return;
 const sel = document.getElementById("jump"); // the original <select>
 if (!sel) return;

 const trig = document.createElement("button");
 trig.type = "button";
 trig.id = "jump-trigger";
 trig.className = "jump-trigger";
 trig.setAttribute("aria-label", "Jump to circuit");
 trig.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="14" y2="17"/></svg>Jump to circuit';
 sel.parentNode.replaceChild(trig, sel);

 const scrim = document.createElement("div");
 scrim.className = "jump-scrim";
 scrim.id = "jump-scrim";

 const drawer = document.createElement("aside");
 drawer.className = "jump-drawer";
 drawer.id = "jump-drawer";
 drawer.setAttribute("aria-hidden", "true");
 drawer.setAttribute("aria-label", "Jump to circuit");
 drawer.innerHTML = '<div class="jd-head"><span class="jd-title">Jump to circuit</span><button class="jd-x" type="button" aria-label="Close">\u00d7</button></div>'
 + '<div class="jd-search"><input id="jd-input" type="search" placeholder="Filter circuits\u2026" autocomplete="off" spellcheck="false"></div>'
 + '<div class="jd-list" id="jd-list"></div>';

 document.body.appendChild(scrim);
 document.body.appendChild(drawer);

 jumpEls = {
 trig: trig,
 scrim: scrim,
 drawer: drawer,
 input: drawer.querySelector("#jd-input"),
 list: drawer.querySelector("#jd-list")
 };

 trig.addEventListener("click", openJump);
 scrim.addEventListener("click", closeJump);
 drawer.querySelector(".jd-x").addEventListener("click", closeJump);
 jumpEls.input.addEventListener("input", () => filterJump(jumpEls.input.value));
 document.addEventListener("keydown", e => { if (e.key === "Escape") closeJump(); });
}

function openJump() {
 if (!jumpEls) return;
 jumpEls.drawer.classList.add("open");
 jumpEls.scrim.classList.add("open");
 jumpEls.drawer.setAttribute("aria-hidden", "false");
 jumpEls.input.value = "";
 filterJump("");
 const slug = (location.hash.replace(/^#\/?/, "") || "").trim();
 highlightJump(bySlug[slug] ? slug : "");
 setTimeout(() => { try { jumpEls.input.focus(); } catch (e) {} }, 60);
}

function closeJump() {
 if (!jumpEls) return;
 jumpEls.drawer.classList.remove("open");
 jumpEls.scrim.classList.remove("open");
 jumpEls.drawer.setAttribute("aria-hidden", "true");
}

function filterJump(q) {
 if (!jumpEls) return;
 const s = String(q || "").trim().toLowerCase();
 let shown = 0;
 jumpEls.list.querySelectorAll(".jd-row").forEach(r => {
 const hit = !s || r.textContent.toLowerCase().indexOf(s) !== -1;
 r.style.display = hit ? "" : "none";
 if (hit) shown++;
 });
 let empty = jumpEls.list.querySelector(".jd-empty");
 if (!shown) {
 if (!empty) {
 empty = document.createElement("div");
 empty.className = "jd-empty";
 empty.textContent = "No circuit matches that.";
 jumpEls.list.appendChild(empty);
 }
 empty.style.display = "";
 } else if (empty) {
 empty.style.display = "none";
 }
}

function highlightJump(slug) {
 if (!jumpEls) return;
 jumpEls.list.querySelectorAll(".jd-row").forEach(r => {
 r.setAttribute("aria-current", r.getAttribute("data-slug") === slug ? "true" : "false");
 });
}

function buildJump() {
 setupJump();
 if (!jumpEls) return;
 jumpEls.list.innerHTML = TRACKS.map(t => {
 const st = t.status === "done" ? "done" : t.status === "active" ? "active" : "pending";
 return `<button class="jd-row" type="button" data-slug="${t.slug}"${t.report ? "" : " data-soon=\"1\""}>`
 + `<span class="jd-rn">R${String(t.round).padStart(2, "0")}</span>`
 + `<span class="jd-dot ${st}"></span>`
 + `<span class="jd-gp">${esc(t.gp)}</span>`
 + `<span class="jd-flag">${t.flag}</span>`
 + `</button>`;
 }).join("");
 jumpEls.list.querySelectorAll(".jd-row").forEach(r => {
 r.addEventListener("click", () => {
 location.hash = "#/" + r.getAttribute("data-slug");
 closeJump();
 });
 });
}

function applyData(tracks) {
 TRACKS = tracks || [];
 bySlug = Object.fromEntries(TRACKS.map(t => [t.slug, t]));
 reportTracks = TRACKS.filter(t => t.report);
 buildJump();
 router();
}

function renderDataUnavailable(error) {
 app.innerHTML = `
 <div class="view">
 <div class="home-h">
 <p class="eyebrow">2026 circuit guide // data load issue</p>
 <h1>F1 Racetracks</h1>
 <p class="sub">The runtime loaded, but the circuit data did not.</p>
 </div>
 <div class="card empty-card">
 <div class="panel-b" style="padding:22px 4px">
 <p class="note">Couldn\u2019t load <code>circuits/index_circuits.json</code> (or every circuit file failed). Keep the page on the same origin as the <code>circuits/</code> folder, or reload once the store is reachable.</p>
 </div>
 </div>
 </div>
 `;
 const el = document.getElementById("foot-meta");
 if (el) el.textContent = `F1 Racetracks ${APP_VERSION} \u00b7 data unavailable`;
 console.error(error);
}

function router() {
 const slug = (location.hash.replace(/^#\/?/, "") || "").trim();
 if (slug && bySlug[slug]) renderTrack(bySlug[slug]);
 else renderHome();
 highlightJump(bySlug[slug] ? slug : "");
 window.scrollTo(0, 0);
 if (typeof syncWeekendSurfaces === "function") {
 window.setTimeout(syncWeekendSurfaces, 0);
 }
 if (window.lucide) lucide.createIcons();
 updateFooterMeta(slug && bySlug[slug] ? bySlug[slug] : null);
}

window.addEventListener("hashchange", router);

/* Index of the "current" round: prefer the canonical results-store meta
 (window.appDataMeta.current_round_slug), else first active, else first pending. */
function currentIndex() {
 const meta = appDataMeta || {};
 if (meta.current_round_slug) {
 const i = TRACKS.findIndex(t => t.slug === meta.current_round_slug);
 if (i >= 0) return i;
 }
 let i = TRACKS.findIndex(t => t.status === "active");
 if (i >= 0) return i;
 i = TRACKS.findIndex(t => t.status === "pending");
 return i >= 0 ? i : 0;
}

function carouselTile(t) {
 if (!t) return `<div class="cx-tile cx-empty"></div>`;
 const chip = t.status === "active"
 ? '<span class="cx-chip live">Live</span>'
 : t.status === "done"
 ? '<span class="cx-chip done">Result</span>'
 : '<span class="cx-chip soon">Upcoming</span>';
 const dis = t.report ? "" : " cx-dis";
 const onclick = t.report ? `onclick="location.hash='#/${t.slug}'"` : "disabled";
 return `<button class="cx-tile${dis}" ${onclick}>
 <div class="cx-top"><span class="cx-rn">R${String(t.round).padStart(2, "0")}</span><span class="cx-flag">${t.flag}</span>${chip}</div>
 <div class="cx-gp">${esc(t.gp)}</div>
 <div class="cx-meta"><span class="cx-circ">${esc(t.loc)}</span><span class="cx-date">${esc(t.date)}</span></div>
 </button>`;
}

function carouselMarkup() {
 const total = TRACKS.length;
 if (total < 1) return "";
 if (carouselStart < 0) carouselStart = currentIndex();
 const maxStart = Math.max(0, total - 2);
 if (carouselStart > maxStart) carouselStart = maxStart;
 if (carouselStart < 0) carouselStart = 0;
 const start = carouselStart;
 const pair = [TRACKS[start], TRACKS[start + 1]];
 const canPrev = start > 0;
 const canNext = start + 2 < total;
 const chevL = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 const chevR = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 return `<div class="cx" role="group" aria-label="Quick race carousel">
 <button class="cx-nav" aria-label="Previous round" ${canPrev ? 'onclick="f1Carousel(-1)"' : "disabled"}>${chevL}</button>
 <div class="cx-tiles">${carouselTile(pair[0])}${carouselTile(pair[1])}</div>
 <button class="cx-nav" aria-label="Next round" ${canNext ? 'onclick="f1Carousel(1)"' : "disabled"}>${chevR}</button>
 </div>`;
}

window.f1Carousel = function (dir) {
 const total = TRACKS.length;
 const maxStart = Math.max(0, total - 2);
 let next = carouselStart + dir;
 if (next < 0) next = 0;
 if (next > maxStart) next = maxStart;
 carouselStart = next;
 const host = document.getElementById("cx-host");
 if (host) {
 host.innerHTML = carouselMarkup();
 if (window.lucide) lucide.createIcons();
 }
};

function renderHome() {
 app.innerHTML = `
 <div class="view">
 <div class="home-h">
 <p class="eyebrow">2026 circuit guide // technical breakdowns</p>
 <h1>F1 Racetracks</h1>
 <p class="sub">Every 2026 circuit breakdown in one place \u2014 official map, lap profile, tyre strategy, overtaking notes, live weather, and completed-race panels.</p>
 </div>
 <div id="cx-host">${carouselMarkup()}</div>
 <div class="legend">
 <span class="lg"><span class="d" style="background:var(--done)"></span>Completed race</span>
 <span class="lg"><span class="d" style="background:var(--active)"></span>Race weekend live</span>
 <span class="lg"><span class="d" style="background:var(--line)"></span>Upcoming</span>
 <span class="lg"><span class="badge b-report" style="padding:2px 6px"><span class="d" style="background:var(--done)"></span>Breakdown ready</span></span>
 </div>
 <div class="grid" id="grid"></div>
 </div>
 `;

 const grid = document.getElementById("grid");
 TRACKS.forEach(t => {
 const b = document.createElement("button");
 b.className = "rcard";
 if (!t.report) b.disabled = true;
 else b.onclick = () => location.hash = "#/" + t.slug;

 const stCls = t.status === "done" ? "done" : t.status === "active" ? "active" : "pending";
 const stWord = t.status === "done" ? "Completed" : t.status === "active" ? "Live" : "Upcoming";
 b.innerHTML = `
 <div class="rc-top">
 <span class="rc-rn">R${String(t.round).padStart(2, "0")}</span>
 <span class="rc-status ${stCls}"><span class="rc-dot"></span>${stWord}</span>
 </div>
 <div class="rc-body">
 <div class="rc-gp">${esc(t.gp)}</div>
 <div class="rc-circ">${esc(t.title)}</div>
 </div>
 <div class="rc-foot">
 <span class="rc-date">${t.flag} ${t.date} \u00b7 ${SEASON}</span>
 ${t.report ? '<span class="rc-tag ready">Breakdown</span>' : '<span class="rc-tag soon">Soon</span>'}
 </div>
 `;
 grid.appendChild(b);
 });
}

// Build the drawer chrome as soon as the module runs, so the trigger is present
// before circuit data lands (the list fills in later via buildJump()).
setupJump();

/* Boot: fetch the per-circuit index, then each circuit file. Merge the per-year
 fields (round/date/status/sessions) from the index entry onto each circuit.
 Soft-fail per file. */
(async function boot() {
 try {
 updateFooterMeta(null);
 const idxRes = await fetch(CIRCUITS_BASE + "index_circuits.json", { cache: "no-cache" });
 if (!idxRes.ok) throw new Error("index_circuits.json " + idxRes.status);
 const idx = await idxRes.json();
 const entries = (idx.circuits || []);
 const loaded = await Promise.all(entries.map(async (e) => {
 try {
 const path = CIRCUITS_BASE + String(e.file).replace("./", "");
 const r = await fetch(path, { cache: "no-cache" });
 if (!r.ok) throw new Error(e.slug + " " + r.status);
 const circuit = await r.json();
 return Object.assign(circuit, {
 round: e.round,
 date: e.date,
 status: e.status,
 sessions: e.sessions
 });
 } catch (err) {
 console.error("circuit load failed:", e.slug, err);
 return null; // soft-fail: skip this one, keep the rest
 }
 }));
 const tracks = loaded.filter(Boolean);
 if (!tracks.length) throw new Error("no circuit files loaded");
 applyData(tracks);
 if (window.lucide) lucide.createIcons();
 } catch (err) {
 renderDataUnavailable(err);
 if (window.lucide) lucide.createIcons();
 }
})();
