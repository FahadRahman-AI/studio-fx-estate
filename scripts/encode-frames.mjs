// Resize decoded JPEG frames into the hero's WebP sequence at each width.
// Usage: node scripts/encode-frames.mjs <jpegDir>
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [1280, 1920];
const QUALITY = 72;

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/encode-frames.mjs <jpegDir>");
  process.exit(1);
}
const out = path.join(import.meta.dirname, "..", "public", "frames", "hero");
const files = (await readdir(src)).filter((f) => f.endsWith(".jpg")).sort();

for (const width of WIDTHS) {
  const dir = path.join(out, String(width));
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  await Promise.all(
    files.map((f) =>
      sharp(path.join(src, f))
        .resize({ width })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(path.join(dir, f.replace(/\.jpg$/, ".webp"))),
    ),
  );
}

console.log(`Encoded ${files.length} frames per size.`);
console.log(`Set heroFrames.count = ${files.length} in src/lib/frames.ts`);
