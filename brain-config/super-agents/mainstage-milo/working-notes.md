# Mainstage Milo — Working Notes / Revision Log

Per-agent scratch: next spec, in-flight decisions, and a running revision log. Global metadata
lives in `../superagents.json`; the near-1:1 config mirror lives in `preferences.md` (header +
config only, no changelog); formal audit records live in `audits/`.

## 🔴 PENDING FOLD INTO `memory.md` — parked here, NOT dropped (2026-08-10)

⚠️ **Why these are here and not in `memory.md`:** that file is **31.4KB**. The GitHub MCP Operating
Standard locks writes above ~30KB out of `create_or_update_file` (documented corruption, four times
in one session), so pushing the whole blob back to add three bullets is a real risk of losing 31KB
of durable knowledge to save a scroll. **These are hot-memory entries, they belong in `memory.md`,
and they go there in the same pass as the condense Michael already owes it** (the file has carried
its own over-budget flag since ~23KB). Written down rather than deferred silently, per the
most-repeated correction in that file: *advisory output feels like work and leaves no artifact.*

**Seated by Hawthorne, session 2026-08-10 ~23:00, Michael in the room.**

- 🌟 **THE CANONICAL HAZARD GETS STRIPPED (Michael, 2026-08-10):** *"i dont think i mind stripping
  those ratings from the canonical — they are situational and should not be so scripted anyways."*
  A library hazard carries **no `Controls`, no `Probability`, no `Risk Level`, no `Hazard Rating`**.
  This CLOSES the half-measure I would otherwise have proposed: adding an instance object while
  leaving scores on the definition rebuilds the pre-filled-verdict failure behind new architecture.
  Direct extension of the LIBRARY vs INSTANCE rule already in my memory.
- 🌟 **A STANDING ASSESSMENT (scene shop, building, single equipment) IS THE SAME JOIN WITH NO
  FREEZE EVENT.** Michael raised a scene shop RA and his own Q2 marks already left it standing
  (option B: per production **plus** standing ones for permanent conditions). Same shape as a show
  instance — hazard × context, carrying that context's controls and scores — but **it never
  archives**, because the shop is in permanent residence. It re-assesses annually and on change
  (E1.46 §3.4.3/§4.4) instead of freezing at strike. ⚠️ **Do not read a standing assessment's
  missing freeze as an overdue one.** `GENERAL Shop Hazards` (23 rows) is already the library half;
  `Motorized Hoist` has been this species since before anyone declared it. **Third scoping model,
  now declared.**
- 🌟 **POLICIES / PROGRAMS / PRIVILEGES is the house vocabulary and it is MINE to use, not just to
  read** — canonical at `mawizorek/uritp-docs@main` → `safety/index.md`. POLICY = the standard we
  hold ourselves to · PROGRAM = the thing somebody completes and proves (a training is a dressed-up
  program) · PRIVILEGE = authorization to engage an identified hazard, **always carrying a default
  term limit.** 🎯 **A PRIVILEGE IS THE HAZARD LIBRARY VIEWED FROM THE PERSON SIDE — which puts it
  squarely in my half of the Hawthorne seam.** He owns the hazard definition and the assessment; **I
  own who is authorized, the term limits and the completion records, end to end.** They join on the
  hazard. This is the vocabulary that finally makes the training/certification surfaces and the
  hazard library one system instead of two. ✅ Typo pass merged same session (uritp-docs PR #93):
  `privelege` → `privilege` throughout **including the directory name**, which was about to become a
  permanent URL, plus a dead `@general-sfaety-for-all` cross-link.
- ⚠️ **Decision Log status, so a cold session does not re-ask:** Q7 decoded to **D only** (FileMaker
  does nothing yet — fix the species and the ~42 unscored rows in ClickUp first). Q8 answered in
  prose, ranked: **B now** (CU instance tasks + relationship to the library, no new build) · **D as
  the method** (prove on one show) · **C as the endgame** (CU live, FMP holds the frozen final) ·
  **A unresolved and he said so.** 📌 **J9 capturing this is NOT yet written** — the Decision Log
  Gold Standard was not loaded in that session and I will not freehand a DL block.
- 📌 **Big Love still has no assessment home** (Q6 closed to C, deliberately). It stops being
  acceptable the day the scenic package locks. Live script demands on that show: shattered glass
  every performance, ~8 splatted tomatoes on a deck danced on three units later, repeated full-body
  falls.

## Revision log

- **2026-08-10** — Safety RA architecture session (Hawthorne seated). Five entries parked above for
  fold-in; `memory.md` condense pass is now blocking them.
- **2026-07-15** — Declaration folder scaffolded by the Fleet Steward (README pointer + PENDING
  preferences stub + this file). `superagents.json` row wired (declaration_folder set; status
  needs-declaration). Awaiting a verbatim paste of Milo's live config before the first audit.

## Next spec / open threads

- 🔴 **`memory.md` is 31.4KB against a ~10KB target and is now BLOCKING writes to itself.** Condense
  pass owed; nothing culled without Michael. Warm content moves to `memory/archive/`.
- **Blocker for audit:** `preferences.md` needs Milo's live config pasted verbatim (self-mirror or
  Michael paste). The steward can't author another agent's config from outside, so the audit
  cannot run until the real config exists here.
- Confirm with Michael: Milo's exact triggers and profile URL (currently unset in superagents.json),
  and whether his activity-log channel is 12cwjm-56633 (recorded as such from the Creation & Setup
  Checklist doc — mark confirmed once verified).
- Lane (per Cross-Agent Roster): URITP production & operational execution — running-show/production
  ops, INBOX email intake triage, availability & labor scheduling, training/PD routing, resource
  portals & doc/artifact builds, custom-field/subtask upkeep, and maintaining URITP operational SOP
  content. (Authoritative lane text lives in the roster + superagents.json, not here.)
