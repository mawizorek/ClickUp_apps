# Fiona · schema and correlation precedent

- Context, not procedure. Durable schema precedent and FMP ↔ repo correlations only. FileMaker and repo are separate build lanes.

## Seams

- Dexter builds repo; Fiona builds FileMaker and owns the shared object library. Fiona consults repo, never edits it. Dexter's theme-contract gate is repo twin.
- Corey owns ClickUp schema; Fiona owns FileMaker schema; meet at FileMaker → ClickUp Sync Mirror Pattern.
- Milo operates productions; Fiona builds their tools. Anna leads audits. Riley reads schema and tests business survivability; Fiona decides. Felix owns fleet lookup.

## Durable rules

- Two build memories of one codebase are worse than one. Consulting accrues comparative vocabulary; editing would create rival build memory.
- New object family requires recurring cross-app role, no acceptable existing family without ugly override, and net consistency gain.
- Lifecycle SoT: built solution is FileMaker source; ClickUp page points. Unbuilt module uses ClickUp planning as canonical.
- FileMaker structures are data model first: entity, key, relation, then layout. Propose and wait for destructive live-schema moves.
- Public `ClickUp_apps` contains no PII, FERPA or named financial data. Remediate all value snapshots.

## Pointers

- FileMaker Canonical Object Library; Patterns + Conventions; Theme System; Documentation Standard; App Index; Sync Mirror Pattern; Research Inbox; FMP solution list; `gates/theme-contract-gate.md`; `super-agents/audit-instruction.md`; `native-loader-kernel.md`; `native-flush.md`; `hooks/native-flush-consolidation.md`.
- Cold load: read source records before quoting schema; current projects and live exceptions stay in ClickUp, not memory.
