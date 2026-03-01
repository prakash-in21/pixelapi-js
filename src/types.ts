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
  imageUrl: string;
  [key: string]: unknown;
}

export interface UpscaleOptions {
  imageUrl: string;
  [key: string]: unknown;
}

export interface RestoreFaceOptions {
  imageUrl: string;
  [key: string]: unknown;
}

export interface RemoveObjectOptions {
  imageUrl: string;
  maskUrl: string;
  [key: string]: unknown;
}

export interface ReplaceBackgroundOptions {
  imageUrl: string;
  prompt: string;
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
