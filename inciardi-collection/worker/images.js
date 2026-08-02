/* Inciardi Collection — THE PHOTO PIPE. Four routes: bytes in, bytes out, the grid, the print.
 *
 * ============================================================================
 * NEW FILE 2026-08-01. `worker.js` sat at ~21KB against a ~22KB practical ceiling when this was
 * written and its own header says in capitals that the next route does not go in it.
 *
 * ⚠️ AND THIS FILE HAS NOW BROKEN THE SAME CEILING THREE TIMES. 26,603 bytes on its first push
 * (one-off routes → `worker/adopt.js`), then 21,455 with ~545 of headroom (the three link writes
 * → `worker/links.js`), then 21,944 on the v22 branch — EVERY ONE OF THEM COMMENT WEIGHT, not
 * code, and the third one inside a PR about ordering discipline. All three were caught by
 * reading the byte count in the push response rather than by feel.
 *
 * 🔴 THE RULE THAT WOULD HAVE CAUGHT ALL THREE: measure the file you are about to write into,
 * BEFORE you write. A file at 21KB has room for a route or a paragraph, never both. And when
 * the reasoning already lives somewhere — the Decision Log, another module's header — a copy of
 * it here is not documentation, it is weight.
 *
 * WHAT BELONGS HERE: **if a route does not touch R2 or return an image, it does not.**
 * ⚠️ `GET /images` is the standing exception and always was — it returns image ROWS, but it is
 * the query every surface uses to FIND an image before asking for one.
 *
 * 🔴 WHY THE DISPATCH SITS BEFORE THE BODY PARSE IN worker.js — NOT A STYLE CHOICE.
 * worker.js runs `body = await request.json()` on every write, which CONSUMES THE REQUEST
 * STREAM. An upload's body is BYTES. Dispatched after that line, this file would receive an
 * already-drained body and write a zero-length object to R2 behind a perfectly successful
 * response — a silent empty file, the worst failure shape this app knows. So: the write-key
 * gate fires FIRST, then images dispatch, then the JSON parse for everything else.
 * ⚠️ `links.js` is the OPPOSITE and dispatches AFTER the parse, because its bodies really are
 * JSON. Two image-ish modules, two positions, one reason.
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
 * database for 30 days and covers R2 for NOTHING. There is no delete route here and there must
 * never be one: archiving is a `status` flip (in `links.js`) and the object stays.
 *
 * ⚠️ NOT BUILT, each a decision rather than an oversight:
 *   - DERIVATIVES — deferred with a named trigger (J25). One image per shot; `-t.jpg` by
 *     convention off the same key when the grid is visibly slow, with rows lacking one falling
 *     back to the full image. No schema change either way. Full reasoning is in J25; it is not
 *     repeated here, because that is how this file got to 21,944 bytes.
 *   - EXIF — `shot_at` is a parameter here and never derived. Reading it is capture.js's job
 *     and MUST happen BEFORE the canvas re-encode (J16). ✅ VERIFIED ON REAL FILES 2026-08-01.
 */

import { linkImage, photoOrder } from './links.js';

export const IMAGE_ROUTES = [
  'GET /images?scope=', 'GET /images?artwork=', 'GET /image/:id', 'POST /image'
];

/* Q23 → C. "Bring in all 177, but hide the non-matches behind a switch." The 177 are
 * Anastasia's SHOP product photographs, mostly of prints Michael has never held — worth keeping
 * as a reference wall, wrong as the first thing the Photos screen shows.
 *
 * ⭐ NO NEW COLUMN, because the fact is already stored: `image.kind` already means "whose bytes
 * are these." An `is_reference` flag would have been a SECOND CLAIMANT on a fact `kind` owns.
 */
const SCOPES = {
  mine:   "i.kind = 'upload'",
  theirs: "i.kind IN ('scrub','reference')",
  all:    '1=1'
};

const KEY_PREFIX = 'ed/';
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/* The paths this module owns. Exact matches; the serve route is matched separately because it
 * carries an id.
 *
 * 🔴 THIS LIST SHRANK WITH THE SPLIT AND THAT IS LOAD-BEARING, NOT TIDYING. The guard below
 * claims the route BEFORE checking the bucket (#666), so if the three link paths were still
 * listed here this file would claim routes it no longer implements, fall past the guard, and
 * return `null` from the bottom — the #666 shadowing bug wearing a different hat. */
const MINE = ['/images', '/image'];

const intOrNull = v => (v == null || v === '' || isNaN(Number(v))) ? null : parseInt(v, 10);

async function sha256Hex(buf) {
  const d = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function handleImage(ctx) {
  const { request, db, bucket, all, reply, path, url, method, t } = ctx;

  /* 🔴 CLAIM THE ROUTE FIRST, THEN CHECK THE BUCKET. The ORDER is the fix.
   *
   * This guard originally read `if (path !== '/images' && !bucket) return 503` — and worker.js
   * hands this function EVERY path. So on a worker with no R2 binding, `POST /artwork` would
   * have been answered "no R2 binding on this worker": the app's primary write, shadowed by a
   * module it has nothing to do with. ⚠️ This file's own header forbids exactly that, three
   * paragraphs above the code that did it. A guard placed BEFORE the route match IS a 404 for
   * every path it does not recognise. Caught by reading the guard against worker.js's DISPATCH
   * rather than against this file's comment: a comment states intent, the dispatch is evidence.
   */
  const isServe = method === 'GET' && path.startsWith('/image/');
  if (!isServe && !MINE.includes(path)) return null;

  /* Only TWO routes actually touch R2 — the upload and the proxy. `GET /images` answers with no
   * binding at all, deliberately: the Photos screen and the carousel should render and say "no
   * photos" rather than 503 over a config fact. A missing binding is a DEPLOYMENT fact; the
   * plausible cause is a deploy whose token had no R2 permission, which fails the deploy — so
   * if you are seeing this at runtime the running worker is older than you think. */
  if ((isServe || (path === '/image' && method === 'POST')) && !bucket) {
    return reply({ ok: false, error: 'no R2 binding on this worker',
      fix: 'wrangler.toml needs [[r2_buckets]] binding = "BUCKET", then a redeploy. If it IS already in the file, the last deploy FAILED — check the Actions run rather than editing the config again.' }, 503);
  }

  /* ============================================================ GET /images?artwork=
   * ⭐ THE CAROUSEL READ (v22, Q25 → A). Every photograph of one print, in display order.
   *
   * 🔴 IT IS THE BINDER CARD'S QUERY WITHOUT THE `LIMIT 1`. `reads.js` wraps the same
   * `photoOrder()` in a scalar subquery to pick one; this runs it as a list. **That is what
   * makes the card photo the carousel's FIRST FRAME — structurally, not by agreement.** If the
   * binder shows photo X and this opens on photo Y, someone forked the ordering; un-fork it
   * rather than adding a rule about keeping them in step. Terms are documented once, in
   * `links.js` → photoOrder.
   *
   * 🔴 `?artwork=`, NOT THE `?edition=` ORIGINALLY LOCKED (Q25 → A). The ranking correlates on
   * `edition.artwork_id`, so the card is chosen across every PRINTING; `sort` is per-printing;
   * and the page asking is `#artwork?id=`. Key this to the edition and the day a reprint exists
   * (J19 says it is coming) the card can show a photo the carousel does not contain. Keyed to
   * the page, that is unreachable. ⚠️ No `?edition=` alongside it: a filter with no caller is a
   * fact with no claimant, and it is one WHERE clause on the day something needs it.
   *
   * ⭐ AND IT IS THE DEPLOY'S ACCEPTANCE TEST. #679 was a verbatim move — no live read could
   * tell the new worker from the old, so "deployed" was unverifiable. This is the first route
   * that answers differently: the old worker ignores the parameter and returns the unassigned
   * grid, which is a visibly different response, not a subtly different one.
   *
   * `edition_id` rides on every row because attaching, unlinking and starring are all
   * per-printing writes.
   */
  if (path === '/images' && method === 'GET' && (url.searchParams.get('artwork') || '').trim()) {
    const artworkId = url.searchParams.get('artwork').trim();
    const photos = await all(
      `SELECT i.image_id, i.caption, i.subject, i.credit, i.shot_at, i.kind,
              i.content_type, i.width, i.height, i.bytes, i.created_at,
              ei.edition_id, ei.sort, ei.created_at AS linked_at,
              e.label AS edition_label, e.implicit AS edition_implicit,
              (SELECT COUNT(*) FROM edition_image x WHERE x.image_id = ei.image_id) AS links
         FROM edition_image ei
         JOIN edition e ON e.edition_id = ei.edition_id
         JOIN image i   ON i.image_id   = ei.image_id
        WHERE e.artwork_id = ? AND ei.status = 'active' AND i.status = 'active'
        ORDER BY ${photoOrder('ei')}`, [artworkId]);

    /* The first row IS the binder card's photo. Named in the response rather than left for the
     * client to infer from position, so a surface that renders them out of order cannot quietly
     * disagree with the binder about which one is the print's picture. */
    return reply({ ok: true, at: t, artwork_id: artworkId, total: photos.length,
                   card: photos.length ? photos[0].image_id : null, photos: photos });
  }

  /* ============================================================ GET /images
   * The Photos surface. UNASSIGNED IS THE DEFAULT VIEW (Q19 + J15) — the backlog is the first
   * thing you see, the same argument that made the shoe-box the shoe-box.
   *
   * ⚠️ `is_primary_anywhere` IS NOW MEANINGLESS and is kept only because `photos.js` reads it.
   * Q26 retired `is_primary` from the display ranking in favour of `edition_image.sort`, so it
   * can only report 0 on anything written since v22. Out when photos.js is next touched; the
   * column goes with migration 002. Do not build on it.
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
     * hers." Computed HERE for the same reason /summary computes its totals: a client that
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
  if (isServe) {
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

  return null;   // not an image route after all — let worker.js decide what nothing-matched means
}
