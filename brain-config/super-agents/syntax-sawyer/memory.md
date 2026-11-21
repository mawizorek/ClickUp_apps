# Sawyer · Memory

House practice, not vendor Eos behavior. Vendor claims require correct-release citation. Hot cap ~10KB; archive detail in `memory/archive/`. Read `memory/michael-eos-fluency.md` first.

## Ledger A · Ruled house standards
- **Eos sACN Input event list → macro** is the house trigger mechanism. Shape: Show Control [Tab 11] event list `{Type} {Network}`; event `{sACN}` / `{Action} {Macro}`. Founding sender: sACNView desktop, which sends sACN, not OSC.
- Method confirmed, not a complete standard until trigger universe and macro target are ruled. No universe number yet; recommendation is a dedicated universe with no gateway output. iPad fork parked.
- Vendor facts to re-cite at release: rising edge through 50%/DMX 127, re-arm below; console includes own sACN levels; priority 1-200/default 100/equal priority HTP. Pulse, never park; sACNView Channel Check blink, not fader latch. Priority 100 confirmed on house hardware. User-targeted macro execution is practitioner-grade, not manual text: foreground mode and target active on a real console/RPU/Puck/RVI; remote-app-only user does not receive it.
- **No software on university-managed machines.** IT-managed SM Cue View Mac Mini is not ours; no install/edit/autostart. Ask who administers a machine before designing. Lift only for a department-owned box.
- **SM timer:** Eos internal timecode, no external host. Empty event list 99 `{Type} {SMPTE}`, `{Internal}` ON, `{External}` OFF, `{FPS} 30`, first `00:00:00:00`, last `23:59:59:29`; zero events forever. Background macros `Event 99 / Internal Enable#`, `Event 99 / Internal Time 0#`, `Event 99 / Internal Disable#`; cue external links start/stop; act breaks both. Timecode object on list 99; Status display-only, Widget controls. `SMPTE Time Code RX` must be enabled in Setup ▸ System ▸ Show Control. Display includes frames. Verify untargeted trigger on all devices.
- **SFANW rulings (Michael, 2026-11-21):** 12 student designers, one song each (Intro to LX final), working pre- and post-tech, scattered and selective → the file must be jump-around clean. ONE programming desk, no partitioned two-console programming. Multiple users stay; multiple client devices at the tech tables and the SM. Haze on its own submaster (exclusive, plus an inhibitive kill), not a cue list. Assume no Stars/Moon mark differences, but keep cues referencing working palettes so a cast split stays cheap. Two QLabs: sound QLab built by us, video QLab director-run, Eos prepares the video trigger.

## Ledger B · Open forks
- Trigger universe and macro target (device/user/untargeted); target matters with second user.
- SM magic sheet in: Cue - Active, Cue - Pending, native Clock, timecode stopwatch; video streams OUT, do not re-pitch. Build with caller, dry-run at work call, not dress.
- OSC `sm_timer.py` + LaunchAgent + INSTALL.md parked; revive only on department-owned host. Advantage: clean HH:MM:SS.
- iPad fork parked: ETC iRFR hand-fires; sACNView iOS not show-critical/no blink; Luminair 4 maintained source. Do not raise unprompted.
- Patch numbering belongs to paperwork, unruled.
- **SFANW video trigger:** Michael's proposal: trigger string in the triggering cue's Execute, written by macro into a reserved PART for parsing. Unverified at release: string in Execute, part-level Execute, part creation vs existing timing. Bench on Nomad first. Collab: "SFANW show control list · collaboration · Nov 21" on the Agent Activity Board.
- **SFANW file architecture (proposed 11-21):** song blocks + Block at each song's top; house vs designer palette ranges; AutoMark so no designer writes marks into another's song; per-song jump macros on a tech-table magic sheet; Partial Show Open as per-song rollback; cue-only update default on DESIGNER user. Pixel map + tempo fader + nightly CSV sync still live; partitions dropped.

## Ledger C · Rig/room
- Programming wing: Puck `ETCPUCK-D2BE4D7`, Client, User ID 2, sACN priority 100, Port 1 `10.101.185.101`, Port 2 `192.168.0.91`, Eos 3.3 point release cropped, parameters `1406 of 12288`.
- Client cannot output/control lighting; only Primary (and Backup when Primary down and Master) can output. Backup assignment for Puck unverified.
- Different user IDs give separate command lines. Exact software/library/language/keyboard settings must match; synced Client implies Ion same release, but point release still needs writing.
- `10.101.x.x` is ETC factory-default port-1 scheme, not a UR assignment; mapping to named networks unverified.
- Ion xe20, 11 networked devices, five SPAC networks and Sensor/CEM3 note: `memory/archive/rig-established-2026-10-03.md`; read before wire diagnosis. SM Cue View is two Mac Minis under one IT-locked inventory row; split row is propose-only J9.
- ⚠️ ClickUp USERS list (2026-11-19) reads 2 = DESIGNER, 10 = PROGRAMMER; conflicts with wing at User ID 2. Unresolved.

## Ledger D · Ask list
Eos point release · trigger universe/target · SPAC access point · named-network mapping · unlisted system devices · wing backup intent · department-administered machines · output method/universe per space · show-file custody · cue-only/tracking · palette/magic-sheet convention · patch numbering · SFANW video QLab host · SFANW reserved trigger part number · who owns the transitions between songs.

## Patterns
- Ask who owns host before designing; native desk path may satisfy constraint.
- Scope cuts are decisions; park declined capability with Michael's words.
- Read the whole artifact, not only requested field.
- Ask the deciding question, not a survey; check defect/release before configuration.
- New kit can change settled answers.
- 🔑 **Lead with the playbook, unprompted (2026-11-21).** Michael: "thats kinda a common practice that you should be suggesting far sooner. take ownership of my eos files NOW and try and impress me." Owning the file means volunteering house-grade Eos practice at the FIRST planning pass. Basics land as "pretty base"; the bar is show-specific architecture and tricks. Still never invent a number: propose the convention, he records.
- **Owns the SFANW show file through 12/13** (ownership task "Own the SFANW Eos show file through closing · Syntax Sawyer · Nov 21" on the Agent Activity Board).

## Seams
Greer = look; Vinny = power/patch/firmware; Ulla = wire; Dexter = general software; Milo = production/call; Quinn = callboard/SM needs; Otto = QLab (trigger schema shared ruling); Allison = audio console/signal flow. ClickUp-first activity on Agent Index via `hooks/activity-log-clickup-native.md`; no git activity log.
