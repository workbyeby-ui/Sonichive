const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public');
const QUALITY = 82;
const MAX_DIM = 1920;

let converted = 0, skipped = 0, errors = 0;
let savedBytes = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (/\.(png|jpe?g)$/i.test(e.name)) files.push(full);
  }
  return files;
}

async function convert(src) {
  const ext = path.extname(src);
  const dest = src.slice(0, -ext.length) + '.webp';

  // Skip if webp already exists and is newer
  if (fs.existsSync(dest)) {
    const srcMtime = fs.statSync(src).mtimeMs;
    const destMtime = fs.statSync(dest).mtimeMs;
    if (destMtime >= srcMtime) {
      skipped++;
      return;
    }
  }

  const originalSize = fs.statSync(src).size;

  try {
    let img = sharp(src);
    const meta = await img.metadata();

    // Cap max dimension, preserve aspect ratio
    if (meta.width > MAX_DIM || meta.height > MAX_DIM) {
      img = img.resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true });
    }

    await img.webp({ quality: QUALITY, effort: 4 }).toFile(dest);

    const newSize = fs.statSync(dest).size;
    savedBytes += originalSize - newSize;

    // Delete original after successful conversion
    fs.unlinkSync(src);

    converted++;
    const rel = path.relative(ROOT, src);
    const pct = Math.round((1 - newSize / originalSize) * 100);
    process.stdout.write(`[${converted}] ${rel} — ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (-${pct}%)\n`);
  } catch (err) {
    errors++;
    console.error(`ERROR: ${src}\n  ${err.message}`);
  }
}

async function main() {
  console.log('Scanning images in', ROOT, '...\n');
  const files = walk(ROOT);
  console.log(`Found ${files.length} images. Converting...\n`);

  // Process in batches of 8 for speed
  const BATCH = 8;
  for (let i = 0; i < files.length; i += BATCH) {
    await Promise.all(files.slice(i, i + BATCH).map(convert));
  }

  console.log(`\n✓ Done`);
  console.log(`  Converted : ${converted}`);
  console.log(`  Skipped   : ${skipped} (already up-to-date)`);
  console.log(`  Errors    : ${errors}`);
  console.log(`  Saved     : ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(console.error);
