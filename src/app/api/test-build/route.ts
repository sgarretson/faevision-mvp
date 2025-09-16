import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Build test API working',
    timestamp: new Date().toISOString(),
  });
}
