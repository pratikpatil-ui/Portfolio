import Link from 'next/link'
import { Container } from './container'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { SOCIAL } from '@/lib/constants'

const FOOTER_NAV = [
  { href: '/work', label: 'Work' },
  { href: '/lab', label: 'Lab' },
  { href: '/writing', label: 'Writing' },
  { href: '/now', label: 'Now' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-[var(--color-border-muted)]">
      <Container size="wide">
        <div className="flex flex-col gap-6 py-10">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={SOCIAL.github}
                className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              >
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href={SOCIAL.linkedin}
                className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              >
                LinkedIn
              </Link>
            </li>
            <li>
              <Link
                href={`mailto:${SOCIAL.email}`}
                className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              >
                Email
              </Link>
            </li>
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-micro text-[var(--color-fg-subtle)]">
              © Pratik Patil {year}. Built with Next.js, deployed on Vercel.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  )
}
