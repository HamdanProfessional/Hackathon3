import { NextRequest, NextResponse } from 'next/server';

const DEBUG_SERVICE = process.env.NEXT_PUBLIC_DEBUG_URL || 'http://localhost:8003';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${DEBUG_SERVICE}/${path}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Debug proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from debug service' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${DEBUG_SERVICE}/${path}`;
  try {
    const body = await request.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Debug proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from debug service' }, { status: 500 });
  }
}
