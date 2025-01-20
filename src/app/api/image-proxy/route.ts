import { NextRequest, NextResponse } from 'next/server';
import { getApiKey } from '../../../lib/config';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Proxying request to:', url);
    
    // For Azure Storage URLs, we don't need any special headers
    // The SAS token in the URL provides the necessary authentication
    const requestHeaders: HeadersInit = {
      'Accept': 'image/*',
      'User-Agent': 'Mozilla/5.0'
    };
    
    // Make the fetch request
    const response = await fetch(url, { 
      headers: requestHeaders,
      cache: 'no-store'
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
    
    // For Azure Storage blobs, sometimes the content type might come as application/octet-stream
    // We'll check if it's an image by trying to get the buffer
    try {
      const arrayBuffer = await response.arrayBuffer();
      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', contentType || 'image/jpeg'); // Default to image/jpeg if no content type
      responseHeaders.set('Cache-Control', 'no-store');
      responseHeaders.set('Content-Disposition', 'attachment; filename=flux-image.jpg');
      
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: responseHeaders
      });
    } catch (bufferError) {
      console.error('Error processing image buffer:', bufferError);
      return NextResponse.json(
        { error: 'Failed to process image data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
