// World Cup 2026 Bracket - shared constants + runtime state.
// This is the single source of shared mutable state; all modules import S.
export const APP_VERSION = 'v5.4';
export const BUILD_PR = 'direct'; // small style tweak committed direct to main
export const DATA_URL = './data.json';
export const CACHE_KEY = 'world-cup-bracket-data';
export const REPO_OWNER = 'mawizorek';
export const REPO_NAME = 'ClickUp_apps';
export const DATA_PATH = 'world-cup-bracket/data.json';
export const POTENTIAL_PREFIX = 'winner of';
export const ET_UTC_OFFSET = 4; // EDT = UTC-4 during the tournament (July)

// Multi-team compare palette (OKLCH, colorblind-considerate, max 4).
// Index 0 = the original mint accent so single-select looks unchanged.
export const PATH_PALETTE = [
  { name: 'mint',   line: 'oklch(75% 0.18 155)', surf: 'oklch(20% 0.05 155)' },
  { name: 'amber',  line: 'oklch(80% 0.15 75)',  surf: 'oklch(22% 0.05 75)' },
  { name: 'violet', line: 'oklch(72% 0.16 300)', surf: 'oklch(22% 0.06 300)' },
  { name: 'cyan',   line: 'oklch(78% 0.13 220)', surf: 'oklch(22% 0.05 220)' },
];
export const MAX_PICKS = PATH_PALETTE.length;

// Mutable shared store. Populated in app.js after data load.
export const S = {
  allMatches: [],
  rankings: {},
  fedBy: {},        // downstream match id -> [feeder match ids]
  picks: [],        // ordered list of selected team names (index -> palette color)
};

// Today's date (YYYY-MM-DD) in EASTERN time, computed once at load.
// Was toISOString() (UTC), which after ~8pm ET rolled the app's "today" to
// tomorrow and mislabeled next-day games as Today. en-CA gives ISO format.
export const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
