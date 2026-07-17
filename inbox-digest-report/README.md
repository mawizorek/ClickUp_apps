# inbox-digest-report

**Status:** v1 - field-capture matrix landing page live. Dashboard pending (see ClickUp task).

Data-rendered audit surface for the Gmail Inbox Sweep. The dashboard renders a rolling state file (`data/inbox-state.json`) that Brain rewrites each sweep; the file IS the audit trail (handoff-safe). This v1 ships the **field-capture matrix** only: every field Brain scrubs per Gmail thread, as a direct spreadsheet render, so the dashboard is designed on a validated field set.

## Structure

- `index.html` - router shell (pointer). `DEFAULT_PAGE` = `matrix`; flip to `dashboard` when that page lands.
- `pages/matrix.html` - the field-capture matrix (current landing page).
- `config.json` - access gate (open).
- Theme: wired to `../shared/themes/` spine via `data-theme` (default `maw-dark-utility`), swappable. Local `:root` in the shell is a fallback so it renders off-spine.

## Captured fields (10)

thread_id, sender name + address, subject, date, message_count, read_state, attachments (filenames only), snippet (preview, 2 lines max), gmail_url, participants.

## To add next (available, not yet columns)

message_id (deep-link one message), to/cc recipients (split from participants), mailbox origin (inbox/sent).

## Confirmed NOT available (no API read)

labels/folder, star/importance, Gmail category tabs (Promotions/Social).

## Companion pieces

- Hook: `brain-config/hooks/gmail-inbox-sweep.md`
- Landing list: Home > Gmail INBOX > GMAIL INBOX (`901327875287`)
- Data schema + build plan: ClickUp task "Build Gmail Inbox Dashboard app".
