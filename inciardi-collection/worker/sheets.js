/* Inciardi Collection — THE BINDER MECHANICS. Three routes: create, rename, reorder a sheet.
 *
 * ============================================================================
 * SPLIT OUT OF `worker.js` 2026-08-01, AND THE SEAM WAS ALREADY WRITTEN DOWN.
 *
 * worker.js's header had named this exact split for a day: *"/sheet, /sheet/rename and
 * /sheet/reorder are ~6KB of binder mechanics with nothing to do with entering a print — they
 * become worker/sheets.js the moment anything else needs to land here."* Something did.
 *
 * 🔴 THE HONEST REASON IT HAPPENED TODAY: I pushed worker.js from 21,169 to 24,503 bytes by
 * adding a four-file map and a dispatch comment to a file with about 1KB of headroom — and I
 * did it in the same commit that fixed `images.js` for the identical mistake. TWO CEILING
 * BREACHES IN ONE SESSION, BOTH COMMENT WEIGHT, BOTH CAUGHT ONLY BY READING THE BYTE COUNT IN
 * THE PUSH RESPONSE.
 *
 * ⭐ Two in one session is not two lapses, it is a missing step. The rule that would have
 * caught both: MEASURE THE FILE YOU ARE ABOUT TO WRITE INTO, BEFORE YOU WRITE. A file at 21KB
 * has room for a dispatch OR a header, not both. "Is there a clean seam" is the wrong first
 * question; "how many bytes are left" is.
 *
 * NOTHING CHANGED IN THE MOVE. Same routes, same SQL, same comments, verbatim — the same
 * discipline as the reads.js split, and for the same reason: a split commit is exactly where a
 * quiet behavioural edit hides.
 * ============================================================================
 *
 * CONTRACT with worker.js: dispatched AFTER the JSON body parse, because unlike the image
 * routes these bodies really are JSON. Returns a Response, or `null` for "not my route".
 */

export const SHEET_ROUTES = ['POST /sheet', 'POST /sheet/rename', 'POST /sheet/reorder'];

export async function handleSheet(ctx) {
  const { db, all, write, reply, body, path, method, t } = ctx;
  if (method !== 'POST') return null;

  if (path === '/sheet') {
    const bid = String(body.binder_id || 'mini-binder');
    await db.prepare('INSERT OR IGNORE INTO binder (binder_id,name,created_at,updated_at) VALUES (?,?,?,?)')
      .bind(bid, body.binder_name || 'Mini Prints', t, t).run();
    const nxt = await all('SELECT COALESCE(MAX(sheet_order)+1,0) AS n FROM sheet WHERE binder_id = ?', [bid]);
    const order = body.sheet_order == null ? nxt[0].n : parseInt(body.sheet_order, 10);
    return write(
      `INSERT INTO sheet (sheet_id,binder_id,title,collection_id,sheet_order,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?)`,
      [body.sheet_id || (bid + '-s' + order), bid, body.title || null,
       body.collection_id || null, order, t, t]);
  }
  /* ⚠️ YES, `sheet.collection_id` IS STILL REAL and the line above is correct. Migration 001
   * dropped the column from `artwork`, NOT from `sheet` — a sheet's collection is an optional
   * HINT about what it holds (schema.binder.sql). Two different columns, one name. Do not
   * "fix" this one while sweeping for the other. */

  /* ============================================================ /sheet/rename
   * Title only. `title` is free text and deliberately nullable — a sheet with no title falls
   * back to its id in the UI, so clearing the box is a real choice rather than an error.
   * Nothing else about the sheet is touched, and NOTHING inside it moves.
   */
  if (path === '/sheet/rename') {
    const id = String(body.sheet_id || '').trim();
    if (!id) return reply({ ok: false, error: 'sheet_id is required' }, 400);
    const rows = await all('SELECT sheet_id FROM sheet WHERE sheet_id = ?', [id]);
    if (!rows.length) return reply({ ok: false, error: 'no sheet "' + id + '"' }, 404);
    const title = body.title == null ? null : String(body.title).trim();
    return write('UPDATE sheet SET title = ?, updated_at = ? WHERE sheet_id = ?', [title || null, t, id]);
  }

  /* ============================================================ /sheet/reorder
   * Rearrange the binder. Takes the COMPLETE desired order of sheet_ids, not a swap or a
   * single move.
   *
   * WHY A WHOLE-ORDER PAYLOAD: a "move sheet X up one" API has to reason about neighbours
   * server-side, and every off-by-one lives in that arithmetic. A full permutation is
   * idempotent, trivially verifiable, and lets the client express any rearrangement —
   * including a future drag-and-drop — through the same one route.
   *
   * 🔴 THE TRAP, AND THE SCHEMA COMMENT THAT WOULD HAVE WALKED ME INTO IT.
   * `sheet` carries UNIQUE (binder_id, sheet_order), so a naive one-by-one renumber collides
   * mid-flight. `schema.binder.sql` said to fix that with "a temporary NEGATIVE-offset pass" —
   * and the very same table has CHECK (sheet_order >= 0), which makes every negative value
   * UNWRITEABLE. Following the documented remedy would fail 100% of the time. Corrected there
   * too, 2026-07-30.
   * So the park pass goes HIGH, not negative: MAX(sheet_order) + 1 and up, which cannot collide
   * with any live value.
   *
   * Both passes go through db.batch(), which D1 runs as ONE transaction. A half-applied reorder
   * — some sheets parked at 900-something, others renumbered — is not a state this app is
   * willing to leave behind.
   *
   * FREE SIDE EFFECT worth knowing: pass two writes 0..n-1, so any gap in sheet_order (from a
   * deleted sheet, say) is compacted. And because slots reference sheet_id and never
   * sheet_order, NOT ONE SLOT ROW IS TOUCHED — a whole sheet travels with both its faces, which
   * is exactly the physical gesture of lifting it out of the rings. Downstream,
   * `v_binder_spread` derives side_index/spread_index from sheet_order, so page numbering
   * renumbers itself. Nothing to keep in sync.
   */
  if (path === '/sheet/reorder') {
    const bid = String(body.binder_id || 'mini-binder');
    const want = Array.isArray(body.order) ? body.order.map(v => String(v)) : null;
    if (!want || !want.length) {
      return reply({ ok: false, error: 'order must be a non-empty array of sheet_id, in the desired binder order' }, 400);
    }

    const have = (await all('SELECT sheet_id FROM sheet WHERE binder_id = ? ORDER BY sheet_order', [bid]))
                   .map(r => r.sheet_id);
    if (!have.length) return reply({ ok: false, error: 'binder "' + bid + '" has no sheets' }, 404);

    /* A PERMUTATION CHECK, and it is not pedantry. A SHORT array would renumber the sheets it
     * names and leave the rest parked wherever they were — a scrambled binder that still looks
     * entirely plausible on screen. Refuse the write instead, and say which ids were wrong,
     * because "invalid order" sends you nowhere. */
    const dupes = [...new Set(want.filter((id, i) => want.indexOf(id) !== i))];
    if (dupes.length) {
      return reply({ ok: false, error: 'the same sheet appears more than once in order: ' + dupes.join(', ') }, 400);
    }
    const unknown = want.filter(id => !have.includes(id));
    const missing = have.filter(id => !want.includes(id));
    if (unknown.length || missing.length) {
      return reply({ ok: false,
        error: 'order must list every sheet in this binder exactly once (got ' + want.length + ', binder has ' + have.length + ')',
        unknown: unknown, missing: missing }, 400);
    }

    const parked = Number((await all(
      'SELECT COALESCE(MAX(sheet_order), 0) AS m FROM sheet WHERE binder_id = ?', [bid]))[0].m) + 1;

    const stmts = [];
    const SQL = 'UPDATE sheet SET sheet_order = ?, updated_at = ? WHERE sheet_id = ? AND binder_id = ?';
    // pass 1 — park every sheet above the live range so nothing can collide
    want.forEach((id, i) => stmts.push(db.prepare(SQL).bind(parked + i, t, id, bid)));
    // pass 2 — land them on their final 0-based positions
    want.forEach((id, i) => stmts.push(db.prepare(SQL).bind(i, t, id, bid)));

    try {
      await db.batch(stmts);
    } catch (e) {
      return reply({ ok: false, error: String(e.message || e) }, 400);
    }
    return reply({ ok: true, order: want, sheets: want.length });
  }

  return null;
}
