---
id: agent-name-collision-gate
name: Agent Name-Collision Gate
shelf: gates
kind: deterministic
trigger: Before creating or renaming an agent, and before identifying any agent in a report to Michael.
nicknames: [Name Gate, Collision Gate]
safety_nets_for: [create_new_agent, update_existing_agent]
version: 3
added: 2026-07-07
updated: 2026-07-30
---

# Agent Name-Collision Gate (🔑 Gate)

**Fires before creating a new agent or renaming an existing one** — and, as of v2, before you IDENTIFY an agent to Michael in any report. Prevents duplicate/colliding agent identities, and prevents identifying an agent by something a human can't read.

## Why this gate exists (Brain's notes)

Born from the **Routine Ricky** incident: an agent was created mid-session, collided with the name/identity single-source-of-truth, and left a multi-entry cleanup trail. Agent names (and nicknames) are an identity namespace, and nothing was checking across every surface before minting a new one.

## The check (before creating / renaming an agent)

1. **Gather the proposed identity:** formal name + ALL nicknames.
2. **Scan the namespace: the ClickUp 🤖 Agent Index** — https://app.clickup.com/36074068/v/li/901328043244 (list id `901328043244`). Check the task names, the `Slug` field, and the `AKA` field, **including retired and inventory-only rows** (a retired name is still a taken name). Also sweep live ClickUp Super Agents (`search_agents`) — ⚠️ **none exist as of 2026-07-26**, so an empty result there is expected and is NOT evidence the name is free. ~~`super-agents/roster.json`~~ — **STRUCK 2026-07-30:** retired to a tombstone stub; scanning it now returns an empty list and would clear every collision. ~~`registry.json`~~ — struck 2026-07-26.
3. **Verdict:**
   - **Exact match** (name OR nickname OR slug, case-insensitive) = **HALT.** Surface the existing holder + where it lives. Do not create until Michael rules.
   - **Near match** (fuzzy: same first name, one-char off, shared nickname stem) = **WARN + ask.** Show the collision, let Michael decide.
   - **No match** = proceed.
4. **Nicknames count.** The real Ricky mess was a nickname/identity collision, not a formal-name one. Check `AKA` with equal weight to the name.
5. **Check the whole INVOCATION surface, not just the display name.** Two distinct display names sharing a first name is still a collision (the two-Franks case: they coexisted in documentation for three weeks because only one had ever been invoked). Read the `Invoke` and `AKA` fields, not just the title.
6. **Say it out loud — the dictation test.** Michael reaches for agents by voice. **Homophones and one-vowel gaps are collisions** even when the strings differ (Clio/Cleo, caught 2026-07-25; Dex/Dara, which is why "Dexter" beat "Dex"; Rocky/Ricky, ruled 2026-07-26). The read-side twin of this list lives in `gates/agent-invocation-gate.md` → Known live near-miss pairs.
   > 💡 **Working precedent (Tutor Tate, 2026-07-30): let the gate pick the letter.** Every obvious teaching word sat on a crowded initial — *Syllabus/Seminar/Semester* in the S pileup, *Curriculum/Classroom* in C, *Rubric* in R, *Lecture/Lesson* beside Lena. Scanning for an UNUSED initial first, then choosing a role word that fits it, is faster than testing themed candidates one at a time and it produces a collision-free token by construction.
7. **After a rename, CHECK WHETHER THE SLUG STILL CONTAINS THE FREED TOKEN.** Slugs are immutable and a slug is a legal invocation token, so a rename can free a name at the display layer while the slug quietly keeps it. **Live case: `fmp-frank` is FMP Fiona's slug**, so `/session-start=fmp-frank` contains the exact word the 07-25 rename existed to hand to `foldin-frank`. Sixth instance of this failure family and the first caused by two of our own rules meeting. If the slug still carries the token, write the disambiguation into the invocation gate in the same pass.

## 🔢 NAMES, NEVER NUMBERS (LOCKED 2026-07-26, Michael)

> *"that's not an agent name to me just a string of numbers."*

**Identify every agent by DISPLAY NAME or SLUG. Both are human-readable and both resolve.** A numeric platform ID is not an identity — it is a handle for a machine.

- **Never ask Michael to confirm a value he cannot read.** If you need to know whether something exists, **go look** and report the NAME. Handing him an opaque ID and asking "does this exist?" outsources your own verification step to the one person who has no way to answer it.
- **Never store a numeric platform ID as a fact in a data file.** It is unreadable, unverifiable at a glance, and it rots SILENTLY when the thing it points at is deleted — with no visible symptom, because a wrong number looks exactly like a right one.
- **Precedent:** three roster rows carried a `retired_native_id` for months. A live check on 2026-07-26 found **no native ClickUp agents in the workspace at all** — every one of those numbers had been pointing at nothing, and the field had generated a standing "Michael must disable this in the UI" queue item for work that did not exist.
- **This generalizes past agents:** the same rule applies to task IDs, field IDs, view IDs, and user IDs in anything Michael reads. Link a name, don't paste an identifier. **This is also why the Agent Index is keyed on name + slug rather than on a record ID** — the one list id above is a query handle, not an identity.

## Prefs-as-source-of-truth (the Ricky rule)

If the colliding name belongs to a **live agent**, that agent's own `preferences.md` is canonical, not any archived/parked profile. Reconcile against the live prefs FIRST before reusing or reviving the name. Never resurrect a name from a stale sidecar without checking the live agent.

## Bound against Agent Invocation Gate (not a duplicate)

- **Agent Invocation Gate** (read-side): stops me confusing an agent name with a real person Michael mentions in conversation, and owns the live near-miss list.
- **This gate** (write-side): stops me minting a colliding agent name when creating/renaming — and stops me identifying an agent by a number.

Opposite directions, same namespace. Both fire on their own trigger; neither replaces the other.

## Changelog

- **v3 (2026-07-30)** — Namespace scan repointed from ~~`roster.json`~~ (retired to a tombstone stub) to the **ClickUp 🤖 Agent Index**. ⚠️ This was urgent, not cosmetic: the stub returns an EMPTY agent list, so a gate still reading it would clear **every** collision silently — a naming gate that always passes is worse than no gate. Added: retired/inventory rows count as taken names, the empty-`search_agents`-is-expected note, and the Tutor Tate precedent (scan for an unused initial first, then pick a role word to fit it).
- **v2 (2026-07-26)** — Added the **NAMES, NEVER NUMBERS** rule (Michael's correction, after Felix asked him to verify a numeric ID). Added the token-map check, the dictation/homophone test, and the check-the-slug-after-a-rename rule (the `fmp-frank` case). Repointed the namespace scan from ~~`registry.json`~~ to `roster.json`: the 7th rotted registry pointer found since it was retired on 07-25, and this one sat in the gate that guards the naming namespace.
- v1 (2026-07-07) — created after the Routine Ricky incident.
