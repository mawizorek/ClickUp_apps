// World Cup 2026 Bracket - pure helpers + bracket resolvers + odds heuristic.
import { S, ET_UTC_OFFSET } from './store.js';

const CODES = {
  'Canada':'CAN','South Africa':'RSA','Brazil':'BRA','Japan':'JPN','Germany':'GER',
  'Paraguay':'PAR','Netherlands':'NED','Morocco':'MAR','France':'FRA','Sweden':'SWE',
  'Ivory Coast':'CIV','Norway':'NOR','Mexico':'MEX','Ecuador':'ECU','England':'ENG',
  'DR Congo':'COD','Belgium':'BEL','Senegal':'SEN','USA':'USA','Bosnia-Herz.':'BIH',
  'Spain':'ESP','Austria':'AUT','Portugal':'POR','Croatia':'CRO','Switzerland':'SUI',
  'Algeria':'ALG','Argentina':'ARG','Cape Verde':'CPV','Australia':'AUS','Egypt':'EGY',
  'Colombia':'COL','Ghana':'GHA','TBD':'\u2014'
};
export const cc = (n) => CODES[n] || (n ? n.substring(0, 3).toUpperCase() : '\u2014');

export const ROUND_ORDER = ['R32', 'R16', 'QF', 'SF', 'Final'];
// Both the legacy '3P' shorthand and the '3rd Place' label the data now carries map
// to the same display string — otherwise the sheet round label reads "UNDEFINED".
export const ROUND_FULL = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarterfinal', SF: 'Semifinal', '3P': '3rd Place', '3rd Place': '3rd Place', Final: 'Final' };

export const isComplete = (m) => ['ft', 'aet', 'pso'].includes(m.status);
export const winnerName = (m) => m.winner === 'home' ? m.home : m.winner === 'away' ? m.away : null;
export const rankOf = (name) => (name && S.rankings[name]) ? S.rankings[name] : null;
export const byId = (id) => S.allMatches.find(x => x.id === id);

// ---- status derivation (THE APP OWNS STATUS; data carries only facts) ----
// The refresh job (Routine Ricky) writes FACTS only: teams, scores (hs/as, null until
// played), psoNote (shootouts), aet:true (extra time), day + time (ET), venue, feedsTo.
// It NEVER writes a status string. The app derives upcoming/live/done here so the
// schedule stays real-time and off-contract values (e.g. "scheduled") can't reach render.
// LIVE_WINDOW_MS = how long after kickoff a match reads as live before it needs a score.
const LIVE_WINDOW_MS = 2.5 * 3600000;

export function scoresIn(m) {
  return m.hs !== null && m.hs !== undefined && m.as !== null && m.as !== undefined;
}

export function deriveStatus(m) {
  if (scoresIn(m)) {
    if (m.psoNote) return 'pso';   // decided on penalties
    if (m.aet) return 'aet';       // decided in extra time
    return 'ft';                   // regulation full-time
  }
  const ko = kickoffDate(m);
  if (ko) {
    const elapsed = Date.now() - ko.getTime();
    if (elapsed >= 0 && elapsed < LIVE_WINDOW_MS) return 'live';
  }
  return 'upcoming';
}

// Winner is a RESULT fact Ricky writes; this only backfills it when scores are decisive
// and winner was omitted, so a draw-then-pens (winner explicit) is never clobbered.
export function deriveWinner(m) {
  if (m.winner === 'home' || m.winner === 'away') return m.winner;
  if (!scoresIn(m)) return null;
  if (m.hs > m.as) return 'home';
  if (m.as > m.hs) return 'away';
  return null; // level score with no explicit winner => undecided (pens not yet recorded)
}

// Normalize raw data to the canonical runtime shape ONCE at load. Single boundary that
// absorbs refresh-side drift (missing/undefined scores, absent tbd/winner, any stray
// status) so every downstream module sees only the canonical shape.
export function normalizeMatches(matches) {
  return (matches || []).map(m => {
    const norm = Object.assign({}, m);
    norm.hs = (m.hs === undefined) ? null : m.hs;
    norm.as = (m.as === undefined) ? null : m.as;
    norm.winner = deriveWinner(norm);
    norm.status = deriveStatus(norm);
    const homeUnknown = !norm.home || norm.home === 'TBD';
    const awayUnknown = !norm.away || norm.away === 'TBD';
    norm.tbd = homeUnknown && awayUnknown;
    return norm;
  });
}

export function buildFedBy() {
  const f = S.fedBy;
  Object.keys(f).forEach(k => delete f[k]);
  S.allMatches.forEach(m => { if (m.feedsTo) (f[m.feedsTo] = f[m.feedsTo] || []).push(m.id); });
}

// Resolve one slot to a display label. Depth-1 only, never recurse.
export function slotLabel(match, side) {
  const name = match[side];
  if (name && name !== 'TBD') return { text: name, code: cc(name), potential: false };
  const feeders = S.fedBy[match.id] || [];
  const fm = byId(side === 'home' ? feeders[0] : feeders[1]);
  if (!fm) return { text: 'TBD', code: '\u2014', potential: false, tbd: true };
  if (isComplete(fm)) { const w = winnerName(fm); return { text: w, code: cc(w), potential: false }; }
  if (fm.home === 'TBD' || fm.away === 'TBD') return { text: 'TBD', code: '\u2014', potential: false, tbd: true };
  return { text: `${cc(fm.home)}/${cc(fm.away)}`, code: '', potential: true };
}

// The two feeder matchups into a match (schedule drawer "Path in").
export function pathIn(m) {
  const feeders = (S.fedBy[m.id] || []).map(byId).filter(Boolean);
  if (!feeders.length) return null;
  return feeders.map(fm => (fm.home === 'TBD' || fm.away === 'TBD') ? 'TBD' : `${cc(fm.home)} v ${cc(fm.away)}`).join('  \u00b7  ');
}

// Who the winner of a completed match goes on to face.
export function advancesToFace(m) {
  if (!m.feedsTo) return null;
  const dm = byId(m.feedsTo);
  if (!dm) return null;
  const otherId = (S.fedBy[dm.id] || []).find(id => id !== m.id);
  const of = byId(otherId);
  if (!of) return 'TBD';
  if (isComplete(of)) return winnerName(of);
  if (of.home !== 'TBD' && of.away !== 'TBD') return `${cc(of.home)}/${cc(of.away)} winner`;
  return 'TBD';
}

// Concrete teams that could occupy one side of a (possibly future) match.
export function sideTeams(m, side) {
  const name = m[side];
  if (name && name !== 'TBD') return [name];
  const feeders = S.fedBy[m.id] || [];
  const fm = byId(side === 'home' ? feeders[0] : feeders[1]);
  if (!fm) return [];
  if (isComplete(fm)) { const w = winnerName(fm); return w ? [w] : []; }
  const out = [];
  if (fm.home && fm.home !== 'TBD') out.push(fm.home);
  if (fm.away && fm.away !== 'TBD') out.push(fm.away);
  return out;
}

// Road to here: a team's prior COMPLETED matches, earliest round first.
// Excludes the match passed in (that's "this game", not history). Returns
// [{ round, oppCode, scoreStr, won, note }]. Empty if no priors (e.g. R32).
export function routeHistory(team, excludeId) {
  const played = S.allMatches.filter(m =>
    isComplete(m) && m.id !== excludeId && (m.home === team || m.away === team));
  played.sort((a, b) => ROUND_ORDER.indexOf(a.round) - ROUND_ORDER.indexOf(b.round));
  return played.map(m => {
    const isHome = m.home === team;
    const opp = isHome ? m.away : m.home;
    const ts = isHome ? m.hs : m.as;
    const os = isHome ? m.as : m.hs;
    return {
      round: m.round,
      oppCode: cc(opp),
      scoreStr: `${ts}-${os}`,
      won: winnerName(m) === team,
      note: m.psoNote || ''
    };
  });
}

// ---- kickoff time + countdown ----
// data.json `time` is authored in US Eastern (ET); the whole tournament (Jun-Jul 2026)
// runs on EDT = UTC-4. kickoffDate returns the true UTC instant of kickoff.
export function kickoffDate(m) {
  if (!m.time || m.time === 'TBD') return null;
  const t = m.time.replace(/\s*ET$/i, '').trim();
  const mt = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!mt) return null;
  let h = +mt[1]; const min = +mt[2]; const ap = mt[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  const [Y, Mo, D] = m.day.split('-').map(Number);
  return new Date(Date.UTC(Y, Mo - 1, D, h + ET_UTC_OFFSET, min));
}

// Kickoff rendered in the VIEWER'S local timezone, with a short zone label so it's
// unambiguous (e.g. "4:00 PM CDT" for a Central viewer, "9:00 PM BST" in the UK).
// Built from the true UTC instant (kickoffDate), so the browser handles the conversion.
// Returns null when there's no set time (caller falls back to 'TBD').
export function localKickoff(m) {
  const ko = kickoffDate(m);
  if (!ko) return null;
  return ko.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' });
}

export function fmtCountdown(target) {
  let diff = target - new Date();
  if (diff <= 0) return 'kicked off';
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const mi = Math.floor(diff / 60000);
  if (d > 0) return `in ${d}d ${h}h`;
  if (h > 0) return `in ${h}h ${mi}m`;
  return `in ${mi}m`;
}

// ---- odds estimate (heuristic, NOT real betting odds) ----
export function oddsEstimate(a, b) {
  const ra = rankOf(a), rb = rankOf(b);
  if (!ra || !rb) return null;
  const rate = (r) => 1500 - Math.log2(r) * 140;
  const ea = rate(ra), eb = rate(rb);
  const pa = 1 / (1 + Math.pow(10, (eb - ea) / 400));
  let a1 = Math.round(pa * 100);
  a1 = Math.max(8, Math.min(92, a1));
  return { a: a1, b: 100 - a1 };
}
