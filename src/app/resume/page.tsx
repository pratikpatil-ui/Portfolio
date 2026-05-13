import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { SOCIAL, RESUME_PDF_PATH } from '@/lib/constants'
import { profile } from '@/content/profile'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume for Pratik Patil, Senior Software Engineer, Full Stack. 7 years of production engineering. React, React Native, TypeScript, Node.js, AI product UI.',
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-[var(--color-border-muted)] pb-1 font-mono text-[12px] tracking-widest text-[var(--color-fg-muted)] uppercase">
      {children}
    </h2>
  )
}

function Role({
  title,
  company,
  dates,
  location,
  children,
}: {
  title: string
  company: string
  dates: string
  location: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <p className="text-body text-[var(--color-fg)]">
          <strong>{title}</strong>, {company}
        </p>
        <p className="font-mono text-[12px] text-[var(--color-fg-subtle)]">
          {dates} · {location}
        </p>
      </div>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-[var(--color-fg-muted)]">
        {children}
      </ul>
    </div>
  )
}

export default function ResumePage() {
  return (
    <Section>
      <Container size="narrow">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                Resume
              </p>
              <h1 className="text-h1 text-[var(--color-fg)]">Pratik Patil</h1>
              <p className="text-body text-[var(--color-fg-muted)]">
                Senior Software Engineer, Full Stack. Same content as the PDF.
              </p>
            </div>
            <a
              href={RESUME_PDF_PATH}
              download
              className="no-print inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2 text-caption font-medium text-[var(--color-accent-fg)] hover:brightness-110"
            >
              Download PDF
            </a>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-[var(--color-fg-muted)]">
            <span>{profile.location}</span>
            <a href={`mailto:${SOCIAL.email}`} className="hover:text-[var(--color-fg)]">
              {SOCIAL.email}
            </a>
            <span>{profile.phone}</span>
            <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--color-fg)]">
              linkedin.com/in/pratik-patil-ui
            </a>
            <a href={SOCIAL.github} target="_blank" rel="noreferrer" className="hover:text-[var(--color-fg)]">
              github.com/pratikpatil-ui
            </a>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <H2>Summary</H2>
            <p className="text-body text-[var(--color-fg-muted)]">
              Senior software engineer with 7 years of production experience in React, React Native,
              TypeScript, and Node.js. Sole frontend architect at an enterprise SaaS for banking
              compliance distributed under a Microsoft partnership. Shipped AI product UIs with SSE
              streaming and embedded BI, a 10K-node D3.js graph at 60fps, and a 7-day React 18
              migration that cut Time to Interactive from 7.2s to 2s.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <H2>Core technical skills</H2>
            <ul className="grid grid-cols-1 gap-1.5 text-body text-[var(--color-fg-muted)] sm:grid-cols-2">
              <li>
                <strong className="text-[var(--color-fg)]">Frontend:</strong> React 18, React
                Native, Next.js, TypeScript, Redux Toolkit, React Router, Tailwind, Material UI
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">AI / LLM UI:</strong> SSE streaming,
                Anthropic SDK, Vercel AI SDK, structured output, embedded BI
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">Data viz:</strong> D3.js v7, Canvas, Web
                Workers, React Flow, Apache Superset
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">Backend:</strong> Node.js, Express,
                NestJS, Python, REST, GraphQL, PostgreSQL, Firebase
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">Performance:</strong> Lighthouse,
                code-splitting, Web Workers, profiling, bundle analysis
              </li>
              <li>
                <strong className="text-[var(--color-fg)]">Tooling:</strong> Vite, Webpack, Vercel,
                Azure, GitHub Actions, Sentry, PostHog
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <H2>Professional experience</H2>

            <Role
              title="Senior Software Engineer, Full Stack"
              company="BDIPlus"
              dates="Jul 2022 to Apr 2026"
              location="New York, NY"
            >
              <li>
                Sole frontend architect on a 28-module React 18 banking compliance and customer
                data SaaS distributed under a Microsoft partnership.
              </li>
              <li>
                Led a 7-day React 18 migration that cut Time to Interactive from 7.2s to 2s,
                verified in Lighthouse.
              </li>
              <li>
                Engineered a 10K-node D3.js customer network graph as a star-field universe view,
                canvas-based with the force simulation in a Web Worker.
              </li>
              <li>
                Architected ChatCDP, an LLM chat surface used by brokerage analysts: SSE streaming,
                structured output rendering, embedded Apache Superset dashboards inside chat.
              </li>
              <li>
                Shipped a React Native retail app (ModenX) to iOS and Google Play in 3 months with
                no prior mobile experience, coordinating a 5-engineer team.
              </li>
              <li>
                Built a configuration-driven UI layer for a health-insurance California rollout:
                forms, validations, eligibility rules, and disclosure copy all render from a JSON
                schema.
              </li>
              <li>Mentored 3 junior engineers.</li>
            </Role>

            <Role
              title="Application Development Analyst"
              company="Accenture"
              dates="Oct 2018 to Jul 2021"
              location="Pune, India"
            >
              <li>
                Built Python automation for a Fortune 500 client: validated and geocoded 1.2M
                addresses across 195 countries.
              </li>
              <li>
                Delivered 4x throughput over legacy workflows and 96% data-quality improvement,
                supporting £330K GBP client bid wins.
              </li>
              <li>
                Received Apex Award for Innovation and Thought Leadership and BT Spark Award for
                Standard Performer.
              </li>
            </Role>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <H2>Selected projects</H2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-body text-[var(--color-fg)]">
                  <strong>Bio Maker</strong>{' '}
                  <a
                    href={SOCIAL.bioMaker}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[12px] text-[var(--color-accent)] hover:underline"
                  >
                    bio-maker-in.vercel.app
                  </a>
                </p>
                <p className="text-body text-[var(--color-fg-muted)]">
                  Live consumer SaaS, marriage biodata generator for Indian families and NRI
                  diaspora. Next.js 15, TypeScript, Tailwind v4, shadcn/ui, jsPDF, html2canvas,
                  Razorpay, Vercel, PostHog. Solo build, marketing site and payment integration
                  included.
                </p>
              </div>
              <div>
                <p className="text-body text-[var(--color-fg)]">
                  <strong>TULSEE</strong>{' '}
                  <a
                    href={SOCIAL.tulsee}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[12px] text-[var(--color-accent)] hover:underline"
                  >
                    github.com/pratikpatil-ui/work-management-collab-tool
                  </a>
                </p>
                <p className="text-body text-[var(--color-fg-muted)]">
                  Open-source real-time work management and collaboration platform with
                  E2E-encrypted group chat and Zoom integration. React, Redux, Next.js, Node.js,
                  Express, Firebase, Socket.IO.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <H2>Education</H2>
            <p className="text-body text-[var(--color-fg-muted)]">
              <strong className="text-[var(--color-fg)]">M.S. Computer Science</strong>, Stevens
              Institute of Technology, Dec 2022. GPA 3.8/4.0.
            </p>
            <p className="text-body text-[var(--color-fg-muted)]">
              <strong className="text-[var(--color-fg)]">B.E. Information Technology</strong>,
              University of Pune, Jun 2018. GPA 3.7/4.0.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <H2>Certifications</H2>
            <p className="text-body text-[var(--color-fg-muted)]">
              Microsoft Certified: Azure Fundamentals (AZ-900), Jan 2021.
            </p>
          </div>

          <div className="no-print pt-6">
            <Link
              href="/contact"
              className="text-caption text-[var(--color-accent)] hover:underline"
            >
              Get in touch →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
