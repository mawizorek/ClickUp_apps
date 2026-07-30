/* Inciardi Collection — core: API client + small DOM helpers.
 *
 * THE FETCH HONESTY LAW, applied (paid for in hours on the predecessor):
 * every request that fails SAYS SO, with the reason, in the UI. Nothing here swallows an
 * error and returns an empty array — an empty list and a broken endpoint must never look
 * identical, because that is precisely how three misdiagnoses happened in one day.
 *
 * TWO SETTINGS, TWO COMPLETELY DIFFERENT REASONS — a distinction the first version got
 * wrong by treating them the same:
 *
 *   THE WORKER URL is PUBLIC CONFIG. It is baked in below. It was a runtime setting only
 *   because the worker did not exist yet; now it does, the URL is permanent, and the
 *   endpoint is public regardless. A setting with exactly one correct value that never
 *   changes is not a setting, it is a chore. localStorage now OVERRIDES it (for a staging
 *   or localhost worker) rather than being the only source.
 *
 *   THE WRITE KEY is a CREDENTIAL. It is runtime-only and always will be. It is never in
 *   this bundle, never in the repo, never in a build. `inciardi-market` shipped
 *   "mikey"/"nickey" inside public JS and they are STILL unrotated — that is the whole
 *   reason this file has a comment about it.
 */
(function () {
  /* The deployed worker. Version 4d178160, 2026-07-30. Public endpoint: reads are open, and
   * every write is gated on a key that lives nowhere near this file. */
  var DEFAULT_BASE = 'https://inciardi-collection.mawizorek-online.workers.dev';

  var K_BASE = 'ic_api_base', K_KEY = 'ic_write_key';
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }
    catch (e) { return null; }
  }
  function trimSlash(s) { return (s || '').replace(/\/+$/, ''); }

  var API = {
    /* Override if set, otherwise the built-in default. */
    base: function () { return trimSlash(ls(K_BASE) || DEFAULT_BASE); },
    /* Reported separately so the UI can tell "the default" from "you typed this" instead of
     * pre-filling a box with a value it never saved — which is a small lie about state, and
     * this app's whole thesis is that the screen never claims something untrue. */
    isDefaultBase: function () { return !trimSlash(ls(K_BASE)); },
    defaultBase: function () { return DEFAULT_BASE; },
    /* Empty input = fall back to the default, so there is always a way home from a typo. */
    setBase: function (v) { ls(K_BASE, trimSlash(v)); },

    key: function () { return ls(K_KEY) || ''; },
    setKey: function (v) { ls(K_KEY, v || ''); },

    req: function (method, path, body) {
      var base = API.base();
      if (!base) return Promise.reject(new Error('No worker URL. Open Settings (⚙).'));
      var opts = { method: method, cache: 'no-store', headers: {} };
      if (body) {
        opts.headers['content-type'] = 'application/json';
        opts.body = JSON.stringify(body);
      }
      if (method !== 'GET') {
        if (!API.key()) return Promise.reject(new Error('No write key set. Open Settings (⚙) and paste it.'));
        opts.headers['x-write-key'] = API.key();
      }
      return fetch(base + path, opts).then(function (r) {
        return r.text().then(function (txt) {
          var data;
          try { data = JSON.parse(txt); }
          catch (e) {
            // Not JSON = not our worker. Say what actually came back rather than reporting a
            // parse error, which sends the reader down the wrong path entirely.
            throw new Error('HTTP ' + r.status + ' — response was not JSON: ' + txt.slice(0, 120));
          }
          if (!r.ok || data.ok === false) {
            // 503 from a missing server-side secret is a SETUP state, not a bug. Say so, or it
            // reads as "the app is broken" when it means "nobody set the key yet."
            if (r.status === 503 && /WRITE_KEY/.test(data.error || '')) {
              throw new Error('The worker has no WRITE_KEY set yet. Add it in the Cloudflare dashboard: Worker → Settings → Variables and Secrets.');
            }
            throw new Error(data.error || ('HTTP ' + r.status));
          }
          return data;
        });
      });
    },
    get:  function (p) { return API.req('GET', p); },
    post: function (p, b) { return API.req('POST', p, b || {}); },
    del:  function (p) { return API.req('DELETE', p); }
  };

  var Core = {
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    /* Initials for a photo-less tile. Image Rendering Law rule 7: a placeholder ALWAYS
     * carries identifying content, because a blank grey box is how an outage hides. */
    initials: function (name) {
      return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2)
        .map(function (w) { return w[0]; }).join('').toUpperCase() || '?';
    },
    money: function (n) {
      // DOLLARS. Never cents. A /100 assumption here cost a full day on the predecessor.
      return (n == null || n === '') ? '' : '$' + Number(n).toFixed(2);
    },
    toast: function (msg, kind) {
      var wrap = document.getElementById('toasts');
      if (!wrap) return;
      var el = document.createElement('div');
      el.className = 'toast ' + (kind || '');
      el.textContent = msg;
      wrap.appendChild(el);
      setTimeout(function () { el.classList.add('out'); }, kind === 'bad' ? 6000 : 2600);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); },
                 kind === 'bad' ? 6400 : 3000);
    },
    /* One error path for every page, so a failure can never render as "empty". */
    fail: function (el, e) {
      Core.toast(e.message || String(e), 'bad');
      if (el) el.innerHTML = '<div class="empty bad"><b>Could not load.</b><br>' +
        Core.esc(e.message || String(e)) + '</div>';
    },
    busy: function (el, label) {
      if (el) el.innerHTML = '<div class="empty">' + Core.esc(label || 'Loading…') + '</div>';
    }
  };

  window.API = API;
  window.Core = Core;
})();
