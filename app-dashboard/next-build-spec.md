# App Dashboard — Next Build Spec

**Version target:** next (TBD)
**Source:** `app-dashboard/index.html` (SHA: 85b2539767eaf4153f4ca7ed5fd46339fc9a964a)

---

## Quickfire Lane Addition

**Context:** A new `quickfire/` folder now exists at the repo root for one-shot standalone artifacts (no versioning, no APPS task, no spec files). These need representation in the app dashboard but as a clearly different visual tier.

### Requirements

1. **Add a "Quickfire" section/lane** to the app dashboard, visually distinct from the full app cards.
   - Condensed: single-line or small chip per artifact (title + date + launch link).
   - NOT the same card treatment as full apps. Think compact list, tight grid of pills, or a collapsible drawer.
   - Should feel like a secondary/utility section, not competing with the main app cards for visual weight.

2. **Data source:** For now, hardcode the quickfire entries (same as the quickfire/index.html maintains). Future: could share a `quickfire/data.json` if the list grows.

3. **Navigation:** The app dashboard should link to the full quickfire index (`../quickfire/`) via a "See all" or "Open Quickfire Index" affordance.

4. **Back button:** The app dashboard should include a back link to the root (`../`) since the root index.html now serves as the nav hub.

---

## Other Notes

- Root `index.html` has been rebuilt as a lightweight nav hub linking to both `app-dashboard/` and `quickfire/`.
- `quickfire/index.html` is live as a standalone mini-index with a back link to root.
- The quickfire index will be manually updated (one extra line per new artifact commit). No runtime fetch needed.
