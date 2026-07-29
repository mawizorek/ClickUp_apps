/* Inciardi Collection — API worker
 *
 * The only write path into D1. Nine routes, one file.
 *
 * DESIGN NOTES THAT MATTER (decision log J6, ladder rung 4 — "one write path"):
 *   - Every mutation goes through `write()`, so auth, timestamps and error shape are
 *     decided once. A second door is how the two surfaces in the predecessor drifted.
 *   - The database does the arguing, not this file. Constraint violations are returned
 *     verbatim rather than pre-validated here, because a JS validator that disagrees with
 *     the schema is a THIRD source of truth. If D1 says no, the answer is no.
 *   - Reads never require a key. The repo is public and the data is which prints Michael
 *     owns. Writes always require one.
 *
 * SECURITY, stated because the predecessor got this wrong and is still wrong:
 *   - WRITE_KEY is a wrangler secret. It is NOT in the shipped bundle. The browser holds it
 *     in localStorage and sends X-Write-Key. `inciardi-market` shipped "mikey"/"nickey"
 *     inside public JS; they remain unrotated.
 *   - An UNSET WRITE_KEY refuses all writes. "No secret configured" must never mean "open."
 *   - CORS is an allowlist, not `*`. A wildcard on a key-authenticated API lets any page
 *     anywhere spend the key it just watched you type.
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
        return reply({ error: 'server has no WRITE_KEY configured', fix: 'npx wrangler secret put WRITE_KEY' }, 503);
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

      // Derived (J4). Owned, and in no slot yet. No location column anywhere.
      if (path === '/shoebox' && method === 'GET') {
        return reply({ shoebox: await all('SELECT * FROM v_shoebox ORDER BY name COLLATE NOCASE') });
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
        'POST /artwork', 'POST /copy', 'POST /sheet', 'POST /slot', 'DELETE /slot?id='
      ] }, 404);

    } catch (e) {
      // Loud, not silent. A 500 that pretends to be an empty result is the failure mode
      // this whole app was rebuilt to eliminate.
      return reply({ error: 'worker: ' + String(e.message || e) }, 500);
    }
  }
};
