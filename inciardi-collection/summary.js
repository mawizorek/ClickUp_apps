/* Inciardi Collection — the SUMMARY MATRIX.
 *
 * Michael: "a clean summary of my entire print collection. total counts. how many are placed.
 * how many are still in shoebox. in a tight matrix as a window for total summary (eventually
 * with drill in to: placed twice on this page and this page and 4 in shoebox) with direct
 * links."
 *
 * ONE READ, NOT N+1. `GET /summary` returns prints + placements + totals in a single response.
 * The drill-in needs no further request, which is why tapping a row is instant and why the
 * numbers in a drawer can never disagree with the row that opened it.
 *
 * ONE CALCULATOR. Every total comes from the worker. See the arithmetic block on the /summary
 * route: `placed` counts SLOTS, `in_binder` is MIN(owned, placed), and a client that re-derived
 * either one would eventually drift from the route that also feeds the shoe-box.
 * ⚠️ ONE DOCUMENTED EXCEPTION, `augment()` below — read its comment before adding a second.
 */
(function () {
  var data = null;
  var open = null;        // artwork_id of the expanded row, or null
  var sort = 'name';      // name | owned | placed | spare
  var filter = 'all';     // all | binder | box | wanted

  var FACE = { A: 'front', B: 'back' };

  /* ============================================================ WANTED IS NOT A HOLDING
   * Michael, 2026-07-30: "'wanted' shouldn't take on the same counting in this matrix, it's
   * misleading." He is right, and it was two specific numbers rather than a vibe:
   *
   *   `prints`      counted EVERY active artwork, so a title you have never owned inflated the
   *                 cell labelled "distinct titles" — the collection looked bigger than it is.
   *   `placements`  counted every slot with an artwork_id, so a gap marker read as a slot IN
   *                 USE. That sleeve is PHYSICALLY EMPTY. You can still put a print in it. So
   *                 "4/36 slots used" both overstated the binder and understated what is left
   *                 to do, in one number.
   *
   * The fix is separation, not deletion: the wishlist is real collection data and stays on
   * screen. It just gets its OWN numbers, on their own line, and the two sets never add.
   *
   * 🔴 WHY THIS ARITHMETIC IS HERE AND NOT ON THE WORKER, stated because it deviates from the
   * one-calculator rule directly above. It belongs on /summary next to the MIN/MAX block, and it
   * should move there the next time that file is opened — `worker.js` is 29.3KB against a 30KB
   * read cap, so every edit to it means retyping the whole file, and doing that blind in the
   * same pass as three UI changes is the higher risk by a mile.
   * The invariant the rule protects is INTACT: this runs ONCE, on the payload, before anything
   * renders, and writes onto the same `totals` object every surface reads. There is one copy of
   * each number and one place it is computed. What the rule forbids is two surfaces each doing
   * their own subtraction — that is still impossible here.
   * ⚠️ DO NOT add a second derived number anywhere else in this file. Add it to augment(), or
   * better, move all of this to the worker and delete the function. */
  function augment(d) {
    var t = d.totals || (d.totals = {});
    var prints = d.prints || [];
    var unowned = {};
    prints.forEach(function (r) { if (!r.qty_owned) unowned[r.artwork_id] = 1; });

    t.owned_titles = prints.filter(function (r) { return r.qty_owned > 0; }).length;
    /* NOT gated on placed > 0, unlike the worker's `totals.wanted`. Not owning it is what makes
     * it wanted; whether you have laid it out yet is a different question. Under the old gate an
     * un-placed wishlist title appeared in NO bucket at all — filtered out of "in the box"
     * because you own none, and out of "wanted" because it sits in no slot. */
    t.wanted_titles = prints.length - t.owned_titles;
    t.markers = (d.placements || []).filter(function (p) { return unowned[p.artwork_id]; }).length;
    t.placements_owned = (t.placements || 0) - t.markers;
  }

  /* Deep link into the binder at a specific sheet and face. The router parses `?sheet=&side=`
   * off the hash (see boot.js), so this is a real address you can bookmark or send. */
  function slotHref(p) {
    return '#binder?sheet=' + encodeURIComponent(p.sheet_id) + '&side=' + p.side;
  }

  function placementsFor(id) {
    return (data.placements || []).filter(function (p) { return p.artwork_id === id; });
  }

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* The drill-in line Michael described almost verbatim: "placed twice on this page and this
   * page and 4 in shoebox". Stated as prose because a nested table inside a table row is the
   * kind of thing that reads as a bug. */
  function whereLine(r) {
    var ps = placementsFor(r.artwork_id);
    var want = r.qty_owned === 0;
    var bits = ps.map(function (p) {
      return '<a href="' + slotHref(p) + '" class="wl">' +
        Core.esc(p.sheet_title || p.sheet_id) + ' &middot; ' + FACE[p.side] +
        ' &middot; slot ' + (p.position + 1) + '</a>';
    });
    var out = '';
    if (bits.length) {
      // A wanted print is not IN the binder, it is MARKED in it. Same links, honest label.
      out += '<div class="dr-l"><span class="tag">' +
        (want ? 'marking a gap' : 'in the binder') + '</span>' + bits.join('') + '</div>';
    }
    if (r.spare > 0) {
      out += '<div class="dr-l"><span class="tag">in the shoe-box</span>' +
        '<span class="wl flat">' + plural(r.spare, 'spare', 'spare') + '</span></div>';
    }
    if (!bits.length && r.qty_owned > 0) {
      out += '<div class="dr-l"><span class="tag">in the shoe-box</span>' +
        '<span class="wl flat">all ' + r.qty_owned + ', not placed yet</span></div>';
    }
    if (!bits.length && want) {
      out += '<div class="dr-l"><span class="tag">wanted</span>' +
        '<span class="wl flat">not owned, and not laid out anywhere yet</span></div>';
    }
    if (want && bits.length) {
      out += '<p class="hint">' + plural(bits.length, 'slot', 'slots') + ' held open for this. ' +
        'The sleeve is still empty, so it does not count as filled above.</p>';
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

  function isWanted(r) { return r.qty_owned === 0; }

  function rows() {
    var list = (data.prints || []).slice();

    list = list.filter(function (r) {
      if (filter === 'binder') return r.placed > 0 && !isWanted(r);
      if (filter === 'box') return r.spare > 0 || (r.qty_owned > 0 && r.placed === 0);
      if (filter === 'wanted') return isWanted(r);
      return true;
    });

    // Numeric sorts go DESCENDING, because "sort by spare" means "show me the biggest pile".
    // Ties fall back to name so the order is stable rather than whatever the filter left.
    list.sort(function (a, b) {
      /* 🔴 WANTED SINKS, ALWAYS — the sort half of "wanted shouldn't count the same." Interleaved,
       * a wishlist row lands between two owned ones and reads as a peer, and "sort by slots"
       * could even put a print you don't own at the top of your collection. Below the line it
       * reads as what it is: a list of what's missing, after the list of what you have.
       * Suspended when the wanted filter is on, because then the wishlist IS the subject. */
      if (filter !== 'wanted') {
        var aw = isWanted(a) ? 1 : 0, bw = isWanted(b) ? 1 : 0;
        if (aw !== bw) return aw - bw;
      }
      if (sort === 'name') return a.name.localeCompare(b.name);
      var k = sort === 'owned' ? 'qty_owned' : sort;
      return ((b[k] || 0) - (a[k] || 0)) || a.name.localeCompare(b.name);
    });
    return list;
  }

  function cell(n, muted) {
    return '<td class="num' + (muted && !n ? ' zero' : '') + '">' + (n || (muted ? '\u00b7' : 0)) + '</td>';
  }

  /* THE THREE NUMERIC CELLS. An owned row prints integers. A wanted row prints NO DIGIT it does
   * not deserve: Own and Box are a middot, because a 0 is a quantity and invites addition, while
   * a middot says "not applicable here." Its slot count survives as a DASHED marker chip —
   * dashed is the app's word for wanted everywhere else (see the border language in binder.css),
   * so the number is still legible as a marker rather than as inventory. */
  function numCells(r) {
    if (!isWanted(r)) return cell(r.qty_owned, true) + cell(r.placed, true) + cell(r.spare, true);
    return '<td class="num na">\u00b7</td>' +
      '<td class="num">' + (r.placed ? '<span class="mk">' + r.placed + '</span>' : '\u00b7') +
      '</td>' +
      '<td class="num na">\u00b7</td>';
  }

  function render() {
    var host = document.getElementById('sumWrap');
    var t = data.totals || {};
    var list = rows();

    /* THE WINDOW. Five numbers that answer "what do I have and where is it" without scrolling.
     * `copies` splits into in-binder + shoe-box, and those two always sum back to it — which is
     * the property that makes this readable at a glance instead of something to reconcile.
     * EVERY CELL HERE IS A THING YOU OWN. The wishlist gets its own line below, deliberately
     * outside the box, so nothing in this strip can be misread as a possession. */
    var strip =
      '<div class="mx">' +
        mxCell(t.owned_titles, 'prints', 'titles you own') +
        mxCell(t.copies, 'copies', 'counting duplicates') +
        mxCell(t.in_binder, 'in binder', 'copies on a sheet') +
        mxCell(t.spare, 'shoe-box', 'copies loose') +
        mxCell(t.placements_owned + '<span class="of">/' + t.slots + '</span>',
               'slots filled', (t.sheets || 0) + ' sheets') +
      '</div>';

    /* The wishlist line. OUTSIDE the strip, dashed, and it says out loud that it is not counted
     * above — because the reason Michael flagged this is that a number on screen next to other
     * numbers gets added up whether you meant it to or not. */
    if (t.wanted_titles) {
      strip += '<p class="mx-want"><span class="wtag">wanted</span> ' +
        plural(t.wanted_titles, 'title', 'titles') + ' you don\'t own yet' +
        (t.markers ? ', holding ' + plural(t.markers, 'slot', 'slots') + ' open in the binder' : '') +
        '. <b>Not counted above</b>, and those slots still read as free.</p>';
    }

    var chips =
      '<div class="chips">' +
        chip('all', 'Everything', (data.prints || []).length) +
        chip('binder', 'In the binder', (data.prints || []).filter(function (r) {
          return r.placed > 0 && !isWanted(r); }).length) +
        chip('box', 'In the box', (data.prints || []).filter(function (r) {
          return r.spare > 0 || (r.qty_owned > 0 && r.placed === 0); }).length) +
        chip('wanted', 'Wanted', t.wanted_titles || 0) +
      '</div>';

    if (!list.length) {
      host.innerHTML = strip + chips +
        '<div class="empty">Nothing matches this filter.</div>';
      wire();
      return;
    }

    var body = list.map(function (r) {
      var isOpen = open === r.artwork_id;
      var main =
        '<tr class="mrow' + (isWanted(r) ? ' want' : '') + (isOpen ? ' on' : '') +
            '" data-id="' + Core.esc(r.artwork_id) + '">' +
          '<td class="nmc"><span class="cv" aria-hidden="true">' + (isOpen ? '&#9662;' : '&#9656;') + '</span>' +
            '<span class="nmt">' + Core.esc(r.name) + '</span>' +
            (isWanted(r) ? '<span class="wtag">wanted</span>' : '') + '</td>' +
          numCells(r) +
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
      'Tap any row for where each one is.</p>' +
      '<p class="hint">Rows marked <b>wanted</b> sit below the ones you own and print no ' +
      'quantities, because you have none. Their slot count is a marker, not a holding.</p>';
    wire();
  }

  function mxCell(v, label, sub) {
    return '<div class="mx-c"><div class="v num">' + (v == null ? '\u00b7' : v) + '</div>' +
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
      Core.busy(host, 'Counting the collection\u2026');
      API.get('/summary').then(function (d) {
        augment(d);          // ONCE, on the payload, before anything renders. See its comment.
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
