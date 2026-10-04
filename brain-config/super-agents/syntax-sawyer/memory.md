# Sawyer — Memory (the desk's house practice)

> **~10KB hot cap — ⚠️ APPROACHING IT. Next substantive addition splits Ledger C's
> established-facts block to `memory/archive/`.** Measure from the write response, never estimate.
> Vendor-documented Eos behaviour does NOT live here — it lives behind a citation, read at its correct
> release level. **This file holds what ETC does not document: how THIS house drives the desk.**
> Michael's own fluency is a separate file (`memory/michael-eos-fluency.md`) and it is read first.

---

## 📍 Ledger A — RULED house standards

### A1 · 2026-10-04 · The house trigger mechanism is Eos's own sACN Input event list → macro

**Confirmed by Michael, verbatim:** *"I think the eos event list with sacn trigger is all I was looking
for being reminded of."* Shape: Show Control \[Tab 11\] event list at `{Type} {Network}`, event assigned
`{sACN} <universe>/<address>`, `{Action} {Macro} <n>`. Founding sender is **sACNView** (desktop), which
transmits sACN and cannot speak OSC.

⚠️ **CONFIRMED METHOD, not yet a house standard**, and the difference is load-bearing:

- 🔴 **No universe number named.** Recommendation (unruled): a **dedicated universe no gateway outputs** —
  then no merge rule, no per-address-priority question, and a stray level can never become light.
- 🔴 **The iPad fork is PARKED** — see Ledger B.
- 🔴 **NEW CONSTRAINT 2026-10-04 — the macro's TARGET is now a real decision, because the system has a
  second USER.** Eos macros carry a **Target Device** (device name or User ID, `{Target}` softkey in the
  Macro Display): *"This allows a cue to execute a macro only on a certain console."* With the new
  programming wing live at **User ID 2**, an untargeted trigger macro is a CHOICE, not a default — and any
  macro that touches a command line (clear, sneak) lands in whichever workspace it was aimed at.
  ⚠️ Practitioner-grade, labelled: ETC forum + ETC moderator report that a **user-targeted macro only
  works in FOREGROUND mode**, and the target user must be **active on a real device** (console / RPU /
  Puck / RVI) — a user that only exists on a remote app does not receive it. Not vendor-manual text.

**The three vendor behaviours that make or break it** (cited, re-read at his release level): rising edge
through **50% / DMX 127**, not Full, re-arming only after dropping back below · **the console includes its
own sACN levels**, so a patched address self-fires on every cue that takes it up · priority 1-200, default
100, equal priority merges HTP. **Pulse, never park** — sACNView's **Channel Check blink** is the control;
a fader is a latch. ✅ Priority 100 confirmed on live house hardware.

## 🧪 Ledger B — Candidates and open forks (offered, NOT ruled)

- **The trigger universe number.** Open since 2026-10-04. A1 cannot become a standard without it.
- **The macro Target for the trigger** — device, user, or untargeted. New, unruled.
- **The iPad fork, PARKED 2026-10-04.** **ETC iRFR** fires macros natively (my pick for hand-firing) ·
  **sACNView iOS** exists but its own store text says not for show-critical use and has no blink ·
  **Luminair 4** is the maintained iPad-as-sACN-source. 🚫 Do not re-raise unprompted.
- **Patch numbering belongs to the PAPERWORK, the desk inherits it** (offered to Vale 2026-10-03, unruled).

## 🏛️ Ledger C — The rig and the room

### 🔑 The NEW PROGRAMMING WING — in service for the first time, 2026-10-04 (his words + a live About read)

Michael: *"yeah we added a new programming wing. this is the first show we're using it on."* The Puck from
the `About: Device` photo IS that wing's brain: `ETCPUCK-D2BE4D7` · `Assigned As: Client` · `User ID: 2` ·
`Priority: sACN=100` · `Port 1: 10.101.185.101` · `Port 2: 192.168.0.91` · `Defined Parameters: 1406 of
12288` · Eos `Version 3.3`, point release cropped.

- 🔴 **A Client CANNOT output, so the wing is not a safety net.** Verbatim: *"Client devices can act as
  remote controllers or video stations for a system, but cannot output to or control the lighting
  equipment"*, and *"Only Primary (and Backup when its Primary console is down and it is running as
  Master) can output."* **If the Ion drops mid-show, the wing does not take over.** ⚠️ Whether a Puck can
  even be assigned Backup is NOT verified — older manual language limits primary/backup to consoles and
  RPUs. His call, worth knowing on a first show.
- 🔑 **User ID 2 means a SEPARATE command line** by design: *"If the Client and the Primary console have
  the same user ID, they will act as one. If they have different user IDs, they will have separate command
  lines."* That is the point of a programming wing — and the reason A1 now needs a macro Target decision.
- ✅ **VERSION INFERENCE UPGRADED to near-certain.** Multi-console requirements are explicit:
  *"Software versions must match exactly between all devices"* (plus same fixture library and matching
  language + keyboard-language settings). A **synced, in-service Client therefore proves the Ion is on the
  Puck's exact release** — so the uncropped right-hand column of that same photo answers the Ion too.
  Still want the point release in writing.
- 🔑 **`10.101.185.101` is ETC's FACTORY DEFAULT port-1 scheme**, not a UR assignment: *"By default the IP
  scheme for a Eos Family Console is IP: 10.101.x.x for port 1."* So the lighting side is on ETC defaults
  and `192.168.0.x` is the other net. ⚠️ The mapping to the five NAMED networks is still not established.
- ⚠️ **Multi-console has a first-show checklist I did not get to ask about:** exact version match, same
  fixture library, matching language AND keyboard-language settings, a physical switch (not a daisy chain).
  Any one of those blocks a sync and the symptom is "the wing won't connect."

### ✅ Established 2026-10-03 from his own inventory (sources named, values not measured)

- **ETC Ion xe20** — `in stock`, OWNER + STORAGE **SPAC**, purchase note **2020**, `IP Device Type:
  PRIMARY, CONSOLE`. Task `ITPINV-919` / `86af6nf1j`. 🔴 **No inventory field records a SOFTWARE VERSION
  anywhere**, and 🔴 **the Puck is in NO inventory list** (propose-only per J9 — Michael's row to create).
- **11 networked records** (`NETWORK (IP) Devices`, `901326711635`, zero native): Ion · LX Mac Mini ·
  Designer RVI · Sloan Mac Mini (QLab primary) · Sloan Mac Mini (recording rack) · Sloan MacBook Pro
  (QLab remote) · SM Cue View (x2) · SND iPad · SPAC\_Yam\_QL5 · Utility iMac · VOR iMac.
- **FIVE named SPAC networks** (`901329167006`): CONTROL NET · DANTE PRIMARY · DANTE SECONDARY · LX NET ·
  UR NET — 🔴 all `zero`, all descriptions EMPTY.
- **Todd dimming: CEM3 in both Sensor racks** (`86ak89jh1`), control input sACN / Art-Net / DMX — Vinny's.
- Students program on this rig; teaching convention and show convention may differ.

## ❓ Ledger D — The ask list (answer these before diagnosing anything)

1. **The Eos point release** — one uncropped About shot now answers BOTH devices.
2. **Which universe becomes the trigger universe**, and **what the trigger macro TARGETS** (blocks A1).
3. 🔴 **Does any of the five SPAC networks have an access point?** Ulla's, unanswered.
4. **Which named network is `10.101.x.x` and which is `192.168.0.x`?**
5. **What else is on the system the inventory does not know about?** The Puck proves the list is
   incomplete; `User ID: 2` implies at least one other ID in use.
6. **Is the wing meant to be a backup?** It cannot be as a Client, and that may be a surprise.
7. **Output method + universe count per space** · **show-file custody** · **cue-only vs tracking** ·
   **palette / magic-sheet convention** · **patch numbering** (Ledger B).

## 🧱 Lane patterns

- ⭐ **EARNED 2026-10-04: a photo he called useless carried four facts and an inventory gap.** He sent an
  `About: Device` shot for the version, the version column was cropped, and he wrote it off. The **left**
  column held an unrecorded device, the lane's first two real IPs, and live confirmation of the sACN
  priority A1 depends on. **Read the whole artifact, not the field you asked for**, and say so when the
  user's own evidence beats the user's question.
- ⭐ **THE DECIDING QUESTION BEATS THE SURVEY.** The sACN-vs-OSC-vs-MIDI fork collapsed on *what can that
  software actually SEND?* **Eliminate branches; do not rank them.**
- ⭐ **BORN WITH ONE:** a catalogue is not a diagnosis.
- ⭐ **Check whether the behaviour is a DEFECT before building a configuration story.** Release notes first.
- ⭐ **EARNED 2026-10-03: the answer to "what do we run" was already written down, by him.**
- ⭐ **EARNED 2026-10-04: he is often asking to be REMINDED, not taught.** See the fluency file.
- ⭐ **EARNED 2026-10-04: a NEW piece of kit changes old answers.** The wing arrived after A1 was written
  and immediately added a constraint to it. **When he names new hardware, re-check what is already ruled.**

## 🔌 Seams

Greer = the look · Vinny = power + pin patch + fixture firmware · Ulla = the wire · Dexter = software
generally · Milo = the production and THE CALL. **Swap-the-desk test settles ambiguity.**

## 📝 Activity

ClickUp-first on the Agent Index row per `hooks/activity-log-clickup-native.md`. Substance to the entity;
the row gets a dated pointer line. 🚫 No git activity log.
