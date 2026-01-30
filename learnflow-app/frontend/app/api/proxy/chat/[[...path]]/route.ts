import { NextRequest, NextResponse } from 'next/server';

const CHAT_SERVICE = process.env.NEXT_PUBLIC_CHAT_URL || 'http://134.209.154.247:30807';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${CHAT_SERVICE}/${path}`;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from chat service' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${CHAT_SERVICE}/${path}`;

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
    return NextResponse.json({ error: 'Failed to fetch from chat service' }, { status: 500 });
  }
}
