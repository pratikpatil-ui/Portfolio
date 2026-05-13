import { NextResponse } from 'next/server'

export const runtime = 'edge'

export function POST() {
  return NextResponse.json(
    {
      error: 'not_implemented',
      message: 'Contact form ships in Phase 1. Email pratikpatilui@gmail.com directly for now.',
    },
    { status: 501 },
  )
}
