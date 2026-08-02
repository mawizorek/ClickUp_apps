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

/* ============================================================ photoOrder
 * 🔴 WHICH PHOTOGRAPH REPRESENTS A PRINT, AND IN WHAT ORDER THE REST FOLLOW.
 * ONE definition. Two consumers, in two files, and they must never diverge.
 *
 * ⚠️ THE CARD AND THE CAROUSEL ARE THE SAME QUERY, TRUNCATED DIFFERENTLY.
 * `reads.js` wraps this in a correlated scalar subquery with `LIMIT 1` to pick the binder
 * card's photo; `images.js` runs it as a plain list with no LIMIT to fill the carousel. That
 * is the whole reason this is a function and not two hand-written ORDER BY clauses: **the card
 * photo IS the carousel's first frame, structurally, not by anyone remembering.**
 *
 * Get that wrong and the app grows a beautiful bug — the binder shows photo X, you tap through,
 * and the carousel opens on photo Y. Two surfaces disagreeing about which photograph a print IS
 * is the duplicate-source disease this app was rebuilt to cure, in its most visible form.
 *
 * 🔴 WHY IT LIVES HERE RATHER THAN IN `reads.js`, WHERE THE CARD IS RENDERED. Two reasons, and
 * the second one is the load-bearing one:
 *   1. The sort rule is a LINK fact. This file already owns `linkImage()` for exactly that
 *      argument, and `reads.js` imports nothing, so `reads.js` → here stays acyclic.
 *   2. `reads.js` is at ~20.3KB against a ~22KB ceiling and this file is at ~8KB. Shared code
 *      belongs in the file that can still afford a paragraph explaining itself.
 *
 * ---------------------------------------------------------------------------
 * THE ORDER, and every term is a decision that has already been argued once:
 *
 *   sort ASC          an explicit "put this one first" wins. See below — it is a VERB.
 *   link_count ASC    a photo on ONE print beats a photo on nine.
 *   created_at DESC   newest of whatever is left.
 *
 * ⭐ THE MIDDLE LINE IS THE TRICK AND IT COSTS NO COLUMN. A photo linked to several editions is
 * STRUCTURALLY a pack shot — being on nine prints is what MAKES it one. So the pack photo
 * renders on Pony and PBR today because it is all there is, and the day a standalone PBR shot
 * lands it carries link_count 1 against the pack's 2 and takes over by itself, nothing tapped.
 * J16 invented an `image.subject` field for precisely this preference and it was never reachable
 * from any UI; the fact was already in the join table.
 *
 * 🔴 THE FIRST LINE REPLACED `is_primary DESC` ON 2026-08-01 (v22, Q26). READ THIS BEFORE
 * "RESTORING" IT.
 *
 * `is_primary` was a stored BOOLEAN OVERRIDE, and Michael rejected it as a concept rather than
 * as an implementation: *"can starring it just push it to top? so its an undoable trigger and
 * not a state? derivable is best."*
 *
 * The problem with the flag was never that it worked badly. It was that starring a photo
 * PERMANENTLY switched off the auto-promotion above it — star the pack shot on PBR and it stays
 * PBR's picture forever, even after a proper standalone is shot. A one-way door, behind a
 * one-tap control, with a toast that says "done."
 *
 * ⭐ AND THE REPLACEMENT DELETES MACHINERY RATHER THAN ADDING IT. `ux_img_primary` exists for
 * one job: stop two rows claiming primary on one edition. **Under an ordinal you cannot have
 * two firsts** — the impossibility is arithmetic instead of an index. The two-statement swap
 * batch below and the clear-the-flags-before-archiving dance both existed only to serve that
 * index, and both are gone.
 *
 * ⚠️ WHY EVERY LINK SITS AT `sort = 0` UNTIL SOMETHING IS STARRED, and why that is the whole
 * design. `linkImage()` used to write `MAX(sort)+1`, giving every link a distinct ordinal — so
 * `sort ASC` would have fully determined the order and the two derived terms below would have
 * become dead code, silently. It now writes the column default, 0, on every insert. A print
 * nobody has touched is a FLAT TIE on the first term, the derive does all the work exactly as
 * it did in v21, and the ordinal only starts meaning something the moment a human says so.
 *
 * 🔴 `is_primary` IS NOT DROPPED. The column, its CHECK and `ux_img_primary` all still exist —
 * dropping them is migration 002. Nothing reads the column and nothing writes a 1 to it any
 * more; `/image/primary` zeroes it as it goes so the vestige cannot linger and confuse the
 * sweep that eventually removes it. ⚠️ `GET /images` still returns `is_primary_anywhere` and it
 * is now MEANINGLESS. Left in place rather than removed in the same commit that changes the
 * ranking, because `photos.js` reads it and a UI change does not belong in a worker PR — named
 * here so the next reader does not trust it.
 *
 * ⚠️ ONE LATENT AMBIGUITY, NAMED RATHER THAN FIXED (J25). `sort` lives on the LINK, which is
 * per-EDITION, while the binder card ranks across every edition of an ARTWORK. Star a photo on
 * two different printings of the same print and both carry sort = -1, tied, and the card falls
 * through to link_count. That is far softer than the old flag's failure (arbitrary between two
 * explicit human choices) but it is not nothing. It cannot happen today: 59 artworks, 59
 * editions, 1:1. It becomes reachable the day J19's reprints are entered.
 */
export const photoOrder = (ei) =>
  `${ei}.sort ASC, ` +
  `(SELECT COUNT(*) FROM edition_image x WHERE x.image_id = ${ei}.image_id) ASC, ` +
  `${ei}.created_at DESC`;

/* Linking is one function because THREE callers do it — assign, and both branches of the upload
 * route next door. A copy in each is three places for the sort rule to drift.
 *
 * `status` is READ FROM THE ASSET and written onto the link, which the composite FK then
 * refuses to let disagree (Q20 → B). That denormalization is the whole reason an archived photo
 * cannot remain a print's primary: a partial index can only see its own table's columns, so
 * without this the `active` half of `ux_img_primary` would silently stop existing.
 *
 * 🔴 `sort` AND `is_primary` ARE BOTH LEFT AT THEIR COLUMN DEFAULTS (0), ON PURPOSE. See
 * photoOrder above: a distinct ordinal per link would make the first ORDER BY term decide
 * everything and kill the derive without a single error anywhere. Attaching a photo expresses
 * NO opinion about order. Only starring does. */
export async function linkImage(db, all, imageId, editionId, t) {
  const img = await all('SELECT status FROM image WHERE image_id = ?', [imageId]);
  if (!img.length) throw new Error('no image "' + imageId + '"');
  await db.prepare(
    `INSERT OR IGNORE INTO edition_image (edition_id,image_id,status,is_primary,sort,created_at)
     VALUES (?,?,?,0,0,?)`
  ).bind(editionId, imageId, img[0].status, t).run();
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
   * ⭐ BRING TO FRONT. Rewritten 2026-08-01 (v22, Q26). Same route, same path, same body — the
   * MECHANISM changed underneath and the name was deliberately not.
   *
   * It used to set a boolean and clear its siblings in a two-statement batch, because
   * `ux_img_primary` rejects a second primary and D1 runs a batch as one transaction. Now it
   * writes ONE ordinal: `MIN(sort) - 1` for this edition, which puts this photo in front of
   * everything currently there.
   *
   * ⭐ WHY THERE IS NO "UNSTAR" AND WHY THAT IS THE ANSWER RATHER THAN A GAP. Michael asked for
   * *"an undoable trigger and not a state"* and explicitly rejected the toggle. Under a flag,
   * undo needs its own verb, because a pin is a state you have to get out of. Under an ordinal
   * there is nothing to get out of: you undo it by starring a different photo, and the one you
   * starred before falls back into the derive on its own. The only irreversible thing here is
   * un-choosing entirely — restoring a print to "never touched" — and nobody has asked for it.
   * If they do, it is `sort = 0` on that one row, not a new route.
   *
   * 🔴 `sort` GOES NEGATIVE AND THAT IS INTENDED, not a fencepost bug. The column is a plain
   * INTEGER with no CHECK, the default is 0, and repeatedly starting from MIN-1 walks downward
   * forever without ever renumbering the other rows. Renumbering would be N writes and a
   * transaction to keep them consistent; this is one write and cannot half-apply.
   *
   * The `is_primary = 0` sweep is NOT the old batch in disguise. The flag is retired from the
   * ranking, so it can no longer affect what renders — this exists purely so no stray 1 survives
   * into migration 002, which is the pass that drops the column. Setting a flag to 0 can never
   * violate a UNIQUE-WHERE-1 index, so unlike the old swap, ORDER DOES NOT MATTER HERE.
   */
  if (path === '/image/primary') {
    const imageId = String(body.image_id || '').trim();
    const editionId = String(body.edition_id || '').trim();
    if (!imageId || !editionId) return reply({ ok: false, error: 'image_id and edition_id are both required' }, 400);

    const link = await all('SELECT status FROM edition_image WHERE image_id = ? AND edition_id = ?', [imageId, editionId]);
    if (!link.length) return reply({ ok: false, error: 'that photo is not attached to that print — assign it first' }, 404);
    if (link[0].status !== 'active') return reply({ ok: false, error: 'an archived photo cannot be the front photo' }, 400);

    /* Returned so the client can prove the write landed. ⚠️ This is the ONLY externally
     * observable difference between the v21 worker and this one on an existing route, which
     * makes it the deploy's acceptance test — the same job /health's `images` count did for
     * #672. A route that behaves identically before and after cannot verify its own deploy. */
    let front = null;
    try {
      await db.batch([
        db.prepare('UPDATE edition_image SET is_primary = 0 WHERE edition_id = ?').bind(editionId),
        db.prepare(
          `UPDATE edition_image
              SET sort = (SELECT COALESCE(MIN(sort), 0) - 1 FROM edition_image WHERE edition_id = ?)
            WHERE edition_id = ? AND image_id = ?`
        ).bind(editionId, editionId, imageId)
      ]);
      const r = await all('SELECT sort FROM edition_image WHERE edition_id = ? AND image_id = ?', [editionId, imageId]);
      front = r.length ? r[0].sort : null;
    } catch (e) { return reply({ ok: false, error: String(e.message || e) }, 400); }

    return reply({ ok: true, edition_id: editionId, front: imageId, sort: front,
                   note: 'moved to the front of this print\u2019s photos; star another to change it back' });
  }

  /* ============================================================ POST /image/archive
   * Hide everywhere, keep the bytes forever (J9). The composite FK on `edition_image` carries
   * ON UPDATE CASCADE, so flipping the ASSET's status propagates to every link on its own —
   * which is exactly why Q20 → B denormalized status onto the link. The route does not have to
   * remember; the database does it.
   *
   * ⭐ SIMPLER SINCE v22, AND THE SIMPLIFICATION IS THE POINT. This used to clear `is_primary`
   * across every link of the image FIRST, because `ux_img_primary` forbids an archived primary
   * and the cascade would otherwise push a link into a state the index rejects and take the
   * whole batch down. Order was load-bearing. With the flag retired from the ranking nothing
   * ever sets it to 1, so the index has nothing to reject and the archive is one statement.
   * ⚠️ The clear is KEPT as a belt-and-braces line only while rows written before v22 may still
   * carry a 1; it comes out with migration 002 and not before.
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
