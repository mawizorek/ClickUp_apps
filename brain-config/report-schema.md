# Report Schema

Agents that produce reports (`toggles.makesReports: true`, currently seat `audit`/`close`/`research`: Recon Renata, Closing Clio, Handoff Hana, Scout Sage) emit each report as a **JSON file**, never as stored HTML. The viewer's Reports tab renders the JSON to a formatted view on the fly, and can export a standalone HTML artifact on demand. JSON is the single source of truth; HTML is a generated projection (avoids duplicate-copy drift and the ~30KB write-cap clip).

Sibling to `metadata-schema.md`. Locked 2026-07-04 (validated by Workshop Wes's seven-lens review of the reports feature).

---

## Storage layout

```
brain-config/agents/<slug>/reports/
  index.json            # list of reports, newest-relevant metadata only
  <YYYY-MM-DD-HHMM>.json # one file per report, full body
```

- `<slug>` is the agent's permanent slug (the sidecar `slug`, = folder name). Everything keys off this one slug.
- Report file id = its timestamp, `YYYY-MM-DD-HHMM` (ET). Stable, sortable, collision-safe for hourly-or-coarser cadence.
- An agent with reporting on but none yet written ships an `index.json` of `{ "reports": [] }` so the tab can show the empty state.

---

## `index.json` (the list)

```json
{
  "reports": [
    {
      "id": "2026-07-04-0008",
      "file": "2026-07-04-0008.json",
      "type": "audit",
      "reportType": "Repo Audit",
      "ts": "2026-07-04T00:08:00-04:00",
      "target": "mawizorek/ClickUp_apps @ main",
      "verdictWord": "Structurally solid",
      "verdictPill": "solid",
      "pillText": "2 fixed live",
      "delta": "2 fixed since last"
    }
  ]
}
```

List entries are metadata only, enough to render the list row without fetching every full report. Newest first is the render default (the viewer sorts by `ts` descending regardless of file order).

---

## Shared envelope (every report file, all types)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | matches the filename stem + the index entry |
| `type` | string | `audit` \| `review` \| `research` (the renderer switch) |
| `reportType` | string | human label, e.g. "Repo Audit", "Seven-Lens Review" |
| `ts` | string | ISO 8601 with offset |
| `target` | string | what the report is about (repo@ref, a build, a research question) |
| `verdictWord` | string | short headline verdict, e.g. "Structurally solid" |
| `verdictPill` | string | `solid` \| `adjust` \| `halt` \| `warn` (drives the pill color) |
| `pillText` | string | tiny status text beside the verdict |
| `delta` | string | one-liner vs the previous report ("2 fixed since last", "baseline") |
| `summary` | string | 1-3 sentence plain-language summary at the top of the body |
| `tally` | array | headline counts: `[{ "n": 3, "l": "low open", "c": "low" }]`. `c` = color bucket (`high`\|`med`\|`low`\|`done`). |

---

## Type-specific body

### `type: "audit"` (Recon Renata, Closing Clio)

| Field | Type | Notes |
|-------|------|-------|
| `findings` | array | `{ num, sev, cat, body, fix, fixed? }`. `sev` = `high`\|`med`\|`low`\|`resolved`. `fixed:true` renders struck/greyed. |
| `apps` | array | (audit-of-repo only) `{ name, size, dot, rd, flag? }`. `dot` = `ok`\|`no`\|`na` status dot; `rd` = rendition note. |
| `clean` | array | strings: things that passed with no issue. |

### `type: "review"` (Workshop / brainstorm stress-test)

| Field | Type | Notes |
|-------|------|-------|
| `lenses` | array | `{ name, status, body }`. `status` = `flag`\|`ok`. One entry per lens. |
| `call` | string | the final recommendation / go-no-go line. |

### `type: "research"` (Scout Sage) — schema defined, no reports yet

| Field | Type | Notes |
|-------|------|-------|
| `confidence` | string | `HIGH` \| `MEDIUM` \| `LOW` |
| `answer` | string | 1-3 sentence answer/recommendation |
| `findings` | array | `{ subtopic, items: [{ text, source, url }] }` |
| `sources` | array | `{ n, source, date, relevance }` |
| `gaps` | array | strings: unresolved / needs-follow-up |

---

## Adding a new report type

1. Pick a `type` slug and define its body table here.
2. Add a `<type>Body(report)` renderer in `source/reports.js` and one line in the `reportBody` switch.
3. No viewer-shell or schema-envelope change needed. The envelope + list stay identical; only the body renderer is new.
