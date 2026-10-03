/**
 * Hero image sequence. While `count` is 0 the hero draws a procedural
 * placeholder walkthrough. To use real footage, run
 * `scripts/extract-frames.sh path/to/clip.mp4` and set `count` to the
 * number of frames it reports.
 */
export const heroFrames = {
  count: 0,
  /** Folder per width; the scrubber picks the smallest that covers the screen. */
  widths: [1280, 1920] as const,
  path: (width: number, index: number) =>
    `/frames/hero/${width}/frame_${String(index + 1).padStart(4, "0")}.webp`,
};
