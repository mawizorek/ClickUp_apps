# Doc-Rot Sweep

Verify what docs CLAIM against what the repo IS at HEAD. Top target: rotted instructions (a rule decayed into its opposite, still reading as authoritative).

- **Invoke:** `/doc-rot-sweep` · `/rot-sweep` · "run a rot sweep" · "is our documentation still true?" · "check for rotted guardrails". Scoped preferred ("rot sweep brain-config/hooks").
- **Fires also:** a phantom instruction caught in the wild · after a structural collapse · after editing standards · before trusting an unfamiliar standard · **before executing any documented remediation.**
- **Owner:** none; any agent fires. Formal reported pass → Audit Anna. Front door = this file (no ClickUp Skill).
- **Report home:** PR + session task comment.

## Seams

- Recon Renata: repo vs standard (shape). This: standard vs repo (claims). Run both.
- Fleet-Fact Sweep: fleet claims (who owns/ratifies). This sweep can't see a wrong person.
- Audit Anna: leads formal audits; may seat this.
- `code-review-standard.md`: code quality; its severity/evidence format is reused here.

## Pass

0. **Read path:** blob API, re-fetched. Never a raw branch URL. Two reads before claiming anything about a live URL. Truncated read (>~22KB) → stop, say so.
1. **Scope:** name surfaces first, bound it, go deep. Typical: `brain-config/` README, CHANGELOG, team-standard, hooks/, gates/, teams/, orchestration, council, next-build-specs, `VERSIONS.md`, 🤖 Agent Index list (`901328043244`), CONFORMANCE, THEME-SYSTEM, agent profiles + memory, Tool Index list + Signal Routing page.
2. **Classify each claim:** PRESCRIPTIVE (someone will follow it; sweep first) · DESCRIPTIVE · STRUCTURAL ("the source of truth") · POINTER.
3. **Six tests vs HEAD:**
   - A. Phantom remediation: "revert X", "pending", "still broken", TODO → verify the problem still exists.
   - B. Locked-rule contradiction: newer lock + live evidence wins; fix the older.
   - C. Pointers into retired/renamed things.
   - D. Two claimants on one truth → collapse or declare projection.
   - E. Undocumented arithmetic (e.g. ~30KB return cap = ~22KB on disk after base64).
   - F. Size vs editability: hand-maintained canonical file near ~22KB; growth in prose not rows.
4. **Verify both directions** before reporting, including your own prior claims. A dated pending-action note is guilty until proven innocent.
5. **Triage:** 🔴 rotted instruction · 🔴 phantom remediation · 🟠 dueling canonical · 🟠 stale state · 🟡 dangling pointer · 🟡 orphan · ⚪ verified current (always report these).
6. **Fix same pass:**
   - Correct to realized state.
   - **Delete wrong text outright** (talkback T17). No strike-through, no tombstone stub. Git history holds the old version; cite the PR.
   - Retired file → delete it and repoint every pointer in the same PR.
   - Write rejected on stale SHA → re-read HEAD, layer findings on the newer version.
   - Structural calls (collapse surfaces, retire a convention) → flag for Michael.
7. **Report:**

```
## Doc-Rot Sweep · <scope> · <date>
Surfaces read: n · Findings: n (🔴 n / 🟠 n / 🟡 n)
### 🔴 Rotted instructions
- `path` - claims "<quote>" (dated) - HEAD says <reality> - FIXED / FLAGGED
### 🟠 Stale state + dueling canonical
### 🟡 Dangling pointers + orphans
### ⚪ Verified still true
### For Michael (structural)
```

Clean → say what was checked. Never invent findings.

## Tells

Dated warning about pending work · two docs claiming source of truth · read-path/tooling instructions · "do NOT hand-edit X" after X changed · LOCKED dates · "verify on next touch" · file past readable-whole · index growth in prose · same tool written twice same day · a scope list/manifest naming a retired file (empty read looks clean).

## Guardrails

Read-only until confirmed at HEAD · fix docs freely, flag structure · never execute a documented remediation without re-verifying · never "verified" off one cached read.

Changelog: v3 (2026-10-09) compressed to char-cost law; §6 flipped from preserve-struck-through to delete (Michael). Prior history: git.
