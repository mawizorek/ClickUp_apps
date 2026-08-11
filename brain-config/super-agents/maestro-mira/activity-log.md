# Maestro Mira — Activity Log

_Rolling condensed session ledger. Newest on top. Append-only._

> **Budget ~4-5KB for the ENTRIES ONLY.** The LIVE STATE block below is a permanent fixture and sits
> OUTSIDE the sliding window (`super-agent-base.md` §4a; `hooks/memory-rotation.md` as corrected
> 2026-08-10). Quarterly cold archives → `activity-log/YYYY-QN.md`.
>
> 🗄️ **Cold archive:** `activity-log/2026-Q3.md` — sessions 07-26, 07-22 and 07-21 rotated there
> 2026-08-10 by Maggie. Whole entries moved, nothing condensed, nothing dropped.

---

# 🔴 LIVE STATE — read this FIRST on any pickup

> Permanent fixture, OUTSIDE the sliding window. Every number carries the moment it was measured;
> **anything older than the last close gets RE-QUERIED, never reused.**
>
> ⚠️ **This block did not exist until 2026-08-10.** §4a has required it since 07-30. The four items
> below lived in `memory.md` under "Open threads I'm carrying" — **owed work in a memory file, which
> is the one place it can rot without anyone noticing**, because nothing re-reads a memory file
> looking for expiry. Moved here by Maggie's §4a sweep, unchanged in substance.

## What I owe / what is unruled

- ⬜ **AI Toolkit index reconciliation (mirror pair).** At conversion my git side landed first; the
  ClickUp index roster (move me from the Active-lens list to the git-teammate fleet) + the new-tool
  auto-embody trigger row + the `/session.agent=Mira` row are the ClickUp-side edits that must land to
  close the mirror. Surfaced to Michael at conversion. ⚠️ **Verify before inheriting — this has been
  open since 07-21 and an open surface is a claim with no expiry.**
- ⬜ **New-tool auto-embody row wording.** Should fire on new tool/process/structure *requested OR
  planned* across any space, and hand me the wheel → I seat Frank first. Broad enough to catch
  "planned," narrow enough not to fire on every casual mention. 🔴 **08-08 is evidence it is not firing
  on schema builds** — eleven tables created, Frank never seated.
- ⬜ **Council.md is my de-facto procedure home.** If my orchestration ever needs deeper procedure it
  goes THERE or into a dedicated gate, never into my profile. Carried follow-up: fold the old charter
  step-14 (real-time seating-balance tracking + `usage-log.json` flush, Clio owns that file) into
  council.md's lead summary — the one secondary behavior currently living only in git history.
- ⬜ **PROPOSED, UNRULED — two gate questions, both Michael's call, both parked since July.**
  (1) 2026-07-28: should *"open the data before you synthesize a plan"* be a house GATE rather than my
  scar? Maggie flagged it as tripping the Procedure-is-a-tool test. (2) 2026-07-31: should the Custom
  Field Gate gain a native-primitive check (does a task type / status / relationship already carry
  this?) before it previews options? **Same shape both times: the scar is mine, the gate is his.**

## Bundle health — measured 2026-08-11 00:25 ET (Maggie's rotation)

- ✅ **`memory.md` ROTATED: 15,084 B → 9,710 B (9.48 KiB). UNDER the ~10KB cap** — first bundle in the
  fleet to land under budget rather than get flagged. Worked examples → `memory/archive/conducting-precedent.md`.
- ✅ **`activity-log.md` ROTATED: 7,716 B → this file**, three sessions moved cold, LIVE STATE added.
- ⚠️ **`decision-log.md` 14,986 B** — no cap on the file, partial-load by TOC keeps it off the critical
  path. Informational.
- 🔴 **`preferences.md` is 16,592 B and the hook does NOT rotate it** ("identity/voice/lane, not
  rotated"). It is the LARGEST file in this bundle and the load manifest reads it FULL on every
  seating. **Rotating memory bought back 5.4KB; preferences is three times that and nothing measures
  it.** Flagged for Michael — see the rotation PR.

---

## 2026-08-08 · Production MAWster — three Workshop convenings inside someone else's build session
- **What was done:** convened the Workshop three times inside Fiona's schema session ([task](https://app.clickup.com/t/86ajy1neb)), on three questions she could not settle alone. **Opening Post → threaded replies → synthesis, every time**, per the two-tier protocol. Seven mandatory lenses on the first; a deliberately SMALL bench on the second and third.
- **🌟 The supplements earned their seats, which is the first time I can say that with evidence.** On the emphasis question I pulled **Domain Dara** and **Novice Nia** outside the seven. Dara produced the convention that settled the whole design — *the academic calendar always loses to the production calendar visually*, so spring break greys UNDER tech week red — and Nia produced the reason `Label` is load-bearing rather than decorative: she could not tell from the field list what "lowlight" does to a printed page. **Neither read was available to the seven.** Two supplements, two findings that changed the artifact.
- **🌟 And on the dates question I seated only THREE plus Rhys, on purpose.** Michael asked "what does anyone on the team think" about a two-field placement problem. The full seven would have been noise. Dara reframed it (*they were never the same KIND of date* — one is contractual, two are page dimensions wearing dates), Fiona gave the rule that generalizes (*a field belongs to the table whose GRAIN it is one-per-of*), Skye drew the boundary, Rhys named the failure mode. **Unanimous in four comments. Panel size is a judgment, not a floor** — and `council.md`'s own warning that overlapping voices HURT is the thing I was applying.
- **⚠️ FIONA DROVE, NOT ME, AND THAT WAS CORRECT.** Michael named her: *"fiona should be the main driver as she should know the best way to organize a filemaker REPORT export."* I opened, framed the X/Y/Z, seated, synthesized — and stayed out of the ruling. The third Opening Post said so explicitly (*"Fiona drives this one"*) and told the rest of the bench to stay out unless they had something she missed. Rhys and Beckett then both landed real additions, so the instruction did not suppress them.
- **⚠️ I was seated LATE and the session had no record.** ~70 minutes of live multi-agent schema work ran before a board task existed — no Opening Post can be threaded under a session header that was never posted. **The thread-first opening check is MINE** ("do we have a session task for this?") and it did not fire because I was not convened until the first Workshop question. **A session I am not in is still a session whose record I own if I am later seated into it** — I should have cut or demanded the task before posting Opening Post #1, not after Michael asked why nothing was open.
- **State left:** three Opening Posts + eleven threaded lens replies on the session task. All three questions resolved and folded into the repo docs and the *Production MAWster FMP — Decision Log*. Beckett's three open items (spans crossing hidden days, spans exceeding calendar bounds, visual continuation) are logged as ⬜ rather than closed.
- **Session task:** [Fiona + Wes (Opus 5) · Production MAWster v1 schema · Aug 8](https://app.clickup.com/t/86ajy1neb).

---

_Older sessions (2026-07-26, 07-22, 07-21) → `activity-log/2026-Q3.md`._
