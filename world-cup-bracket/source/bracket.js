// World Cup 2026 Bracket - bracket view. Card tap opens the shared detail
// sheet; the right-side \u2197 arrow on each concrete team traces its path
// (one-tap, first-class). No more \u24d8 badge.
import { S } from './store.js';
import { cc, isComplete, winnerName, byId, slotLabel, ROUND_ORDER } from './util.js';
import { openSheet } from './sheet.js';

const ROUND_LABELS = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarters', SF: 'Semis', Final: 'Final' };

export function renderBracket() {
  const container = document.getElementById('bracketContent');
  let html = '';
  ROUND_ORDER.forEach((round, rIdx) => {
    const matches = S.allMatches.filter(m => m.round === round);
    html += `<div class="bracket-round"><div class="bracket-round-label">${ROUND_LABELS[round]}</div>`
      + matches.map(renderBracketMatch).join('')
      + `${round === 'Final' ? '<div class="trophy">\uD83C\uDFC6</div>' : ''}</div>`;
    if (rIdx < ROUND_ORDER.length - 1) {
      const nextMatches = S.allMatches.filter(m => m.round === ROUND_ORDER[rIdx + 1]);
      html += `<div class="bracket-connectors">${nextMatches.map(() => '<div class="connector-pair"></div>').join('')}</div>`;
    }
  });
  container.innerHTML = html;
  bindBracketTaps();
  if (S.pickedTeam) applyPathHighlight(S.pickedTeam);
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
  // Right-side trace arrow = one-tap path highlight for this team.
  const trace = traceable ? `<button class="bm-trace" data-team="${sl.text}" aria-label="Trace ${sl.text}'s path">\u2197</button>` : '';
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
// Card body -> shared detail sheet. Right-side \u2197 -> path highlight.
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
      const team = btn.dataset.team;
      if (S.pickedTeam === team) clearPathHighlight();
      else { S.pickedTeam = team; applyPathHighlight(team); }
    });
  });
}

function buildPathSet(team) {
  const startMatches = S.allMatches.filter(m => (m.home === team || m.away === team));
  const path = new Set();
  startMatches.forEach(sm => {
    let cur = sm; let alive = true;
    while (cur && alive) {
      path.add(cur.id);
      if (isComplete(cur)) { if (winnerName(cur) !== team) { alive = false; break; } }
      cur = cur.feedsTo ? byId(cur.feedsTo) : null;
    }
  });
  return path;
}

export function applyPathHighlight(team) {
  S.pickedTeam = team;
  const path = buildPathSet(team);
  document.querySelectorAll('.bracket-match').forEach(el => {
    const id = +el.dataset.matchId;
    el.classList.toggle('on-path', path.has(id));
    el.classList.toggle('dim', !path.has(id));
  });
  document.querySelectorAll('.bm-trace').forEach(el => el.classList.toggle('picked', el.dataset.team === team));
}

export function clearPathHighlight() {
  S.pickedTeam = null;
  document.querySelectorAll('.bracket-match').forEach(el => { el.classList.remove('on-path'); el.classList.remove('dim'); });
  document.querySelectorAll('.bm-trace').forEach(el => el.classList.remove('picked'));
}
