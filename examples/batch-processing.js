/**
 * Example: Batch processing with PixelAPI
 */

import { PixelAPI } from 'pixelapi';
import fs from 'fs/promises';
import path from 'path';

const apiKey = process.env.PIXELAPI_KEY || 'your_api_key_here';
const client = new PixelAPI(apiKey);

async function main() {
  const inputDir = 'products';
  const outputDir = 'outputs';

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Get all images from directory
  const files = await fs.readdir(inputDir);
  const images = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  if (images.length === 0) {
    console.log('No images found in products/ directory');
    return;
  }

  console.log(`Processing ${images.length} images...`);

  // Process all images concurrently
  const results = await Promise.all(
    images.map(async (filename) => {
      const imagePath = path.join(inputDir, filename);
      console.log(`Processing ${filename}...`);
      
      const result = await client.image.removeBackground({
        image: imagePath
      });

      return { filename, result };
    })
  );

  // Report results
  console.log('\n✓ Batch processing complete:');
  results.forEach(({ filename, result }) => {
    console.log(`  ${filename} → ${result.outputUrl}`);
  });

  console.log(`\nTotal credits used: ${results.reduce((sum, r) => sum + (r.result.creditsUsed || 0), 0)}`);
}

main().catch(console.error);
