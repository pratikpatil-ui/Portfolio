import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { SOCIAL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Now',
  description: 'What Pratik is working on, learning, reading, and looking for right now.',
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-h3 pt-4 text-[var(--color-fg)]">{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-body text-[var(--color-fg-muted)]">{children}</p>
}

export default function NowPage() {
  return (
    <Section>
      <Container size="narrow">
        <div className="flex flex-col gap-5">
          <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
            Now
          </p>
          <h1 className="text-h1 text-[var(--color-fg)]">What I&apos;m doing right now</h1>
          <p className="font-mono text-[13px] text-[var(--color-fg-subtle)]">Updated May 2026.</p>

          <H2>Where I am</H2>
          <P>Jersey City, NJ. Open to NYC, hybrid, and remote US.</P>

          <H2>What I&apos;m working on</H2>
          <P>
            Job search is the priority. Senior frontend, senior full stack, and AI product UI roles
            in fintech, insurance, and AI products. Building Bio Maker and TULSEE in the margins.
            Sharpening raw React fundamentals on a 14-day plan.
          </P>

          <H2>What I&apos;m learning</H2>
          <P>
            NestJS for backend depth. Prisma migrations on a sample project. Building UIs from raw
            JSX and CSS instead of assembling component libraries.
          </P>

          <H2>What I&apos;m reading</H2>
          <P>Designing Data-Intensive Applications. The Anthropic engineering blog. Stripe Press essays.</P>

          <H2>What I&apos;m looking for</H2>
          <P>
            Senior FE or FS role. $150K to $175K NYC market for FTE. W2 contract or C2C through a
            sponsoring vendor also fine. H1B Transfer required. Available immediately.
          </P>
          <P>
            Email me:{' '}
            <Link
              href={`mailto:${SOCIAL.email}`}
              className="text-[var(--color-accent)] hover:underline"
            >
              {SOCIAL.email}
            </Link>
            .
          </P>

          <p className="pt-8 font-mono text-[12px] text-[var(--color-fg-subtle)]">
            Inspired by Derek Sivers&apos; /now page convention.
          </p>
        </div>
      </Container>
    </Section>
  )
}
