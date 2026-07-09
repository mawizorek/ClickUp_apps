// World Cup 2026 Bracket - bracket view. Card tap opens the shared detail
// sheet; the right-side \u2192 arrow ADDS/REMOVES a team to the multi-team path
// compare (paths.js owns the set + colors + convergence).
import { S } from './store.js';
import { isComplete, slotLabel, ROUND_ORDER } from './util.js';
import { openSheet } from './sheet.js';
import { togglePick, removePick, clearPicks, applyPaths } from './paths.js';

const ROUND_LABELS = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarters', SF: 'Semis', Final: 'Final' };
let resetBound = false;

// 3rd-place match(es) render as a small standalone node under the Final, NOT wired
// into the championship tree (its teams are the SF LOSERS, so it isn't part of the
// feedsTo path). Reuses the round-label styling so no CSS change is needed.
function thirdPlaceBlock() {
  const tp = S.allMatches.filter(m => m.round === '3P');
  if (!tp.length) return '';
  return `<div class="bracket-round-label" style="margin-top:14px">3rd Place</div>`
    + tp.map(renderBracketMatch).join('');
}

export function renderBracket() {
  const container = document.getElementById('bracketContent');
  let html = '';
  ROUND_ORDER.forEach((round, rIdx) => {
    const matches = S.allMatches.filter(m => m.round === round);
    html += `<div class="bracket-round"><div class="bracket-round-label">${ROUND_LABELS[round]}</div>`
      + matches.map(renderBracketMatch).join('')
      + `${round === 'Final' ? '<div class="trophy">\uD83C\uDFC6</div>' + thirdPlaceBlock() : ''}</div>`;
    if (rIdx < ROUND_ORDER.length - 1) {
      const nextMatches = S.allMatches.filter(m => m.round === ROUND_ORDER[rIdx + 1]);
      html += `<div class="bracket-connectors">${nextMatches.map(() => '<div class="connector-pair"></div>').join('')}</div>`;
    }
  });
  container.innerHTML = html;
  bindBracketTaps();
  bindReset();
  applyPaths();
}

function bmTeam(m, side) {
  const done = isComplete(m);
  const isW = m.winner === side;
  const isL = done && m.winner && m.winner !== side;
  const sl = slotLabel(m, side);
  const score = m[side === 'home' ? 'hs' : 'as'];
  const traceable = sl.text && sl.text !== 'TBD' && !sl.potential;
  const nameHtml = sl.potential ? `<span class="bm-name potential">${sl.text}</span>` : `<span class="bm-name">${sl.text}</span>`;
  const scoreHtml = (score !== null && score !== undefined) ? `<span class="bm-score">${score}</span>` : '';
  const trace = traceable ? `<button class="bm-trace" data-team="${sl.text}" aria-label="Add ${sl.text} to path compare">\u2192</button>` : '';
  return `<div class="bm-team ${isW ? 'w' : ''} ${isL ? 'l' : ''}">`
    + `<span class="bm-code">${sl.code || '\u2014'}</span>`
    + nameHtml + scoreHtml + trace + `</div>`;
}

function renderBracketMatch(m) {
  const done = isComplete(m);
  const isFinal = m.round === 'Final';
  const classes = ['bracket-match', done ? 'completed' : '', isFinal ? 'is-final' : ''].filter(Boolean).join(' ');
  const statusText = m.status === 'ft' ? 'FT' : m.status === 'aet' ? 'AET' : m.status === 'pso' ? 'PEN' : '';
  const statusClass = ['pso', 'aet'].includes(m.status) ? 'pen' : done ? 'done' : '';
  return `<div class="${classes}" data-match-id="${m.id}" role="button" tabindex="0">`
    + `${statusText ? `<div class="bm-status ${statusClass}">${statusText}</div>` : ''}`
    + bmTeam(m, 'home') + bmTeam(m, 'away')
    + `</div>`;
}

// ---- interactions ----
function flash(msg) {
  const bar = document.getElementById('pathLegend');
  if (!bar) return;
  const n = document.createElement('span');
  n.className = 'legend-flash'; n.textContent = msg;
  bar.hidden = false; bar.appendChild(n);
  setTimeout(() => n.remove(), 2200);
}

function bindBracketTaps() {
  const root = document.getElementById('bracketContent');
  root.querySelectorAll('.bracket-match').forEach(card => {
    const id = +card.dataset.matchId;
    card.addEventListener('click', (e) => {
      if (e.target.closest('.bm-trace')) return; // handled below
      openSheet(id);
    });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openSheet(id); });
  });
  root.querySelectorAll('.bm-trace').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const res = togglePick(btn.dataset.team);
      if (res && res.full) { flash('Clear one first (max 4)'); return; }
      applyPaths();
    });
  });
}

// Legend chip row: per-chip \u00d7 removes one, Clear all resets. Delegated once.
let legendBound = false;
function bindLegend() {
  if (legendBound) return; legendBound = true;
  const bar = document.getElementById('pathLegend');
  if (!bar) return;
  bar.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove]');
    const cl = e.target.closest('[data-clear]');
    if (rm) { removePick(rm.dataset.remove); applyPaths(); }
    else if (cl) { clearPicks(); applyPaths(); }
  });
}

// Tap empty bracket space -> clear ALL selected paths.
function bindReset() {
  bindLegend();
  if (resetBound) return; resetBound = true;
  const view = document.getElementById('bracketView');
  view.addEventListener('click', (e) => {
    if (!S.picks.length) return;
    if (e.target.closest('.bracket-match') || e.target.closest('.bm-trace') || e.target.closest('#pathLegend')) return;
    clearPicks();
    applyPaths();
  });
}
