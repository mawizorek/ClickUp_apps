/* Inciardi Collection — THE ONE-OFF PASSES. Legacy adoption + the bucket diagnostic.
 *
 * ============================================================================
 * SPLIT OUT OF `images.js` 2026-08-01, BEFORE MERGE, AND THE REASON IS AN OWN GOAL.
 *
 * `images.js` came out of its first push at **26,603 bytes** — comfortably over the ~22KB
 * practical ceiling this repo enforces (base64 inflates 4/3, so 26.6KB on disk returns ~35KB
 * against a ~30KB read cap). The file had been written in a commit whose own message quotes
 * that ceiling at another file. It could not have been read back whole.
 *
 * 🔴 It was caught by MEASURING the push response rather than by feeling, and fixed before the
 * merge rather than filed as debt — because the entire cost of the defect lands on the NEXT
 * session, which inherits a file it cannot safely edit. THIRD INSTANCE IN THIS APP IN THREE
 * DAYS (arrange.js at v17, boot.js at v19, this). All three were COMMENT WEIGHT, not code.
 *
 * THE SEAM IS ROUTINE vs ONE-OFF, not size-for-size:
 *   images.js — the everyday pipe. Upload, serve, list, assign, set-primary, archive.
 *   this file — the two things you run ONCE, or when something is wrong.
 * They share a bucket handle and nothing else. `adopt` in particular is a route that should
 * ideally never run twice, and it does not belong next to the routes that run every day.
 * ============================================================================
 */

export const ADOPT_ROUTES = ['GET /bucket/peek', 'POST /image/adopt?apply=1'];

const LEGACY_PREFIX = 'prints/';   // hers, written by the retired market worker
const KEY_PREFIX = 'ed/';          // ours, content-addressed

export async function handleAdopt(ctx) {
  const { db, bucket, all, reply, path, url, method, t } = ctx;

  /* ============================================================ GET /bucket/peek
   * A DIAGNOSTIC, AND IT EXISTS BECAUSE I NEARLY SPENT MICHAEL'S ATTENTION ON A LOOKUP.
   *
   * The claim "every legacy object is filed under the print it belongs to" was read out of
   * `inciardi-market/db/schema.sql`'s comment — INTENT, not observation. I asked him to open
   * the dashboard and read a filename back to me. Wrong instinct: a fact reachable in fifteen
   * lines of code is not a fact to delegate to a human.
   *
   * ⭐ It also DOUBLES AS THE R2 BINDING TEST, which nothing else in this app is. Binding a
   * bucket changes nothing observable until something reads it — `/health` answers identically
   * bound or not — and that is precisely how migration 001 broke three routes for five hours
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
   * DRY BY DEFAULT — `?apply=1` writes. A pass that first reports what it WOULD do is the only
   * honest way to run a 177-row import against a live database once.
   *
   * IDEMPOTENT: image_id is derived from the key, so a second run is INSERT OR IGNORE and
   * changes nothing. Re-running is a diff, not a duplicate.
   */
  if (path === '/image/adopt' && method === 'POST') {
    const apply = url.searchParams.get('apply') === '1';
    const listed = await bucket.list({ prefix: LEGACY_PREFIX, limit: 1000 });
    const objects = listed.objects || [];

    /* Match on the artwork id, then on any recorded ALIAS. `artwork_alias.norm` exists for
     * exactly this — the market and this app both hand-wrote kebab slugs and they will not
     * always agree. A miss is NOT a failure: an unmatched photo still imports (Q23 C) and stays
     * linkable by tapping later, which is what Q17b's rejection of "investigate first" meant. */
    const known = new Map();
    for (const r of await all('SELECT artwork_id FROM artwork')) known.set(r.artwork_id, r.artwork_id);
    for (const r of await all('SELECT artwork_id, norm FROM artwork_alias')) if (!known.has(r.norm)) known.set(r.norm, r.artwork_id);

    const matched = [], unmatched = [], stmts = [];
    for (const o of objects) {
      const parts = o.key.split('/');
      if (parts.length < 3) continue;                       // not prints/<id>/<file>
      const printId = parts[1];
      const imageId = 'scrub-' + parts.slice(1).join('-').replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 60);
      const artworkId = known.get(printId) || known.get(printId.replace(/-/g, '')) || null;

      /* ⚠️ sha256 IS LEFT NULL, DELIBERATELY. R2's etag is NOT a sha256 for a multipart object,
       * and `ux_image_sha` is a UNIQUE index — writing etags into it would build a
       * duplicate-detection index that quietly lies. NULL is honest and the partial index skips
       * it. The cost: a legacy photo later re-uploaded by hand will not dedupe against its own
       * adopted row. Accepted, and stated rather than discovered. */
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

    if (!stmts.length) {
      return reply({ ok: true, applied: true, found: 0, matched: 0, unmatched: 0,
                     note: 'nothing under the prints/ prefix' });
    }
    await db.batch(stmts);
    return reply({ ok: true, applied: true, found: objects.length,
                   matched: matched.length, unmatched: unmatched.length,
                   note: 'Unmatched rows are kind=scrub and appear only under ?scope=theirs.' });
  }

  return null;
}
