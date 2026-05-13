import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  context: z.string().max(200).optional().nullable(),
  message: z.string().min(10).max(4000),
  company: z.string().max(200).optional().nullable(),
})

type Payload = z.infer<typeof schema>

async function rateLimit(ip: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return { ok: true }
  try {
    const { Redis } = await import('@upstash/redis')
    const { Ratelimit } = await import('@upstash/ratelimit')
    const redis = new Redis({ url, token })
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: false,
      prefix: 'pp:contact',
    })
    const { success } = await limiter.limit(ip)
    return success ? { ok: true } : { ok: false, reason: 'rate_limit' }
  } catch {
    return { ok: true }
  }
}

async function sendEmail(payload: Payload) {
  const key = process.env.RESEND_API_KEY
  if (!key) return { demo: true }
  const to = process.env.CONTACT_TO_EMAIL || 'pratikpatilui@gmail.com'
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'
  const subject = `Portfolio contact from ${payload.name}`
  const text = `From: ${payload.name} <${payload.email}>
Context: ${payload.context || '(none)'}

${payload.message}
`
  const html = `<p><strong>From:</strong> ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt;</p>
<p><strong>Context:</strong> ${escapeHtml(payload.context || '(none)')}</p>
<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(payload.message)}</pre>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text, html, reply_to: payload.email }),
  })
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: unknown }
    const message = typeof data.message === 'string' ? data.message : 'Email send failed'
    throw new Error(message)
  }
  return { sent: true }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }
  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return NextResponse.json({ ok: true, demo: true })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0'
  const limited = await rateLimit(ip)
  if (!limited.ok) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 })
  }

  try {
    const result = await sendEmail(parsed.data)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'send_failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
