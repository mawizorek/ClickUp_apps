# Decision-Elicitation Gate

**Purpose:** Stop real decisions from getting silently swallowed into chat prose. The instant Brain is about to hand Michael a decision to make, route it to a ClickUp Decision Log (Gold Standard) as a Q-block + banner-pointer INSTEAD of dumping lettered options inline. This is the deterministic firing condition the DL Gold Standard's "auto-create on decision-intent" rule was always missing — the rule existed but was discretionary, so it only fired when Brain happened to notice. This gate makes it zero-discretion.

**Mode:** Always-on (deterministic). Fires BEFORE sending any reply, on the reply's OWN content (a pre-send scan of what Brain is about to say), not on a tool call.

**Trigger:** Brain's drafted reply is about to present Michael with a decision that is HIS to make — options to choose between, a fork to settle, an open question he owns.

**Invocation:** Automatic. Scan the drafted reply before sending; if the fire test passes, reshape the reply (DL + banner) before it goes out.

**Mental model (Clever Cleo):** *a fork owed to Michael is a WRITE to his decision surface — gate it like any other write.* This is the exact mirror of the repo-write guards ("about to commit → run pre-flight"): here it's "about to make Michael choose → route to the DL." Same shape, same determinism.

---

## Fire test (BOTH must be true)

The gate fires only when both hold. This is the load-bearing scope decision (Beckett/Skye/Lena) — aggressive on REAL decisions, never on option-count:

1. **The decision is Michael's to make.** It is irreversible, structural, a preference call, or genuinely ambiguous in a way Brain shouldn't resolve alone.
2. **Brain is about to render it as inline chat options.** The drafted reply contains a choice punted TO Michael (lettered options, "want me to do X or Y," a flagged fork, "your call").

If both true → FIRE. If either false → do not fire.

---

## On fire (the sequence)

1. **Locate or create the item's Decision Log.** The DL belongs to the work item the decision is about (task, doc, app, list, agent, etc.). If one exists, append; if not, create it per the **Decision Logs — Gold Standard** (`doc-page-33`, doc `12cwjm-76253`) Template A. Container-level decision → container log; item-level → that item's log.
2. **Write the fork as a Q-block** (Template B): context line + the question + the options as checkboxes + Notes. Inverted polarity is the Gold Standard's, NOT restated here — the gate points, it does not re-teach.
3. **Lead the chat reply with the banner-pointer** (Gold Standard rule 8): a loud, emoji-prefixed callout whose main content is the DL link. This REPLACES the inline lettered-options dump — do not also paste the options as prose (that's the swallow this gate exists to kill).
4. **On Michael's answer: READBACK first** (Gold Standard rule 9): decode the inverted polarity out loud in chat ("read as: …") before acting or folding into the item descriptor. Then execute + fold the confirmed call into the item's descriptor / the agent's git decision-log, dated.

---

## Blocking carve-out (Risk Rhys)

If the decision is BLOCKING and Michael may not answer immediately, the gate still spins the DL Q-block — but Brain ALSO states a recommended default in chat ("proceeding with X unless you say otherwise on the log") so momentum survives. The gate is about WHERE the decision is captured + surfaced, NOT a hard work-stop. Aggressive on capture, never on freezing the work.

---

## Output

- **Fires:** the item's DL carries a new Q-block; the chat reply is a banner-pointer (+ a recommended default if blocking). No lettered-options dump in chat.
- **Doesn't fire:** reply proceeds normally.

---

## Composes with

- **Decision Logs — Gold Standard** (`doc-page-33`) — owns the FORMAT (Q/J/S blocks, inverted polarity, banner-pointer, readback, auto-create). This gate is the *when-to-fire* enforcement; the Gold Standard is the *what-to-write*. The gate NEVER restates the templates or the polarity rule.
- **`hooks/decision-log.md`** — DIFFERENT LANE. That's the git-file `decision-log.md` convention (decisions recorded in repo markdown, ENTER/DECIDE). This gate is about ClickUp Decision Logs (Michael's answer surface). No overlap; do not conflate.
- **Scoreboard** — a decision swallowed into chat prose (this gate failing to fire when it should have) is itself a scoreable Brain pattern (broke a defined workflow). If caught after the fact, score it + reassert the gate.
- **Session Transcript Gate** — the DL Q-block is a decision surface, distinct from the session-task transcript (deliberation). A fork gets a DL Q-block; per-voice deliberation still lands on the session task.

---

## Exceptions (do NOT fire)

- **Calls Brain is authorized to make itself** — Fold-in Frank verdicts, format/implementation-detail picks, obvious defaults. Brain DECIDES these; if durable, log as a J-block, do NOT punt as a Q-block.
- **Rhetorical or trivial options** — "coffee or tea," "I'll use Python here" (Brain deciding, not asking). Option-count alone never fires the gate (Beckett's banner-blindness break).
- **Michael explicitly asks for inline options** — if he says "just give me the options in chat," honor it (still offer to log the chosen one).

---

## Examples

### Example 1: real fork (FIRES)
Brain is about to reply: "For the tombstone: 2a keep it, 2b delete it, my pick is 2a."
**Both conditions true** (structural call Michael owns + inline options). → FIRE. Spin the item's DL Q-block with the options; reply with the banner-pointer; suppress the inline 2a/2b dump.

### Example 2: Brain's own call (does NOT fire)
Brain is deciding whether to split a file at 12KB. That's an authorized default (Source-Size Enforcer). → Do not punt as a Q. Decide it; if durable, J-block.

### Example 3: blocking fork, Michael away (FIRES + default)
Mid-build, a real fork appears and Michael's offline. → Spin the DL Q-block AND reply "proceeding with X unless you say otherwise on the log." Work continues; the decision is still captured for his ruling.

---

## Changelog

- 2026-07-22: Initial version. Built via a Fold-in Frank + Workshop pass (Frank verdict: FOLD-IN — thin firing gate onto the existing DL Gold-Standard auto-create rule, zero format duplication). Scope locked to "real decision handed to Michael" (both-conditions test), NOT option-count, to avoid banner-blindness (Beckett) while being aggressive in Michael's sense: never silently swallow a real decision into chat prose again. Prompted by Michael after a repeated pattern of option-forks dumped as chat prose instead of routed to a DL. Session task: "Brain (Opus 4.8) · Maestro Mira lens→git-teammate migration + audit loop · Jul 21."
