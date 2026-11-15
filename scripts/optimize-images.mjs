// Creates lighter WebP copies of the supplied PNG photographs, with permission from the owner.
// - Originals in public/images/ are only READ — never modified, renamed or moved.
// - Copies go to public/images-webp/<same folder>/<name>-<width>.webp (gitignored, regenerated on build).
// - data/image-variants.json lists the widths per original so components can build srcset.
// Up-to-date copies are skipped, so repeat runs are fast.
// Usage: npm run images:webp   (runs automatically before `npm run dev` and `npm run build`)
import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(root, "public", "images");
const outRoot = join(root, "public", "images-webp");
const TARGET_WIDTHS = [480, 960, 1600];
const QUALITY = 80;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.isFile() && e.name.toLowerCase().endsWith(".png") ? [p] : [];
  });
}

const files = walk(srcRoot).sort();
/** @type {Record<string, number[]>} */
const manifest = {};
let made = 0;
let skipped = 0;
let pngBytes = 0;
let webpBytesAtLargest = 0;

for (const file of files) {
  const rel = relative(srcRoot, file).split(sep).join("/");
  const publicPath = `/images/${rel}`;
  const { width } = await sharp(file).metadata();
  if (!width) continue;
  const widths = [...new Set([...TARGET_WIDTHS.filter((w) => w < width), Math.min(width, 1600)])].sort((a, b) => a - b);
  manifest[publicPath] = widths;
  pngBytes += statSync(file).size;
  const srcTime = statSync(file).mtimeMs;

  for (const w of widths) {
    const out = join(outRoot, rel.replace(/\.png$/i, `-${w}.webp`));
    if (existsSync(out) && statSync(out).mtimeMs >= srcTime) {
      skipped++;
    } else {
      mkdirSync(dirname(out), { recursive: true });
      await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 5 }).toFile(out);
      made++;
    }
    if (w === widths[widths.length - 1]) webpBytesAtLargest += statSync(out).size;
  }
}

const sortedManifest = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(root, "data", "image-variants.json"), JSON.stringify(sortedManifest, null, 2) + "\n");

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(
  `WebP: ${files.length} originals · ${made} created · ${skipped} up to date · ` +
    `PNG total ${mb(pngBytes)} MB → largest WebP total ${mb(webpBytesAtLargest)} MB`,
);
