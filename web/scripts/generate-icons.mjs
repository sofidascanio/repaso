import sharp from 'sharp';
import { readFileSync } from 'fs';
import { mkdir } from 'fs/promises';

await mkdir('public/icons/app', { recursive: true });

const svg = readFileSync('public/icons/app/icon.svg');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(`public/icons/app/icon-${size}x${size}.png`);
  console.log(`✓ icon-${size}x${size}.png`);
}

await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile('public/icons/app/apple-touch-icon.png');
console.log('✓ apple-touch-icon.png');

await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile('public/favicon.png');
console.log('✓ favicon.png');

console.log('\n Todos los íconos generados.');