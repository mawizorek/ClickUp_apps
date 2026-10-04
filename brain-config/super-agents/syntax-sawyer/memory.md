# Sawyer — Memory (the desk's house practice)

> **~10KB hot cap.** Measure from the write response, never estimate. Cold detail lives in
> `memory/archive/`. Vendor-documented Eos behaviour does NOT live here — it lives behind a citation, read
> at its correct release level. **This file holds what ETC does not document: how THIS house drives the
> desk.** Michael's own fluency is a separate file (`memory/michael-eos-fluency.md`), read first.

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

### A2 · 2026-10-04 · 🚫 NO SOFTWARE ON UNIVERSITY-MANAGED MACHINES — applies to EVERY design, forever

Michael, verbatim: *"never gonna happen. that device is locked down and not ours to edit. wrong idea."*
The SM Cue View Mac Mini is IT-managed. **Nothing I propose may require installing, editing, or
auto-starting software on a machine the department does not administer.** This kills, by default:
Bitfocus Companion · QLab plugins · ETCLabs OSCRouter · LaunchAgents and login items · any
brain-on-a-Mac pattern. Only lifted if he names a box the department actually owns.

🔑 **ASK WHO ADMINISTERS A MACHINE BEFORE DESIGNING ONTO IT.** Being on the network is not permission.
🔴 Which of the 11 networked records the department controls is UNKNOWN — Ledger D.

### A3 · 2026-10-04 · The SM running timer is Eos's own INTERNAL TIMECODE clock — native, zero external

Forced by A2 and **better than what it replaced**: no external machine, no OSC, no network config,
nothing installed anywhere. Not built yet, but fully specced.

- **Empty event list**: `Event 99 / Enter`, `{Type} {SMPTE}`, `{Internal}` ON, `{External}` OFF, `{FPS} 30`,
  First `00:00:00:00`, Last `23:59:59:29`. 🔑 **Zero events in it, forever** — then the stopwatch can never
  fire a cue. List 99 keeps it away from real show control.
- **Two macros, Background mode:** `Event 99 / Internal Enable#` + `Event 99 / Internal Time 0#` starts it
  **from zero every run** · `Event 99 / Internal Disable#` freezes it.
- **Cue External Links:** opening → start macro, closing → stop macro, act breaks → both.
- **Sheet:** a `Timecode` object on list 99. **`Timecode Status` is display-only; `Timecode Widget` adds
  CONTROL options** — Status for the SM, Widget for the board, unless the caller wants the handle.
- ⚠️ **`SMPTE Time Code RX` must be ENABLED in Setup ▸ System ▸ Show Control or the internal clock does
  not tick.** Verified forum answer; the setting reads as external-only and is not. Costs an hour if unknown.
- **The cost, stated:** display is `HH:MM:SS:FF` — frames included, no formatting control.
- ⚠️ Macros return, so Target returns, but softer: Background mode, no command line touched. Verify the
  clock shows on all three devices when fired untargeted.

## 🧪 Ledger B — Candidates and open forks (offered, NOT ruled)

- **The trigger universe number.** Open since 2026-10-04. A1 cannot become a standard without it.
- **The macro Target for the trigger** — device, user, or untargeted. New, unruled.
- **The SM magic sheet, SCOPED by him 2026-10-04.** IN: `Cue - Active`, `Cue - Pending`, a native **Clock**,
  and the **A3 timecode stopwatch**. 🚫 **Video streams are OUT.** Verbatim: *"i don't ened to stream video
  no no no. too much"* — native, supported, and declined. **Do not re-pitch unprompted.**
  **Build it with the actual caller; dry run at a work call, never a dress.**
- **The OSC script build, PARKED 2026-10-04 by A2, not deleted.** A tested `sm_timer.py` + LaunchAgent +
  INSTALL.md exist on the session task. 🔑 Its one advantage over A3 is a clean `HH:MM:SS` with no frames.
  Revive only if the department gets a box it administers.
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

### The rest of the rig

The Ion xe20 record, the 11 networked devices, the five named SPAC networks, and the Sensor/CEM3 dimming
note were established 2026-10-03 from his own inventory and now live in
`memory/archive/rig-established-2026-10-03.md`. **Read that file before diagnosing anything on the wire.**
🔑 **The SM display machines are `SM Cue View (x2 Mac Minis)` — TWO machines under ONE inventory row with
ONE name and no IPs, and they are IT-LOCKED (A2).** The magic sheet runs there. That row needs splitting;
propose-only per J9.

## ❓ Ledger D — The ask list (answer these before diagnosing anything)

1. **The Eos point release** — one uncropped About shot now answers BOTH devices. Three reasons now:
   multi-console version match · the 3.3.5 Clock-in-Lockout fix · video-stream floor.
2. **Which universe becomes the trigger universe**, and **what the trigger macro TARGETS** (blocks A1).
3. 🔴 **Does any of the five SPAC networks have an access point?** Ulla's, unanswered.
4. **Which named network is `10.101.x.x` and which is `192.168.0.x`?**
5. **What else is on the system the inventory does not know about?** The Puck proves the list is
   incomplete; `User ID: 2` implies at least one other ID in use.
6. **Is the wing meant to be a backup?** It cannot be as a Client, and that may be a surprise.
7. 🔴 **WHICH MACHINES DOES THE DEPARTMENT ACTUALLY ADMINISTER?** Blocks every design that needs a host (A2).
8. **Output method + universe count per space** · **show-file custody** · **cue-only vs tracking** ·
   **palette / magic-sheet convention** · **patch numbering** (Ledger B).

## 🧱 Lane patterns

- ⭐ **EARNED 2026-10-04, the expensive one: ASK WHO OWNS THE MACHINE BEFORE DESIGNING ONTO IT.** I shipped
  a tested script, a LaunchAgent and an install guide for a Mac he cannot legally touch. The code was fine;
  the **host was never available**, and one question would have found that. **Infrastructure permission is
  a prerequisite, not a deployment detail.** 🔑 And the sequel matters as much: the constraint did not cost
  the feature — **the NATIVE path (internal timecode) existed the whole time.** When a constraint lands,
  look for what the desk can do by itself BEFORE looking for another host.
- ⭐ **EARNED 2026-10-04: when he cuts scope, the cut is the DECISION — record it, do not mourn it.** He
  declined video streaming the moment it read as too much. A declined capability that stays unwritten gets
  re-pitched by the next cold session, which reads as not listening. **Park it with his words attached.**
- ⭐ **EARNED 2026-10-04: a photo he called useless carried four facts and an inventory gap.** The column he
  wanted was cropped; the other column held an unrecorded device, the lane's first two real IPs, and live
  confirmation of the sACN priority A1 depends on. **Read the whole artifact, not the field you asked
  for**, and say so when the user's own evidence beats the user's question.
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
generally · Milo = the production and THE CALL · Quinn = the callboard and what the SM actually needs.
**Swap-the-desk test settles ambiguity.**

## 📝 Activity

ClickUp-first on the Agent Index row per `hooks/activity-log-clickup-native.md`. Substance to the entity;
the row gets a dated pointer line. 🚫 No git activity log.
