/* Inciardi Collection — THE READS. Seven GET routes, no writes, no auth.
 *
 * ============================================================================
 * SPLIT OUT OF `worker.js` 2026-08-01, and the reason is mechanical rather than aesthetic.
 *
 * `worker.js` reached **29,326 bytes against a ~30KB hard read cap** — 674 bytes of headroom.
 * A file that cannot be read whole cannot be safely edited, so every change to it was one
 * accidental growth away from becoming a blind full retype. THREE consecutive version notes
 * promised this split before the next route; the image routes (`worker/images.js`) are the next
 * route, so it had to happen first or they would have landed in a file nobody could verify.
 *
 * WHY THE READS ARE THE HALF THAT LEFT, and not the writes:
 *   - They are ~10KB of the file and `/summary` + `/shoebox` are most of that.
 *   - They are PURE. No auth, no timestamps, no mutation, no shared state. The seam is already
 *     there in the original file as a comment banner; this only makes it a file boundary.
 *   - The writes are the dangerous half, and the dangerous half should be the one that stays
 *     where every reader expects it. Moving `write()` would have relocated the one-write-path
 *     rule (J6 rung 4) out of the file named `worker.js`.
 *
 * 🔴 WHAT DID NOT CHANGE: not one line of SQL, not one response shape, not one comment's
 * meaning. This is a MOVE. A split commit is exactly where a quiet behavioural edit hides, so
 * nothing rode along — same discipline as the `.proposed` → canonical rename at J8.
 * ============================================================================
 *
 * CONTRACT with worker.js: it hands over everything this file needs, so this file reaches for
 * no globals and holds no state.
 *   path   the normalized pathname          all(sql, params)  → rows
 *   url    the parsed URL (query params)    reply(data, status) → Response
 *   t      the request timestamp
 * Returns a Response, or `null` meaning "not my route" — which is what lets worker.js fall
 * through to the writes without either file knowing the other's route list.
 */

/* 🔴 EXPORTED SO THE 404 CANNOT LIE. The "no route" reply lists every route the API has, and
 * that list now spans two files — a hardcoded copy in worker.js would be a second source of
 * truth about which routes exist, and it would rot the first time a read is added here. Same
 * rule the whole app runs on: one claimant per fact. */
export const READ_ROUTES = [
  'GET /health', 'GET /artworks', 'GET /summary', 'GET /shoebox', 'GET /sheets',
  'GET /slots?sheet=', 'GET /editions?artwork='
];

export async function handleRead({ path, url, all, reply, t }) {

  if (path === '/health') {
    const counts = await all(
      `SELECT (SELECT COUNT(*) FROM artwork)  AS artworks,
              (SELECT COUNT(*) FROM edition)  AS editions,
              (SELECT COALESCE(SUM(qty),0) FROM copy WHERE disposition='own') AS owned,
              (SELECT COUNT(*) FROM sheet)    AS sheets,
              (SELECT COUNT(*) FROM slot)     AS slots`);
    // NOTE: owned is SUM(qty), never COUNT(*). See the comment block on `copy`.
    return reply({ ok: true, at: t, counts: counts[0] });
  }

  if (path === '/artworks') {
    return reply({ artworks: await all(
      `SELECT a.artwork_id, a.name, a.category, a.edition_type, a.collection_id,
              a.retail, a.confidence, a.provenance, a.notes,
              COALESCE(o.qty_owned,0)      AS qty_owned,
              COALESCE(o.editions_owned,0) AS editions_owned,
              (SELECT COUNT(*) FROM edition e WHERE e.artwork_id = a.artwork_id) AS editions,
              (SELECT COUNT(*) FROM slot s WHERE s.artwork_id = a.artwork_id)    AS placed_count
         FROM artwork a
         LEFT JOIN v_owned o ON o.artwork_id = a.artwork_id
        WHERE a.status = 'active'
        ORDER BY a.name COLLATE NOCASE`) });
  }

  /* ============================================================ /summary
   * THE WHOLE COLLECTION IN ONE READ. Michael: "a clean summary of my entire print
   * collection… total counts, how many are placed, how many are still in shoebox, in a
   * tight matrix… (eventually with drill in to: placed twice on this page and this page
   * and 4 in shoebox) with direct links."
   *
   * Returns TWO arrays and lets the client join them, rather than one row per artwork
   * with a GROUP_CONCAT of placements. Deliberate: a concatenated string would have to be
   * parsed back apart, and a print titled with the delimiter would silently corrupt the
   * drill-in. Two clean shapes beat one clever one.
   *
   * 🔴 THE ARITHMETIC, STATED BECAUSE IT IS EASY TO GET WRONG AND IMPOSSIBLE TO SPOT:
   *   qty_owned   = SUM(copy.qty) — COPIES. Never COUNT(*) (see v_owned).
   *   placed      = COUNT(slot rows) — SLOTS, not copies. One print in three slots is
   *                 placed=3 while owned=1, which is legal (J2 ruling 3).
   *   in_binder   = MIN(owned, placed) — copies actually in the binder. This is the number
   *                 that pairs with `spare`; a bare SUM of `placed` across the collection
   *                 would over-count every duplicate placement.
   *   spare       = MAX(0, owned - placed) — copies left in the shoe-box.
   * in_binder + spare == qty_owned, always. That identity is the reason to compute both
   * here rather than let two surfaces each do their own subtraction.
   *
   * Rows include artworks with owned=0 (a `wanted` print placed as a gap marker) so the
   * matrix can show the wishlist rather than pretending it isn't part of the collection.
   * The client separates them; the query does not decide that.
   *
   * ⚠️ THIS IS ALSO WHAT `#artwork?id=` READS (v19). The detail page needs one print's counts
   * plus every placement of it, which is this response filtered client-side — so it deliberately
   * did NOT get a route of its own. A second query returning the same numbers is a second thing
   * that can disagree with the Collection matrix.
   */
  if (path === '/summary') {
    const prints = await all(
      `SELECT a.artwork_id, a.name, a.category, a.collection_id, a.retail, a.confidence,
              COALESCE(o.qty_owned, 0)                       AS qty_owned,
              COALESCE(o.editions_owned, 0)                  AS editions_owned,
              COALESCE(o.qty_sold, 0)                        AS qty_sold,
              COALESCE(p.n, 0)                               AS placed,
              MIN(COALESCE(o.qty_owned,0), COALESCE(p.n,0))  AS in_binder,
              MAX(0, COALESCE(o.qty_owned,0) - COALESCE(p.n,0)) AS spare
         FROM artwork a
         LEFT JOIN v_owned o ON o.artwork_id = a.artwork_id
         LEFT JOIN (
               SELECT artwork_id, COUNT(*) AS n
                 FROM slot
                WHERE artwork_id IS NOT NULL
                GROUP BY artwork_id
             ) p ON p.artwork_id = a.artwork_id
        WHERE a.status = 'active'
        ORDER BY a.name COLLATE NOCASE`);

    // Every placement, in binder order, carrying the sheet's TITLE and ORDER so the client
    // can render "Veggies · front · slot 4" and a deep link without a second round trip.
    const placements = await all(
      `SELECT s.slot_id, s.artwork_id, s.sheet_id, s.side, s.position,
              sh.title AS sheet_title, sh.sheet_order
         FROM slot s
         JOIN sheet sh ON sh.sheet_id = s.sheet_id
        WHERE s.artwork_id IS NOT NULL
        ORDER BY sh.sheet_order, s.side, s.position`);

    // Collection-level roll-up. Computed here so the header strip and the rows can never
    // disagree — the client sums nothing.
    const tot = await all(
      `SELECT (SELECT COUNT(*) FROM artwork WHERE status='active') AS prints,
              (SELECT COALESCE(SUM(qty),0) FROM copy WHERE disposition='own') AS copies,
              (SELECT COUNT(*) FROM slot WHERE artwork_id IS NOT NULL) AS placements,
              (SELECT COUNT(*) FROM slot WHERE artwork_id IS NULL AND note IS NOT NULL) AS notes,
              (SELECT COUNT(*) FROM sheet) AS sheets`);

    const totals = tot[0] || {};
    // in_binder / spare roll up from the per-print MIN/MAX, NOT from totals.placements —
    // see the arithmetic note above. Summing `placed` would count a triple-placed single
    // print as three copies in the binder.
    totals.in_binder = prints.reduce((n, r) => n + r.in_binder, 0);
    totals.spare = prints.reduce((n, r) => n + r.spare, 0);
    totals.unhoused = prints.filter(r => r.qty_owned > 0 && r.placed === 0).length;
    totals.wanted = prints.filter(r => r.qty_owned === 0 && r.placed > 0).length;
    totals.slots = (totals.sheets || 0) * 18;

    return reply({ ok: true, at: t, totals: totals, prints: prints, placements: placements });
  }

  /* ============================================================ /shoebox
   * REWRITTEN 2026-07-30 (Michael: "how do we still show '1 placed in binder' and also
   * '5 in shoebox still' but not cock-up what has no place in the binder yet").
   *
   * It used to be `SELECT * FROM v_shoebox`, which answered ONLY "what have I not placed
   * AT ALL?" — own six Watermelons, place one, and Watermelon vanished from the box even
   * though five are physically sitting in it. That was documented as accepted imprecision
   * needing "a schema change (per-copy location)".
   *
   * 🔴 THAT DOC NOTE WAS HALF WRONG, and this query is the correction. The COUNT needs no
   * schema change whatsoever — it is arithmetic over two numbers we already store:
   *      spare = qty_owned  -  placed_count
   * What genuinely DOES need per-copy location is IDENTITY: *which* physical copy is in the
   * sleeve versus the box. Nobody has ever needed that. Do not confuse the two again.
   *
   * TWO BOX STATES, kept separate on purpose because Michael asked for exactly that:
   *   unhoused → placed_count = 0. Nothing of this print is in the binder yet. This is the
   *              ORIGINAL shoe-box set, unchanged, so the old meaning is not "cocked up".
   *   spare    → placed_count > 0 AND qty_owned > placed_count. One's on a sheet, the rest
   *              are in the box.
   *
   * HONESTY NOTE — this is an INFERENCE, not a ledger. Placements do not consume copies
   * anywhere in the schema, so `spare` is subtraction, not allocation. Two consequences,
   * both correct rather than bugs:
   *   - Own 1 and place it in 3 slots (legal, J2 ruling 3): spare goes to 0, not -2. You
   *     have nothing extra. The WHERE clause drops it, which is the honest answer.
   *   - A `wanted` slot (placed, owned 0) never reaches this query at all, because
   *     qty_owned > placed_count cannot hold at 0. A wishlist marker is not a print in a box.
   *
   * WHY THE SQL LIVES IN THE WORKER AND NOT IN A VIEW, stated because it deviates from rung 1
   * (the app's own rule is that derived facts belong in views): applying DDL to D1 needs a
   * terminal or the dashboard console, and Michael builds from a phone. A view change would
   * leave the app broken in the gap between deploying this code and him running a console
   * step by hand. Worker SQL ships atomically with the deploy, in one button press. It is
   * still the DATABASE computing it, not JavaScript. If a SECOND consumer ever needs these
   * numbers, promote this into `v_shoebox` then — one claimant on one truth, always.
   * (2026-07-30, later: /summary is now that second consumer for the SPARE arithmetic. It
   * recomputes MIN/MAX rather than calling this route, because it needs the same numbers
   * for prints this route deliberately excludes. If a third appears, promote to a view.)
   */
  if (path === '/shoebox') {
    return reply({ shoebox: await all(
      `SELECT a.artwork_id, a.name, a.collection_id, a.category, a.confidence,
              o.qty_owned,
              o.editions_owned,
              COALESCE(p.n, 0)                AS placed_count,
              o.qty_owned - COALESCE(p.n, 0)  AS spare,
              CASE WHEN COALESCE(p.n, 0) = 0 THEN 'unhoused' ELSE 'spare' END AS box_state
         FROM artwork a
         JOIN v_owned o ON o.artwork_id = a.artwork_id
         LEFT JOIN (
               SELECT artwork_id, COUNT(*) AS n
                 FROM slot
                WHERE artwork_id IS NOT NULL
                GROUP BY artwork_id
             ) p ON p.artwork_id = a.artwork_id
        WHERE a.status = 'active'
          AND o.qty_owned > COALESCE(p.n, 0)
        ORDER BY CASE WHEN COALESCE(p.n, 0) = 0 THEN 0 ELSE 1 END,
                 a.name COLLATE NOCASE`) });
  }

  if (path === '/sheets') {
    return reply({
      sheets: await all('SELECT * FROM v_sheet_fill ORDER BY sheet_order'),
      spread: await all('SELECT * FROM v_binder_spread ORDER BY side_index')
    });
  }

  // Slots for one sheet. state (owned/wanted/note) is DERIVED in v_slot — there is no
  // state column and there must never be one (J3).
  if (path === '/slots') {
    const sheet = url.searchParams.get('sheet');
    return reply({ slots: sheet
      ? await all('SELECT * FROM v_slot WHERE sheet_id = ? ORDER BY side, position', [sheet])
      : await all('SELECT * FROM v_slot ORDER BY sheet_id, side, position') });
  }

  if (path === '/editions') {
    const art = url.searchParams.get('artwork');
    return reply({ editions: await all(
      `SELECT edition_id, artwork_id, label, implicit, seq, edition_type
         FROM edition WHERE artwork_id = ? ORDER BY implicit DESC, seq, label`, [art]) });
  }

  /* NOT A READ ROUTE. Returning null rather than a 404 is load-bearing: worker.js falls
   * through to the writes, and only IT decides when nothing matched. A 404 here would
   * shadow every POST. */
  return null;
}
