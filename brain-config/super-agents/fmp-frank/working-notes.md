# FMP Frank — Working Notes / Revision Log

Per-agent scratch: next spec, in-flight decisions, and a running revision log. Global metadata
lives in `../superagents.json`; the near-1:1 config mirror lives in `preferences.md` (header +
config only, no changelog); formal audit records live in `audits/`.

## Revision log

- **2026-07-15** — Declaration folder scaffolded by the Fleet Steward (README pointer + PENDING
  preferences stub + this file). `superagents.json` row wired (declaration_folder set; status
  needs-declaration). Awaiting a verbatim paste of Frank's live config before the first audit.
- **2026-07-15** — SELF-DECLARE (Runbook A) executed by Frank. `preferences.md` PENDING stub
  replaced with a near-1:1 verbatim mirror of Frank's live ClickUp config (identity/constraints,
  triggers, full core instructions, established conventions, how-to-respond, tone, research mode,
  knowledge scope, tool inventory, stored user preferences). Header timestamp set to 2026-07-15.
  Landed via PR from branch `self-declare/fmp-frank-2026-07-15`. Left open for Fleet Steward
  review per Michael (Corey reviews the mirror and suggests further edits). STEP-1 accuracy check:
  see below.

## STEP-1 accuracy check (2026-07-15)

Confirmed the written mirror matches Frank's actual live setup. Notes on fidelity:

- Identity, triggers (mention / DM / assignment / schedule), creator, profile URL, and stored user
  preferences reproduced faithfully from the live config.
- Core instructions, established conventions, how-to-respond, tone, and research-mode sections are a
  faithful near-verbatim reproduction, lightly reflowed for plain-markdown readability (no rule
  content added, dropped, or altered in meaning).
- Deliberately EXCLUDED (platform wrapper shared by all agents, not Frank-specific config, so not
  part of a meaningful config mirror): the generic Execution Contract, Access & Limitations,
  Response Behavior / rich-formatting rules, per-tool JSON schemas, and transient trigger-context.
  Tools are listed by name/capability rather than pasting platform-generated schemas. Flag for the
  steward if the standard wants those platform sections included verbatim too.
- No drift found between what was written and the live setup within the scope mirrored.

## Next spec / open threads

- **Track question (answered, needs steward confirmation in superagents.json):** Frank is a
  narrower **FileMaker specialist**, not a general-purpose full-standard agent — the entire config
  is FileMaker-solution design/documentation for Michael's apps. Recommend flipping `track` from
  `full-standard` to a specialist track (or the fleet's equivalent) before holding Frank to the
  full golden-standard checklist (Load-then-think, two-tier channels, roster pointer, etc. are not
  currently part of Frank's live config).
- **Triggers (answered):** `mention`, `dm`, `assignment`, `schedule`. Recommend setting
  `triggers: ["mention","dm","assignment","schedule"]` on the fmp-frank row in superagents.json.
- **Channels (answered):** Frank has NO dedicated two-tier channel wiring in its live config — no
  designated Activity Log channel and no hardcoded shared cross-agent channel. It operates reactively
  where triggered (DMs, task comments, and the shared cross-agent channel 12cwjm-56653 when
  @mentioned there). If the fleet wants Frank on the two-tier model, that's a config change Michael
  would need to make in ClickUp first; flagged as a GAP for the track discussion. Left
  `channels: {}` for the steward to set intentionally.
- Metadata edits above are RECOMMENDATIONS for the Fleet Steward to apply in `superagents.json`
  (single source). Frank did not hand-edit that file in this self-declare PR.
