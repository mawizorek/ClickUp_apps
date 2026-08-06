# Repo Referent Gate

**Status:** LOCKED 2026-08-06 (Michael)
**Class:** hard gate, fires before the FIRST GitHub call of any kind (read or write)
**Owner:** ownerless like the sweeps. Any agent fires it on itself. No persona required.
**Born from:** URITP-5708, 2026-08-06. Michael said "update the thtr course info on the repo" in a session whose entire subject was `uritp-docs`. The agent silently resolved "the repo" to `mawizorek/ClickUp_apps` — the string sitting in loaded memory — then reasoned about FERPA exposure using that repo's PUBLIC visibility attribute. Wrong repo, wrong visibility, applied to a correct student-privacy judgment. No GitHub call was ever made, so nothing was verified, because nothing was read.

---

## THE RULE

> **"The repo" is never resolvable from memory. Ever.**

Before the first GitHub tool call in any session, state the target out loud, in the reply, as a literal string:

```
owner/repo@branch
```

Derive it from the **session subject**, not from what happens to be loaded. If the session subject does not name a repo explicitly, **ASK**. Do not infer. Do not pick the one you already know.

The stated string is the falsifiable artifact. Same shape as the spine line and the orientation stamp: **no stated coordinate = the gate did not fire.**

---

## WHY THE EXISTING SWEEPS MISS THIS

This is the third distinct rot class and neither existing sweep can see it.

| Sweep | Catches | Blind to |
|---|---|---|
| Doc-Rot Sweep | a fact that went STALE | a fact that is currently TRUE |
| Fleet-Fact Sweep | a fact about the wrong PERSON | a fact about the wrong OBJECT |
| **Repo Referent Gate** | a TRUE fact bound to the WRONG REFERENT | — |

`mawizorek/ClickUp_apps` is real. It is public. It is the brain-config home. Every one of those statements passes all six doc-rot tests and the whole fleet-fact ladder. The failure is not the fact. **The failure is that the fact answered a question it was not asked.**

A correct fact retrieved for the wrong referent is indistinguishable from a correct answer, from the inside. That is exactly why it needs a gate and not a check.

---

## THE MECHANISM (name it so you can catch it)

**Substitution, not inference.** The failure is not bad reasoning about which repo. It is the absence of any reasoning at all: a demonstrative ("the repo", "the guides tree", "the index", "our docs") got silently bound to the only candidate in working memory, and the binding step never surfaced as a decision.

The tell is that it feels like recall, not like a choice. A choice would have felt like a choice.

**The bootstrap coordinate is the loaded gun.** `brain-config` lives at `mawizorek/ClickUp_apps` and that string is force-loaded on EVERY response. It is therefore the highest-availability repo token in the entire context, in every session, including sessions that have nothing to do with brain-config. High availability is precisely what makes it the default substitution. **The thing that makes bootstrap work is the thing that makes this fail.**

Read the memory line as a SCOPED fact:

- ✅ "brain-config lives at `mawizorek/ClickUp_apps`."
- 🚫 "the repo is `mawizorek/ClickUp_apps`."

Those are not the same sentence, and only the first one is true.

---

## PROCEDURE

**R1 — NAME IT.** Before the first GitHub call, write `owner/repo@branch` in the reply. Not in reasoning. In the visible text.

**R2 — DERIVE, DON'T RECALL.** The coordinate comes from the session subject: the task, the artifact under discussion, the tree named in the request. If the request says "the guides root tree" and the session is about URITP documentation, the repo is the one that HAS a guides root tree. Verify that it does before believing it.

**R3 — AMBIGUITY IS A STOP.** Two plausible repos, or zero named, means ask. One question costs a sentence. An erroneous commit costs a revert and trust.

**R4 — VISIBILITY IS PER-REPO AND NEVER CACHED.** Never carry public/private, Pages-enabled, or branch-protection status from one repo to another, and never from memory to a decision. If a privacy, secrets, or PII judgment depends on visibility, **verify that specific repo's visibility in that session or say you have not.** A security claim made from a cached attribute is worse than no claim.

**R5 — MULTI-REPO SESSIONS RE-STATE.** If a session touches more than one repo, state the coordinate again at every switch. The most dangerous moment is the second repo, because the first one is now the loaded string.

**R6 — THE GATE COVERS READS TOO.** Reading the wrong repo produces confident answers about a codebase nobody asked about, and those answers become the premise for the next write. The gate is not a commit gate. It is a first-contact gate.

---

## SCOPE

Fires on: any `githubmcp_*` call, any raw/blob/Pages fetch, any statement that asserts what a repo contains, and any claim about a repo's visibility or hosting.

Does NOT fire on: discussion that names no repo and touches no file.

---

## KNOWN REPOS (a disambiguation aid, NOT a resolution shortcut)

⚠️ **Reading this list does not satisfy R1.** You still state the coordinate you derived. This exists to make you notice there is more than one candidate, which is the entire point.

| Repo | What it is |
|---|---|
| `mawizorek/ClickUp_apps` | brain-config + HTML apps. The bootstrap coordinate. **The default substitution — suspect it hardest.** |
| `mawizorek/uritp-docs` | URITP documentation site: guides tree, course info pages, PM guides. |
| `mawizorek/maw-themes` | theme contracts. |
| `mawizorek/doc-render-engine` | doc rendering. |

The table rots. The rule does not. **When the table and the session subject disagree, the session subject wins and the table gets corrected.**

---

## FAILURE LOG

| Date | Said | Meant | Substituted | Caught by |
|---|---|---|---|---|
| 2026-08-06 | "update the thtr course info on the repo" | `uritp-docs` | `ClickUp_apps` | Michael, before any write. Compounded by a FERPA claim built on the wrong repo's visibility. |

Append every recurrence. A gate with an empty log is a gate nobody is testing.
