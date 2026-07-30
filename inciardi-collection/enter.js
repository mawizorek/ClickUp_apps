/* Inciardi Collection — ENTER and SHOE-BOX.
 *
 * EXTRACTED FROM app.js 2026-07-30, verbatim. Two screens rather than two files because
 * together they are ~7KB: splitting to one-module-per-route for its own sake would trade a
 * real problem (a 32KB file nobody can read whole) for a pointless one (six files to open to
 * follow one flow). The rule is a size budget, not a file count.
 *
 * They belong together on their own terms too: Enter is how a print gets into the collection,
 * Shoe-box is where it sits until it earns a slot. Neither knows anything about the binder
 * stage, and the binder does not know about them.
 *
 * TWO RULES, same as everywhere in this app:
 *   1. NO OPTIMISTIC UI — every write waits for the server, then re-reads.
 *   2. Every "how many do I own" comes from the server (v_owned, SUM(qty)), never from a
 *      length or a COUNT(*) computed here.
 */
(function () {

  /* ================================================================ ENTER */

  function slugPreview(s) {
    return String(s || '').toLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '').slice(0, 64);
  }

  function mountEnter() {
    var f = document.getElementById('enterForm');
    var name = document.getElementById('f_name');
    var idIn = document.getElementById('f_id');
    var idEcho = document.getElementById('idEcho');
    var own = document.getElementById('f_own');
    var qtyWrap = document.getElementById('qtyWrap');
    var out = document.getElementById('enterOut');

    /* Show the derived id live. It is PERMANENT identity, so seeing it before the write
     * beats explaining it after. */
    function echo() {
      var id = idIn.value.trim() || slugPreview(name.value);
      idEcho.textContent = id || '—';
    }
    name.addEventListener('input', echo);
    idIn.addEventListener('input', echo);
    echo();

    own.addEventListener('change', function () { qtyWrap.hidden = !own.checked; });
    qtyWrap.hidden = !own.checked;

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('enterBtn');
      var payload = {
        name: name.value.trim(),
        artwork_id: idIn.value.trim() || undefined,
        collection_id: document.getElementById('f_collection').value.trim() || undefined,
        category: document.getElementById('f_category').value,
        edition_type: document.getElementById('f_edtype').value,
        retail: document.getElementById('f_retail').value,
        notes: document.getElementById('f_notes').value.trim() || undefined,
        own: own.checked,
        qty: document.getElementById('f_qty').value,
        acquired_where: document.getElementById('f_where').value.trim() || undefined
      };
      if (!payload.name) { Core.toast('Name is required', 'bad'); return; }
      btn.disabled = true; btn.textContent = 'Saving…';
      API.post('/artwork', payload).then(function (d) {
        out.hidden = false;
        var ed = (d.editions || []).map(function (x) { return x.edition_id; }).join(', ');
        out.innerHTML =
          '<b>' + Core.esc(payload.name) + '</b> is canonical.<br>' +
          '<span class="tag">artwork</span> <span class="num">' + Core.esc(d.artwork_id) + '</span><br>' +
          '<span class="tag">edition</span> <span class="num">' + Core.esc(ed) + '</span>' +
          (d.copy_id ? '<br><span class="tag">copy</span> <span class="num">' + Core.esc(d.copy_id) + '</span>' : '') +
          (d.copy_error ? '<br><span class="badge bad">copy failed</span> ' + Core.esc(d.copy_error) : '');
        Core.toast(d.copy_error ? 'Artwork saved, copy failed' : 'Saved', d.copy_error ? 'bad' : 'good');
        f.reset();
        document.getElementById('f_category').value = 'mini';
        qtyWrap.hidden = true; echo(); name.focus();
        /* Force the binder's picker to re-read. It caches the artwork list, and after this
         * write that cache is a print short. Cross-module on purpose: the alternative is
         * every module keeping its own copy of the catalog, which is the drift this app was
         * rebuilt to eliminate. */
        if (window.Binder && Binder.invalidateArtworks) Binder.invalidateArtworks();
      }).catch(function (err) {
        Core.toast(err.message, 'bad');
      }).then(function () {
        btn.disabled = false; btn.textContent = 'Save print';
      });
    });
  }

  /* ============================================================== SHOE-BOX
   * DEFAULT CHANGED 2026-07-30 (Michael): "shoebox should default to showing what's not in the
   * binder but owned since the matrix shows how many actually live in shoebox vs binder."
   *
   * v4 showed unhoused AND spares stacked together, because at that point nothing else could
   * tell you the binder/box split. The Summary matrix now owns that arithmetic, so this page
   * goes back to being one question — WHAT HAS NO PLACE YET — which is also the question the
   * physical shoe-box asks when you tip it out looking for something to lay down.
   *
   * Spares are still one tap away rather than deleted: they ARE in the box, and hiding them
   * entirely would make this page quietly disagree with the matrix. Two claimants on one truth
   * is the disease; the same truth at two zoom levels is not. */
  var boxView = 'unhoused';   // unhoused | spare

  function boxRow(r) {
    var right = r.box_state === 'spare'
      ? '<span class="badge good">' + r.spare + ' spare</span>' +
        '<span class="badge">' + r.placed_count + ' in binder</span>'
      : '<span class="badge good">own ' + r.qty_owned + '</span>';
    return '<div class="item">' +
      '<span class="tile">' + Core.esc(Core.initials(r.name)) + '</span>' +
      '<span class="body"><b class="nm">' + Core.esc(r.name) + '</b>' +
      '<span class="tag">' + Core.esc(r.artwork_id) + (r.category ? ' · ' + Core.esc(r.category) : '') + '</span></span>' +
      '<span class="right">' + right + '</span>' +
      '</div>';
  }

  function renderBox(rows) {
    var wrap = document.getElementById('boxWrap');
    var unhoused = rows.filter(function (r) { return r.box_state === 'unhoused'; });
    var spare = rows.filter(function (r) { return r.box_state === 'spare'; });
    var show = boxView === 'spare' ? spare : unhoused;

    var chips = '<div class="chips">' +
      '<button class="chip" data-v="unhoused" aria-pressed="' + (boxView === 'unhoused') + '">' +
      'Not placed yet<span class="n num">' + unhoused.length + '</span></button>' +
      '<button class="chip" data-v="spare" aria-pressed="' + (boxView === 'spare') + '">' +
      'Spares<span class="n num">' + spare.length + '</span></button>' +
      '</div>';

    var note = boxView === 'spare'
      ? '<p class="hint">One of each is already laid out. These counts are the extras still in the box.</p>'
      : '<p class="hint">Owned, and nowhere in the binder yet. This is the pile to pull from.</p>';

    var list = show.length
      ? '<div class="list">' + show.map(boxRow).join('') + '</div>'
      : '<div class="empty">' + (boxView === 'spare'
          ? 'No duplicates. Every copy you own has its own slot.'
          : 'Nothing loose. Everything you own is in the binder.') + '</div>';

    wrap.innerHTML = chips + note + list;
    [].forEach.call(wrap.querySelectorAll('.chip'), function (b) {
      b.addEventListener('click', function () {
        boxView = b.getAttribute('data-v'); renderBox(rows);
      });
    });
  }

  function mountShoebox() {
    var wrap = document.getElementById('boxWrap');
    Core.busy(wrap, 'Loading the shoe-box…');
    API.get('/shoebox').then(function (d) {
      var rows = d.shoebox || [];
      if (!rows.length) {
        wrap.innerHTML = '<div class="empty">The box is empty. Every copy you own is in a slot.</div>';
        return;
      }
      renderBox(rows);
    }).catch(function (e) { Core.fail(wrap, e); });
  }

  window.Enter = { mount: mountEnter };
  window.Shoebox = { mount: mountShoebox };
})();
