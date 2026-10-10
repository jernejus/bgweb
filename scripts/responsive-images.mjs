// Generates smaller JPEG variants (name-480.jpg, name-800.jpg, name-1200.jpg) used by srcset on phones.
// Originals stay untouched so desktop keeps loading the same full-size files.
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("img");
const widths = [480, 800, 1200];
const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f) && !/-\d+\.jpe?g$/i.test(f));

for (const file of files) {
  const src = path.join(dir, file);
  const { width } = await sharp(src).metadata();
  const base = file.replace(/\.jpe?g$/i, "");

  for (const w of widths) {
    if (w >= width) continue;
    const out = path.join(dir, `${base}-${w}.jpg`);
    await sharp(src).resize({ width: w }).jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(out);
    console.log(`${file} -> ${base}-${w}.jpg`);
  }
}
