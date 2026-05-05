# PixelAPI — Official JavaScript / TypeScript SDK

Official JS/TS SDK for [PixelAPI](https://pixelapi.dev) — *AI image, video, audio, and 3D API for builders.*

[![npm](https://img.shields.io/npm/v/pixelapi)](https://www.npmjs.com/package/pixelapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why PixelAPI

- **From $0.001 per image** — image gen $0.001, BG removal $0.010, upscale $0.060
- **15 AI tools, one API key** — gen, BG removal, upscale, face restore, object removal, edit, audio, TTS, 3D, moderation, smart-generate, ad creative, image search, portrait, interior design, photo relighting
- **No cold starts** — sub-3-second response on most endpoints
- **100 free credits on signup** — no credit card required
- **TypeScript-first** — full type definitions

## Installation

```bash
npm install pixelapi
# or
yarn add pixelapi
# or
pnpm add pixelapi
```

## Quickstart

```typescript
import { PixelAPI } from "pixelapi";

const client = new PixelAPI("YOUR_API_KEY");  // get free at https://pixelapi.dev/app

// 1. Generate AI image — $0.001
const r1 = await client.generate("product photo of red sneakers");
await r1.save("sneakers.png");

// 2. Remove background — $0.010
const r2 = await client.removeBackground("photo.jpg");
await r2.save("transparent.png");

// 3. Upscale 4× — $0.060
const r3 = await client.upscale("photo.jpg", { scale: 4 });
await r3.save("upscaled.png");
```

## Endpoints

```typescript
client.generate(prompt: string): Promise<Result>
client.removeBackground(image: string | File): Promise<Result>
client.replaceBackground(image, scene: string): Promise<Result>
client.upscale(image, opts: {scale: 2|4}): Promise<Result>
client.faceRestore(image): Promise<Result>
client.removeObject(image, prompt: string): Promise<Result>
client.edit(image, prompt: string): Promise<Result>
client.relight(image, preset: string): Promise<Result>
client.moderate(image): Promise<{nsfw: number, ...}>
client.audio(prompt: string): Promise<Result>
client.tts(text: string, voice: string): Promise<Result>
client.threeD(prompt: string): Promise<Result>
```

## Pricing

| Plan | Monthly | Credits |
|---|---|---|
| Free | $0 | 100 |
| Starter | $10 | 10,000 |
| Pro | $50 | 60,000 |
| Scale | $200 | 300,000 |

## Browser usage (no bundler)

```html
<script type="module">
  import { PixelAPI } from 'https://esm.sh/pixelapi';
  const client = new PixelAPI("YOUR_API_KEY");
  const r = await client.generate("a sunset over mountains");
  document.body.innerHTML = `<img src="${r.outputUrl}">`;
</script>
```

## Error handling

```typescript
import { PixelAPI, AuthError, CreditsError, RateLimitError } from "pixelapi";

try {
  await client.removeBackground("photo.jpg");
} catch (e) {
  if (e instanceof AuthError) console.error("Invalid API key");
  else if (e instanceof CreditsError) console.error("Out of credits");
  else if (e instanceof RateLimitError) console.error("Rate limited");
  else throw e;
}
```

## Migration from remove.bg / Cloudinary

```typescript
// Before
const fd = new FormData();
fd.append("image_file", file);
const r = await fetch("https://api.remove.bg/v1.0/removebg", {
  method: "POST", body: fd,
  headers: { "X-API-Key": REMOVEBG_KEY }
});

// After (11× cheaper, same output)
import { PixelAPI } from "pixelapi";
const client = new PixelAPI(PIXELAPI_KEY);
const result = await client.removeBackground(file);
console.log(result.outputUrl);
```

## Support

- Docs: [pixelapi.dev/docs](https://pixelapi.dev/docs)
- Issues: [GitHub issues](https://github.com/prakash-in21/pixelapi-js/issues)
- Email: support@pixelapi.dev

## License

MIT.

---

Built by [PixelAPI](https://pixelapi.dev). Indian business, GST registered.
