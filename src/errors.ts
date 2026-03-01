export class PixelAPIError extends Error {
  status?: number;
  body?: Record<string, unknown>;

  constructor(message: string, status?: number, body?: Record<string, unknown>) {
    super(message);
    this.name = "PixelAPIError";
    this.status = status;
    this.body = body;
  }
}

export class AuthenticationError extends PixelAPIError {
  constructor(message = "Invalid or missing API key", status = 401, body?: Record<string, unknown>) {
    super(message, status, body);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends PixelAPIError {
  retryAfter?: number;

  constructor(message = "Rate limit exceeded", status = 429, body?: Record<string, unknown>, retryAfter?: number) {
    super(message, status, body);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class InsufficientCreditsError extends PixelAPIError {
  constructor(message = "Insufficient credits", status = 402, body?: Record<string, unknown>) {
    super(message, status, body);
    this.name = "InsufficientCreditsError";
  }
}

export class NotFoundError extends PixelAPIError {
  constructor(message = "Resource not found", status = 404, body?: Record<string, unknown>) {
    super(message, status, body);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends PixelAPIError {
  constructor(message = "Validation error", status = 422, body?: Record<string, unknown>) {
    super(message, status, body);
    this.name = "ValidationError";
  }
}

export class TimeoutError extends PixelAPIError {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}
