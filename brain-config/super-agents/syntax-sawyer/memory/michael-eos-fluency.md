# What Michael already knows about ETC Eos

> **HOT file. Read before composing the first answer of any session.** Mandated by
> `gates/tool-fluency-floor.md` §1a and by this bundle's `decision-log.md` D2.
>
> **Every row needs evidence**: a dated verbatim quote, a file he produced, or a vendor citation. 🚫 No
> row may be added by inference about what a production manager "probably" knows.

---

## 📍 The framing that does the real work (inherited from the Vectorworks lane, 2026-09-21)

**There is almost no "doesn't know." There is UNDECIDED and there is UNASKED, and neither is ignorance.**
A decision he has not made is not a gap in his knowledge, and explaining the tool around a decision he is
perfectly able to make is the condescension in its exact mechanism.

## ✅ EVIDENCED (4 rows)

1. **He thinks at the trigger/automation layer of the desk, not the beginner layer.** Evidence, verbatim,
   2026-10-03: *"I have a specific EOS trigger question!"* Nobody arrives at event triggers, macros or
   show control without the fundamentals behind them. 🚫 Do not explain Patch, Record, Update, groups,
   submasters or where the Browser lives.
2. **He runs the department, he does not learn it.** Evidence: his own role — Senior Lecturer /
   Production Manager, URITP — and the fact that the fleet's electrics, rigging, audio, video and network
   seats exist because he drew those lanes himself. He also teaches this rig to students, which means he
   explains Eos for a living.
3. 🔑 **HE TEACHES EOS SHOW CONTROL. He wrote the lecture.** Evidence: his ClickUp lesson page *eos Show
   Control* (URITP Courses ▸ \[123\] LX ▸ ENGL 124 Notes), authored 2025-03-11, last touched 2025-12-04.
   It already contains: show control events as the unit of work, **Tab 11**, the top-half-events /
   bottom-half-lists structure, the one-action-per-event rule, the input-condition → action model with
   cue / submaster / macro actions, foreground-mode macros, and a **complete enumeration of the remote
   trigger types** — RTC, sACN input, analog inputs, relay inputs, ASCII string (serial & UDP), MIDI Show
   Control, MIDI raw, SMPTE, OSC. Plus the RTC setup detail that the console clock is set **in the shell**
   and that lat/long drives sunrise/sunset events. 🚫 **Never explain any of the above to him.** His own
   framing to students is the operational one worth echoing instead: *"you'll need to plan some time to
   troubleshoot this stuff before you need it in the room."*
4. 🔑 **IP addressing and subnetting are also his lecture content.** Evidence: the *Networking general*
   subpage of that same lesson — RFC-1918 private ranges with the 10/8, 172.16/12 and 192.168/16 blocks
   written out, class A/B/C subnet sizing (/8, /16, /24), the ARIN note about 172-space allocation, and
   the local-network topology `console → switch → devices (gateways, fixtures)` alongside the public-network
   version. 🚫 Do not explain a subnet mask, a private range, or what a gateway does.

## 🧩 UNFINISHED is not UNKNOWN — and this is where the value is

His own lecture page has **open edges he left himself**, which are a far better place to be useful than
anything already written:

- The **Art-Net section is an empty heading.** sACN has two vendor quotes and two gateway photos under it;
  Art-Net has the title and nothing else. The sACN-vs-Art-Net comparison exists only in the one blockquote
  at the top of NETWORK PROTOCOLS (the 2.x.x.x / 255.0.0.0 Art-Net default).
- **OSC has two unchecked boxes:** *"show control as well as eos control"* and *"go through Warhol
  connections."*
- **SMPTE timecode is a heading with no body.**
- Two question marks he wrote for himself: **`ETC_NET?`** in the terminology list, and **`why?`** next to
  *192.xxx for computers/consoles, 10.xxx for LX Net.*

⚠️ A question mark in his own teaching notes is an **open question he parked**, not a thing to explain back
at him. Offer the answer to the specific mark; do not re-teach the section it sits in.

## ❓ UNASKED — the live ask list (ask in one line, then move on)

**Eos release level** (the big one — nothing in the inventory records software versions) · whether Nomad is
in the picture · universe count and output method per space · show-file custody · cue-only versus tracking
as house practice · palette and magic-sheet convention · patch numbering logic · what the students are
taught versus what the shows run · whether Todd has its own console or the Ion travels.

## ⚠️ The tell to watch for in your own draft

A sentence that names a menu path, a key location or a pane definition. If the draft contains one, ask
whether he already knows it — and if the answer is uncertain, **the expensive direction is explaining**,
because that resolution is what failed twice in the Vectorworks lane. State the finding; skip the tour.
