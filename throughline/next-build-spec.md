# Throughline — Next Build Spec

One spec at a time. Current: MCP integration.

---

## MCP Integration

**Goal:** let Brain and Super Agents read, write, trace, and search Throughline data conversationally through ClickUp's custom MCP server support.

**Why now:** Michael wants to say "add a Source Four to 1E, channel 42" or "show me every unpatched connection for Big Love" and have an agent do it. Today no agent can reach D1.

### Architecture

The Throughline Worker already has a public URL, auth, CRUD, and traces. The MCP layer wraps those existing endpoints in JSON-RPC 2.0 so ClickUp can discover and call them as tools.

- New route: `POST /mcp` on the existing Worker
- New file: `worker/mcp.js` (~4 KB), imported by `worker.js`
- Protocol: JSON-RPC 2.0 over HTTP (MCP spec requirement)
- No new Cloudflare bindings or config. The existing `fetch` handler router picks up `/mcp` automatically.

### Tools

Five tools. Each wraps an existing handler.

**throughline_read**
Query any domain table with optional filters.
Parameters: `table` (required), `show_id` (optional), `filters` (optional key-value), `limit`
Wraps: `/sync` logic (filtered single-table read)
Returns: rows as JSON, columns per `TABLES` registry

**throughline_write**
Create, update, or soft-delete rows.
Parameters: `ops` (array of `{op, table, row}`)
Wraps: `/batch`
All existing guardrails fire: rev-based optimistic concurrency, dept-scoped permissions, locked-show enforcement, `logChange()` audit. An agent gets the same rules as a human.
Returns: per-op result (ok, conflict, denied)

**throughline_trace**
Run a signal trace for a unit.
Parameters: `unit_id`, `show_id`
Wraps: `/trace` CTE
Returns: trace path (endpoints, hops, depth, cycle detection)

**throughline_shows**
List shows or get one show's metadata.
Parameters: `show_id` (optional; omit to list all)
Returns: title, season, venue, locked status, designer fields
Needed because most queries are show-scoped.

**throughline_search** *(new server code)*
Find rows by label or name across tables.
Parameters: `query` (text), `tables` (optional array to scope), `show_id` (optional)
Returns: matching rows with table name and id
Implementation: `LIKE '%query%'` across `name`, `label`, `purpose`, `notes` columns for each scoped table. ~20 lines. Only new business logic in the whole spec.

### Tool Discovery

MCP requires a `tools/list` method returning tool schemas. Static JSON response (~1 KB) describing the five tools above with parameter types and descriptions. Boilerplate.

### Auth

API key, sent as a header. ClickUp passes it on every call. The Worker's existing `authenticate()` validates it.

Create a dedicated agent user in `_users` with a real `_grants` row. Not the admin key.
Recommended scope: `dept_head` for all departments, all shows. Can read everything, write domain rows, cannot manage users or roles.
Michael creates the user via the Access screen, copies the invite key into ClickUp's MCP config.

### ClickUp Setup (Michael, one time)

1. App Center > Custom MCP > Add New
2. Name: "Throughline"
3. URL: `https://throughline.mawizorek-online.workers.dev/mcp`
4. Auth: API key
5. Enter the agent user's key
6. ClickUp discovers the five tools
7. Optionally add tools to specific Super Agents

### Build Plan

1. Add `POST /mcp` route to `worker.js` (or `worker/mcp.js` after the module split)
2. Implement JSON-RPC envelope: parse `method`, `params`, `id`; route to handler; return JSON-RPC response
3. Implement `tools/list` (static schema)
4. Map each tool method to existing handler calls
5. Add search endpoint (~20 lines)
6. Create agent user via Access screen
7. Deploy Worker
8. Connect in ClickUp App Center
9. Test: read, write, trace, search from Brain

### Build Estimate

`mcp.js`: ~4 KB. Search endpoint: ~20 lines in the worker. Total new code: under 5 KB. Every tool maps 1:1 to an existing endpoint except search.

### What This Does NOT Include

- Schema migrations (endpoint FKs, pairing_states, infra rename): on the board, separate work
- Module split: proposed, can happen before or after this
- Print spec: sequenced after endpoint rework
- `VERSIONS.md` row: owed, separate commit

---

## Future (parked)

Items discussed in the collaboration thread but not yet specced:

- Print menu (PDF export of Input Patch, Output Patch, Equipment Pull, Channel Hookup, Signal Trace)
- Plot view (`#plot`, positions on a plan)
- Label printing (`#labels`, cable + fixture labels)
