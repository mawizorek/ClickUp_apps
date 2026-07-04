# Tool Metadata Schema

Every brain tool gets a `metadata.json` sidecar next to its profile (or, for triggers, standing alone). This is the machine-writable control surface the viewer reads and the config UI edits. The `.md` profile stays the human narrative (prose, checklist, personality, changelog); the `.json` holds structured, editable fields. No overlap, no sync problem.

**Canonical rule:** the sidecar is the source of truth for structured metadata. `registry.json` becomes a GENERATED artifact (concatenation of all sidecars) in a later segment - do not hand-edit it.

---

## Shared envelope (all three types)

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | kebab-case, matches the filename |
| `type` | string | `agent` \| `hook` \| `trigger` |
| `name` | string | display name |
| `status` | string | `active` \| `building` \| `dormant` \| `retired` |

---

## Agent (super-record)

The rich record. Carries the launcher, team wiring, and the open-ended toggle bag.

| Field | Type | Notes |
|-------|------|-------|
| `colloquialName` | string | the everyday name you call it ("Renata") |
| `nicknames` | string[] | alternate names for invocation/search |
| `seat` | string | council \| workshop \| close \| audit \| research \| etc. |
| `teams` | string[] | team slugs this agent sits on |
| `role` | string | one-line role summary |
| `accent` | string | oklch color token for the card |
| `badge` | string\|null | `halt` \| `warn` \| `silent` \| null |
| `created` | string | YYYY-MM-DD |
| `shortcut` | boolean | renders the Run-me launcher |
| `launchPrompt` | string | the default prompt copied on launch |
| `toggles` | object | open-ended booleans, e.g. `{ "hasWriteAccess": false, "firesAtSessionClose": true }`. Add switches here with NO schema change. |

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
