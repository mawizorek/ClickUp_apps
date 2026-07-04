// World Cup 2026 Bracket - schedule view rendering.
import { S, POTENTIAL_PREFIX, today } from './store.js';
import { cc, isComplete, winnerName, rankOf, slotLabel, pathIn, advancesToFace, kickoffDate, fmtCountdown } from './util.js';

export const periods = [
  { id: 'today', label: 'Today', filter: m => m.day === today },
  { id: 'weekend', label: 'This Week', filter: m => {
    const d = new Date(m.day); const now = new Date();
    const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + (7 - now.getDay()));
    return d >= new Date(today) && d <= weekEnd;
  }},
  { id: 'r32', label: 'R32', filter: m => m.round === 'R32' },
  { id: 'r16', label: 'R16', filter: m => m.round === 'R16' },
  { id: 'later', label: 'QF+', filter: m => ['QF', 'SF', 'Final'].includes(m.round) },
  { id: 'all', label: 'All', filter: () => true },
];

export function renderTimeNav(onSelect) {
  const nav = document.getElementById('timeNav');
  nav.innerHTML = periods.map((p, i) => {
    const count = S.allMatches.filter(p.filter).length;
    return `<button class="time-btn${i === 0 ? ' active' : ''}" data-period="${p.id}">${p.label}<span class="ct">${count}</span></button>`;
  }).join('');
  nav.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSchedule(btn.dataset.period);
      if (onSelect) onSelect();
    });
  });
}

export function renderSchedule(periodId) {
  const period = periods.find(p => p.id === periodId);
  const matches = S.allMatches.filter(period.filter);
  const container = document.getElementById('scheduleContent');
  const groups = {};
  matches.forEach(m => { (groups[m.dayLabel] = groups[m.dayLabel] || []).push(m); });

  let html = '';
  Object.entries(groups).forEach(([day, dayMatches]) => {
    const roundLabel = dayMatches[0].round;
    const isToday = dayMatches[0].day === today;
    html += `<div class="day-group"><div class="day-label">`
      + `<span class="date">${day}</span>`
      + `${isToday ? '<span class="relative">Today</span>' : ''}`
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
  const statusText = m.status === 'ft' ? 'FT' : m.status === 'aet' ? 'AET' : m.status === 'pso' ? 'PEN' : m.status === 'live' ? 'LIVE' : (m.time || 'TBD');
  const statusClass = m.status === 'upcoming' ? 'upcoming' : m.status;

  const ko = (!done && m.day === today) ? kickoffDate(m) : null;
  const chip = ko ? `<span class="countdown-chip" data-countdown="${ko.getTime()}">${fmtCountdown(ko)}</span>` : '';

  return `<div class="${classes}" data-id="${m.id}">`
    + `<div class="match-top"><span class="info">${m.venue}${chip}</span>`
    + `<span class="badge ${statusClass}">${statusText}</span></div>`
    + `${done ? summaryLine(m) : ''}`
    + `<div class="match-teams">${teamRow(m, 'home')}${teamRow(m, 'away')}`
    + `<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin:2px auto 0"><path d="M6 9l6 6 6-6"/></svg>`
    + `</div>`
    + `${m.psoNote ? `<div class="match-note">${m.psoNote}</div>` : ''}`
    + renderDrawer(m)
    + `</div>`;
}

function renderDrawer(m) {
  const done = isComplete(m);
  let rows = '';
  rows += `<div class="drawer-row"><span class="k">Venue</span><span class="v">${m.venue || 'TBD'}</span></div>`;
  if (m.time && m.time !== 'TBD') rows += `<div class="drawer-row"><span class="k">Kickoff</span><span class="v">${m.time}</span></div>`;

  if (!done) {
    const ko = kickoffDate(m);
    if (ko) rows += `<div class="drawer-row"><span class="k">Starts</span><span class="v accent" data-countdown="${ko.getTime()}">${fmtCountdown(ko)}</span></div>`;
    const pin = pathIn(m);
    if (pin) rows += `<div class="drawer-row"><span class="k">Path in</span><span class="v">${pin}</span></div>`;
  } else {
    const face = advancesToFace(m);
    const w = winnerName(m);
    if (w) rows += `<div class="drawer-row"><span class="k">Advances</span><span class="v accent">${cc(w)} \u2192 ${face || 'TBD'}</span></div>`;
    if (m.psoNote) rows += `<div class="drawer-row"><span class="k">Shootout</span><span class="v gold">${m.psoNote}</span></div>`;
  }
  return `<div class="match-drawer"><div class="drawer-inner">${rows}</div></div>`;
}

function bindCardTaps() {
  document.getElementById('scheduleContent').querySelectorAll('.match').forEach(card => {
    card.addEventListener('click', () => {
      const open = card.classList.contains('open');
      document.querySelectorAll('.match.open').forEach(c => c.classList.remove('open'));
      if (!open) card.classList.add('open');
    });
  });
}
