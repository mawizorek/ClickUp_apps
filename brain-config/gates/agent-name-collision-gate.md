---
id: agent-name-collision-gate
name: Agent Name-Collision Gate
shelf: gates
kind: deterministic
trigger: Before create_new_agent or update_existing_agent (creating or renaming an agent), and before identifying any agent in a report to Michael.
nicknames: [Name Gate, Collision Gate]
safety_nets_for: [create_new_agent, update_existing_agent]
version: 2
added: 2026-07-07
updated: 2026-07-26
---

# Agent Name-Collision Gate (🔑 Gate)

**Fires before creating a new agent or renaming an existing one** — and, as of v2, before you IDENTIFY an agent to Michael in any report. Prevents duplicate/colliding agent identities across the workspace and repo, and prevents identifying an agent by something a human can't read.

## Why this gate exists (Brain's notes)

Born from the **Routine Ricky** incident: an agent was created mid-session, collided with the name/identity single-source-of-truth, and left a multi-entry cleanup trail in open-thread. Agent names (and nicknames) are an identity namespace that spans two surfaces — live ClickUp Super Agents AND the repo roster/sidecars — and nothing was checking across both before minting a new one.

## The check (before create_new_agent / update_existing_agent)

1. **Gather the proposed identity:** formal name + ALL nicknames.
2. **Scan both namespaces:**
   - Live ClickUp Super Agents (`search_agents`).
   - Repo: **`super-agents/roster.json`** `agents[]` (both classes, one flat list) + each `agents/*.md` sidecar's name/nicknames. ~~`registry.json`~~ — **STRUCK 2026-07-26:** retired to a tombstone stub on 07-25 (PR #483). Scanning it would check a July-4 worldview against a live namespace.
3. **Verdict:**
   - **Exact match** (name OR nickname, case-insensitive) = **HALT.** Surface the existing holder + where it lives. Do not create until Michael rules.
   - **Near match** (fuzzy: same first name, one-char off, shared nickname stem) = **WARN + ask.** Show the collision, let Michael decide.
   - **No match** = proceed.
4. **Nicknames count.** The real Ricky mess was a nickname/identity collision, not a formal-name one. Check nicknames with equal weight to formal names.
5. **Read the TOKEN MAP, not just the name field.** `roster.json` → `invocation.tokens` is the layer that actually routes. Two distinct display names sharing a first name is still a collision (the two-Franks case: they coexisted in documentation for three weeks because only one had ever been invoked).
6. **Say it out loud — the dictation test.** Michael reaches for agents by voice. **Homophones and one-vowel gaps are collisions** even when the strings differ (Clio/Cleo, caught 2026-07-25; Dex/Dara, which is why "Dexter" beat "Dex").
7. 🆕 **After a rename, CHECK WHETHER THE SLUG STILL CONTAINS THE FREED TOKEN.** Slugs are immutable and a slug is a legal invocation token, so a rename can free a name at the display layer while the slug quietly keeps it. **Live case: `fmp-frank` is FMP Fiona's slug**, so `/session-start=fmp-frank` contains the exact word the 07-25 rename existed to hand to `foldin-frank`. Sixth instance of this failure family and the first caused by two of our own rules meeting rather than by a naming choice. If the slug still carries the token, write the disambiguation into `roster.json` → `invocation.slug_is_a_token` in the same pass.

## 🔢 NAMES, NEVER NUMBERS (LOCKED 2026-07-26, Michael)

> *"that's not an agent name to me just a string of numbers."*

**Identify every agent by DISPLAY NAME or SLUG. Both are human-readable and both resolve.** A numeric platform ID is not an identity — it is a handle for a machine.

- **Never ask Michael to confirm a value he cannot read.** If you need to know whether something exists, **go look** (`search_agents`, a directory listing, the live doc) and report the NAME. Handing him an opaque ID and asking "does this exist?" outsources your own verification step to the one person who has no way to answer it.
- **Never store a numeric platform ID as a fact in a data file.** It is unreadable, unverifiable at a glance, and it rots SILENTLY when the thing it points at is deleted — with no visible symptom, because a wrong number looks exactly like a right one.
- **Precedent:** three roster rows carried a `retired_native_id` for months. A live check on 2026-07-26 found **no native ClickUp agents in the workspace at all** — every one of those numbers had been pointing at nothing, and the field had generated a standing "Michael must disable this in the UI" queue item for work that did not exist. Field dropped from all three rows; lineage kept in prose ("the native ClickUp agent is gone, verified 07-26").
- **This generalizes past agents:** the same rule applies to task IDs, field IDs, view IDs, and user IDs in anything Michael reads. Link a name, don't paste an identifier.

## Prefs-as-source-of-truth (the Ricky rule)

If the colliding name belongs to a **promoted Super Agent**, the LIVE agent's preferences are canonical, not any archived/parked git profile. Reconcile against the live prefs FIRST before reusing or reviving the name. Never resurrect a name from a stale sidecar without checking the live agent.

## Bound against Agent Invocation Gate (not a duplicate)

- **Agent Invocation Gate** (read-side): stops me confusing an agent name with a real person Michael mentions in conversation.
- **This gate** (write-side): stops me minting a colliding agent name when creating/renaming — and stops me identifying an agent by a number.

Opposite directions, same namespace. Both fire on their own trigger; neither replaces the other.

## Changelog

- **v2 (2026-07-26)** — Added the **NAMES, NEVER NUMBERS** rule (Michael's correction, after Felix asked him to verify `-39958890`). Added check 5 (read the token map), check 6 (the dictation/homophone test), and check 7 (after a rename, check whether the immutable slug still contains the freed token — the `fmp-frank` case). Repointed the namespace scan from ~~`registry.json`~~ to `roster.json`: **the 7th rotted registry pointer found since it was retired on 07-25**, and this one sat in the gate that guards the naming namespace.
- v1 (2026-07-07) — created after the Routine Ricky incident.
