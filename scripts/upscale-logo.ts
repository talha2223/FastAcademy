import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
const sourceCandidates = [
  path.join(root, 'public', 'brand', 'logo-source.jpg'),
  path.join(root, 'public', 'brand', 'logo-source.png')
];

const sourcePath = sourceCandidates.find((p) => fs.existsSync(p));
if (!sourcePath) {
  console.error('Logo source not found. Place it at public/brand/logo-source.jpg or .png');
  process.exit(1);
}

const brandOut = path.join(root, 'public', 'brand', 'logo.png');
const iconOut = path.join(root, 'src', 'app', 'icon.png');

async function run() {
  const image = sharp(sourcePath);
  const meta = await image.metadata();
  const width = meta.width ?? 512;
  const height = meta.height ?? 512;

  await image
    .resize(Math.round(width * 2), Math.round(height * 2))
    .png()
    .toFile(brandOut);

  await sharp(sourcePath)
    .resize(512, 512)
    .png()
    .toFile(iconOut);

  console.log('Logo upscaled to', brandOut, 'and icon created at', iconOut);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
