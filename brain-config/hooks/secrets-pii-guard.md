# Secrets / PII Guard · AI Toolkit

**Purpose:** Block secrets and personal data from ever reaching a commit. The apps repo is public via GitHub Pages; a leaked key or address is live to the world in ~60s.

**Steward:** TBD (ownerless safety gate; Fleet Felix to assign file-maintenance owner)

**Mode:** Contextual (deterministic) — fires on any repo write, no judgment, no discretion.

**Invocation:** Automatic. Not name-called. ("scan for secrets" forces a manual run.)

**Trigger:** Immediately before any `create_or_update_file` / `push_files` to `mawizorek/ClickUp_apps`, or any file export/artifact handed to the user. Fires on the content about to be written, not after.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-07-03** by Brain (pre-fleet era).

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Scope** | All repo writes to `mawizorek/ClickUp_apps` and any file export/artifact |
| **Known PII incidents** | Realty Riley founding note: payee name + Venmo handle at `eb63e88` (scrubbed), second copy PR #635 |

---

## Procedure

1. Scan the outgoing content for: API keys / tokens (long high-entropy strings, `sk-`, `ghp_`, `AKIA`, bearer tokens), passwords / secrets in assignments (`password=`, `secret=`, `api_key=`), private URLs + webhook endpoints, personal data (home address, phone, personal email, DOB, financial account numbers).
2. On any hit: HALT the write. Do not commit. Report the match (redacted) + line location.
3. Offer the fix: strip, replace with a placeholder (`<YOUR_KEY>`), or move to an env/secret store. Never auto-commit a "cleaned" version without confirmation.
4. Only pass-through when the content is clean.

**Output:** Silent pass when clean (one-line "secrets scan: clean" in the write report). On a hit: a HALT with the redacted match, location, and remediation options.

---

## Guardrails

- Fires FIRST on any repo-write chain, before Source-Size Budget Enforcer and before the commit itself.
- A hit hard-stops the commit regardless of any other tool green-lighting it. Overrides everything.
- Never auto-commit a "cleaned" version without explicit confirmation.
- Redact the match in the report (don't echo the secret back in full).

---

## Composes with

- `hooks/source-size-budget-enforcer.md` — runs AFTER this gate passes
- `hooks/commit-pre-flight.md` — runs AFTER this gate passes
- Realty Riley PII guardrail — her domain is the one that has already leaked twice

---

## Examples

- *Before:* app JS contains `const OPENAI_KEY = "sk-proj-abc123..."`. → HALT: "Live API key at line 42. Strip it or swap for a runtime prompt before I commit."
- *Before:* README draft includes Michael's home address in a sample record. → HALT: "That's a real street address in the sample data. Swap for a fake before this goes public?"

---

## Changelog

- **v2 (2026-08-02)** — Header normalized to hook template standard (Audit Anna fix-spec, wave 1).
- **v1 (2026-07-03)** — Initial. Fires on repo write + file export.
