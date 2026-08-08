# 🗂️ Documentation Dave — activity log

LIVE STATE. Newest at the top. Read this before assuming anything about what Dave has done.

---

## 2026-08-08 · SECOND SESSION · the diff as the style guide (no stamp taken)

Seated at the very end of the Production MAWster schema session
([task](https://app.clickup.com/t/86ajy1neb)) — Michael named me alongside Fiona and Dexter:
*"you and DEX should review the pushes i made during this session and see what I EDITED from
what you made to begin getting a sense of how to write better."*

**⭐ The method is the finding, and it is mine to keep.** Eleven table docs and six prose pages
were drafted by agents and then rewritten IN PLACE by Michael, five times, mid-session.
**Reading that diff produced eight concrete conventions in one pass** — and Ledger B2 already
says he names benchmarks by pointing at an artifact rather than describing a preference. **So
the diff is a better source than any interview would have been.** Filed as B3–B12.

**What the diff said, in one line each:** folder numbers go in TENS not units · **the first tsv
column is a CONFIRMATION STATE (`{.conf}`), not a sort ordinal** · field names carry a
lowercase type prefix (`date_`, `bool_`, `cu`) · the tsv mirrors FMP's own field dialog column
for column · case distinguishes the pair (`PRODUCTIONS.tsv` / `productions.md`) · sections are
bare singular rows closed by `- EOF -` · audit fields are spelled out rather than pointed at ·
a field name states the concept, never the format (`PDF_Path` → `ExportPath`).

🔴 **The biggest single miss was B4.** Agents read the first column as sort order and wrote
`1, 2, 3…`; it is actually *"has this field been confirmed against the live build."* **A `.tsv`
in this tree is a build tracker, not a static list** — which changes what the document is FOR,
not merely how it looks. Shape carrying meaning is exactly my lane and I would have missed it
too if I had only been handed the finished files.

🔴 **And one near-miss was an agent's, not his: B11.** Dexter invented `README.md` to hold
relocated rationale while `publish-dl.md` — Michael's own convention for the same job — already
sat in that directory. Caught pre-merge. **`<file>-dl.md` is the house suffix. List the
directory before creating a rationale file.**

**No stamp was taken and that is correct.** Michael asked for a READ, not a ship, and I was
seated after the merges rather than last-before-them. **Per instruction 1, stamping after
someone else has written is void** — so this session produced ledger entries only.

⚠️ **`apps/production-mawster/data-standards.md` is provably STALE against B5**: it documents
`calc_`, `g_` and `fk` while his live practice adds `date_`, `bool_` and `cu`. Reported, not
fixed — the content is Fiona's domain.

**Owed:** D3 — whether B3–B10 belong in a person's memory at all, or get promoted to an FMP
app-doc standard. **Placement is Maggie's call. Not self-authorized.**

---

## 2026-08-05 · BUILT

Bundle created. Graduated from an `inventory-only` Agent Index row. Five files, standard
shape. Ledger A seeded with 9 conventions; Ledger B holds 2 observed leads; **Ledger C is
empty on purpose** and stays empty until a failure RECURS.

---

## 2026-08-04/05 · FIRST SESSION (ran with no configuration)

Seated by Michael on the THTR 120 PM guide session. **No bundle existed** — he ran off his
Agent Index lane description alone, which was flagged rather than hidden.

**What he did:**
- Caught that Audit Anna's sparseness constraint was written as a byte diff and would have
  passed green forever on a wrong file. Anna corrected her own test in the next loop.
- Adopted Polly's two-artifact stamp and Cleo's commit-as-stamp; refused a frontmatter key.
- Ran a 6-item checklist on `pm-thtr120.md`; **reported item 5 as `N/A — no steps present`
  rather than a pass.**
- Re-checked item 4 against HEAD after it passed, because Beckett had predicted failure and
  a surprising pass deserves a second read. Still passed; recorded both halves.
- Found 2 defects and fixed them (template not obeying its own `keywords` rule; no
  provenance on either file).
- Reported 1 finding unfixed (template grew 84% while its ask shrank).
- 🔴 **Caught at ship time, after the whole council missed it for three loops: the standing
  squash-merge would have destroyed the stamp mechanism.** Merged with history preserved.

**Artifacts:** uritp-doc-archive PR #41, merge `faa3a8b`, stamp commit `a7b3b78`.

⚠️ His build note said he was blocked on *"enough exemplars to define the shape."* This
session produced the exemplar and the checklist simultaneously, which is why the block
cleared in one night rather than over months.
