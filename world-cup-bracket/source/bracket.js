// World Cup 2026 Bracket - bracket view: path-highlight + detail sheet.
import { S } from './store.js';
import { cc, isComplete, winnerName, rankOf, byId, slotLabel, sideTeams, kickoffDate, fmtCountdown, oddsEstimate } from './util.js';

const ROUND_ORDER = ['R32', 'R16', 'QF', 'SF', 'Final'];
const ROUND_LABELS = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarters', SF: 'Semis', Final: 'Final' };
const ROUND_FULL = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarterfinal', SF: 'Semifinal', Final: 'Final' };

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
  const tappable = sl.text && sl.text !== 'TBD' && !sl.potential;
  const nameHtml = sl.potential ? `<span class="bm-name potential">${sl.text}</span>` : `<span class="bm-name">${sl.text}</span>`;
  return `<div class="bm-team ${isW ? 'w' : ''} ${isL ? 'l' : ''}" ${tappable ? `data-team="${sl.text}"` : ''}>`
    + `<span class="bm-code">${sl.code || '\u2014'}</span>`
    + nameHtml
    + `${score !== null && score !== undefined ? `<span class="bm-score">${score}</span>` : ''}</div>`;
}

function renderBracketMatch(m) {
  const done = isComplete(m);
  const isFinal = m.round === 'Final';
  const classes = ['bracket-match', done ? 'completed' : '', isFinal ? 'is-final' : ''].filter(Boolean).join(' ');
  const statusText = m.status === 'ft' ? 'FT' : m.status === 'aet' ? 'AET' : m.status === 'pso' ? 'PEN' : '';
  const statusClass = ['pso', 'aet'].includes(m.status) ? 'pen' : done ? 'done' : '';
  return `<div class="${classes}" data-match-id="${m.id}">`
    + `<button class="bm-info" data-info="${m.id}" aria-label="Match details">i</button>`
    + `${statusText ? `<div class="bm-status ${statusClass}">${statusText}</div>` : ''}`
    + bmTeam(m, 'home') + bmTeam(m, 'away')
    + `</div>`;
}

// ---- interactions ----
function bindBracketTaps() {
  const root = document.getElementById('bracketContent');
  root.querySelectorAll('.bm-team[data-team]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const team = el.dataset.team;
      if (S.pickedTeam === team) clearPathHighlight();
      else { S.pickedTeam = team; applyPathHighlight(team); }
    });
  });
  root.querySelectorAll('.bm-info').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSheet(+btn.dataset.info);
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
  const path = buildPathSet(team);
  document.querySelectorAll('.bracket-match').forEach(el => {
    const id = +el.dataset.matchId;
    el.classList.toggle('on-path', path.has(id));
    el.classList.toggle('dim', !path.has(id));
  });
  document.querySelectorAll('.bm-team').forEach(el => el.classList.toggle('picked', el.dataset.team === team));
}

export function clearPathHighlight() {
  S.pickedTeam = null;
  document.querySelectorAll('.bracket-match').forEach(el => { el.classList.remove('on-path'); el.classList.remove('dim'); });
  document.querySelectorAll('.bm-team').forEach(el => el.classList.remove('picked'));
}

// ---- detail sheet ----
function chip(team) {
  const r = rankOf(team);
  return `<span class="chip">${team}${r ? `<span class="rk">#${r}</span>` : ''}</span>`;
}

function whenLine(m) {
  const ko = kickoffDate(m);
  const timePart = (m.time && m.time !== 'TBD') ? m.time : (ko ? '' : 'Time TBD');
  const cd = ko ? ` <span class="cd" data-countdown="${ko.getTime()}">${fmtCountdown(ko)}</span>` : '';
  return `${m.dayLabel}${timePart ? ', ' + timePart : ''}${cd}`;
}

function sheetHTML(m) {
  const home = slotLabel(m, 'home');
  const away = slotLabel(m, 'away');
  const label = (sl) => sl.tbd ? 'TBD' : (sl.potential ? `winner of ${sl.text}` : sl.text);
  const title = `${label(home)}  vs  ${label(away)}`;

  const hTeams = sideTeams(m, 'home');
  const aTeams = sideTeams(m, 'away');

  let odds = '';
  if (hTeams.length === 1 && aTeams.length === 1) {
    const o = oddsEstimate(hTeams[0], aTeams[0]);
    if (o) {
      odds = `<div class="odds"><div class="odds-head">Win estimate <span class="odds-tag">EST</span></div>`
        + `<div class="odds-bar">`
        + `<div class="odds-seg a" style="flex:${o.a}">${cc(hTeams[0])} ${o.a}%</div>`
        + `<div class="odds-seg b" style="flex:${o.b}">${o.b}% ${cc(aTeams[0])}</div>`
        + `</div></div>`;
    }
  }

  const sideBlock = (name, teams) => {
    if (!teams.length) return `<div class="sheet-side"><div class="sheet-side-label"><span class="sd">${name}</span> to be decided</div></div>`;
    const joiner = teams.length > 1 ? '<span class="sd">one of</span>' : '';
    return `<div class="sheet-side"><div class="sheet-side-label"><span class="sd">${name}</span> ${joiner}</div>`
      + `<div class="sheet-teams">${teams.map(chip).join('')}</div></div>`;
  };

  const bothKnown = hTeams.length === 1 && aTeams.length === 1;

  return `<div class="sheet-grip"></div>`
    + `<div class="sheet-round">${ROUND_FULL[m.round]}</div>`
    + `<div class="sheet-title">${title}</div>`
    + `<div class="sheet-row"><span class="k">When</span><span class="v">${whenLine(m)}</span></div>`
    + `<div class="sheet-row"><span class="k">Where</span><span class="v">${m.venue || 'TBD'}</span></div>`
    + `<div class="sheet-matchup">`
    + `${bothKnown ? '' : '<div class="sheet-row"><span class="k">Possible</span><span class="v">who can reach this game</span></div>'}`
    + sideBlock('Side A', hTeams) + sideBlock('Side B', aTeams)
    + `</div>`
    + odds
    + `<div class="sheet-note">Win estimate is a rough heuristic from FIFA rankings, for fun only \u2014 not real odds.</div>`;
}

let sheetBound = false;
export function initSheet() {
  if (sheetBound) return; sheetBound = true;
  const scrim = document.getElementById('sheetScrim');
  scrim.addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
}

function openSheet(id) {
  const m = byId(id);
  if (!m) return;
  const sheet = document.getElementById('detailSheet');
  const scrim = document.getElementById('sheetScrim');
  sheet.innerHTML = sheetHTML(m);
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  scrim.classList.add('open');
}

function closeSheet() {
  const sheet = document.getElementById('detailSheet');
  const scrim = document.getElementById('sheetScrim');
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  scrim.classList.remove('open');
}
