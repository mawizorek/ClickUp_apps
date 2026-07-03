# F1 Racetracks — legacy track-data map

This file maps the trusted plaintext source handoff into the parts that still need promotion.

## Current transition state

- Shell, styles, and logic have been split into named semantic source files.
- **Rounds 10–24 are now promoted into grouped semantic data files.**
- **Rounds 01–09 still rely on the trusted plaintext handoff slices during the transition.**

## Remaining legacy data chunk map

- `index-7_part03_of_11.txt` — Albert Park start + script bootstrap opening
- `index-7_part04_of_11.txt` — Shanghai, Suzuka, Miami
- `index-7_part05_of_11.txt` — Canada, Monaco, Catalunya

## Active grouped data files

- `07_track_data_rounds_10_13.js`
- `08_track_data_rounds_14_24.js`

## Next cleanup target

- `05_track_data_rounds_01_03.js`
- `06_track_data_rounds_06_09.js`

Once those are promoted, the remaining legacy plaintext dependency is gone and the old migration inputs can be removed.