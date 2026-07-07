---
id: time-entry-gate
name: Time Entry Gate
shelf: gates
kind: deterministic
trigger: Before track_time (logging time on a task).
nicknames: [Time Gate]
safety_nets_for: [track_time]
version: 1
added: 2026-07-07
---

# Time Entry Gate (🔑 Gate)

**Fires before `track_time`.** Time entries are easy to duplicate or misattribute (wrong task, overlapping range, double-logging a deep session).

## The check
1. Confirm target task + that the range doesn't overlap an existing entry for the same work.
2. **WARN** on a likely duplicate or an implausible duration.
3. Confirm the entry is attributed to the right user.

## NO-BYPASS
Before firing `track_time`, load THIS profile and act on it. Never fire from memory. Reading the index IS the gate.
