import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";

const PUBLIC = new URL("../public", import.meta.url).pathname;

const SKIP = new Set([".svg", ".webp", ".avif", ".ico", ".xml", ".txt", ".json"]);
const TARGETS = [".jpg", ".jpeg", ".png"];

const files = readdirSync(PUBLIC).filter((f) => {
  const ext = extname(f).toLowerCase();
  return TARGETS.includes(ext) && statSync(join(PUBLIC, f)).isFile();
});

let saved = 0;

for (const file of files) {
  const src = join(PUBLIC, file);
  const out = join(PUBLIC, basename(file, extname(file)) + ".webp");
  const before = statSync(src).size;

  try {
    await sharp(src)
      .webp({ quality: 78, effort: 5 })
      .toFile(out);

    const after = statSync(out).size;
    const pct = Math.round((1 - after / before) * 100);
    saved += before - after;
    console.log(`✓ ${file} → ${basename(out)}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (${pct}% smaller)`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log(`\nTotal saved: ${(saved / 1024).toFixed(0)} KB`);
