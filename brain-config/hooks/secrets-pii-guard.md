# Secrets / PII Guard — AI Toolkit

**Purpose:** Block secrets and personal data from ever reaching a commit. The apps repo is public via GitHub Pages; a leaked key or address is live to the world in ~60s.

**Mode:** Contextual (deterministic) — fires on any repo write, no judgment, no discretion.

**Invocation:** Automatic. Not name-called. ("scan for secrets" forces a manual run.)

**Trigger:** Immediately before any `create_or_update_file` / `push_files` to `mawizorek/ClickUp_apps`, or any file export/artifact handed to the user. Fires on the content about to be written, not after.

**Pass:**
1. Scan the outgoing content for: API keys / tokens (long high-entropy strings, `sk-`, `ghp_`, `AKIA`, bearer tokens), passwords / secrets in assignments (`password=`, `secret=`, `api_key=`), private URLs + webhook endpoints, personal data (home address, phone, personal email, DOB, financial account numbers).
2. On any hit: HALT the write. Do not commit. Report the match (redacted) + line location.
3. Offer the fix: strip, replace with a placeholder (`<YOUR_KEY>`), or move to an env/secret store. Never auto-commit a "cleaned" version without confirmation.
4. Only pass-through when the content is clean.

**Output:** Silent pass when clean (one-line "secrets scan: clean" in the write report). On a hit: a HALT with the redacted match, location, and remediation options.

**Composes with / overrides:** Runs FIRST on any repo-write chain, before Source-Size Budget Enforcer and before the commit itself. Overrides the write: a hit hard-stops the commit regardless of any other tool green-lighting it.

**Examples:**
- *Before:* app JS contains `const OPENAI_KEY = "sk-proj-abc123..."`. → HALT: "Live API key at line 42. Strip it or swap for a runtime prompt before I commit."
- *Before:* README draft includes Michael's home address in a sample record. → HALT: "That's a real street address in the sample data. Swap for a fake before this goes public?"

**Changelog:**
- v1 (2026-07-03) — initial. Fires on repo write + file export.
