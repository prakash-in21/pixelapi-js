# PixelAPI - AI Image Processing API | Background Removal, Upscaling, Generation

Official JavaScript/TypeScript SDK for [PixelAPI](https://pixelapi.dev) — **2x cheaper than alternatives. Powered by bare-metal GPUs.**

[![npm version](https://badge.fury.io/js/pixelapi.svg)](https://www.npmjs.com/package/pixelapi)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why PixelAPI?

- **50% cheaper** than Remove.bg, Cloudinary AI, Replicate
- **Bare-metal GPUs** — no cold starts, consistent speed
- **One API** for background removal, upscaling, generation, object removal, face restoration
- **No usage limits** — process 10,000+ images/day with no throttling
- **Simple pricing** — $0.001–$0.05 per operation, no monthly fees

## Alternatives to Remove.bg & Cloudinary

| Service | Background Removal | 4x Upscale | Image Generation |
|---------|-------------------|------------|------------------|
| PixelAPI | $0.005 | $0.005 | $0.001 |
| Remove.bg | $0.09 | N/A | N/A |
| Cloudinary AI | $0.10 | $0.15 | N/A |
| Replicate | $0.012 | $0.012 | $0.003 |

## Installation

```bash
npm install pixelapi
# or
yarn add pixelapi
# or
pnpm add pixelapi
```

## Quick Start

```javascript
import { PixelAPI } from 'pixelapi';

const client = new PixelAPI('your_api_key');

// Remove background
const result = await client.image.removeBackground({
  image: 'https://example.com/product.jpg'
});
console.log(result.outputUrl); // PNG with transparent background

// Generate image
const generated = await client.image.generate({
  prompt: 'A sunset over mountains',
  model: 'flux-schnell',
  width: 1024,
  height: 1024
});
console.log(generated.outputUrl);

// Upscale 4x
const upscaled = await client.image.upscale({
  image: 'photo.jpg',
  scale: 4
});
console.log(upscaled.outputUrl);
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```typescript
import { PixelAPI, Generation, GenerateImageOptions } from 'pixelapi';

const client = new PixelAPI('your_api_key');

const options: GenerateImageOptions = {
  prompt: 'minimalist product photo',
  model: 'flux-schnell',
  width: 1024,
  height: 1024,
  negativePrompt: 'blurry, low quality'
};

const result: Generation = await client.image.generate(options);
```

## Features

### Background Removal
```javascript
// Remove background → transparent PNG
const result = await client.image.removeBackground({
  image: 'product.jpg'
});

// Replace with new background
const replaced = await client.image.replaceBackground({
  image: 'person.jpg',
  background: 'beach.jpg'
});

// Or generate background from text
const generated = await client.image.replaceBackground({
  image: 'person.jpg',
  prompt: 'professional office background'
});
```

### Image Generation
```javascript
const result = await client.image.generate({
  prompt: 'minimalist product photo of a watch',
  model: 'flux-schnell', // or 'sdxl'
  width: 1024,
  height: 1024,
  negativePrompt: 'blurry, low quality',
  seed: 42 // for reproducibility
});
```

### Image Enhancement
```javascript
// 4x upscaling
const upscaled = await client.image.upscale({
  image: 'photo.jpg',
  scale: 4
});

// Face restoration
const restored = await client.image.restoreFace({
  image: 'old_photo.jpg'
});
```

### Object Manipulation
```javascript
// Remove unwanted objects
const result = await client.image.removeObject({
  image: 'photo.jpg',
  mask: 'mask.png' // white = remove
});
```

### Wait for Completion
```javascript
// For async operations, wait for completion
const generation = await client.image.generate({
  prompt: 'sunset over mountains'
});

// Wait with custom timeout and poll interval
const completed = await client.generation.wait(generation.id, {
  timeout: 120000, // 2 minutes
  pollInterval: 1000 // check every second
});

console.log(completed.outputUrl);
```

### Batch Processing
```javascript
// Process multiple images concurrently
const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

const results = await Promise.all(
  images.map(image => 
    client.image.removeBackground({ image })
  )
);

results.forEach((result, i) => {
  console.log(`Image ${i}: ${result.outputUrl}`);
});
```

### Error Handling
```javascript
import { 
  PixelAPIError, 
  AuthenticationError, 
  RateLimitError,
  InsufficientCreditsError 
} from 'pixelapi';

try {
  const result = await client.image.removeBackground({
    image: 'photo.jpg'
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
    console.log(`Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof InsufficientCreditsError) {
    console.error('Out of credits');
  } else if (error instanceof PixelAPIError) {
    console.error(`API error: ${error.message}`);
  }
}
```

## API Reference

### Client Initialization
```javascript
const client = new PixelAPI(apiKey, {
  baseUrl: 'https://api.pixelapi.dev', // optional
  timeout: 60000 // request timeout in ms, optional
});
```

### Methods

#### Image Operations
- `client.image.generate(options)` - Generate image from text
- `client.image.removeBackground(options)` - Remove image background
- `client.image.replaceBackground(options)` - Replace background
- `client.image.upscale(options)` - Upscale image 2x or 4x
- `client.image.restoreFace(options)` - Restore and enhance faces
- `client.image.removeObject(options)` - Remove objects using mask

#### Generation Management
- `client.generation.get(generationId)` - Get generation status
- `client.generation.wait(generationId, options)` - Wait for completion

### Image Input

All methods accept images as:
- File path (Node.js): `"photo.jpg"`
- URL: `"https://example.com/image.jpg"`
- Base64 string: `"data:image/jpeg;base64,..."`
- Buffer (Node.js): `fs.readFileSync("photo.jpg")`

## Browser Support

Works in modern browsers and Node.js 18+:

```html
<script type="module">
  import { PixelAPI } from 'https://cdn.skypack.dev/pixelapi';
  
  const client = new PixelAPI('your_api_key');
  const result = await client.image.removeBackground({
    image: 'https://example.com/photo.jpg'
  });
  console.log(result.outputUrl);
</script>
```

## Pricing

| Operation | Cost | Remove.bg | Cloudinary |
|-----------|------|-----------|------------|
| Background removal | $0.005 | $0.09 | $0.10 |
| Image generation | $0.001 | N/A | N/A |
| 4x upscale | $0.005 | N/A | $0.15 |
| Face restoration | $0.005 | N/A | $0.12 |
| Object removal | $0.020 | N/A | $0.10 |

No monthly fees. No usage limits. Pay only for what you use.

## Get API Key

1. Visit [https://pixelapi.dev/app/](https://pixelapi.dev/app/)
2. Sign up (free tier includes 100 credits)
3. Copy your API key from dashboard

## Examples

See the [examples/](examples/) directory for complete working examples:

- Background removal
- Image generation
- Batch processing
- Error handling
- TypeScript usage

## Links

- 🌐 [Website](https://pixelapi.dev)
- 📚 [Documentation](https://pixelapi.dev/docs)
- 🔑 [Get API Key](https://pixelapi.dev/app/)
- 💬 [Discord Community](https://discord.gg/pixelapi)

## License

MIT

---

**Keywords**: background removal, image upscaling, AI image generation, object removal, face restoration, image processing API, remove.bg alternative, cloudinary alternative, replicate alternative, AI image API, TypeScript, JavaScript
