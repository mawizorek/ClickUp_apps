// Persistence. Local-only by default (localStorage); if a Worker URL is set in Settings,
// reads/writes go to the D1-backed Worker instead. Writes carry the write-key header.
// Same method surface either way, so the UI never branches on backend.

import { SEED_SCHEMAS, SEED_PROFILES } from './seed.js';

const LS = {
  schemas: 'rn.schemas', profiles: 'rn.profiles', runs: 'rn.runs',
  worker: 'rn.workerUrl', key: 'rn.writeKey', theme: 'rn.theme',
};

export const cfg = {
  workerUrl: () => localStorage.getItem(LS.worker) || '',
  writeKey: () => localStorage.getItem(LS.key) || '',
  theme: () => localStorage.getItem(LS.theme) || 'dark',
  setWorker: (v) => localStorage.setItem(LS.worker, v || ''),
  setKey: (v) => localStorage.setItem(LS.key, v || ''),
  setTheme: (v) => localStorage.setItem(LS.theme, v),
};

function lsGet(k, fallback) {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback; }
  catch { return fallback; }
}
function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

function seedIfEmpty() {
  if (lsGet(LS.schemas, null) == null) lsSet(LS.schemas, SEED_SCHEMAS);
  if (lsGet(LS.profiles, null) == null) lsSet(LS.profiles, SEED_PROFILES);
  if (lsGet(LS.runs, null) == null) lsSet(LS.runs, []);
}

async function api(path, method = 'GET', body) {
  const base = cfg.workerUrl().replace(/\/$/, '');
  const headers = { 'Content-Type': 'application/json' };
  if (method !== 'GET') headers['X-Write-Key'] = cfg.writeKey();
  const res = await fetch(`${base}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`Worker ${res.status}`);
  return res.status === 204 ? null : res.json();
}

const usingWorker = () => !!cfg.workerUrl();

export const store = {
  async schemas() {
    if (usingWorker()) return api('/schemas');
    seedIfEmpty(); return lsGet(LS.schemas, []);
  },
  async profiles() {
    if (usingWorker()) return api('/profiles');
    seedIfEmpty(); return lsGet(LS.profiles, []);
  },
  async saveProfile(p) {
    if (usingWorker()) return api('/profiles', 'POST', p);
    const all = lsGet(LS.profiles, []);
    const i = all.findIndex((x) => x.profile_id === p.profile_id);
    if (i >= 0) all[i] = p; else all.push(p);
    lsSet(LS.profiles, all); return p;
  },
  async deleteProfile(id) {
    if (usingWorker()) return api('/profiles/' + encodeURIComponent(id), 'DELETE');
    lsSet(LS.profiles, lsGet(LS.profiles, []).filter((x) => x.profile_id !== id));
  },
  async saveSchema(s) {
    if (usingWorker()) return api('/schemas', 'POST', s);
    const all = lsGet(LS.schemas, []);
    const i = all.findIndex((x) => x.schema_id === s.schema_id);
    if (i >= 0) all[i] = s; else all.push(s);
    lsSet(LS.schemas, all); return s;
  },
  async logRun(r) {
    if (usingWorker()) { try { await api('/runs', 'POST', r); } catch (e) { /* non-fatal */ } return; }
    const all = lsGet(LS.runs, []); all.unshift(r); lsSet(LS.runs, all.slice(0, 200));
  },
  async runs() {
    if (usingWorker()) return api('/runs');
    seedIfEmpty(); return lsGet(LS.runs, []);
  },
};
