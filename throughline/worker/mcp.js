/**
 * mcp.js — MCP (Model Context Protocol) handler for Throughline
 *
 * Wraps existing Worker endpoints as JSON-RPC 2.0 tools for ClickUp Brain.
 * Five tools: read, write, trace, shows, search.
 * All existing guardrails (auth, permissions, rev checks, audit) fire unchanged.
 *
 * Discovery methods (initialize, tools/list) are unauthenticated so ClickUp
 * can validate the connection during setup. Tool execution authenticates
 * via the passed authenticate function.
 */

const TOOLS = [
  {
    name: "throughline_read",
    description: "Query rows from any Throughline domain table. Returns rows as JSON with all columns. Tables: signal_types, fixture_types, type_interfaces, venues, shows, positions, endpoints, infrastructure, networks, units, control_points, network_interfaces, connections, assignments.",
    inputSchema: {
      type: "object",
      properties: {
        table: { type: "string", description: "Table name (e.g. units, connections, signal_types)" },
        show_id: { type: "string", description: "Filter by show ID (optional)" },
        filters: { type: "object", description: "Key-value column filters, e.g. {direction: 'IN'} (optional)" },
        limit: { type: "number", description: "Max rows to return (default 100, max 500)" }
      },
      required: ["table"]
    }
  },
  {
    name: "throughline_write",
    description: "Create, update, or soft-delete rows in Throughline. Permission checks, rev-based optimistic concurrency, and audit logging fire automatically. For updates, include the row's current rev as base_rev or the op returns 'conflict' with the server's row.",
    inputSchema: {
      type: "object",
      properties: {
        ops: {
          type: "array",
          description: "Array of {op: 'upsert'|'delete', table: string, row: {id, ...fields}, base_rev?: number}",
          items: { type: "object" }
        }
      },
      required: ["ops"]
    }
  },
  {
    name: "throughline_trace",
    description: "Run a live signal trace from a unit through all its connections and assignments. Returns the full path: endpoints, connection/assignment hops, depth, and human-readable labels. Traces are computed, never stored.",
    inputSchema: {
      type: "object",
      properties: {
        unit_id: { type: "string", description: "The unit ID to trace from" }
      },
      required: ["unit_id"]
    }
  },
  {
    name: "throughline_shows",
    description: "List all shows or get one show's metadata (title, season, venue, locked status, designer fields).",
    inputSchema: {
      type: "object",
      properties: {
        show_id: { type: "string", description: "Show ID (optional; omit to list all shows)" }
      }
    }
  },
  {
    name: "throughline_search",
    description: "Search for rows by text across name, label, purpose, and notes columns in any table. Returns matching rows with table name and ID. Use this to find units, connections, positions, etc. by keyword.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Text to search for (case-insensitive substring match)" },
        tables: { type: "array", items: { type: "string" }, description: "Tables to search (optional; omit for all domain tables)" },
        show_id: { type: "string", description: "Filter by show ID (optional)" }
      },
      required: ["query"]
    }
  }
];

const SERVER_INFO = {
  name: "throughline",
  version: "1.0"
};

const PROTOCOL_VERSION = "2024-11-05";

function rpcOk(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

/* ================= tool handlers ================= */

async function toolRead(env, actor, params, deps) {
  const { TABLES, ORDER, readable } = deps;
  const t = params && params.table;
  if (!t || !TABLES[t]) return { error: "Unknown table. Valid: " + ORDER.join(", ") };
  const limit = Math.min(params.limit || 100, 500);
  let sql = `SELECT * FROM ${t} WHERE deleted_at IS NULL`;
  const binds = [];
  if (params.show_id && TABLES[t].cols.includes("show_id")) {
    binds.push(params.show_id);
    sql += ` AND show_id=?${binds.length}`;
  }
  const filters = params.filters || {};
  for (const [k, v] of Object.entries(filters)) {
    if (TABLES[t].cols.includes(k)) {
      binds.push(v);
      sql += ` AND ${k}=?${binds.length}`;
    }
  }
  sql += ` ORDER BY updated_at DESC LIMIT ${limit}`;
  const res = await env.DB.prepare(sql).bind(...binds).all();
  const rows = (res.results || []).filter((r) => readable(actor, t, r));
  return { table: t, count: rows.length, rows };
}

async function toolWrite(env, actor, params, deps) {
  if (!params || !params.ops) return { error: "ops[] required" };
  return await deps.batch(env, actor, { ops: params.ops });
}

async function toolTrace(env, actor, params, deps) {
  if (!params || !params.unit_id) return { error: "unit_id required" };
  return await deps.trace(env, actor, params.unit_id);
}

async function toolShows(env, actor, params) {
  if (params && params.show_id) {
    const s = await env.DB.prepare("SELECT * FROM shows WHERE id=?1 AND deleted_at IS NULL").bind(params.show_id).first();
    if (!s) return { error: "Show not found" };
    return { show: s };
  }
  const res = await env.DB.prepare("SELECT * FROM shows WHERE deleted_at IS NULL ORDER BY title").all();
  return { shows: res.results || [] };
}

async function toolSearch(env, actor, params, deps) {
  const { TABLES, ORDER, readable } = deps;
  if (!params || !params.query) return { error: "query required" };
  const q = `%${params.query}%`;
  const searchCols = ["name", "label", "purpose", "notes"];
  const scope = (params.tables && params.tables.length)
    ? params.tables.filter((t) => TABLES[t])
    : ORDER;
  const results = [];
  for (const t of scope) {
    const cols = TABLES[t].cols.filter((c) => searchCols.includes(c));
    if (!cols.length) continue;
    const where = cols.map((c) => `${c} LIKE ?1`).join(" OR ");
    let sql = `SELECT * FROM ${t} WHERE deleted_at IS NULL AND (${where})`;
    const binds = [q];
    if (params.show_id && TABLES[t].cols.includes("show_id")) {
      binds.push(params.show_id);
      sql += ` AND show_id=?${binds.length}`;
    }
    sql += " LIMIT 20";
    const res = await env.DB.prepare(sql).bind(...binds).all();
    for (const r of res.results || []) {
      if (readable(actor, t, r)) {
        results.push({ table: t, id: r.id, row: r });
      }
    }
  }
  return { query: params.query, count: results.length, results };
}

/* ================= GET handler (validation + SSE endpoint) ================= */

export function handleMcpGet() {
  return {
    protocolVersion: PROTOCOL_VERSION,
    serverInfo: SERVER_INFO,
    capabilities: { tools: {} }
  };
}

/* ================= POST handler (JSON-RPC) ================= */

export async function handleMcp(request, env, deps) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return rpcError(null, -32700, "Parse error");
  }
  if (!body || typeof body !== "object") return rpcError(null, -32600, "Invalid Request");
  const { method, params, id } = body;
  if (!method) return rpcError(id, -32600, "method required");

  // MCP lifecycle — unauthenticated (allows ClickUp to validate the connection)
  if (method === "initialize") {
    return rpcOk(id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: SERVER_INFO
    });
  }
  if (method === "notifications/initialized") {
    return rpcOk(id, {});
  }
  if (method === "tools/list") {
    return rpcOk(id, { tools: TOOLS });
  }

  // Tool invocation — authenticated
  let actor;
  try {
    actor = await deps.authenticate(request, env);
  } catch (e) {
    return rpcError(id, -32603, "Authentication failed: " + (e.message || String(e)));
  }

  if (method === "tools/call") {
    const toolName = params && params.name;
    const toolArgs = (params && params.arguments) || {};
    try {
      let result;
      switch (toolName) {
        case "throughline_read":   result = await toolRead(env, actor, toolArgs, deps); break;
        case "throughline_write":  result = await toolWrite(env, actor, toolArgs, deps); break;
        case "throughline_trace":  result = await toolTrace(env, actor, toolArgs, deps); break;
        case "throughline_shows":  result = await toolShows(env, actor, toolArgs); break;
        case "throughline_search": result = await toolSearch(env, actor, toolArgs, deps); break;
        default: return rpcError(id, -32601, "Unknown tool: " + toolName);
      }
      return rpcOk(id, { content: [{ type: "text", text: JSON.stringify(result) }] });
    } catch (e) {
      const msg = (e && e.message) || String(e);
      return rpcOk(id, { content: [{ type: "text", text: JSON.stringify({ error: msg }) }], isError: true });
    }
  }

  return rpcError(id, -32601, "Method not found: " + method);
}
