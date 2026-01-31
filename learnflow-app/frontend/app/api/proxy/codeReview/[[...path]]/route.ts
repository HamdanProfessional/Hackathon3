import { NextRequest, NextResponse } from 'next/server';

const CODE_REVIEW_SERVICE = process.env.NEXT_PUBLIC_CODE_REVIEW_URL || 'http://localhost:8006';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${CODE_REVIEW_SERVICE}/${path}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Code Review proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from code review service' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path?.join('/') || '';
  const url = `${CODE_REVIEW_SERVICE}/${path}`;
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
    console.error('Code Review proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from code review service' }, { status: 500 });
  }
}
