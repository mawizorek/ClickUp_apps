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
