# Bench Build Method · AI Toolkit

**Purpose:** The five standing rules for building, wiring and measuring a piece of hardware on a bench. Fires on any adapter, cable, breakout box, small DC circuit or connector-fabrication job, in any domain.

**Steward:** Pinout Pavel (bench electronics). **The tool itself is ownerless** — any agent fires it on a one-off with no persona seated (Doc-Rot-Sweep precedent). A formal reported pass on a finished build IS an audit and SEIZES to Audit Anna.

**Mode:** Fire-always on bench-build intent.

**Invocation:** `/bench-build` · `/bench-method` · or automatically when a build, adapter, pinout, breakout or custom-cable job is on the table.

**Established 2026-10-04**, extracted from Pinout Pavel's build so the rules can fire with nobody seated. Procedure belongs in a tool, never in a profile (`gates/git-agent-authoring.md`).

---

## The five rules

### 1. Measure before you connect
DC first, then AC, then the transformer secondary. **Write the numbers down** in the build's task, not in a chat reply. A build that starts with an assumed voltage is a build that ends with a dead input.

### 2. The device's own datasheet beats the family generic
A pinout that is true for a product line can be wrong for the unit on the bench. 🔴 Founding case, 2026-10-03: the generic Clear-Com XLR-4 pinout says nothing about DC, while the **RS-701 datasheet** puts `0.5 × VCC` on **pin 4, the earphone pin** — the exact pin being tapped. Same shape as the Fleet-Fact Sweep's law: **agreement is not corroboration, go to the ladder.**

### 3. Isolate before you bridge
Transformer or blocking capacitor before anything shared touches anything grounded. ⚠️ Isolation also decides where you are allowed to SUM: summing downstream of the transformers is safe, summing upstream re-creates the shared-common fault the isolation exists to prevent.

### 4. Never prototype on the production system
Bench supply or spare hardware. The first live test is a work call, never a performance. 🔴 A fault injected into a shared system (an intercom partyline, a dimmer circuit, a network) is not a bench mistake, it is a show mistake.

### 5. Every adjustment gets a witness mark, every build gets a task
If a knob is part of the gain structure, mark it. The build's task carries parts, bench sequence, and the measured values — so the next person is not re-deriving what a meter already told us.

---

## Guardrails

- 🚫 **Never assert a pinout from memory.** Cite the document, or measure it.
- 🚫 **Never quote a level, rail voltage or impedance from a neighbouring product.** Per-model or measured.
- ⚠️ **A successful read of a generic spec is not verification of the specific unit.**
- ✅ Buying beats building when the product exists and the price is near the parts cost: check the market before the bench. Every commercial equivalent found gets recorded so the comparison is not re-run cold.
- 🔴 Safety, standards citation and risk-assessment method are **Hazard Hawthorne's**, end to end. This hook builds; it never certifies.
- ⚡ Any build that plugs into house power or a dimmer circuit crosses into **Volt Vinny's** lane at that connection, regardless of who built the box.

---

## Composes with

- `super-agents/pinout-pavel/` — the steward's bundle; his `memory.md` is where measured values and verified pinouts accrue
- `hooks/source-freshness-gate.md` — datasheet provenance (Scout Sage stewards)
- `gates/git-agent-authoring.md` — why these rules live here and not in a profile

---

## Changelog

- **v1 (2026-10-04)** — Established during the Pinout Pavel build. Every rule traces to a specific failure in the 2026-10-03 Pro Intercom com-tap session: an assumed pinout, a quoted level that was wrong at nominal, and a near-miss on grounding a partyline common to a computer chassis.
