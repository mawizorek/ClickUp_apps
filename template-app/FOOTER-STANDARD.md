# TIDR Footer Standard (every app)

**Every app in this repo ships a footer build stamp in the format `v<build> · PR#<n>`** — the running version plus the PR that shipped it. No date.

## Why

The stamp is written by the app's *loaded JavaScript*, so a stale (cached) bundle shows an OLD stamp. That gives the user a concrete "am I on the current build?" readout and lets us tell a caching problem apart from a real bug in one glance. This was locked after a session where "I'm clearly a version behind but have no concrete version to check against" cost real back-and-forth.

## How to add it

- **Multi-file app:** copy `source/version.js` into `<app-slug>/source/version.js`, load it LAST in the shell (after every other `<script>`, so `<footer>` already exists), and bump `BUILD` + `PR` on every ship.
- **Single-file app:** inline the same tiny IIFE at the end of the app's `<script>` block. Same stamp, same contract.
- The stamp appends into the existing `<footer>`; it does not replace the footer's other content (source-download trio, credits, etc.).

## The contract

- Format is exactly `v<build> · PR#<n>` (middot separator, no date, no extra words).
- `BUILD` is the app's running version; `PR` is the pull request that shipped it (direct-to-main commits note that instead).
- Bump both on every ship. One-line edit, lowest-risk file in the app.

Recon Renata audits every app folder against this on her repo-audit pass; a missing or stale footer stamp is a finding.
