/* Runtime boot + home surface for the circuit guide.
   v5.3: data.json is RETIRED. Track data is assembled from the inline
   TRACK_DATA_ROUNDS_* globals defined by modules 05-08 (loaded before this),
   and completed-race results come from the canonical store via module 12
   (12_results_store.js), which populates window.raceResults and calls router().
   Home surface: a slim header carousel pins TWO condensed race tiles side by
   side (defaulting to the current round + the next one) flanked by chevrons
   that page through the calendar two rounds at a time. Each tile is a shortcut
   into that circuit's breakdown. Full 24-circuit grid still lives below.
   Source assembly order:
     ...TRACK_DATA_ROUNDS_01_03,
     ...TRACK_DATA_ROUNDS_06_09,
     ...TRACK_DATA_ROUNDS_10_13,
     ...TRACK_DATA_ROUNDS_14_24
 */

const APP_VERSION = "v5.3";
const APP_DATE = "2026-07-10";
const SEASON = "2026";

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
// These point at the SAME objects module 12 mutates in place (window.race*),
// so the store's async fill + its router() re-render surface through here.
let raceResults = window.raceResults = window.raceResults || {};
let historicWinners = window.historicWinners = window.historicWinners || {};
let appDataMeta = window.appDataMeta = window.appDataMeta || {};

// Carousel window: index (into TRACKS) of the LEFT tile. -1 = not yet set,
// initialised to the current round on first home render, then persists as the
// user pages so re-renders (e.g. the store landing) don't snap it back.
let carouselStart = -1;

const SECCOL = { s1: "var(--s1)", s2: "var(--s2)", s3: "var(--s3)" };
const SN = { s1: "S1", s2: "S2", s3: "S3" };

const app = document.getElementById("app");
const jump = document.getElementById("jump");
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
 document.getElementById("foot-meta").textContent = footerText(target || null);
}

function buildJump() {
 jump.innerHTML = '<option value="">Jump to circuit\u2026</option>' + TRACKS.map(t => `<option value="${t.slug}">R${t.round} \u00b7 ${esc(t.gp)}${t.report ? "" : " (soon)"}</option>`).join("");
}

function applyData(data) {
 TRACKS = data.tracks || [];
 raceResults = window.raceResults = window.raceResults || data.raceResults || {};
 historicWinners = window.historicWinners = window.historicWinners || data.historicWinners || {};
 appDataMeta = window.appDataMeta = window.appDataMeta || {};
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
 <p class="sub">The runtime loaded, but the circuit data modules did not.</p>
 </div>
 <div class="card empty-card">
 <div class="panel-b" style="padding:22px 4px">
 <p class="note">The <code>source/05\u201308_track_data_*.js</code> modules failed to load, so there are no circuits to index. Reload the page; if it persists, the source bundle is incomplete.</p>
 </div>
 </div>
 </div>
 `;
 document.getElementById("foot-meta").textContent = `F1 Racetracks ${APP_VERSION} \u00b7 data unavailable`;
 console.error(error);
}

function router() {
 const slug = (location.hash.replace(/^#\/?/, "") || "").trim();
 if (slug && bySlug[slug]) renderTrack(bySlug[slug]);
 else renderHome();
 jump.value = bySlug[slug] ? slug : "";
 window.scrollTo(0, 0);
 if (typeof syncWeekendSurfaces === 'function') {
 window.setTimeout(syncWeekendSurfaces, 0);
 }
 if (window.lucide) lucide.createIcons();
 updateFooterMeta(slug && bySlug[slug] ? bySlug[slug] : null);
}

window.addEventListener("hashchange", router);

/* Index of the "current" round: prefer the canonical store meta
   (window.appDataMeta.current_round_slug, filled by module 12), else the first
   active round, else the first not-yet-done round, else 0. */
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

/* One condensed carousel tile: a shortcut, not the full card. */
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
 // clamp so a full pair stays visible
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
 <button class="cx-nav" aria-label="Previous rounds" ${canPrev ? 'onclick="f1Carousel(-1)"' : "disabled"}>${chevL}</button>
 <div class="cx-tiles">${carouselTile(pair[0])}${carouselTile(pair[1])}</div>
 <button class="cx-nav" aria-label="Next rounds" ${canNext ? 'onclick="f1Carousel(1)"' : "disabled"}>${chevR}</button>
 </div>`;
}

// Page the carousel window by whole steps of 2 (a fresh pair each tab),
// clamped, then re-render just the carousel band in place.
window.f1Carousel = function (dir) {
 const total = TRACKS.length;
 const maxStart = Math.max(0, total - 2);
 let next = carouselStart + dir * 2;
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
 b.className = "race";
 if (!t.report) b.disabled = true;
 else b.onclick = () => location.hash = "#/" + t.slug;

 const ss = t.status === "done" ? "ss-done" : t.status === "active" ? "ss-active" : "ss-pending";
 b.innerHTML = `
 <span class="status-stripe ${ss}"></span>
 <div class="rd"><span>Round ${String(t.round).padStart(2, "0")}</span><span class="flag">${t.flag}</span></div>
 <div class="gp">${esc(t.gp)}</div>
 <div class="circ">${esc(t.title)}</div>
 <div class="foot">
 <span class="date">${t.date} ${SEASON}</span>
 ${t.report ? '<span class="badge b-report"><span class="d" style="background:var(--done)"></span>Breakdown</span>' : '<span class="badge b-soon">Soon</span>'}
 </div>
 `;
 grid.appendChild(b);
 });
}

jump.addEventListener("change", () => {
 if (jump.value) location.hash = "#/" + jump.value;
});

(function boot() {
 try {
 updateFooterMeta(null);
 const inline = [].concat(
 typeof TRACK_DATA_ROUNDS_01_03 !== "undefined" ? TRACK_DATA_ROUNDS_01_03 : [],
 typeof TRACK_DATA_ROUNDS_06_09 !== "undefined" ? TRACK_DATA_ROUNDS_06_09 : [],
 typeof TRACK_DATA_ROUNDS_10_13 !== "undefined" ? TRACK_DATA_ROUNDS_10_13 : [],
 typeof TRACK_DATA_ROUNDS_14_24 !== "undefined" ? TRACK_DATA_ROUNDS_14_24 : []
 );
 if (!inline.length) throw new Error("No inline track data present");
 applyData({ tracks: inline, season: Number(SEASON) });
 if (window.lucide) lucide.createIcons();
 } catch (err) {
 renderDataUnavailable(err);
 if (window.lucide) lucide.createIcons();
 }
})();
