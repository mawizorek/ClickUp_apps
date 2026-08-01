/* Inciardi Collection — THE ONE-OFF PASSES. Legacy adoption + the bucket diagnostic.
 *
 * ============================================================================
 * SPLIT OUT OF `images.js` 2026-08-01, BEFORE MERGE, AND THE REASON IS AN OWN GOAL.
 *
 * `images.js` came out of its first push at 26,603 bytes — over the ~22KB practical ceiling
 * this repo enforces (base64 inflates 4/3, so 26.6KB on disk returns ~35KB against a ~30KB read
 * cap). It was written in a commit whose own message quotes that ceiling at another file, and
 * it could not have been read back whole.
 *
 * 🔴 Caught by MEASURING the push response rather than by feeling, and fixed before the merge
 * rather than filed as debt — the entire cost lands on the NEXT session, which inherits a file
 * it cannot safely edit. THIRD INSTANCE IN THIS APP IN THREE DAYS (arrange.js at v17, boot.js
 * at v19, this). All three were COMMENT WEIGHT, not code.
 *
 * THE SEAM IS ROUTINE vs ONE-OFF, not size-for-size:
 *   images.js — the everyday pipe. Upload, serve, list, assign, set-primary, archive.
 *   this file — the two things you run ONCE, or when something is wrong.
 * They share a bucket handle and nothing else. `adopt` should ideally never run twice, and it
 * does not belong next to the routes that run every day.
 * ============================================================================
 *
 * 🔴 READ BEFORE RUNNING THE ADOPTION PASS — THE LEGACY IDS ARE NOT WHAT THE LOG CLAIMS.
 *
 * The peek route below was run live the moment the R2 binding landed. 177 objects, and the
 * first ten keys alphabetically are:
 *
 *     prints/1-10/…   prints/1/…   prints/10-12/…   prints/12-x-16/…
 *
 * Those are not print names. `1`, `1-10`, `12-x-16` are COLLAPSED SLUGS and DIMENSIONS — the
 * market slugified product-variant titles and numbered or sized variants collapsed to digits.
 * ⭐ That is precisely the `slug("#1") -> "1"` collision named at the top of `schema.sql` as the
 * bug that made this whole rebuild necessary, sitting untouched in the bucket the adoption pass
 * reads.
 *
 * ⚠️ SO TWO CONFIDENT CLAIMS IN THE DECISION LOG ARE WRONG. J15: "the market keys are already
 * prints/<print_id>/<image_id>, so the slug hint is in the key." J21 escalated that to "the key
 * IS the mapping" and used it to retire a standing deadline. Both are true of the FORMAT and
 * false of the CONTENT — the key has a slug-shaped segment, and that segment is frequently
 * meaningless.
 *
 * ⚠️ HOW MUCH OF THE 177 IS AFFECTED WAS NOT STATED, ON PURPOSE. The sample was the first ten
 * of an ALPHABETICAL listing, so digits sort first BY CONSTRUCTION. A ten-row alphabetical
 * sample cannot answer "what shape are these ids" — it can only show you the front of the
 * alphabet, and it would have produced a frightening answer or a reassuring one depending only
 * on where you stopped reading. Reporting every id below is the fix. Count, do not sample.
 */

export const ADOPT_ROUTES = ['GET /bucket/peek', 'POST /image/adopt?apply=1'];

const LEGACY_PREFIX = 'prints/';   // hers, written by the retired market worker
const KEY_PREFIX = 'ed/';          // ours, content-addressed

/* A print id is useful only if it NAMES something. `12-x-16` and `1-10` do not. This is the
 * same test `badSlug()` applies in worker.js at entry time — "digits only… the collision that
 * broke the last app" — applied retroactively to ids the predecessor minted before that rule
 * existed. */
const isMeaninglessId = id => /^[0-9]+(-[0-9]+)*$/.test(id) || /^[0-9]+-x-[0-9]+$/.test(id);

export async function handleAdopt(ctx) {
  const { db, bucket, all, reply, path, url, method, t } = ctx;

  /* ============================================================ GET /bucket/peek
   * A DIAGNOSTIC, AND IT EXISTS BECAUSE I NEARLY SPENT MICHAEL'S ATTENTION ON A LOOKUP.
   *
   * The claim "every legacy object is filed under the print it belongs to" was read out of
   * `inciardi-market/db/schema.sql`'s comment — INTENT, not observation — and he was asked to
   * open a dashboard and read a filename back. Wrong instinct: a fact reachable in fifteen
   * lines of code is not a fact to delegate to a human. ⭐ And when the code ran it REFUTED the
   * claim the human would have been asked to confirm, which is the whole argument for building
   * the lookup instead of asking.
   *
   * ⭐ It also DOUBLES AS THE R2 BINDING TEST, which nothing else in this app is. Binding a
   * bucket changes nothing observable until something reads it — `/health` answers identically
   * bound or not — and that is exactly how migration 001 broke three routes for five hours
   * behind a green health check. This is the route that touches the altered thing.
   */
  if (path === '/bucket/peek' && method === 'GET') {
    const listed = await bucket.list({ limit: 1000 });
    const keys = (listed.objects || []).map(o => o.key);
    const count = p => keys.filter(k => k.startsWith(p)).length;

    const ids = [...new Set(keys.filter(k => k.startsWith(LEGACY_PREFIX) && k.split('/').length >= 3)
                                .map(k => k.split('/')[1]))].sort();
    const meaningless = ids.filter(isMeaninglessId);
    const named = ids.filter(id => !isMeaninglessId(id));

    return reply({ ok: true,
      total_listed: keys.length,
      truncated: !!listed.truncated,
      prefixes: {
        'prints/ (hers, legacy)': count(LEGACY_PREFIX),
        'ed/ (ours)': count(KEY_PREFIX),
        'snapshots/ (market backups)': count('snapshots/'),
        other: keys.filter(k => !k.startsWith(LEGACY_PREFIX) && !k.startsWith(KEY_PREFIX) && !k.startsWith('snapshots/')).length
      },
      legacy_ids: {
        distinct: ids.length,
        named: named.length,
        meaningless: meaningless.length,
        named_sample: named.slice(0, 40),
        meaningless_sample: meaningless.slice(0, 40)
      },
      note: 'A "meaningless" id is digits or a dimension (1, 1-10, 12-x-16) — the slug("#1") collision this app was rebuilt to escape. Those objects still ADOPT (Q23 C keeps them) but can never auto-match an artwork, so they land unassigned under ?scope=theirs and are linkable by eye from the grid.'
    });
  }

  /* ============================================================ POST /image/adopt
   * SPEC STEP 12 — bring in the legacy objects Anastasia's shop images left in this bucket.
   * Q17b D: adopt as a FLOOR. Hers renders until Michael shoots his own; then his becomes
   * primary and hers stays in the carousel.
   *
   * DRY BY DEFAULT — `?apply=1` writes. A pass that first reports what it WOULD do is the only
   * honest way to run a 177-row import against a live database once.
   *
   * IDEMPOTENT: image_id is derived from the key, so a second run is INSERT OR IGNORE and
   * changes nothing. Re-running is a diff, not a duplicate.
   *
   * ⚠️ EXPECT A LOW MATCH RATE — see the header. Q17b struck "investigate first" precisely
   * because the match rate does not gate anything: an unmatched photo still imports and stays
   * linkable by tapping. The dry run reports the real number before anything is written.
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

    const matched = [], unmatched = [], junk = [], stmts = [];
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
        /* ⭐ SPLIT THE MISSES IN TWO, because they need different answers and lumping them hides
         * the finding. `negroni` missed because Michael does not own that print — nothing to do,
         * and buying one later fixes it. `12-x-16` missed because it never named anything, and
         * no alias, no fuzzy match and no second pass will ever fix it. */
        if (isMeaninglessId(printId)) junk.push(printId);
      }
    }

    if (!apply) {
      return reply({ ok: true, dry_run: true,
        found: objects.length, truncated: !!listed.truncated,
        would_match: matched.length, would_import_unmatched: unmatched.length,
        of_which_unnameable: junk.length,
        matched_sample: matched.slice(0, 15), unmatched_sample: unmatched.slice(0, 15),
        note: 'NOTHING WAS WRITTEN. Re-POST with ?apply=1 to run it. Unmatched photos still import (Q23 C) — hidden behind the Photos toggle, not discarded. The "unnameable" ones carry a digits-or-dimension id and can never auto-match; they are linkable by eye from the grid.' });
    }

    if (!stmts.length) {
      return reply({ ok: true, applied: true, found: 0, matched: 0, unmatched: 0,
                     note: 'nothing under the prints/ prefix' });
    }
    await db.batch(stmts);
    return reply({ ok: true, applied: true, found: objects.length,
                   matched: matched.length, unmatched: unmatched.length,
                   of_which_unnameable: junk.length,
                   note: 'Unmatched rows are kind=scrub and appear only under ?scope=theirs.' });
  }

  return null;
}
