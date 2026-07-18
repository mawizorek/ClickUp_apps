# ClickUp Skills ↔ brain-config integration standard

*Established 2026-07-18. This page defines how native ClickUp AI Skills relate to the git-hosted brain-config runtime (hooks / gates / agents / teams), so the two layers compose instead of drifting into competing copies of the same logic. It is the canonical answer to "when do I reach for a Skill vs. a git file, and how do they connect?"*

---

## What we discovered (2026-07-18)

ClickUp shipped **AI Skills**: native, workspace-resident instruction playbooks stored in the **Skills Hub** (plus an auto-created Skills Space). A Skill has a name + summary (always visible to Brain) and full instructions (loaded on demand), status Active/Draft/Disabled, a `/slash-command`, install-vs-share semantics, permissions, and description-history versioning.

**The key realization:** AI Skills are the platform's native version of the machine this repo already builds by hand. Map it:

| brain-config (git) | Native AI Skill |
| --- | --- |
| AI Toolkit index trigger-table row | Skill **summary** (the always-visible fire signal) |
| A gate / agent / hook profile | Skill **instructions** (the on-demand body) |
| Fire-always hook | Skill status **Active** (auto-loads for installed users) |
| A named single-agent call | Skill **`/slash-command`** |
| git commit history | Skill **description history** |
| The AI Toolkit index doc | The **Skills Hub** |
| The repo | The auto-created **Skills Space** |

Because they are the same shape, the risk is **drift**: the same logic living canonically in two places, edited on one side, stale on the other — the exact failure that stranded agents in the registry↔index mirror pair. The rest of this page is how we prevent that.

> ⚠️ Terminology trap: a **Skill** (instruction playbook in the Skills Hub) is NOT the same as a **Super Agent's "Skills"** (its granted *tools*). Two different "Skills" in the same product. When this doc says Skill, it means the instruction playbook.

---

## The governing split: Skill = TRIGGER + PATTERN, git = STEPS

This is the rule. A Skill owns **when to run** (the trigger signal, carried by its summary) and, where relevant, **the shape of the work** (the pattern). The git file owns **what to actually do** (the steps, the method, the volatile facts). Stated as a boundary:

- **Skill holds:** the trigger, the invocation surface (`/slash-command`, @brain phrasing), the high-level pattern/shape, and — only when nothing else is canonical — a self-contained method.
- **git holds:** the detailed steps, the checklists, the routing facts that change, the multi-agent orchestration, anything with commit-history value.
- **The skill points at git; it never copies git.** A pointer is not a copy. A thin skill whose body says "load `brain-config/X` and run it" cannot drift, because it holds no logic to fall out of sync.

### Why a pointer, not a copy

The registry↔index mirror pair is the ONE sanctioned duplication in this system, and it only survives because we reconcile both sides in the same session, every time. Everything else must avoid that burden. If a Skill copied a git gate's steps, the moment someone edited the gate, the Skill would silently serve stale instructions with no error and no flag. Pointing at git means the Skill inherits every git change for free. This mirrors how Brain memory already works: memory holds ONE line pointing at the AI Toolkit index, never a second copy of it.

---

## The decision rule (when to build which)

- **Build a Skill when** the thing needs a native trigger, a shareable/permissioned front door, a `/slash-command`, team-install, or is a self-contained playbook a teammate could run without touching the repo. Skills are strong at: shallow, shareable, single-purpose, discoverable.
- **Keep it in git when** it needs deterministic multi-step orchestration, deep nesting, PR/revert, cross-referencing, or has real commit-history value. git is strong at: deep, orchestrated, versioned, engine-level.
- **The common case is BOTH:** a thin Skill (trigger + pattern) fronting a git file (steps). Native discoverability up top, deep engine underneath, single source of truth in the repo.

### The stable-vs-volatile test (what may live in the Skill body)

When a Skill does carry inline content, split by volatility:

- **Stable + homeless** (a general method that lives nowhere else, doesn't change often) → may live in the Skill. It's the sole canonical home, so there's nothing to drift against. Detail is welcome here — more context increases reliability on fragile operations.
- **Volatile OR canonical-elsewhere** (routing maps, list IDs, anything an audit backfills, anything with a git/doc home) → NEVER copied into the Skill. The Skill points at the live source and reads it fresh every run (retrieve-then-reason, not copy-then-hope).

---

## Worked examples (built 2026-07-18)

- **`/email-ingest`** (parent, EMAIL-INGEST) — holds the general Milo-quality digest **method** (research-first → exhaust recall → MOVE/COMBINE/multi-association → open-actions → INTAKE PLAN → propose-and-wait). This method is stable + homeless, so it lives inline, detailed on purpose. Workspace-agnostic, so it is honest that recall is best-effort absent a domain lookup.
- **`/uritp-email-ingest`** (sub-skill) — a **pointer**. Holds the stable URITP North Star + multi-forward dedup logic inline, but the volatile routing map (list IDs, email-type→destination) is NOT copied; it points at the URITP List Index, INBOX manual, and Triage Reference and reads them live. When the audit backfills a list ID, the skill inherits it automatically.
- **`/audit-loop`** (AUDIT-LOOP) — the cleanest expression of the split. The Skill owns the **pattern** (bounded auditor↔synthesizer loop, per-round threading) and the **trigger** ("audit this, review, re-audit"); it points at `agents/audit-anna.md`, `council.md`, and `agents/maestro-mira.md` for the actual **steps**. Skill = pattern + trigger; git = steps.
- **`/question-me`** (QUESTION-ME) — a self-contained playbook (constructive interrogation stance). Stable + homeless, so it lives inline; no git dependency.

---

## How this grows with the existing (and expanding) git setup

- **New reusable behavior?** Ask the decision rule. Teammate-facing / triggerable / shareable → Skill (thin, pointing at git for any steps that already exist). Engine-level / orchestrated / versioned → git file, optionally fronted by a thin Skill for discoverability.
- **Promoting an existing git hook to a Skill?** Do NOT copy its steps into the Skill. Create a thin Skill that triggers and points at the existing git file. The git file stays canonical.
- **Editing a fronted git file?** Nothing to sync on the Skill side, that's the whole point of the pointer. The Skill inherits the change. (Contrast the registry↔index mirror pair, where you MUST reconcile both sides.)
- **Drift check (standing):** if you ever find a Skill body restating steps/facts that also live canonically in git or a doc, that's drift — replace the copied content with a pointer. A Skill should read as "here's when + the shape; the steps live at `brain-config/X`," not as a second copy of X.
- **AI Toolkit index:** the index remains the deterministic zero-discretion routing layer for Brain's own sessions. Skills add a native, shareable, teammate-facing trigger surface on top. They are complementary layers, not replacements — index for guaranteed in-session firing, Skills for shareable on-demand invocation.

---

## One-line law

**Skill triggers and shapes; git instructs. Point, never copy. The only sanctioned duplication is the registry↔index mirror pair.**
