# Repo Referent Gate

**Status:** LOCKED 2026-08-06 (Michael) · **WIDENED 2026-08-07** (Michael: *"agents know there is a general repository and that it's not always just a default to Brain Config or ClickUp apps just because that's what you know"*)
**Class:** hard gate, fires before the FIRST GitHub call of any kind (read or write) **and before deciding where any new artifact goes**
**Owner:** ownerless like the sweeps. Any agent fires it on itself. No persona required.

---

## THE RULE — now two rules, because v1 only covered half the failure

> **1 · READING: "the repo" is never resolvable from memory. Ever.**
> **2 · WRITING: the repo you have been reading is not evidence of where a new file belongs.**

Before the first GitHub tool call in any session, state the target out loud, in the reply, as a literal string:

```
owner/repo@branch
```

Derive it from the **session subject**, not from what happens to be loaded. If the session subject does not name a repo explicitly, **ASK**. Do not infer. Do not pick the one you already know.

The stated string is the falsifiable artifact. Same shape as the spine line and the orientation stamp: **no stated coordinate = the gate did not fire.**

---

## 🔴 THE PLACEMENT RULE (added 2026-08-07 — this is the half v1 missed)

v1 governed which repo you READ. It said nothing about which repo a NEW artifact belongs in, and that is where the second failure landed: a URITP program document written into `brain-config` after twelve correct `brain-config` writes in a row.

**Before creating any file, ask WHO READS IT. That answers the repo, and nothing else does.**

| If the reader is… | It belongs in… |
|---|---|
| **An agent** (a gate, hook, bundle, orchestration rule, team standard) | `ClickUp_apps` → `brain-config/` |
| **A human in the theatre program** (a policy, a program, a guide, a spec, a procedure) | `uritp-docs` |
| **A human in another domain** | that domain's docs repo — `hml-docs`, `theatre-docs`, `maw-prose` |
| **A renderer or a theme** | `doc-render-engine`, `maw-themes` |

⚠️ **A document about how URITP works is NOT fleet machinery, even when an agent wrote it, even when an agent will read it too.** Authorship does not determine placement. **Audience does.**

🚫 **Never create a new top-level folder in `brain-config` for domain content.** If you are reaching for `brain-config/specs/` to hold something a production manager would read, you are in the wrong repo.

---

## ⚠️ THE ENTRY POINT IS NOT THE DESTINATION

Michael, 2026-08-07: *"That's a great starting point and everybody has to enter there, but the repository in general is much larger than that!"*

**Every agent boots through `brain-config`. That is correct and it is exactly why this gate exists.** The bootstrap coordinate is force-loaded on every response, which makes it the highest-availability repo token in any context — **including sessions that have nothing to do with it.**

**Entering through a door does not mean living in the hallway.** `brain-config` is where an agent learns how to work. **It is not where the work goes.**

---

## WHY THE EXISTING SWEEPS MISS THIS

| Sweep | Catches | Blind to |
|---|---|---|
| Doc-Rot Sweep | a fact that went STALE | a fact that is currently TRUE |
| Fleet-Fact Sweep | a fact about the wrong PERSON | a fact about the wrong OBJECT |
| **Repo Referent Gate** | a TRUE fact bound to the WRONG REFERENT | — |

`mawizorek/ClickUp_apps` is real. It is public. It is the brain-config home. Every one of those statements passes all six doc-rot tests and the whole fleet-fact ladder. **The failure is not the fact. The failure is that the fact answered a question it was not asked.**

A correct fact retrieved for the wrong referent is indistinguishable from a correct answer, from the inside. That is exactly why it needs a gate and not a check.

---

## THE MECHANISM (name it so you can catch it)

**Substitution, not inference.** A demonstrative ("the repo", "the guides tree", "our docs") gets silently bound to the only candidate in working memory, and the binding step never surfaces as a decision. **The tell is that it feels like recall, not like a choice.** A choice would have felt like a choice.

🔴 **AND THE SECOND MECHANISM, FOUND 2026-08-07: MOMENTUM.** The 08-07 failure was not a session that never stated its coordinate. **It stated it correctly at open — for a session about agent config — and then the SUBJECT MOVED and the coordinate did not move with it.** Twelve consecutive correct writes to `brain-config` made the thirteenth feel correct.

⭐ **A run of correct writes to one repo is not evidence the next one belongs there.**

⭐ **RE-DERIVE AT SUBJECT-TURN, NOT AT SESSION-OPEN.** 🌟 Identical shape to the seating rule locked the same afternoon (`team-standard.md` v1.9 — *check at subject-turn*). **Two different systems, one failure mode, one day: every "check at open" gate in this fleet has the same hole.**

Read the bootstrap memory line as a SCOPED fact:

- ✅ "brain-config lives at `mawizorek/ClickUp_apps`."
- 🚫 "the repo is `mawizorek/ClickUp_apps`."

---

## PROCEDURE

**R1 — NAME IT.** Before the first GitHub call, write `owner/repo@branch` in the visible reply. Not in reasoning.

**R2 — DERIVE, DON'T RECALL.** The coordinate comes from the session subject. If the request says "the guides root tree," the repo is the one that HAS a guides root tree. **Verify that it does before believing it.**

**R3 — AMBIGUITY IS A STOP.** Two plausible repos, or zero named, means ask.

**R4 — VISIBILITY IS PER-REPO AND NEVER CACHED.** 🔴 **This rule has real teeth as of 2026-08-07: `uritp-docs` is PRIVATE and `ClickUp_apps` is PUBLIC.** They are the two most-confused repos in the fleet and their visibility is opposite. **A PII, FERPA, secrets or student-data judgment carried from one to the other is inverted, not merely stale.** Verify the specific repo's visibility in the session, or say you have not.

**R5 — MULTI-REPO SESSIONS RE-STATE.** State the coordinate again at every switch. **The most dangerous moment is the second repo, because the first one is now the loaded string.**

**R6 — THE GATE COVERS READS TOO.** Reading the wrong repo produces confident answers about a codebase nobody asked about, and those become the premise for the next write.

**R7 — PLACEMENT (new).** Before creating a file, name its READER out loud, then the repo. See the placement rule above.

**R8 — A SUCCESSFUL READ IS NOT PROOF THE REPO EXISTS (new, and this one is nasty).** See the rename trap below.

---

## 🔴 THE RENAME-REDIRECT TRAP (found 2026-08-07)

**GitHub silently redirects a renamed repository's old name to its new one.** The API returns 200 and real content. **So a stale coordinate does not fail — it SUCCEEDS, serving the new repo's contents under the dead name.**

**Live case:** `mawizorek/uritp-doc-archive` was carried in an agent memory file for three days as the home of the course canon. **It does not exist.** A directory listing against it returned a tree **byte-identical** to `uritp-docs`, because that is what it was renamed to. The read succeeded. Nothing looked wrong.

⚠️ **This defeats the ordinary "just try it and see" verification.** The only reliable checks:

- **`githubmcp_search_repositories` with `user:<owner>`** returns the true, current list. It does not honour redirects.
- **A path unique to the repo you think you are in.** If `02-courses/` is supposed to exist and only `courses/` does, you are somewhere else.

🌟 **Generalized: two different sources returning IDENTICAL results is an artifact to verify, not a finding.** Sibling of the existing rule that two surfaces DISAGREEING about a field is a defect to name rather than a fact to report.

---

## SCOPE

Fires on: any `githubmcp_*` call, any raw/blob/Pages fetch, any statement asserting what a repo contains, any claim about a repo's visibility or hosting, **and any decision about where a new file goes.**

Does NOT fire on: discussion that names no repo and touches no file.

---

## THE REPO UNIVERSE — verified live 2026-08-07 via `user:mawizorek`

⚠️ **Reading this table does not satisfy R1.** It exists to make you notice there are **nine** candidates, which is the entire point. **Nine, not one.**

| Repo | Vis | What it is |
|---|---|---|
| **`ClickUp_apps`** | 🌐 **PUBLIC** | brain-config + HTML apps. The bootstrap coordinate. **The default substitution — suspect it hardest.** |
| **`uritp-docs`** | 🔒 **PRIVATE** | **THE URITP DOCS TREE.** `safety/` · `courses/` · `production/` · `roles/` · `guides/` · `doc-specs/`. **Every URITP program document belongs here.** ⚠️ Renamed from `uritp-doc-archive`. |
| `maw-prose` | 🌐 public | long-form notes. Holds `guides/doc-specs/` + `production-management/` + `production-phases/`. ⚠️ **Forks with `uritp-docs/doc-specs/` — UNRESOLVED.** |
| `template-docs` | 🌐 public | gold-standard content repo; the executable spec for every doc site. |
| `doc-render-engine` | 🌐 public | the renderer. Knows nothing about any one site. |
| `maw-themes` | 🌐 public | theme contracts. |
| `theatre-docs` | 🌐 public | theatre docs outside URITP. |
| `hml-docs` | 🌐 public | HML_LLC docs. |
| `maw-xcode-sync` | 🌐 public | Xcode sync. |

🪦 **`uritp-doc-archive` DOES NOT EXIST** — renamed to `uritp-docs`. Reads against it succeed via redirect. **Do not use it. Do not trust a memory that names it.**

The table rots. The rule does not. **When the table and the session subject disagree, the session subject wins and the table gets corrected.** ⚠️ **Re-derive the list with `user:mawizorek` rather than trusting this table for anything consequential** — it was wrong by five repos for a month.

---

## FAILURE LOG

| Date | Said | Meant | Substituted | Caught by |
|---|---|---|---|---|
| 2026-08-06 | "update the thtr course info on the repo" | `uritp-docs` | `ClickUp_apps` | Michael, before any write. Compounded by a FERPA claim built on the wrong repo's visibility. |
| 2026-08-07 | "need all that actually captured somewhere" | `uritp-docs` → `safety/` | `ClickUp_apps` → `brain-config/specs/` | Michael, after the write: *"That was the dumbest place to have put that document. We literally have a URITP docs tree."* **Coordinate was stated correctly at open, then the subject moved and it did not.** Moved same hour; old path tombstoned. |
| 2026-08-07 | (memory, 3 days stale) | `uritp-docs/courses/` | `uritp-doc-archive/02-courses/` | Milo, during a sweep. **The dead name READ SUCCESSFULLY via GitHub's rename redirect** — caught only because a remembered path prefix was missing. |

Append every recurrence. **A gate with an empty log is a gate nobody is testing.**
