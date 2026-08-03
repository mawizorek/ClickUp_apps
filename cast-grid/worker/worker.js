/**
 * Cast Grid Proxy Worker v0.1
 * Cloudflare Worker that proxies ClickUp API calls with a stored token.
 * The ClickUp API token lives in an encrypted environment secret (CLICKUP_TOKEN).
 *
 * Routes:
 *   GET /tasks?list_id=<ID>        → fetches all tasks from a list (paginated)
 *   GET /task/<ID>                  → fetches a single task
 *   GET /list/<ID>/field            → fetches custom fields for a list
 *   GET /health                     → heartbeat
 *   OPTIONS *                       → CORS preflight
 */

const ALLOWED_ORIGINS = [
  'https://mawizorek.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const CLICKUP_API = 'https://api.clickup.com/api/v2';

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function fetchClickUp(endpoint, token) {
  const resp = await fetch(`${CLICKUP_API}${endpoint}`, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`ClickUp API ${resp.status}: ${text}`);
  }
  return resp.json();
}

async function fetchAllTasks(listId, token) {
  let all = [];
  let page = 0;
  let more = true;
  while (more) {
    const data = await fetchClickUp(
      `/list/${listId}/task?page=${page}&include_closed=true&subtasks=true`,
      token
    );
    const tasks = data.tasks || [];
    all = all.concat(tasks);
    more = tasks.length >= 100;
    page++;
  }
  return all;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

    const path = url.pathname;
    const token = env.CLICKUP_TOKEN;

    if (!token) {
      return jsonResponse({ error: 'CLICKUP_TOKEN not configured' }, 500, origin);
    }

    try {
      // Health check
      if (path === '/health') {
        return jsonResponse({ status: 'ok', version: '0.1' }, 200, origin);
      }

      // Fetch all tasks for a list
      if (path === '/tasks') {
        const listId = url.searchParams.get('list_id');
        if (!listId) {
          return jsonResponse({ error: 'list_id parameter required' }, 400, origin);
        }
        const tasks = await fetchAllTasks(listId, token);
        return jsonResponse({ tasks, count: tasks.length }, 200, origin);
      }

      // Fetch single task
      const taskMatch = path.match(/^\/task\/(.+)$/);
      if (taskMatch) {
        const data = await fetchClickUp(`/task/${taskMatch[1]}`, token);
        return jsonResponse(data, 200, origin);
      }

      // Fetch list fields
      const fieldMatch = path.match(/^\/list\/(.+)\/field$/);
      if (fieldMatch) {
        const data = await fetchClickUp(`/list/${fieldMatch[1]}/field`, token);
        return jsonResponse(data, 200, origin);
      }

      return jsonResponse({ error: 'Not found', routes: ['/health', '/tasks?list_id=X', '/task/:id', '/list/:id/field'] }, 404, origin);

    } catch (e) {
      return jsonResponse({ error: e.message }, 502, origin);
    }
  },
};
