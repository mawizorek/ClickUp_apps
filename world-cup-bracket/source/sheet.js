// World Cup 2026 Bracket - the ONE shared detail popup. Served from both the
// schedule cards and the bracket cards; never rebuilt per-view. Bracket path
// highlight is requested via a 'trace-team' CustomEvent so this module stays
// decoupled from bracket.js (app.js orchestrates the view switch + highlight).
import {
  cc, isComplete, winnerName, rankOf, ROUND_FULL,
  slotLabel, sideTeams, advancesToFace, routeHistory,
  kickoffDate, localKickoff, fmtCountdown, oddsEstimate
} from './util.js';

function chip(team) {
  const r = rankOf(team);
  return `<span class="chip">${team}${r ? `<span class="rk">#${r}</span>` : ''}`
    + `<button class="chip-trace" data-trace="${team}" aria-label="Trace ${team}'s path">\u2197</button></span>`;
}

function whenLine(m) {
  const ko = kickoffDate(m);
  // Show kickoff in the viewer's local zone with a zone label (e.g. "4:00 PM CDT").
  const local = localKickoff(m);
  const timePart = local ? local : (ko ? '' : 'Time TBD');
  const cd = ko ? ` <span class="cd" data-countdown="${ko.getTime()}">${fmtCountdown(ko)}</span>` : '';
  return `${m.dayLabel}${timePart ? ', ' + timePart : ''}${cd}`;
}

// ---- goal timeline feed ----
// FACTS-ONLY, matching the app's data contract: data carries {m:minute, p:player,
// t:'h'|'a', pen?, og?} per goal. The half-time split line + running tally are DERIVED
// here, never stored. Renders only when a match carries a goals[] array, so games
// without data (and unplayed games) show nothing. Extra-time goals fall on the
// second-half side of the single divider by design (kept tight, no ET sub-divider).
function goalBaseMinute(min) {
  return parseInt(String(min), 10) || 0; // "45+2" -> 45, "90+8" -> 90
}
function goalFeed(m) {
  if (!Array.isArray(m.goals) || !m.goals.length) return '';
  const hCode = cc(m.home), aCode = cc(m.away);
  let splitDone = false, hs = 0, as = 0;
  const rows = m.goals.map(g => {
    let pre = '';
    // half-time divider drops in before the first goal past minute 45
    if (!splitDone && goalBaseMinute(g.m) > 45) {
      splitDone = true;
      pre = `<div class="gf-ht"><span class="gf-ht-lbl">Half \u00b7 ${hCode} ${hs}-${as} ${aCode}</span><span class="gf-ht-ln"></span></div>`;
    }
    const home = g.t === 'h';
    if (home) hs++; else as++;
    const code = home ? hCode : aCode;
    const minHtml = String(g.m).replace(/\+(\d+)/, '<span class="gf-plus">+$1</span>');
    const tag = (g.pen ? '<span class="gf-tag">PEN</span>' : '') + (g.og ? '<span class="gf-tag og">OG</span>' : '');
    return pre + `<div class="gf-goal ${home ? 'home' : 'away'}">`
      + `<span class="gf-min">${minHtml}'</span>`
      + `<span class="gf-ball">\u26bd</span>`
      + `<span class="gf-player">${g.p}</span>`
      + `<span class="gf-code">${code}</span>${tag}</div>`;
  }).join('');
  return `<div class="gf"><div class="gf-head">Goals`
    + `<span class="gf-legend"><span class="gf-lg home">${hCode}</span><span class="gf-lg away">${aCode}</span></span>`
    + `</div><div class="gf-line">${rows}</div></div>`;
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
    + `<div class="sheet-round">${ROUND_FULL[m.round] || m.round}</div>`
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

  // Goal timeline (only when the match carries goal data). Sits right under the result
  // — the live meat of the match — above the collapsed Road to Here.
  html += goalFeed(m);

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

  // Road to here: only concrete teams with priors. Collapsed by default to keep the
  // sheet tight; the goal feed is the headline, the road is secondary detail on tap.
  const roadTeams = [...new Set([...hTeams, ...aTeams])];
  const roads = roadTeams.map(t => roadBlock(t, m.id)).filter(Boolean).join('');
  if (roads) {
    html += `<div class="sheet-road" data-road>`
      + `<button class="road-toggle" type="button" aria-expanded="false">`
      + `<span class="road-head">Road to here</span>`
      + `<span class="road-chev" aria-hidden="true">\u25be</span></button>`
      + `<div class="road-body"><div class="road-inner">${roads}</div></div></div>`;
  }

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
  sheet.addEventListener('click', (e) => {
    // Collapse toggle for Road to here (delegated; sheet re-renders each open).
    const rt = e.target.closest('.road-toggle');
    if (rt) {
      const wrap = rt.closest('[data-road]');
      const open = wrap.classList.toggle('open');
      rt.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    // Trace-path arrows inside the sheet -> ask app.js to switch view + highlight.
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
  sheet.scrollTop = 0;
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
