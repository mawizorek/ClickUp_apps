# Layouts

**Stubbed this pass (schema-first).** Per Michael's direction, we lock solid SCHEMA + relationships before drawing layouts, so this folder is a placeholder — no per-layout files yet.

## Known layouts (from the ClickUp source doc, not yet documented per-object)

| Layout | Source table | Build state | Purpose |
|---|---|---|---|
| A: ALL PEOPLE | PEOPLE | built | master directory / intake / bulk ops |
| B: STUDENTS | STUDENTS_ext | built | day-to-day student ops, class-year mgmt |
| C: ADULTS | ADULTS_ext | designed, not built | faculty/staff/guest/vendor; contact-sheet prep |

All three share: header bar (nav + actions) · column list body · per-record popovers (Credit/Name, Contact Info, Notes). Chooser card window is a People-owned service for external files.

## Next

Enumerate these as per-object layout files (+ `_index.json`) AFTER the schema is confirmed against the live file and the naming-drift pass runs. No layout work until then.
