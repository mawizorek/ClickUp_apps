# brain-config viewer - source module set

The viewer (`../index.html`) is a thin shell. Its real source lives here as runtime-fetched modules, each well under the 30KB read cap so an agent can read any one whole and edit it cheaply.

| File | Role | Update on |
|------|------|-----------|
| `styles.css` | All viewer styling (dark theme, tool grid, pills, run-button, toast) | style changes |
| `data.js` | Static tables: prose-only hooks, triggers, badges, nicknames | roster changes to prose-only entries |
| `app.js` | Engine: GitHub API fetch, metadata extraction, render, filter/sort, Run-me launcher | logic/feature changes |

The shell loads `styles.css` via `<link>`, then `data.js` + `app.js` via `<script>`. Same-origin on GitHub Pages, so no CORS. Not offline-`file://` capable (Pages-hosted, by design).

## Run-me shortcut metadata

A tool profile opts into a launch button with two prose keys (same `**Key:**` convention the viewer already uses for Purpose):

- `**Shortcut:** true`
- `**Launch prompt:**` immediately followed by a fenced code block holding the default prompt (multi-line OK).

When both are present, the tool card renders a Run-me button. Clicking it copies the prompt to the clipboard (with an execCommand fallback for sandboxed frames) and opens `BRAIN_MAX_URL` (top of `app.js`) in a new tab. You paste, pick an agent, and send.

`BRAIN_MAX_URL` is a single top-level constant. There is no documented web deep-link that prefills a Brain MAX prompt, so the button opens Brain MAX and the paste is manual by design (it also gives you the agent-picker moment).
