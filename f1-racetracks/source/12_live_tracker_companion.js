/* Live tracker companion source (v6 slice)
   Purpose: keep the first OpenF1 integration isolated from the main runtime
   while the main source scaffold is brought back into sync with the shipped v5 app.

   This file is the editable source surface for `../live-tracker.html` logic.
   It intentionally mirrors the companion page rather than the main `index.html` runtime.
*/

const LIVE_REFRESH_MS = 20000;

const LIVE_CIRCUIT_ALIASES = {
  'albert-park': ['albert park', 'melbourne'],
  shanghai: ['shanghai'],
  suzuka: ['suzuka'],
  miami: ['miami'],
  'gilles-villeneuve': ['gilles villeneuve', 'montreal', 'canada'],
  monaco: ['monaco'],
  catalunya: ['barcelona', 'catalunya', 'circuit de barcelona-catalunya', 'spanish gp'],
  'red-bull-ring': ['red bull ring', 'spielberg', 'austrian gp'],
  silverstone: ['silverstone', 'british gp'],
  spa: ['spa', 'spa-francorchamps', 'circuit de spa-francorchamps', 'belgian gp'],
  hungaroring: ['hungaroring', 'hungary', 'hungarian gp'],
  zandvoort: ['zandvoort', 'dutch gp'],
  monza: ['monza', 'italian gp'],
  madring: ['madring', 'madrid'],
  baku: ['baku', 'azerbaijan'],
  'marina-bay': ['marina bay', 'singapore'],
  cota: ['cota', 'circuit of the americas', 'united states'],
  mexico: ['mexico city', 'hermanos rodriguez', 'méxico'],
  interlagos: ['interlagos', 'sao paulo', 'são paulo'],
  'las-vegas': ['las vegas'],
  losail: ['losail', 'qatar'],
  'yas-marina': ['yas marina', 'abu dhabi']
};

function liveNormalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function classifyLiveSessionState(session) {
  const now = Date.now();
  const start = session?.date_start ? new Date(session.date_start).getTime() : null;
  const end = session?.date_end ? new Date(session.date_end).getTime() : null;

  if (!session || !start) return 'idle';
  if (start > now) return 'awaiting';
  if (!end || end >= now) return 'live';

  const hoursSinceEnd = (now - end) / 36e5;
  return hoursSinceEnd <= 48 ? 'replay' : 'idle';
}

function matchLiveCircuitSlug(session) {
  const haystack = [session?.circuit_short_name, session?.meeting_name, session?.country_name]
    .map(liveNormalize)
    .join(' ');

  for (const [slug, aliases] of Object.entries(LIVE_CIRCUIT_ALIASES)) {
    if (aliases.some(alias => haystack.includes(liveNormalize(alias)))) return slug;
  }

  return null;
}

async function fetchLiveJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function latestLiveByDriver(rows) {
  const map = new Map();
  for (const row of rows || []) {
    const key = row.driver_number;
    if (!map.has(key) || String(row.date || '') > String(map.get(key).date || '')) {
      map.set(key, row);
    }
  }
  return map;
}

function formatLiveInterval(interval, gapToLeader, position) {
  if (position === 1) return 'Leader';
  if (interval == null && gapToLeader == null) return '—';
  if (typeof interval === 'string') return interval;
  if (typeof interval === 'number') return `+${interval.toFixed(3)}`;
  if (typeof gapToLeader === 'number') return `+${gapToLeader.toFixed(3)}`;
  return gapToLeader || '—';
}
