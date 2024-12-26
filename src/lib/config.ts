'use client';

export interface AppConfig {
  fluxApiKey?: string;
}

export function getApiKey(): string | undefined {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_FLUX_API_KEY;
  }
  return process.env.NEXT_PUBLIC_FLUX_API_KEY;
}

export function validateConfig(): boolean {
  const apiKey = getApiKey();
  return !!apiKey;
}
