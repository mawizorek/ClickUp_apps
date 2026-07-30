/* Inciardi Collection — the SUMMARY MATRIX.
 *
 * Michael: "a clean summary of my entire print collection. total counts. how many are placed.
 * how many are still in shoebox. in a tight matrix as a window for total summary (eventually
 * with drill in to: placed twice on this page and this page and 4 in shoebox) with direct
 * links."
 *
 * ============================================================================
 * WHY THIS IS ITS OWN FILE AND NOT MORE OF app.js.
 *
 * app.js reached 32,061 bytes when v6 shipped. The repo's own rule (GitHub MCP Operating
 * Standard) is that any file which has to be read back WHOLE stays under ~30KB, target ~22KB —
 * past that the read truncates silently and an edit gets built on a partial file. app.js is
 * already over the hard cap. Adding a fifth screen to it would have made the file that renders
 * this app unreadable by the thing that maintains it.
 *
 * So: one route, one file. `window.Summary` is a separate namespace and app.js delegates to it
 * (see App.mount). Neither file clobbers the other, and load order does not matter because
 * mounting happens after both have parsed.
 * 🔴 app.js STILL NEEDS SPLITTING — this file only stopped the bleeding. Next touch: pull the
 * binder stage into `binder.js` and the enter form into `enter.js`, same pattern.
 * ============================================================================
 *
 * ONE READ, NOT N+1. `GET /summary` returns prints + placements + totals in a single response.
 * The drill-in needs no further request, which is why tapping a row is instant and why the
 * numbers in a drawer can never disagree with the row that opened it.
 *
 * NOTHING HERE SUMS ANYTHING. Every total comes from the worker. See the arithmetic block on
 * the /summary route: `placed` counts SLOTS, `in_binder` is MIN(owned, placed), and a client
 * that re-derived either one would eventually drift from the route that also feeds the
 * shoe-box. One calculator.
 */
(function () {
  var data = null;
  var open = null;        // artwork_id of the expanded row, or null
  var sort = 'name';      // name | owned | placed | spare
  var filter = 'all';     // all | binder | box | wanted

  var FACE = { A: 'front', B: 'back' };

  /* Deep link into the binder at a specific sheet and face. The router parses `?sheet=&side=`
   * off the hash (see index.html), so this is a real address you can bookmark or send. */
  function slotHref(p) {
    return '#binder?sheet=' + encodeURIComponent(p.sheet_id) + '&side=' + p.side;
  }

  function placementsFor(id) {
    return (data.placements || []).filter(function (p) { return p.artwork_id === id; });
  }

  /* The drill-in line Michael described almost verbatim: "placed twice on this page and this
   * page and 4 in shoebox". Stated as prose because a nested table inside a table row is the
   * kind of thing that reads as a bug. */
  function whereLine(r) {
    var ps = placementsFor(r.artwork_id);
    var bits = ps.map(function (p) {
      return '<a href="' + slotHref(p) + '" class="wl">' +
        Core.esc(p.sheet_title || p.sheet_id) + ' &middot; ' + FACE[p.side] +
        ' &middot; slot ' + (p.position + 1) + '</a>';
    });
    var out = '';
    if (bits.length) {
      out += '<div class="dr-l"><span class="tag">in the binder</span>' + bits.join('') + '</div>';
    }
    if (r.spare > 0) {
      out += '<div class="dr-l"><span class="tag">in the shoe-box</span>' +
        '<span class="wl flat">' + r.spare + ' spare</span></div>';
    }
    if (!bits.length && r.qty_owned > 0) {
      out += '<div class="dr-l"><span class="tag">in the shoe-box</span>' +
        '<span class="wl flat">all ' + r.qty_owned + ', not placed yet</span></div>';
    }
    if (!bits.length && r.qty_owned === 0) {
      out += '<div class="dr-l"><span class="tag">nowhere</span>' +
        '<span class="wl flat">not owned, not placed</span></div>';
    }
    /* The one case worth spelling out, because the numbers look wrong until you read it:
     * one copy in several slots. The binder is a layout surface and duplicate placement is
     * legal (J2 ruling 3) — this is where that stops being confusing. */
    if (r.placed > r.qty_owned && r.qty_owned > 0) {
      out += '<p class="hint">Laid out in ' + r.placed + ' slots but you own ' + r.qty_owned +
        '. That is allowed — the binder is a plan, not an inventory — so nothing is spare.</p>';
    }
    return out || '<p class="hint">Nothing recorded.</p>';
  }

  function rows() {
    var list = (data.prints || []).slice();

    list = list.filter(function (r) {
      if (filter === 'binder') return r.placed > 0;
      if (filter === 'box') return r.spare > 0 || (r.qty_owned > 0 && r.placed === 0);
      if (filter === 'wanted') return r.qty_owned === 0 && r.placed > 0;
      return true;
    });

    // Numeric sorts go DESCENDING, because "sort by spare" means "show me the biggest pile".
    // Ties fall back to name so the order is stable rather than whatever the filter left.
    list.sort(function (a, b) {
      if (sort === 'name') return a.name.localeCompare(b.name);
      var d = (b[sort === 'owned' ? 'qty_owned' : sort] || 0) - (a[sort === 'owned' ? 'qty_owned' : sort] || 0);
      return d || a.name.localeCompare(b.name);
    });
    return list;
  }

  function cell(n, muted) {
    return '<td class="num' + (muted && !n ? ' zero' : '') + '">' + (n || (muted ? '·' : 0)) + '</td>';
  }

  function render() {
    var host = document.getElementById('sumWrap');
    var t = data.totals || {};
    var list = rows();

    /* THE WINDOW. Five numbers that answer "what do I have and where is it" without scrolling.
     * `copies` splits into in-binder + shoe-box, and those two always sum back to it — which is
     * the property that makes this readable at a glance instead of something to reconcile. */
    var strip =
      '<div class="mx">' +
        mxCell(t.prints, 'prints', 'distinct titles') +
        mxCell(t.copies, 'copies', 'counting duplicates') +
        mxCell(t.in_binder, 'in binder', 'copies on a sheet') +
        mxCell(t.spare, 'shoe-box', 'copies loose') +
        mxCell(t.placements + '<span class="of">/' + t.slots + '</span>', 'slots used', (t.sheets || 0) + ' sheets') +
      '</div>';

    var chips =
      '<div class="chips">' +
        chip('all', 'Everything', (data.prints || []).length) +
        chip('binder', 'In the binder', t.prints ? (data.prints || []).filter(function (r) { return r.placed > 0; }).length : 0) +
        chip('box', 'In the box', (data.prints || []).filter(function (r) { return r.spare > 0 || (r.qty_owned > 0 && r.placed === 0); }).length) +
        chip('wanted', 'Wanted', t.wanted || 0) +
      '</div>';

    if (!list.length) {
      host.innerHTML = strip + chips +
        '<div class="empty">Nothing matches this filter.</div>';
      wire();
      return;
    }

    var body = list.map(function (r) {
      var isOpen = open === r.artwork_id;
      var cls = r.qty_owned === 0 ? ' want' : '';
      var main =
        '<tr class="mrow' + cls + (isOpen ? ' on' : '') + '" data-id="' + Core.esc(r.artwork_id) + '">' +
          '<td class="nmc"><span class="cv" aria-hidden="true">' + (isOpen ? '&#9662;' : '&#9656;') + '</span>' +
            '<span class="nmt">' + Core.esc(r.name) + '</span>' +
            (r.qty_owned === 0 ? '<span class="wtag">wanted</span>' : '') + '</td>' +
          cell(r.qty_owned, true) +
          cell(r.placed, true) +
          cell(r.spare, true) +
        '</tr>';
      if (!isOpen) return main;
      return main +
        '<tr class="drow"><td colspan="4">' + whereLine(r) + '</td></tr>';
    }).join('');

    host.innerHTML = strip + chips +
      '<div class="mxt-wrap"><table class="mxt">' +
        '<thead><tr>' +
          '<th>' + sortBtn('name', 'Print') + '</th>' +
          '<th class="num">' + sortBtn('owned', 'Own') + '</th>' +
          '<th class="num">' + sortBtn('placed', 'Slots') + '</th>' +
          '<th class="num">' + sortBtn('spare', 'Box') + '</th>' +
        '</tr></thead><tbody>' + body + '</tbody>' +
      '</table></div>' +
      '<p class="hint"><b>Own</b> is copies you have. <b>Slots</b> is how many places it sits ' +
      'in the binder, which can be more than you own. <b>Box</b> is what is left over. ' +
      'Tap any row for where each one is.</p>';
    wire();
  }

  function mxCell(v, label, sub) {
    return '<div class="mx-c"><div class="v num">' + (v == null ? '—' : v) + '</div>' +
      '<div class="l">' + label + '</div><div class="s">' + sub + '</div></div>';
  }
  function chip(id, label, n) {
    return '<button class="chip" data-f="' + id + '" aria-pressed="' + (filter === id) + '">' +
      label + '<span class="n num">' + n + '</span></button>';
  }
  function sortBtn(key, label) {
    return '<button class="sortb" data-s="' + key + '" aria-pressed="' + (sort === key) + '">' +
      label + '</button>';
  }

  function wire() {
    var host = document.getElementById('sumWrap');
    [].forEach.call(host.querySelectorAll('.chip'), function (b) {
      b.addEventListener('click', function () { filter = b.getAttribute('data-f'); render(); });
    });
    [].forEach.call(host.querySelectorAll('.sortb'), function (b) {
      b.addEventListener('click', function () { sort = b.getAttribute('data-s'); render(); });
    });
    [].forEach.call(host.querySelectorAll('.mrow'), function (tr) {
      tr.addEventListener('click', function () {
        var id = tr.getAttribute('data-id');
        open = (open === id) ? null : id;   // tapping the open row closes it
        render();
      });
    });
  }

  window.Summary = {
    mount: function () {
      var host = document.getElementById('sumWrap');
      Core.busy(host, 'Counting the collection…');
      API.get('/summary').then(function (d) {
        data = d;
        if (!(d.prints || []).length) {
          host.innerHTML = '<div class="empty">No prints yet. <b>Enter</b> adds the first one.</div>';
          return;
        }
        render();
      }).catch(function (e) { Core.fail(host, e); });
    }
  };
})();
