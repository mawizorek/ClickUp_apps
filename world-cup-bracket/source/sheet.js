// World Cup 2026 Bracket - the ONE shared detail popup. Served from both the
// schedule cards and the bracket cards; never rebuilt per-view. Bracket path
// highlight is requested via a 'trace-team' CustomEvent so this module stays
// decoupled from bracket.js (app.js orchestrates the view switch + highlight).
import {
  cc, isComplete, winnerName, rankOf, ROUND_FULL,
  slotLabel, sideTeams, advancesToFace, routeHistory,
  kickoffDate, fmtCountdown, oddsEstimate
} from './util.js';

function chip(team) {
  const r = rankOf(team);
  return `<span class="chip">${team}${r ? `<span class="rk">#${r}</span>` : ''}`
    + `<button class="chip-trace" data-trace="${team}" aria-label="Trace ${team}'s path">\u2197</button></span>`;
}

function whenLine(m) {
  const ko = kickoffDate(m);
  const timePart = (m.time && m.time !== 'TBD') ? m.time : (ko ? '' : 'Time TBD');
  const cd = ko ? ` <span class="cd" data-countdown="${ko.getTime()}">${fmtCountdown(ko)}</span>` : '';
  return `${m.dayLabel}${timePart ? ', ' + timePart : ''}${cd}`;
}

// Compact "road to here" for one team: prior-round results as small lines.
function roadBlock(team, excludeId) {
  const hist = routeHistory(team, excludeId);
  if (!hist.length) return '';
  const rows = hist.map(h => {
    const verb = h.won ? 'beat' : 'lost to';
    const cls = h.won ? 'won' : 'lost';
    const note = h.note ? ` <span class="road-note">(${h.note})</span>` : '';
    return `<div class="road-row ${cls}"><span class="road-rd">${h.round}</span>`
      + `<span class="road-res">${verb} ${h.oppCode} ${h.scoreStr}</span>${note}</div>`;
  }).join('');
  return `<div class="road-team"><div class="road-team-name">${cc(team)} \u00b7 road here</div>${rows}</div>`;
}

function sheetHTML(m) {
  const done = isComplete(m);
  const home = slotLabel(m, 'home');
  const away = slotLabel(m, 'away');
  const label = (sl) => sl.tbd ? 'TBD' : (sl.potential ? `winner of ${sl.text}` : sl.text);
  const title = `${label(home)}  vs  ${label(away)}`;

  const hTeams = sideTeams(m, 'home');
  const aTeams = sideTeams(m, 'away');
  const bothKnown = hTeams.length === 1 && aTeams.length === 1;

  let html = `<div class="sheet-grip"></div>`
    + `<div class="sheet-round">${ROUND_FULL[m.round]}</div>`
    + `<div class="sheet-title">${title}</div>`
    + `<div class="sheet-row"><span class="k">When</span><span class="v">${whenLine(m)}</span></div>`
    + `<div class="sheet-row"><span class="k">Where</span><span class="v">${m.venue || 'TBD'}</span></div>`;

  // Completed: final score + who advanced.
  if (done) {
    const w = winnerName(m);
    const ws = m.winner === 'home' ? m.hs : m.as;
    const ls = m.winner === 'home' ? m.as : m.hs;
    const noteTxt = m.psoNote ? ` (${m.psoNote})` : (m.status === 'aet' ? ' (AET)' : '');
    html += `<div class="sheet-row"><span class="k">Final</span><span class="v">${cc(w)} ${ws}-${ls}${noteTxt}</span></div>`;
    const face = advancesToFace(m);
    if (face) html += `<div class="sheet-row"><span class="k">Advances</span><span class="v accent">${cc(w)} \u2192 ${face}</span></div>`;
  }

  // Undecided: who can still reach this slot.
  if (!bothKnown) {
    const sideBlock = (name, teams) => {
      if (!teams.length) return `<div class="sheet-side"><div class="sheet-side-label"><span class="sd">${name}</span> to be decided</div></div>`;
      const joiner = teams.length > 1 ? '<span class="sd">one of</span>' : '';
      return `<div class="sheet-side"><div class="sheet-side-label"><span class="sd">${name}</span> ${joiner}</div>`
        + `<div class="sheet-teams">${teams.map(chip).join('')}</div></div>`;
    };
    html += `<div class="sheet-matchup">`
      + `<div class="sheet-row"><span class="k">Possible</span><span class="v">who can reach this game</span></div>`
      + sideBlock('Side A', hTeams) + sideBlock('Side B', aTeams) + `</div>`;
  }

  // Road to here: only concrete teams with priors. Kept compact.
  const roadTeams = [...new Set([...hTeams, ...aTeams])];
  const roads = roadTeams.map(t => roadBlock(t, m.id)).filter(Boolean).join('');
  if (roads) html += `<div class="sheet-road"><div class="road-head">Road to here</div>${roads}</div>`;

  // Win estimate: only when both sides are a single concrete team + not done.
  if (bothKnown && !done) {
    const o = oddsEstimate(hTeams[0], aTeams[0]);
    if (o) {
      html += `<div class="odds"><div class="odds-head">Win estimate <span class="odds-tag">EST</span></div>`
        + `<div class="odds-bar">`
        + `<div class="odds-seg a" style="flex:${o.a}">${cc(hTeams[0])} ${o.a}%</div>`
        + `<div class="odds-seg b" style="flex:${o.b}">${o.b}% ${cc(aTeams[0])}</div>`
        + `</div>`
        + `<div class="sheet-note">Rough heuristic from FIFA rankings, for fun \u2014 not real odds.</div></div>`;
    }
  }

  return html;
}

let bound = false;
let matchById = null;
export function initSheet(lookup) {
  matchById = lookup; // (id) => match
  if (bound) return; bound = true;
  const scrim = document.getElementById('sheetScrim');
  const sheet = document.getElementById('detailSheet');
  scrim.addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  // Trace-path arrows inside the sheet -> ask app.js to switch view + highlight.
  sheet.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-trace');
    if (!btn) return;
    e.stopPropagation();
    const team = btn.dataset.trace;
    closeSheet();
    document.dispatchEvent(new CustomEvent('trace-team', { detail: { team } }));
  });
}

export function openSheet(id) {
  const m = matchById(id);
  if (!m) return;
  const sheet = document.getElementById('detailSheet');
  const scrim = document.getElementById('sheetScrim');
  sheet.innerHTML = sheetHTML(m);
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  scrim.classList.add('open');
}

export function closeSheet() {
  const sheet = document.getElementById('detailSheet');
  const scrim = document.getElementById('sheetScrim');
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  scrim.classList.remove('open');
}
