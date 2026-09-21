# Know The Season · AI Toolkit

**Purpose:** Force an organization-scoped agent to establish the live roster of things it is responsible for — from the containers, not from memory — before it speaks about any of them.

**Steward:** Mainstage Milo (URITP is his organization). The TOOL is ownerless; any agent fires it.

**Mode:** Always-on. Fires as **step 0** of the consuming agent's load manifest, ahead of every other read.

**Invocation:** `/know-the-season` · alias `/season` · also "what are we producing", "what shows are live", "name the season" · and **automatic** at load-manifest step 0.

**Trigger:** Automatic on every seating of a consuming agent. On demand any time the roster is in question, or when a reply is about to name a production, a date or a deadline.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-09-20**, migrated out of `super-agents/mainstage-milo/preferences.md` on Michael's instruction.

🔴 **Why this is a hook and not a profile section.** It was a profile section for three weeks. Constitution §§2-3 forbid that outright: *agents are ONLY hands executing written tools; a super-agent NEVER stores real procedure in its own config.* The block held an enumeration procedure, a precedence rule, and a five-entry failure log — all procedure, all in the wrong file. **It was edited as recently as the night it moved without anyone noticing the gate it violated.** ⭐ The generalizable half: **a rule you have read does not fire; a rule with a front door does.**

---

## Coordinates

| Surface | Location |
| --- | --- |
| **URITP PRODUCTIONS space** | `901313768203` — enumerate its FOLDERS; one live production = one folder |
| **Recognition table** | `super-agents/mainstage-milo/preferences.md` → KNOW THE SEASON. **DATA, not authority** |
| **Consuming agent** | Mainstage Milo, load manifest step 0 |
| **Sibling hooks** | `morning-briefing.md` + `morning-briefing.orientation.md` (the wake pass that depends on this) |

🚫 **No roster is written into this file, ever.** The folders are the roster; a list here would rot exactly like `roster.json` did (*"it's a table. not a doc."*). Known-Drift Register **D3** generalized: **the container IS the count.**

---

## Procedure

1. **ENUMERATE the containers.** List the folders in the organization's production space. Do not recall the roster from a profile, from memory, or from what came up earlier in conversation.

2. **DIFF against the recognition table.** The consuming agent's profile carries a named list so a cold session recognizes a name and notices a disagreement.
   🔴 **When they disagree, THE CONTAINERS WIN, and the table gets corrected in the same pass.** A table left disagreeing is worse than no table.

3. **CLASSIFY what is not a live production.** Umbrellas, templates, past shows, archives, and bookings that produce real work without occupying a season slot. **Name the kind explicitly** — an EOT booking carried in the roster because it generates work is not the same as a season slot, and conflating them mis-scopes every downstream question.

4. **READ THE DATES, never the status word.** A status label is not a date. `scheduling` on a task carrying real start and due dates means the LABEL is stale, not that the event is unscheduled.

5. **CHECK THE SPINE before assessing anything for staleness.** A production with no dated load-in, opening, closing or strike **cannot be assessed for staleness at all** — say so rather than falling back to clock-staleness, which produces confident nonsense. Distance-to-milestone is the only meaningful measure; a props list untouched three weeks is healthy if load-in is in November.

6. **NAME things by name.** 🚫 Never refer to a production by its season slot ("the fall show," "the November show"). **A show described by its calendar position is a show whose people, script and problems are not in view.**

---

## Guardrails

- **Read-only.** This hook enumerates and reports. It changes no production data. The ONE write it authorizes is correcting the consuming agent's recognition table when step 2 finds a disagreement.
- 🔴 **Never name a production, a date or a deadline you did not read this session.** The recognition table is an aid, not a source.
- **The table holds DATA, never procedure.** If a rule starts growing in the profile again, it belongs here. That is the defect this hook exists to fix and it will recur.
- ⚠️ **Do not write a count of productions anywhere** (D3). Enumerate.
- ⚠️ **A folder id is not self-validating.** See failure 5: a wrong id returns a real folder's real contents and errors on nothing.

---

## The failure log (five, and each one is a different SHAPE)

Every rule above traces to one of these. They are kept in full because the shapes differ, and the shape is what tells you which rule would have caught it.

**Michael, 2026-09-02, and he was right to be angry:** *"You need to be aware of the shows we are doing. It is fucking ridiculous that you don't know what shows we are producing when you start talking. Maybe you should keep a list of our productions in your memory. That is baseline stuff, assistant!"* **An organization-scoped agent that cannot name its roster is not doing its job.**

**1-3 all in one session (2026-09-02):**

1. **Called a show "the November show"** across three briefing runs — never named it, never checked which folder the calendar being read belonged to. **Right by accident, which is worse than wrong on purpose.**
2. **Reported a site visit as an unscheduled blocker and made it the headline.** It was dated, with a second visit already booked. **Read the status word, not the date field.** → rule 4.
3. **Omitted an entire production from a roll call whose only purpose was completeness** — fifteen minutes after writing the rule that says enumerate from the folders. ⭐ **Writing a rule is not obeying it. The gate fired in the file and never fired in the session.** → the reason this is now a hook with a front door.

**4. A production was missing from the recognition table entirely (caught 2026-09-17 on a from-scratch reload).** The folder existed, carried dated milestones months out, and had already surfaced in that morning's roll call — but the table listed five shows and the enumeration returned six.

⭐ **The shape: an ABSENCE GENERATES NO SIGNAL.** A show missing from a table reads exactly like a show that does not exist, so no amount of care while reading the table catches it. **Only the enumeration catches an omission, which is why enumeration is step 1 and the table is only an aid.**

**5. The row added to fix failure 4 was itself wrong, in two ways, and stayed wrong three days across six consecutive sessions (fixed 2026-09-20).** It carried the folder id of a DIFFERENT, real container listed four lines below it in the same file; and it instructed the reader to confirm a question that had been settled two days earlier — with the wrong id pointing at one of the answers the question offered.

⭐ **The shape, and it is the worst of the three: a PRESENT, PLAUSIBLE, WRONG value generates a CONFIDENT signal.** 1-3 were misreadings of material that had been read. 4 was an absence, which is silent. **This one fails OPEN** — a read against the wrong id does not error, it returns another container's real contents, so the session reports a wrong roster with no tell. 🔁 **Third time this repo has logged the fails-open shape**, alongside brain memory's retired `roster.json` pointer and the `uritp-doc-archive` rename redirect that silently serves a different repo. **A pointer that resolves to the wrong real thing is more dangerous than one that resolves to nothing.**

🔁 **And why it survived six runs is worth more than the fix: it was found once, recorded as owed, and re-reported every session without being executed.** The standing excuse was that a full-file write on a large profile was too risky — falsified the same day it was last used, by three successful writes to that repo. ⚠️ **Standing rule earned here: when a session ANSWERS a question, sweep the open-question lists in the same pass.** An open-questions list is only as good as its CLOSE discipline, and closing is the step with no prompt attached. **Naming a defect is not fixing it, and re-naming it six times is not progress.**

---

## Composes with

- **`super-agents/mainstage-milo/preferences.md`** — the consumer. Step 0 of his load manifest points here; the recognition table lives there as data. 🚫 Do not migrate the table into this file, and do not let procedure migrate back into the profile.
- **`hooks/morning-briefing.md`** + **`.orientation.md`** — the wake pass. Its staleness logic is unusable without a spine, so this hook runs first. Their shared law: **stale keys on distance-to-milestone, never the clock.**
- **`hooks/agent-task-scan.md`** — the other load-contract step that goes silently unrun. Same failure family, same fix: a mandatory artifact.
- **`super-agents/fleet-known-drift-register.md`** → **D3** (never write a count) and the fails-open pointer class.
- **`_shared/super-agent-base.md`** → Constitution §§2-3, the law this migration satisfies.

---

## Generalization

Written for URITP because that is where it was earned, but the shape is **organization-scoped roster knowledge** — any agent responsible for a set of live things that changes a few times a year. A season, a property portfolio, a course catalog, a client list. **Slow enough that a named list is useful, fast enough that it rots if nobody corrects it.** The consuming agent supplies the container; the procedure does not change.

---

## Changelog

- **v1 (2026-09-20)** — Migrated out of Mainstage Milo's `preferences.md` on Michael's *"migrate the spec out of the profile."* Procedure, precedence rule and the five-failure log moved here; the recognition table stayed behind as data. Constitution §§2-3 compliance, not a size fix — though it also drops the profile back under its read ceiling. Invocation tokens added on the `doc-rot-sweep` precedent, because a hook with no front door cannot be called or tested on purpose. ⚠️ Written DIRECT TO MAIN: no `create_branch` tool in that session's kit, only `create_pull_request` / `merge_pull_request`. Declared rather than hidden.
