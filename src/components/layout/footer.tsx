import Link from 'next/link'
import { Container } from './container'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { SOCIAL } from '@/lib/constants'

function shortSha() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT_SHA ?? ''
  return sha ? sha.slice(0, 7) : 'local'
}

export function Footer() {
  const sha = shortSha()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-border-muted)]">
      <Container>
        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-micro text-[var(--color-fg-subtle)]">
            © {year} Pratik Patil. Last deployed: {sha}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={SOCIAL.github}
              className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              GitHub
            </Link>
            <Link
              href={SOCIAL.linkedin}
              className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              LinkedIn
            </Link>
            <Link
              href={`mailto:${SOCIAL.email}`}
              className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              Email
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  )
}
