# Doc Destroyer Reconcile · AI Toolkit

**Purpose:** Keep the Document Destroyer list (ClickUp) and the `guides/doc-specs/` folder (git) in lockstep. Every doc-type task should point to a real spec, every spec should have a matching task, and names should agree.

**Steward:** Anna

**Mode:** On-demand routine. Manually invoked. Any agent can run it. Not always-on.

**Invocation:** `/doc-destroyer-reconcile` · `/reconcile-specs` (alias) · "reconcile the destroyer" · "sync the doc specs" · "check the spec URLs."

**Trigger:** After committing new specs to `guides/doc-specs/` · after creating new tasks in the Document Destroyer list · when Michael asks Anna or any agent to verify the registry · periodically during doc-spec authoring sprints.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-02** by Corey + Dexter during the Doc Spec Architecture session.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **CU List** | Document TEMPLATES (repurposed as Document Destroyer) · list `901319214267` · URITP Space 1 |
| **Git folder** | `mawizorek/maw-prose` → `guides/doc-specs/` |
| **Excluded files** | `_TEMPLATE.md`, `README.md` (not doc-type entries) |
| **Relevant field** | `Spec URL` (URL custom field on each task, points at the git spec) |

---

## Pass (three checks)

### 1. CU → Git (every task's Spec URL resolves)

For each task in the Document Destroyer list that has a non-empty `Spec URL` field:

- Parse the URL to extract the file path (e.g. `guides/doc-specs/info-sheet.md`)
- Verify the file exists at HEAD in `mawizorek/maw-prose`
- If it does NOT exist: flag as 🔴 **BROKEN LINK** (the task points to a spec that doesn't exist)

For tasks with an EMPTY Spec URL:

- Flag as 🟡 **UNLINKED** (task exists but has no spec yet, may be intentional if the spec hasn't been written)

### 2. Git → CU (every spec has a matching task)

List all `.md` files in `guides/doc-specs/` EXCLUDING `_TEMPLATE.md` and `README.md`.

For each file:

- Check whether ANY task in the Document Destroyer has a Spec URL pointing at this file
- If no task points to it: flag as 🟠 **ORPHAN SPEC** (a spec exists in git with no corresponding registry entry)

### 3. Name alignment

For each matched pair (task + spec file):

- Read the spec's `# Title` heading (first H1)
- Compare to the task title in ClickUp
- If they disagree: flag as 🟡 **NAME DRIFT** (not critical, but confusing)

---

## Triage vocabulary

| Severity | Meaning | Action |
| --- | --- | --- |
| 🔴 **BROKEN LINK** | Spec URL points to a file that doesn't exist at HEAD | Fix the URL or create the missing spec |
| 🟠 **ORPHAN SPEC** | A spec file exists with no CU task pointing at it | Create the task, or flag as stale if the spec was deprecated |
| 🟡 **UNLINKED** | Task has no Spec URL (spec not yet written) | Note it; no action required unless a spec exists and wasn't linked |
| 🟡 **NAME DRIFT** | Task title and spec H1 disagree | Align to whichever is more current |
| ⚪ **MATCHED** | Task ↔ spec linked and names agree | Report as clean |

---

## Report format

```
## Doc Destroyer Reconcile · <date>

**Tasks in list:** <n> · **Specs in repo:** <n>
**Findings:** <n> (🔴 n / 🟠 n / 🟡 n / ⚪ n matched)

### 🔴 Broken links
- <task name> → <URL> — file not found at HEAD

### 🟠 Orphan specs
- <filename> — no task in the Destroyer points here

### 🟡 Unlinked tasks
- <task name> — Spec URL empty

### 🟡 Name drift
- <task name> ≠ <spec H1>

### ⚪ Matched
- <task name> ↔ <spec file> ✓
```

---

## Guardrails

- **Read-only until confirmed.** Never update a Spec URL or create a task without confirming the finding against both surfaces.
- **Blob API reads, not raw URLs.** Same discipline as doc-rot-sweep: verify at HEAD, not a cache.
- **Don't auto-create tasks or specs.** Report findings. Let the invoking agent or Michael decide the fix. The exception: if Michael explicitly says "fix it" alongside the invocation, then create missing tasks / update broken URLs in the same pass.
- **Notes stay OUT of task descriptions.** Prose about a doc type lives in the git spec. The CU task is a metadata row, not a notebook.

---

## Composes with

- `hooks/doc-rot-sweep.md` (if a spec's content is stale, that's rot-sweep territory, not this hook's)
- The doc-spec `_TEMPLATE.md` (defines what a valid spec looks like)
- `hooks/stale-context-reload.md` (re-fetch before writing)
- Future: `routines/` framework if this gets put on Ricky's cadence

---

## Changelog

- **v1 (2026-08-02)** — Established by Corey + Dexter. Three-pass reconcile: CU→Git link check, Git→CU orphan check, name alignment. Born during the Doc Spec Architecture session after Michael asked how a cold agent would reconcile the two surfaces.
- **v1.1 (2026-08-02)** — Added Steward field (Anna). Hook template formalized.
