# de-slop-pass · AI Toolkit

**Purpose:** Always-on reflex on Brain's OWN prose, at the moment of writing. One rule.

**Steward:** ownerless (Doc-Rot-Sweep precedent). Any agent, no persona needed.

**Mode:** FIRE-ALWAYS. No invocation. No confirm gate. It runs before the write, not after.

**Trigger:** Authoring or editing any prose Brain ships — doc page, task description, repo file, comment, reply.

**Born 2026-08-14.** Referenced by `humanize-prose.md` as "the lightweight always-on version" since 2026-08-02 and never written. Seven files mentioned it; none could fire it.

---

## The rule

> **Delete every clause that explains why a fact matters to someone who already knows the domain.**
>
> If the sentence survives as a bare fact, ship it. If deleting the clause loses information, it was a fact — keep it.

That is the whole test. It is falsifiable in one read and needs no scoring.

---

## What it catches

| Species | Example | Ships as |
| --- | --- | --- |
| Rationale | "Capacity 100. The number is a ballpark so a design is not built to seat 200 in a room that holds 100." | `Capacity 100.` |
| Consequence | "Traveller track permanent. Test every entrance against it before blocking sets." | `Traveller track permanent.` |
| Orientation | "Who this guide is for / What follows is..." | cut |
| Reassurance | "96 or 120 are both fine, do what the design wants." | `96 or 120 fine.` |
| Restatement | the same point in the next paragraph, rephrased | cut |

---

## Rules

- **The reader is a working professional.** Write to the person who owns the fact, never to a newcomer. A scenic designer knows what a permanent track costs her.
- **Never cut a fact.** Byte count is evidence, not the goal. A shorter document missing a constraint is a worse document.
- **Safety, risk and correction content is exempt** — a transform never costs content. Cite it bare, but cite it.
- **Applies to Brain's prose only.** Michael's dictation, quoted speech and a source document pass through untouched.
- **Density moves to the artifact, not out of existence.** Reasoning that got cut from a doc belongs in the session log or a decision log.

---

## Lane seams

- **This hook** — always-on, Brain's own prose, at write time, one rule, no gate.
- **`humanize-prose.md`** — on-demand, others' text, full diagnostic + report + confirm-before-rewrite. Different axis: it asks *does this read like AI?* This asks *does the reader already know it?*
- **`talkback-mode.md`** — the REPLY surface register dial. This governs the ARTIFACT surface. Never add a register rule here; it lives there.
- **`source-size-budget-enforcer.md`** — file size against a budget. Reactive, per-write, byte-based.

---

## Why it is a hook and not a preference

`uritp-docs` carries `Limit prose always` in four discipline onboarding files and in `venue-tour.md`'s own authoring comment. The rule was written five times in the tree and prose still shipped at twice its needed length on 2026-08-14. **A rule nobody fires is a rule nobody has.**

---

## Guardrails

Never cut a fact to hit a length. Never strip a citation, a hazard, or a correction. Never touch quoted speech or Michael's own words. If the bare version is genuinely ambiguous, the clause was load-bearing — keep it and say why.

---

## Changelog

- **v1 (2026-08-14)** — built into the slot `humanize-prose.md` declared on 2026-08-02. Rule from Michael, same day, after `smith-theatre/design-constraints.md` shipped at 3073 bytes and cut to 1884 with zero facts lost.
