# Timecard Intake · AI Toolkit

**Purpose:** Turn a scanned stack of Kronos timecard printouts into one Hours Worked row per shift, each wired to the right hire (Worker → Shop Role Assignment), pay period, and pay code, with real clock-in / clock-out timestamps in the **Shift START / Shift END custom fields** and an explicit confidence flag, so FMP can pull raw hours and do every calculation itself.

**Steward:** 💰 Ledger Elio (labor money trail, payroll reconciliation). 🏗️ ClickUp Coach Corey owns the ClickUp write mechanics in steps 6-9. 🎭 Mainstage Milo owns URITP name/role resolution.

**Mode:** Gated (fires on a scan classified as Kronos timecards).

**Invocation:** `/timecard-intake` · "enter the timecards" · "process the hours scan" · pointer from `hooks/scan-intake.md` disposition #3 when the scan is Kronos printouts.

**Trigger:** A SCANS task whose pages read `mykronos.com/tk-print`, "Timecard", "Requested by", with Date / Assignment / In / Out / Pay code / Amount / Shift / Daily / Period columns.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-10-04** by Ledger Elio + ClickUp Coach Corey, from the first live run (FY27 Period 06, 11 cards, 60 shift rows).

---

## 🎯 Standing rules (Michael, 2026-10-03/04)

- **Paper is the only source.** The program administrator will only ever provide Kronos printouts. Do not propose "ask for an export." Automation starts from the scan.
- **ClickUp tracks HOURS ONLY.** No pay rates, no earnings, no formulas. FMP pulls raw rows by API and calculates.
- **Job comes from relationships, never a field on the shift.** Hours Worked → Worker (Shop Role Assignment) → Hired Position (Hirable Positions) → Hirable Role Level (WORKDAY Roles).
- **One hire per person per job.** Two distinct Kronos assignment labels on one card = two different hires, even if only one is ours. Make the second Hirable Position + join anyway so those hours are flagged as worked in a different job.
- **Credit-basis hires produce no cards.** A person on payroll doing a role for credit is not "missing." Only chase missing cards for Hourly hires.
- 🔴 **Shift times live in the CUSTOM fields `Shift START Date timestamp` / `Shift END Date timestamp`.** 🚫 **NEVER ClickUp's native Start date / Due date.** (2026-10-04: the agent substituted native dates when the custom fields would not show time. Michael rejected it outright. Substituting a different field because the right one is hard is not a fix.)
- ⏱️ **Speed matters.** Michael's bar: this must beat hand-typing. One staged preview, one confirm, then the bulk write with the verified path. No exploratory round-trips on a run that follows this file.

---

## Coordinates

| Surface | Location |
| --- | --- |
| Source scans | URITP ▸ INBOX ▸ SCANS (`901327231551`) |
| **Hours Worked** (one row per shift) | BETA BUDGET ▸ Staffed Labor (`901329206694`) |
| Shop Role Assignments (hires / joins) | BETA BUDGET ▸ SCHEMA ▸ Joins (`901328246945`) |
| Hirable Positions | BETA BUDGET ▸ SCHEMA ▸ Setup (`901327627095`) |
| WORKDAY Roles (Kronos) | Setup (`901329206805`) |
| Employees (person-level payroll facts, multi-homed PEOPLE) | Setup (`901329206841`) |
| Payroll Periods | `901328256601` |
| OP Lines (Funding Sources) | `901329043281` |
| Tooling | `pdftotext -layout` (poppler) FIRST, `pdftoppm` + `tesseract` fallback, agent vision last. Python/pandas for staging and for generating the write statements. |

### Hours Worked fields

| Field | ID | Rule |
| --- | --- | --- |
| **Shift START Date timestamp** | `a9e4f6d4-e939-4988-b8a1-74b341b04327` | **Clock-in, date + TIME.** See Timestamp rules. |
| **Shift END Date timestamp** | `c6b70f36-0cdd-4421-b532-d6564c3f0184` | **Clock-out, date + TIME.** |
| Worker | `5e22fd3f-088e-45a5-84fa-7c0c4e122db9` | → Shop Role Assignments row for THIS person + THIS job |
| Hours worked | `74ef6a01-7e44-4414-9b32-6ba0284424b1` | Card's stated shift amount. Never computed. |
| Pay Period | `b0d56142-2ece-48bd-875f-4d98060470af` | → Payroll Periods row whose BEGIN/END contains the date |
| Pay Code | `69a20757-d64a-4269-a71a-e8ff16bfdd3a` | `Worked` / `UR Sick` |
| Entry Confidence | `02da494a-9761-4c48-bb6f-d991b4eda476` | `✅ Confident` / `❓ Question` |
| 🚫 native Start date / Due date | task-level | **Not used. Leave empty.** |

Person-level match key: **UR Employee ID** on Employees (`c78e2307-1143-4f80-97bd-4f39915cabbc`). Name aliases (Workday vs ClickUp vs preferred name) live on the person records in ClickUp, never in this public file.

---

## Procedure

0. **Fresh-read the schema.** Field lists for Hours Worked, Shop Role Assignments, Employees, and the SCHEMA notes in each list description. Never work from memory of the schema; Michael restructures as he goes.

1. **Extract with layout FIRST.** `pdftotext -layout -f N -l N scan.pdf -` per page. This keeps each punch on its date row. Plain OCR / flattened text loses row alignment (live: one card's dates and another card's In/Out columns came out scrambled; `-layout` recovered both exactly). Fall back to 300-DPI `tesseract --psm 6`, then vision, only per page that fails. Rotated pages with no text are overflow / page-2 sheets: check, don't parse blindly.

2. **Parse each card.** Header: name, UR Employee ID, period. Rows: date, Assignment label (`Student…`, `Technic…` etc. are TRUNCATED job titles), In, Out, Pay code, Amount, Shift, Daily, Period.
   - **Skip accrual/balance lines** (e.g. `AT-UR Sick 9,999.00 d`, negative day balances). They are balances, not hours.
   - **Split punches** (12:00-12:07 + 12:07-2:02 with one Amount) = ONE shift, first In → last Out.
   - **Pay-code rows with no punches** (UR Sick) = a row with hours and no times.

3. **Tie out every card before writing anything.** Σ shift amounts = card Period total. Kronos totals on minutes, so ±0.01 per card is rounding, not error. The running Period column must step correctly row to row; use it to place rows whose dates were lost.

4. **Match the person by UR Employee ID**, never by name.

5. **Match the hire (Worker).** Person + Kronos assignment label → Shop Role Assignment.
   - Label already mapped to a Hired Position for this person → that join.
   - **New label for this person → it is a different job.** Create (or reuse) a Hirable Position for that job (placeholder name from the Kronos label until Workday names it) + a `{Role}{Person}` join, and flag the rows `❓ Question` until payroll confirms which job/FAO it is. Do not assume which label is "ours."

6. **Pay Period** = the Payroll Periods row containing the shift date.

7. **Stage, then write.** Build a staging CSV (person, date, in, out, hours, assignment label, pay code, worker join, confidence, note). Show the counts and the Question rows. Michael confirms ONCE. Then write.
   - Name: `YYYY-MM-DD · Surname · H.HHh` + ` · <Assignment tag>` when not the primary job + ` · <Pay code>` when not Worked.
   - Description: link to the source SCAN task + the question text when ❓.
   - Create rows with Worker, Hours, Pay Period, Pay Code, Entry Confidence. **Do NOT set shift times in create**; step 8 writes them.

8. **Timestamp rules.**
   1. Clock-in → **Shift START Date timestamp**, clock-out → **Shift END Date timestamp**. Full datetime, America/New_York, **time shown in the column**. Never date-only. 🚫 Never native Start/Due.
   2. No-punch pay-code rows: START = date only, END blank, say why in the description.
   3. Overnight: Out earlier than In → END date is the next day.
   4. Hours worked = card value. Sanity check |(END − START) − Hours| ≤ 0.02 h, else flag ❓.
   5. **Write ONE row, then confirm the TIME is visible in the custom-field COLUMN in a List view** (Michael eyeballs it) before bulk. API read-back is not proof.
   6. ✅ **VERIFIED WRITE PATH (2026-10-04, Michael confirmed in the column):** bulk SQL, one constant per statement:
      `UPDATE tasks SET "custom:<START or END field id>" = 'YYYY-MM-DDTHH:MM:00-04:00' WHERE id IN ('<id>', ...)` → `APPLY UPDATE <token>`.
      Generate the statements in the sandbox from the staging CSV, **grouping rows that share an identical timestamp into one `WHERE id IN (...)`** to cut the call count. Use `-04:00` in EDT, `-05:00` after the November switch.
      🚫 `create_task` / `update_task` with `with_time: true` does NOT turn on the column's time display. Do not use it for these fields.

9. **Confidence rubric.**
   - `✅ Confident`: clean read, ties to the card, person and hire matched.
   - `❓ Question`: unmapped job label, sub-5-minute punch (likely mis-punch), date unrecoverable, reconstruction that does not tie exactly.

10. **Verify after bulk.** Row count, Σ hours vs Σ card totals, spot-check one Confident and one Question row by loading the task. ⚠️ Aggregate SQL over custom number/date/dropdown fields returns blank/0 (tool gap): verify by task load, not SUM / GROUP BY.

11. **Missing-card check.** Compare cards to the administrator's reminder list and to Hourly hires active in the period. Credit-basis hires are expected absences. Anyone on a card but missing from the reminder list is a list gap to report, not an error.

12. **Close the scan** via `hooks/scan-intake.md` disposition #3 (LINK OUT + CLOSE): comment on the SCAN task with the period, row count, total hours, Question count and a link to Hours Worked; set it `library`.

13. **Hand to Elio:** reconcile the period against the Workday payroll detail for the FAO (hours per Employee ID per job profile) when it posts. That settles every ❓ job-label row.

---

## Guardrails

- **Hours only.** Never write rates, earnings, or totals into ClickUp.
- **Never compute hours from times.** The card's Amount is the paid value.
- **Stage + confirm before bulk.** 5+ rows always go through a staged preview.
- **Test row first, UI-verified** (rule 8.5).
- 🚫 **Never substitute a different field** when the specified one is hard to write. Say the limit, test another write path on ONE row, and ask.
- **PII stays in ClickUp.** This repo is PUBLIC: no names, Employee IDs, hours, or alias tables here. Only the procedure.
- 🔒 **No email send.** If a missing card or mis-punch needs the administrator, draft only and surface to Michael.
- **Don't decide which job is "ours."** Payroll decides.

---

## ⚠️ Tool limits found live (2026-10-04)

- **Custom date fields: time display.** Per-task create/update `with_time` stores the timestamp but leaves the column date-only, and afternoon punches then display on the NEXT day. **Bulk SQL `UPDATE … SET "custom:<date field>" = '<ISO datetime>'` shows the time correctly** (rule 8.6).
- **Bulk SQL can't set per-row custom values** (`CASE` rejected for custom fields): one constant per statement; group identical values.
- **Bulk SQL can't clear native start/due** (`= NULL` rejected); per-task `"none"` works.
- **Relationship fields** are writable only through per-task create/update, not bulk SQL.
- **Aggregates over custom fields** read as blank/0; verify by loading tasks.
- **Rollup fields** can't be created by the agent; Michael adds them in the UI.
- **View column edits** failed (view not resolvable by the view tool); Michael adjusts columns.

---

## Composes with

- **`hooks/scan-intake.md`**: normalization runs first; this hook is the labor branch of disposition #3.
- 🚫 **NOT `hooks/batch-import.md`** (different domain).
- **Ledger Elio's payroll reconciliation** (step 13).
- **custom-field-gate / multi-edit-batch-gate**: any new field or bulk write.

---

## Changelog

- **v1.2 (2026-10-04)**: Recorded the VERIFIED shift-timestamp write path (bulk SQL UPDATE, grouped by identical value) after Michael confirmed times in the column; create step no longer sets times; added the speed bar (must beat hand-typing).
- **v1.1 (2026-10-04)**: 🔴 Corrected v1, which told agents to put shift times in native Start/Due. Shift START / END custom fields are canonical; native dates are never used. Added the no-substitution guardrail.
- **v1 (2026-10-04)**: Established by Ledger Elio + ClickUp Coach Corey from the first live run (FY27 Period 06: 11 cards → 60 rows, ties to card totals). Layout-first extraction, tie-out before write, Employee-ID matching, one-hire-per-job rule, credit hires have no cards, Entry Confidence flag, timestamp rules.
