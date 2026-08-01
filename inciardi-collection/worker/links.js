/* Inciardi Collection — THE LINKS. Three routes: attach a photo, promote it, retire it.
 *
 * ============================================================================
 * SPLIT OUT OF `images.js` 2026-08-01, AND BOTH FILES HAD ALREADY NAMED THIS SEAM.
 *
 * `images.js` reached **21,455 bytes against a ~22KB practical ceiling** — ~545 bytes of
 * headroom, which is LESS than `worker.js` had (674) on the day that was called an emergency.
 * Base64 inflates 4/3, so 22KB on disk returns ~29KB against a ~30KB cap; a file that cannot be
 * read whole cannot be safely edited.
 *
 * The trigger was concrete rather than housekeeping: the carousel needs a per-print image read,
 * and there was **no legal file to put it in.**
 *
 * THE SEAM IS BYTES vs LINKS — the same pure/impure logic that split `reads.js` out of
 * `worker.js`:
 *   images.js — anything that touches R2 or returns an image. Upload, serve, list.
 *   this file — the three JSON writes that only ever touch `edition_image`. No bucket handle,
 *               no ArrayBuffer, no content-type negotiation. They share a route PREFIX with the
 *               byte paths and nothing else.
 * ============================================================================
 *
 * 🔴 `linkImage()` LIVES HERE AND `images.js` IMPORTS IT. The one non-mechanical decision in the
 * split, and it is deliberate: `POST /image` can attach on arrival, so both files need it.
 * Copying it would put the sort rule AND the status-inheritance rule in two places — the
 * duplicate-source disease this whole app exists to cure. **The link layer owns linking; the
 * upload borrows it.**
 *
 * CONTRACT with worker.js: dispatched AFTER the JSON body parse, because unlike the upload
 * these bodies really are JSON — so it sits beside `sheets.js`, not beside `images.js`.
 * Returns a Response, or `null` for "not my route".
 */

export const LINK_ROUTES = [
  'POST /image/assign', 'POST /image/primary', 'POST /image/archive'
];

const MINE = ['/image/assign', '/image/primary', '/image/archive'];

/* Linking is one function because THREE callers do it — assign, and both branches of the upload
 * route next door. A copy in each is three places for the sort rule to drift.
 *
 * `status` is READ FROM THE ASSET and written onto the link, which the composite FK then
 * refuses to let disagree (Q20 → B). That denormalization is the whole reason an archived photo
 * cannot remain a print's primary: a partial index can only see its own table's columns, so
 * without this the `active` half of `ux_img_primary` would silently stop existing. */
export async function linkImage(db, all, imageId, editionId, t) {
  const img = await all('SELECT status FROM image WHERE image_id = ?', [imageId]);
  if (!img.length) throw new Error('no image "' + imageId + '"');
  const nxt = await all('SELECT COALESCE(MAX(sort)+1,0) AS n FROM edition_image WHERE edition_id = ?', [editionId]);
  await db.prepare(
    `INSERT OR IGNORE INTO edition_image (edition_id,image_id,status,is_primary,sort,created_at)
     VALUES (?,?,?,0,?,?)`
  ).bind(editionId, imageId, img[0].status, nxt[0].n, t).run();
}

export async function handleLink(ctx) {
  const { db, all, reply, body, path, method, t } = ctx;
  if (method !== 'POST' || !MINE.includes(path)) return null;

  /* ============================================================ POST /image/assign
   * Link or unlink. TWO VERBS (Q20 → B): unlink is a plain DELETE of the join row, archive is a
   * status flip on the asset. Taking a photo off ONE print must never take it off the other
   * eight — that distinction is the entire reason the asset/link split exists at all, and it is
   * the difference between "this pack shot is cluttering Watermelon" and "this photo is bad."
   */
  if (path === '/image/assign') {
    const imageId = String(body.image_id || '').trim();
    const editionId = String(body.edition_id || '').trim();
    if (!imageId || !editionId) return reply({ ok: false, error: 'image_id and edition_id are both required' }, 400);

    if (body.unlink) {
      const r = await db.prepare('DELETE FROM edition_image WHERE image_id = ? AND edition_id = ?')
                        .bind(imageId, editionId).run();
      return reply({ ok: true, unlinked: r.meta ? r.meta.changes : undefined });
    }
    try { await linkImage(db, all, imageId, editionId, t); }
    catch (e) { return reply({ ok: false, error: String(e.message || e) }, 400); }
    return reply({ ok: true, image_id: imageId, edition_id: editionId });
  }

  /* ============================================================ POST /image/primary
   * 🔴 TWO STATEMENTS IN ONE db.batch(), AND IT CANNOT BE ONE. `ux_img_primary` is UNIQUE on
   * (edition_id) WHERE is_primary = 1 AND status = 'active', so setting the new primary before
   * clearing the old one is REJECTED by the index. Batched because D1 runs a batch as one
   * transaction: a half-applied swap leaves a print with NO primary at all.
   *
   * ⚠️ THIS IS AN OVERRIDE, NOT THE DEFAULT. Since v21 the card's photo is DERIVED
   * (`reads.js` → the display-photo ranking: is_primary DESC, link_count ASC, created_at DESC),
   * so a print with one photo already renders it and a standalone already beats a pack shot.
   * This route exists for the case the ranking cannot know about — "no, THAT one" — and it must
   * stay an explicit act rather than becoming something the app does on your behalf.
   */
  if (path === '/image/primary') {
    const imageId = String(body.image_id || '').trim();
    const editionId = String(body.edition_id || '').trim();
    if (!imageId || !editionId) return reply({ ok: false, error: 'image_id and edition_id are both required' }, 400);

    const link = await all('SELECT status FROM edition_image WHERE image_id = ? AND edition_id = ?', [imageId, editionId]);
    if (!link.length) return reply({ ok: false, error: 'that photo is not attached to that print — assign it first' }, 404);
    if (link[0].status !== 'active') return reply({ ok: false, error: 'an archived photo cannot be a primary' }, 400);

    try {
      await db.batch([
        db.prepare('UPDATE edition_image SET is_primary = 0 WHERE edition_id = ?').bind(editionId),
        db.prepare('UPDATE edition_image SET is_primary = 1 WHERE edition_id = ? AND image_id = ?').bind(editionId, imageId)
      ]);
    } catch (e) { return reply({ ok: false, error: String(e.message || e) }, 400); }
    return reply({ ok: true, edition_id: editionId, primary: imageId });
  }

  /* ============================================================ POST /image/archive
   * Hide everywhere, keep the bytes forever (J9). The composite FK on `edition_image` carries
   * ON UPDATE CASCADE, so flipping the ASSET's status propagates to every link on its own —
   * which is exactly why Q20 → B denormalized status onto the link. The route does not have to
   * remember; the database does it.
   *
   * 🔴 THERE IS NO DELETE, HERE OR ANYWHERE. D1 Time Travel covers the database for 30 days and
   * covers R2 for nothing. An export carries image ROWS, not image BYTES. Archiving is a status
   * flip and the object stays, permanently. If you are here to add a cleanup job, don't.
   */
  if (path === '/image/archive') {
    const imageId = String(body.image_id || '').trim();
    if (!imageId) return reply({ ok: false, error: 'image_id is required' }, 400);
    const restore = !!body.restore;

    try {
      /* Clear the primary flags FIRST when archiving. `ux_img_primary` forbids an archived
       * primary, so the cascade would otherwise push the link into a state the index rejects
       * and take the whole batch down. Order is load-bearing, not tidiness. */
      const stmts = [];
      if (!restore) stmts.push(db.prepare('UPDATE edition_image SET is_primary = 0 WHERE image_id = ?').bind(imageId));
      stmts.push(db.prepare('UPDATE image SET status = ?, archived_at = ? WHERE image_id = ?')
                   .bind(restore ? 'active' : 'archived', restore ? null : t, imageId));
      await db.batch(stmts);
    } catch (e) { return reply({ ok: false, error: String(e.message || e) }, 400); }
    return reply({ ok: true, image_id: imageId, status: restore ? 'active' : 'archived',
                   note: 'the bytes are untouched and always will be' });
  }

  return null;
}
