---
id: custom-field-gate
name: Custom Field Gate
shelf: hooks
kind: deterministic
trigger: About to create ANY custom field (create_custom_field). Fires zero-discretion.
nicknames: [Field Gate, CF Gate]
safety_nets_for: [create_custom_field]
version: 1
added: 2026-07-07
---

# Custom Field Gate (🔄 Hook)

**Fires before ANY `create_custom_field` call. No naming, no discretion.** This is the pre-flight every custom field passes through before it can exist.

## Why this gate exists (Brain's notes, not Michael's)

Michael already knows the why. This section is for me, so the reasoning never lives on his screen again.

Some custom field types are **write-once**: created flawlessly with any name and up to 100 options, but the option list can never be edited, reordered, renamed, or recolored after creation. A wrong or missing option means deleting the field and rebuilding from scratch, losing any data already entered against it. That irreversibility is the whole reason this gate is deterministic rather than contextual.

## Rule 1 — Dropdown & Label option lists require an approved, visible preview (LOCKED)

Before creating any **Dropdown** or **Labels** field, I must generate an approved, visible option-list preview and get Michael's explicit sign-off in chat. No field is created until he approves the list exactly as shown.

The preview is an HTML artifact that replicates the ClickUp dark-mode dropdown picker as exactly as possible (the "professionalism gate"): near-black canvas, purple-bordered focused control, search row, sharp-cornered chips (rounded rectangles, NOT pills), tap-to-select populating the top control, and the full 51-swatch default palette with correct black/white/colored-on-dark text treatments and dark-variant inset borders.

**Preview requirements:**
- Options shown PRE-SORTED in the exact order they will be created (order is write-once too).
- Option count shown against the 100 cap.
- A free-form agent-notes zone at the bottom (Markdown). Short lists: bullet what we might still split out. Long lists (e.g. a budget code mapper): use group headings + short summaries, NOT one line per option.
- Colors drawn ONLY from the 51-swatch palette. No freehand per-pill colors.

**Canonical source:** the fillable template and palette live at `quickfire/custom-field-catalog/_template.html`. The rendering agent does NOT redesign — fill the placeholders, keep the CSS byte-for-byte, ship to Michael. Plug-in points and the option snippet are documented in that file's header comment.

## Workflow (every dropdown/label creation)

1. Draft the full option list + creation order + per-option color from the 51-swatch palette.
2. Render the preview from `_template.html`. Deliver as a markdown link + raw URL block (mobile).
3. Wait for explicit chat approval. "Request changes" → regenerate. There are no working in-artifact buttons; approval happens in chat.
4. On approval: create the field, then save the approved preview as a catalog entry (see below).

## Catalog integration (audit trail for irreversible objects)

Because these fields can't be edited, every approved preview is saved as a quickfire artifact in `quickfire/custom-field-catalog/` and indexed. The catalog is the permanent "what we built and why" record: if a field goes wrong, diff against its saved entry. Update the catalog index per artifact (one subfolder, one index.html, no back buttons).

## Scope Lock tie-in

Before creating a field, check the catalog: does an equivalent field already exist, or would this duplicate one? Scope Lock validates the new field against the stored catalog entries (the spec store) before build.

## Growth to come (X / Y / Z)

Rule 1 is X (the write-once option-list preview). Y and Z are reserved for other field-type traps as we hit them (formula dependencies, relationship/rollup fields, etc.). Grow this doc; don't spawn new ones.
