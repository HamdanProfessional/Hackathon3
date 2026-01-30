import { NextRequest, NextResponse } from 'next/server';

const EXERCISE_SERVICE = process.env.NEXT_PUBLIC_EXERCISE_URL;
if (!EXERCISE_SERVICE) {
  throw new Error('NEXT_PUBLIC_EXERCISE_URL environment variable is required');
}

// Helper to forward headers from client request to backend
function getForwardedHeaders(request: NextRequest): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

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
  const url = `${EXERCISE_SERVICE}/${path}`;

  try {
    const response = await fetch(url, {
      headers: getForwardedHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from exercise service' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${EXERCISE_SERVICE}/${path}`;

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
    return NextResponse.json({ error: 'Failed to fetch from exercise service' }, { status: 500 });
  }
}
