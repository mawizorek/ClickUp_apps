# Production Doc Audit · AI Toolkit

**Purpose:** Cold-audit any production document instance (Dropbox) against its git spec (structural compliance) and its matching ClickUp events (data freshness), producing a clean diff report.

**Steward:** Milo (mainstage-milo)

**Mode:** On-demand routine. Manually invoked by any agent or operator.

**Invocation:** `/audit-doc {production}` · `/production-doc-audit` · "audit the info sheet for [production]" · "which info sheets are outdated" · any agent working a production paperwork task needing freshness verification · Milo's routine production-prep check.

**Trigger:** When an operator or agent needs to verify whether a published production document matches (a) its structural spec and (b) the current state of ClickUp events for that production.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-02** by Mira (creation loop) + Dexter (handoff). **Spec source repointed 2026-08-07.**

---

## 🔴 SPEC SOURCE — READ THIS BEFORE THE COORDINATES TABLE

**The canonical spec home is `mawizorek/uritp-docs` → `doc-specs/{type}.md`.** Ruled by Michael, 2026-08-07: *"The one inside URITP docs is definitely the one I want to keep. The one in MAW pros is functionally dead."*

~~`mawizorek/maw-prose` → `guides/doc-specs/`~~ **RETIRED as a claimant.** This hook pointed there from v1 (2026-08-02) until 2026-08-07, which means **every audit run in that window compared production documents against a spec in a repo Michael considers dead.** A freshness tool reading a stale source reports clean and is worse than no tool.

⚠️ **The retirement is NOT yet executed and the two trees are NOT equivalent.** As of 2026-08-07:

| | `uritp-docs/doc-specs/` (canonical) | `maw-prose/guides/doc-specs/` (dead) |
|---|---|---|
| info-sheet | ✅ 3,081 b | 2,828 b — superseded |
| brochure-review | ✅ | — |
| vectorworks/ | ✅ | — |
| **contact-sheet** | ❌ **absent** | present |
| **crew-call** | ❌ **absent** | present, substantial |
| **letterhead** | ❌ **absent** | present |
| **production-calendar** | ❌ **absent** | present |

🚫 **Four spec types exist ONLY in the dead repo and have no counterpart in the canonical one.** Until they are migrated, an audit of a contact sheet, crew call, letterhead or production calendar **has no spec to audit against.** **Say so and stop. Do not silently fall back to `maw-prose`** — falling back is how a retired source stays load-bearing forever.

**Authoritative tiebreak, per doc type:** the `Spec URL` custom field on the doc-type task in `Document TEMPLATES` (list `901319214267`). ⚠️ **Those fields may still point at `maw-prose`. A `Spec URL` is data, not truth — if it points at the dead repo, flag it rather than following it.**

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Spec source** | **`mawizorek/uritp-docs` → `doc-specs/{type}.md`** (cross-check the canonical task's `Spec URL`) |
| **Canonical task list** | Document TEMPLATES (Document Destroyer) · list `901319214267` |
| **Instance files** | Dropbox: `/PRODUCTIONS/URITP {YY-YY}/{slot} {title}/` |
| **CU events** | Sibling tasks in the same production list/folder as the info-sheet paperwork task |
| **Relevant field** | `Spec URL` (URL custom field on each doc-type task → points to the git spec) |

⚠️ **`uritp-docs` is a PRIVATE repo** (verified 2026-08-07) while `ClickUp_apps` is public. Never carry a visibility assumption between them — see `gates/repo-referent-gate.md` R4.

---

## Procedure

### 0. Resolve target

Given a production name (or "all current"):

1. Locate the production's **info-sheet paperwork task** in ClickUp (the per-production CU mirror, e.g. `Paperwork (BL)`).
2. From that task or its parent canonical doc-type task (`[ info-sheet ]`), read the **`Spec URL`** custom field. **If it resolves to `maw-prose`, STOP and flag it** — that is a stale pointer, not a spec location.
3. Identify the **Dropbox instance file** (linked in the canonical task's description or the production paperwork task).
4. Identify the **production's event list** (sibling tasks in the same folder/list as the paperwork task).

### 1. Load spec

Fetch the git spec at HEAD using blob API (not cached). Parse it into a structural contract:

- Required sections (Header Block, Creative Team, Production Team, Key Dates, Other Dates)
- Required fields per section ("always present" roles/dates)
- Variant rules (OA, Development, Mainstage)
- Formatting rules (ALL CAPS, date format, TBD handling, filename convention)

**No spec in the canonical repo = NO AUDIT.** Report `NO SPEC` for that doc type and move on.

### 2. Read instance

Fetch the Dropbox `.docx` file via MCP. Extract:

- All text content, preserving section structure
- Dates (parsed into structured format for comparison)
- Personnel names and roles
- Filename (for convention check)

### 3. Pull CU events

Query ClickUp for all event tasks in the production's list/folder. Extract:

- Event name, start date, due date
- Status (including any "OUT OF DATE" / "OUTDATED" markers)
- Assignees (for personnel cross-reference where applicable)

### 4. Structural audit (spec compliance)

Compare the instance against the spec contract:

| Check | Pass condition |
| --- | --- |
| Filename convention | Matches `{ABBREV}.Info Sheet.{SEMESTER}{YY}.docx` |
| All required sections present | Header, Creative Team, Production Team, Key Dates exist |
| All "always present" roles listed | Even if TBD, the role line must exist |
| Variant rules applied correctly | OA/Dev/Mainstage variant matches the production type |
| Formatting compliance | Names in ALL CAPS, date format correct, single-page preference noted |
| Course codes current | Matches current catalog (flag if legacy-only) |

For each check: PASS, DRIFT (present but wrong), or MISSING.

### 5. Freshness audit (CU event alignment)

Compare every date in the info sheet against the matching CU event:

| Check | Pass condition |
| --- | --- |
| Date exists in CU | A corresponding event task exists |
| Date matches | Info sheet date == CU event date |
| Personnel matches | Where CU event has assignees, they match the info sheet names |
| CU event not flagged stale | Event status is NOT "OUT OF DATE" / "OUTDATED" |

For each date/event pair: CURRENT, STALE (dates disagree), UNBUILT (CU event doesn't exist), or FLAGGED (CU itself says outdated).

### 6. Produce report

Output a standardized diff report (see Report Format below).

---

## Report Format

```
## Production Doc Audit · {Production Name} · {date}

**Spec:** {spec file path} (SHA: {short_sha})
**Instance:** {Dropbox filename}
**Events list:** {CU list name}

---

### Structural Compliance

| Section / Field | Status | Detail |
| --- | --- | --- |
| Filename convention | ✅ PASS / ⚠️ DRIFT / ❌ MISSING | {specifics} |
| Header Block | ... | ... |
| Creative Team: Director | ... | ... |
| ... | ... | ... |

**Structural score:** {n}/{total} passing

---

### Data Freshness

| Date Field | Info Sheet | ClickUp | Status |
| --- | --- | --- | --- |
| First Rehearsal | Mon, Oct 20 | Oct 21 | ⚠️ STALE (1 day off) |
| Auditions | Sep 4-5 | — | ❌ UNBUILT |
| ... | ... | ... | ... |

**Freshness score:** {n}/{total} current

---

### Summary

**Overall:** {CURRENT | PARTIALLY VALID | OUTDATED | WRONG FILE | NO SPEC}

**Immediate fixes needed:**
- {bullet list of actionable items}

**Infrastructure gaps (CU events not yet built):**
- {bullet list}
```

---

## Triage Vocabulary

| Severity | Meaning | Action |
| --- | --- | --- |
| ✅ **CURRENT** | Info sheet matches spec and CU events | No action |
| ⚠️ **STALE** | Dates/personnel disagree between info sheet and CU | Update whichever is wrong |
| ⚠️ **DRIFT** | Structural deviation from spec (present but wrong) | Reformat to match spec |
| ❌ **MISSING** | Required field/section absent from info sheet | Add it |
| ❌ **UNBUILT** | Info sheet declares a date with no corresponding CU event | Build the event OR remove from sheet |
| 🚩 **FLAGGED** | CU event itself is marked OUT OF DATE | Resolve the CU event first, then re-audit |
| 🔴 **WRONG FILE** | Instance is from a completely different semester/production | Rewrite from scratch |
| ⬜ **NO SPEC** | No spec exists in the canonical repo for this doc type | Migrate or author the spec first. **Never fall back to `maw-prose`.** |

---

## Variant Handling

The spec defines three production types with different rules:

- **Mainstage:** Full 5-section structure, all "always present" fields, Other Dates section expected.
- **Development:** Truncated after Key Dates, fewer design roles, may omit Other Dates entirely.
- **One Acts (OA):** Multiple titles in header, festival-style team structure, per-piece tech schedule possible, specific OA fields replace standard creative team.

The audit MUST detect which variant applies (from the production's metadata or header content) and evaluate ONLY the fields required for that variant. A Development production missing "Other Dates" is not a failure.

---

## Guardrails

- **Read-only.** This hook reports drift. It does NOT update the Dropbox file, create CU events, or modify any task. Fixes are a separate action requiring explicit operator approval.
- **Blob API for spec reads.** Always fetch at HEAD, never from cache. Same discipline as doc-destroyer-reconcile.
- 🔴 **State the repo coordinate before the first read** (`gates/repo-referent-gate.md` R1). This hook's whole v1 defect was a spec source nobody re-derived.
- **Dropbox MCP for instance reads.** Do not assume file content from prior sessions; always re-read.
- **Scope to production docs only.** Non-production docs (syllabi, contracts) are out of scope unless they get their own spec.
- **One production at a time OR batch.** When "all current" is requested, iterate and produce one report per production, then a summary rollup.
- **Don't assess CU event correctness.** If a CU event says Oct 21 and the info sheet says Oct 20, flag the disagreement. Do NOT determine which is right. That's the operator's call.

---

## Composes With

- `gates/repo-referent-gate.md` — **the gate this hook violated for five days.** Fire it before the first spec read.
- `hooks/doc-destroyer-reconcile.md` — Registry-level sync (spec↔task links). ⚠️ **It may also carry the `maw-prose` coordinate — check it.**
- `hooks/source-freshness-gate.md` — checks whether the spec itself is stale; this hook checks whether a downstream artifact matches its spec.
- `hooks/stale-context-reload.md` — re-fetch before writing.
- Future: **Doc Dave** (formatter agent) for the fix step downstream of this audit.
- Future: Automation trigger (CU event date changed → flag info-sheet task field to OUT OF DATE).

---

## Changelog

- **v1.1 (2026-08-07)** — **Spec source repointed `maw-prose` → `uritp-docs`** on Michael's ruling. Added the `NO SPEC` verdict and the explicit no-fallback rule, because four spec types (contact-sheet, crew-call, letterhead, production-calendar) exist only in the retired repo and a silent fallback would keep it load-bearing forever. Added the repo-referent-gate pointer and the private/public visibility warning. Found during the misplaced-docs sweep that followed the safety-pipeline wrong-repo write.
- **v1 (2026-08-02)** — Established by Mira (creation loop) + Dexter (handoff). Two-pass audit: structural compliance against git spec, data freshness against CU events. Born from the info-sheet audit thread on task `86ajurbxz`.
