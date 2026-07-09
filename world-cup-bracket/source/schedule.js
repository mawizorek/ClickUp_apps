// World Cup 2026 Bracket - schedule view rendering.
// Landing = Agenda (full chronological list of upcoming games). The pill row is
// a SWAPPING filter (one active at a time, each renders a different card set) --
// not additive. Agenda is the home/reset the others bootstrap back to.
import { S, POTENTIAL_PREFIX, today } from './store.js';
import { cc, isComplete, winnerName, rankOf, slotLabel, kickoffDate, localKickoff, fmtCountdown, ROUND_FULL } from './util.js';
import { openSheet } from './sheet.js';

// Soonest day (>= today, ET) with an unplayed match -- the "next running game".
function nextMatchDay() {
  const days = S.allMatches
    .filter(m => !isComplete(m) && m.day >= today)
    .map(m => m.day)
    .sort();
  return days.length ? days[0] : today;
}

function relLabel(day) {
  const d0 = new Date(today + 'T00:00:00');
  const d = new Date(day + 'T00:00:00');
  const diff = Math.round((d - d0) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return null;
}

// SWAPPING filters. `home:true` marks the full-agenda reset button.
// Agenda = every not-yet-played match, chronological. It's the default + the
// view every other filter bootstraps back to.
export const periods = [
  { id: 'agenda', label: 'Agenda', home: true, filter: m => !isComplete(m) },
  { id: 'next', label: 'Next up', filter: m => m.day === nextMatchDay() },
  { id: 'weekend', label: 'This Week', filter: m => {
    const d = new Date(m.day); const now = new Date();
    const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + (7 - now.getDay()));
    return d >= new Date(today) && d <= weekEnd;
  }},
  { id: 'r32', label: 'R32', filter: m => m.round === 'R32' },
  { id: 'r16', label: 'R16', filter: m => m.round === 'R16' },
  { id: 'later', label: 'QF+', filter: m => ['QF', 'SF', '3P', 'Final'].includes(m.round) },
  { id: 'all', label: 'All', filter: () => true },
];

export const DEFAULT_PERIOD = 'agenda';

export function renderTimeNav() {
  const nav = document.getElementById('timeNav');
  nav.innerHTML = periods.map((p) => {
    const count = S.allMatches.filter(p.filter).length;
    const active = p.id === DEFAULT_PERIOD ? ' active' : '';
    const home = p.home ? ' is-home' : '';
    return `<button class="time-btn${active}${home}" data-period="${p.id}">${p.label}<span class="ct">${count}</span></button>`;
  }).join('');
  nav.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSchedule(btn.dataset.period);
    });
  });
}

export function renderSchedule(periodId) {
  const period = periods.find(p => p.id === periodId) || periods[0];
  // Chronological always: sort by day, then kickoff time, before grouping.
  const matches = S.allMatches.filter(period.filter).slice().sort((a, b) => {
    if (a.day !== b.day) return a.day < b.day ? -1 : 1;
    const ka = kickoffDate(a), kb = kickoffDate(b);
    return (ka ? ka.getTime() : 0) - (kb ? kb.getTime() : 0);
  });
  const container = document.getElementById('scheduleContent');
  const groups = {};
  matches.forEach(m => { (groups[m.dayLabel] = groups[m.dayLabel] || []).push(m); });

  let html = '';
  Object.entries(groups).forEach(([day, dayMatches]) => {
    const roundLabel = ROUND_FULL[dayMatches[0].round] || dayMatches[0].round;
    const rel = relLabel(dayMatches[0].day);
    html += `<div class="day-group"><div class="day-label">`
      + `<span class="date">${day}</span>`
      + `${rel ? `<span class="relative">${rel}</span>` : ''}`
      + `<span class="round-tag">${roundLabel}</span></div>`
      + `<div class="day-matches">${dayMatches.map(renderMatchCard).join('')}</div></div>`;
  });
  if (!html) html = '<div class="loading-msg">No matches in this window.</div>';
  container.innerHTML = html;
  bindCardTaps();
}

function teamRow(m, side) {
  const done = isComplete(m);
  const isW = m.winner === side;
  const isL = done && m.winner && m.winner !== side;
  const sl = slotLabel(m, side);
  const score = m[side === 'home' ? 'hs' : 'as'];
  const nameHtml = sl.potential
    ? `<span class="t-name potential"><span class="pfx">${POTENTIAL_PREFIX}</span>${sl.text}</span>`
    : `<span class="t-name">${sl.text}</span>`;
  let right = '';
  if (done && score !== null && score !== undefined) {
    right = `<span class="t-score">${score}</span>`;
  } else if (!done && !sl.potential && !sl.tbd) {
    const r = rankOf(sl.text);
    if (r) right = `<span class="t-rank">#${r}</span>`;
  }
  return `<div class="team ${isW ? 'w' : ''} ${isL ? 'l' : ''}">`
    + `<span class="t-code">${sl.code || '\u2014'}</span>` + nameHtml + right + `</div>`;
}

function summaryLine(m) {
  const w = winnerName(m);
  const loserSide = m.winner === 'home' ? 'away' : 'home';
  const l = m[loserSide];
  const ws = m[m.winner === 'home' ? 'hs' : 'as'];
  const ls = m[loserSide === 'home' ? 'hs' : 'as'];
  const note = m.psoNote ? `<span class="ms-note">${m.psoNote}</span>` : '';
  return `<div class="match-summary">`
    + `<span class="ms-winner">${w}</span>`
    + `<span class="ms-score">${ws}-${ls}</span>`
    + `<span class="ms-loser">${l}</span>${note}`
    + `<svg class="chevron ms-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`
    + `</div>`;
}

function renderMatchCard(m) {
  const done = isComplete(m);
  const classes = ['match', done ? 'completed' : '', m.status === 'live' ? 'is-live' : '', m.tbd ? 'tbd' : ''].filter(Boolean).join(' ');
  // Upcoming shows kickoff in the VIEWER'S local zone (e.g. "4:00 PM CDT"); done/live use their badge.
  const statusText = m.status === 'ft' ? 'FT' : m.status === 'aet' ? 'AET' : m.status === 'pso' ? 'PEN' : m.status === 'live' ? 'LIVE' : (localKickoff(m) || 'TBD');
  const statusClass = m.status === 'upcoming' ? 'upcoming' : m.status;

  const ko = (!done && m.day === today) ? kickoffDate(m) : null;
  const chip = ko ? `<span class="countdown-chip" data-countdown="${ko.getTime()}">${fmtCountdown(ko)}</span>` : '';

  return `<div class="${classes}" data-id="${m.id}" role="button" tabindex="0">`
    + `<div class="match-top"><span class="info">${m.venue}${chip}</span>`
    + `<span class="badge ${statusClass}">${statusText}</span></div>`
    + `${done ? summaryLine(m) : `<div class="match-teams">${teamRow(m, 'home')}${teamRow(m, 'away')}`
    + `<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin:2px auto 0"><path d="M6 9l6 6 6-6"/></svg></div>`}`
    + `${m.psoNote && done ? `<div class="match-note">${m.psoNote}</div>` : ''}`
    + `</div>`;
}

function bindCardTaps() {
  document.getElementById('scheduleContent').querySelectorAll('.match').forEach(card => {
    const id = +card.dataset.id;
    card.addEventListener('click', () => openSheet(id));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openSheet(id); });
  });
}
