/* Inciardi Collection — core: API client + small DOM helpers.
 *
 * THE FETCH HONESTY LAW, applied (paid for in hours on the predecessor):
 * every request that fails SAYS SO, with the reason, in the UI. Nothing here swallows an
 * error and returns an empty array — an empty list and a broken endpoint must never look
 * identical, because that is precisely how three misdiagnoses happened in one day.
 *
 * The API base URL and the write key are RUNTIME settings, not baked constants:
 *   - the worker URL isn't known until it's deployed, and baking a guess ships an app
 *     pointing at nothing;
 *   - the key must never be in a public bundle. `inciardi-market` shipped "mikey"/"nickey"
 *     in public JS and they are still unrotated. Not repeating it.
 */
(function () {
  var K_BASE = 'ic_api_base', K_KEY = 'ic_write_key';
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }
    catch (e) { return null; }
  }

  var API = {
    base: function () { return (ls(K_BASE) || '').replace(/\/+$/, ''); },
    setBase: function (v) { ls(K_BASE, (v || '').replace(/\/+$/, '')); },
    key: function () { return ls(K_KEY) || ''; },
    setKey: function (v) { ls(K_KEY, v || ''); },

    req: function (method, path, body) {
      var base = API.base();
      if (!base) return Promise.reject(new Error('No worker URL set. Open Settings (⚙).'));
      var opts = { method: method, cache: 'no-store', headers: {} };
      if (body) {
        opts.headers['content-type'] = 'application/json';
        opts.body = JSON.stringify(body);
      }
      if (method !== 'GET') {
        if (!API.key()) return Promise.reject(new Error('No write key set. Open Settings (⚙).'));
        opts.headers['x-write-key'] = API.key();
      }
      return fetch(base + path, opts).then(function (r) {
        return r.text().then(function (txt) {
          var data;
          try { data = JSON.parse(txt); }
          catch (e) {
            // Not JSON = not our worker. Say what actually came back rather than
            // reporting a parse error, which sends the reader down the wrong path.
            throw new Error('HTTP ' + r.status + ' — response was not JSON: ' + txt.slice(0, 120));
          }
          if (!r.ok || data.ok === false) {
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
