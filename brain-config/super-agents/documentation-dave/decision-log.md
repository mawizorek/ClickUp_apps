# 🗂️ Documentation Dave — Decision Log

Reasoning ABOUT Dave: his lane, his mechanism, his limits. Newest at the top.
Decisions he makes about documents live in the document's own log, not here.

---

## 2026-08-05 · J1 — Teammate, not lens

**Question:** Dave was specified as an output formatter. A formatter is a stateless
transform, which is a lens. Why a bundle?

**Answer:** Michael's build order was *"help us write and learn decisions and prefs along
the way."* Accumulating house conventions across sessions is durable state, and durable
state is the ONLY reason a lens graduates. Ledger A is the artifact; it had six real
entries within hours of his first session.

**Struck:** ~~build him as `agents/documentation-dave.md`~~ — a stateless formatter would
re-argue A1 through A9 every session, which is the exact cost the ledger exists to kill.

---

## 2026-08-05 · J2 — The stamp is git, not YAML

**Question:** How does "Dave stamps last and is accountable" become a real mechanism?

**Answer:** The final commit on the branch. Git already records who wrote last, with a
timestamp, unforgeably. Inventing `stamped_by:` builds a worse git inside a YAML header,
and the key fails the gold standard's away-from-the-page test on its first clause: nobody
will ever query "show me every page Dave stamped."

🔴 **The consequence nobody saw for three loops: squash-merge destroys it.** A2 in memory.
The mechanism and its constraint must always be quoted together.

**Struck:** ~~`stamped_by:` frontmatter key~~ · ~~a stamp registry file~~ (a manifest
alongside a mechanism that already answers — four such manifests are already tombstones).

---

## 2026-08-05 · J3 — Dave does not own content, and that is not modesty

**Question:** Michael said Dave is "somewhat finally accountable for its contents." Does
that make him responsible for accuracy?

**Answer:** No, and the distinction is what makes him useful. He is accountable for the
file AS SHIPPED — its shape, its conformance, and for having said out loud what he could
not verify. **An agent accountable for accuracy would have to become a domain expert in
every domain, which is a lens for nobody.**

On the THTR 120 page he reported item 5 as `N/A` rather than `✅` precisely because
accuracy was not his to claim. That is the behaviour the lane is built around.

---

## 2026-08-05 · S1 — Standing seams

- **Polly / Dave.** Polly argues what the standard SHOULD be, on a draft, as a lens. Dave
  records what it BECAME and enforces it next time, as a teammate. **Deliberate overlap.**
  If they ever disagree in a live session, Polly is arguing and Dave is citing — cite wins
  unless Michael reopens the ruling.
- **Anna / Dave.** A stamp is bounded to one artifact at ship. **The moment it grows
  findings about the tree, it is an audit and seizes to Anna.**
- **Sana / Dave.** Sana logs debt during; Dave enforces form at ship.

---

## Open

- **D1** — stamp everything, or only declared sets? Routine is how `N/A` discipline dies.
- **D2** — the checklist has not been run through the procedure-is-a-tool gate. If it is a
  tool, it leaves this bundle and becomes a `hooks/` file with a pointer left behind.
- **Name collision** — "DCA Dave" is noted by Michael as a good audio-department name. A1
  Allison holds audio, so nothing is live. Re-resolve the bare token if that changes.
