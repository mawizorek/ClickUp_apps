/* Inciardi Collection — core: API client, Drawer helper, small DOM helpers.
 *
 * THE FETCH HONESTY LAW, applied (paid for in hours on the predecessor):
 * every request that fails SAYS SO, with the reason, in the UI. Nothing here swallows an
 * error and returns an empty array — an empty list and a broken endpoint must never look
 * identical, because that is precisely how three misdiagnoses happened in one day.
 *
 * TWO SETTINGS, TWO COMPLETELY DIFFERENT REASONS:
 *
 *   THE WORKER URL is PUBLIC CONFIG. Baked in below. A setting with exactly one correct value
 *   that never changes is not a setting, it is a chore. localStorage OVERRIDES it (for a
 *   staging or localhost worker) rather than being the only source.
 *
 *   THE WRITE KEY was runtime-only for the first day of this app's life. It no longer is.
 *   See the block below — this file's own history is the argument, so it is kept.
 */
(function () {
  /* The deployed worker. Version 4d178160, 2026-07-30. Public endpoint: reads are open, and
   * every write is gated on the key below. */
  var DEFAULT_BASE = 'https://inciardi-collection.mawizorek-online.workers.dev';

  /* ============================================================ BAKED WRITE KEY
   * OVERRIDDEN BY MICHAEL, 2026-07-30, knowingly and on the record.
   *
   * What this file said that morning: "the write key is a CREDENTIAL, runtime-only and always
   * will be, never in this bundle." That rule lost to a real-world cost: two people, several
   * browsers, aggressive cache clearing, and a key that has to be re-pasted every time — which
   * in practice means the app is read-only exactly when someone is standing in front of the
   * binder wanting to log a print. A credential nobody can produce at the moment of use is not
   * security, it is a locked door with the room empty.
   *
   * SO, PLAINLY, WHAT THIS COSTS:
   *   • PUBLIC repo, PUBLIC Pages site. This string is readable in view-source and in git
   *     history. Assume it is known.
   *   • Anyone can POST/DELETE: add junk artworks, fill or clear slots. CORS does not help
   *     (it constrains browsers, not curl).
   *   • NOT at risk: no personal data, no money, no third-party credential. Blast radius is
   *     "the binder data gets vandalised."
   *   • Recovery was checked before accepting this: D1 Time Travel, 30-day restore.
   *
   * UNLIKE THE PREDECESSOR, THIS IS AT LEAST NOT GUESSABLE. `inciardi-market` shipped "mikey"
   * and "nickey" — writable by anyone who GUESSED, not merely by anyone who READ. Strictly
   * worse, and still unrotated over there. Whatever goes here is long and random, always.
   *
   * TO ROTATE (2 minutes): edit `WRITE_KEY` under [vars] in `wrangler.toml`, paste the same
   * string here, commit. The push trigger redeploys the worker automatically. Rotate BOTH
   * halves or neither — a mismatch is a 401 on the first save, named explicitly below.
   * ============================================================================== */
  var DEFAULT_KEY = 'icw_k7Qm4Zt9Rb2Vn6Xw8Ly3Js5Hd4Pg7T';

  var K_BASE = 'ic_api_base', K_KEY = 'ic_write_key';
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }
    catch (e) { return null; }
  }
  function trimSlash(s) { return (s || '').replace(/\/+$/, ''); }

  var API = {
    base: function () { return trimSlash(ls(K_BASE) || DEFAULT_BASE); },
    /* Reported separately so the UI can tell "the default" from "you typed this" instead of
     * pre-filling a box with a value it never saved — a small lie about state. */
    isDefaultBase: function () { return !trimSlash(ls(K_BASE)); },
    defaultBase: function () { return DEFAULT_BASE; },
    setBase: function (v) { ls(K_BASE, trimSlash(v)); },   // blank = back to the default

    key: function () { return (ls(K_KEY) || '').trim() || DEFAULT_KEY; },
    setKey: function (v) { ls(K_KEY, v || ''); },
    isDefaultKey: function () { return !(ls(K_KEY) || '').trim(); },

    req: function (method, path, body) {
      var base = API.base();
      if (!base) return Promise.reject(new Error('No worker URL. Open Settings.'));
      var opts = { method: method, cache: 'no-store', headers: {} };
      if (body) {
        opts.headers['content-type'] = 'application/json';
        opts.body = JSON.stringify(body);
      }
      if (method !== 'GET') {
        // Cannot be empty now that a default exists, but the guard stays: a future rotation
        // that blanks DEFAULT_KEY must fail loudly rather than send an unauthenticated write.
        if (!API.key()) return Promise.reject(new Error('No write key set. Open Settings.'));
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
            // 503 from a missing server-side key is a SETUP state, not a bug.
            if (r.status === 503 && /WRITE_KEY/.test(data.error || '')) {
              throw new Error('The worker has no WRITE_KEY. Set it under [vars] in wrangler.toml and re-run the deploy.');
            }
            // 401 with the built-in key means the two halves disagree. Name that exactly:
            // "bad key" on a device that never typed a key reads as nonsense.
            if (r.status === 401 && API.isDefaultKey()) {
              throw new Error('The built-in write key does not match the worker. Either wrangler.toml was rotated without core.js, or this page is cached — hard-reload first.');
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

  /* ============================================================ DRAWER
   * ONE implementation, four callers. The sheet menu, the slot picker and the legend each had
   * their own copy of open/close/scrim inside `binder.js`, which is three chances for them to
   * drift and the reason that file grew past its cap.
   *
   * Page-level drawers only. The chrome's own nav and settings panels are managed by
   * `chrome.js`, because they are built once and live outside the routed view — but the two
   * cooperate: opening either side closes the other, so three stacked panels is unreachable. */
  var Drawer = {
    open: function (el) {
      if (!el) return;
      Drawer.closeAll(true);
      if (window.Chrome) Chrome.closeAll();
      var s = document.getElementById('pageScrim');
      if (s) s.hidden = false;
      el.hidden = false;
    },
    /* keepScrim exists so one drawer can replace another without the backdrop flashing off
     * and on again between them. */
    closeAll: function (keepScrim) {
      [].forEach.call(document.querySelectorAll('.page-drawer'), function (el) {
        el.hidden = true;
      });
      [].forEach.call(document.querySelectorAll('[data-drawer-btn]'), function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
      var s = document.getElementById('pageScrim');
      if (s && !keepScrim) s.hidden = true;
    },
    anyOpen: function () {
      return [].some.call(document.querySelectorAll('.page-drawer'), function (el) {
        return !el.hidden;
      });
    }
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
      if (el) el.innerHTML = '<div class="empty">' + Core.esc(label || 'Loading\u2026') + '</div>';
    }
  };

  window.API = API;
  window.Core = Core;
  window.Drawer = Drawer;
})();
