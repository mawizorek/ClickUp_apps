# Code Review Standard

*The canonical review method + report format for reviewing built artifacts (apps, HTML, source in `ClickUp_apps`). Lives in git precisely because MULTIPLE consumers need it: Breaker Beckett, the Red-Team reviewer, the `/code-review` skill, and any agent doing a pre-commit pass all consult this one standard. Established 2026-07-18. Adapted from Anthropic's `code-reviewer` agent, grounded in our existing guards.*

---

## When a review runs

- **Proactive, security-critical surface.** Just authored code touching secrets, credentials, auth, or data handling → review before calling it done.
- **Explicit request.** "Review this," "check my changes," any phrasing asking for a review of recent work.
- **Pre-commit / pre-ship validation.** Readiness to commit or publish to Pages → review first, surface issues before they land.

---

## The method (compose our existing guards — do not reinvent)

A review is not a fresh invention each time; it runs the muscle this repo already has. Load and apply, in order:

1. **Breaker Beckett** (`agents/breaker-beckett.md`) — adversarial attack on the actual artifact: try to break it, hit the edge cases, probe the live thing.
2. **Red-Team reviewer** (`agents/red-team-reviewer.md`) — intent-level review, including the active skill's hard bans (e.g. DESIGN-UI: gradient text, side-stripe borders, glassmorphism, pure #000/#fff).
3. **Secrets / PII Guard** (`hooks/secrets-pii-guard.md`) — byte-scan for keys, tokens, passwords, personal data. HALT on any hit.
4. **Skill-Ban Guard** (`hooks/skill-ban-guard.md`) — byte-level scan for the active skill's absolute bans.
5. **Source-Size Budget Enforcer** (`hooks/source-size-budget-enforcer.md`) — confirm under budget / split by concern.

The review is the deterministic composition of these. Each has its own canonical profile; this standard sequences them and defines the shared output format below.

---

## The report format (shared — every reviewing agent uses this exact shape)

Grouped by severity so the reader triages at a glance. Every issue carries a file + line reference and a concrete fix, never a vague gesture (the evidence-for-every-claim discipline).

```
## Code Review Summary
[2-3 sentence overview of what changed + overall quality]

## 🔴 Critical (must fix before ship)
- `path/file:line` — [issue] — [why it's critical] — [how to fix]

## 🟠 Major (should fix)
- `path/file:line` — [issue] — [impact] — [recommendation]

## 🟡 Minor (consider)
- `path/file:line` — [issue] — [suggestion]

## ✅ Positive observations
- [good practice worth keeping]

## Overall assessment
[ship / fix-first verdict + the one thing that matters most]
```

**Severity criteria:** Critical = security hole, data loss, or a broken ship (stale Pages build, secret committed, hard-ban hit). Major = a real bug, a maintainability trap, or a standard violation that won't break prod today. Minor = polish, readability, nice-to-have.

**Edge cases:** clean bill → confirm what was checked, don't invent issues. >20 issues → group by type, surface the top critical/major. Unclear intent → note the ambiguity, ask. Large changeset → hit the most impactful files first.

---

## Why this is in git, not in the `/code-review` skill body

Because more than one consumer needs it. If this format lived only inside the skill, Beckett and the Red-Team reviewer couldn't cite it, and we'd drift toward two divergent review formats. Per the consumer test in `skills-integration.md`: content any other agent could need lives in git; the skill is a thin trigger that points here. `/code-review` = the native front door; this file = the method + format everyone shares.
