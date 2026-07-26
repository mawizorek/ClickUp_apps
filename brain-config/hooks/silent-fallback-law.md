# Silent-Fallback Law

**Type:** HOOK (deterministic, fire-always on code review/build)
**Trigger:** About to ship any resilience feature: cache, retry, default, placeholder, fallback, degraded path.
**Created:** 2026-07-26 (Michael directive 2026-07-25; placed by Maggie OMR drain from OMR-20260725-2).
**Steward:** Dev Dexter

---

## The rule

**A fallback that does not announce itself is not graceful degradation, it is a lie.**

Any cache, retry, default, placeholder, or degraded path in ANY app or shared module must surface its own activation in the UI, with an age or a reason where one exists.

---

## Corollary

**Resilience features are the prime suspects.** Every silent-fallback bug found so far was originally added to make something more robust. The code that looks like it helps is the code most likely to lie silently.

---

## Origin (the four instances, 2026-07-25)

1. HTTP cache serving a stale `/catalog`
2. Stylesheet cache defeating a CSS-only fix
3. localStorage fallback quietly serving days-old data with no banner
4. `shared/themes/resolve.js` applying a half-broken theme in total silence (PR #502)

Three of the four cost multiple misdiagnosis rounds each because the code chose to look fine instead of looking broken.

---

## Invocation

This is a build-time standard, not a runtime gate. It fires:
- During code review (any agent reviewing code)
- At build time (when authoring new resilience/caching features)
- When diagnosing a bug whose symptoms are "the page looks fine but the data is wrong"

Michael's framing: "this just isn't reliable or something idk man" (the symptom of a silent fallback doing its job too well).
