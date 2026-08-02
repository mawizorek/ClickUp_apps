# Cast Grid — Build Spec & Contingency Plan

**App:** `cast-grid` · **Version:** v0.1-poc · **Status:** Prototype  
**Live:** `https://mawizorek.github.io/ClickUp_apps/cast-grid/`  
**Purpose:** Roles × Productions → People matrix, live from ClickUp data.

---

## What it does (v0.1)

- Prompts for a ClickUp API token (stored in `localStorage`, never transmitted)
- Accepts any list ID (designed for Show Roles / assignments list)
- Fetches all tasks + custom fields from that list
- Auto-detects Relationship fields and other field types
- User maps fields to: Row (Role), Column (Production), Cell (Person)
- Renders a pivot grid: roles as rows, productions as columns, people as cell cards
- Status coloring on cards (task native status)

## Architecture

- Single self-contained HTML file (no deps, no build step)
- Client-side only, GitHub Pages hosted
- ClickUp API called directly from browser (CORS supported)
- All config in `localStorage` (token + list ID + field mappings)

## Dex Approval Checklist

- [x] Under 30KB (13.6KB)
- [x] No secrets in source (token prompted at runtime)
- [x] No external dependencies
- [x] Proper repo structure (`cast-grid/index.html`)
- [x] Dark theme default
- [x] Prototype banner visible
- [x] Graceful error handling
- [x] Field mapping is manual (discovery, not assumption)

## Known Failure Points (what the POC proves/disproves)

| # | Failure mode | What happens | Status |
|---|---|---|---|
| 1 | **Auth** | Token prompt on load, stored locally. Ugly but works. | Shipping |
| 2 | **N+1 API calls** | Relationship fields may return task IDs needing resolution. At scale (50+ assignments), rate limits hit. | DISCOVER |
| 3 | **Relationship field shape** | Unknown whether API returns inline names or bare IDs. POC reads whatever comes back. | DISCOVER |
| 4 | **CORS** | ClickUp API should support browser CORS with token auth. | VERIFY |
| 5 | **List structure** | Show Roles list may not exist yet in its final form. App accepts any list. | Flexible |

## Contingency Plan

### If CORS fails
Fallback: deploy a Cloudflare Worker proxy (same pattern as `inciardi-collection`). Adds one afternoon of work but is proven architecture.

### If Relationship fields return bare IDs
Batch-resolve linked tasks in a second pass. Cache results in `sessionStorage`. Show a progress bar during resolution. Rate limit: queue requests at 90/min with backoff.

### If rate limits bite at scale
- sessionStorage cache (per-session, auto-expires)
- Batch fetch with exponential backoff
- Manual refresh button instead of auto-polling
- Future: Cloudflare Worker with KV cache (v1.0 territory)

### If the list doesn't have the right structure yet
App is field-agnostic. Works with any list that has custom fields. User picks which field maps where. The "correct" list structure (Role Definitions + Show Roles) can be built later; the grid adapts.

## Real-time Strategy (future)

| Method | Effort | Latency |
|---|---|---|
| Manual refresh (F5 or button) | Zero | User-triggered |
| Polling (auto-refresh 30-60s) | One `setInterval` | 30-60s |
| Webhooks → Worker → push | Cloudflare Worker + WebSocket | Near-instant |

POC ships with manual refresh button. Polling is v1.0.

## Next version (v1.0) requirements

- [ ] Confirm Relationship field data shape from real data
- [ ] Add auto-polling toggle
- [ ] Season/semester filter dropdown
- [ ] Export to PDF/print stylesheet
- [ ] Embed-friendly mode (for ClickUp Dashboard widget)
- [ ] Pre-filled config for known URITP lists
- [ ] Resolve relationship IDs → names (batch, cached)

---

_Spec authored 2026-08-02. Dex-approved architecture._
