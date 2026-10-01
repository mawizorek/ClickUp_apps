# Scan Intake — Notes & Failure Register

**Sidecar to `hooks/scan-intake.md`.** Read it with the hook when a run touches the SCANS list, and read it BEFORE any bulk rename on that list.

<p><br/></p>

**Why this is a separate file and not a v6 section:** `scan-intake.md` is **21,141 bytes**, already against the ~22KB line where a file can no longer be read whole and therefore can no longer be safely edited. Adding this inline would have pushed the hook past its own budget to record a lesson about carelessness, which would be funny and also bad. Established sidecar precedent in this directory: `screenshot-intake.BLOCKER.md`, `screenshot-intake.continuity.md`, `trip-triage.notes.md`, `script-breakdown.notes.md`, `source-size-budget-enforcer.notes.md`.

**Steward:** Mainstage Milo (he stewards sweep mode and the URITP-context layer). The mechanical half stays ownerless.

---

## 🔴 F1 — THE RENAME IS THE LAST STEP OF NORMALIZATION, NEVER THE ONLY ONE

**Born 2026-09-30. The most expensive thing a well-meaning pass can do to this list.**

<p><br/></p>

Sweep step 2 reads: *"Skip anything not yet normalized — a task still carrying the raw printer title needs steps 1-9 first. Normalization is a prerequisite for disposition, not part of it."*

<p><br/></p>

⭐ **Read that mechanically and the consequence is obvious: the raw printer title IS the not-yet-normalized flag.** `"Scanned from a Xerox Multifunction Printer"` is not merely an unhelpful name, it is **load-bearing state**. It is the only field a cold sweep can read, at list scale, without opening a single attachment, to know whether steps 1-9 have run.

<p><br/></p>

🚨 **What happened:** a seated session renamed **59 tasks** into `SCAN · <date> · <descriptor>` after identifying each one from its attachment, and ran **step 6 alone**. Not run on any of the 59: step 1 measure, step 2 split the tabloid two-ups, step 3 fix orientation, step 4 trim blanks, step 5 verify + compress, step 8 OCR transcript comment, step 9 handwriting/annotation vision read, step 9a URITP-vs-general classification.

<p><br/></p>

**The output looked like success and was a trap.** Every one of those 59 tasks now presents to a future sweep as normalized. The run even reported the renames as the fix that "makes this list searchable" — true, and beside the point, because searchability was step 6's job and steps 1-5 and 8-9 are what make a scan *readable without opening it*, which is the hook's stated purpose.

<p><br/></p>

### The rule

🚫 **Never write the `SCAN ·` prefix onto a task whose geometry has not been normalized.** The prefix is a *claim that steps 1-9 ran*. If you have identified a document but not normalized it, you may report the identification, write it in a comment, or hand Michael the proposed title — but **the title itself stays raw until the work behind it is done.**

<p><br/></p>

✅ **If you only have capacity to identify, identify in a comment.** A comment reading `proposed title: SCAN · ...` is fully as useful to a human and costs the sweep nothing.

### The surviving discriminator (use this on the 59, and on any list where F1 has already happened)

The title signal is **unrecoverable** — the originals are gone from the names. What survives:

<p><br/></p>

| Test | Means |
| --- | --- |
| No `🔎 Auto-OCR transcript` comment **and** final page count < 5 | step 8 never ran |
| No `✍️ Handwriting & annotation read` comment on a scan carrying marks | step 9 never ran |
| Source PDF still measures as a landscape tabloid two-up (≈17×11), or any page carries a non-zero `/Rotate` | steps 1-3 never ran |
| No normalized PDF surfaced as a comment link | steps 5-7 never ran |

<p><br/></p>

⚠️ **Absence of the OCR comment is weaker evidence than the raw title was**, because step 8 legitimately declines at ≥5 pages. So the page count must be read alongside it. **This is a strictly worse test than the one that was destroyed** — which is the whole cost of F1 and the reason it is written down.

---

## F2 — THE INDEX GAP: THIS HOOK WAS UNREACHABLE

**Root cause of F1, and the more important finding.**

<p><br/></p>

The 2026-09-30 session ran the full documented load-then-think routine — AI Toolkit index, Brain Reference Library, the SCANS list doc, the SCANS Decision Log, Milo's bundle — and **concluded in writing that "SCANS has no written triage procedure."** It then proposed building `scan-intake-triage.md` net-new. Fold-in Frank caught it on the next turn, at a directory listing.

<p><br/></p>

🔴 **Verified against the live AI Toolkit index, head and tail: `scan-intake` has NO row in the Quick-Scan Trigger Table.** None of `/scan-intake`, `/scan-sweep`, "sweep the scans", or "what's sitting in scans" appears in the routing layer. They exist only in this hook's own header, where nothing reads them.

<p><br/></p>

⚠️ **A second, subtler break: the Attachment Router claim is ONE-WAY.** `scan-intake.md` states it fires *"automatically via the Attachment Router PDF branch when a PDF reads as a copier scan."* The index's Attachment Router row wires the PDF branch to the **PDF Split Markdown Packager** and names nothing else. **The hook believes it is wired; the router does not know it exists.** A capability asserted on only one side of a seam is not wired, and this class is invisible to the Doc-Rot Sweep because the sentence is not stale — it is simply unreciprocated.

<p><br/></p>

⭐ **The generalizable law, already written in the Agent Activity Board missed-gate protocol and proven again here: a spec is inert until the index routes to it as an ACTION.** Shipping a 21KB hook into `brain-config/hooks/` is not registration. The same gap orphaned Style Stu and Size Sally on 2026-07-17 and shipped Dev Dexter built-but-unregistered.

<p><br/></p>

🪦 **Also recorded because it misled a competent session:** the ClickUp **SCANS 🔒 (list)** doc carries an open flag reading *"whether triage fires on SCANS tasks is undefined — do not assume it does."* That is **true about the INBOX ▸ Default email trigger and says nothing about this hook**, but it reads as a statement about scan triage in general. It was the single sentence that most reinforced the wrong conclusion. **A narrowly-true warning, read broadly, is indistinguishable from a false one.**

---

## F3 — INTRA-LIST DEDUP IS NOT ONE OF THE FOUR DISPOSITIONS

The four dispositions all move a scan **toward leaving**: MERGE OUT to a canonical task elsewhere, MOVE OUT to a report-import surface, LINK OUT + CLOSE, or STAY with a stated reason.

<p><br/></p>

The 2026-09-30 pass merged two confirmed duplicate pairs **inside** the SCANS list. That is housekeeping and it was correctly gated on Michael's confirmation through the preview flow — but it is **not disposition**, and a run that reports it as triage leaves the transit problem untouched. After 59 renames and 2 merges, **the number of scans that had actually left the list was zero.**

<p><br/></p>

✅ Dedup-within-list is still worth doing. Just never bank it as a disposition, and never let it make a sweep look complete.

---

## F4 — THE BACKLOG NUMBER, AND WHY IT IS THE ONLY ONE

The hook is explicit: *"A closed scan is NEVER a finding... The backlog metric is open scans with no disposition, nothing else."*

<p><br/></p>

The 2026-09-30 run reported **"144 tasks, 97 open, 47 in the library archive"** as the state of the list. Reading the `library` rows was defensible — it was hunting duplicates, and a closed canonical row is exactly where a duplicate hides — but **presenting the 144 as the backlog contradicts the hook.** Report the open-with-no-disposition count; mention a closed row only when it is the keeper of a live comparison.

<p><br/></p>

### 📈 Measured growth (keep extending this; it is the evidence sweep mode exists)

| Date | Total | Open | Note |
| --- | --- | --- | --- |
| 2026-09-17 | 138 | 70 | v5 baseline, the day sweep mode was written |
| 2026-09-30 | 144 | 97 | **open +27 while total +6 in 13 days** |

<p><br/></p>

🔴 **Open grew four times faster than the list did.** That is not intake pressure, it is **disposition failure** — scans are being normalized and then parked. It is the single strongest argument for firing sweep mode on a cadence rather than on request, and it could not be seen until someone counted twice.

---

## F5 — STEP 9a IS SKIPPED SILENTLY, BECAUSE SKIPPING IT USUALLY LOOKS FINE

Step 9a classifies a scan URITP-vs-general before any decoding. The 2026-09-30 run never ran it. **No harm resulted** — no theatre codes were forced onto anything — and that is precisely why the omission is dangerous: **the gate's failure mode is invisible on the pass where you get lucky.**

<p><br/></p>

At least five captures in that batch are plainly general/personal, not URITP: University of Rochester Retirement Program required notices, a Vanguard Target Retirement Funds fact sheet, a Sony limited warranty, a House of Guitars receipt, and a Costco rescan. Under sweep mode a general scan's disposition is almost always STAY or a personal-surface link, **never a production surface** — so an unclassified general scan is one careless step from being routed into a show.

<p><br/></p>

✅ **Make the classification VISIBLE.** State it per scan in the run report, including when the answer is URITP. An unstated classification and an unrun one look identical, which is the `silent-fallback-law` in its usual clothes.

---

## Open / owed

- 🔴 **Index trigger row for `scan-intake` (incl. `/scan-sweep`)** — the actual fix for F2. Michael's to paste; the AI Toolkit page has refused agent edits before.
- 🔴 **Attachment Router reciprocity** — the index's router row must name the copier-scan branch, or this hook's auto-fire claim must be struck. One or the other, not neither.
- ⚠️ **The 59 F1-affected tasks** still need steps 1-5 and 8-9. They are identifiable only by the discriminator table above.
- ⚠️ **Correct the SCANS 🔒 (list) doc's open flag** so it says what it means: the *Default email* trigger does not reach SCANS; `hooks/scan-intake.md` does.
- ⚠️ **Zero dispositions have ever been executed** on this list by a sweep. Sweep mode is still generalised from no completed live run; a cold session finding no run history must say so.

---

## Changelog

- **2026-09-30** — Created by Mainstage Milo after Fold-in Frank returned `FOLD-IN -> hooks/scan-intake.md` against a proposed net-new `scan-intake-triage.md`. Records F1 (rename-without-normalization destroyed the sweep's prerequisite signal on 59 tasks), F2 (the hook has no index trigger row and the Attachment Router seam is one-way — the root cause), F3 (intra-list dedup banked as disposition), F4 (backlog miscounted; growth measured at open +27 / total +6 over 13 days), F5 (step 9a skipped silently). Every entry traces to a specific action or claim in the 2026-09-30 SCANS session.
