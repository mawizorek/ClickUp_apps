# markdown-viewer v[N+1] — Build Spec (Surgical Diffs)

> **STUB — not an active build.** Placeholder to bring this app in line with the repo standard (every app carries a `next-build-spec.md`). Populate this when a next version is actually scoped. Structure mirrors `template-app/next-build-spec.md`.
>
> **Standing rule (applies to this app):** must be designed for clean mobile viewing AND desktop — no horizontal overflow at 320px, footers/action bars that wrap or stack, touch targets ≥44px, fluid layout via `clamp()`/`min()`/`%`, safe-area insets. Test at phone width before shipping.

**For the rendering agent.** Read the current source from `markdown-viewer/source/` (base64-armored chunk set), then apply the diffs below. Ship as v[N+1].

## Source location

- **Chunk index:** `markdown-viewer/source/source_index.html`
- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Commit (pinned):** ` `
- **Encoding:** base64 armored
- **Total chunks:** [N]

## What this version does (summary)

1. [Change 1]
2. ...

---

## Diff 1: [Description]

```javascript
// FIND:
[exact code to find]
// REPLACE WITH:
[exact replacement code]
```

---

## Agent instructions

1. Read the chunk set from `markdown-viewer/source/source_index.html`. Gated walk, auto-advance up to 5 chunks per pass.
2. Apply the diffs above in order.
3. Deliver the complete modified source as a ClickUp artifact (v[N+1]).
4. Do NOT commit to the repo if file >30KB. Michael uploads manually.
5. Post the standard version comment on the app's task.

---

## Known snags / notes for the render agent

- Base64 armor is mandatory for HTML source chunks (plaintext gets tag-flattened).
- Prefer commit-pinned raw URLs over `main` branch URLs (transient CDN 404s on recent commits).
