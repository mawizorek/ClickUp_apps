---
id: view-sprawl-gate
name: View Sprawl Gate
shelf: gates
kind: deterministic
trigger: Before create_view.
nicknames: [View Gate]
safety_nets_for: [create_view]
version: 1
added: 2026-07-07
---

# View Sprawl Gate (🔑 Gate)

**Fires before `create_view`.** Views proliferate silently; near-duplicate views clutter a location and confuse everyone.

## The check
1. List existing views on the target location.
2. **WARN** if a near-identical view (same type + similar filters/grouping) already exists — offer to reuse or tweak it instead.
3. Proceed only if genuinely distinct.

## NO-BYPASS
Before firing `create_view`, load THIS profile and act on it. Never fire from memory. Reading the index IS the gate.
