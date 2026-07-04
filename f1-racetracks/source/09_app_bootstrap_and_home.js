/* Runtime boot + home surface synced to the shipped v5 app.
   Source assembly order for runtime rebuild:
   ...TRACK_DATA_ROUNDS_01_03,
   ...TRACK_DATA_ROUNDS_06_09,
   ...TRACK_DATA_ROUNDS_10_13,
   ...TRACK_DATA_ROUNDS_14_24
 */

const APP_VERSION = "V1.6 main";
const APP_DATE = "2026-07-03";
const SEASON = "2026";
const CACHE_KEY = "f1-racetracks-data-cache-v5";

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
let raceResults = {};
let historicWinners = {};
let appDataMeta = {};

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
  const cacheNote = appDataMeta.fromCache ? " · cached data" : "";
  return target
    ? `F1 Racetracks ${APP_VERSION} · Round ${target.round} · ${target.title}${cacheNote}`
    : `F1 Racetracks ${APP_VERSION} · ${reportTracks.length} breakdowns · ${TRACKS.length} rounds${cacheNote}`;
}

function updateFooterMeta(target) {
  document.getElementById("foot-meta").textContent = footerText(target || null);
}

function buildJump() {
  jump.innerHTML = '<option value="">Jump to circuit…</option>' + TRACKS.map(t => `<option value="${t.slug}">R${t.round} · ${esc(t.gp)}${t.report ? "" : " (soon)"}</option>`).join("");
}

function parseSourceArray(source) {
  const match = source.match(/const\s+\w+\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) throw new Error("Could not parse track source file");
  return Function(`"use strict"; return (${match[1]})`)();
}

async function loadResolvedData() {
  try {
    const res = await fetch("./data.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`data.json ${res.status}`);

    const manifest = await res.json();
    let tracks = Array.isArray(manifest.tracks) ? manifest.tracks : null;

    if (!tracks && manifest.mode === "manifest" && Array.isArray(manifest.track_source_files)) {
      const chunks = await Promise.all(
        manifest.track_source_files.map(async path => parseSourceArray(await (await fetch(path, { cache: "no-store" })).text()))
      );
      tracks = chunks.flat();
    }

    if (!Array.isArray(tracks) || !tracks.length) throw new Error("Track data unavailable");

    const resolved = {
      version: manifest.version || APP_DATE,
      season: manifest.season || Number(SEASON),
      tracks,
      raceResults: manifest.raceResults || {},
      historicWinners: manifest.historicWinners || {},
      sourceMode: manifest.mode || "inline",
      last_updated: manifest.last_updated || null,
      current_round_slug: manifest.current_round_slug || null,
      last_completed_round_slug: manifest.last_completed_round_slug || null,
      update_focus: manifest.update_focus || null
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(resolved));
    return resolved;
  } catch (err) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.fromCache = true;
      return parsed;
    }
    throw err;
  }
}

function applyData(data) {
  TRACKS = data.tracks || [];
  raceResults = data.raceResults || {};
  historicWinners = data.historicWinners || {};
  appDataMeta = data;
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
        <p class="sub">The engine loaded, but the external data file did not.</p>
      </div>
      <div class="card empty-card">
        <div class="panel-b" style="padding:22px 4px">
          <p class="note">Couldn’t load <code>data.json</code>. Keep the HTML beside <code>data.json</code> on the same origin, or open the hosted GitHub Pages version once to seed the offline cache.</p>
        </div>
      </div>
    </div>
  `;
  document.getElementById("foot-meta").textContent = "F1 Racetracks V1.6 main · data unavailable";
  console.error(error);
}

function router() {
  const slug = (location.hash.replace(/^#\/?/, "") || "").trim();
  if (slug && bySlug[slug]) renderTrack(bySlug[slug]);
  else renderHome();
  jump.value = bySlug[slug] ? slug : "";
  window.scrollTo(0, 0);
  if (window.lucide) lucide.createIcons();
  updateFooterMeta(slug && bySlug[slug] ? bySlug[slug] : null);
}

window.addEventListener("hashchange", router);

function renderHome() {
  const built = reportTracks.length;
  app.innerHTML = `
    <div class="view">
      <div class="home-h">
        <p class="eyebrow">2026 circuit guide // technical breakdowns</p>
        <h1>F1 Racetracks</h1>
        <p class="sub">Every 2026 circuit breakdown in one place — official map, lap profile, tyre strategy, overtaking notes, live weather, and completed-race panels.</p>
      </div>
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

(async function boot() {
  try {
    updateFooterMeta(null);
    const data = await loadResolvedData();
    applyData(data);
    if (window.lucide) lucide.createIcons();
  } catch (err) {
    renderDataUnavailable(err);
    if (window.lucide) lucide.createIcons();
  }
})();