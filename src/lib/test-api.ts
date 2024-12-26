'use client';

import { request } from 'undici';
import { getApiKey } from './config';

async function testFluxApi() {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    console.log('Testing Flux API...');
    const { statusCode, body } = await request('https://api.bfl.ml/v1/flux-pro-1.1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key': apiKey
      },
      body: JSON.stringify({
        prompt: 'A test image of a beautiful landscape',
        width: 512,
        height: 512,
        steps: 20
      })
    });

    console.log('Status Code:', statusCode);
    const response = await body.json();
    console.log('Response:', response);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testFluxApi();
