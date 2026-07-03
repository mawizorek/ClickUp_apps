# F1 Racetracks — legacy track-data map

This file maps the trusted 11-part plaintext source handoff into round/data regions while the semantic source companion is being promoted.

## Current transition state

- Shell, styles, and logic are now called out explicitly in named source files.
- The **track data itself is still trusted from the plaintext handoff slices during this first semantic-source PR**.
- Once this structure is validated, the next cleanup PR can promote the round data into named grouped source files and delete the legacy `index-7_partNN_of_11.txt` inputs.

## Legacy data chunk map

- `index-7_part03_of_11.txt` — footer close + script bootstrap + Albert Park start
- `index-7_part04_of_11.txt` — Shanghai, Suzuka, Miami
- `index-7_part05_of_11.txt` — Canada, Monaco, Catalunya
- `index-7_part06_of_11.txt` — Red Bull Ring, Silverstone
- `index-7_part07_of_11.txt` — Spa, Hungaroring
- `index-7_part08_of_11.txt` — Zandvoort, Monza
- `index-7_part09_of_11.txt` — Madring, remaining stubs, helpers, router, renderHome

## Round grouping target for the next cleanup pass

- `track_data_rounds_01_03`
- `track_data_rounds_06_09`
- `track_data_rounds_10_13`
- `track_data_rounds_14_24`

## Why this interim step exists

The immediate goal of this PR is to stop treating the runtime monolith as the only readable surface and to establish named edit surfaces for:

- head/shell
- styles
- bootstrap/home logic
- track-view logic
- profile/weather/export logic

That is enough to make future navigation sane while keeping the already-trusted plaintext data handoff available during the transition.