---
id: agent-name-collision-gate
name: Agent Name-Collision Gate
shelf: gates
kind: deterministic
trigger: Before create_new_agent or update_existing_agent (creating or renaming an agent).
nicknames: [Name Gate, Collision Gate]
safety_nets_for: [create_new_agent, update_existing_agent]
version: 1
added: 2026-07-07
---

# Agent Name-Collision Gate (🔑 Gate)

**Fires before creating a new agent or renaming an existing one.** Prevents duplicate/colliding agent identities across the workspace and repo.

## Why this gate exists (Brain's notes)

Born from the **Routine Ricky** incident: an agent was created mid-session, collided with the name/identity single-source-of-truth, and left a multi-entry cleanup trail in open-thread. Agent names (and nicknames) are an identity namespace that spans two surfaces — live ClickUp Super Agents AND the repo registry/sidecars — and nothing was checking across both before minting a new one.

## The check (before create_new_agent / update_existing_agent)

1. **Gather the proposed identity:** formal name + ALL nicknames.
2. **Scan both namespaces:**
   - Live ClickUp Super Agents (search_agents).
   - Repo: `registry.json` agents[] + each `agents/*.md` sidecar's name/nicknames.
3. **Verdict:**
   - **Exact match** (name OR nickname, case-insensitive) = **HALT.** Surface the existing holder + where it lives. Do not create until Michael rules.
   - **Near match** (fuzzy: same first name, one-char off, shared nickname stem) = **WARN + ask.** Show the collision, let Michael decide.
   - **No match** = proceed.
4. **Nicknames count.** The real Ricky mess was a nickname/identity collision, not a formal-name one. Check nicknames with equal weight to formal names.

## Prefs-as-source-of-truth (the Ricky rule)

If the colliding name belongs to a **promoted Super Agent**, the LIVE agent's preferences are canonical, not any archived/parked git profile. Reconcile against the live prefs FIRST before reusing or reviving the name. Never resurrect a name from a stale sidecar without checking the live agent.

## Bound against Agent Invocation Gate (not a duplicate)

- **Agent Invocation Gate** (read-side): stops me confusing an agent name with a real person Michael mentions in conversation.
- **This gate** (write-side): stops me minting a colliding agent name when creating/renaming.

Opposite directions, same namespace. Both fire on their own trigger; neither replaces the other.
