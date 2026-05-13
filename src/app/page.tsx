import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { HeroNetwork } from '@/components/hero/hero-network'
import { MetricStrip } from '@/components/home/metric-strip'
import { VisaCaption } from '@/components/home/visa-caption'
import { TeaserCard } from '@/components/home/teaser-card'
import { ContactStrip } from '@/components/home/contact-strip'
import { CaseStudyCard, type CaseStudyTeaser } from '@/components/work/case-study-card'
import { LinkButton } from '@/components/ui/button'
import { OpenAssistantButton } from '@/components/ui/open-assistant-button'

const FEATURED: CaseStudyTeaser[] = [
  {
    slug: 'chatcdp',
    eyebrow: 'AI Product UI',
    title: 'ChatCDP',
    summary: 'An LLM chat surface that brokerage analysts trust enough to use daily.',
    clientFraming: 'Tier-1 retail brokerage',
    role: 'Sole frontend architect',
    techTags: ['React 18', 'SSE', 'Apache Superset', 'TypeScript'],
    featured: true,
  },
  {
    slug: 'onedata-plus',
    eyebrow: 'Data Visualization',
    title: 'OneDATA.Plus 10K-node graph',
    summary:
      'A 10K-node customer network graph that marketing teams actually use to pick outbound targets.',
    clientFraming: 'Enterprise SaaS, banking compliance',
    role: 'Sole frontend architect',
    techTags: ['D3.js', 'Canvas', 'Web Workers', 'React 18'],
    featured: true,
  },
  {
    slug: 'modenx',
    eyebrow: 'Mobile',
    title: 'ModenX',
    summary:
      'A React Native retail app shipped to both stores in three months with no prior mobile experience.',
    clientFraming: 'US retail',
    role: 'Mobile lead',
    techTags: ['React Native', 'TypeScript', 'Redux Toolkit'],
    featured: true,
  },
]

const PROOF_LINES = [
  '28-module React 18 migration in 7 days. TTI 7.2s to 2s.',
  '10K-node D3.js network graph. Live demo below.',
  'LLM chat UI with SSE streaming and embedded BI. Ask the assistant.',
]

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden min-h-[80vh] flex items-center">
        <HeroNetwork />
        <Container size="wide" className="relative z-10 py-20 sm:py-28">
          <div className="flex max-w-3xl flex-col gap-6">
            <h1 className="text-hero text-[var(--color-fg)]">
              I build AI product surfaces that pass bank compliance review.
            </h1>
            <p className="text-body-lg max-w-2xl text-[var(--color-fg-muted)]">
              Senior software engineer. 7 years shipping React, React Native, and LLM product UIs
              for Fortune 100 banking, brokerage, and insurance clients. Sole frontend architect at
              an enterprise SaaS distributed under a Microsoft partnership.
            </p>
            <ul className="flex flex-col gap-2">
              {PROOF_LINES.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 font-mono text-[13px] text-[var(--color-fg-muted)]"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[var(--color-accent)]"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <LinkButton href="/work" variant="primary">
                View work
              </LinkButton>
              <OpenAssistantButton variant="secondary">Ask the assistant</OpenAssistantButton>
              <LinkButton href="/resume" variant="ghost">
                Download resume
              </LinkButton>
            </div>
            <VisaCaption className="pt-1" />
          </div>
        </Container>
      </section>

      <Container size="wide">
        <p className="border-t border-[var(--color-border-muted)] py-8 text-center font-mono text-[14px] text-[var(--color-fg-muted)]">
          Shipped for a Fortune 100 banking client, a Tier-1 retail brokerage, a US health
          insurance product launched in California, and US retail. Sole frontend architect at an
          enterprise SaaS distributed under a Microsoft partnership.
        </p>
      </Container>

      <section className="py-12 sm:py-16">
        <Container size="wide">
          <MetricStrip />
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container size="wide">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                Selected work
              </p>
              <h2 className="text-h2 text-[var(--color-fg)]">Three I would walk through first.</h2>
            </div>
            <Link
              href="/work"
              className="hidden text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] sm:inline"
            >
              All nine case studies →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURED.map((c) => (
              <CaseStudyCard key={c.slug} data={c} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container size="wide">
          <div className="rounded-[var(--radius-md)] border-l-4 border-[var(--color-accent)] border-y border-r border-y-[var(--color-border-muted)] border-r-[var(--color-border-muted)] bg-[var(--color-surface)] p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
                Live now
              </p>
              <h2 className="text-h2 text-[var(--color-fg)]">
                Ask the assistant about Pratik
              </h2>
              <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--color-code-bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--color-fg-muted)] sm:text-[13px]">
{`You:        Tell me about his AI work.
Assistant:  Pratik architected ChatCDP, an LLM chat surface for brokerage
            analysts. SSE streaming, structured output rendering, embedded
            Apache Superset dashboards inside chat. Built reusable
            primitives for retry, cancel, error recovery, and conversation
            memory.`}
              </pre>
              <div>
                <OpenAssistantButton variant="primary">Open the assistant</OpenAssistantButton>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container size="wide">
          <div className="mb-8 flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Lab
            </p>
            <h2 className="text-h2 text-[var(--color-fg)]">Demos you can poke at.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TeaserCard
              href="/lab/force-graph-mini"
              eyebrow="Force graph"
              title="1K-node version of the production D3 graph"
              description="Canvas, force in a Web Worker, drag, zoom, pan. Same rendering pipeline as the 10K-node banking SaaS graph."
            />
            <TeaserCard
              href="/lab/token-streaming-sandbox"
              eyebrow="LLM UI"
              title="Token streaming sandbox"
              description="Adjustable words-per-second to see what 10, 25, and 60 WPS feel like in a chat surface."
            />
            <TeaserCard
              href="/lab/theme-tokens"
              eyebrow="Design system"
              title="Live-tweak this site's design tokens"
              description="OKLCH sliders for the background, foreground, accent, and AI accent. Copy the result as CSS."
            />
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container size="wide">
          <div className="mb-8 flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Writing
            </p>
            <h2 className="text-h2 text-[var(--color-fg)]">Long-form on the work above.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TeaserCard
              href="/writing/react-18-migration-playbook"
              eyebrow="10 min read"
              title="A React 18 migration playbook"
              description="How we cut TTI from 7.2s to 2s in 7 calendar days, day by day."
            />
            <TeaserCard
              href="/writing/d3-at-10k-nodes"
              eyebrow="12 min read"
              title="D3 at 10K nodes"
              description="Canvas over SVG, force in a worker, hit detection, and what 100K would need."
            />
            <TeaserCard
              href="/writing/llm-chat-ui-primitives"
              eyebrow="14 min read"
              title="LLM chat UI primitives"
              description="Ten patterns I rebuilt across three internal chat surfaces. SSE contracts, structured output, retry, cancel."
            />
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container size="wide">
          <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-6">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Now
            </p>
            <p className="text-body text-[var(--color-fg-muted)]">
              Job search is the priority. Senior frontend, senior full stack, and AI product UI
              roles in fintech, insurance, and AI products. Building Bio Maker and TULSEE on the
              side. Sharpening raw React fundamentals on a 14-day plan.
            </p>
            <div>
              <Link
                href="/now"
                className="text-caption text-[var(--color-accent)] hover:underline"
              >
                What I&apos;m doing now →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container size="wide">
          <div className="mb-6 flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Get in touch
            </p>
            <h2 className="text-h2 text-[var(--color-fg)]">Best routes by speed and signal.</h2>
          </div>
          <ContactStrip />
        </Container>
      </section>
    </>
  )
}
