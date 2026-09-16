// Reads every file in /public/images and writes src/lib/image-data.json with each
// photo's local path, intrinsic size and a tiny base64 blur placeholder.
// Run after `npm run images:download`: npm run images:data
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const manifest = JSON.parse(await readFile(new URL("../src/lib/image-manifest.json", import.meta.url)));
const imagesDir = path.resolve("public/images");
const files = await readdir(imagesDir);

const out = {};
const missing = [];

for (const key of Object.keys(manifest)) {
  const file = files.find((f) => f.slice(0, f.lastIndexOf(".")) === key);
  if (!file) {
    missing.push(key);
    continue;
  }

  const buffer = await readFile(path.join(imagesDir, file));
  const image = sharp(buffer);
  const { width, height, pages } = await image.metadata();

  // Animated GIFs are served unoptimised; sharp would flatten them to one frame.
  const animated = (pages ?? 1) > 1;
  const blurDataURL = animated
    ? undefined
    : `data:image/webp;base64,${(await image.resize(16, null, { fit: "inside" }).webp({ quality: 40 }).toBuffer()).toString("base64")}`;

  out[key] = { src: `/images/${file}`, width, height, ...(blurDataURL && { blurDataURL }) };
  process.stdout.write(".");
}

await writeFile(
  new URL("../src/lib/image-data.json", import.meta.url),
  JSON.stringify(out, null, 2) + "\n",
);

console.log(`\nWrote ${Object.keys(out).length} entries to src/lib/image-data.json`);
if (missing.length) {
  console.log(`Missing from public/images (run npm run images:download): ${missing.join(", ")}`);
  process.exitCode = 1;
}
