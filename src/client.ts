import {
  PixelAPIError,
  AuthenticationError,
  RateLimitError,
  InsufficientCreditsError,
  NotFoundError,
  ValidationError,
  TimeoutError,
} from "./errors";
import type {
  Generation,
  GenerateImageOptions,
  RemoveBackgroundOptions,
  UpscaleOptions,
  RestoreFaceOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  RemoveTextOptions,
  AddShadowOptions,
  OutpaintOptions,
  GenerateAudioOptions,
  WaitOptions,
  PixelAPIOptions,
} from "./types";

const VERSION = "0.1.0";
const DEFAULT_BASE_URL = "https://api.pixelapi.dev";

function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

function parseGeneration(data: Record<string, unknown>): Generation {
  return {
    id: (data.id as string) || (data.generation_id as string) || "",
    status: (data.status as Generation["status"]) || "pending",
    outputUrl: data.output_url as string | undefined,
    model: data.model as string | undefined,
    creditsUsed: data.credits_used as number | undefined,
    error: data.error as string | undefined,
    createdAt: data.created_at as string | undefined,
    completedAt: data.completed_at as string | undefined,
  };
}

async function handleResponse(response: Response): Promise<Record<string, unknown>> {
  let body: Record<string, unknown>;
  try {
    body = await response.json();
  } catch {
    body = { detail: await response.text().catch(() => "Unknown error") };
  }

  if (response.ok) return body;

  const message = (body.detail || body.error || body.message || "Request failed") as string;
  const status = response.status;

  if (status === 401) throw new AuthenticationError(message, status, body);
  if (status === 402) throw new InsufficientCreditsError(message, status, body);
  if (status === 404) throw new NotFoundError(message, status, body);
  if (status === 422) throw new ValidationError(message, status, body);
  if (status === 429) {
    const retryAfter = response.headers.get("retry-after");
    throw new RateLimitError(message, status, body, retryAfter ? parseFloat(retryAfter) : undefined);
  }
  throw new PixelAPIError(message, status, body);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ImageResource {
  constructor(private request: (method: string, path: string, body?: unknown) => Promise<Record<string, unknown>>) {}

  async generate(options: GenerateImageOptions): Promise<Generation> {
    const { prompt, model = "flux-schnell", ...rest } = options;
    const body = toSnakeCase({ prompt, model, ...rest });
    return parseGeneration(await this.request("POST", "/v1/image/generate", body));
  }

  async removeBackground(options: RemoveBackgroundOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/remove-background", body));
  }

  async upscale(options: UpscaleOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/upscale", body));
  }

  async restoreFace(options: RestoreFaceOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/restore-face", body));
  }

  async removeObject(options: RemoveObjectOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/remove-object", body));
  }

  async replaceBackground(options: ReplaceBackgroundOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/replace-background", body));
  }

  async removeText(options: RemoveTextOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/remove-text", body));
  }

  async addShadow(options: AddShadowOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/add-shadow", body));
  }

  async outpaint(options: OutpaintOptions): Promise<Generation> {
    const body = toSnakeCase(options);
    return parseGeneration(await this.request("POST", "/v1/image/outpaint", body));
  }
}

class AudioResource {
  constructor(private request: (method: string, path: string, body?: unknown) => Promise<Record<string, unknown>>) {}

  async generate(options: GenerateAudioOptions): Promise<Generation> {
    const { prompt, duration = 15, ...rest } = options;
    const body = toSnakeCase({ prompt, duration, ...rest });
    return parseGeneration(await this.request("POST", "/v1/audio/generate", body));
  }
}

class GenerationResource {
  constructor(private request: (method: string, path: string, body?: unknown) => Promise<Record<string, unknown>>) {}

  async get(generationId: string): Promise<Generation> {
    return parseGeneration(await this.request("GET", `/v1/image/${generationId}`));
  }

  async wait(generationId: string, options: WaitOptions = {}): Promise<Generation> {
    const { timeout = 120000, pollInterval = 1000 } = options;
    const deadline = Date.now() + timeout;

    while (true) {
      const gen = await this.get(generationId);

      if (gen.status === "completed") return gen;
      if (gen.status === "failed") {
        throw new PixelAPIError(gen.error || "Generation failed", undefined, { generationId, status: gen.status });
      }
      if (Date.now() >= deadline) {
        throw new TimeoutError(`Generation ${generationId} did not complete within ${timeout}ms`);
      }

      await sleep(pollInterval);
    }
  }
}

export class PixelAPI {
  public readonly image: ImageResource;
  public readonly audio: AudioResource;
  public readonly generation: GenerationResource;

  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(apiKey: string, options: PixelAPIOptions = {}) {
    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = options.timeout || 60000;

    const request = this.request.bind(this);
    this.image = new ImageResource(request);
    this.audio = new AudioResource(request);
    this.generation = new GenerationResource(request);
  }

  private async request(method: string, path: string, body?: unknown): Promise<Record<string, unknown>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": `pixelapi-js/${VERSION}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      return handleResponse(response);
    } finally {
      clearTimeout(timer);
    }
  }
}
