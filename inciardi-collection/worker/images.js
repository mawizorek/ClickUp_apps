/* Inciardi Collection — THE PHOTO PIPE. Eight routes: bytes in, bytes out, links between.
 *
 * ============================================================================
 * NEW FILE 2026-08-01, and it had to be one. `worker.js` sits at ~21KB against a ~22KB
 * practical ceiling (base64 inflates 4/3 against a ~30KB return cap), and its own header
 * says in capitals that the next route does not go in it. It gains SIX LINES of dispatch
 * from this file and nothing else.
 *
 * 🔴 WHY THE DISPATCH SITS BEFORE THE BODY PARSE IN worker.js — NOT A STYLE CHOICE.
 * worker.js runs `body = await request.json()` on every write, which CONSUMES THE REQUEST
 * STREAM. An upload's body is BYTES. Dispatched after that line, this file would receive an
 * already-drained body and write a zero-length object to R2 with a perfectly successful
 * response — a silent empty file, which is the worst failure shape this app knows.
 * So: the write-key gate fires first (auth is NOT relocated), then images dispatch, then the
 * JSON parse for everything else. The image routes own their own body because their body is
 * not JSON.
 *
 * CONTRACT with worker.js, same shape as reads.js: everything needed is handed over, this file
 * reaches for no globals and holds no state. Returns a Response, or `null` meaning "not my
 * route" so worker.js can fall through. A 404 here would shadow every other write.
 *   request  the raw Request (body UNREAD)      db    the D1 binding
 *   bucket   the R2 binding (may be undefined)  all   (sql, params) -> rows
 *   path - url - method - reply(data, status) - t
 * ============================================================================
 *
 * 🔴 THE BYTES ARE THE ONLY UNRECOVERABLE THING IN THIS APP. D1 Time Travel covers the
 * database for 30 days and covers R2 for NOTHING. An export carries image ROWS, not image
 * BYTES. There is no delete route in this file and there must never be one: archiving is a
 * `status` flip and the object stays. If you are here to add a cleanup job, don't.
 *
 * ⚠️ WHAT IS DELIBERATELY NOT BUILT, named so the gap is a decision and not an oversight:
 *   - DERIVATIVES. The spec locked three (thumb 480 / full 1800 / re-encoded original, Q14 C)
 *     and then migration 001 gave `image` exactly ONE `r2_key` column. The key scheme for the
 *     other two was never decided, so writing them now would mean inventing schema mid-route.
 *     v1 stores ONE image per shot. When the grid crawls, add `-t.jpg` by CONVENTION off the
 *     same key and let rows without one fall back to the full image. No schema change either
 *     way, which is what makes deferring it cheap and reversing it cheaper.
 *   - EXIF. `shot_at` is accepted as a parameter and never derived here. Reading it is
 *     capture.js's job and it MUST happen BEFORE the canvas re-encode — the re-encode strips
 *     GPS, which is the point, and takes the capture date with it, permanently (J16).
 */

export const IMAGE_ROUTES = [
  'GET /images?scope=', 'GET /image/:id', 'GET /bucket/peek',
  'POST /image', 'POST /image/assign', 'POST /image/primary',
  'POST /image/archive', 'POST /image/adopt?apply=1'
];

/* Q23 → C. Michael struck A, B, D and Other; C was the only survivor.
 *
 * "Bring in all 177, but hide the non-matches behind a switch." The 177 are Anastasia's SHOP
 * product photographs, and most of them are of prints he has never held — so they are worth
 * keeping as a reference wall and must not be the first thing the Photos screen shows.
 *
 * ⭐ IMPLEMENTED WITH NO NEW COLUMN, because the fact is already stored. `image.kind` is
 * ('upload' | 'scrub' | 'reference') and it already means exactly "whose bytes are these."
 * Adding an `is_reference` flag would have been a SECOND CLAIMANT on a fact `kind` owns — the
 * duplicate-source disease this app exists to cure, and the same shape as reaching for a
 * custom field when a native primitive already carries the value.
 */
const SCOPES = {
  mine:   "i.kind = 'upload'",
  theirs: "i.kind IN ('scrub','reference')",
  all:    '1=1'
};

const KEY_PREFIX = 'ed/';        // ours. content-addressed, written by POST /image
const LEGACY_PREFIX = 'prints/'; // hers. written by the retired market worker

const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const intOrNull = v => (v == null || v === '' || isNaN(Number(v))) ? null : parseInt(v, 10);

async function sha256Hex(buf) {
  const d = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* Linking is its own function because THREE routes do it, and a copy in each is three places
 * for the sort-order rule to drift. `status` is READ FROM THE ASSET and written onto the link,
 * which the composite FK then refuses to let disagree (Q20 B). */
async function linkImage(db, all, imageId, editionId, t) {
  const img = await all('SELECT status FROM image WHERE image_id = ?', [imageId]);
  if (!img.length) throw new Error('no image "' + imageId + '"');
  const nxt = await all('SELECT COALESCE(MAX(sort)+1,0) AS n FROM edition_image WHERE edition_id = ?', [editionId]);
  await db.prepare(
    `INSERT OR IGNORE INTO edition_image (edition_id,image_id,status,is_primary,sort,created_at)
     VALUES (?,?,?,0,?,?)`
  ).bind(editionId, imageId, img[0].status, nxt[0].n, t).run();
}

export async function handleImage(ctx) {
  const { request, db, bucket, all, reply, path, url, method, t } = ctx;

  const isImagePath = path === '/images' || path === '/bucket/peek' ||
                      path === '/image' || path.startsWith('/image/');
  if (!isImagePath) return null;

  /* ⚠️ EVERY ROUTE BELOW EXCEPT /images NEEDS THE BUCKET, and a missing binding is a
   * DEPLOYMENT fact rather than a bug in this file. Say which, loudly. The plausible cause is
   * a deploy whose API token had no R2 permission — that fails the deploy, so if you are
   * seeing this at runtime the running worker is older than you think. */
  if (path !== '/images' && !bucket) {
    return reply({ ok: false, error: 'no R2 binding on this worker',
      fix: 'wrangler.toml needs [[r2_buckets]] binding = "BUCKET", then a redeploy. If it IS already in the file, the last deploy FAILED — check the Actions run rather than editing the config again.' }, 503);
  }

  /* ============================================================ GET /bucket/peek
   * A DIAGNOSTIC, AND IT EXISTS BECAUSE I NEARLY SPENT MICHAEL'S ATTENTION ON A LOOKUP.
   *
   * The claim "every legacy object is filed under the print it belongs to" was read out of
   * `inciardi-market/db/schema.sql`'s comment — INTENT, not observation. I asked him to open
   * the dashboard and read a filename back to me. Wrong instinct: a fact reachable in fifteen
   * lines of code is not a fact to delegate to a human.
   *
   * ⭐ It also DOUBLES AS THE R2 BINDING TEST, which nothing else in this app is. Binding a
   * bucket changes nothing observable until something reads it — /health answers identically
   * bound or not — and that is exactly how migration 001 broke three routes for five hours
   * behind a green health check. This is the route that touches the altered thing.
   */
  if (path === '/bucket/peek' && method === 'GET') {
    const listed = await bucket.list({ limit: 1000 });
    const keys = (listed.objects || []).map(o => o.key);
    const count = p => keys.filter(k => k.startsWith(p)).length;
    return reply({
      ok: true,
      total_listed: keys.length,
      truncated: !!listed.truncated,
      prefixes: {
        'prints/ (hers, legacy)': count(LEGACY_PREFIX),
        'ed/ (ours)': count(KEY_PREFIX),
        'snapshots/ (market backups)': count('snapshots/'),
        other: keys.filter(k => !k.startsWith(LEGACY_PREFIX) && !k.startsWith(KEY_PREFIX) && !k.startsWith('snapshots/')).length
      },
      sample: keys.slice(0, 10),
      note: 'If the sample reads prints/<print-name>/<id>, the key IS the mapping and nothing was lost when the market worker died.'
    });
  }

  /* ============================================================ GET /images
   * The Photos surface. UNASSIGNED IS THE DEFAULT VIEW (Q19 + J15) — the backlog is the first
   * thing you see, the same argument that made the shoe-box the shoe-box.
   *
   * Reads no bucket, so it answers even on a worker with no R2 binding. Deliberate: the screen
   * should render and say "no photos" rather than 503 because of a config fact.
   */
  if (path === '/images' && method === 'GET') {
    const asked = url.searchParams.get('scope');
    const scope = SCOPES[asked] ? asked : 'mine';
    const onlyUnassigned = url.searchParams.get('assigned') !== 'any';
    const rows = await all(
      `SELECT i.image_id, i.r2_key, i.source_url, i.kind, i.content_type, i.bytes,
              i.width, i.height, i.caption, i.subject, i.credit, i.shot_at, i.status,
              i.created_at,
              COUNT(ei.edition_id)        AS links,
              GROUP_CONCAT(ei.edition_id) AS edition_ids,
              MAX(ei.is_primary)          AS is_primary_anywhere
         FROM image i
         LEFT JOIN edition_image ei ON ei.image_id = i.image_id
        WHERE i.status = 'active' AND ${SCOPES[scope]}
        GROUP BY i.image_id
        ${onlyUnassigned ? 'HAVING links = 0' : ''}
        ORDER BY i.created_at DESC`);

    /* Counts for the toggle's own label, so the UI never fetches twice to say "show 118 of
     * hers". Computed HERE for the same reason /summary computes its totals: a client that
     * sums its own filtered page cannot agree with the filter. */
    const tally = await all(
      `SELECT SUM(kind = 'upload') AS mine,
              SUM(kind IN ('scrub','reference')) AS theirs,
              COUNT(*) AS total
         FROM image WHERE status = 'active'`);

    return reply({ ok: true, at: t, scope: scope, unassigned_only: onlyUnassigned,
                   counts: tally[0] || {}, images: rows });
  }

  /* ============================================================ GET /image/:id
   * The worker proxy. UNAUTHENTICATED by design — same rule as every other read here — and the
   * bucket stays PRIVATE so this is the only door. A public bucket would be a second read path
   * that cannot 404 an archived row and cannot be rotated (J13).
   */
  if (method === 'GET' && path.startsWith('/image/')) {
    const id = decodeURIComponent(path.slice('/image/'.length));
    const rows = await all('SELECT r2_key, source_url, content_type, status FROM image WHERE image_id = ?', [id]);
    if (!rows.length) return reply({ ok: false, error: 'no image "' + id + '"' }, 404);
    const img = rows[0];

    // Archived is a 404 to a reader, not a 403. The bytes are kept; the picture is withdrawn.
    if (img.status !== 'active') return reply({ ok: false, error: 'image is archived' }, 404);

    // Reference-only rows point at someone else's CDN. Redirect rather than proxy — we are not
    // paying egress to mirror a URL the browser can fetch itself.
    if (!img.r2_key && img.source_url) return Response.redirect(img.source_url, 302);

    const obj = await bucket.get(img.r2_key);
    if (!obj) {
      /* 🔴 A ROW WITH NO OBJECT IS A REAL, REPORTABLE STATE — not a 404 to shrug at. It means a
       * write half-landed. Saying so is the difference between finding that today and finding
       * it when a screen is mysteriously blank in three weeks. */
      return reply({ ok: false, error: 'row exists but the bytes are missing from R2',
                     r2_key: img.r2_key,
                     hint: 'a half-completed upload. The row can be archived; the object cannot be recovered.' }, 502);
    }

    const h = new Headers();
    obj.writeHttpMetadata(h);
    h.set('content-type', img.content_type || h.get('content-type') || 'image/jpeg');
    h.set('etag', obj.httpEtag);
    // Content-addressed keys are immutable, which is the whole payoff of the scheme. A
    // reference row gets a short cache because the CDN behind it can change under us.
    h.set('cache-control', img.r2_key && img.r2_key.startsWith(KEY_PREFIX)
      ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
    return new Response(obj.body, { headers: h });
  }

  /* ============================================================ POST /image  (RAW BYTES)
   * The upload. Body is the image itself; metadata rides in the query string, because a
   * multipart parse is a dependency and a second thing to get wrong for zero gain.
   *
   * 🔴 ORDER IS BYTES-THEN-ROW, and the failure mode is CHOSEN rather than inherited. R2 first:
   * an orphan OBJECT is invisible litter costing fractions of a cent, and the content-addressed
   * key means a retry rewrites the identical key and heals it. An orphan ROW is a broken
   * picture in the UI. One of the two must be possible; prefer the one nobody ever sees.
   */
  if (path === '/image' && method === 'POST') {
    const q = url.searchParams;
    const editionId = (q.get('edition_id') || '').trim();      // optional: assign on arrival
    const ctype = (request.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();

    if (!OK_TYPES.includes(ctype)) {
      return reply({ ok: false, error: 'content-type "' + ctype + '" is not an image this app stores',
                     allowed: OK_TYPES }, 415);
    }

    const buf = await request.arrayBuffer();
    const size = buf ? buf.byteLength : 0;
    if (size < 1024) {
      /* An empty or near-empty body is the SILENT failure this file's dispatch position exists
       * to prevent (see the header). If it happens anyway it stops here, loudly, rather than
       * becoming a 0-byte object behind a 200. */
      return reply({ ok: false, error: 'body is empty or too small to be a photograph (' + size + ' bytes)',
                     hint: 'POST the image bytes as the raw body, not as JSON and not as a form field.' }, 400);
    }
    if (size > 12 * 1024 * 1024) {
      return reply({ ok: false, error: 'image is ' + Math.round(size / 1048576) + 'MB; the cap is 12MB',
                     hint: 'capture.js re-encodes to ~1800px before upload, so an original straight off the camera should never reach this route.' }, 413);
    }

    const sha = await sha256Hex(buf);

    /* DEDUPE IS FREE AND IT IS THE POINT OF CONTENT ADDRESSING. Same bytes = same key = same
     * row. Re-uploading a photo already stored returns the existing image_id instead of minting
     * a twin, and `ux_image_sha` enforces it even if this check is ever deleted. */
    const dupe = await all('SELECT image_id FROM image WHERE sha256 = ?', [sha]);
    if (dupe.length) {
      const existing = dupe[0].image_id;
      let link_error = null;
      if (editionId) {
        try { await linkImage(db, all, existing, editionId, t); }
        catch (e) { link_error = String(e.message || e); }
      }
      return reply({ ok: true, image_id: existing, duplicate: true, link_error: link_error,
                     note: 'these exact bytes were already stored; the existing image was reused' + (editionId ? ' and linked' : '') });
    }

    const ext = ctype === 'image/png' ? 'png' : ctype === 'image/webp' ? 'webp'
              : ctype === 'image/avif' ? 'avif' : 'jpg';
    /* Key scheme J9: ed/<edition_id>/<sha256>.<ext>. An UNASSIGNED upload parks under `ed/_/`,
     * because an asset with zero links is LEGAL BY DESIGN (J15) and still needs somewhere to
     * live. The key never moves afterwards — it is an address, not a filing decision. */
    const key = KEY_PREFIX + (editionId || '_') + '/' + sha + '.' + ext;
    const imageId = 'img-' + sha.slice(0, 16);

    await bucket.put(key, buf, { httpMetadata: { contentType: ctype } });

    try {
      await db.prepare(
        `INSERT INTO image (image_id,r2_key,kind,content_type,bytes,sha256,width,height,
                            caption,subject,credit,shot_at,status,created_at)
         VALUES (?,?,'upload',?,?,?,?,?,?,?,?,?,'active',?)`
      ).bind(imageId, key, ctype, size, sha,
             intOrNull(q.get('width')), intOrNull(q.get('height')),
             q.get('caption') || null, q.get('subject') || null,
             q.get('credit') || 'you', q.get('shot_at') || null, t).run();
    } catch (e) {
      return reply({ ok: false, error: String(e.message || e), r2_key: key,
                     note: 'the BYTES are in R2 under this key; only the database row failed. Retrying this upload is safe — the key is content-addressed and will be rewritten identically.' }, 500);
    }

    let link_error = null;
    if (editionId) {
      try { await linkImage(db, all, imageId, editionId, t); }
      catch (e) { link_error = String(e.message || e); }
    }
    /* 207: the photo landed and is canonical; only the attachment failed. Same shape the
     * artwork route already uses, so a client learns one convention instead of two. */
    return reply({ ok: true, image_id: imageId, r2_key: key, bytes: size, sha256: sha,
                   linked_to: link_error ? null : (editionId || null), link_error: link_error },
                 link_error ? 207 : 200);
  }

  /* ---- the JSON writes. The body is read HERE, once, for the routes that need it. ---- */
  if (method === 'POST') {
    let body = {};
    try { body = await request.json(); } catch (e) { body = {}; }

    /* ============================================================ POST /image/assign
     * Link or unlink. TWO VERBS (Q20 B): unlink is a plain DELETE of the join row, archive is a
     * status flip on the asset. Taking a photo off ONE print must never take it off the other
     * eight — that distinction is the entire reason the asset/link split exists. */
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
     * (edition_id) WHERE is_primary = 1 AND status = 'active', so setting the new primary
     * before clearing the old one is REJECTED by the index. Batched because D1 runs a batch as
     * one transaction: a half-applied swap leaves a print with NO primary at all. */
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
     * which is exactly why Q20 B denormalized status onto the link. The route does not have to
     * remember; the database does it. */
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

    /* ============================================================ POST /image/adopt
     * SPEC STEP 12 — bring in the legacy objects Anastasia's shop images left in this bucket.
     * Q17b D: adopt as a FLOOR. Hers renders until Michael shoots his own; then his becomes
     * primary and hers stays in the carousel.
     *
     * ⭐ THE MAPPING IS THE KEY: `prints/<print_id>/<image_id>`. Which print each photo belongs
     * to is IN THE FILENAME, so nothing was lost when the market worker died. J18 claimed that
     * mapping lived only in the market D1 and built a two-day deadline on it; J15, twelve hours
     * earlier in the same log, said the opposite and was right.
     *
     * DRY BY DEFAULT — `?apply=1` writes. A pass that first reports what it WOULD do is the
     * only honest way to run a 177-row import against a live database once.
     *
     * IDEMPOTENT: image_id is derived from the key, so a second run is INSERT OR IGNORE and
     * changes nothing. Re-running is a diff, not a duplicate.
     */
    if (path === '/image/adopt') {
      const apply = url.searchParams.get('apply') === '1';
      const listed = await bucket.list({ prefix: LEGACY_PREFIX, limit: 1000 });
      const objects = listed.objects || [];

      /* Match on the artwork id, then on any recorded ALIAS. `artwork_alias.norm` exists for
       * exactly this — the market and this app both hand-wrote kebab slugs and they will not
       * always agree. A miss is not a failure: an unmatched photo still imports (Q23 C) and is
       * linkable by tapping later, which is what Q17b's rejection of "investigate first" meant. */
      const known = new Map();
      for (const r of await all('SELECT artwork_id FROM artwork')) known.set(r.artwork_id, r.artwork_id);
      for (const r of await all('SELECT artwork_id, norm FROM artwork_alias')) if (!known.has(r.norm)) known.set(r.norm, r.artwork_id);

      const matched = [], unmatched = [], stmts = [];
      for (const o of objects) {
        const parts = o.key.split('/');
        if (parts.length < 3) continue;                     // not prints/<id>/<file>
        const printId = parts[1];
        const imageId = 'scrub-' + parts.slice(1).join('-').replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 60);
        const artworkId = known.get(printId) || known.get(printId.replace(/-/g, '')) || null;

        /* ⚠️ sha256 IS LEFT NULL, DELIBERATELY. R2's etag is NOT a sha256 for a multipart object,
         * and `ux_image_sha` is a UNIQUE index — writing etags into it would build a
         * duplicate-detection index that quietly lies. NULL is honest and the partial index
         * skips it. The cost: a legacy photo later re-uploaded by hand will not dedupe against
         * its own adopted row. Accepted, and stated rather than discovered. */
        stmts.push(db.prepare(
          `INSERT OR IGNORE INTO image (image_id,r2_key,kind,content_type,bytes,
                                        caption,subject,credit,status,created_at)
           VALUES (?,?,'scrub',?,?,?,'reference','anastasia','active',?)`
        ).bind(imageId, o.key, (o.httpMetadata && o.httpMetadata.contentType) || 'image/jpeg',
               o.size || null, printId, t));

        if (artworkId) {
          matched.push({ key: o.key, print_id: printId, artwork_id: artworkId });
          /* Attach to the artwork's IMPLICIT edition, never as primary. Q17b's floor means hers
           * shows only until his own arrives, and sort 100 puts her behind anything he shoots. */
          stmts.push(db.prepare(
            `INSERT OR IGNORE INTO edition_image (edition_id,image_id,status,is_primary,sort,created_at)
             SELECT edition_id, ?, 'active', 0, 100, ? FROM edition
              WHERE artwork_id = ? AND implicit = 1`
          ).bind(imageId, t, artworkId));
        } else {
          unmatched.push({ key: o.key, print_id: printId });
        }
      }

      if (!apply) {
        return reply({ ok: true, dry_run: true,
          found: objects.length, truncated: !!listed.truncated,
          would_match: matched.length, would_import_unmatched: unmatched.length,
          matched_sample: matched.slice(0, 15), unmatched_sample: unmatched.slice(0, 15),
          note: 'NOTHING WAS WRITTEN. Re-POST with ?apply=1 to run it. Unmatched photos still import (Q23 C) — they are hidden behind the Photos toggle, not discarded.' });
      }

      if (!stmts.length) return reply({ ok: true, applied: true, found: 0, matched: 0, unmatched: 0, note: 'nothing under the prints/ prefix' });
      await db.batch(stmts);
      return reply({ ok: true, applied: true, found: objects.length,
                     matched: matched.length, unmatched: unmatched.length,
                     note: 'Unmatched rows are kind=scrub and appear only under ?scope=theirs.' });
    }
  }

  return null;   // not an image route after all — let worker.js decide what nothing-matched means
}
