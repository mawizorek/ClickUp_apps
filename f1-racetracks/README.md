# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v5 safe data split in review · footer fix included

**Source of truth:** this repo folder

**ClickUp task:** F1 Racetracks — circuit breakdown app (APPS list)

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | App engine (UI, routing, render logic, styling) | Version bumps only |
| `data.json` | Runtime data manifest / entry point for externalized track data | Weekly / after each race via MCP |
| `source/` | Semantic source scaffold (shell, styles, grouped data, logic) | Maintained with engine changes |
| `next-build-spec.md` | Current build spec for the next version | Overwritten each version cycle |

**What changed in this PR:**

- the live runtime no longer carries the track dataset inline
- `data.json` is now the runtime data entry point
- the footer home-state metadata is corrected to use the actual loaded round count
- podium / pole / winners-history UI are intentionally left for later PRs
