// World Cup 2026 Bracket - multi-team path compare engine.
// Owns: the picked-team set, per-team path computation, convergence detection
// (where two selected teams' paths first meet), and applying color classes to
// the DOM. Split out of bracket.js to stay under the 12KB module budget and to
// keep the path/color logic in one cohesive place.
import { S, PATH_PALETTE, MAX_PICKS } from './store.js';
import { cc, isComplete, winnerName, byId } from './util.js';

// Forward walk: every match `team` occupies or could still reach.
// Graph-walk from the team's earliest node (hardened vs the old name-match-all
// approach that double-lit on a data mismatch): start at the single earliest
// round the team appears, then follow feedsTo while still alive.
export function pathForTeam(team) {
  const starts = S.allMatches
    .filter(m => m.home === team || m.away === team)
    .sort((a, b) => a.id - b.id);
  const path = new Set();
  if (!starts.length) return path;
  let cur = starts[0];
  let alive = true;
  while (cur && alive) {
    path.add(cur.id);
    if (isComplete(cur) && winnerName(cur) !== team) { alive = false; break; }
    cur = cur.feedsTo ? byId(cur.feedsTo) : null;
  }
  return path;
}

// selection ops -------------------------------------------------------------
export function isPicked(team) { return S.picks.includes(team); }
export function colorIndexOf(team) { return S.picks.indexOf(team); }

// Returns { ok } or { full:true } when the cap is hit (caller nudges the user).
export function togglePick(team) {
  const i = S.picks.indexOf(team);
  if (i >= 0) { S.picks.splice(i, 1); return { ok: true }; }
  if (S.picks.length >= MAX_PICKS) return { full: true };
  S.picks.push(team);
  return { ok: true };
}
export function removePick(team) {
  const i = S.picks.indexOf(team);
  if (i >= 0) S.picks.splice(i, 1);
}
export function clearPicks() { S.picks.length = 0; }

// convergence ---------------------------------------------------------------
// The earliest match on 2+ selected teams' paths = where they'd collide.
// Returns a Map: matchId -> [colorIndex, colorIndex] for the first such meet
// per team-pair. Only the FIRST shared node per pair is marked (the knockout).
export function convergenceMap() {
  const paths = S.picks.map(pathForTeam);
  const conv = new Map();
  for (let a = 0; a < paths.length; a++) {
    for (let b = a + 1; b < paths.length; b++) {
      const shared = [...paths[a]].filter(id => paths[b].has(id));
      if (!shared.length) continue;
      const first = shared.sort((x, y) => x - y)[0];
      const arr = conv.get(first) || [];
      if (!arr.includes(a)) arr.push(a);
      if (!arr.includes(b)) arr.push(b);
      conv.set(first, arr);
    }
  }
  return conv;
}

// apply ---------------------------------------------------------------------
export function applyPaths() {
  const paths = S.picks.map(pathForTeam);
  const conv = convergenceMap();
  const anyPicked = S.picks.length > 0;

  document.querySelectorAll('.bracket-match').forEach(el => {
    const id = +el.dataset.matchId;
    // reset
    el.classList.remove('on-path', 'dim', 'converge');
    el.style.removeProperty('--path-line');
    el.style.removeProperty('--path-surf');
    el.style.removeProperty('--path-line-2');

    if (!anyPicked) return;

    const onIdx = [];
    paths.forEach((p, i) => { if (p.has(id)) onIdx.push(i); });

    if (!onIdx.length) { el.classList.add('dim'); return; }

    el.classList.add('on-path');
    const c0 = PATH_PALETTE[onIdx[0]];
    el.style.setProperty('--path-line', c0.line);
    el.style.setProperty('--path-surf', c0.surf);

    if (conv.has(id) && conv.get(id).length >= 2) {
      const [i1, i2] = conv.get(id);
      el.classList.add('converge');
      el.style.setProperty('--path-line', PATH_PALETTE[i1].line);
      el.style.setProperty('--path-line-2', PATH_PALETTE[i2].line);
    }
  });

  // color each team's trace arrow to its assigned hue
  document.querySelectorAll('.bm-trace').forEach(el => {
    const idx = S.picks.indexOf(el.dataset.team);
    if (idx >= 0) { el.classList.add('picked'); el.style.color = PATH_PALETTE[idx].line; }
    else { el.classList.remove('picked'); el.style.removeProperty('color'); }
  });

  renderLegend();
}

// legend chip row -----------------------------------------------------------
export function renderLegend() {
  const bar = document.getElementById('pathLegend');
  if (!bar) return;
  if (!S.picks.length) { bar.innerHTML = ''; bar.hidden = true; return; }
  bar.hidden = false;
  const conv = convergenceMap();
  const meets = [...conv.values()].filter(a => a.length >= 2).length;
  const chips = S.picks.map((team, i) => {
    const c = PATH_PALETTE[i];
    return `<span class="legend-chip" style="--c:${c.line}">`
      + `<span class="legend-dot"></span>${cc(team)}`
      + `<button class="legend-x" data-remove="${team}" aria-label="Remove ${team}">\u00d7</button></span>`;
  }).join('');
  const meetNote = meets ? `<span class="legend-meet">${meets} convergence${meets > 1 ? 's' : ''}</span>` : '';
  bar.innerHTML = chips + meetNote + `<button class="legend-clear" data-clear="1">Clear all</button>`;
}
