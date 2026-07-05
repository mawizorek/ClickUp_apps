/* Brain Config Index — agent detail module (Segment 2b + v3.1 launch + v3.2 rows + v3.4 tabs + v3.5 fixes + v3.6).
   Self-wiring: owns #agent/<slug> routing, the detail view, agent-row enrichment,
   default index ordering, the search clear-x, and (for report-makers) a Reports|Settings
   tab shell that delegates the Reports pane to source/reports.js. Kept OUT of app.js so the
   Run-me launcher stays untouched. IIFE-scoped. Loaded after data.js + app.js + reports.js.

   v3.6:
   - CACHE FIX: sidecars now fetch with cache:'no-cache' (revalidate), not 'force-cache'.
     force-cache served a stale sidecar forever, so an agent viewed before a flag was added
     (e.g. Renata pre-makesReports) kept showing the old data: no Reports tab, no Reports badge.
   - WHOLE-CARD CLICK: the entire agent row opens the detail, not just the blue name.
   - SEARCH CLEAR-X: wires the #search-clear button (clear + refocus + re-filter via app.js). */
(function () {
  'use strict';

  var RAW = 'https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main';
  var AGENTS_DIR = 'brain-config/agents';

  var LAUNCH_TARGET = (typeof BRAIN_MAX_URL !== 'undefined' && BRAIN_MAX_URL) ? BRAIN_MAX_URL : 'https://app.clickup.com/home';

  var KEY_ORDER = ['slug', 'type', 'name', 'colloquialName', 'initials', 'nicknames', 'status',
    'seat', 'teams', 'role', 'blurb', 'accent', 'badge', 'created', 'shortcut', 'launchPrompt', 'reportsIndex', 'toggles'];

  var BADGE_OPTS = ['', 'halt', 'warn', 'silent'];
  var BADGE_LABELS = ['(none)', 'halt', 'warn', 'silent'];
  var STATUS_OPTS = ['active', 'building', 'dormant', 'retired'];

  var reordering = false;

  var sidecarCache = {};
  function getSidecar(slug) {
    if (sidecarCache[slug]) return sidecarCache[slug];
    sidecarCache[slug] = fetch(RAW + '/' + AGENTS_DIR + '/' + slug + '.metadata.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    return sidecarCache[slug];
  }

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
      '.ad-meta{color:var(--text-dim);font-size:.6875rem;margin-bottom:20px;font-variant-numeric:tabular-nums;}',
      '.ad-meta code{color:var(--text);background:var(--surface-2);padding:1px 5px;border-radius:3px;}',
      '.ad-tabs{display:flex;gap:2px;margin-bottom:22px;border-bottom:1px solid var(--border);}',
      '.ad-tab{font-size:.8125rem;font-weight:600;color:var(--text-dim);background:none;border:none;border-bottom:2px solid transparent;padding:9px 15px;cursor:pointer;margin-bottom:-1px;transition:color 150ms,border-color 150ms;}',
      '.ad-tab:hover{color:var(--text);}',
      '.ad-tab.active{color:var(--accent);border-bottom-color:var(--accent);}',
      '.ad-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px 18px;margin-bottom:8px;}',
      '.ad-field{display:flex;flex-direction:column;gap:5px;}',
      '.ad-field.wide{grid-column:1/-1;}',
      '.ad-field label{font-size:.6875rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);font-weight:600;}',
      '.ad-field .hint{font-size:.625rem;color:var(--text-dim);text-transform:none;letter-spacing:0;font-weight:400;}',
      '.ad-field input[type=text],.ad-field textarea,.ad-field select{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:inherit;font-size:16px;padding:8px 10px;outline:none;transition:border-color 150ms;width:100%;}',
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
      '.ad-addtoggle input[type=text]{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:inherit;font-size:16px;padding:7px 10px;outline:none;}',
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
      '.ad-launch-wrap{margin-top:26px;padding-top:22px;border-top:1px solid var(--border);display:flex;align-items:center;gap:14px;flex-wrap:wrap;}',
      '.ad-launch-btn{display:inline-flex;align-items:center;gap:7px;font-size:.8125rem;font-weight:700;color:var(--bg);background:var(--accent);border:1px solid var(--accent);border-radius:100px;padding:10px 20px;cursor:pointer;text-decoration:none;transition:all 150ms cubic-bezier(.16,1,.3,1);}',
      '.ad-launch-btn:hover{filter:brightness(1.08);}',
      '.ad-launch-btn:active{transform:scale(.97);}',
      '.ad-launch-note{font-size:.6875rem;color:var(--text-dim);line-height:1.4;max-width:42ch;}',
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

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function arr(v) { return Array.isArray(v) ? v : []; }
  function splitList(s) { return String(s).split(',').map(function (x) { return x.trim(); }).filter(Boolean); }

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

  function notify(msg) { if (typeof showToast === 'function') showToast(msg); }

  function slugFromAnchor(a) {
    if (!a) return null;
    var dl = a.getAttribute('data-agentlink');
    if (dl && dl !== 'skip') return dl;
    var href = a.getAttribute('href') || '';
    var m1 = href.match(/^#agent\/(.+)$/);
    if (m1) return decodeURIComponent(m1[1]);
    var m2 = href.match(/\/agents\/([^\/]+)\.md/);
    if (m2) return m2[1];
    return null;
  }

  function openAgent(slug) {
    if (location.hash === '#agent/' + slug) showDetail(slug);
    else location.hash = '#agent/' + slug;
  }

  // Delegated open: the WHOLE agent card opens the detail. In-app/Safari webviews were
  // unreliable firing hashchange on anchor taps and the card outside the link did nothing.
  // Non-agent anchors (hook/gate GitHub links) keep their default behavior.
  function onContentClick(e) {
    var row = e.target.closest('section[data-shelf="agents"] .tool');
    if (row) {
      var slug = slugFromAnchor(row.querySelector('.tool-name a'));
      if (slug) { e.preventDefault(); openAgent(slug); return; }
    }
  }

  function rewriteLinks() {
    var content = document.getElementById('content');
    if (!content) return;
    content.querySelectorAll('section[data-shelf="agents"] .tool-name a:not([data-agentlink])').forEach(function (a) {
      var m = (a.getAttribute('href') || '').match(/\/agents\/([^\/]+)\.md/);
      if (!m) { a.setAttribute('data-agentlink', 'skip'); return; }
      a.setAttribute('data-agentlink', m[1]);
      a.setAttribute('href', '#agent/' + m[1]);
      a.removeAttribute('target');
      a.removeAttribute('rel');
    });
  }

  function enrichRows() {
    var content = document.getElementById('content');
    if (!content) return;
    content.querySelectorAll('section[data-shelf="agents"] .tool:not([data-enriched])').forEach(function (row) {
      var a = row.querySelector('.tool-name a[data-agentlink]');
      var slug = a ? a.getAttribute('data-agentlink') : null;
      if (!slug || slug === 'skip') { row.setAttribute('data-enriched', 'skip'); return; }
      row.setAttribute('data-enriched', '1');
      var purposeCell = row.querySelector('.tool-purpose');
      getSidecar(slug).then(function (data) {
        if (purposeCell && data.role && !purposeCell.textContent.trim()) {
          purposeCell.textContent = data.role;
          row.dataset.search = (row.dataset.search || '') + ' ' + String(data.role).toLowerCase();
        }
        var nameCell = row.querySelector('.tool-name');
        if (data.badge && nameCell && !nameCell.querySelector('.badge-' + data.badge)) {
          var b = document.createElement('span');
          b.className = 'badge badge-' + data.badge;
          b.textContent = data.badge;
          nameCell.appendChild(b);
        }
        var reports = !!(data.toggles && data.toggles.makesReports);
        row.dataset.reports = reports ? '1' : '0';
        if (reports && nameCell && !nameCell.querySelector('.badge-reports')) {
          var rb = document.createElement('span');
          rb.className = 'badge badge-reports';
          rb.textContent = 'Reports';
          nameCell.appendChild(rb);
        }
        reorderDefault();
      }).catch(function () {});
    });
  }

  function usesOf(row) {
    var u = row.querySelector('.tool-meta .uses');
    if (!u) return 0;
    var n = parseInt(String(u.textContent).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }
  function sevOf(row) {
    var b = row.querySelector('.tool-name .badge-halt, .tool-name .badge-warn, .tool-name .badge-silent');
    if (!b) return 0;
    if (b.classList.contains('badge-halt')) return 3;
    if (b.classList.contains('badge-warn')) return 2;
    if (b.classList.contains('badge-silent')) return 1;
    return 0;
  }
  function rankKey(shelf, row) {
    if (shelf === 'agents') return (row.dataset.reports === '1' ? 1 : 0) * 1000000 + usesOf(row);
    return sevOf(row) * 1000000 + usesOf(row);
  }
  function reorderDefault() {
    if (reordering) return;
    var content = document.getElementById('content');
    if (!content) return;
    var active = document.querySelector('.sort-btn.active');
    if (active && active.getAttribute('data-sort') !== 'shelf') return;
    content.querySelectorAll('section').forEach(function (sec) {
      var shelf = sec.dataset.shelf;
      if (shelf !== 'agents' && shelf !== 'hooks' && shelf !== 'gates') return;
      var list = sec.querySelector('.tool-list');
      if (!list) return;
      var rows = [].slice.call(list.children).filter(function (n) { return n.classList && n.classList.contains('tool'); });
      if (rows.length < 2) return;
      var ranked = rows.map(function (row, i) { return { row: row, i: i, key: rankKey(shelf, row) }; });
      ranked.sort(function (x, y) { return (y.key - x.key) || (x.i - y.i); });
      var changed = ranked.some(function (r, idx) { return r.row !== rows[idx]; });
      if (!changed) return;
      reordering = true;
      ranked.forEach(function (r) { list.appendChild(r.row); });
      reordering = false;
    });
  }

  function refreshIndex() { rewriteLinks(); enrichRows(); reorderDefault(); }

  function observeContent() {
    var content = document.getElementById('content');
    if (!content) { setTimeout(observeContent, 120); return; }
    if (!content.dataset.adClickBound) {
      content.addEventListener('click', onContentClick);
      content.dataset.adClickBound = '1';
    }
    refreshIndex();
    new MutationObserver(function () { if (reordering) return; refreshIndex(); }).observe(content, { childList: true, subtree: true });
  }

  // ---------- search clear-x (wires the shell button; refilter via app.js's input listener) ----------
  function wireSearchClear() {
    var search = document.getElementById('search');
    var clr = document.getElementById('search-clear');
    if (!search || !clr) return;
    function sync() { clr.classList.toggle('visible', !!search.value); }
    search.addEventListener('input', sync);
    clr.addEventListener('click', function () {
      search.value = '';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      search.focus();
      sync();
    });
    sync();
  }

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

  function settingsHtml(data) {
    var toggles = (data.toggles && typeof data.toggles === 'object') ? data.toggles : {};
    var togKeys = Object.keys(toggles);
    var togHtml = togKeys.length
      ? togKeys.map(function (k) { return toggleRow(k, toggles[k]); }).join('')
      : '<div class="ad-empty">No toggles yet. Add one below — open-ended bag, no schema change.</div>';
    var who = data.colloquialName || data.name || data.slug;
    return '<div class="ad-grid">' +
      fieldText('ad-colloquial', 'Colloquial name', data.colloquialName || '') +
      fieldSelect('ad-status', 'Status', STATUS_OPTS, STATUS_OPTS, data.status || 'active') +
      fieldText('ad-nicknames', 'Nicknames', arr(data.nicknames).join(', '), 'comma-separated') +
      fieldText('ad-teams', 'Teams', arr(data.teams).join(', '), 'comma-separated slugs') +
      fieldSelect('ad-badge', 'Badge', BADGE_OPTS, BADGE_LABELS, data.badge) +
      '<div class="ad-field"><label for="ad-accent">Accent <span class="hint">oklch token</span></label>' +
      '<div class="ad-accent-row"><span class="ad-swatch" id="ad-accent-sw" style="background:' + esc(data.accent || 'var(--agent)') + '"></span>' +
      '<input type="text" id="ad-accent" value="' + esc(data.accent || '') + '" spellcheck="false"></div></div>' +
      fieldArea('ad-launch', 'Launch prompt', data.launchPrompt || '', 'copied when you launch this agent') +
      '<div class="ad-toggles"><h3>Toggles</h3><div id="ad-toglist">' + togHtml + '</div>' +
      '<div class="ad-addtoggle"><input type="text" id="ad-togkey" placeholder="newToggleKey" spellcheck="false"><button type="button" id="ad-togadd">Add toggle</button></div></div>' +
      '</div>' +
      '<div class="ad-json"><div class="ad-json-head"><span class="path">writes to <code>' + AGENTS_DIR + '/' + esc(data.slug) + '.metadata.json</code></span>' +
      '<button type="button" class="ad-copy" id="ad-copy">Copy block</button></div>' +
      '<textarea id="ad-jsonout" readonly spellcheck="false"></textarea></div>' +
      '<div class="ad-launch-wrap"><a class="ad-launch-btn" id="ad-launch-btn" href="' + esc(LAUNCH_TARGET) + '" target="_blank" rel="noopener">\u25B6 Launch this agent</a>' +
      '<span class="ad-launch-note">Copies the launch prompt and opens Brain in a new tab. Paste, and you\u2019re talking to ' + esc(who) + '.</span></div>';
  }

  function wireSettings(slug, data) {
    var p = ensurePanel();
    var who = data.colloquialName || data.name || slug;
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
      var sw = document.getElementById('ad-swatch');
      if (sw) sw.style.background = acc || 'var(--agent)';
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
    document.getElementById('ad-launch-btn').addEventListener('click', async function () {
      var text = document.getElementById('ad-launch').value;
      var ok = text ? await copyText(text) : false;
      notify(ok
        ? 'Prompt copied → opening Brain. Paste, and you\u2019re talking to ' + who + '.'
        : 'Opening Brain — copy the prompt above manually before you switch.');
    });

    regen();
  }

  function renderDetail(slug, data) {
    var p = ensurePanel();
    var makesReports = !!(data.toggles && data.toggles.makesReports) && !!window.AgentReports;
    var chrome =
      '<a class="ad-back" href="#">\u2190 All tools</a>' +
      '<div class="ad-head"><span class="ad-swatch" id="ad-swatch" style="background:' + esc(data.accent || 'var(--agent)') + '"></span>' +
      '<h2>' + esc(data.name || slug) + '</h2></div>' +
      '<div class="ad-sub">' + esc(data.role || '') + '</div>' +
      '<div class="ad-meta"><code>' + esc(slug) + '</code> &middot; type ' + esc(data.type || 'agent') +
      ' &middot; seat ' + esc(data.seat || '—') + ' &middot; created ' + esc(data.created || '—') +
      ' &middot; shortcut ' + (data.shortcut ? 'true' : 'false') + '</div>';

    if (makesReports) {
      p.innerHTML = chrome +
        '<div class="ad-tabs"><button class="ad-tab active" data-tab="reports">Reports</button>' +
        '<button class="ad-tab" data-tab="settings">Settings</button></div>' +
        '<div class="ad-pane" id="ad-pane-reports"></div>' +
        '<div class="ad-pane" id="ad-pane-settings" hidden>' + settingsHtml(data) + '</div>';
      wireSettings(slug, data);
      var tabs = p.querySelectorAll('.ad-tab');
      tabs.forEach(function (t) {
        t.addEventListener('click', function () {
          tabs.forEach(function (x) { x.classList.remove('active'); });
          t.classList.add('active');
          var which = t.getAttribute('data-tab');
          document.getElementById('ad-pane-reports').hidden = which !== 'reports';
          document.getElementById('ad-pane-settings').hidden = which !== 'settings';
        });
      });
      window.AgentReports.mount(document.getElementById('ad-pane-reports'), slug, data);
    } else {
      p.innerHTML = chrome + settingsHtml(data);
      wireSettings(slug, data);
    }

    document.body.classList.add('detail-open');
    window.scrollTo(0, 0);
  }

  async function showDetail(slug) {
    var p = ensurePanel();
    p.innerHTML = '<a class="ad-back" href="#">\u2190 All tools</a><div class="ad-loading">Loading ' + esc(slug) + '\u2026</div>';
    document.body.classList.add('detail-open');
    window.scrollTo(0, 0);
    try {
      var data = await getSidecar(slug);
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
    wireSearchClear();
    window.addEventListener('hashchange', route);
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
