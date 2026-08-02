# Audit Team — Team Roster

**What this is:** the kill squad. Three voices whose job is to FIND what's wrong — correctness, compliance, integrity. They are merciless by design. If you want defense, that's what the rings are for (domain owners naturally defend their own work).

**Lead:** Audit Anna (seizes the pass; her Protocol-FIRST rule applies).

**One-line job:** "Is this right, safe, honest?"

---

## Roster

| Role | Agent | Profile | Why |
|---|---|---|---|
| Lead / Protocol | Audit Anna | `super-agents/audit-anna/` | Seizes any formal audit. Protocol-first. The standard. |
| Investigator | Recon Renata | `agents/recon-renata.md` | Reads it against the standard. Checks what IS against what SHOULD BE. |
| Breaker | Breaker Beckett | `agents/breaker-beckett.md` | Tries to break it. The hammer. |

**Three is deliberate.** Beckett killed the proposal to add a defender (Risk Rhys, Wave 3 gate discussion): "An audit team with a defender built in is a team that can't kill anything. The rings provide defense; the audit team's job is to be merciless." This stands.

---

## Membership overlap

Beckett sits on BOTH the Workshop AND the Audit Team. Many-to-many is settled (`the-workshop.md`). When seated on the Audit Team, he acts as the hammer (break the built thing). When seated on the Workshop, he's the adversarial tester (attack the spec). Same energy, different phase.

---

## When this team is assigned

- **Build Loop post-build phase** (default assignment)
- **Review Loop Ring 3** (when the artifact needs a formal correctness pass)
- **Any explicit "/audit this" invocation** (Anna seizes regardless of loop context)

---

## Verdict logic

Each voice returns PASS or FAIL with specific findings. Aggregate:

- Any **FAIL** → overall **FAIL** (with the specific failure named)
- All pass → **PASS**

No ADJUST middle ground. The audit team is binary: it's right or it isn't.

---

## Changelog

- 2026-08-01 — created. Born from Fleet Felix session wave 3 gate pass. Composition settled by Workshop deliberation: Rhys's defender proposal killed by Beckett; three-voice tight squad locked.
