# 🪡 Pinout Pavel — memory.md

**What this file is:** pointers, verified-vs-assumed facts, measured values from OUR hardware, and the parts we own. **Never procedure** (that is `hooks/bench-build-method.md`). **Never raw data copied from a source** (point at the source).

⚠️ **Ledger C is EMPTY ON PURPOSE** and will stay empty until something is metered. A cold session finding it empty must SAY SO rather than infer a value.

---

## Ledger A — Verified vs assumed pinouts

| Device | Fact | Status | Source |
| --- | --- | --- | --- |
| Clear-Com XLR-4M headset connector | 1 mic low · 2 mic high · 3 earphone low · 4 earphone high | **VERIFIED from vendor docs**, NOT measured on our units | Clear-Com V-Series headset connectors page; Solution Finder XLR-4 pinout |
| Clear-Com RS-701 beltpack | `0.5 × VCC` DC sits between **pin 4 and pin 1** — on the earphone pin | **VERIFIED from the model datasheet** | RS-701 datasheet |
| Clear-Com analog partyline, 3-pin | 1 common · 2 +28-30V DC power · 3 duplex audio **plus 11-15V DC call signalling** | VERIFIED | Clear-Com Solution Finder call-signal spec; Encore + PL-Pro install manuals |
| **Pro Intercom BP-1 / BP-2 headset jack** | Assumed to follow the Clear-Com convention because Pro Intercom advertises "Clear-Com® compatible" | 🔴 **ASSUMED — NOT VERIFIED.** The Pro Intercom *Headset & Handset Pinouts* doc has not been pulled, and *compatible* is not *identical*. **This gates the first solder joint.** | https://prointercomllc.com/technical-information |
| Pro Intercom MS301 program input | 3-pin XLR **pins 1 & 2**, or 1/4" **tip & sleeve**, unbalanced; rear DIP selects line (+4dB) or mic (−20dB) | VERIFIED | MS301 instructions |

## Ledger B — Vendor docs that were wrong, and manufacturer warnings that matter

- 🔴 **Pro Intercom MS301 instructions, verbatim:** *"If Pin 1 is grounded anywhere other than in the MS301 it will create a serious problem."* Also warns that **pin 1/3 reversals happen easily when switching connector gender**, and that a miswire which still passes a microphone test will render an intercom system useless. This is why isolation on a partyline tap is a vendor requirement, not a preference.
- ⚠️ **Clear-Com's own Comprehensive Partyline Guide contradicts itself**: one line reads *"the DC voltage is applied to the XLR3 pin-2 audio conductor"* while every other page (and the same guide one paragraph earlier) has pin 2 = power, pin 3 = audio. Trust the Solution Finder pinout and measure.
- ⚠️ **Clear-Com CCI-22 cannot run standalone** — it needs an Eclipse matrix frame (IMF-3 / IMF-102). Do not price it as a standalone interface.

## Ledger C — Measured values from OUR hardware

**EMPTY.** Nothing metered yet. First readings owed: DC pin 4 → pin 1 and pin 4 → pin 3 on a URITP **BP-1**; pin 1 → pin 3 resistance on a live circuit (expect ~4-5kΩ if correctly terminated); DC on pin 3 at rest and with CALL pressed.

## Ledger D — Parts and stock

**EMPTY.** No transformers, connectors or enclosures confirmed on hand.

## Ledger E — The hardware we have (pointer, not a copy)

URITP / SPAC wired comms is **Pro Intercom**, not Clear-Com: PS301 supply · MS301 3-channel master · 8 × BP-1 · 4 × BP-2 · DMH920 headsets · HH10A handsets. Clear-Com badging is on CC-110 headsets, 3 × KB-702GM speaker stations and the HME DX210 wireless. **Rail is 24VDC.** Source of record: *SPAC Tech Spec v4 AUDIO.pdf*, attached in ClickUp under URITP ▸ Production Management ▸ [INVENTORIES]. ⚠️ Do not re-type that inventory into this file; read it there.

## Ledger F — Market equivalents already priced (so the comparison is never re-run cold)

| Product | What it is | Price |
| --- | --- | --- |
| Pro Intercom **AD903** | Line-powered 2-to-4-wire I/O adapter, transformer isolated both ways, mic-to-line pots, sidetone null | ~$408 MAP |
| AVLifesavers **Combo Intercom Audio Interface** | Taps the 3-pin partyline, audio in OR out, level trim, no power | $185 |
| AVLifesavers **Beltpack Breakout Box** | Taps the 4-pin headset jack, simultaneous in AND out, no trim | $175 |
| AVLifesavers **output-only interface** | Listen-only, stripped | 🔴 unpublished — needs a quote, and ask whether it keeps an output trim |
| Studio Technologies **46A / 47A** | 1RU dual 2-channel hybrids, auto-null, can power the PL | broadcast rack pricing, not quoted |

⭐ Standing read: every commercial option pays for a **hybrid with sidetone nulling**, which only matters if you talk back. Listen-only has no send to null.
