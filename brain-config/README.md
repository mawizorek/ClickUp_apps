# brain-config/

Versioned tool definitions for the AI Toolkit. The **concrete, diffable tool chunks** live here; the **guidance index + prose instructions** live in ClickUp (AI Toolkit page in the Brain Reference Library).

## The split

- **ClickUp = the routing layer.** The AI Toolkit index holds pointers, the trigger table, mode assignments, and prose instruction. Brain reads it on every pass. This is the source of truth for *what fires when*.
- **This repo = the runtime layer.** Each hook and subagent profile is a version-controlled markdown file. Commit history = the history of the tools we build. This is the source of truth for *what a tool actually does*.

Pointers cross-link the two. ClickUp names the tool + trigger; the repo file holds the full pass.

## Layout

```
brain-config/
├── hooks/     # deterministic guards that fire on a condition
│   ├── secrets-pii-guard.md
│   └── source-size-budget-enforcer.md
└── agents/    # subagent profiles: workers with their own context + scoped tools
    ├── red-team-reviewer.md
    ├── repo-auditor.md
    └── research-runner.md
```

## File format

Every file follows the AI Toolkit tool-page skeleton: **Purpose · Mode · Invocation · Trigger · Pass · Output · Composes with / overrides · Examples · Changelog.** One tool per file. Filenames are kebab-case, stable (version lives in the header + changelog, never the filename).

## Hot-path note

Anything read here costs an MCP round-trip when it fires. Build/research-time tools (Repo Auditor, Research Runner) pay that gladly since Brain is already in the repo. Hot-path tools that fire on every build (Red-Team Reviewer) keep their **trigger + one-line summary in the ClickUp index**; the full profile lives here and is loaded only when the gate actually opens.

## Profile Load Integrity (HARD STOP)

Before executing, an agent MUST load its own profile in full and verify the read is complete. This is a gate, not a preference.

- Read the whole file. Confirm it parses end-to-end: header present, all expected sections present, Changelog reached. A read that ends mid-section = truncated = FAIL.
- If the body is missing (metadata/SHA only), clipped at ~30KB, flattened, or otherwise partial, the load FAILED.
- On any failure: STOP. Do not proceed on a partial profile. NEVER reconstruct it from the Toolkit index summary, memory, or a prior session. The index one-liner is a pointer, not a substitute.
- Surface the blocker, name the failed read path, offer the fallback.

### Verified read path (LOCKED, 2026-07-04)

- **File bodies:** fetch the raw githubusercontent URL (`https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main/<path>`). The repo is PUBLIC; raw fetch works. This is the source of truth for reading any file body back.
- **`githubmcp_get_file_contents` returns metadata/SHA only on a file path, NOT the file body.** Use it for directory listings and blob SHAs, never as a body-read path. Assuming it returns a body is what caused the 2026-07-04 Renata false-audit incident.
