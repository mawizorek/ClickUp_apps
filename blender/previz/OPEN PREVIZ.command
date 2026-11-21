#!/bin/bash
# MAW Previz launcher: opens the one .blend in this folder (or makes it, named after the folder) and runs
# the venue link + rig sync + cameras + look. No clicking in Blender.
cd "$(dirname "$0")"
B="/Applications/Blender.app/Contents/MacOS/Blender"
if [ ! -x "$B" ]; then B="$(ls -d /Applications/Blender*.app 2>/dev/null | sort | tail -1)/Contents/MacOS/Blender"; fi
if [ ! -x "$B" ]; then echo "Blender not found in /Applications"; read -n1; exit 1; fi
STEM="$(basename "$PWD")"
BLENDS=( $(ls *.blend 2>/dev/null) )
[ -f "$STEM.mvr" ] || echo "Heads up: no $STEM.mvr here yet. Export it from Vectorworks into this folder with that exact name."
if [ ${#BLENDS[@]} -eq 0 ]; then
  "$B" --python "maw_previz.py" -- --new "$PWD/$STEM.blend" >/dev/null 2>&1 &
elif [ ${#BLENDS[@]} -eq 1 ]; then
  "$B" "${BLENDS[0]}" --python "maw_previz.py" >/dev/null 2>&1 &
else
  echo "Need one .blend in this folder (or none for a fresh start), found ${#BLENDS[@]}"; ls *.blend; read -n1; exit 1
fi
