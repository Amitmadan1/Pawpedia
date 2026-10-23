export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseBody?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch wrapper with timeout, exponential backoff, and jitter.
 */
export async function apiFetch<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeoutMs = 12000,
    retries = 3,
    retryDelayMs = 1000,
    headers,
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }
        throw new ApiError(
          `Request failed with status ${response.status}: ${response.statusText}`,
          response.status,
          errorBody
        );
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timer);

      const isLastAttempt = attempt >= retries;
      const isAbortError =
        err instanceof Error &&
        (err.name === 'AbortError' || err.message.includes('aborted'));

      let finalError: Error;
      if (isAbortError) {
        finalError = new TimeoutError(`Request timed out after ${timeoutMs}ms`);
      } else if (err instanceof ApiError) {
        finalError = err;
        // Don't retry client errors (4xx) except maybe 429
        if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500 && err.statusCode !== 429) {
          throw finalError;
        }
      } else if (err instanceof Error) {
        finalError = new NetworkError(err.message || 'Network request failed');
      } else {
        finalError = new NetworkError('Unknown network error occurred');
      }

      if (isLastAttempt) {
        throw finalError;
      }

      // Calculate exponential backoff with jitter
      const jitter = Math.random() * 200;
      const delay = Math.pow(2, attempt) * retryDelayMs + jitter;
      attempt++;
      await sleep(delay);
    }
  }

  throw new NetworkError('Max retries exceeded');
}
