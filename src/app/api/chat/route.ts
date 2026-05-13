import { NextResponse } from 'next/server'

export const runtime = 'edge'

const body = {
  error: 'not_implemented',
  message: 'AI assistant ships in Phase 2b. Try again after that session.',
}

export function POST() {
  return NextResponse.json(body, { status: 501 })
}

export function GET() {
  return NextResponse.json(body, { status: 501 })
}
