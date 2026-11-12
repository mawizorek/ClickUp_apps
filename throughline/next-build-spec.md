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

## Scratch

### Dante Matrix View (spec note, NOT for build yet)

**Source:** Michael, 2026-11-06, Becoming Curious audio session. "That's kind of what I want out of this app ultimately."

**Goal:** a passive, read-only crosspoint grid that looks and reads like Dante Controller, generated entirely from connections already recorded in Throughline. No Dante network access, no hardware writes.

**Axes (same as Dante Controller):**
- Columns: Dante transmit channels, grouped by device. Source rows are control points with `cp_type` "net TX".
- Rows: Dante receive channels, grouped by device. Source rows are control points with `cp_type` "net RX".
- Cell: filled when a connection of type "Dante subscription" joins that TX point to that RX point. Empty cell = free crosspoint.
- Device headers carry hostname, IP, and network (DANTE-1 / DANTE-2) from `network_interfaces`, plus primary/secondary port.

**Passive means:** the grid shows what Throughline says is patched, never what the network says. Because of that, every cell whose connection or endpoint notes contain UNVERIFIED renders hatched, so a documented-but-unchecked patch never looks confirmed.

**Computed flags (no extra data entry):**
- TX channel with no subscribers; RX channel with no source.
- Self-subscription (TX and RX on the same device) badge, since it needs a check in Dante Controller.
- Per-transmitter subscriber count, with a hint at 3 or more subscribers that the flow may be better as multicast, and a note when a small device may run out of flows.
- Devices on the Dante network with no channel-level rows (documented only as a device-to-device "Dante" connection), shown as a collapsed group so the gap is visible.

**Interaction:** tap a cell to open the connection in the detail panel; tap a device header to open the unit with its network rows and trace.

**Data conventions this depends on (not all exist today):**
- One Dante channel = one control point, with `channel_num` filled. Today only some Dante TX points exist, and subscriptions sometimes point at an analog output point instead of a Dante RX point.
- A subscription = one connection, TX control point to RX control point, `connection_type` "Dante subscription", signal `ST-03`.
- Show-scoped, same as Units.

**Out of scope:** writing subscriptions to hardware, live discovery of the network, clocking and latency views, AES67.

**First-use test case:** Becoming Curious. Patch bay Rio house mic transmit channels to the record outputs, theater wireless receivers to the QL5, QLab outputs to the QL5, and QL5 outputs to the Tesira.

### Verification state and open holes (spec note, NOT for build yet)

**Source:** Michael, 2026-11-06, Becoming Curious audio session. He asked for the database to hold a record for a connection that is planned but not yet physically patched or subscribed, so that a cold session can ask "what do we need to look at in the space?" and get a clean answer.

**The problem today:** `connections`, `control_points`, and `units` carry only a free-text `notes` column. Verification state therefore has to live inside prose, and the only way to find open items is a substring search. It works, but it is a convention held together by discipline, it cannot be filtered or sorted, nothing can count it, and nothing stops a row from being silently wrong.

**Interim convention now in use (Becoming Curious, 2026-11-06).** A gap is written into `notes` as a pipe-delimited block starting with a token:

```
HOLE H3 | WHAT: <what is missing> | WHERE: <where to go look> | ASK: <the question to answer> | OWNER: <who>
```

Searching `HOLE H` returns every open gap across tables. H-numbers are per-show and sequential. Rows that have since been answered say RESOLVED or VERIFIED with a date instead. This is the thing the real feature should replace.

**Proposed schema.** Add to `connections`, `control_points`, and `units`:

| Column | Type | Values |
|--------|------|--------|
| `state` | text | `proposed` (a plan, nothing built), `documented` (believed true, from paperwork or a screenshot), `verified` (someone confirmed it in the room, with a date), `broken` (confirmed wrong or failing) |
| `verified_on` | date | set when `state` becomes `verified` |
| `verified_by` | text | who confirmed it |
| `open_question` | text | one sentence: what has to be answered to move this row forward |
| `check_where` | text | the physical or software place to go look |

Default `state` for a new row is `proposed`, so a row cannot quietly claim to be true.

**Why five fields and not one flag:** the useful question is not "is this done," it is "what do I walk over and look at." `open_question` plus `check_where` is what turns a null into a work item. A boolean cannot carry that.

**Surfaces this unlocks:**
- An **Open Holes** report, show-scoped: every row whose `state` is `proposed` or `broken`, grouped by `check_where`, so the list reads as a walk order through the building rather than a pile of records. This is the deliverable Michael actually asked for.
- A state filter row on the Units and Infra grids, same pill pattern as the type filters.
- Hatched cells in the Dante Matrix view keyed off `state` instead of grepping notes for UNVERIFIED.
- Trace output that marks the exact hop where a signal path stops being confirmed, instead of presenting a whole chain as equally solid.
- A per-show readiness count, for example 41 connections, 22 verified, 13 documented, 6 proposed.

**Migration:** one migration adding the five columns, nullable, plus a one-time backfill that parses the existing `HOLE` and `UNVERIFIED` and `VERIFIED` tokens out of `notes` into `state`, `open_question`, and `check_where`, leaving the prose intact. Nothing is destroyed; the notes stay readable.

**Out of scope:** approval workflow, assignment to a person as a task, notifications, and any sync of state back to ClickUp tasks.

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
- Dante Matrix view (`#dante`, passive crosspoint grid from connections; see Scratch above)
- Verification state and Open Holes report (`state` / `open_question` / `check_where` columns; see Scratch above)
- Permissions interaction spec (Lux + Michael, in progress separately)
