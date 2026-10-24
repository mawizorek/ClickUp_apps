# Throughline — Next Build Spec

One spec at a time. Current: Infrastructure Screen.

---

## Infrastructure Screen

**Goal:** give venue infrastructure (tie lines, data ports, power circuits, DMX home runs) the same first-class grid treatment that Units already has. Today infrastructure lives in the generic Tables editor: a flat list of labels with no filtering, no type color coding, and no connection context. Before doing any bulk import (190 SPAC data ports are waiting), the app needs a real surface for this data.

**Why now:** Michael's SPAC Data Ports inventory in ClickUp has 190 ports ready to import (D1-D108, LX Net 1-52, Audio Control Net, Dante Primary, Campus Net, rack jacks). The generic Tables view can't absorb that volume usefully. And even the 7 infrastructure rows already in D1 don't show their connection context: which units are plugged into each tie line.

### Route

`#infra` — new nav item between "Tables" and "Access".

Files:
- New: `screens/infra.js` (~300 lines, mirrors units.js patterns)
- Edit: `index.html` (add nav item + script tag)
- No worker changes. No schema changes. All data already exists in the `infrastructure` table.

### Grid Layout

Same `sig-table` / `sig-row` / `sig-cell` system as Units. Columns:

| Column | Key | Width | Notes |
|--------|-----|-------|-------|
| Label | `label` | 120px | Primary identifier. D86, A12, LX-1, etc. |
| Type | `type` | 110px | Color coded. See palette below. |
| End A | `endpoint_a` | 160px, flex | Stage/wall end description |
| End B | `endpoint_b` | 160px, flex | Booth/rack end description |
| In Use | `_inuse` | 70px | Computed: shows connection count through this endpoint |
| Notes | `notes` | 160px | Truncated, full on hover |

`_inuse` is a live computed column: count of non-deleted connections where `source_endpoint` or `dest_endpoint` equals this infrastructure row's `endpoint_id`. Shows "—" for 0 and the count for 1+. This is the column that makes the grid actually useful: you can see at a glance which ports are live and which are free.

### Type Colors

Match the signal color pattern established in units.js `SIG_COLORS`.

```
audio tie   #4ade80  (green, matches Analog Audio)
data tie    #22d3ee  (cyan, matches Dante/Ethernet)
power ckt   #fbbf24  (amber, matches AC Power)
DMX home run #60a5fa  (blue, matches DMX 512)
fiber        #c084fc  (purple)
other        #94a3b8  (gray)
```

### Filter Bar

Same `sig-filters` / `sig-group` / `sig-pill` system as Units.

**Row 1 (showbar):**
- Search input (filters by label, endpoint_a, endpoint_b, notes substring)
- "+ New" button (if writable)
- Sync status pill
- Count badge: `N/M infra`

**Row 2 (type filter):**
- ALL pill (default)
- One pill per type present in data (auto-discovered, not hardcoded)
- Color-coded to match the palette above

**Row 3 (usage filter):**
- ALL | In Use | Free
- "In Use" = has at least one connection through its endpoint
- "Free" = zero connections

### Sort

Default: label ascending with numeric awareness (`localeCompare` with `{ numeric: true }`).
Clickable column headers toggle sort, same as Units.

### Detail Panel

Tap a row to open a side panel (same `UI.panel` system). Sections:

**Fields:**
- Label, Type, End A, End B, Notes (same as edit form fields)

**Connections through this port** (computed section):
- Query: all connections where `source_endpoint` or `dest_endpoint` equals this infra's `endpoint_id`
- Each row shows: `source_label → dest_label · signal_type_name`
- Tappable: opens the connection in the edit form
- Empty state: "No connections routed through this port yet."

**Actions:**
- Edit infra (opens edit form)
- + Connection (pre-fills this endpoint as source or dest)

### Quick Add

The "+ New" button opens the standard edit form via `UI.edit('infrastructure', null, { defaults })`. Default venue auto-fills from the first venue (existing behavior in tables.js).

**Sequential label hint:** when opening the form, scan existing labels for the longest common prefix + incrementing number pattern (e.g. "D" + numbers → suggest "D109" if D1-D108 exist). Show as placeholder text in the label field, not auto-filled. User can accept or override.

### Bulk Paste Mode

Button in the filter bar: "Paste Import". Opens a panel with:

1. **Type dropdown** — select the infrastructure type for all pasted rows
2. **Textarea** — paste one label per line (e.g. paste "D1\nD2\nD3..." or tab-separated "D1\tSL Wall 1\tBay C1")
3. **Preview** — parsed rows shown in a mini-table before commit
4. **Create All** button — batch-creates endpoints + infrastructure rows, syncs

Parsing rules:
- One field per line = label only (type from dropdown, endpoints blank)
- Tab-separated = label, end_a, end_b (3 columns)
- Blank lines skipped
- Duplicates flagged (label already exists in infrastructure)

This is the critical feature for the 190-port import. Without it, each port is a separate form open/fill/save cycle.

### Nav Integration

`index.html` changes:

```js
var NAV = [
  { route: "home",   label: "Units" },
  { route: "infra",  label: "Infra" },
  { route: "tables", label: "Tables" },
  { route: "access", label: "Access" },
  { route: "about",  label: "About" }
];
var SCREENS = { home: "units", infra: "infra", tables: "tables", access: "access" };
```

Add script tag: `<script src="./screens/infra.js?v=3"></script>` after units.js.

### Infrastructure on Unit Detail

Also update `screens/units.js` detail panel: in the **Connections** section, when a connection routes through an infrastructure endpoint, show the infrastructure label inline:

```
#502 Blackmagic SDI distribution → #500 FOH Projector  SDI  via D96
```

The "via D96" is resolved by checking if either endpoint of the connection belongs to an infrastructure row (using `UI.epOwner`). This already works in the data model; it's just not displayed.

### Build Plan

1. Create `screens/infra.js` with grid, filters, detail panel, quick-add
2. Add bulk paste panel to infra.js
3. Update `index.html` nav and script tags
4. Update `screens/units.js` connection display to show infra labels
5. Add infrastructure type colors to `styles.css` if needed (may reuse existing classes)

### Build Estimate

`screens/infra.js`: ~300 lines (units.js is ~280, and infra is simpler: no trace, no reports, no show scoping).
Bulk paste panel: ~80 lines additional.
`index.html` changes: 3 lines.
`units.js` infra label: ~5 lines in the connection formatter.

Total new code: ~400 lines. No worker changes. No migrations.

### What This Does NOT Include

- Endpoint FK migration (endpoint_a/endpoint_b → FK refs): separate schema work, parked
- Network screen (similar pattern but for the `networks` table): future, once infra screen proves the pattern
- Map/spatial view of infrastructure: future (requires venue floor plan data)

---

## Completed

### MCP Integration ✓

Shipped in PRs #1023, #1024, #1030. Five tools (read, write, trace, shows, search) live at `/mcp` on the Worker. Connected via ClickUp App Center custom MCP. All tools discovered and working.

### Dept on Units ✓

Shipped in PR #1034. Moved `dept` from `signal_types` to `fixture_types` (class default) and `units` (per-instance override). Migration 0002 deployed.

---

## Future (parked)

Items discussed in the collaboration thread but not yet specced:

- Print menu (PDF export of Input Patch, Output Patch, Equipment Pull, Channel Hookup, Signal Trace)
- Plot view (`#plot`, positions on a plan)
- Label printing (`#labels`, cable + fixture labels)
- Network screen (`#networks`, same grid pattern as infra but for IP/Dante networks)
- Permissions interaction spec (Lux + Michael, in progress separately)
