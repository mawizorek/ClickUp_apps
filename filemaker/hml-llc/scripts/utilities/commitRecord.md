# commitRecord

**SCRIPT:** commitRecord · **ROLE:** generic commit + validation-error handler · **App:** hml-llc (shared cross-app helper)

```
CALLED BY:   any script committing a record that could fail field validation
CALLS:       MSG_ValueListErrors ( token )   [custom function]
INPUTS:      $p = Get ( ScriptParameter )  (JSON)
               mode  text  optional  — flag tokens; recognized: skipValidation
GLOBALS IN:  zfile_ValueLISTS::enforce_1_to_1
RETURNS:     (current build: fire-and-handle; returns nothing structured yet)
GLOBALS OUT: none
SIDE EFFECTS: commits the current record; on caught validation error shows the
               parameterized message and reverts the record.
```

## When to use

Any time a script commits a record that could fail field validation (esp. the elevated value-list `enforce_1_to_1` rule, required values, uniqueness). Instead of each script hand-rolling its own `Commit + Get(LastError)` dance, call `commitRecord` so behavior and the user-facing message are identical everywhere.

## Current Build

```
# --- SETUP ---
Set Error Capture [ On ]
Set Variable [ $p ; Value: Get ( ScriptParameter ) ]
Set Variable [ $mode ; Value: JSONGetElement ( $p ; "mode" ) ]

# --- COMMIT ---
If [ PatternCount ( $mode ; "skipValidation" ) ]
    Commit Records/Requests [ Skip data entry validation ; With dialog: Off ]
Else
    Commit Records/Requests [ With dialog: Off ]
    If [ Get ( LastError ) and zfile_ValueLISTS::enforce_1_to_1 = 1 ]
        Show Custom Dialog [ MSG_ValueListErrors ( "validate_enforce_1_to_1" )
            & Char(13) & Char(13) ]
        Revert Record/Request [ With dialog: Off ]
    End If
End If
```

## Design Notes

- **`skipValidation` mode** is the deliberate escape hatch for trusted bulk/scripted writes that should bypass field validation. Use sparingly, only where data is known-good.
- **Message single-sourcing:** dialog text comes from the parameterized `MSG_ValueListErrors ( token )` custom function, so wording lives in one place and matches the field's own validation message. `Char(13)` concatenation produces dialog line breaks.
- **Why it exists:** `Get(LastError)` returns a code (507 = validation-by-calc, 506 = required, 504 = unique) but never the field's custom message, so the script must own the message.

## Candidate Upgrades

- **Generalize the error branch:** today coupled to `zfile_ValueLISTS::enforce_1_to_1`. Broaden to map 507/506/504 → `MSG_ValueListErrors` tokens so it handles any validation failure.
- **Return JSON** (`{ ok, errorCode }`) per the FileMaker JSON contract so callers can branch on the result.
- **Pass the message token in `mode`/params** rather than hardcoding `validate_enforce_1_to_1`.

## Related

- `functions/MSG_ValueListErrors.md`
- Elevated value-list pattern + `enforce_1_to_1`: URITP Budget DOCUMENTATION set (to migrate).
- JSON in/out contract: FileMaker JSON Parameter Helper Functions.

## Changelog

- 2026-06-29: Captured from the URITP Budget build as a standard cross-app helper.
- 2026-07-14: Migrated to repo-native per-script file (docs revamp). Canonical example of the script file format.
