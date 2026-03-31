/**
 * Example: Background removal with PixelAPI
 */

import { PixelAPI } from 'pixelapi';
import fs from 'fs';

const apiKey = process.env.PIXELAPI_KEY || 'your_api_key_here';
const client = new PixelAPI(apiKey);

async function main() {
  // Remove background from single image
  console.log('Removing background...');
  const result = await client.image.removeBackground({
    image: 'input.jpg'
  });

  console.log('✓ Background removed');
  console.log(`  URL: ${result.outputUrl}`);
  console.log(`  Credits used: ${result.creditsUsed}`);

  // Process from URL
  console.log('\nProcessing from URL...');
  const urlResult = await client.image.removeBackground({
    image: 'https://example.com/photo.jpg'
  });
  
  console.log('✓ Background removed from URL');
  console.log(`  URL: ${urlResult.outputUrl}`);
}

main().catch(console.error);
