# Resources — Smith Theatre (D-017)

> Index for the resource plan. `resources/` is segmented into separate files (tokenization + clean diffs), not one fat page. Each file is prose (the plan); machine-comparable data goes to CSV per S-6.

---

## Capture list (D-017)

Everything Vectorworks manages as a resource **except rendering polish**.

| Resource type | Capture? | Where |
|---|---|---|
| **Symbols** (instruments, scenic, rigging, hardware) | **Yes — the big one** | [`symbols.md`](./symbols.md) + generated `symbols.csv` (reconciliation) |
| **Record formats** | **Yes** | [`records.md`](./records.md) + one `record-<NAME>.csv` per type |
| **Title block border styles** | **Yes** | [`title-blocks.md`](./title-blocks.md) |
| **Line types / weights** | **Yes** | [`../standards/drafting.md`](../standards/drafting.md) |
| **Text & dimension styles** | **Yes** | [`../standards/drafting.md`](../standards/drafting.md) |
| **Hatches / tile fills** | **Yes** | [`hatches.md`](./hatches.md) |
| **Saved views** | **Yes** | [`saved-views.md`](./saved-views.md) |
| **Textures / Renderworks / gradients** | **No** | rendering polish — low doc value for a base file (only exclusion) |

## Format rule (S-6)

Prose plan → Markdown here. Data manifests → comma-CSV, generated from the file and dropped in [`../reconciliation/`](../reconciliation/) (or authored alongside as the plan CSV). The VWX worksheet mirrors the git CSV as a **check**, never the source (S-5).

---

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-012 + D-017.*
