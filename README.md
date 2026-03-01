# PixelAPI JavaScript SDK

Official JavaScript/TypeScript client for [PixelAPI](https://pixelapi.dev) — the cheapest AI image generation, background removal, upscaling, and audio generation API.

**10 AI models, one API key, from $0.002/image.**

[![npm](https://img.shields.io/npm/v/pixelapi)](https://www.npmjs.com/package/pixelapi)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install pixelapi
```

## Quick Start

```typescript
import { PixelAPI } from "pixelapi";

const client = new PixelAPI("pk_live_your_key");

// Generate an image ($0.003)
const result = await client.image.generate({ prompt: "a cat astronaut, digital art" });
const completed = await client.generation.wait(result.id);
console.log(completed.outputUrl);
```

## Features

### 🖼️ Image Generation

```typescript
// FLUX Schnell — fast, photorealistic (~3s)
const result = await client.image.generate({
  prompt: "product on marble table, studio lighting",
  model: "flux-schnell",
});

// SDXL — versatile, great for illustrations
const result = await client.image.generate({
  prompt: "watercolor painting of mountains",
  model: "sdxl",
});

const completed = await client.generation.wait(result.id);
console.log(completed.outputUrl);
```

### ✂️ Background Removal — $0.002/image

```typescript
const result = await client.image.removeBackground({
  imageUrl: "https://example.com/product.jpg",
});
const completed = await client.generation.wait(result.id);
console.log(completed.outputUrl); // Transparent PNG
```

### 🎨 Background Replacement — $0.005/image

```typescript
const result = await client.image.replaceBackground({
  imageUrl: "https://example.com/product.jpg",
  prompt: "product on marble countertop, soft studio lighting",
});
```

### 🔍 4x Upscaling — $0.02/image

```typescript
const result = await client.image.upscale({
  imageUrl: "https://example.com/low-res.jpg",
});
```

### 👤 Face Restoration — $0.003/image

```typescript
const result = await client.image.restoreFace({
  imageUrl: "https://example.com/blurry-portrait.jpg",
});
```

### 🧹 Object Removal — $0.005/image

```typescript
const result = await client.image.removeObject({
  imageUrl: "https://example.com/photo.jpg",
  maskUrl: "https://example.com/mask.png",
});
```

### 🎵 AI Music Generation — $0.005/track

```typescript
const result = await client.audio.generate({
  prompt: "upbeat electronic music for a product video",
  duration: 15,
});
const completed = await client.generation.wait(result.id);
console.log(completed.outputUrl); // Audio URL
```

### 🔄 Polling for Results

```typescript
// One-shot check
const status = await client.generation.get("gen_abc123");
console.log(status.status); // "pending" | "processing" | "completed" | "failed"

// Wait until done (timeout in ms)
const completed = await client.generation.wait("gen_abc123", {
  timeout: 120000,
  pollInterval: 2000,
});
```

## Error Handling

```typescript
import { PixelAPI, AuthenticationError, RateLimitError, InsufficientCreditsError } from "pixelapi";

const client = new PixelAPI("pk_live_your_key");

try {
  const result = await client.image.generate({ prompt: "hello world" });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter}s`);
  } else if (error instanceof InsufficientCreditsError) {
    console.error("Not enough credits — top up at pixelapi.dev/app");
  }
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type { Generation, GenerateImageOptions, WaitOptions } from "pixelapi";
```

## API Reference

| Method | Endpoint | Credits |
|--------|----------|---------|
| `client.image.generate()` | POST /v1/image/generate | 3 |
| `client.image.removeBackground()` | POST /v1/image/remove-background | 2 |
| `client.image.upscale()` | POST /v1/image/upscale | 20 |
| `client.image.restoreFace()` | POST /v1/image/restore-face | 3 |
| `client.image.removeObject()` | POST /v1/image/remove-object | 5 |
| `client.image.replaceBackground()` | POST /v1/image/replace-background | 5 |
| `client.audio.generate()` | POST /v1/audio/generate | 5 |
| `client.generation.get()` | GET /v1/image/{id} | 0 |
| `client.generation.wait()` | Polls GET /v1/image/{id} | 0 |

## Requirements

- Node.js 18+ (uses native `fetch`)
- No external dependencies

## Links

- **Documentation:** [pixelapi.dev/docs](https://pixelapi.dev/docs)
- **Dashboard:** [pixelapi.dev/app](https://pixelapi.dev/app)
- **API Reference:** [api.pixelapi.dev/docs](https://api.pixelapi.dev/docs)
- **Support:** support@pixelapi.dev

## License

MIT
