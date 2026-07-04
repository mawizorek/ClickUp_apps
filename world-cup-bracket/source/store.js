// World Cup 2026 Bracket - shared constants + runtime state.
// This is the single source of shared mutable state; all modules import S.
export const APP_VERSION = 'v4.2';
export const BUILD_PR = 'PR#27'; // updated to the merged PR before ship; shown in footer
export const DATA_URL = './data.json';
export const CACHE_KEY = 'world-cup-bracket-data';
export const REPO_OWNER = 'mawizorek';
export const REPO_NAME = 'ClickUp_apps';
export const DATA_PATH = 'world-cup-bracket/data.json';
export const POTENTIAL_PREFIX = 'winner of';
export const ET_UTC_OFFSET = 4; // EDT = UTC-4 during the tournament (July)

// Mutable shared store. Populated in app.js after data load.
export const S = {
  allMatches: [],
  rankings: {},
  fedBy: {},        // downstream match id -> [feeder match ids]
  pickedTeam: null, // active bracket path-highlight team
};

// Today's date (YYYY-MM-DD), computed once at load. Runtime, not hardcoded.
export const today = new Date().toISOString().slice(0, 10);
