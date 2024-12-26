import { NextRequest, NextResponse } from 'next/server';
import { getApiKey } from '../../../lib/config';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 401 });
  }

  try {
    console.log('Proxying request to:', url);
    
    // Don't add API key for Azure Storage URLs
    const requestHeaders: HeadersInit = {
      'Accept': 'image/*',
      'User-Agent': 'Mozilla/5.0' // Add User-Agent header
    };
    
    if (!url.includes('delivery-eu1.bfl.ai')) {
      requestHeaders['X-Key'] = apiKey;
    }
    
    const response = await fetch(url, { 
      headers: requestHeaders,
      cache: 'no-store' // Disable caching to avoid stale responses
    });

    console.log('Proxy response status:', response.status);
    console.log('Proxy response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Proxy error response:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('Content-Type');
    console.log('Content-Type:', contentType);
    
    if (!contentType?.startsWith('image/')) {
      const responseText = await response.text();
      console.error('Invalid content type response:', responseText);
      return NextResponse.json(
        { error: `Invalid content type received: ${contentType}` },
        { status: 400 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('Cache-Control', 'no-store'); // Disable caching
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
