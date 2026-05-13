import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'edge'

type Msg = { role: 'user' | 'assistant'; content: string }

const FORBIDDEN_WORDS_LIST = [
  'leverage', // allow-forbidden
  'seamless', // allow-forbidden
  'robust', // allow-forbidden
  'comprehensive', // allow-forbidden
  'holistic', // allow-forbidden
  'synergy', // allow-forbidden
  'delve', // allow-forbidden
  'spearhead', // allow-forbidden
  'passionate', // allow-forbidden
  'thrilled', // allow-forbidden
  'cutting-edge', // allow-forbidden
  'world-class', // allow-forbidden
  'game-changer', // allow-forbidden
  'transformative', // allow-forbidden
].join(', ')

const SYSTEM_PROMPT = `You are Pratik Patil's portfolio assistant. You answer questions visitors have about Pratik's work, experience, skills, and availability.

Style:
- Concise. Two to four sentences per answer unless the question asks for depth.
- Specific. Cite real metrics when relevant.
- Plain English. No corporate filler.
- Never invent details not in your knowledge.
- Never use these words: ${FORBIDDEN_WORDS_LIST}.
- Never use em-dashes or en-dashes. Use periods, commas, semicolons, "and", "but".

Knowledge about Pratik:
- Senior Software Engineer, Full Stack at BDIPlus since July 2022. BDIPlus is an enterprise SaaS for banking compliance and customer data platforms distributed under a Microsoft partnership. Clients: Fortune 100 banking, Tier-1 retail brokerage, US health insurance, US retail.
- 7 years of production engineering experience in React 18, React Native, TypeScript, Next.js, Node.js, Python, and data visualization.

Headline achievements:
- Led a 28-module React 18 migration in a 7-day sprint.
- Cut Time to Interactive from 7.2s to 2s, verified in Lighthouse.
- Engineered a 10K-node D3.js network graph as a star-field universe view, canvas-based with force in a Web Worker.
- Shipped a React Native retail app to iOS and Google Play in 3 months with no prior mobile experience.
- Architected ChatCDP, an LLM chat surface used by brokerage analysts. SSE streaming, structured output rendering, embedded Apache Superset dashboards inside chat. Built reusable LLM primitives for retry, cancel, error recovery, conversation memory.
- Built a configuration-driven UI for an insurance product California rollout: forms, validations, and disclosure copy all render from a JSON schema.
- Coordinated a 5-engineer mobile team. Mentored 3 junior engineers.

Earlier career:
- Application Development Analyst at Accenture for 3 years (Pune, India, Oct 2018 to Jul 2021). Python automation for a Fortune 500 client. Validated and geocoded 1.2M addresses across 195 countries, delivered 4x throughput, 96% data-quality improvement, supported 330K GBP client bid wins.

Education:
- M.S. Computer Science, Stevens Institute of Technology, GPA 3.8/4.0, Dec 2022.
- B.E. Information Technology, University of Pune, GPA 3.7/4.0, Jun 2018.

Certification:
- Microsoft Certified: Azure Fundamentals (AZ-900), Jan 2021.

Location and availability:
- Based in Jersey City, NJ.
- Open to NYC, hybrid, remote US, and relocation anywhere in the US.
- Authorized to work in the US. H1B Transfer required.
- Available immediately.

Side projects:
- Bio Maker, live at https://bio-maker-in.vercel.app. Marriage biodata generator. Next.js 15, TypeScript, Tailwind v4, shadcn/ui, jsPDF, html2canvas, Razorpay, Vercel, PostHog. Solo build.
- TULSEE, open source at https://github.com/pratikpatil-ui/work-management-collab-tool. Real-time work management and collaboration. React, Redux, Next.js, Node.js, Socket.IO, Zoom API, E2E-encrypted group chat.

If asked about hiring, recruiting, or availability:
- Mention work authorization and the H1B Transfer requirement.
- Mention location and openness to remote.
- Offer his email: pratikpatilui@gmail.com.

If asked about something you do not know, say so plainly and offer to email Pratik directly.

Never claim to be Pratik. You are his assistant.`

const FALLBACK_FAQ = [
  "I'm running in fallback mode right now (no API key configured). ",
  "Here's the short version: Pratik is a Senior Software Engineer at BDIPlus, 7 years of production experience in React, React Native, and AI product UIs. ",
  'He led a 28-module React 18 migration in 7 days that cut TTI from 7.2s to 2s, and built a 10K-node D3 graph in canvas with force in a Web Worker. ',
  'He architected ChatCDP, an LLM chat surface for brokerage analysts with SSE streaming and embedded Superset. ',
  'Authorized to work in the US, H1B Transfer required, available immediately. ',
  'Email: pratikpatilui@gmail.com.',
]

function sseEncoder() {
  const encoder = new TextEncoder()
  return {
    msg(data: object) {
      return encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
    },
    done() {
      return encoder.encode('data: [DONE]\n\n')
    },
  }
}

function streamFallback() {
  const enc = sseEncoder()
  let i = 0
  return new ReadableStream({
    start(controller) {
      const tick = () => {
        const chunk = FALLBACK_FAQ[i]
        if (chunk === undefined) {
          controller.enqueue(enc.done())
          controller.close()
          return
        }
        controller.enqueue(enc.msg({ text: chunk }))
        i++
        setTimeout(tick, 220)
      }
      tick()
    },
  })
}

async function checkRateLimit(ip: string): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return { ok: true }
  try {
    const { Redis } = await import('@upstash/redis')
    const { Ratelimit } = await import('@upstash/ratelimit')
    const redis = new Redis({ url, token })
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '24 h'),
      analytics: false,
      prefix: 'pp:chat',
    })
    const { success } = await limiter.limit(ip)
    return success ? { ok: true } : { ok: false, reason: 'rate_limit' }
  } catch {
    return { ok: true }
  }
}

export async function POST(req: Request) {
  let body: { messages?: Msg[] } = {}
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 })
  }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : []
  if (messages.length === 0 || !messages.some((m) => m.role === 'user')) {
    return new Response(JSON.stringify({ error: 'no_user_message' }), { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0'
  const limit = await checkRateLimit(ip)
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: 'rate_limit' }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    })
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return new Response(streamFallback(), {
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
    })
  }

  const enc = sseEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
          model: process.env.GOOGLE_GENERATIVE_AI_MODEL || 'gemini-2.0-flash',
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: { maxOutputTokens: 800 },
        })

        const contents = messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

        const result = await model.generateContentStream({ contents })
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) controller.enqueue(enc.msg({ text }))
        }
        controller.enqueue(enc.done())
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'model_error'
        controller.enqueue(enc.msg({ error: 'model_error', message }))
        controller.enqueue(enc.done())
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  })
}
