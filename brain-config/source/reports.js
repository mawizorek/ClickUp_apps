/* Brain Config — agent Reports module (v3.4).
   Owns the Reports tab: fetches <slug>/reports/index.json, lists reports,
   renders each by `type` (audit | review | research), and exports a standalone
   HTML artifact on demand. JSON is the source of truth; HTML is generated from
   it, never stored. IIFE; exposes window.AgentReports = { mount }. Kept OUT of
   detail.js to stay well under the 30KB read/write cap. Schema: report-schema.md. */
(function () {
  'use strict';

  var RAW = 'https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main';
  var AGENTS_DIR = 'brain-config/agents';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function arr(v) { return Array.isArray(v) ? v : []; }

  function fmtTs(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  // verdictPill / tally color bucket -> css modifier
  function pillClass(v) {
    switch (String(v || '').toLowerCase()) {
      case 'solid': case 'done': case 'ok': case 'pass': return 'ok';
      case 'adjust': case 'warn': case 'med': return 'warn';
      case 'halt': case 'high': case 'fail': return 'halt';
      default: return 'neutral';
    }
  }

  function injectStyles() {
    if (document.getElementById('agentreports-styles')) return;
    var css = [
      '.rp-loading,.rp-empty,.rp-err{padding:28px 4px;color:var(--text-dim);font-size:.8125rem;}',
      '.rp-err{color:oklch(72% 0.14 25);}',
      '.rp-list{display:flex;flex-direction:column;}',
      '.rp-item{display:flex;align-items:baseline;gap:12px;padding:13px 4px;border-bottom:1px solid var(--border);cursor:pointer;transition:background 120ms;}',
      '.rp-item:hover{background:var(--surface);}',
      '.rp-item:last-child{border-bottom:none;}',
      '.rp-title{font-size:.875rem;font-weight:600;color:var(--text);white-space:nowrap;}',
      '.rp-item:hover .rp-title{color:var(--accent);}',
      '.rp-target{font-size:.75rem;color:var(--text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;}',
      '.rp-ts{font-size:.6875rem;color:var(--text-dim);font-variant-numeric:tabular-nums;white-space:nowrap;}',
      '.rp-pill{font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:2px 8px;border-radius:100px;white-space:nowrap;}',
      '.rp-pill.ok{background:oklch(30% 0.07 150);color:oklch(80% 0.14 150);}',
      '.rp-pill.warn{background:oklch(32% 0.08 80);color:oklch(82% 0.13 80);}',
      '.rp-pill.halt{background:oklch(32% 0.10 25);color:oklch(80% 0.16 25);}',
      '.rp-pill.neutral{background:var(--surface-2);color:var(--text-dim);}',
      '.rp-back{font-size:.75rem;color:var(--text-dim);background:none;border:1px solid var(--border);border-radius:100px;padding:5px 13px;margin-bottom:18px;cursor:pointer;transition:all 150ms;}',
      '.rp-back:hover{border-color:var(--accent);color:var(--text);}',
      '.rp-head{display:flex;align-items:center;gap:10px;margin-bottom:5px;flex-wrap:wrap;}',
      '.rp-head h3{font-size:1.125rem;font-weight:700;letter-spacing:-.01em;}',
      '.rp-meta{font-size:.6875rem;color:var(--text-dim);margin-bottom:16px;font-variant-numeric:tabular-nums;}',
      '.rp-summary{font-size:.8125rem;line-height:1.55;color:var(--text);margin-bottom:16px;max-width:72ch;}',
      '.rp-tally{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px;}',
      '.rp-chip{font-size:.6875rem;padding:3px 10px;border-radius:100px;background:var(--surface);border:1px solid var(--border);color:var(--text-dim);font-variant-numeric:tabular-nums;}',
      '.rp-chip b{color:var(--text);font-weight:700;}',
      '.rp-chip.high{border-color:oklch(45% 0.12 25);} .rp-chip.med{border-color:oklch(45% 0.10 80);} .rp-chip.low{border-color:var(--border);} .rp-chip.done{border-color:oklch(45% 0.09 150);}',
      '.rp-sec{font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);margin:22px 0 10px;padding-bottom:5px;border-bottom:1px solid var(--border);}',
      '.rp-find{padding:11px 0;border-bottom:1px solid var(--border);}',
      '.rp-find:last-child{border-bottom:none;}',
      '.rp-find-h{display:flex;align-items:baseline;gap:9px;margin-bottom:3px;}',
      '.rp-find-num{font-size:.6875rem;color:var(--text-dim);font-variant-numeric:tabular-nums;}',
      '.rp-find-cat{font-size:.75rem;font-weight:600;color:var(--text);}',
      '.rp-sev{font-size:.5625rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:1px 6px;border-radius:3px;}',
      '.rp-sev.high{background:oklch(32% 0.10 25);color:oklch(80% 0.16 25);} .rp-sev.med{background:oklch(32% 0.08 80);color:oklch(82% 0.13 80);} .rp-sev.low{background:var(--surface-2);color:var(--text-dim);} .rp-sev.resolved{background:oklch(30% 0.07 150);color:oklch(80% 0.13 150);}',
      '.rp-find.fixed .rp-find-cat{text-decoration:line-through;color:var(--text-dim);}',
      '.rp-find-body{font-size:.8125rem;line-height:1.5;color:var(--text);margin-bottom:3px;}',
      '.rp-find-fix{font-size:.75rem;color:var(--text-dim);line-height:1.45;}',
      '.rp-find-fix::before{content:"→ ";color:var(--accent);}',
      '.rp-table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:.75rem;}',
      '.rp-table th{text-align:left;font-weight:600;color:var(--text-dim);font-size:.625rem;text-transform:uppercase;letter-spacing:.05em;padding:6px 10px 6px 0;border-bottom:1px solid var(--border);}',
      '.rp-table td{padding:7px 10px 7px 0;border-bottom:1px solid var(--border);color:var(--text);vertical-align:top;}',
      '.rp-table tr:last-child td{border-bottom:none;}',
      '.rp-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;vertical-align:middle;}',
      '.rp-dot.ok{background:oklch(72% 0.14 150);} .rp-dot.no{background:oklch(68% 0.16 25);} .rp-dot.na{background:var(--text-dim);}',
      '.rp-row-flag td{background:oklch(26% 0.03 25);}',
      '.rp-clean{list-style:none;padding:0;} .rp-clean li{font-size:.8125rem;color:var(--text);padding:5px 0 5px 20px;position:relative;line-height:1.45;}',
      '.rp-clean li::before{content:"✓";position:absolute;left:0;color:oklch(72% 0.14 150);font-weight:700;}',
      '.rp-lens{padding:11px 0;border-bottom:1px solid var(--border);}',
      '.rp-lens:last-child{border-bottom:none;}',
      '.rp-lens-h{display:flex;align-items:baseline;gap:9px;margin-bottom:3px;}',
      '.rp-lens-name{font-size:.8125rem;font-weight:600;color:var(--text);}',
      '.rp-lens-body{font-size:.8125rem;line-height:1.5;color:var(--text-dim);}',
      '.rp-call{margin-top:20px;padding:14px 16px;background:var(--surface);border-radius:var(--radius);font-size:.8125rem;line-height:1.5;color:var(--text);}',
      '.rp-call::before{content:"CALL";display:block;font-size:.5625rem;font-weight:700;letter-spacing:.06em;color:var(--accent);margin-bottom:5px;}',
      '.rp-actions{margin-top:26px;padding-top:20px;border-top:1px solid var(--border);}',
      '.rp-export{font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--accent);background:transparent;border:1px solid var(--accent);border-radius:100px;padding:7px 16px;cursor:pointer;transition:all 150ms;}',
      '.rp-export:hover{background:var(--accent);color:var(--bg);}'
    ].join('\n');
    var st = document.createElement('style');
    st.id = 'agentreports-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ---------- list ----------
  function renderListHtml(reports) {
    if (!reports.length) return '<div class="rp-empty">No reports yet.</div>';
    var sorted = reports.slice().sort(function (a, b) { return String(b.ts || '').localeCompare(String(a.ts || '')); });
    return '<div class="rp-list">' + sorted.map(function (r) {
      return '<div class="rp-item" data-file="' + esc(r.file) + '">' +
        '<span class="rp-title">' + esc(r.reportType || r.type || 'Report') + '</span>' +
        '<span class="rp-pill ' + pillClass(r.verdictPill) + '">' + esc(r.verdictWord || r.verdictPill || '') + '</span>' +
        '<span class="rp-target">' + esc(r.target || '') + '</span>' +
        '<span class="rp-ts">' + esc(fmtTs(r.ts)) + '</span>' +
        '</div>';
    }).join('') + '</div>';
  }

  // ---------- report body (shared by on-screen render + HTML export) ----------
  function tallyHtml(tally) {
    var t = arr(tally);
    if (!t.length) return '';
    return '<div class="rp-tally">' + t.map(function (x) {
      return '<span class="rp-chip ' + esc(x.c || '') + '"><b>' + esc(x.n) + '</b> ' + esc(x.l || '') + '</span>';
    }).join('') + '</div>';
  }

  function auditBody(r) {
    var h = '';
    var findings = arr(r.findings);
    if (findings.length) {
      h += '<div class="rp-sec">Findings</div>';
      h += findings.map(function (f) {
        return '<div class="rp-find' + (f.fixed ? ' fixed' : '') + '">' +
          '<div class="rp-find-h"><span class="rp-find-num">' + esc(f.num || '') + '</span>' +
          '<span class="rp-sev ' + esc(f.sev || 'low') + '">' + esc(f.sev || '') + '</span>' +
          '<span class="rp-find-cat">' + esc(f.cat || '') + '</span></div>' +
          '<div class="rp-find-body">' + esc(f.body || '') + '</div>' +
          (f.fix ? '<div class="rp-find-fix">' + esc(f.fix) + '</div>' : '') +
          '</div>';
      }).join('');
    }
    var apps = arr(r.apps);
    if (apps.length) {
      h += '<div class="rp-sec">Apps</div><table class="rp-table"><thead><tr><th>App</th><th>Size</th><th>Rendition</th></tr></thead><tbody>';
      h += apps.map(function (a) {
        return '<tr class="' + (a.flag ? 'rp-row-flag' : '') + '"><td><span class="rp-dot ' + esc(a.dot || 'na') + '"></span>' + esc(a.name || '') + '</td>' +
          '<td>' + esc(a.size || '') + '</td><td>' + esc(a.rd || '') + '</td></tr>';
      }).join('');
      h += '</tbody></table>';
    }
    var clean = arr(r.clean);
    if (clean.length) {
      h += '<div class="rp-sec">Clean</div><ul class="rp-clean">' + clean.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>';
    }
    return h;
  }

  function reviewBody(r) {
    var h = '';
    var lenses = arr(r.lenses);
    if (lenses.length) {
      h += '<div class="rp-sec">Lenses</div>';
      h += lenses.map(function (l) {
        return '<div class="rp-lens"><div class="rp-lens-h">' +
          '<span class="rp-pill ' + pillClass(l.status) + '">' + esc(l.status || '') + '</span>' +
          '<span class="rp-lens-name">' + esc(l.name || '') + '</span></div>' +
          '<div class="rp-lens-body">' + esc(l.body || '') + '</div></div>';
      }).join('');
    }
    if (r.call) h += '<div class="rp-call">' + esc(r.call) + '</div>';
    return h;
  }

  function researchBody(r) {
    var h = '';
    if (r.confidence) h += '<div class="rp-tally"><span class="rp-chip ' + pillClass(r.confidence) + '"><b>' + esc(r.confidence) + '</b> confidence</span></div>';
    if (r.answer) h += '<div class="rp-sec">Answer</div><p class="rp-summary">' + esc(r.answer) + '</p>';
    var findings = arr(r.findings);
    if (findings.length) {
      h += '<div class="rp-sec">Findings</div>';
      h += findings.map(function (grp) {
        var items = arr(grp.items).map(function (it) {
          return '<li>' + esc(it.text || '') + (it.url ? ' <a href="' + esc(it.url) + '" target="_blank" rel="noopener">' + esc(it.source || 'source') + '</a>' : '') + '</li>';
        }).join('');
        return '<div class="rp-find"><div class="rp-find-cat">' + esc(grp.subtopic || '') + '</div><ul class="rp-clean" style="margin-top:6px">' + items + '</ul></div>';
      }).join('');
    }
    var sources = arr(r.sources);
    if (sources.length) {
      h += '<div class="rp-sec">Sources</div><table class="rp-table"><thead><tr><th>#</th><th>Source</th><th>Date</th><th>Relevance</th></tr></thead><tbody>';
      h += sources.map(function (s) {
        return '<tr><td>' + esc(s.n || '') + '</td><td>' + esc(s.source || '') + '</td><td>' + esc(s.date || '') + '</td><td>' + esc(s.relevance || '') + '</td></tr>';
      }).join('');
      h += '</tbody></table>';
    }
    var gaps = arr(r.gaps);
    if (gaps.length) h += '<div class="rp-sec">Gaps / Caveats</div><ul class="rp-clean">' + gaps.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul>';
    return h;
  }

  function reportHeaderHtml(r) {
    return '<div class="rp-head"><span class="rp-pill ' + pillClass(r.verdictPill) + '">' + esc(r.verdictWord || r.verdictPill || '') + '</span>' +
      '<h3>' + esc(r.reportType || 'Report') + '</h3></div>' +
      '<div class="rp-meta">' + esc(r.target || '') + (r.target ? ' · ' : '') + esc(fmtTs(r.ts)) + (r.delta ? ' · ' + esc(r.delta) : '') + '</div>';
  }

  function reportBodyHtml(r) {
    var h = (r.summary ? '<p class="rp-summary">' + esc(r.summary) + '</p>' : '') + tallyHtml(r.tally);
    if (r.type === 'audit') h += auditBody(r);
    else if (r.type === 'review') h += reviewBody(r);
    else if (r.type === 'research') h += researchBody(r);
    return h;
  }

  // ---------- HTML export (generated from JSON, never stored) ----------
  var EXPORT_CSS = 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;background:oklch(14% 0.01 260);color:oklch(90% 0.008 260);line-height:1.5;padding:40px 20px;max-width:820px;margin:0 auto;}' +
    ':root{--text:oklch(90% 0.008 260);--text-dim:oklch(62% 0.008 260);--accent:oklch(72% 0.14 260);--surface:oklch(18% 0.012 260);--surface-2:oklch(22% 0.012 260);--border:oklch(24% 0.015 260);--radius:6px;}' +
    'h3{font-size:1.25rem;margin:0;}a{color:var(--accent);}';

  function exportHtml(slug, r) {
    var doc = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + esc(r.reportType || 'Report') + ' — ' + esc(slug) + '</title><style>' + EXPORT_CSS + '\n' +
      document.getElementById('agentreports-styles').textContent + '</style></head><body>' +
      reportHeaderHtml(r) + reportBodyHtml(r) + '</body></html>';
    var blob = new Blob([doc], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = slug + '-' + (r.id || 'report') + '.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---------- data ----------
  function fetchJSON(url) {
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }
  function reportsBase(slug) { return RAW + '/' + AGENTS_DIR + '/' + slug + '/reports/'; }

  function showReport(container, slug, r) {
    container.innerHTML = '<button class="rp-back" type="button">\u2190 All reports</button>' +
      reportHeaderHtml(r) + reportBodyHtml(r) +
      '<div class="rp-actions"><button class="rp-export" type="button">Export HTML</button></div>';
    container.querySelector('.rp-back').addEventListener('click', function () { mountList(container, slug); });
    container.querySelector('.rp-export').addEventListener('click', function () { exportHtml(slug, r); });
  }

  function mountList(container, slug) {
    container.innerHTML = '<div class="rp-loading">Loading reports\u2026</div>';
    fetchJSON(reportsBase(slug) + 'index.json').then(function (data) {
      var reports = arr(data && data.reports);
      container.innerHTML = renderListHtml(reports);
      container.querySelectorAll('.rp-item').forEach(function (it) {
        it.addEventListener('click', function () {
          var file = it.getAttribute('data-file');
          container.innerHTML = '<div class="rp-loading">Loading\u2026</div>';
          fetchJSON(reportsBase(slug) + file).then(function (r) { showReport(container, slug, r); })
            .catch(function () { container.innerHTML = '<button class="rp-back" type="button">\u2190 All reports</button><div class="rp-err">Couldn\u2019t load that report.</div>'; container.querySelector('.rp-back').addEventListener('click', function () { mountList(container, slug); }); });
        });
      });
    }).catch(function () {
      container.innerHTML = '<div class="rp-empty">No reports yet.</div>';
    });
  }

  function mount(container, slug /*, sidecar */) {
    injectStyles();
    mountList(container, slug);
  }

  window.AgentReports = { mount: mount };
})();
