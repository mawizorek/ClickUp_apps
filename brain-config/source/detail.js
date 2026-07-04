/* Brain Config Index — agent detail module (Segment 2b).
   Self-wiring: owns #agent/<slug> routing + the detail/edit view.
   Deliberately kept OUT of app.js so the Run-me launcher engine stays untouched.
   Loaded by the shell after data.js + app.js. IIFE-scoped: no globals leak,
   no collision with app.js's top-level consts (RAW, BASE, etc.).

   What it does:
   1. Rewrites every agent card's name link to #agent/<slug> (MutationObserver,
      so it survives app.js re-renders on sort changes).
   2. Routes #agent/<slug> -> a detail view built from that agent's
      metadata.json sidecar, fetched via the raw.githubusercontent path.
   3. Exposes editable fields (colloquialName, nicknames, launchPrompt, badge,
      status, teams, accent, and the open-ended toggles{} bag) and live-generates
      a commit-ready metadata.json block with canonical key order + a copy button. */
(function () {
  'use strict';

  var RAW = 'https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main';
  var AGENTS_DIR = 'brain-config/agents';

  // Canonical key order -> minimal, clean diff when the block is pasted back.
  var KEY_ORDER = ['slug', 'type', 'name', 'colloquialName', 'nicknames', 'status',
    'seat', 'teams', 'role', 'accent', 'badge', 'created', 'shortcut', 'launchPrompt', 'toggles'];

  var BADGE_OPTS = ['', 'halt', 'warn', 'silent'];        // '' => null
  var BADGE_LABELS = ['(none)', 'halt', 'warn', 'silent'];
  var STATUS_OPTS = ['active', 'building', 'dormant', 'retired'];

  // ---------- scoped styles (reuse the shell's oklch tokens) ----------
  function injectStyles() {
    if (document.getElementById('agentdetail-styles')) return;
    var css = [
      '.detail-open .search-wrap,.detail-open .controls,.detail-open .status-bar,.detail-open #content,.detail-open #loading,.detail-open #no-results,.detail-open footer{display:none!important;}',
      '#agentDetail{display:none;}',
      'body.detail-open #agentDetail{display:block;}',
      '.ad-back{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--text-dim);text-decoration:none;border:1px solid var(--border);border-radius:100px;padding:5px 13px;margin-bottom:18px;transition:all 150ms cubic-bezier(.16,1,.3,1);}',
      '.ad-back:hover{border-color:var(--accent);color:var(--text);}',
      '.ad-head{display:flex;align-items:center;gap:12px;margin-bottom:5px;}',
      '.ad-swatch{width:18px;height:18px;border-radius:5px;border:1px solid var(--border);flex:none;}',
      '.ad-head h2{font-size:1.375rem;font-weight:700;letter-spacing:-.02em;}',
      '.ad-sub{color:var(--text-dim);font-size:.8125rem;margin-bottom:3px;line-height:1.45;}',
      '.ad-meta{color:var(--text-dim);font-size:.6875rem;margin-bottom:24px;font-variant-numeric:tabular-nums;}',
      '.ad-meta code{color:var(--text);background:var(--surface-2);padding:1px 5px;border-radius:3px;}',
      '.ad-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px 18px;margin-bottom:8px;}',
      '.ad-field{display:flex;flex-direction:column;gap:5px;}',
      '.ad-field.wide{grid-column:1/-1;}',
      '.ad-field label{font-size:.6875rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);font-weight:600;}',
      '.ad-field .hint{font-size:.625rem;color:var(--text-dim);text-transform:none;letter-spacing:0;font-weight:400;}',
      '.ad-field input[type=text],.ad-field textarea,.ad-field select{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font:inherit;font-size:.8125rem;padding:8px 10px;outline:none;transition:border-color 150ms;width:100%;}',
      '.ad-field input[type=text]:focus,.ad-field textarea:focus,.ad-field select:focus{border-color:var(--accent);}',
      '.ad-field textarea{resize:vertical;min-height:76px;line-height:1.5;}',
      '.ad-accent-row{display:flex;align-items:center;gap:9px;}',
      '.ad-accent-row .ad-swatch{width:30px;height:30px;}',
      '.ad-accent-row input{flex:1;}',
      '.ad-toggles{grid-column:1/-1;margin-top:6px;}',
      '.ad-toggles h3{font-size:.6875rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);font-weight:600;margin-bottom:8px;}',
      '.ad-toggle{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);}',
      '.ad-toggle:last-of-type{border-bottom:none;}',
      '.ad-toggle input[type=checkbox]{width:16px;height:16px;accent-color:var(--accent);cursor:pointer;flex:none;}',
      '.ad-toggle code{font-size:.75rem;color:var(--text);}',
      '.ad-toggle .rm{margin-left:auto;font-size:.625rem;color:var(--text-dim);background:none;border:1px solid var(--border);border-radius:3px;padding:2px 8px;cursor:pointer;transition:all 150ms;}',
      '.ad-toggle .rm:hover{border-color:var(--agent);color:var(--text);}',
      '.ad-empty{color:var(--text-dim);font-size:.75rem;padding:4px 0 2px;}',
      '.ad-addtoggle{display:flex;gap:8px;margin-top:12px;align-items:center;}',
      '.ad-addtoggle input[type=text]{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font:inherit;font-size:.75rem;padding:7px 10px;outline:none;}',
      '.ad-addtoggle input[type=text]:focus{border-color:var(--accent);}',
      '.ad-addtoggle button{font-size:.6875rem;color:var(--accent);background:transparent;border:1px solid var(--accent);border-radius:100px;padding:7px 15px;cursor:pointer;transition:all 150ms;white-space:nowrap;}',
      '.ad-addtoggle button:hover{background:var(--accent);color:var(--bg);}',
      '.ad-json{margin-top:28px;}',
      '.ad-json-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap;}',
      '.ad-json-head .path{font-size:.6875rem;color:var(--text-dim);}',
      '.ad-json-head .path code{color:var(--accent);}',
      '.ad-copy{font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--accent);background:transparent;border:1px solid var(--accent);border-radius:100px;padding:5px 14px;cursor:pointer;transition:all 150ms;}',
      '.ad-copy:hover{background:var(--accent);color:var(--bg);}',
      '.ad-json textarea{width:100%;min-height:300px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.75rem;line-height:1.55;padding:12px;outline:none;resize:vertical;tab-size:2;}',
      '.ad-json textarea:focus{border-color:var(--accent);}',
      '.ad-loading{padding:40px 4px;color:var(--text-dim);font-size:.8125rem;}',
      '.ad-error{padding:32px 4px;color:oklch(72% 0.14 25);font-size:.8125rem;line-height:1.5;}',
      '.ad-error code{background:var(--surface-2);padding:1px 5px;border-radius:3px;}',
      '@media(max-width:600px){.ad-grid{grid-template-columns:1fr;}}'
    ].join('\n');
    var st = document.createElement('style');
    st.id = 'agentdetail-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ---------- panel ----------
  var panel;
  function ensurePanel() {
    if (panel) return panel;
    panel = document.getElementById('agentDetail');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'agentDetail';
      (document.querySelector('.container') || document.body).appendChild(panel);
    }
    return panel;
  }

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function arr(v) { return Array.isArray(v) ? v : []; }
  function splitList(s) { return String(s).split(',').map(function (x) { return x.trim(); }).filter(Boolean); }

  // Order the sidecar by KEY_ORDER (unknown keys appended) then pretty-print.
  function buildJSON(data) {
    var out = {};
    KEY_ORDER.forEach(function (k) { if (Object.prototype.hasOwnProperty.call(data, k)) out[k] = data[k]; });
    Object.keys(data).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(out, k)) out[k] = data[k]; });
    return JSON.stringify(out, null, 2);
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        var ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
      } catch (e2) { return false; }
    }
  }

  // ---------- agent card links -> #agent/<slug> ----------
  function rewriteLinks() {
    var content = document.getElementById('content');
    if (!content) return;
    var anchors = content.querySelectorAll('section[data-shelf="agents"] .tool-name a:not([data-agentlink])');
    anchors.forEach(function (a) {
      var m = (a.getAttribute('href') || '').match(/\/agents\/([^\/]+)\.md/);
      if (!m) { a.setAttribute('data-agentlink', 'skip'); return; }
      a.setAttribute('data-agentlink', m[1]);
      a.setAttribute('href', '#agent/' + m[1]);
      a.removeAttribute('target');
      a.removeAttribute('rel');
    });
  }

  function observeContent() {
    var content = document.getElementById('content');
    if (!content) { setTimeout(observeContent, 120); return; }
    rewriteLinks();
    new MutationObserver(function () { rewriteLinks(); }).observe(content, { childList: true, subtree: true });
  }

  // ---------- field builders ----------
  function fieldText(id, label, val, hint) {
    return '<div class="ad-field"><label for="' + id + '">' + label +
      (hint ? ' <span class="hint">' + hint + '</span>' : '') + '</label>' +
      '<input type="text" id="' + id + '" value="' + esc(val) + '" spellcheck="false"></div>';
  }
  function fieldArea(id, label, val, hint) {
    return '<div class="ad-field wide"><label for="' + id + '">' + label +
      (hint ? ' <span class="hint">' + hint + '</span>' : '') + '</label>' +
      '<textarea id="' + id + '" spellcheck="false">' + esc(val) + '</textarea></div>';
  }
  function fieldSelect(id, label, opts, labels, val) {
    var cur = (val == null ? '' : val);
    var o = opts.map(function (op, i) {
      return '<option value="' + esc(op) + '"' + (op === cur ? ' selected' : '') + '>' + esc(labels[i]) + '</option>';
    }).join('');
    return '<div class="ad-field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + o + '</select></div>';
  }
  function toggleRow(key, val) {
    return '<div class="ad-toggle" data-key="' + esc(key) + '">' +
      '<input type="checkbox"' + (val ? ' checked' : '') + '>' +
      '<code>' + esc(key) + '</code>' +
      '<button type="button" class="rm">remove</button></div>';
  }

  // ---------- render ----------
  function renderDetail(slug, data) {
    var p = ensurePanel();
    var toggles = (data.toggles && typeof data.toggles === 'object') ? data.toggles : {};
    var togKeys = Object.keys(toggles);
    var togHtml = togKeys.length
      ? togKeys.map(function (k) { return toggleRow(k, toggles[k]); }).join('')
      : '<div class="ad-empty">No toggles yet. Add one below — open-ended bag, no schema change.</div>';

    p.innerHTML =
      '<a class="ad-back" href="#">\u2190 All tools</a>' +
      '<div class="ad-head"><span class="ad-swatch" id="ad-swatch" style="background:' + esc(data.accent || 'var(--agent)') + '"></span>' +
      '<h2>' + esc(data.name || slug) + '</h2></div>' +
      '<div class="ad-sub">' + esc(data.role || '') + '</div>' +
      '<div class="ad-meta"><code>' + esc(slug) + '</code> &middot; type ' + esc(data.type || 'agent') +
      ' &middot; seat ' + esc(data.seat || '—') + ' &middot; created ' + esc(data.created || '—') +
      ' &middot; shortcut ' + (data.shortcut ? 'true' : 'false') + '</div>' +
      '<div class="ad-grid">' +
      fieldText('ad-colloquial', 'Colloquial name', data.colloquialName || '') +
      fieldSelect('ad-status', 'Status', STATUS_OPTS, STATUS_OPTS, data.status || 'active') +
      fieldText('ad-nicknames', 'Nicknames', arr(data.nicknames).join(', '), 'comma-separated') +
      fieldText('ad-teams', 'Teams', arr(data.teams).join(', '), 'comma-separated slugs') +
      fieldSelect('ad-badge', 'Badge', BADGE_OPTS, BADGE_LABELS, data.badge) +
      '<div class="ad-field"><label for="ad-accent">Accent <span class="hint">oklch token</span></label>' +
      '<div class="ad-accent-row"><span class="ad-swatch" id="ad-accent-sw" style="background:' + esc(data.accent || 'var(--agent)') + '"></span>' +
      '<input type="text" id="ad-accent" value="' + esc(data.accent || '') + '" spellcheck="false"></div></div>' +
      fieldArea('ad-launch', 'Launch prompt', data.launchPrompt || '', 'copied when the Run-me button fires') +
      '<div class="ad-toggles"><h3>Toggles</h3><div id="ad-toglist">' + togHtml + '</div>' +
      '<div class="ad-addtoggle"><input type="text" id="ad-togkey" placeholder="newToggleKey" spellcheck="false"><button type="button" id="ad-togadd">Add toggle</button></div></div>' +
      '</div>' +
      '<div class="ad-json"><div class="ad-json-head"><span class="path">writes to <code>' + AGENTS_DIR + '/' + esc(slug) + '.metadata.json</code></span>' +
      '<button type="button" class="ad-copy" id="ad-copy">Copy block</button></div>' +
      '<textarea id="ad-jsonout" readonly spellcheck="false"></textarea></div>';

    var work = JSON.parse(JSON.stringify(data));

    function regen() {
      work.colloquialName = document.getElementById('ad-colloquial').value;
      work.status = document.getElementById('ad-status').value;
      work.nicknames = splitList(document.getElementById('ad-nicknames').value);
      work.teams = splitList(document.getElementById('ad-teams').value);
      var b = document.getElementById('ad-badge').value;
      work.badge = b === '' ? null : b;
      var acc = document.getElementById('ad-accent').value.trim();
      work.accent = acc;
      document.getElementById('ad-accent-sw').style.background = acc || 'var(--agent)';
      document.getElementById('ad-swatch').style.background = acc || 'var(--agent)';
      work.launchPrompt = document.getElementById('ad-launch').value;
      var tg = {};
      p.querySelectorAll('#ad-toglist .ad-toggle').forEach(function (row) {
        tg[row.getAttribute('data-key')] = row.querySelector('input[type=checkbox]').checked;
      });
      work.toggles = tg;
      document.getElementById('ad-jsonout').value = buildJSON(work);
    }

    ['ad-colloquial', 'ad-status', 'ad-nicknames', 'ad-teams', 'ad-badge', 'ad-accent', 'ad-launch'].forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener('input', regen);
      el.addEventListener('change', regen);
    });
    var list = document.getElementById('ad-toglist');
    list.addEventListener('change', regen);
    list.addEventListener('click', function (e) {
      if (e.target.classList.contains('rm')) {
        e.target.closest('.ad-toggle').remove();
        if (!list.querySelector('.ad-toggle')) list.innerHTML = '<div class="ad-empty">No toggles yet. Add one below — open-ended bag, no schema change.</div>';
        regen();
      }
    });
    document.getElementById('ad-togadd').addEventListener('click', function () {
      var kEl = document.getElementById('ad-togkey');
      var k = kEl.value.trim();
      if (!k) return;
      var empty = list.querySelector('.ad-empty');
      if (empty) empty.remove();
      var exists = false;
      list.querySelectorAll('.ad-toggle').forEach(function (r) { if (r.getAttribute('data-key') === k) exists = true; });
      if (exists) { kEl.value = ''; return; }
      list.insertAdjacentHTML('beforeend', toggleRow(k, false));
      kEl.value = '';
      regen();
    });
    document.getElementById('ad-copy').addEventListener('click', async function () {
      var btn = document.getElementById('ad-copy');
      var ok = await copyText(document.getElementById('ad-jsonout').value);
      var label = btn.textContent;
      btn.textContent = ok ? 'Copied' : 'Copy failed';
      setTimeout(function () { btn.textContent = label; }, 1600);
    });

    regen();
    document.body.classList.add('detail-open');
    window.scrollTo(0, 0);
  }

  async function showDetail(slug) {
    var p = ensurePanel();
    p.innerHTML = '<a class="ad-back" href="#">\u2190 All tools</a><div class="ad-loading">Loading ' + esc(slug) + '\u2026</div>';
    document.body.classList.add('detail-open');
    window.scrollTo(0, 0);
    try {
      var res = await fetch(RAW + '/' + AGENTS_DIR + '/' + slug + '.metadata.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      renderDetail(slug, data);
    } catch (e) {
      p.innerHTML = '<a class="ad-back" href="#">\u2190 All tools</a>' +
        '<div class="ad-error">Couldn\u2019t load <code>' + esc(slug) + '.metadata.json</code> (' + esc(e.message || e) + '). It may not exist on <code>main</code> yet.</div>';
    }
  }

  function route() {
    var m = (location.hash || '').match(/^#agent\/(.+)$/);
    if (m) showDetail(decodeURIComponent(m[1]));
    else document.body.classList.remove('detail-open');
  }

  function boot() {
    injectStyles();
    ensurePanel();
    observeContent();
    window.addEventListener('hashchange', route);
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
