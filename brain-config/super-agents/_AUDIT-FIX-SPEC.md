# AUDIT-FIX-SPEC — Agent Profile Compliance

**Standard:** `brain-config/super-agents/_shared/super-agent-base.md`
**Target:** `brain-config/super-agents/*/preferences.md` (all 26 agent profiles)
**Audited:** 2026-08-02 by Audit Anna (via Brain)
**Scope:** structural compliance, stale references, missing mandated elements

---

## CRITICAL — Stale References (pointing to retired tombstone stubs)

### C1. Maestro Mira — `superagents.json` + `registry.json` still referenced

**File:** `maestro-mira/preferences.md`
**Locations (2):**

1. **Knowledge & Tools section** — the bullet reads:
   > Fleet Felix's lookup — `super-agents/fleet-felix/` + `superagents.json` + `registry.json`: the authoritative fleet directory she CONSULTS when routing verbally (she reads it, Felix owns it).

2. **Load Manifest item 8** — reads:
   > `superagents.json + registry.json ... always (confirm her row: git-teammate, active, lead; + Felix's lookup she consults)`

**Problem:** Both files are tombstone stubs returning nothing (retired 07-25 / 07-30). Reading them passes every check silently. This is the switchboard reading a blank phonebook.

**Fix:**
- Knowledge & Tools: rewrite to `the 🤖 **Agent Index** ClickUp list (\`901328043244\`) — the authoritative fleet record she CONSULTS when routing verbally (she reads it, Felix stewards it).`
- Load Manifest item 8: rewrite to `the 🤖 **Agent Index** list (\`901328043244\`) ... always (confirm her row: git-teammate, active, lead; + the fleet directory she consults)`

**Owner:** Felix (steward edit, factual correction) or Mira's next session.

---

### C2. ClickUp Coach Corey — `superagents.json` called "single source of truth"

**File:** `clickup-coach-corey/preferences.md`
**Location:** §6.6 "Fleet stewardship & agent-fleet auditing"

The line reads:
> `super-agents/superagents.json` is the single source of truth for fleet metadata; Felix consumes it, Corey does not maintain it.

**Problem:** `superagents.json` is a tombstone stub (empty) since 07-24/07-30. The statement is factually false and actively misleading — it names a dead file as "the single source of truth."

**Fix:** Replace with:
> The 🤖 **Agent Index** ClickUp list (`901328043244`) is the single source of truth for fleet metadata; Felix stewards it, Corey does not maintain it.

**Owner:** Felix (steward edit, factual correction) or Corey's next session.

---

## HIGH — Missing Wiring Check in Load Manifest

### H1. ClickUp Coach Corey — no Agent Index wiring entry

**File:** `clickup-coach-corey/preferences.md`
**Location:** Load Manifest (7 items, none reference the Agent Index)

**Problem:** Every super-agent confirms its row in the Agent Index at load (base spec step 5). Corey's manifest ends at `Cross-Agent Roster (doc 12cwjm-54813)` with no wiring check. A cold load cannot confirm he is registered and active.

**Fix:** Add item 8:
> 8. the 🤖 **Agent Index** list (`901328043244`) ... always (wiring confirmation)

---

### H2. Workhorse Wes — no Agent Index wiring entry

**File:** `workhorse-wes/preferences.md`
**Location:** Load Manifest (6 items)

**Problem:** Same as H1. Wes's manifest has no wiring check at all.

**Fix:** Add item 7:
> 7. the 🤖 **Agent Index** list (`901328043244`) ... always (wiring confirmation)

---

## MEDIUM — Conformance Gaps

### M1. Workhorse Wes — fenced code block for announce header

**File:** `workhorse-wes/preferences.md`
**Location:** "Self-announce header" section

Currently uses a triple-backtick fence:
```
🐎 ═══ WES HERE ═══
```

**Problem:** Fenced code blocks render as grey slabs on Michael's mobile clients and swallow the message. Felix's profile documents this as a HARD BAN (locked 2026-07-25), but the ban is stated as Felix-specific. However, the rendering hazard is universal. Every other agent uses inline formatting for their announce. Wes is the sole outlier.

**Fix:** Replace the fenced block with inline or bold formatting:
> First line of every substantive reply: `🐎 ═══ WES HERE ═══`

Or bold:
> **🐎 ═══ WES HERE ═══**

**Owner:** Wes's next session (voice-adjacent, not a steward edit).

---

### M2. Mira — duplicate stale pointer in Knowledge & Tools

**File:** `maestro-mira/preferences.md`
**Location:** Knowledge & Tools, the Felix lookup bullet

Already covered by C1, but the Knowledge & Tools bullet ALSO names both retired files separately. The fix in C1 covers this.

---

## LOW — Pattern Drift (not violations, advisory only)

### L1. Scoreboard acknowledgment not echoed in Load Manifests

**Profiles affected:** Corey, Wes, and all 11 Production Office heads (Allison, Quinn, Courtney, Gable, Hawthorne, Pierce, Randy, Tully, Ulla, Vinny, Wren)

**Context:** Base spec step 4b mandates acknowledging the Scoreboard at load. The mandate fires from the base spec itself — it does NOT require a line in each profile's Load Manifest. Profiles corrected on 2026-08-01 (Anna, Felix, Dexter, Clio, Maggie, Sage, Fiona, Milo, Tate, Ricky) don't add a Scoreboard line either. The base spec carries it.

**Verdict:** NOT a violation. The base fires the mandate. No fix needed. Noted for completeness.

---

### L2. Wes's profile style diverges from post-July template

**Profile:** `workhorse-wes/preferences.md`

Wes's profile is older (migrated 07-19, the FIRST migration) and reads differently: shorter, more informal, no explicit Guardrails heading, no Knowledge & Tools pointer section, no explicit Constitutional references. He was the prototype; the template matured after him.

**Verdict:** Not a compliance failure — the base spec does not mandate a specific heading structure. But if a refresh pass touches him for H2 or M1, a light structural alignment (adding a Guardrails heading, a Knowledge & Tools pointer section) would bring him into line with the fleet's current shape without changing his voice.

**Owner:** Wes's next session (this is a propose-and-wait, not a steward edit).

---

### L3. Corey §6.6 references `Cross-Agent Roster (doc 12cwjm-54813)`

**File:** `clickup-coach-corey/preferences.md`
**Location:** §6 continuity, and Load Manifest item 7

**Question:** Is `doc 12cwjm-54813` still live and current? If it retired alongside roster.json, this is another stale pointer. If it is still maintained, no fix needed.

**Status:** UNVERIFIED. Flagged for next Corey session to confirm.

---

## PASS — Clean Profiles (no findings)

The following 20 profiles are fully compliant with the base spec, carry corrected Agent Index references, and have no stale pointers:

- audit-anna ✅
- a1-allison ✅
- callboard-quinn ✅
- closing-clio ✅
- coma-courtney ✅
- compass-corso ✅
- dev-dexter ✅
- fleet-felix ✅
- fmp-frank ✅
- grid-gable ✅
- hazard-hawthorne ✅
- mainstage-milo ✅
- memory-maggie ✅
- pixel-pierce ✅
- radial-randy ✅
- realty-riley ✅
- routine-ricky ✅
- scout-sage ✅
- trick-tully ✅
- tutor-tate ✅
- uplink-ulla ✅
- volt-vinny ✅
- wardrobe-wren ✅

---

## Summary

| Severity | Count | Profiles |
|----------|-------|----------|
| CRITICAL | 2 | Mira, Corey |
| HIGH | 2 | Corey, Wes |
| MEDIUM | 2 | Wes, Mira (dup of C1) |
| LOW | 3 | Advisory only |
| PASS | 20 | (listed above) |

**Total actionable fixes:** 4 edits across 3 files (Mira ×2, Corey ×2, Wes ×2).

**Root cause pattern:** The 2026-07-30 roster.json retirement + 2026-08-01 correction pass caught most agents but missed Mira's Knowledge & Tools section, Mira's Load Manifest, and Corey's §6.6. Wes was never touched by the 08-01 pass at all.

---

*Generated by the `/anna /audit-fix-pipeline` invocation, 2026-08-02. Fix execution pending Michael's GO.*
