/**
 * Example: AI Image Generation with PixelAPI
 */

import { PixelAPI } from 'pixelapi';

const apiKey = process.env.PIXELAPI_KEY || 'your_api_key_here';
const client = new PixelAPI(apiKey);

async function main() {
  // Generate image with FLUX
  console.log('Generating image with FLUX Schnell...');
  const fluxResult = await client.image.generate({
    prompt: 'A minimalist product photo of a smartwatch on marble surface, studio lighting',
    model: 'flux-schnell',
    width: 1024,
    height: 1024
  });

  console.log('✓ FLUX image generated');
  console.log(`  URL: ${fluxResult.outputUrl}`);
  console.log(`  Credits used: ${fluxResult.creditsUsed}`);

  // Generate with SDXL
  console.log('\nGenerating image with SDXL...');
  const sdxlResult = await client.image.generate({
    prompt: 'Professional headshot of a business person, neutral background',
    model: 'sdxl',
    width: 1024,
    height: 1024,
    negativePrompt: 'blurry, low quality, distorted'
  });

  console.log('✓ SDXL image generated');
  console.log(`  URL: ${sdxlResult.outputUrl}`);
  console.log(`  Credits used: ${sdxlResult.creditsUsed}`);
}

main().catch(console.error);
