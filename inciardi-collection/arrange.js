/* Inciardi Collection — THE ARRANGEMENT EDITOR. Owns WHERE each print sits, plus its own surface.
 *
 * ============================================================================
 * 🔴 WHY THIS FILE EXISTS: A CONFIRMATION SCREEN YOU CANNOT CORRECT IS A TRIVIA QUESTION.
 *
 * Michael, 2026-07-31: "the slots did not line up at all with what's true... or make it editable
 * to me before committing" — then, offered a read-only 3x3 grid: "the preview grid is only helpful
 * if i can edit it."
 *
 * He is right, and the reason is mechanical. v16's preview listed eighteen rows as `front 1 Ninja
 * Turtle`. Checking a 3x3 arrangement against the sheet in your hand from a flat list means doing
 * position arithmetic in your head — so the single class of error present in that batch was the
 * one class the screen could not surface. A grid fixes SEEING it. Only editing fixes IT.
 *
 * WHAT ACTUALLY WENT WRONG, because it dictates which controls come first: the ice-cream sheet was
 * photographed on its side and transcribed row-wise anyway, so all eighteen cards were off by ONE
 * 90-degree rotation, identical on both faces. Not a scramble. The Drinks sheet before it had its
 * two faces inverted. Both are RIGID TRANSFORMS of an otherwise correct reading, which is why
 * rotate / mirror / swap-faces are the primary controls and per-cell swapping is the fallback:
 * three taps beat eighteen, and eighteen taps is where new mistakes come from.
 *
 * 🔴 THE INVARIANT THAT MAKES THIS SAFE: EVERY OPERATION IN HERE IS A PERMUTATION.
 * Rotate, mirror, swap-faces and cell-swap all MOVE ids between pockets. None can add an id,
 * remove one, or duplicate one. So everything batch.js validated — names present, ids legal,
 * nothing placed twice, nothing described but never placed — stays true no matter what you press,
 * and does not need re-running against an edited arrangement. `check()` ASSERTS that after every
 * op instead of trusting it, because an editor that quietly dropped a print would produce a sheet
 * with a hole and a run log that read perfectly clean.
 *
 * ⚠️ AND THE HAZARD THAT ARRIVES WITH IT: EDITING HERE DOES NOT EDIT THE FILE.
 * `batches/<name>.json` is static and this app cannot write to the repo. So the moment you rotate
 * something and import it, D1 is right and the file is wrong — two claimants on one truth, and the
 * dangerous half is LATER: slots are written `ON CONFLICT DO UPDATE`, so a future re-import from
 * that unfixed file would silently re-seat every print back into the wrong pocket and log a clean
 * run while doing it. That is why a dirty arrangement paints a banner, and why "Copy corrected
 * grids" is one tap — the fix has to be as cheap as the mistake. It WARNS rather than BLOCKS:
 * gating a correction behind a clipboard round-trip on a phone would make the honest path the
 * slow one, and the slow path is the one that gets skipped.
 * ============================================================================
 *
 * SEAM: this file owns arrangement STATE and the arrangement SURFACE together, deliberately. The
 * grid markup is a direct projection of the private grids below; splitting them would mean
 * exporting the grid shape purely so another file could loop over it. `preview.js` still composes
 * the page and still decides nothing — it asks for this block and drops it in.
 */
(function () {

  var grids = null;   // { A: 3x3 of artwork_id|null, B: same } — a null FACE means one-sided
  var dict  = null;   // artwork_id -> { name, notes }, carried through untouched
  var base  = null;   // the arrangement as the FILE wrote it, for reset + dirty
  var ops   = [];     // what has been pressed, in order, in words
  var sel   = null;   // 'A4' etc — the first tap of a two-tap swap
  var onChange = null;

  function grid3() { return [[null, null, null], [null, null, null], [null, null, null]]; }
  function clone(g) { return g ? g.map(function (r) { return r.slice(); }) : null; }
  function key(side, pos) { return side + pos; }

  /* The flat list every other file speaks, rebuilt from the grids. Front-then-back in reading
   * order by construction, which is the order `batch.js` sorted into and the order the run log
   * comes out in — so a person can follow the log down the physical sheet. */
  function flatten(g) {
    var out = [];
    ['A', 'B'].forEach(function (side) {
      if (!g[side]) return;
      g[side].forEach(function (row, r) {
        row.forEach(function (id, c) {
          if (!id) return;
          var p = dict[id] || {};
          out.push({ side: side, position: r * 3 + c, id: id,
                     name: p.name, notes: p.notes || null });
        });
      });
    });
    return out;
  }

  function census(g) {
    return flatten(g).map(function (p) { return p.id; }).sort().join('|');
  }

  /* 🔴 THE PERMUTATION ASSERTION. Runs after every operation, compares the multiset of placed ids
   * against what the file declared, and REVERTS the operation if they differ. This can only fire
   * on a bug in the transforms below — which is exactly why it is here rather than in a comment
   * claiming they are correct. A dropped or duplicated print is invisible on a 3x3 of short names
   * and would sail through the run as a clean log. */
  function check(before, label) {
    if (census(grids) === census(base)) return true;
    grids = before;
    if (window.Core && Core.toast) {
      Core.toast('“' + label + '” was refused — it did not preserve every print. Nothing moved.', 'bad');
    }
    return false;
  }

  function apply(label, fn) {
    var before = { A: clone(grids.A), B: clone(grids.B) };
    fn();
    if (!check(before, label)) return;
    ops.push(label);
    sel = null;
    if (onChange) onChange();
  }

  /* ---------------------------------------------------------------- THE TRANSFORMS
   * Index arithmetic in ONE place, each verified against a worked 3x3 in its own comment. This is
   * the class of code that is wrong 25% of the time and looks right 100% of the time. */

  //  a b c        g d a
  //  d e f   →    h e b        new[r][c] = old[2-c][r]
  //  g h i        i f c
  function cw(g) {
    var n = grid3();
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) n[r][c] = g[2 - c][r];
    return n;
  }

  //  a b c        c f i
  //  d e f   →    b e h        new[r][c] = old[c][2-r]
  //  g h i        a d g
  function ccw(g) {
    var n = grid3();
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) n[r][c] = g[c][2 - r];
    return n;
  }

  /* MIRROR EARNS ITS BUTTON, it is not symmetry for its own sake. Turning a binder page over
   * reverses left and right, so a back face photographed as if it were a front face is
   * horizontally flipped — a real, likely transcription error with no rotation involved. */
  function mirror(g) {
    return g.map(function (row) { return row.slice().reverse(); });
  }

  /* ---------------------------------------------------------------- PUBLIC OPS */

  function rotate(side, dir) {
    if (!grids[side]) return;
    apply('rotate ' + faceWord(side) + ' ' + (dir === 'cw' ? '90° right' : '90° left'), function () {
      grids[side] = dir === 'cw' ? cw(grids[side]) : ccw(grids[side]);
    });
  }

  function flip(side) {
    if (!grids[side]) return;
    apply('mirror ' + faceWord(side) + ' left–right', function () {
      grids[side] = mirror(grids[side]);
    });
  }

  /* Legal on a one-sided sheet too: a lone face photographed as the front when it was the back is
   * precisely the Drinks mistake, and it moves every print from side A to side B. */
  function swapFaces() {
    apply('swap front ↔ back', function () {
      var a = grids.A; grids.A = grids.B; grids.B = a;
    });
  }

  /* Two taps, no dragging. Drag-and-drop on a phone competes with page scroll and needs a long
   * press to disambiguate; tap-select-tap works with one thumb and reads back what it is doing.
   * Cross-face swaps come free because both grids are on screen at once. */
  function tap(side, pos) {
    if (!grids[side]) return;
    var k = key(side, pos);
    if (sel === k) { sel = null; if (onChange) onChange(); return; }
    if (!sel) { sel = k; if (onChange) onChange(); return; }

    var aSide = sel.charAt(0), aPos = parseInt(sel.slice(1), 10);
    var an = name(aSide, aPos), bn = name(side, pos);
    apply('swap ' + an + ' ↔ ' + bn, function () {
      var ar = Math.floor(aPos / 3), ac = aPos % 3;
      var br = Math.floor(pos / 3),  bc = pos % 3;
      var tmp = grids[aSide][ar][ac];
      grids[aSide][ar][ac] = grids[side][br][bc];
      grids[side][br][bc] = tmp;
    });
  }

  function reset() {
    apply('reset to the file', function () {
      grids = { A: clone(base.A), B: clone(base.B) };
    });
    ops = [];
    if (onChange) onChange();
  }

  /* ---------------------------------------------------------------- HELPERS */

  function faceWord(side) {
    return (window.Binder && Binder.face) ? Binder.face(side).toLowerCase()
                                          : (side === 'A' ? 'front' : 'back');
  }

  function at(side, pos) {
    if (!grids[side]) return null;
    return grids[side][Math.floor(pos / 3)][pos % 3];
  }

  function name(side, pos) {
    var id = at(side, pos);
    return id ? ((dict[id] && dict[id].name) || id)
              : (faceWord(side) + ' ' + (pos + 1) + ', empty');
  }

  function dirty() { return JSON.stringify(grids) !== JSON.stringify(base); }

  /* The corrected grids, in the exact shape the batch file wants them pasted back as. Emitting the
   * WHOLE file would be worse: it would go stale against every other field the moment anyone edits
   * a note, and it invites replacing a file wholesale from a screen that only ever knew about
   * positions. Two keys, nothing else. */
  function json() {
    function block(g) {
      if (!g) return null;
      return '[\n' + g.map(function (row) {
        return '    [' + row.map(function (id) {
          return id ? '"' + id + '"' : 'null';
        }).join(', ') + ']';
      }).join(',\n') + '\n  ]';
    }
    var out = [];
    if (grids.A) out.push('  "front": ' + block(grids.A));
    if (grids.B) out.push('  "back": ' + block(grids.B));
    return out.join(',\n\n');
  }

  /* ---------------------------------------------------------------- THE SURFACE */

  function esc(s) { return Core.esc(String(s == null ? '' : s)); }

  function cell(side, pos, verdict) {
    var id = at(side, pos);
    var cls = ['ar-cell'];
    if (!id) cls.push('empty');
    if (sel === key(side, pos)) cls.push('sel');
    if (verdict) cls.push('v-' + verdict);
    return '<button type="button" class="' + cls.join(' ') + '"' +
      ' data-ar="cell" data-side="' + side + '" data-pos="' + pos + '"' +
      ' aria-pressed="' + (sel === key(side, pos) ? 'true' : 'false') + '">' +
      '<span class="ar-n">' + (pos + 1) + '</span>' +
      '<span class="ar-t">' + (id ? esc(dict[id] && dict[id].name) : '—') + '</span>' +
      '</button>';
  }

  function face(side, verdicts) {
    if (!grids[side]) return '';
    var cells = '';
    for (var p = 0; p < 9; p++) {
      var v = verdicts[key(side, p)];
      cells += cell(side, p, v);
    }
    return '<section class="ar-face">' +
      '<div class="ar-fh">' +
        '<h3 class="ar-fn">' + esc(faceWord(side)) + '</h3>' +
        '<div class="ar-tools">' +
          '<button type="button" data-ar="ccw" data-side="' + side + '"' +
            ' title="Rotate this face 90° left" aria-label="Rotate ' + esc(faceWord(side)) +
            ' left">↺</button>' +
          '<button type="button" data-ar="cw" data-side="' + side + '"' +
            ' title="Rotate this face 90° right" aria-label="Rotate ' + esc(faceWord(side)) +
            ' right">↻</button>' +
          '<button type="button" data-ar="flip" data-side="' + side + '"' +
            ' title="Mirror this face left–right" aria-label="Mirror ' + esc(faceWord(side)) +
            '">⇄</button>' +
        '</div>' +
      '</div>' +
      '<div class="ar-grid">' + cells + '</div>' +
    '</section>';
  }

  /* The grid is laid out like the sheet, so "is this right" is a glance at the object in your hand
   * rather than arithmetic. It does NOT replace the verdict table below it: the grid answers WHERE
   * each print goes, the table answers WHAT HAPPENS to it (new / place only / replaces what is
   * there) with room for full names and ids. Two questions, two surfaces, on purpose. */
  function html(plan) {
    var verdicts = {};
    (plan && plan.rows || []).forEach(function (r) {
      verdicts[key(r.p.side, r.p.position)] =
        r.slotState === 'clash' ? 'clash' : r.slotState === 'same' ? 'same' : r.artState;
    });

    return '<div class="ar" id="brArrange">' +
      '<div class="ar-top">' +
        '<p class="ar-lead">Laid out like the sheet. <b>Tap two pockets to swap them</b>, or fix a ' +
          'whole face at once with the arrows.</p>' +
        '<div class="ar-tools ar-global">' +
          '<button type="button" data-ar="faces">Swap front ↔ back</button>' +
          '<button type="button" data-ar="reset"' + (dirty() ? '' : ' disabled') + '>Reset</button>' +
        '</div>' +
      '</div>' +
      face('A', verdicts) + face('B', verdicts) +
      drift() +
    '</div>';
  }

  /* 🔴 THE DRIFT BANNER. Only ever drawn when the arrangement no longer matches the file, and it
   * names the consequence rather than the state — "edited" is not information, "the next import
   * from this file will undo it" is. Lists the ops so the receipt is legible, and hands over the
   * two JSON keys to paste back. */
  function drift() {
    if (!dirty()) return '';
    return '<div class="ar-drift">' +
      '<p><b>You have moved things, and the batch file does not know.</b> This run will write what ' +
        'is on screen — but <code>batches/</code> still holds the old arrangement, and slots are ' +
        'written over on conflict, so the next import from that file would quietly put everything ' +
        'back where it was.</p>' +
      '<ul class="ar-ops">' + ops.map(function (o) {
        return '<li>' + esc(o) + '</li>';
      }).join('') + '</ul>' +
      '<div class="ar-tools">' +
        '<button type="button" data-ar="copy">Copy corrected grids</button>' +
      '</div>' +
      '<pre class="out ar-json" id="arJson" hidden></pre>' +
    '</div>';
  }

  /* Re-wired after every render, because the host replaces its own innerHTML. One delegated
   * listener on the container rather than nine-plus per face: fewer handles to leak and the cells
   * are rebuilt on every change anyway. */
  function wire() {
    var host = document.getElementById('brArrange');
    if (!host) return;
    host.addEventListener('click', function (e) {
      var el = e.target.closest('[data-ar]');
      if (!el || !host.contains(el)) return;
      var op = el.getAttribute('data-ar');
      var side = el.getAttribute('data-side');
      if (op === 'cell')  return tap(side, parseInt(el.getAttribute('data-pos'), 10));
      if (op === 'cw')    return rotate(side, 'cw');
      if (op === 'ccw')   return rotate(side, 'ccw');
      if (op === 'flip')  return flip(side);
      if (op === 'faces') return swapFaces();
      if (op === 'reset') return reset();
      if (op === 'copy')  return copy();
    });
  }

  /* Reveals the text AND tries the clipboard, in that order of trust. `navigator.clipboard` needs
   * a secure context and can be refused without explanation; a visible <pre> he can select by hand
   * always works, and this screen's whole premise is not claiming something happened when it may
   * not have. */
  function copy() {
    var pre = document.getElementById('arJson');
    var text = json();
    if (pre) { pre.hidden = false; pre.textContent = text; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        Core.toast('Corrected grids copied', 'good');
      }).catch(function () {
        Core.toast('Could not reach the clipboard — select the text below', 'warn');
      });
    } else {
      Core.toast('Select the text below to copy it', 'warn');
    }
  }

  window.Arrange = {
    /* Called once per loaded batch, BEFORE the plan is built — everything downstream reads
     * positions from here, so an unseeded editor would plan against nothing. */
    from: function (batch) {
      var g = { A: null, B: null };
      dict = {};
      (batch.prints || []).forEach(function (p) {
        dict[p.id] = { name: p.name, notes: p.notes };
        if (!g[p.side]) g[p.side] = grid3();
        g[p.side][Math.floor(p.position / 3)][p.position % 3] = p.id;
      });
      grids = g;
      base = { A: clone(g.A), B: clone(g.B) };
      ops = [];
      sel = null;
    },

    /* 🔴 THE ONE TRUE READ OF WHERE THINGS GO. `backroom.js` plans and writes from this, never from
     * `batch.prints`, or the screen would show an edit the run then ignored. */
    prints: function () { return flatten(grids); },

    onChange: function (fn) { onChange = fn; },
    dirty: dirty,
    ops: function () { return ops.slice(); },
    json: json,
    html: html,
    wire: wire
  };
})();
