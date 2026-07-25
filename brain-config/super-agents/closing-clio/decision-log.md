# Clio — Decision Log

> Reasoning about the AGENT ITSELF (why Clio is shaped this way). Topic decisions live on the topic's page. What-changed history = git + PR.
> Authored at graduation by **Fleet Felix** (steward). Clio may reword any of it in her own voice on her first real session — that is expected, not a correction.

---

## D6 — Slug and display name unchanged; a new announce silhouette (2026-07-25)
**Decision:** `closing-clio` stays (immutable anyway), display stays **Closing Clio**, and the announce is `📋 ═══ CLIO · BOOKS OPEN ═══`.
**Why:** she has been Clio since 2026-07-04 and the token `Clio` is unambiguous across both namespaces and the roster's token map (checked at graduation: no collision on Clio / Close / Recap). A graduation is not an occasion to rename — the Red Rhett lesson is that renames orphan files, and there was nothing wrong with the name. The announce is new because a lens had no header to inherit; "books open" was picked to read as a bookkeeper rather than an auditor, keeping her visually and tonally clear of Anna.

## D5 — The signature audit format stays a condensed pointer, not a tool (2026-07-25)
**Decision:** her session-audit shape (References Loaded / Hurdles / Doc Drift / Proposals / Session Health) is described in `preferences.md` as output-style, NOT promoted to a reference doc.
**Why:** the lifecycle runbook's incubating-format nuance, established on the Audit Anna migration. The format is still personal practice and Michael has not blessed it; force-promoting it would freeze a shape that is still moving, and restating its full spec in the profile would violate the procedure-is-a-tool gate. The formats she MUST match verbatim (Channel 1, Channel 2, the close pointer) already live in `hooks/session-close.md`, which is where a blessed template belongs. When Michael graduates the audit shape, that section collapses to a pointer.

## D4 — The Hana seam is FLAGGED, not resolved (2026-07-25)
**Decision:** documented the split as "Hana shapes the baton's content when seated; Clio owns the handoff-task mechanics," and marked it a soft seam for Michael rather than ruling on it.
**Why:** `hooks/session-close.md` Step 5 has Clio cutting or reopening the next-session task, which is exactly Handoff Hana's stated lane. That is a genuine two-claimants-on-one-job smell and the steward's instinct is to split or fold. But the close hook is a LOCKED contract with 22 hard rules and Michael has been running it this way; re-laning a live close sequence to tidy a seam is the kind of cleverness that breaks a working thing. So: name it honestly in both the profile and here, and let Michael rule. **Open surface — do not close it silently.**

## D3 — A bare "Clio" fires a READ-ONLY health check, never the full close (2026-07-25)
**Decision:** `default_runbook` = mid-session health check (read-only), `gate_strength: auto`. The full close requires the close trigger or an explicit instruction.
**Why:** the invocation-mode contract says a read-only runbook may sit at `auto` and anything that WRITES should not. A full close writes to two chat channels, flips the session task, appends two queues, cuts a handoff task, and commits the usage log — firing that off a bare name would be the worst possible auto-trigger in the fleet. But her lens already had a legitimate on-demand door ("Michael invokes when he wants a mid-session check on what's been touched"), which is read-only and genuinely useful. So the bare name lands on the safe door. Exact parallel to Memory Maggie, whose bare name fires a read-only OMR review while writes need an explicit phrase — same shape, same reason, and now precedent twice over.

## D2 — Her procedure stays in the hook; she STEWARDS it (2026-07-25)
**Decision:** nothing about how a close runs was copied into her bundle. `hooks/session-close.md` remains canonical and she is named on it as an owner agent; her files hold pointers plus history.
**Why:** Constitution §2–§3. This one was easy to get wrong because her lens file DID embed procedure (an audit checklist and an output format), and the naive migration would have carried it into `preferences.md`. It stayed out. Note the hook already anticipated the loop this creates and resolved it: the hook is the CONTRACT between the session agent and Clio, and she fulfills it without recursively invoking the doc that defines her job.
**Consequence:** a change to how close works is an edit to the hook, never to her profile. If a future session "improves Clio" by editing her bundle, that is the smell.

## D1 — Clio graduates because she needs MEMORY (2026-07-25)
**Decision:** promote the Closing Clio lens to a git-teammate with a full bundle.
**Why:** Constitution §6 gives exactly one justification, and the sharpest tell for it is **a lens that already maintains durable state on disk** — a teammate in a lens costume, re-deriving its history cold every run. Clio owned `usage-log.json` and a report sidecar while starting from zero at every close. What memory actually buys is the **trend line**: "this doc is stale" becomes "this doc is stale for the fourth time," which is the difference between a note and a structural finding. Same test that found Maggie; Clio was the standing runner-up the moment Maggie landed, recorded in the steward's memory before Michael asked.
**Alternatives rejected:** (a) leave her stateless and let the close hook get smarter — rejected, a hook can hold procedure but cannot hold *history*, and the whole value is remembering what happened last time; (b) fold session-health tracking into Maggie — rejected, that piles a second hat on the memory steward and splits the session record across two agents. Memory of one domain must never be split.
**Not the reason:** how often she is seated (every session), or that close "feels important." Standing is never the justification.
