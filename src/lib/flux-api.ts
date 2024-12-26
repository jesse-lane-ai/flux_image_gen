'use client';

import axios from 'axios';
import { getApiKey } from './config';

const FLUX_API_BASE_URL = 'https://api.bfl.ml';

export const FLUX_MODELS = {
  'Flux Pro 1.1': '/v1/flux-pro-1.1',
  'Flux Pro': '/v1/flux-pro',
  'Flux Dev': '/v1/flux-dev',
  'Flux Pro 1.1 Ultra': '/v1/flux-pro-1.1-ultra',
} as const;

export type FluxModel = keyof typeof FLUX_MODELS;

export interface ImageGenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  steps?: number;
  seed?: number;
  model: FluxModel;
  guidance: number;
  prompt_upsampling: boolean
  safety_tolerance: number
  output_format: string;
}

interface GenerationResult {
  sample: string;
  prompt: string;
  seed: number;
  start_time: number;
  end_time: number;
  duration: number;
}

interface GenerationResponse {
  id: string;
  status: 'Ready' | 'Failed' | 'Processing';
  result?: GenerationResult;
  error?: string;
}

async function pollResult(id: string, maxAttempts = 30): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key is not configured');
  }

  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get<GenerationResponse>(`${FLUX_API_BASE_URL}/v1/get_result/?id=${id}`, {
        headers: {
          'X-Key': apiKey
        }
      });

      if (response.data.status === 'Ready' && response.data.result?.sample) {
        return response.data.result.sample;
      }

      if (response.data.status === 'Failed') {
        throw new Error(response.data.error || 'Image generation failed');
      }

      // Wait for 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Polling Error Response:', error.response?.data);
        console.error('Polling Error Status:', error.response?.status);
      }
      throw error;
    }
  }

  throw new Error('Polling timeout: Image generation took too long');
}

export async function generateImage(params: ImageGenerationParams) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const { model, ...requestParams } = params;
    const modelEndpoint = FLUX_MODELS[model];

    const response = await axios.post<GenerationResponse>(`${FLUX_API_BASE_URL}${modelEndpoint}`, requestParams, {
      headers: {
        'Content-Type': 'application/json',
        'X-Key': apiKey
      }
    });

    if (!response.data.id) {
      throw new Error('No generation ID received from the API');
    }

    // Poll for the result
    const imageUrl = await pollResult(response.data.id);
    return imageUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error Response:', error.response?.data);
      console.error('API Error Status:', error.response?.status);
      throw new Error(error.response?.data?.error || 'Failed to generate image');
    }
    throw error;
  }
}

export async function listModels() {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const response = await axios.get(`${FLUX_API_BASE_URL}/models`, {
      headers: {
        'X-Key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error Response:', error.response?.data);
      console.error('API Error Status:', error.response?.status);
      throw new Error(error.response?.data?.error || 'Failed to fetch models');
    }
    throw error;
  }
}
