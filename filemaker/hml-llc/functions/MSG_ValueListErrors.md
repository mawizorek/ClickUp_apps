# MSG_ValueListErrors

**Signature:** `MSG_ValueListErrors ( token )`

## Purpose

Single source of truth for user-facing validation-error message text. Callers (e.g. `commitRecord`) pass a token and get back the matching human-readable message, so wording lives in exactly one place and matches the field's own custom validation message.

## Parameters

| Param | Type | Notes |
|---|---|---|
| token | text | message key, e.g. `validate_enforce_1_to_1` |

## Returns

Text — the resolved message string for the given token (empty/default if unknown).

## Body

```
// pending capture from the FileMaker file — token → message map.
// Example shape:
// Case (
//   token = "validate_enforce_1_to_1" ; "This value must map 1:1. …" ;
//   ""
// )
```

## Related

- `scripts/utilities/commitRecord.md` (primary caller)

## Changelog

- 2026-07-14: Stub created during docs revamp; body pending capture from the FileMaker file.
