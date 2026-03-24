# PixelAPI JavaScript / TypeScript SDK

Official JS/TS SDK for [PixelAPI](https://pixelapi.dev) — AI image processing without the Replicate price tag.

[![npm version](https://badge.fury.io/js/pixelapi.svg)](https://www.npmjs.com/package/pixelapi)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What it does

Background removal, AI product photography, image generation (FLUX/SDXL), 4x upscaling, virtual try-on, object removal, image captioning — all in one API. Runs on owned GPUs (no cold starts, no per-second billing surprises).

Pricing from $0.001/image. Typically 5–10x cheaper than Replicate for the same operations.

## Install

```bash
npm install pixelapi
# or
yarn add pixelapi
```

## Quickstart

```typescript
import PixelAPI from 'pixelapi';

const client = new PixelAPI({ apiKey: 'YOUR_API_KEY' });

// Remove background
const result = await client.removeBackground('product.jpg');
console.log(result.outputUrl); // PNG with transparent background

// AI product photo (remove BG + generate new background)
const photo = await client.productPhoto({
  image: 'shoe.jpg',
  preset: 'white-studio' // gradient-light | marble | outdoor
});

// Add shadow to product
const shadowed = await client.addShadow({
  imageUrl: photo.outputUrl,
  shadowType: 'soft', // soft | hard | natural | floating
  shadowOpacity: 0.5
});

// Auto-caption for SEO / listings
const caption = await client.captionImage({
  image: 'product.jpg',
  mode: 'full' // returns description + tags + alt text + SEO title
});
console.log(caption.tags);    // ["sneaker", "leather", "black"]
console.log(caption.altText); // "Black leather sneaker on white background"
```

## Batch processing (no extra cost)

```javascript
const pLimit = require('p-limit');
const limit = pLimit(10); // 10 concurrent requests

const images = ['product1.jpg', 'product2.jpg', 'product3.jpg'];

const results = await Promise.all(
  images.map(img => limit(() => client.removeBackground(img)))
);

// 500 images × $0.005 = $2.50 total
```

## API reference

| Operation | Method | Cost |
|-----------|--------|------|
| Background removal | `removeBackground()` | $0.005 |
| Image generation | `generateImage()` | $0.001 |
| 4x upscale | `upscale()` | $0.005 |
| AI product photography | `productPhoto()` | $0.075 |
| Add shadow | `addShadow()` | $0.020 |
| Image captioning | `captionImage()` | $0.005 |
| Virtual try-on | `virtualTryon()` | $0.050 |
| Object removal | `removeObject()` | $0.020 |
| Text removal | `removeText()` | $0.020 |
| Face restoration | `restoreFace()` | $0.005 |
| Outpainting | `outpaint()` | $0.030 |

## Links

- [Docs](https://pixelapi.dev/docs.html)
- [Tutorials](https://pixelapi.dev/tutorials/)
- [Get API key](https://pixelapi.dev/app/)

## License

MIT
