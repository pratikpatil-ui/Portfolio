import { SOCIAL } from '@/lib/constants'
import { VisaCaption } from './visa-caption'

export function ContactStrip() {
  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <a
          href={`mailto:${SOCIAL.email}`}
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2 text-caption font-medium text-[var(--color-accent-fg)] hover:brightness-110"
        >
          Email pratikpatilui@gmail.com
        </a>
        <a
          href={SOCIAL.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          LinkedIn
        </a>
        <a
          href={SOCIAL.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          GitHub
        </a>
      </div>
      <VisaCaption />
    </div>
  )
}
