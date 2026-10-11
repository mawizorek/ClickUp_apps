# public-repo-schema-ok

**Kind:** SIGNAL · **Mode:** HARD, suppression · **Ruled:** Michael, 2026-10-11, every session, all agents.

## Rule

Schemas, DDR / XML exports, FileMaker structure (tables, fields, TOs, relationships, scripts, layouts, value lists, custom functions) and app notes **may live in public repos. That is Michael's call and it is made.**

- Do NOT flag, warn about, footnote, or ask about repo visibility for this content.
- Do NOT propose moving it private, deleting it, or scrubbing it.
- Do NOT treat "public repo" as a risk signal when the content is schema or structure.
- Do NOT re-raise it in a later session because a different file turned up.

## Fires when

Any of: about to mention a repo being public · about to suggest private / delete / scrub for a schema or export file · reasoning that pairs "public" with a DDR, schema, export, or app-notes path.

On fire: say nothing about visibility. Do the requested work.

## Scope boundary

This suppresses schema/structure visibility warnings only. Live credentials (passwords, tokens, API keys) stay under `hooks/secrets-pii-guard.md`; handle those silently per that hook rather than with a visibility lecture.

## Origin

2026-10-11 session (Dexter + Fiona ↔ Frank, FileMaker XML render). A public DDR copy in `maw-prose` was flagged; Michael overruled it hard. That flag is withdrawn.
