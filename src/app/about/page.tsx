import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Pratik Patil is a senior software engineer focused on AI product UIs, large-scale data visualization, and React platform migrations.',
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-h3 pt-6 text-[var(--color-fg)]">{children}</h2>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-body text-[var(--color-fg-muted)]">{children}</p>
}

export default function AboutPage() {
  return (
    <Section>
      <Container size="narrow">
        <div className="flex flex-col gap-5 leading-relaxed">
          <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
            About
          </p>
          <h1 className="text-h1 text-[var(--color-fg)]">
            A senior engineer who ships AI product surfaces under compliance review.
          </h1>

          <H2>What I work on</H2>
          <P>
            Seven years of production engineering. I am currently sole frontend architect at
            BDIPlus, an enterprise SaaS for banking compliance and customer data platforms
            distributed under a Microsoft partnership. Clients include a Fortune 100 banking
            organization, a Tier-1 retail brokerage, a US health insurance product launched in
            California, and US retail.
          </P>
          <P>
            My sweet spot is AI product UIs that have to survive enterprise compliance review. That
            means LLM chat with SSE streaming, structured output rendering, retry, cancel, error
            recovery, and embedded BI. It also means large-scale data visualization (a 10K-node
            customer network graph at 60fps) and React 18 platform migrations (a 28-module
            codebase moved in a 7-day sprint, Time to Interactive cut from 7.2s to 2s).
          </P>
          <P>
            Earlier, I spent three years at Accenture in Pune building Python automation for a
            Fortune 500 client, validating and geocoding 1.2M addresses across 195 countries with a
            4x throughput improvement and 96% data quality gain.
          </P>

          <H2>How I work</H2>
          <ul className="flex flex-col gap-3 text-body text-[var(--color-fg-muted)]">
            <li>
              <strong className="text-[var(--color-fg)]">Boring decisions first.</strong> Exotic
              only when boring fails. Most teams pay an exotic-stack tax for years.
            </li>
            <li>
              <strong className="text-[var(--color-fg)]">
                Compliance and review are not blockers; they are part of the spec.
              </strong>{' '}
              If the audit team can&apos;t sign off, the feature isn&apos;t shipped.
            </li>
            <li>
              <strong className="text-[var(--color-fg)]">
                A senior engineer&apos;s job is the decision before the code, not just the code.
              </strong>{' '}
              Most production cost lives in choices that look like cosmetic ones.
            </li>
            <li>
              <strong className="text-[var(--color-fg)]">
                Honest performance numbers, measured in Lighthouse, not eyeballed.
              </strong>{' '}
              If I claim 7.2s to 2s, you can verify it in the audit report.
            </li>
          </ul>

          <H2>Outside the IDE</H2>
          <P>
            I run two side projects.{' '}
            <a
              className="text-[var(--color-accent)] hover:underline"
              href="https://bio-maker-in.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              Bio Maker
            </a>{' '}
            is a live consumer SaaS for Indian families and NRI diaspora to generate marriage
            biodata, with client-side PDF export and Razorpay payments.{' '}
            <a
              className="text-[var(--color-accent)] hover:underline"
              href="https://github.com/pratikpatil-ui/work-management-collab-tool"
              target="_blank"
              rel="noreferrer"
            >
              TULSEE
            </a>{' '}
            is an open-source real-time work management tool with E2E-encrypted group chat and Zoom
            integration.
          </P>

          <H2>Awards and education</H2>
          <ul className="flex flex-col gap-2 text-body text-[var(--color-fg-muted)]">
            <li>Apex Award for Innovation and Thought Leadership, Accenture.</li>
            <li>BT Spark Award for Standard Performer, Accenture.</li>
            <li>M.S. Computer Science, Stevens Institute of Technology, Dec 2022, GPA 3.8/4.0.</li>
            <li>B.E. Information Technology, University of Pune, Jun 2018, GPA 3.7/4.0.</li>
            <li>Microsoft Certified: Azure Fundamentals (AZ-900), Jan 2021.</li>
          </ul>
        </div>
      </Container>
    </Section>
  )
}
