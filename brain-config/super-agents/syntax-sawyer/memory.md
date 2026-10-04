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

## 🧪 Ledger B — Candidates and open forks (offered, NOT ruled)

- **The trigger universe number.** Open since 2026-10-04. A1 cannot become a standard without it.
- **The macro Target for the trigger** — device, user, or untargeted. New, unruled.
- **The SM magic sheet, SCOPED by him 2026-10-04.** IN: `Cue - Active`, `Cue - Pending`, a native **Clock**,
  and one **Command-target box** carrying the OSC timer string — the ticking timer IS the connection
  indicator, because a stale box looks live and a moving clock cannot lie. 🚫 **Video streams are OUT.**
  Verbatim: *"i don't ened to stream video no no no. too much"* — native, supported, and declined. **Do not
  re-pitch unprompted.** 🔴 Still unruled: **which machine is the stopwatch brain** (Eos has no native
  stopwatch; QLab primary is already on the net, Bitfocus Companion is an unverified candidate), OSC TX in
  `Setup ▸ System ▸ Show Control`, and the **Target** for the start/stop macros now that the wing is User
  ID 2. Opening cue External Link starts it, closing cue stops it, act-break cues should fire both so the
  SM report writes itself. **Build it with the actual caller; dry run at a work call, never a dress.**
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
There is also an **SM client computer** on the system, confirmed by him 2026-10-04 — the magic sheet runs
there.

## ❓ Ledger D — The ask list (answer these before diagnosing anything)

1. **The Eos point release** — one uncropped About shot now answers BOTH devices.
2. **Which universe becomes the trigger universe**, and **what the trigger macro TARGETS** (blocks A1).
3. 🔴 **Does any of the five SPAC networks have an access point?** Ulla's, unanswered.
4. **Which named network is `10.101.x.x` and which is `192.168.0.x`?**
5. **What else is on the system the inventory does not know about?** The Puck proves the list is
   incomplete; `User ID: 2` implies at least one other ID in use.
6. **Is the wing meant to be a backup?** It cannot be as a Client, and that may be a surprise.
7. **Which machine holds the SM stopwatch**, and is OSC TX already enabled in Show Control?
8. **Output method + universe count per space** · **show-file custody** · **cue-only vs tracking** ·
   **palette / magic-sheet convention** · **patch numbering** (Ledger B).

## 🧱 Lane patterns

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
