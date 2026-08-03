# Cast Grid Proxy Worker

Cloudflare Worker that securely proxies ClickUp API calls for the Cast Grid dashboard.
Your API token lives encrypted on Cloudflare's edge, never in the browser or git.

## Deploy (one-time, ~5 minutes)

### Prerequisites
- A free Cloudflare account (https://dash.cloudflare.com/sign-up)
- Node.js installed (for wrangler CLI)

### Steps

```bash
# 1. Clone the repo (or cd into it if you already have it)
git clone https://github.com/mawizorek/ClickUp_apps.git
cd ClickUp_apps/cast-grid/worker

# 2. Install wrangler
npm install

# 3. Login to Cloudflare (opens browser)
npx wrangler login

# 4. Deploy the worker
npx wrangler deploy
# This creates: https://cast-grid-proxy.mawizorek.workers.dev

# 5. Store your ClickUp API token as an encrypted secret
npx wrangler secret put CLICKUP_TOKEN
# Paste your pk_... token when prompted. It's encrypted at rest.
```

### Done!

The Cast Grid page at https://mawizorek.github.io/ClickUp_apps/cast-grid/ will now
fetch data through the worker. No token in the browser, ever.

## Updating the token

If you regenerate your ClickUp API token:

```bash
cd ClickUp_apps/cast-grid/worker
npx wrangler secret put CLICKUP_TOKEN
# Paste new token
```

## Checking if it's alive

Hit the health endpoint:
```
curl https://cast-grid-proxy.mawizorek.workers.dev/health
```

Should return: `{"status":"ok","version":"0.1"}`

## Routes

| Endpoint | What it does |
|----------|-------------|
| `GET /health` | Heartbeat |
| `GET /tasks?list_id=X` | All tasks from list X (paginated) |
| `GET /task/:id` | Single task details |
| `GET /list/:id/field` | Custom fields for a list |

## Security

- Token stored as encrypted Cloudflare secret (not in code, not in git)
- CORS locked to `mawizorek.github.io` and `localhost` only
- Read-only (GET only, no writes)
- Free tier: 100,000 requests/day
