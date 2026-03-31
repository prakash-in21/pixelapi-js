/**
 * Example: TypeScript usage with PixelAPI
 */

import { 
  PixelAPI, 
  Generation, 
  GenerateImageOptions,
  PixelAPIError,
  AuthenticationError,
  RateLimitError
} from 'pixelapi';

const apiKey = process.env.PIXELAPI_KEY || 'your_api_key_here';
const client = new PixelAPI(apiKey);

async function generateImage(): Promise<Generation> {
  const options: GenerateImageOptions = {
    prompt: 'A minimalist product photo of a leather wallet',
    model: 'flux-schnell',
    width: 1024,
    height: 1024,
    negativePrompt: 'blurry, low quality'
  };

  try {
    const result = await client.image.generate(options);
    
    console.log('✓ Image generated');
    console.log(`  ID: ${result.id}`);
    console.log(`  URL: ${result.outputUrl}`);
    console.log(`  Model: ${result.model}`);
    console.log(`  Credits: ${result.creditsUsed}`);

    return result;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Invalid API key');
    } else if (error instanceof RateLimitError) {
      console.error(`Rate limit exceeded. Retry after ${error.retryAfter}s`);
    } else if (error instanceof PixelAPIError) {
      console.error(`API error: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}

async function removeBackground(imageUrl: string): Promise<Generation> {
  const result = await client.image.removeBackground({
    image: imageUrl
  });

  console.log('✓ Background removed');
  console.log(`  URL: ${result.outputUrl}`);
  
  return result;
}

async function main() {
  // Generate an image
  const generated = await generateImage();

  // Remove background from a photo
  await removeBackground('https://example.com/product.jpg');

  // Wait for async operation
  if (generated.status === 'pending') {
    console.log('Waiting for generation to complete...');
    const completed = await client.generation.wait(generated.id, {
      timeout: 120000,
      pollInterval: 1000
    });
    console.log('✓ Generation completed:', completed.outputUrl);
  }
}

main().catch(console.error);
