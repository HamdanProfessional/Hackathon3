import { NextRequest, NextResponse } from 'next/server';

const PROGRESS_SERVICE = process.env.NEXT_PUBLIC_PROGRESS_URL;
if (!PROGRESS_SERVICE) {
  throw new Error('NEXT_PUBLIC_PROGRESS_URL environment variable is required');
}

// Helper to forward headers from client request to backend
function getForwardedHeaders(request: NextRequest): HeadersInit {
  const headers: HeadersInit = {};

  // Forward Authorization header if present
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  // Forward other important headers
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  return headers;
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${PROGRESS_SERVICE}/${path}`;

  // Check if this is an SSE (Server-Sent Events) request
  const isSSE = path.includes('/stream');

  try {
    const response = await fetch(url, {
      headers: getForwardedHeaders(request),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `HTTP ${response.status}` }, { status: response.status });
    }

    // Handle SSE streaming responses
    if (isSSE) {
      const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      // Create a readable stream from the response body
      const reader = response.body?.getReader();
      if (!reader) {
        return NextResponse.json({ error: 'Failed to read stream' }, { status: 500 });
      }

      const stream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          } catch (error) {
            console.error('SSE stream error:', error);
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(stream, { headers });
    }

    // Handle regular JSON responses
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from progress service' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${PROGRESS_SERVICE}/${path}`;

  try {
    const body = await request.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: getForwardedHeaders(request),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from progress service' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${PROGRESS_SERVICE}/${path}`;

  try {
    const body = await request.json();
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getForwardedHeaders(request),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from progress service' }, { status: 500 });
  }
}
