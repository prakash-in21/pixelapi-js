export type GenerationStatus = "pending" | "processing" | "completed" | "failed";

export interface Generation {
  id: string;
  status: GenerationStatus;
  outputUrl?: string;
  model?: string;
  creditsUsed?: number;
  error?: string;
  createdAt?: string;
  completedAt?: string;
  [key: string]: unknown;
}

export interface GenerateImageOptions {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  [key: string]: unknown;
}

export interface RemoveBackgroundOptions {
  image: string;
  [key: string]: unknown;
}

export interface UpscaleOptions {
  image: string;
  scale?: number;
  [key: string]: unknown;
}

export interface RestoreFaceOptions {
  image: string;
  [key: string]: unknown;
}

export interface RemoveObjectOptions {
  image: string;
  mask: string;
  [key: string]: unknown;
}

export interface ReplaceBackgroundOptions {
  image: string;
  background?: string;
  prompt?: string;
  [key: string]: unknown;
}

export interface RemoveTextOptions {
  image: string;
  [key: string]: unknown;
}

export interface AddShadowOptions {
  image: string;
  shadowOpacity?: number;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  [key: string]: unknown;
}

export interface OutpaintOptions {
  image: string;
  direction?: string;
  pixels?: number;
  prompt?: string;
  [key: string]: unknown;
}

export interface GenerateAudioOptions {
  prompt: string;
  duration?: number;
  [key: string]: unknown;
}

export interface WaitOptions {
  timeout?: number;
  pollInterval?: number;
}

export interface PixelAPIOptions {
  baseUrl?: string;
  timeout?: number;
}
