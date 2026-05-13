import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { ContactClient } from './contact-page-client'
import { VisaCaption } from '@/components/home/visa-caption'
import { SOCIAL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Email, LinkedIn, GitHub, or send a form message. Replies within 24 hours.',
}

export default function ContactPage() {
  return (
    <Section>
      <Container size="narrow">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
            Contact
          </p>
          <h1 className="text-h1 text-[var(--color-fg)]">Get in touch</h1>
          <p className="text-body-lg text-[var(--color-fg-muted)]">
            Best routes by speed and signal.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={`mailto:${SOCIAL.email}`}
              className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-elevated)]"
            >
              <p className="font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
                Primary
              </p>
              <p className="text-h3 text-[var(--color-fg)]">Email</p>
              <p className="break-words font-mono text-[13px] text-[var(--color-fg-muted)]">
                {SOCIAL.email}
              </p>
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-elevated)]"
            >
              <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                Network
              </p>
              <p className="text-h3 text-[var(--color-fg)]">LinkedIn</p>
              <p className="break-words font-mono text-[13px] text-[var(--color-fg-muted)]">
                /in/pratik-patil-ui
              </p>
            </a>
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-elevated)]"
            >
              <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                Code
              </p>
              <p className="text-h3 text-[var(--color-fg)]">GitHub</p>
              <p className="break-words font-mono text-[13px] text-[var(--color-fg-muted)]">
                @pratikpatil-ui
              </p>
            </a>
          </div>

          <ContactClient />

          <div className="pt-4">
            <VisaCaption />
          </div>
        </div>
      </Container>
    </Section>
  )
}
