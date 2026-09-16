// Downloads every photo from the current WordPress site into /public/images.
// Run: npm run images:download   then: npm run images:data
// Safe to re-run: already-downloaded files are skipped, so an interrupted run resumes.
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const REMOTE = "https://www.srilankaballoon.com/wp-content/uploads/";
const ATTEMPTS = 4;
const TIMEOUT_MS = 30_000;

const manifest = JSON.parse(await readFile(new URL("../src/lib/image-manifest.json", import.meta.url)));
const outDir = path.resolve("public/images");
await mkdir(outDir, { recursive: true });

const onDisk = new Set((await readdir(outDir)).map((f) => f.slice(0, f.lastIndexOf("."))));
const enc = (p) => p.split("/").map(encodeURIComponent).join("/");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

let saved = 0;
let skipped = 0;
const failed = [];

for (const [key, file] of Object.entries(manifest)) {
  if (onDisk.has(key)) {
    skipped++;
    continue;
  }

  // macOS screenshots often use a narrow no-break space (U+202F) before AM/PM — try both.
  const variants = [...new Set([file, file.replace(/ (AM|PM)/, "\u202F$1")])];
  let lastError;

  for (let attempt = 1; attempt <= ATTEMPTS && !onDisk.has(key); attempt++) {
    for (const variant of variants) {
      try {
        const body = await get(REMOTE + enc(variant));
        await writeFile(path.join(outDir, key + path.extname(file)), body);
        onDisk.add(key);
        saved++;
        console.log("✓", key);
        break;
      } catch (err) {
        lastError = err;
      }
    }
    // The WordPress host drops connections under load; back off and try again.
    if (!onDisk.has(key) && attempt < ATTEMPTS) await sleep(attempt * 2000);
  }

  if (!onDisk.has(key)) {
    console.log("✗", key, "—", lastError?.message ?? "unknown error");
    failed.push(`${key}  (${file})`);
  }
}

console.log(`\n${saved} downloaded, ${skipped} already present, ${failed.length} failed — of ${Object.keys(manifest).length}`);
if (failed.length) {
  console.log("Failed (re-run to retry just these):\n  " + failed.join("\n  "));
  process.exitCode = 1;
}
