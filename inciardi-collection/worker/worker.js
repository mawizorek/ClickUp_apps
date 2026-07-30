/* Inciardi Collection — API worker
 *
 * The only write path into D1. Eleven routes, one file.
 *
 * DESIGN NOTES THAT MATTER (decision log J6, ladder rung 4 — "one write path"):
 *   - Every mutation goes through `write()` or `batch()`, so auth, timestamps and error shape
 *     are decided once. A second door is how the two surfaces in the predecessor drifted.
 *   - The database does the arguing, not this file. Constraint violations are returned
 *     verbatim rather than pre-validated here, because a JS validator that disagrees with
 *     the schema is a THIRD source of truth. If D1 says no, the answer is no.
 *   - Reads never require a key. The repo is public and the data is which prints Michael
 *     owns. Writes always require one.
 *
 * SECURITY — CORRECTED 2026-07-30. This header used to say "WRITE_KEY is a wrangler secret,
 * it is NOT in the shipped bundle." That is now FALSE and was false for most of a day before
 * anyone fixed the comment:
 *   - The key ships in the public front-end (`core.js` → DEFAULT_KEY) so a freshly-cleared
 *     browser can write with nothing pasted. Michael's call, exposure stated and accepted.
 *   - It also ships in `wrangler.toml` under [vars], because a Cloudflare Secret cannot be
 *     read back and the dashboard did not even list this worker when he went looking.
 *   - So: ASSUME THE KEY IS PUBLIC. The gate below still matters — it stops accidents and
 *     crawlers, not a determined reader. The real safety net is D1 Time Travel (30 days).
 *   - Still true, and still the reason the gate exists at all: AN UNSET WRITE_KEY REFUSES
 *     ALL WRITES. "No secret configured" must never mean "open."
 *   - CORS is an allowlist, not `*`. Constrains browsers, not curl — but a wildcard on a
 *     key-authenticated API lets any page anywhere spend the key it just watched you type.
 */

const ALLOWED_ORIGINS = [
  'https://mawizorek.github.io',
  'http://localhost:8788',
  'http://127.0.0.1:8788'
];

const json = (data, status, origin) => new Response(JSON.stringify(data, null, 2), {
  status: status || 200,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',            // Fetch Honesty Law: never serve a stale write
    ...cors(origin)
  }
});

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin);
  return {
    'access-control-allow-origin': ok ? origin : ALLOWED_ORIGINS[0],
    'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,x-write-key',
    'access-control-max-age': '86400',
    'vary': 'origin'
  };
}

/* An id is IDENTITY and permanent, so a bad one is a permanent bad one.
 * `slug('#1')` collapses to '1' for every numbered variant — the exact collision that
 * started this rebuild. So: derive, then REFUSE anything that came out useless rather
 * than quietly storing a mangled key. */
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}
function badSlug(id) {
  if (!id || id.length < 2) return 'too short to be an identity';
  if (/^[0-9-]+$/.test(id)) return 'digits only — "#4" and "7/12" both collapse to numbers, which is the collision that broke the last app';
  return null;
}

const now = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || '';
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const reply = (d, s) => json(d, s, origin);

    /* ---- write gate ---------------------------------------------------- */
    const isWrite = method === 'POST' || method === 'DELETE';
    if (isWrite) {
      if (!env.WRITE_KEY) {
        return reply({ error: 'server has no WRITE_KEY configured', fix: 'set WRITE_KEY under [vars] in wrangler.toml and re-run the deploy workflow' }, 503);
      }
      const sent = request.headers.get('x-write-key') || '';
      // length check first so a wrong-length key cannot be distinguished by timing
      let same = sent.length === env.WRITE_KEY.length;
      for (let i = 0; i < sent.length; i++) {
        if (sent.charCodeAt(i) !== env.WRITE_KEY.charCodeAt(i)) same = false;
      }
      if (!same) return reply({ error: 'bad or missing write key' }, 401);
    }

    let body = {};
    if (isWrite) {
      try { body = await request.json(); } catch (e) { body = {}; }
    }

    const db = env.DB;
    const t = now();

    /* One door for every mutation: same auth, same timestamps, same error shape. */
    async function write(sql, params) {
      try {
        const r = await db.prepare(sql).bind(...params).run();
        return reply({ ok: true, changes: r.meta ? r.meta.changes : undefined });
      } catch (e) {
        // Return the constraint message verbatim. The schema is the authority; this file
        // does not re-litigate it, and a helpful lie is worse than a blunt truth.
        return reply({ ok: false, error: String(e.message || e) }, 400);
      }
    }
    const all = async (sql, params) => (await db.prepare(sql).bind(...(params || [])).all()).results || [];

    try {
      /* ================= READS ================= */

      if (path === '/health' && method === 'GET') {
        const counts = await all(
          `SELECT (SELECT COUNT(*) FROM artwork)  AS artworks,
                  (SELECT COUNT(*) FROM edition)  AS editions,
                  (SELECT COALESCE(SUM(qty),0) FROM copy WHERE disposition='own') AS owned,
                  (SELECT COUNT(*) FROM sheet)    AS sheets,
                  (SELECT COUNT(*) FROM slot)     AS slots`);
        // NOTE: owned is SUM(qty), never COUNT(*). See the comment block on `copy`.
        return reply({ ok: true, at: t, counts: counts[0] });
      }

      if (path === '/artworks' && method === 'GET') {
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
       * WHY THE SQL LIVES HERE AND NOT IN A VIEW, stated because it deviates from rung 1 (the
       * app's own rule is that derived facts belong in views): applying DDL to D1 needs a
       * terminal or the dashboard console, and Michael builds from a phone. A view change would
       * leave the app broken in the gap between deploying this code and him running a console
       * step by hand. Worker SQL ships atomically with the deploy, in one button press. It is
       * still the DATABASE computing it, not JavaScript. If a SECOND consumer ever needs these
       * numbers, promote this into `v_shoebox` then — one claimant on one truth, always.
       */
      if (path === '/shoebox' && method === 'GET') {
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

      if (path === '/sheets' && method === 'GET') {
        return reply({
          sheets: await all('SELECT * FROM v_sheet_fill ORDER BY sheet_order'),
          spread: await all('SELECT * FROM v_binder_spread ORDER BY side_index')
        });
      }

      // Slots for one sheet. state (owned/wanted/note) is DERIVED in v_slot — there is no
      // state column and there must never be one (J3).
      if (path === '/slots' && method === 'GET') {
        const sheet = url.searchParams.get('sheet');
        return reply({ slots: sheet
          ? await all('SELECT * FROM v_slot WHERE sheet_id = ? ORDER BY side, position', [sheet])
          : await all('SELECT * FROM v_slot ORDER BY sheet_id, side, position') });
      }

      if (path === '/editions' && method === 'GET') {
        const art = url.searchParams.get('artwork');
        return reply({ editions: await all(
          `SELECT edition_id, artwork_id, label, implicit, seq, edition_type
             FROM edition WHERE artwork_id = ? ORDER BY implicit DESC, seq, label`, [art]) });
      }

      /* ================= WRITES ================= */

      /* Enter a print. ONE call does the whole thing:
       *   artwork row -> trigger mints the implicit edition -> optional copy row.
       * That is J2 ruling 4 (a card is an input surface) and the acceptance test:
       * no worker logic is required for this to be true, only the schema. */
      if (path === '/artwork' && method === 'POST') {
        const name = String(body.name || '').trim();
        if (!name) return reply({ ok: false, error: 'name is required' }, 400);

        const id = String(body.artwork_id || '').trim() || slugify(name);
        const bad = badSlug(id);
        if (bad) return reply({ ok: false, error: 'artwork_id "' + id + '" rejected: ' + bad, hint: 'give an explicit id' }, 400);

        try {
          await db.prepare(
            `INSERT INTO artwork (artwork_id,name,collection_id,category,edition_type,retail,
                                  provenance,confidence,notes,created_at,updated_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`
          ).bind(
            id, name,
            body.collection_id || null,
            body.category || 'mini',              // v1 is mini prints; the column defaults too
            body.edition_type || 'open',
            body.retail === '' || body.retail == null ? null : Number(body.retail),
            body.provenance || 'owned',
            body.confidence || 'named',
            body.notes || null,
            t, t
          ).run();
        } catch (e) {
          const msg = String(e.message || e);
          if (/UNIQUE/i.test(msg)) return reply({ ok: false, error: 'artwork_id "' + id + '" already exists', existing: id }, 409);
          return reply({ ok: false, error: msg }, 400);
        }

        // The trigger created <id>:e1 inside the same transaction as the artwork.
        const eds = await all('SELECT edition_id, implicit FROM edition WHERE artwork_id = ?', [id]);
        let copy_id = null;
        if (body.own) {
          copy_id = id + '-c1';
          try {
            await db.prepare(
              `INSERT INTO copy (copy_id,edition_id,edition_type,qty,acquired_where,acquired_at,
                                 notes,created_at,updated_at)
               VALUES (?,?,?,?,?,?,?,?,?)`
            ).bind(copy_id, id + ':e1', body.edition_type || 'open',
                   Math.max(1, parseInt(body.qty, 10) || 1),
                   body.acquired_where || null, body.acquired_at || null,
                   null, t, t).run();
          } catch (e) {
            // The artwork landed and is canonical; only the ownership claim failed. Say exactly
            // that instead of implying the whole thing rolled back.
            return reply({ ok: true, artwork_id: id, editions: eds, copy_error: String(e.message || e) }, 207);
          }
        }
        return reply({ ok: true, artwork_id: id, editions: eds, copy_id: copy_id });
      }

      // "I have this" on an existing edition. Not a state change — a copy row (J3).
      if (path === '/copy' && method === 'POST') {
        const ed = String(body.edition_id || '').trim();
        if (!ed) return reply({ ok: false, error: 'edition_id is required' }, 400);
        const rows = await all('SELECT edition_type FROM edition WHERE edition_id = ?', [ed]);
        if (!rows.length) return reply({ ok: false, error: 'no edition "' + ed + '"' }, 404);
        return write(
          `INSERT INTO copy (copy_id,edition_id,edition_type,qty,acquired_price,acquired_where,
                             acquired_at,notes,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [body.copy_id || (ed.replace(/:/g, '-') + '-' + Date.now().toString(36)),
           ed, rows[0].edition_type,
           Math.max(1, parseInt(body.qty, 10) || 1),
           body.acquired_price === '' || body.acquired_price == null ? null : Number(body.acquired_price),
           body.acquired_where || null, body.acquired_at || null, body.notes || null, t, t]);
      }

      if (path === '/sheet' && method === 'POST') {
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

      /* ============================================================ /sheet/rename
       * Title only. `title` is free text and deliberately nullable — a sheet with no title
       * falls back to its id in the UI, so clearing the box is a real choice rather than an
       * error. Nothing else about the sheet is touched, and NOTHING inside it moves.
       */
      if (path === '/sheet/rename' && method === 'POST') {
        const id = String(body.sheet_id || '').trim();
        if (!id) return reply({ ok: false, error: 'sheet_id is required' }, 400);
        const rows = await all('SELECT sheet_id FROM sheet WHERE sheet_id = ?', [id]);
        if (!rows.length) return reply({ ok: false, error: 'no sheet "' + id + '"' }, 404);
        const title = body.title == null ? null : String(body.title).trim();
        return write('UPDATE sheet SET title = ?, updated_at = ? WHERE sheet_id = ?',
                     [title || null, t, id]);
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
       * `sheet` carries UNIQUE (binder_id, sheet_order), so a naive one-by-one renumber
       * collides mid-flight. `schema.binder.sql` says to fix that with "a temporary
       * NEGATIVE-offset pass" — and the very same table has CHECK (sheet_order >= 0), which
       * makes every negative value UNWRITEABLE. Following the documented remedy would fail
       * 100% of the time. Corrected there too, 2026-07-30.
       * So the park pass goes HIGH, not negative: MAX(sheet_order) + 1 and up, which cannot
       * collide with any live value.
       *
       * Both passes go through db.batch(), which D1 runs as ONE transaction. A half-applied
       * reorder — some sheets parked at 900-something, others renumbered — is not a state this
       * app is willing to leave behind.
       *
       * FREE SIDE EFFECT worth knowing: pass two writes 0..n-1, so any gap in sheet_order
       * (from a deleted sheet, say) is compacted. And because slots reference sheet_id and
       * never sheet_order, NOT ONE SLOT ROW IS TOUCHED — a whole sheet travels with both its
       * sides, which is exactly the physical gesture of lifting it out of the rings.
       * Downstream, `v_binder_spread` derives side_index/spread_index from sheet_order, so
       * page numbering renumbers itself. Nothing to keep in sync.
       */
      if (path === '/sheet/reorder' && method === 'POST') {
        const bid = String(body.binder_id || 'mini-binder');
        const want = Array.isArray(body.order) ? body.order.map(v => String(v)) : null;
        if (!want || !want.length) {
          return reply({ ok: false, error: 'order must be a non-empty array of sheet_id, in the desired binder order' }, 400);
        }

        const have = (await all('SELECT sheet_id FROM sheet WHERE binder_id = ? ORDER BY sheet_order', [bid]))
                       .map(r => r.sheet_id);
        if (!have.length) return reply({ ok: false, error: 'binder "' + bid + '" has no sheets' }, 404);

        /* A PERMUTATION CHECK, and it is not pedantry. A SHORT array would renumber the sheets
         * it names and leave the rest parked wherever they were — a scrambled binder that
         * still looks entirely plausible on screen. Refuse the write instead, and say which
         * ids were wrong, because "invalid order" sends you nowhere. */
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

      /* Place something in a slot. artwork_id + OPTIONAL edition_id (Q12 = B).
       * The composite FK makes a mismatched pair unwriteable, so this does not check it —
       * the database refuses and the message comes straight back. */
      if (path === '/slot' && method === 'POST') {
        const sheet = String(body.sheet_id || '').trim();
        const side = String(body.side || 'A').toUpperCase();
        const pos = parseInt(body.position, 10);
        if (!sheet) return reply({ ok: false, error: 'sheet_id is required' }, 400);
        if (!(pos >= 0 && pos <= 8)) return reply({ ok: false, error: 'position must be 0-8 (nine slots a side)' }, 400);
        return write(
          `INSERT INTO slot (slot_id,sheet_id,side,position,artwork_id,edition_id,note,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?,?,?)
           ON CONFLICT(sheet_id,side,position) DO UPDATE SET
             artwork_id=excluded.artwork_id, edition_id=excluded.edition_id,
             note=excluded.note, updated_at=excluded.updated_at`,
          [body.slot_id || (sheet + '-' + side.toLowerCase() + pos), sheet, side, pos,
           body.artwork_id || null, body.edition_id || null, body.note || null, t, t]);
      }

      // Clearing a slot DELETES the row. Sparse rows are the design: absence IS empty (J3).
      if (path === '/slot' && method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return reply({ ok: false, error: 'id is required' }, 400);
        return write('DELETE FROM slot WHERE slot_id = ?', [id]);
      }

      return reply({ error: 'no route for ' + method + ' ' + path, routes: [
        'GET /health', 'GET /artworks', 'GET /shoebox', 'GET /sheets',
        'GET /slots?sheet=', 'GET /editions?artwork=',
        'POST /artwork', 'POST /copy', 'POST /sheet', 'POST /sheet/rename',
        'POST /sheet/reorder', 'POST /slot', 'DELETE /slot?id='
      ] }, 404);

    } catch (e) {
      // Loud, not silent. A 500 that pretends to be an empty result is the failure mode
      // this whole app was rebuilt to eliminate.
      return reply({ error: 'worker: ' + String(e.message || e) }, 500);
    }
  }
};
