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
 * 🔴 08-01, LATER THE SAME DAY — THIS FILE TOOK THE APP DOWN AND LOOKED FINE DOING IT.
 * Migration 001 dropped `artwork.collection_id`. Three of the seven routes below selected it,
 * so `/artworks`, `/summary` and `/shoebox` all returned 500 for five hours. `/health` does not
 * name the column, answered perfectly, and was the route used to "verify" the migration.
 * **A smoke test that predates a change cannot detect that change.** After any migration, hit a
 * route that reads the ALTERED TABLE. The column is gone from the three selects below; see each
 * one's note for what replaced it (nothing, deliberately).
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

/* ============================================================ CARD_IMAGE
 * 🔴 WHICH PHOTOGRAPH REPRESENTS A PRINT. One definition, three consumers, zero stored state.
 *
 * Until 2026-08-01 this did not exist and the three routes below returned NO image column at
 * all — so a photo could be uploaded, attached, and confirmed in the database while the binder,
 * the Collection matrix and the artwork page stayed blank. Attaching a photo appeared to do
 * nothing because nothing could see it.
 *
 * ⭐ MICHAEL'S RULE, AND IT BEAT MINE: *"if a photo is the ONLY photo attached, it should be the
 * default render even if not selected."*
 *
 * I had proposed writing `is_primary = 1` on first attach. His is a DERIVE where mine was a
 * WRITE — rung 1 against rung 2 of this app's own ladder — and the difference is not taste.
 * Under a stored first-attach flag, unlink that photo and attach a replacement and the print
 * goes BLANK until someone taps a button, because the fact was pinned to the row that left. A
 * derived answer cannot fall out of date with its own inputs.
 *
 * The ordering, one step past his rule, to serve the workflow he described in the same breath
 * (*"pack photos… then sliding them into the background carousel once we get standalones in"*):
 *
 *     is_primary DESC   an explicit ⭐ always wins. Nothing overrules a human choice.
 *     link_count ASC    a photo on ONE print beats a photo on nine.
 *     created_at DESC   newest of whatever is left.
 *
 * ⭐ THE MIDDLE LINE IS THE TRICK AND IT COSTS NO NEW COLUMN. A photo linked to several editions
 * is STRUCTURALLY a pack shot — being on nine prints is what makes it one. So J16's `subject`
 * field, invented for precisely this preference and never reachable from any UI, is not needed
 * here: the fact already lives in the join table. Today the pack photo renders on Pony and PBR
 * because it is all there is; the day a standalone PBR shot lands it carries link_count 1
 * against the pack's 2 and takes over by itself, nothing tapped.
 *
 * ⚠️ THIS BELONGS IN `v_slot`, NOT IN A WORKER STRING, AND THAT IS OWED DEBT. `views.sql` says
 * to promote a worker query into a view at the SECOND consumer; this has THREE on day one. It
 * is here because a view change means migration 002 + three workflow edits + a button press,
 * and the ask was photos in the binder soon. When 002 happens for any other reason, this goes
 * with it. Until then: ONE constant, three call sites — never a second copy of the ordering.
 */
const CARD_IMAGE = `(
  SELECT ei.image_id
    FROM edition_image ei
    JOIN edition e2 ON e2.edition_id = ei.edition_id
    JOIN image im   ON im.image_id   = ei.image_id
   WHERE e2.artwork_id = %A% AND ei.status = 'active' AND im.status = 'active'
   ORDER BY ei.is_primary DESC,
            (SELECT COUNT(*) FROM edition_image x WHERE x.image_id = ei.image_id) ASC,
            ei.created_at DESC
   LIMIT 1
)`;

/* The subquery correlates to whatever the outer query calls `artwork`, and the three routes use
 * three different aliases (`s.artwork_id`, `a.artwork_id`). Substituting the alias keeps ONE
 * definition instead of three near-copies that can drift — which is the entire failure mode
 * this app is built to refuse. */
const cardImage = (aliasExpr, as) => CARD_IMAGE.replace('%A%', aliasExpr) + ' AS ' + as;

export async function handleRead({ path, url, all, reply, t }) {

  /* ⚠️ /health IS NOT A MIGRATION TEST. It touches only COUNT(*) over five tables and names no
   * column that any migration has ever altered, which is exactly why it kept answering `ok:true`
   * while three routes below were throwing. Useful for "is the worker deployed and bound to the
   * database"; useless for "did the schema change break anything." */
  if (path === '/health') {
    const counts = await all(
      `SELECT (SELECT COUNT(*) FROM artwork)  AS artworks,
              (SELECT COUNT(*) FROM edition)  AS editions,
              (SELECT COALESCE(SUM(qty),0) FROM copy WHERE disposition='own') AS owned,
              (SELECT COUNT(*) FROM sheet)    AS sheets,
              (SELECT COUNT(*) FROM slot)     AS slots,
              (SELECT COUNT(*) FROM image WHERE status='active') AS images`);
    // NOTE: owned is SUM(qty), never COUNT(*). See the comment block on `copy`.
    return reply({ ok: true, at: t, counts: counts[0] });
  }

  /* `a.collection_id` REMOVED 2026-08-01 (migration 001). Nothing replaces it here on purpose:
   * membership is many-to-many now, so the honest shape is an ARRAY per print, and that is the
   * grouping routes' job (spec §5 step 4) rather than a column swap smuggled into a hotfix.
   * `artwork.js` renders its collection chip conditionally, so it simply stops rendering — which
   * is the correct output regardless: `collection` has zero rows and always has. */
  if (path === '/artworks') {
    return reply({ artworks: await all(
      `SELECT a.artwork_id, a.name, a.category, a.medium, a.authorship, a.edition_type,
              a.retail, a.confidence, a.provenance, a.notes,
              COALESCE(o.qty_owned,0)      AS qty_owned,
              COALESCE(o.editions_owned,0) AS editions_owned,
              (SELECT COUNT(*) FROM edition e WHERE e.artwork_id = a.artwork_id) AS editions,
              (SELECT COUNT(*) FROM slot s WHERE s.artwork_id = a.artwork_id)    AS placed_count,
              ${cardImage('a.artwork_id', 'image_id')}
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
   * that can disagree with the Collection matrix. Consequence worth knowing: when this route
   * broke on 08-01, the detail page broke with it, silently and for the same one reason.
   *
   * `a.collection_id` removed 2026-08-01 — see the note on /artworks.
   */
  if (path === '/summary') {
    const prints = await all(
      `SELECT a.artwork_id, a.name, a.category, a.medium, a.authorship, a.retail, a.confidence,
              COALESCE(o.qty_owned, 0)                       AS qty_owned,
              COALESCE(o.editions_owned, 0)                  AS editions_owned,
              COALESCE(o.qty_sold, 0)                        AS qty_sold,
              COALESCE(p.n, 0)                               AS placed,
              MIN(COALESCE(o.qty_owned,0), COALESCE(p.n,0))  AS in_binder,
              MAX(0, COALESCE(o.qty_owned,0) - COALESCE(p.n,0)) AS spare,
              ${cardImage('a.artwork_id', 'image_id')},
              (SELECT COUNT(*) FROM edition_image ei2
                 JOIN edition e3 ON e3.edition_id = ei2.edition_id
                WHERE e3.artwork_id = a.artwork_id AND ei2.status = 'active') AS photos
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
    // How much of the collection has a picture at all. The one number that says whether the
    // photo backlog is shrinking, and it is free here.
    totals.with_photo = prints.filter(r => r.image_id).length;

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
   * 🟡 2026-08-01: that argument is WEAKER than when it was written — PR #641 shipped a
   * one-press DDL path (Actions → Migrate inciardi-collection D1). Not revisited in a hotfix,
   * but the premise it rests on has moved and should not be inherited unexamined.
   *
   * `a.collection_id` removed 2026-08-01 — see the note on /artworks.
   */
  if (path === '/shoebox') {
    return reply({ shoebox: await all(
      `SELECT a.artwork_id, a.name, a.category, a.medium, a.confidence,
              o.qty_owned,
              o.editions_owned,
              COALESCE(p.n, 0)                AS placed_count,
              o.qty_owned - COALESCE(p.n, 0)  AS spare,
              CASE WHEN COALESCE(p.n, 0) = 0 THEN 'unhoused' ELSE 'spare' END AS box_state,
              ${cardImage('a.artwork_id', 'image_id')}
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

  /* Slots for one sheet. state (owned/wanted/note) is DERIVED in v_slot — there is no
   * state column and there must never be one (J3).
   *
   * ⚠️ NO LONGER `SELECT * FROM v_slot`. The view cannot carry the card image (that would be
   * migration 002 — see CARD_IMAGE), so this selects the view's columns and appends the derived
   * image beside them. `v.*` keeps the view as the single owner of every column it does define,
   * so nothing here re-implements `state`, `qty_owned` or `placed_count`. */
  if (path === '/slots') {
    const sheet = url.searchParams.get('sheet');
    const sql = `SELECT v.*, ${cardImage('v.artwork_id', 'image_id')} FROM v_slot v`;
    return reply({ slots: sheet
      ? await all(sql + ' WHERE v.sheet_id = ? ORDER BY v.side, v.position', [sheet])
      : await all(sql + ' ORDER BY v.sheet_id, v.side, v.position') });
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
