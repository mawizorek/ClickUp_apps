# commitRecord — notes

**STATE: BUILT.** Shared cross-app standard helper, captured from the URITP Budget build. The only script in this app verified present in a FileMaker file.

Copy text: [`commitRecord.fmscript`](./commitRecord.fmscript)

---

## When to use it

**Any commit that could fail field validation** — elevated value-list `enforce_1_to_1`, required values, uniqueness. Call this instead of hand-rolling `Commit` + `Get(LastError)` so that both the behavior AND the user-facing message are identical everywhere.

## Why it exists at all

`Get(LastError)` returns a **code** — 507 validate-by-calc, 506 required, 504 unique — and **never the field's own custom validation message.** So the script has to own the message. That is the entire reason this helper is not just two steps inline.

Dialog text comes from the parameterized `MSG_ValueListErrors ( token )` custom function, so wording lives in one place and matches the field's own validation message. `Char(13)` supplies the line breaks.

## `skipValidation`

The deliberate escape hatch for trusted bulk or scripted writes that should bypass field validation. **Use sparingly, only where the data is known-good.** A fixture import is a legitimate case; a user-facing save is not.

## Candidate upgrades

- **Generalize the error branch.** Today it is coupled to `enforce_1_to_1`. Map 507 / 506 / 504 to `MSG_ValueListErrors` tokens so it handles any validation failure.
- **Return JSON `{ ok, errorCode }`** per the house FileMaker JSON contract, so callers can branch on the result. Currently fire-and-handle with no structured return — which is why `txn_Commit` cannot yet distinguish a validation failure from a lock failure through it.
- **Pass the message token in the params** rather than hardcoding `validate_enforce_1_to_1`.

## Relationship to `txn_Commit`

`txn_Commit` calls this for the validation-message contract. Note the seam: **validation errors are not transaction errors.** A 507 means the data is wrong; a lock error means the transaction broke. Until this helper returns structured JSON, `txn_Commit` cannot cleanly tell them apart — that is the strongest argument for the second candidate upgrade above.

## Folder divergence

This sits in `utilities/`, which **does not exist in the documented FMP script tree** (`00_APP` … `zz_DEV_ARCHIVE`). A house-standard helper does not obviously belong in `90_ADMIN` either, since that folder is for one-offs and repair. Flagged for Michael rather than relocated — FMP-internal structure is his to confirm.

## History

- **2026-06-29** — captured from the URITP Budget build as a standard cross-app helper.
- **2026-07-14** — migrated to a repo-native per-script file (docs revamp).
- **2026-07-16** — converted to `.fmscript` dictation form (standard v1.4); prose moved INTO the header as `#` comments, and `commitRecord.md` became a tombstone saying "do not re-add prose here."
- **2026-07-29** — reversed by the copy-target rule: the `.fmscript` is a hand-typed copy target, so narrative moved back out to this sidecar. Amends D-005 rather than overruling it — still one prose home per script, just not inside the thing that gets typed. The old `commitRecord.md` tombstone stays put; this file is `.notes.md` so it does not resurrect it.
