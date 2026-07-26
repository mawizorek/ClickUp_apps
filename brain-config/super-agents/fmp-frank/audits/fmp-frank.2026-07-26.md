fmp-frank: Self-Audit — 2026-07-26 (BIRTH)
Agent: FMP Fiona (fmp-frank)
Track: git-teammate
Auditor: Fleet Felix (steward)
Standard: git-teammate DoD v0.2 (audit-instruction.md v0.5)
Overall: Up to date — 9/9 PASS, with ONE new finding raised to a fleet rule and two open surfaces

## SHA STAMPS — what this audit was actually run against

First audit record in the fleet to carry these. Q11 → C (Michael, 2026-07-25) after Clio's 9/9 PASS
went stale in twenty minutes because the base spec was rewritten underneath it by a parallel session.
**An audit is a claim with a timestamp; these make a stale PASS detectable instead of hoping nobody
re-reads it.**

- `_shared/super-agent-base.md` ......... `e4b6fc3cb3e6b58308dcaea9c40902d2dcb4711c` (21,745 bytes)
- `super-agents/audit-instruction.md` ... `9903d5f8d6bf3b8c465c24ac2295ad1edea1e11d` (v0.5, DoD v0.2)
- `gates/git-teammate-lifecycle-runbook.md` `a3b76cee56532da5ef232167fa1c8ff65edb4e1a` (v0.3)
- `super-agents/roster.json` (post-write) . `93794991efa36918adb8fa9a08d3eaa497b63351`
- `gates/theme-contract-gate.md` ......... `c5ebbcb213b5f01528ae46ed9d9d9cac63e40f9e`

Concurrency check: `session-board.md` read immediately before the first write and carried ONE entry
(mine). Presence was posted BEFORE any build write, naming every file including Dexter's profile.
Main's HEAD advanced during the pass; every file this audit depends on was re-verified unchanged at
HEAD before merge rather than assumed.

Checklist results:
1. Base pointer present ................ PASS — `preferences.md` line 1 is the `_shared/super-agent-base.md` pointer.
2. Load manifest valid ................. PASS — 9 entries, all present. Two are conditional by design (the object library before any family question; the specific module's page before touching a solution) because loading either unconditionally would be noise on a non-FMP turn.
3. `roster.json` row accurate .......... PASS — `class: super-agent`, `memory: true`, **`status: needs-declaration` → `active`**, `invoke: /session.agent=Fiona` (the "(pending rebuild)" qualifier removed), `aka: [Fiona, FMP]`, one-line lane, `home`, `from` carrying both the rename and the build date. No `default_runbook` — correct; a bare call just seats her (Sage precedent).
4. Every pointer RESOLVES .............. PASS — verified against live directory listings this session, not from memory. Git: `_shared/super-agent-base.md` · `super-agents/audit-instruction.md` · `super-agents/roster.json` · `gates/theme-contract-gate.md` (checked explicitly — it was the one path I had only ever seen quoted in Dexter's profile, never verified) · `hooks/memory-rotation.md` · `gates/git-teammate-lifecycle-runbook.md`. ClickUp docs confirmed to exist as siblings under FileMaker Home: Canonical Object Library · Patterns + Conventions · Theme System · Documentation Standard · App Index · FileMaker → ClickUp Sync Mirror Pattern · Research Inbox; plus URITP fmp Solutions (list) and the FileMaker domain page. **No compressed/placeholder URLs written into any git file** — ClickUp surfaces are referenced by NAME, since a session-local URL placeholder would be dead text in a repo file.
5. Bundle files present + in-format ..... PASS — `preferences.md` (real profile, replacing the placeholder) · `memory.md` · `activity-log.md` (LIVE per-reply format, correct as of the current base spec) · `decision-log.md` · `README.md` · `audits/`. NO procedure in the bundle: the object library, patterns doc and documentation standard stay as ClickUp tools she stewards or consumes. **`working-notes.md` retired to a stub** — it is the NATIVE-track file in the audit-instruction file model, and she is on the git track; its four content types were each routed to their real git-track home in the stub's table.
6. No cross-file contradiction .......... PASS — profile, memory, README, roster row and Dexter's rewritten seam all tell ONE story: she builds FileMaker, owns the object library, consults on repo apps, never edits them. The old flat seam line ("Dexter owns the REPO, Fiona owns FILEMAKER") was the contradiction risk and it was rewritten on BOTH sides in this same pass, per Q7's own change-both-or-it-rots rule.
7. Voice distinct + token clean ......... PASS — with a REAL finding, below. Announce `🗄️ ═══ FIONA · IN THE GRAPH ═══`: 🗄️ unclaimed; "IN THE GRAPH" deliberately avoids a fourth `· X OPEN` banner (Maggie/Sage/Clio hold that shape). Token scan across both namespaces: `Fiona` and `FMP` claimed by nobody else. Dictation check on the crowded F-namespace (Felix, Fold-in Frank, Future Faye, Feasible Finn): "Fiona" is three syllables against Finn's one and shares no homophone — clean, unlike the Clio/Cleo near-miss.
8. Index mirror fresh ................... PASS — AI Toolkit index updated in the same session: new invocation trigger row for Fiona, and the two-trees teammate list + count refreshed. (Her lane also changes what the Dexter row implies, so that was checked rather than assumed.)
9. Inherited memory labelled ............ PASS — `memory.md` states up front that every line is INHERITED with a re-label-as-EARNED instruction, and explicitly flags record counts as drift-prone. **Two sections are deliberately EMPTY: the object-library refusal ledger and the FMP↔repo correlation ledger.** Both are the point of her, and seeding invented entries would have been worse than blank.

## 🔎 NEW FINDING — the slug-is-a-token rule collides with her rename (raised to a roster rule)

Two rules landed on 2026-07-25, hours apart, and they interact badly:

- **Q6 → A** renamed FMP Frank → FMP Fiona *specifically so bare "Frank" would resolve to `foldin-frank`*, the live anti-sprawl gate.
- **The slug-is-a-token rule** (added the same day) says an agent's SLUG is always a valid invocation token.

**Her slug is `fmp-frank`, and it is immutable.** So `/session-start=fmp-frank` is a legal invocation
that contains the exact word the rename existed to disambiguate. A cold agent applying the token rule
literally could see "frank" in the string and route to the gate — reintroducing the misfire Q6 closed.

**Fixed in the same pass, not deferred:** `roster.json` → `invocation.slug_is_a_token` now carries an
explicit line — *`fmp-frank` is FMP FIONA's slug; it resolves to HER, never to Fold-in Frank.* Sixth
instance of the token family (Ricky · Workshop Wes · the two Franks · Sage/Renata · Clio/Cleo), and the
first caused by two of our OWN rules meeting rather than by a naming choice. **Generalizable: when a
rename frees a token, check whether the immutable slug still contains it.**

Divergences / contradictions:
- **None inside the bundle.**
- **Open surface 1 (Michael, manual + irreversible):** native ClickUp agent `-39958890`. He said *"he's no native agent."* If that means the native never existed or is already gone, the roster's `retired_native_id` for her row should be DROPPED. **I left the field in place rather than deleting a fact I cannot verify from here** — deleting it would be inventing certainty. Needs one word from Michael.
- **Open surface 2 (hers, by design):** both ledgers in `memory.md` are empty. Her first real session with Dexter is what converts the correlation ledger from a promise into content.

Actions recommended:
- **Michael:** confirm whether native `-39958890` exists. If not, drop `retired_native_id` from her row.
- **Dexter:** `_shared/super-agent-base.md` is at 21,745 bytes against a ~22KB hard ceiling and still needs a real split. Deliberately untouched this pass.
- **Fiona, first session:** open the correlation ledger with a real FMP↔repo mapping, including where it BREAKS. A correlation with no stated limit is a slogan.
