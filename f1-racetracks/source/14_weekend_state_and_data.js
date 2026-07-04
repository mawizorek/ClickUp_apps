/* Permanent weekend-surface state and seeded data.
   Replaces the oversized rescue bucket with named ownership lines:
   shared state, schedule seeds, replay seeds, and live-feed helpers.
 */

const BUILD_LABEL = 'V1.7e split';
const HOME_ID = 'current-round-card';
const CENTER_ID = 'weekend-center';
const WEEKEND_SURFACE_STYLE_ID = 'pp-weekend-surface-style';
const LIVE_REFRESH_MS = 20000;

const replayTimers = {};
const viewState = {};

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
  mexico: ['mexico city', 'hermanos rodriguez', 'mexico'],
  interlagos: ['interlagos', 'sao paulo', 'sao paulo gp'],
  'las-vegas': ['las vegas'],
  losail: ['losail', 'qatar'],
  'yas-marina': ['yas marina', 'abu dhabi']
};

const SCHEDULE_SEEDS = {
  silverstone: [
    {
      label: 'Fri Jul 3',
      items: [
        { day: 'Fri', series: 'F1', label: 'Practice 1', start: '2026-07-03T12:30:00+01:00', end: '2026-07-03T13:30:00+01:00' },
        { day: 'Fri', series: 'F1', label: 'Sprint Qualifying', start: '2026-07-03T16:30:00+01:00', end: '2026-07-03T17:14:00+01:00' }
      ]
    },
    {
      label: 'Sat Jul 4',
      items: [
        { day: 'Sat', series: 'F1', label: 'Sprint', start: '2026-07-04T12:00:00+01:00', end: '2026-07-04T13:00:00+01:00' },
        { day: 'Sat', series: 'F1', label: 'Qualifying', start: '2026-07-04T16:00:00+01:00', end: '2026-07-04T17:00:00+01:00' }
      ]
    },
    {
      label: 'Sun Jul 5',
      items: [
        { day: 'Sun', series: 'F1', label: 'Grand Prix', start: '2026-07-05T15:00:00+01:00', end: '2026-07-05T17:00:00+01:00' }
      ]
    }
  ]
};

const REPLAY_DATA = {
  'albert-park': {
    title: 'Australian GP replay',
    subtitle: 'Russell converts the opener into a Mercedes 1–2.',
    beats: [
      { phase: 'Launch', lap: 'Lap 1 / 58', clock: 'Lights out', order: ['RUS', 'PIA', 'HAM', 'NOR', 'VER'], feed: ['Russell nails the start from pole.', 'Piastri locks down P2 through Turn 3.'] },
      { phase: 'Pit phase', lap: 'Lap 30 / 58', clock: '00:41:10', order: ['RUS', 'VER', 'NOR', 'LEC', 'ANT'], feed: ['Undercut windows open across the top five.', 'Antonelli gains clean air in the second phase.'] },
      { phase: 'Finish', lap: 'Chequered flag', clock: '01:27:12', order: ['RUS', 'ANT', 'LEC', 'VER', 'NOR'], feed: ['Mercedes opens 2026 with a 1–2.', 'Russell wins the season opener.'] }
    ]
  },
  shanghai: {
    title: 'Chinese GP replay',
    subtitle: 'Antonelli controls the Shanghai weekend end to end.',
    beats: [
      { phase: 'Launch', lap: 'Lap 1 / 56', clock: 'Lights out', order: ['ANT', 'RUS', 'HAM', 'LEC', 'PIA'], feed: ['Antonelli launches cleanly from pole.', 'Hamilton holds the inside into the spiral.'] },
      { phase: 'Strategy', lap: 'Lap 28 / 56', clock: '00:46:18', order: ['RUS', 'ANT', 'HAM', 'LEC', 'PIA'], feed: ['Russell briefly leads on the stop phase.', 'Antonelli retakes effective control on fresher tyres.'] },
      { phase: 'Finish', lap: 'Chequered flag', clock: '01:29:04', order: ['ANT', 'RUS', 'HAM', 'LEC', 'PIA'], feed: ['Antonelli wins in Shanghai.', 'Mercedes completes another 1–2.'] }
    ]
  },
  suzuka: {
    title: 'Japanese GP replay',
    subtitle: 'Clean air and precision define Suzuka.',
    beats: [
      { phase: 'Launch', lap: 'Lap 1 / 53', clock: 'Lights out', order: ['ANT', 'RUS', 'PIA', 'LEC', 'NOR'], feed: ['Antonelli controls the launch from pole.', 'Suzuka stays orderly through the Esses.'] },
      { phase: 'Middle stint', lap: 'Lap 30 / 53', clock: '00:51:06', order: ['ANT', 'PIA', 'LEC', 'RUS', 'NOR'], feed: ['Antonelli keeps control through the undercut window.', 'Leclerc jumps into podium contention.'] },
      { phase: 'Finish', lap: 'Chequered flag', clock: '01:28:58', order: ['ANT', 'PIA', 'LEC', 'RUS', 'NOR'], feed: ['Antonelli takes his first F1 win.', 'Suzuka rewards precision over chaos.'] }
    ]
  },
  miami: {
    title: 'Miami GP replay',
    subtitle: 'A compressed field, a sharp restart, and Antonelli again.',
    beats: [
      { phase: 'Launch', lap: 'Lap 1 / 57', clock: 'Lights out', order: ['ANT', 'VER', 'LEC', 'NOR', 'PIA'], feed: ['Antonelli leads into Turn 1.', 'Verstappen stays glued on the opening run.'] },
      { phase: 'Safety Car', lap: 'Lap 41 / 57', clock: '01:05:08', order: ['ANT', 'NOR', 'PIA', 'LEC', 'VER'], feed: ['The field compresses under Safety Car.', 'Antonelli wins the restart rhythm into Turn 1.'] },
      { phase: 'Finish', lap: 'Chequered flag', clock: '01:28:41', order: ['ANT', 'NOR', 'PIA', 'LEC', 'VER'], feed: ['Antonelli wins in Miami.', 'McLaren pressure shapes the final stint.'] }
    ]
  },
  'gilles-villeneuve': {
    title: 'Canadian GP replay',
    subtitle: 'Montreal slips into a strategic street fight.',
    beats: [
      { phase: 'Launch', lap: 'Lap 1 / 70', clock: 'Lights out', order: ['RUS', 'ANT', 'HAM', 'VER', 'LEC'], feed: ['Russell launches from pole.', 'Antonelli stays tight into Virage Senna.'] },
      { phase: 'Pit phase', lap: 'Lap 32 / 70', clock: '00:48:42', order: ['ANT', 'RUS', 'HAM', 'VER', 'LEC'], feed: ['Antonelli flips the order through the stop phase.', 'Montreal strategy swings on clean-air timing.'] },
      { phase: 'Finish', lap: 'Chequered flag', clock: '01:33:44', order: ['ANT', 'HAM', 'VER', 'RUS', 'LEC'], feed: ['Antonelli wins in Montreal.', 'Hamilton and Verstappen round out the podium.'] }
    ]
  }
};

function esc(value) {
  return String(value ?? '').replace(/[&<>]/g, function (char) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char];
  });
}

function mapState() {
  if (typeof bySlug !== 'undefined' && bySlug) return bySlug;
  if (window.bySlug) return window.bySlug;
  return {};
}

function tracksState() {
  if (typeof TRACKS !== 'undefined' && Array.isArray(TRACKS)) return TRACKS;
  if (Array.isArray(window.TRACKS)) return window.TRACKS;
  return [];
}

function metaState() {
  if (typeof appDataMeta !== 'undefined' && appDataMeta) return appDataMeta;
  if (window.appDataMeta) return window.appDataMeta;
  return {};
}

function currentSlug() {
  return (location.hash.replace(/^#\/?/, '') || '').trim();
}

function readCurrentTrack() {
  const map = mapState();
  const meta = metaState();
  const tracks = tracksState();
  return (meta.current_round_slug && map[meta.current_round_slug])
    || tracks.find(function (track) { return track.status === 'active'; })
    || tracks.find(function (track) { return track.report; })
    || null;
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function localTime(dateString) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(dateString));
}

function localDay(dateString) {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(dateString));
}

function sessionStatus(start, end) {
  const now = Date.now();
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (now >= endMs) return 'done';
  if (now >= startMs && now < endMs) return 'live';
  return 'upcoming';
}

function latestByDriver(rows) {
  const map = new Map();
  (rows || []).forEach(function (row) {
    const key = row.driver_number;
    if (!map.has(key) || String(row.date || '') > String(map.get(key).date || '')) map.set(key, row);
  });
  return map;
}

function classifySessionState(session) {
  const now = Date.now();
  const start = session && session.date_start ? new Date(session.date_start).getTime() : null;
  const end = session && session.date_end ? new Date(session.date_end).getTime() : null;
  if (!session || !start) return 'awaiting';
  if (start > now) return 'awaiting';
  if (!end || end >= now) return 'live';
  return (now - end) / 36e5 <= 48 ? 'replay' : 'awaiting';
}

function matchLiveCircuitSlug(session) {
  const haystack = [session && session.circuit_short_name, session && session.meeting_name, session && session.country_name].map(normalize).join(' ');
  return Object.keys(LIVE_CIRCUIT_ALIASES).find(function (slug) {
    return LIVE_CIRCUIT_ALIASES[slug].some(function (alias) {
      return haystack.includes(normalize(alias));
    });
  }) || null;
}

function fetchWeekendJson(url) {
  return fetch(url, { cache: 'no-store' }).then(function (response) {
    if (!response.ok) throw new Error('Feed unavailable');
    return response.json();
  });
}

function liveInterval(intervalRow, position) {
  if (position === 1) return 'Leader';
  if (!intervalRow) return '—';
  if (typeof intervalRow.interval === 'string') return intervalRow.interval;
  if (typeof intervalRow.interval === 'number') return '+' + intervalRow.interval.toFixed(3);
  if (typeof intervalRow.gap_to_leader === 'number') return '+' + intervalRow.gap_to_leader.toFixed(3);
  return intervalRow.gap_to_leader || '—';
}

function replayState(slug) {
  if (!viewState[slug]) viewState[slug] = { mode: '', beat: 0, speed: 1 };
  return viewState[slug];
}

function clearReplay(slug) {
  if (replayTimers[slug]) {
    window.clearInterval(replayTimers[slug]);
    delete replayTimers[slug];
  }
}

function buildSchedule(track) {
  if (SCHEDULE_SEEDS[track.slug]) {
    return SCHEDULE_SEEDS[track.slug].map(function (group) {
      return {
        label: group.label,
        items: group.items.map(function (item) {
          return {
            day: item.day,
            series: item.series,
            label: item.label,
            range: localTime(item.start) + '–' + localTime(item.end),
            status: sessionStatus(item.start, item.end),
            start: item.start,
            end: item.end
          };
        })
      };
    });
  }

  return (Array.isArray(track.sessions) ? track.sessions : []).map(function (entry) {
    const parts = String(entry.sess || '').split('·').map(function (item) { return item.trim(); }).filter(Boolean);
    return {
      label: entry.date,
      items: [{
        day: entry.date,
        series: 'F1',
        label: parts[parts.length - 1] || 'Weekend session',
        range: 'Time TBC',
        status: track.status === 'done' ? 'done' : track.status === 'active' ? 'live' : 'upcoming'
      }]
    };
  });
}

function flattenScheduleItems(groups) {
  return (groups || []).reduce(function (acc, group) {
    return acc.concat(group.items || []);
  }, []);
}

function scheduleSummary(track) {
  const flat = flattenScheduleItems(buildSchedule(track));
  return {
    liveNow: flat.find(function (item) { return item.status === 'live'; }) || null,
    nextUp: flat.find(function (item) { return item.status === 'upcoming'; }) || null,
    grandPrix: flat.find(function (item) { return /Grand Prix/i.test(item.label); }) || null
  };
}

function homeScheduleRows(track) {
  return flattenScheduleItems(buildSchedule(track)).filter(function (item) {
    return item.status !== 'done';
  });
}
