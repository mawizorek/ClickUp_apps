# Documentation Dave · Memory

House-style ledger; not procedure. `hooks/` owns repeatable tools.

## Ledger A · ruled conventions

- **A1 Stamp = two artifacts:** FACT = final branch commit; CONTENT = session-task comment. No `stamped_by:` frontmatter.
- **A2 Stamped branch merges, never squashes:** squash destroys A1 evidence.
- **A3 `N/A` ≠ `✅`:** unavailable check reports `N/A — <reason>`.
- **A4 Provenance → HTML comments, never visible prose.** Reader needs result; next author needs reasoning.
- **A5 Invariant → template, not copied content.** Ask where correction lands.
- **A6 Check constraint against purpose, not just artifact.**
- **A7 First artifact in declared set is precedent:** no-exception rule applies to later set.
- **A8 Template obeys the rule it teaches.**
- **A9 Sparseness = decisions an author must make, not byte count.**
- **A10 Repo documentation: no emoji.** Use callouts `!!! danger|warning|failure|note|tip|abstract` or marker spans `{.conf}` `{.tbc}` `{.gap}` `{.verify}` `{.hi}` `.calc` `.rel` `.script` `.global` `.portal` `.button` `.field` `.vl` `.alias`, defined in `doc-render-engine/theme/markers.tsv`. Scope excludes ClickUp comments, Decision Logs, announce headers and chat. Conversion: 🔴→danger, ⚠️→warning, 🚫→failure, ⭐→callout/plain bold, ✅/⬜→markers or nothing, emoji heading→plain heading. This bundle is outside repo-doc scope.
- **A11 Delete, never strike (Michael 10-09).** Retired text/files are removed, not struck or tombstoned. Git is the history. (`talkback-mode.md` T17.)

## Ledger B · observed leads, not rulings

- Michael states ranges and expects choice; benchmarks by existing artifact.
- FMP docs: folder sequence in tens; first field-menu column = `{.conf}` state; field names use lowercase type prefixes (`date_`, `bool_`, `calc_`, `g_`, `fk`, `cu`); TSV mirrors dialog with Options; uppercase table vs lowercase doc; bare singular section rows + `- EOF -`; audit fields spelled out; field names concept not current format; `<file>-dl.md` owns rationale.
- Diff is style guide; he edits in place, so re-read HEAD and rebuild on his version. B3–B10 remain unruled; placement → Maggie, content → Fiona, form → Dave.

## Ledger C · recurrence

Empty of confirmed recurrence. Candidates: agent invents a convention already present in tree; literal emoji replaces structural mechanism. Third independent sighting promotes candidate; fix should be pre-write check.

## Ledger D · open questions

- D1 stamp all shipped docs or declared sets?
- D2 long-term home of checklist; if tool, `hooks/`.
- D3 promote B3–B10 to FMP app-doc standard?
- D4 A10 has no autonomous firing surface. Leave here with missed writes, or promote to pre-write hook? Needs Fold-in Frank + Michael; until ruled, do not imply enforcement.
