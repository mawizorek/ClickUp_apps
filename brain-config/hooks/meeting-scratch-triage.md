# Meeting Scratch Triage · AI Toolkit

**Purpose:** Turn the raw scratch comments Michael drops during a URITP meeting (bare/partial task ids, shorthand, "X's thing is called Y" naming, fragments) into ONE clean, linked plan surface, and PROPOSE the downstream greenlight actions without firing any of them. It is the meeting-notes equivalent of INBOX triage: normalize the mess into linked, routed truth, then wait for the greenlight.

**Steward:** Mainstage Milo (URITP meeting ops). Any agent may fire it; the file-maintenance owner is Milo.

**Mode:** On-demand routine, MANUAL for now. Phase 2 = auto-fire at meeting end, promoted only after the resolution guessing proves consistent across real runs (the INBOX-triage maturation path). Not always-on: it is a deliberate pass.

**Invocation:** `/scratch-triage` · "triage my meeting notes" · "clean up my scratch" · scoped forms preferred ("triage today's staff meeting notes").

**Trigger (auto-eligibility, still manual-fire in phase 1):** all of —
1. Task context = a meeting-type Event task in the **URITP tree** (staff meeting, program meeting, production meeting, post-mortem).
2. Scope = URITP tree ONLY. Not staff-only, not all-meetings. Staff-only is too narrow (production meetings and post-mortems throw the identical bare-id soup); all-meetings is too broad (the propose-to-parent move only makes sense inside URITP's production tree).
3. New scratch comment(s) carry the scratch signature: bare/partial task ids (`86xxxxxxx`), shorthand, naming declarations, fragments.

**Front door: this file, and nothing else.** No ClickUp Skill, per the git-only tools lock (LOCKED 2026-07-25, `brain-config/skills-integration.md`). Registration is this file plus its AI Toolkit index trigger row.

**Established 2026-08-04** in the Staff Meeting session (URITP-2594). Seated through Maestro Mira; Fold-in Frank ruled net-new (sibling to the INBOX Triage Trigger, not a fold into the read-only Task-Context Orientation Gate).

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Scope** | Meeting-type Event tasks in the URITP tree (space `URITP`) |
| **Output home** | One consolidated clean block appended under the day's heading in the meeting task description (NOT threaded replies) |
| **Lane seams** | INBOX Triage Trigger (task-queue MOVE/COMBINE; this is comment normalization + propose) · Task-Context Orientation Gate (read-only orientation; this writes) · the recording→summary flow already on the meeting task (audio transcription; this is text scratch) |

---

## ⭐ The premise

Michael's live meeting scratch is a stream of pointers with the labels rubbed off: `confrim 86aj6h6da perfomrance dates`, `86agw8c39`, `Kali's thing is called "Becoming Curious"`. Every fragment is a real task or a real decision wearing shorthand. **The scratch is the truth; it is just unreadable and unrouted.** This hook resolves the pointers, rewrites them as linked minutes, and drafts the follow-through, WITHOUT executing the follow-through, so the rewritten block reads as "here is what Brain is planning to do" and Michael stays the one who greenlights.

**One-line law:** *propose, never execute — the rewritten comment IS the plan, not the action.*

---

## The routine (run on command, execute NOTHING)

### 0. Orient, read-path discipline

- Confirm the task is a URITP meeting-type Event task. If not, decline and say why.
- Read the NEW scratch comments since the last triage run (or the run's named scope). Do not re-triage already-cleaned scratch.
- Any git touch obeys the Operating Standard read ladder (blob API, fresh SHA). This hook itself does not require a git read to run.

### 1. Resolve every pointer

- Resolve each bare/partial task id (`86xxxxxxx`) to its real task; capture the true title.
- Resolve naming declarations ("X's thing is called Y") to the underlying task where one exists.
- **Resolution honesty (hard):** a typo'd, partial, or non-resolving id (e.g. a mid-sentence `86ab9gu2z`) is flagged `⚠️ couldn't resolve`, NEVER guessed into a link. A wrong link is worse than a flagged gap.
- Link Provenance: verify each id actually resolves before emitting its URL.

### 2. Write PART A — resolved minutes

- Rewrite the shorthand into clean, readable minute lines.
- Emit every resolved id as a markdown link carrying the task's true title.
- Append as ONE consolidated clean block under the day's heading. **Never overwrite Michael's raw scratch** — the raw comment stays untouched; this is an added block (Cass rule).
- No itemized inventory (Michael's own standing note); summarize, in/out-chart style where relevant.

### 3. Write PART B — proposed greenlight actions (PROPOSAL TEXT ONLY)

- For each resolved task, draft the proposed follow-through as a line another comment-agent can pick up: the greenlight merge, or the update to propagate to the relevant production/parent task.
- **NEVER merge right off the bat. NEVER post to a parent right off the bat.** Part B is text on the plan surface, not an action.
- Hold ALL execution until BOTH: (a) Michael greenlights, AND (b) resolution guessing has proven consistent across runs. Until then this hook is strictly propose-and-stop.
- A proposed update, when it does eventually fire, is one clean line + backlink to this meeting task + date. Not a dump.

### 4. Report

The output IS the appended block. Close with a one-line tally: pointers resolved, `⚠️` unresolved, proposals drafted. Name what could not be resolved so the pass is auditable.

---

## Guardrails

- **Raw scratch is sacred:** append only, never overwrite Michael's comments.
- **Propose, don't execute:** no merge, no parent comment until greenlit AND proven consistent.
- **Resolution honesty:** flag unresolved/typo'd ids, never fabricate a match.
- **No itemized inventory** (Michael's standing note); in/out-chart summary style.
- **Link Provenance:** verify each id resolves before emitting its URL.
- **URITP scope only:** decline politely on non-URITP or non-meeting task context.
- Repo read-path law on any git touch (blob API, fresh SHA).

---

## NOT this tool

- **Not audio transcription** — the recording→summary flow already lives on the meeting task. This is text scratch.
- **Not INBOX triage** — different list, different verbs (MOVE/COMBINE on a queue vs. rewrite + propose on live comments).
- **Not a read-only orientation stamp** — Task-Context Orientation is read-only; this writes the clean block.

---

**Composes with:** the INBOX Triage Trigger (the propose-first, greenlight-executes sibling this was modeled on) · `hooks/link-provenance.md` (verify before emitting a URL) · `hooks/task-context-orientation.md` (orients the meeting task before this runs) · the recording→summary flow on the meeting task (parallel input channel).

**Changelog:**

- **v1 (2026-08-04)** — Established in the Staff Meeting session (URITP-2594), seated through Maestro Mira. Fold-in Frank ruled NET-NEW, sibling to the INBOX Triage Trigger (shared propose-first DNA, neither list nor routines shared) rather than a fold into the read-only Task-Context Orientation Gate or the MOVE/COMBINE INBOX Triage Trigger. Workshop pass set the guardrails: raw scratch sacred (append never overwrite), one consolidated block not per-comment replies, resolution honesty over guessing, propagate batched behind a greenlight, no itemized inventory. Michael's scope call: URITP meeting-type tasks only. Michael's Part B reframe: the tool PROPOSES greenlight merges as pickup lines and the rewritten comment is the "what is Brain planning to do" surface; execution held until guesses prove consistent, then automated from there like INBOX triage. Manual-fire in phase 1.
