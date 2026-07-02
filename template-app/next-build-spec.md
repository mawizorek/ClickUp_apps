# [App Name] v[N+1] — Build Spec (Surgical Diffs)

**For the rendering agent.** Read the current source from `<app-slug>/source/` (base64-armored chunk set), then apply the diffs below. Ship as v[N+1].

## Source location

- **Chunk index:** `<app-slug>/source/source_index.html`
- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Commit (pinned):** `<paste commit SHA here for reliability>`
- **Encoding:** base64 armored
- **Total chunks:** [N]
- **Total source bytes:** [X]

## What this version does (summary)

1. [Change 1]
2. [Change 2]
3. ...

---

## Diff 1: [Description]

```javascript
// FIND:
[exact code to find]
// REPLACE WITH:
[exact replacement code]
```

---

## Diff 2: [Description]

```javascript
// FIND:
[exact code to find]
// REPLACE WITH:
[exact replacement code]
```

---

## [Additional diffs as needed...]

---

## Export / zip structure target (if applicable)

```
app-slug-vN_YYYY-MM-DD-HHMM.zip
└── app-slug/
    ├── vN-Report.md
    ├── app-slug-vN.html
    └── source/
        ├── chunks...
        ├── README.md
        └── source_index.html
```

---

## Agent instructions

1. Read the chunk set from `<app-slug>/source/source_index.html`. Follow the gated walk (auto-advance up to 5 chunks per pass).
2. After reading all chunks, apply the diffs above in order.
3. Deliver the complete modified source as a ClickUp artifact (v[N+1]).
4. Do NOT commit to the repo (file is >30KB). Michael uploads manually.
5. Post the standard version comment on the app's task.

---

## Known snags / notes for the render agent

- [Any gotchas, transient failures, or context the render agent needs]
- Base64 armor is mandatory for HTML source chunks (plaintext gets tag-flattened by fetch tools).
- Prefer commit-pinned raw URLs over `main` branch URLs (transient CDN 404s on recent commits).
