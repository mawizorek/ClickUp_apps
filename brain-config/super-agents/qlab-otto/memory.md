# Otto · Memory

House practice, not vendor QLab behavior. Vendor claims require correct-version citation. Hot cap ~10KB; archive detail in `memory/archive/`. Read `memory/michael-qlab-fluency.md` first.

## Ledger A · Ruled house standards
- **Trigger chain (BC, ruled 2026-11-07):** Eos (LX console) → Video QLab (OSC) → Audio QLab (OSC). Board op fires a lighting cue, which triggers a video cue, which triggers an audio cue. No dedicated video operator. Audio operator never fires cues. OSC is standard for this house.
- **QLab version:** 5.6.3, Pro Bundle license. Licenses for all machines.
- **Separate sound and video computers (BC, ruled 2026-11-07):** two distinct QLab machines running separate content. Sound-MacMini (Dante Virtual Soundcard 4.5.2.3, 135.254.16.50, 2Gbps, audio into QL5 RX 05+). Mac Studio (video path: Thunderbolt/USB → Blackmagic SDI distribution → 200ft SDI → cyc projector). A second DVS machine, Sound-Macbook at .51, is on the network as a spare or editing node.
- **OSC ports:** Michael documents; assumed working. Implementation details to be planned per show, not re-proven.

## Ledger B · Open forks
- OSC port numbers and address schema between Eos, Video QLab, and Audio QLab: Michael to document. Implementation per show, not re-proven.
- Video output routing from Mac Studio: currently Thunderbolt/USB to Blackmagic. Syphon/NDI not in use for BC.
- Timecode role (QLab as leader vs follower): unruled.
- Workspace template or show-file hygiene standard: unruled.
- QLab workspace naming convention: unruled.

## Ledger C · Rig/room
- **Sound QLab:** Sound-MacMini, 135.254.16.50, Dante Virtual Soundcard 4.5.2.3, 2Gbps link. Audio into QL5 RX 05 through roughly 24 (one-to-one). Spare: Sound-Macbook at .51.
- **Video QLab:** Mac Studio in booth. Output: Thunderbolt/USB → Blackmagic SDI distribution (8 SDI outputs) → output 1 via 200ft SDI → cyc projector. Projector on Relay R132 (208V).
- **Audio console:** Yamaha QL5 at FOH, back house right.
- **Show:** Becoming Curious (F26). Kali Quinn, solo violin + loop pedal. Ghost light prop rolls, carries loop pedal, wireless DMX light, ULX-D wireless (rechargeable, not 9V). Separate violin wireless (commercial system, stage left receiver). Fulcrum DX1526 mains under Cat 3 via Tesira/Ashly amps. Foldback SL+SR via ANI4OUT. Two RCF subs.
- **LX Console:** ETC (Ion xe20 + Puck programming wing, Stephen Petrilli LD).
- **LX designer:** Stephen Petrilli. **Sound/Video designer:** M. Wizorek.

## Ledger D · Ask list
OSC port numbers and address prefix for Eos↔Video QLab and Video QLab↔Audio QLab · exact QL5 Dante output channels for the QLab audio block top · show-file backup practice · whether Arlo's Blender animation exports go to the video QLab machine.

## Patterns
- OSC assumed working; don't re-prove, plan implementation per show.
- Read ThroughLine before every tech session.

## Seams
Tova = sound content; Irene = video content; Allison = console/signal flow; Pierce = projection hardware; Sawyer = Eos desk/triggers; Ulla = network wire; Arlo = Blender handoff; Quinn = SM standards. ClickUp-first activity on Agent Index via `hooks/activity-log-clickup-native.md`; no git activity log.
