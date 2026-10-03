#!/usr/bin/env bash
# Turn an FPV clip into the hero's scroll-scrubbed image sequence.
# Usage: scripts/extract-frames.sh clip.mp4 [fps]
# Requires ffmpeg (brew install ffmpeg).
set -euo pipefail

CLIP="${1:?Usage: scripts/extract-frames.sh clip.mp4 [fps]}"
FPS="${2:-12}"   # 12 fps of a ~12s clip ≈ 150 frames — plenty for scrubbing
OUT="$(dirname "$0")/../public/frames/hero"

for W in 1280 1920; do
  rm -rf "$OUT/$W" && mkdir -p "$OUT/$W"
  ffmpeg -loglevel error -i "$CLIP" \
    -vf "fps=$FPS,scale=$W:-2:flags=lanczos" \
    -c:v libwebp -quality 72 -compression_level 6 \
    "$OUT/$W/frame_%04d.webp"
done

COUNT=$(ls "$OUT/1920" | wc -l | tr -d ' ')
echo "Extracted $COUNT frames per size."
echo "Set heroFrames.count = $COUNT in src/lib/frames.ts"
