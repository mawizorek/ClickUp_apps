# QR Forge — next build spec

**Current: v1.0.** One file per app, overwritten each cycle. Version lives in this
header, never in the filename.

## Scratch intake

- Alphanumeric mode for the minority of payloads that are all uppercase. Saves a
  version sometimes. Low value, real code.
- Batch input from a CSV or TSV paste instead of pipe-delimited lines.
- Logo / centre knockout. Tempting and dangerous: it eats modules and only works
  because ECC covers the hole. Would need the app to compute and show how much
  correction budget the knockout is spending.
- Avery / Dymo label-stock presets for the print sheet.
- Pull the destination straight off a ClickUp task or form view so the label and
  the link come from the same place.

## Next build

### 1. The redirect layer — static codes that can still be repointed

**The problem v1 does not solve.** A static code is permanent in exactly the way
requested, and that is also its one failure mode: the URL is baked in forever, so
if a form link, a report submission endpoint or a task URL ever changes, every
printed copy is dead paper. Third-party dynamic QR fixes this by renting you a
redirect. The fix that does not rent anything: encode a redirect **we** own.

Shape:

- A `r/` tree in this repo, Pages-served, one tiny HTML file per slug that does a
  `<meta http-equiv="refresh">` plus a JS `location.replace`, with the visible
  destination printed on the page in case both fail.
- The QR encodes `https://mawizorek.github.io/ClickUp_apps/r/incident-form`. The
  code never changes. Repointing is a one-line commit to one file.
- A targets table (`r/targets.tsv`: slug, destination, owner, note) is the record.
  Uniform grid, so TSV per the storage gate, and it renders in the repo view.
- QR Forge grows a mode that writes both halves at once: pick or name a slug, it
  produces the code AND the redirect file to commit.

**Open questions for Michael before this is built:**

- Is a GitHub Pages path acceptable as the permanent public face of a printed
  tag, or does this want a real short domain? The Pages URL is long, which costs
  modules, which costs module size at a fixed print width. A custom domain would
  roughly halve the payload.
- Who is allowed to repoint a slug, and does a repoint need a record of what it
  used to be?
- Does a slug ever get retired, and what does the code do afterwards — 404, or a
  page that says what it used to be?

### 2. Theme-spine join

v1 deliberately did not join `shared/themes`. Join it, mindful that
`applyTheme()` takes a JOIN slug and `data-theme` takes a COLOR slug, and that a
blank vector cell applies a half theme in silence. Add the join row first, verify
every cell is filled, then repoint the local tokens.

### 3. `og.png` + `icon.png`

Referenced by the head block and the manifest, not committed. Binaries, so they
go through the GitHub UI. 1200x630 under 300KB and 512x512 under 100KB.

## In review

Nothing.

## Known guardrails

- **The encoder is correctness-critical and hand-written.** Any change to
  `qr-gf.js` or `qr-core.js` runs the self test, and then a real phone scans a
  real printed code. No exceptions, and never "it looks the same."
- **Never swap the encoder for a CDN library.** The entire premise of this app is
  having no third party in the chain.
- **Module size in mm is the number that decides whether a code scans.** Any
  feature that changes symbol size or print dimensions keeps that readout and its
  warnings honest.
- **Do not add an inverted / dark-background code option.** Most scanners require
  dark-on-light. The transparent-background switch already carries a warning; a
  full invert would ship a code that fails in the field.
