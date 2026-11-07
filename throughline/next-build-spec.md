# Throughline — Next Build Spec

One spec at a time. Current: Print Menu.

---

## Print Menu

**Goal:** turn ThroughLine's four report pills (Units screen) into a Lightwright-style print menu. It lists every paperwork type available for the current show, previews it as printed paper, and prints or exports the checked ones.

### Rulings (Michael, 11-06)

1. Paperwork = records printed in columns, Lightwright visual language. No new UI invention.
2. One paperwork definition per document. Adding a sheet = adding one definition.
3. Patch columns are **never typed by hand**. Wall Port, Dante TX, Destination RX, Feed and any path column are derived from the signal trace. A blank one means the trace is incomplete.
4. Rows with a missing required trace still print, with a write-in line in the blank cell.
5. Export = **PDF** (the paper) or **spreadsheet** (the records). **One-way only:** nothing exported is ever imported back.
6. Print permission = read permission. No new permission.

### Where it lives

- New route `#print` → new `screens/print.js`. `units.js` report pills replaced with one **Print** link to `#print`. Net shrink.
- New `paperwork.js`: the definitions registry (data, not screens).
- `index.html`: nav item + script tags.
- No worker changes. No migrations. Reads only.

### Paperwork definition shape

`{ id, name, dept, columns: [{ key, label, width, mono, required }], rows(showId) → records, sort, groupBy? }`

### Catalogue v1

1. **Input Patch** (Audio): Ch · Source/Purpose · Placement · Mic/DI · Rig · Wall Port · Dante TX · Destination RX.
2. **Output Patch** (Audio): Mix/Out · Purpose · Location · Speaker/Device · Feed · Power · Notes.
3. **Channel Hookup** (Lighting): Chan · Position · U# · Purpose · Type · Dimmer · Address · Color.
4. **Instrument Schedule** (Lighting): same columns, grouped by position, sorted by unit #.
5. **Power Schedule** (Electrics): Circuit · Service · Lands At · Load · Watts.
6. **Video Signal Path** (Video): Source · Route · Destination · Signal.
7. **Network Devices** (Network): Device · Hostname · IP · VLAN · Port, grouped by network.
8. **Equipment Pull** (Production): Qty · Item · Mfr · Category · Total W · Total lb, grouped by dept.

### Traced columns

Downstream walk via existing `UI.trace(unit)` pattern:

- **Wall Port** = first tie_lines hop (`UI.epOwner` → `tie_lines.label`).
- **Destination RX** = terminal control point in the trace.
- **Dante TX** = the network-class (Dante signal type) hop on the path.

Output **Feed** = upstream walk (reverse of trace: `dest_endpoint === ep` → follow `source_endpoint`). Client-side in `paperwork.js`, no worker changes.

### Sheet format

Letter landscape. Header: show title, venue · season · designer, paperwork name, date. Heavy rule under the header, alternate-row shading, group headers when `groupBy` is set. Footer: record count.

### Menu

Paperwork grouped by department. Each row: checkbox · name · record count. Tap a row = preview it. Footer actions: **Print (n)** · **Export PDF** · **Export spreadsheet**.

### Export

- **PDF:** print stylesheet + browser print/save-as-PDF. No PDF library in v1.
- **Spreadsheet:** SpreadsheetML writer (same pattern as `db.js` `downloadXLS`). One workbook, one tab per checked paperwork.

### Done when

- `#print` lists the catalogue for the current show, with empty paperwork disabled.
- Print opens a print-ready window. The spreadsheet exports one tab per checked paperwork.
- `units.js` is smaller than before.
- Existing tests pass.

### Not in this build

Labels · plot view · user-editable column layouts · re-import · a separate print permission.

---

## Completed

### Infrastructure Screen ✓

Shipped in PR #1035. `screens/infra.js` (580 lines): tie lines grid with type/usage filters, detail panel with connections context, bulk paste import. Sequential label hint. NAV updated: Units → Infra → Tables → Access → About.

### MCP Integration ✓

Shipped in PRs #1023, #1024, #1030. Five tools (read, write, trace, shows, search) live at `/mcp` on the Worker. Connected via ClickUp App Center custom MCP. All tools discovered and working.

### Dept on Units ✓

Shipped in PR #1034. Moved `dept` from `signal_types` to `fixture_types` (class default) and `units` (per-instance override). Migration 0002 deployed.

---

## Future (parked)

- Plot view (`#plot`, positions on a plan)
- Label printing (`#labels`, cable + fixture labels)
- Network screen (`#networks`, same grid pattern as infra but for IP/Dante networks)
- Permissions interaction spec (Lux + Michael, in progress separately)
