# Sawyer — Memory (the desk's house practice)

> **~10KB hot cap.** Graduated content → `memory/archive/`. Measure from the write response, never estimate.
> Vendor-documented Eos behaviour does NOT live here — it lives behind a citation, read at its correct
> release level. **This file holds what ETC does not document: how THIS house drives the desk.**
> Michael's own fluency is a separate file (`memory/michael-eos-fluency.md`) and it is read first.

---

## 📍 Ledger A — RULED house standards

### A1 · 2026-10-04 · The house trigger mechanism is Eos's own sACN Input event list → macro

**Confirmed by Michael, verbatim:** *"I think the eos event list with sacn trigger is all I was looking
for being reminded of."* Shape: a Show Control \[Tab 11\] event list at `{Type} {Network}`, event assigned
`{sACN} <universe>/<address>`, `{Action} {Macro} <n>`. Sender for the founding case is **sACNView**
(desktop), which transmits sACN and cannot speak OSC.

⚠️ **This is a CONFIRMED METHOD, not yet a house standard, and the difference is load-bearing:**

- 🔴 **No universe number has been named.** My recommendation (unchanged, unruled) is a **dedicated
  universe no gateway outputs**, because then no merge rule, no per-address-priority question, and a
  stray level can never become light. Until he names one, there is no standard to apply.
- 🔴 **The iPad fork is PARKED, not decided** — see Ledger B.

**The three vendor behaviours that make or break it** (cited, not stored as opinion — re-read at his
release level before asserting): the threshold is a **rising edge through 50% / DMX 127**, not Full, and it
re-arms only after dropping back below · **the console includes its own sACN levels**, so a patched address
self-fires on every cue that takes it up · priority 1-200, default 100, equal priority merges HTP.
**Pulse, never park** — on desktop sACNView the **Channel Check blink button** is the correct control and a
fader is a latch. ✅ Priority 100 is now CONFIRMED on live house hardware — see Ledger C.

## 🧪 Ledger B — Candidates and open forks (offered, NOT ruled)

- **The trigger universe number.** Open since 2026-10-04. A1 cannot become a standard without it.
- **The iPad fork, PARKED 2026-10-04 after he said the event list was all he needed.** Three roads, all
  real: **ETC iRFR** fires macros natively (no universe, no threshold — my pick for hand-firing) ·
  **sACNView iOS** exists but its own store text says not for show-critical use and it has no Channel
  Check, therefore no blink · **Luminair 4** is the maintained iPad-as-sACN-source. 🚫 Do not re-raise
  unprompted; he closed the thread.
- **Patch numbering convention belongs to the PAPERWORK, and the desk inherits it** (offered to Vale
  2026-10-03, unruled). The plot is what the crew holds at focus. Handoff artifact is the patch itself.

## 🏛️ Ledger C — The rig and the room

### 🔑 Read off a live `About: Device` display, 2026-10-04 (photo Michael sent, cropped)

- 🔴 **There is an ETC PUCK on this system and it is NOT in the inventory.** `Device Name:
  ETCPUCK-D2BE4D7` · `Assigned As: Client` · `User ID: 2` · `Defined Parameters: 1406 of 12288`. The
  `NETWORK (IP) Devices` list has 11 rows and **no Puck in any of them**, and the LX Inventory's only
  console record is the Ion xe20. **A second Eos device exists, runs the software, holds a User ID, and is
  invisible to the workspace.** ⚠️ PROPOSE-ONLY (house rule J9): the missing inventory row is Michael's to
  create; do not create it.
- ✅ **`Priority: sACN=100`** on a live device — the house really is on the sACN default, so A1's
  equal-priority HTP merge is the live condition, not a hypothetical.
- 🔑 **Dual-homed, and these are the FIRST real addresses on any of the five named SPAC networks:**
  `Port 1: 10.101.185.101` · `Port 2: 192.168.0.91`. That matches his own lecture habit — `10.x` on the
  lighting side, `192.x` for computers/consoles. ⚠️ Which port maps to which NAMED network (LX NET,
  CONTROL NET, UR NET…) is NOT established; two addresses are not a topology.
- ⚠️ **Eos `Version 3.3`, point release CROPPED OUT of the photo** — and this is the Puck's About display,
  **not the Ion's**. Eos devices on one system must run matching software to connect, so the Ion being on
  the same 3.3 line is a **strong inference, not a verified fact.** The docs I have cited all session are
  **v3.3.6**, which is inside that line. 🔴 Closing it needs `About` on the Ion itself, or an uncropped
  shot of the right-hand column.

### ✅ Established 2026-10-03 from his own inventory (sources named, values not measured)

- **Primary console: ETC Ion xe20**, `in stock`, **OWNER: SPAC**, **STORAGE LOCATION: SPAC**, purchase
  note **2020**, `IP Device Type: PRIMARY, CONSOLE`. Source: URITP Inventories ▸ INVENTORY ITEMS ▸ LX
  Inventory, task `ITPINV-919` / `86af6nf1j`.
- 🔴 **No field anywhere in the inventory records a SOFTWARE VERSION**, so release level is never derivable
  from the workspace. ⚠️ Whether Todd has its own desk or the Ion travels is UNANSWERED.
- **Networked gear, 11 records** (`NETWORK (IP) Devices`, list `901326711635` — a saved filter built as a
  list, zero native records): the Ion · LX Mac Mini · Designer RVI · Sloan Mac Mini (QLab primary) ·
  Sloan Mac Mini (recording rack) · Sloan MacBook Pro (QLab remote) · SM Cue View (x2 Mac Minis) · SND
  iPad · SPAC\_Yam\_QL5 · Utility iMac · VOR iMac. **The desk shares its world with QLab, a QL5 and two
  SM cue-view machines** — every one of those is a plausible trigger partner.
- **FIVE named networks at SPAC**, from `SPAC DATA NETWORKS` (list `901329167006`, created 2026-09-26):
  **CONTROL NET · DANTE PRIMARY · DANTE SECONDARY · LX NET · UR NET.** 🔴 **All five are status `zero`
  with EMPTY descriptions.** The names are real; the documentation does not exist yet.
- **Todd dimming: CEM3 in both Sensor racks** (LX Fixtures, `86ak89jh1`), control input sACN / Art-Net /
  DMX. Vinny's gear; relevant here only as the thing the desk talks to.

### ⚠️ Inherited and still unverified

- An ETC reference page exists in the Brain Reference Library (*UpdaterAtor, Concert & Selador/S4 LED
  Firmware*). Mostly **fixture firmware** — Vinny's side of the seam.
- Students program on this rig. Teaching convention and show convention may differ.

## ❓ Ledger D — The ask list (answer these before diagnosing anything)

1. 🔴 **The Ion's own Eos release level** — 3.3-something is inferred from the Puck, not read from the Ion.
2. **Which universe becomes the trigger universe** (blocks A1 becoming a standard).
3. 🔴 **Does any of the five SPAC networks have an access point on it?** Ulla's question, unanswered —
   every wireless-remote road dies without one.
4. **Which of the five named networks is `10.101.185.x` and which is `192.168.0.x`?** Two live addresses
   exist now; the mapping does not.
5. **What else is on the system that the inventory does not know about?** The Puck proves the list is
   incomplete, and `User ID: 2` implies at least one other user ID in use.
6. **Output method + universe count per space.**
7. **Show-file custody** · **cue-only vs tracking** · **palette / magic-sheet convention** · **patch
   numbering** (see Ledger B).

## 🧱 Lane patterns

- ⭐ **EARNED 2026-10-04: a photo he called useless carried four facts and an inventory gap.** He sent an
  `About: Device` shot for the version number, the version column was cropped, and he wrote it off. The
  **left** column held a device nobody had recorded, the first two real IPs in the lane, and live
  confirmation of the sACN priority that A1's merge arithmetic depends on. **Read the whole artifact, not
  the field you asked for** — and tell him when his own evidence beat his question.
- ⭐ **THE DECIDING QUESTION BEATS THE SURVEY.** The sACN-vs-OSC-vs-MIDI fork collapsed on *what can that
  software actually SEND?*, answered in two words. **Eliminate branches; do not rank them.**
- ⭐ **BORN WITH ONE:** a catalogue is not a diagnosis.
- ⭐ **Check whether the behaviour is a DEFECT before building a configuration story.** Release notes, not
  the manual.
- ⭐ **EARNED 2026-10-03: the answer to "what do we run" was already written down, by him.** Read his
  writing before asking him anything.
- ⭐ **EARNED 2026-10-04: he is often asking to be REMINDED, not taught.** Full treatment in
  `memory/michael-eos-fluency.md`.

## 🔌 Seams, as written in the profile

Greer = the look · Vinny = power + pin patch + fixture firmware · Ulla = the wire · Dexter = software
generally · Milo = the production and THE CALL. **Swap-the-desk test settles ambiguity.**

## 📝 Activity

ClickUp-first, on the Agent Index row, per `hooks/activity-log-clickup-native.md`. Substance goes to the
entity being worked; the row gets a dated pointer line. 🚫 No git activity log.
