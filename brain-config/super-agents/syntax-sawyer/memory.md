# Sawyer · Memory

House practice, not vendor Eos behavior. Vendor claims require correct-release citation. Hot cap ~10KB; archive detail in `memory/archive/`. Read `memory/michael-eos-fluency.md` first.

## Ledger A · Ruled house standards
- **Eos sACN Input event list → macro** is the house trigger mechanism. Shape: Show Control [Tab 11] event list `{Type} {Network}`; event `{sACN}` / `{Action} {Macro}`. Founding sender: sACNView desktop, which sends sACN, not OSC.
- Method confirmed, not a complete standard until trigger universe and macro target are ruled. No universe number yet; recommendation is a dedicated universe with no gateway output. iPad fork parked.
- Vendor facts to re-cite at release: rising edge through 50%/DMX 127, re-arm below; console includes own sACN levels; priority 1-200/default 100/equal priority HTP. Pulse, never park; sACNView Channel Check blink, not fader latch. Priority 100 confirmed on house hardware. User-targeted macro execution is practitioner-grade, not manual text: foreground mode and target active on a real console/RPU/Puck/RVI; remote-app-only user does not receive it.
- **No software on university-managed machines.** IT-managed SM Cue View Mac Mini is not ours; no install/edit/autostart. Ask who administers a machine before designing. Lift only for a department-owned box.
- **SM timer:** Eos internal timecode, no external host. Empty event list 99 `{Type} {SMPTE}`, `{Internal}` ON, `{External}` OFF, `{FPS} 30`, first `00:00:00:00`, last `23:59:59:29`; zero events forever. Background macros `Event 99 / Internal Enable#`, `Event 99 / Internal Time 0#`, `Event 99 / Internal Disable#`; cue external links start/stop; act breaks both. Timecode object on list 99; Status display-only, Widget controls. `SMPTE Time Code RX` must be enabled in Setup ▸ System ▸ Show Control. Display includes frames. Verify untargeted trigger on all devices.

## Ledger B · Open forks
- Trigger universe and macro target (device/user/untargeted); target matters with second user.
- SM magic sheet in: Cue - Active, Cue - Pending, native Clock, timecode stopwatch; video streams OUT, do not re-pitch. Build with caller, dry-run at work call, not dress.
- OSC `sm_timer.py` + LaunchAgent + INSTALL.md parked; revive only on department-owned host. Advantage: clean HH:MM:SS.
- iPad fork parked: ETC iRFR hand-fires; sACNView iOS not show-critical/no blink; Luminair 4 maintained source. Do not raise unprompted.
- Patch numbering belongs to paperwork, unruled.

## Ledger C · Rig/room
- Programming wing: Puck `ETCPUCK-D2BE4D7`, Client, User ID 2, sACN priority 100, Port 1 `10.101.185.101`, Port 2 `192.168.0.91`, Eos 3.3 point release cropped, parameters `1406 of 12288`.
- Client cannot output/control lighting; only Primary (and Backup when Primary down and Master) can output. Backup assignment for Puck unverified.
- Different user IDs give separate command lines. Exact software/library/language/keyboard settings must match; synced Client implies Ion same release, but point release still needs writing.
- `10.101.x.x` is ETC factory-default port-1 scheme, not a UR assignment; mapping to named networks unverified.
- Ion xe20, 11 networked devices, five SPAC networks and Sensor/CEM3 note: `memory/archive/rig-established-2026-10-03.md`; read before wire diagnosis. SM Cue View is two Mac Minis under one IT-locked inventory row; split row is propose-only J9.

## Ledger D · Ask list
Eos point release · trigger universe/target · SPAC access point · named-network mapping · unlisted system devices · wing backup intent · department-administered machines · output method/universe per space · show-file custody · cue-only/tracking · palette/magic-sheet convention · patch numbering.

## Patterns
- Ask who owns host before designing; native desk path may satisfy constraint.
- Scope cuts are decisions; park declined capability with Michael's words.
- Read the whole artifact, not only requested field.
- Ask the deciding question, not a survey; check defect/release before configuration.
- New kit can change settled answers.

## Seams
Greer = look; Vinny = power/patch/firmware; Ulla = wire; Dexter = general software; Milo = production/call; Quinn = callboard/SM needs. ClickUp-first activity on Agent Index via `hooks/activity-log-clickup-native.md`; no git activity log.
