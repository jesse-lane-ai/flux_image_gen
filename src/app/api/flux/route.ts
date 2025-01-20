import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const FLUX_API_BASE_URL = 'https://api.bfl.ml';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-Key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    const body = await request.json();
    const { model, ...requestParams } = body;
    const modelEndpoint = model;

    const response = await axios.post(
      `${FLUX_API_BASE_URL}${modelEndpoint}`,
      requestParams,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Key': apiKey,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in Flux API proxy:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-Key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const response = await axios.get(
      `${FLUX_API_BASE_URL}/v1/get_result/?id=${id}`,
      {
        headers: {
          'X-Key': apiKey,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in Flux API proxy:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}
