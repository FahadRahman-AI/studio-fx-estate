/**
 * Hero image sequence (from footage/hero.mp4, 12 fps). If `count` is 0 the
 * hero falls back to a procedural placeholder walkthrough.
 *
 * To swap the clip, regenerate the frames and set `count` to what's reported:
 *   with ffmpeg:  scripts/extract-frames.sh clip.mp4
 *   macOS only:   swift scripts/extract-frames-mac.swift clip.mp4 <tmpDir> 12
 *                 node scripts/encode-frames.mjs <tmpDir>
 */
export const heroFrames = {
  count: 168,
  /** Folder per width; the scrubber picks the smallest that covers the screen. */
  widths: [1280, 1920] as const,
  path: (width: number, index: number) =>
    `/frames/hero/${width}/frame_${String(index + 1).padStart(4, "0")}.webp`,
};
