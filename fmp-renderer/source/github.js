// github.js: the ONLY file that talks to GitHub.
//
// Two API calls per load (latest commit, then its tree), cached 5 minutes in
// sessionStorage, so clicking around stays far under the 60-an-hour limit an
// unauthenticated browser gets.
//
// File BODIES come from raw.githubusercontent.com PINNED TO THE COMMIT SHA. A
// branch raw URL can serve a stale copy; a SHA URL is immutable, so every note
// on screen is from the same commit the footer names.

export const REPO = { owner: 'mawizorek', name: 'maw-prose', branch: 'main' };
const API = 'https://api.github.com/repos/' + REPO.owner + '/' + REPO.name;
const CACHE_KEY = 'fmpr.tree.v1';
const TTL = 5 * 60 * 1000;

async function api(path) {
  const r = await fetch(API + path, { headers: { Accept: 'application/vnd.github+json' } });
  if (r.status === 403 || r.status === 429) {
    const reset = Number(r.headers.get('x-ratelimit-reset')) * 1000;
    const mins = reset ? Math.max(1, Math.ceil((reset - Date.now()) / 60000)) : 0;
    throw new Error('GitHub rate limit reached (60 reads an hour without a login).' +
      (mins ? ' It resets in about ' + mins + ' min.' : ''));
  }
  if (!r.ok) throw new Error('GitHub answered ' + r.status + ' for ' + path + '.');
  return { json: await r.json(), left: r.headers.get('x-ratelimit-remaining') };
}

export async function loadTree(force) {
  if (!force) {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (c && Date.now() - c.at < TTL) return Object.assign(c, { cached: true });
    } catch (e) { /* a bad cache is no cache */ }
  }
  const commit = await api('/commits/' + REPO.branch);
  const tree = await api('/git/trees/' + commit.json.commit.tree.sha + '?recursive=1');
  // A truncated tree would render a spec with silent holes. Refuse instead.
  if (tree.json.truncated) throw new Error('GitHub truncated the repo file list, so some specs would be missing. Refusing to render a partial spec.');
  const out = {
    at: Date.now(),
    sha: commit.json.sha,
    date: commit.json.commit.committer.date,
    subject: String(commit.json.commit.message || '').split('\n')[0],
    paths: tree.json.tree.filter(n => n.type === 'blob').map(n => n.path),
    left: tree.left,
    cached: false
  };
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(out)); } catch (e) { /* private mode */ }
  return out;
}

const bodies = new Map();
export function loadFile(sha, path) {
  const key = sha + ':' + path;
  if (bodies.has(key)) return bodies.get(key);
  const url = 'https://raw.githubusercontent.com/' + REPO.owner + '/' + REPO.name + '/' + sha + '/' +
    path.split('/').map(encodeURIComponent).join('/');
  const p = fetch(url).then(r => {
    if (!r.ok) throw new Error('Could not read ' + path + ' (' + r.status + ').');
    return r.text();
  });
  bodies.set(key, p);
  p.catch(() => bodies.delete(key));
  return p;
}

const base = 'https://github.com/' + REPO.owner + '/' + REPO.name;
export const blobUrl = path => base + '/blob/' + REPO.branch + '/' + path;
export const editUrl = path => base + '/edit/' + REPO.branch + '/' + path;
export const commitUrl = sha => base + '/commit/' + sha;
