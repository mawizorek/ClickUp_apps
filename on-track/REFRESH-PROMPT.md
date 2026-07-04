# On Track — Refresh Prompt & “Faked Automation” Playbook

Data changes when race weekends roll over, not on a task event, so a true trigger-based automation is overkill. Until a real scheduled job earns its keep, we fake the automation with a **scheduled reminder + a dummy-proof paste prompt**. This file is the canonical copy of that prompt.

## ⭐ The paste prompt (copy this)

```
Refresh the On Track motorsport app. Pull the current week plus the next ~4 weeks of real US motorsport TV listings across every series in the app (F1, F2, F3, NASCAR, IndyCar, MotoGP/Moto2/Moto3, IMSA, WEC, NHRA, MotoAmerica, MXGP, World Superbike, British Superbike, FIM Speedway, Formula E, Supercars). Verify start times in US Eastern and confirm each event's US channel or streamer. Then commit the updated on-track/data.json to mawizorek/ClickUp_apps on main (data-only, no engine version bump) and reply with the commit link + live URL once it's serving. If a series has no confirmed US TV, label its platform "Stream" rather than guessing.
```

**The loop:** reminder fires (Thursday 9am ET, weekly) → open the On Track task → tap-copy the block → new Brain session → paste → ~5 min later the feed is live. No memory required, no thinking required.

## Ways to “fake” the automation (ranked by effort)

1. **Prompt Reminder (LIVE).** Recurring ClickUp reminder, weekly Thursday 9am ET, titled with the do-this cue. Paste prompt lives at the top of the On Track APPS task + here. Zero infra. This is the current mechanism.
2. **Google Calendar echo (optional).** Same prompt in a recurring calendar event description, so the nudge also hits your phone calendar / other devices. Belt-and-suspenders with the reminder.
3. **GitHub Actions cron (the real one, later).** A scheduled workflow in the repo rebuilds `data.json` on a timer with zero human step. Blocked only by needing a data source the Action can hit unattended (an API or a committed source list). When manual cadence becomes a chore, build this.
4. **Super Agent “Refresh Ricky” (the eventual real fix).** A scheduled Super Agent that runs the paste prompt against itself weekly, does the research + commit unattended, and posts the result to a channel. This is the graduation path from “faked” to “true” automation once the workflow is proven.

## Notes

- ClickUp native automations **cannot** commit files to the repo. Their only outbound GitHub action is Create Issue; everything else is inbound triggers or read-only search. A webhook action can PUSH a signal out, but something with repo-write credentials (GitHub Action / Make / Zapier / a Super Agent) still has to do the actual commit.
- Keep this prompt in sync if the series registry or app slug changes.
