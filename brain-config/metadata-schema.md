# Tool Metadata Schema

Every brain tool gets a `metadata.json` sidecar next to its profile (or, for triggers, standing alone). This is the machine-writable control surface the viewer reads and the config UI edits. The `.md` profile stays the human narrative (prose, checklist, personality, changelog); the `.json` holds structured, editable fields.

**Canonical rule (RECONCILED 2026-07-17 — see the Agent & Tool Surface Map in `README.md`, which is authoritative):** ownership splits by FIELD, not by record. The profile **front-matter owns identity** (`slug`, `display_name`, `nicknames`, `role`, `type`, `status`, `seat`, `accent`) — that's the immutable-slug lock and it wins for those fields. The **sidecar owns the operational wiring the front-matter doesn't carry** (`colloquialName`, `teams`, `badge`, `created`, `shortcut`, `launchPrompt`, `toggles`); on the identity fields it mirrors the front-matter and does not re-author them. `registry.json` is a GENERATED artifact (from front-matter + sidecars) — do not hand-edit it. *(Supersedes the earlier "the sidecar is the source of truth for structured metadata / no overlap" line: there IS overlap on identity, and front-matter wins it.)*

---

## Shared envelope (all three types)

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | kebab-case, matches the filename. Identity — authored in front-matter. |
| `type` | string | `agent` \| `hook` \| `trigger` |
| `name` | string | display name (mirrors front-matter `display_name`) |
| `status` | string | `active` \| `building` \| `dormant` \| `retired` (mirrors front-matter) |

---

## Agent (super-record)

The rich record. Carries the launcher, team wiring, and the open-ended toggle bag. Identity fields mirror the front-matter (front-matter is canonical for them); the fields below marked *operational* are the sidecar's own.

| Field | Type | Notes |
|-------|------|-------|
| `colloquialName` | string | *operational.* the everyday name you call it ("Renata") |
| `nicknames` | string[] | alternate names for invocation/search (mirrors front-matter) |
| `seat` | string | council \| workshop \| close \| audit \| research \| etc. (mirrors front-matter) |
| `teams` | string[] | *operational.* team slugs this agent sits on |
| `role` | string | one-line role summary (mirrors front-matter) |
| `accent` | string | oklch color token for the card (mirrors front-matter) |
| `badge` | string\|null | *operational.* `halt` \| `warn` \| `silent` \| null |
| `created` | string | *operational.* YYYY-MM-DD |
| `shortcut` | boolean | *operational.* renders the Run-me launcher |
| `launchPrompt` | string | *operational.* the default prompt copied on launch |
| `toggles` | object | *operational.* open-ended booleans, e.g. `{ "hasWriteAccess": false, "firesAtSessionClose": true }`. Add switches here with NO schema change. |

## Hook (thin record)

Hooks are mostly a badge. No launcher, no teams.

| Field | Type | Notes |
|-------|------|-------|
| `badge` | string\|null | `halt` \| `warn` \| `silent` \| null |
| `created` | string | YYYY-MM-DD |
| `shortcut` | boolean | almost always false |

## Trigger (config entry)

Triggers have no profile prose today; the sidecar IS their record.

| Field | Type | Notes |
|-------|------|-------|
| `purpose` | string | the one-line description shown in the viewer |
| `shortcut` | boolean | almost always false |

---

## Why not one normalized schema?

These are not one record type. Agents are a rich super-record; hooks are basically a labeled badge; triggers are a config array entry with no profile. Forcing a single shape would over-normalize and bloat the thin records. The shared envelope gives the viewer a predictable head; the type-specific body keeps each record honest to what it actually is.
