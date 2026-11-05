# Milo threaded capture

Approved by Michael 2026-11-05. Runs on Mainstage Milo invocation and before each substantive Milo reply, including audio sessions. On-demand only; no autonomous trigger or background polling.

## Surfaces

Resolve Milo through the Agent Index. Current capture/log task: `86ajtqmru` in Agent Index `901328043244`. Verify identity before use.

- Michael's root comments: raw capture notes, preserved.
- Thread under each capture: Milo's short clarification, routing, state and verified outcome links.
- Active session/work-item task: actual substantive conversation and work. Link it to the originating capture where relevant; do not duplicate its transcript on the Index row.
- Existing activity root comments: link-only receipts under the activity-log convention. They are not capture notes and must not recursively trigger triage.

This is a Milo-specific intake exception to activity-log-clickup-native.md, not a fleet-wide change. It does not make the Index row the full conversation surface. Routine capture follow-through stays threaded. Do not repurpose the shared URITP Production Team room as Milo's personal inbox.

## Read before replying

1. Read current Index description and new root comments since this session's last verified checkpoint. Distinguish user captures from activity pointers by content and provenance, not creator name alone: agent writes can be attributed to the human account.
2. Inspect replies on unresolved capture threads and threads updated since the checkpoint. Include relevant activity pointers from other sessions and follow their work links before stating what changed.
3. Follow available pagination/expansion when the read window cannot reach the checkpoint. A new session must establish coverage, not assume the latest few comments contain the backlog. If complete coverage is unavailable, report the exact coverage gap. Never label a partial scan caught up or the inbox empty.
4. Track root and reply IDs/timestamps in session context. A checkpoint is a read marker, not proof of triage. On a cold session, reconstruct open states from readable receipts; do not invent a durable unread cursor or claim complete recovery from a clipped view.

## Handle a capture

Re-read its thread immediately before acting. Honor an existing verified receipt; do not repeat completed work. Pending work in another session is not finished work. If ownership conflicts, surface it; comment tools provide no atomic lock.

Use one short threaded receipt per state change:
- `Captured`: retained, not yet routed.
- `Needs answer`: name the specific unresolved question and relevant session link.
- `Handled`: exact verified destination/action link and what happened.

Read is not handled. A proposal awaiting approval remains unresolved. Keep corrections and superseding receipts append-only; do not delete Michael's raw note. A later reply can reopen a handled capture and must be checked on a subsequent invoked turn.

Put substantive analysis in the active session or existing work item, then link the exact contribution in the capture thread. Do not create a separate task for every thought. Locate existing production/event/task destinations first. Follow platform approval requirements for comments, bulk/structural/destructive changes, and other writes; mode activation is not blanket authorization.

Durable preference candidates follow the established placement process. A comment is evidence of a preference, not automatic governing configuration. Keep a receipt when an accepted preference reaches its maintained home. Do not mix transient production facts into agent identity files.

## Verification and limits

Verify destination write receipts before saying Handled. If destination succeeds but receipt fails, report partial completion and reconcile against the existing destination before retrying. Do not manufacture duplicate work during recovery.

Do not append a catch-up essay to the Index description. Preserve unrelated identity/live-state content. Any future persistent pending-capture index needs a separately reviewed placement and concurrency design; this hook does not install one.

Checks: root capture plus follow-up reply; an already-handled item; a handled thread reopened by a new reply; two sessions attempting the same route; a clipped comment window. Fresh-session behavior requires testing; repository instructions alone do not install a native automation.
