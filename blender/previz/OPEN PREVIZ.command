#!/bin/bash
# MAW Previz launcher: opens the one .blend in this folder and runs the sync + setup. No clicking in Blender.
cd "$(dirname "$0")"
B="/Applications/Blender.app/Contents/MacOS/Blender"
if [ ! -x "$B" ]; then B="$(ls -d /Applications/Blender*.app 2>/dev/null | sort | tail -1)/Contents/MacOS/Blender"; fi
if [ ! -x "$B" ]; then echo "Blender not found in /Applications"; read -n1; exit 1; fi
BLENDS=( $(ls *.blend 2>/dev/null) )
if [ ${#BLENDS[@]} -ne 1 ]; then echo "Need exactly one .blend in this folder, found ${#BLENDS[@]}"; ls *.blend; read -n1; exit 1; fi
STEM="${BLENDS[0]%.blend}"
[ -f "$STEM.mvr" ] || echo "Heads up: no $STEM.mvr here yet. Export it from VWX into this folder with that exact name."
"$B" "${BLENDS[0]}" --python "maw_previz.py" >/dev/null 2>&1 &
