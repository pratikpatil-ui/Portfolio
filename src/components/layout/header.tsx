import Link from 'next/link'
import { Container } from './container'

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/lab', label: 'Lab' },
  { href: '/writing', label: 'Writing' },
  { href: '/now', label: 'Now' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-muted)] bg-[color-mix(in_oklch,var(--color-bg)_72%,transparent)] backdrop-blur-md backdrop-saturate-150">
      <Container>
        <div className="flex h-14 items-center justify-between gap-6">
          <Link
            href="/"
            className="text-caption font-medium tracking-tight text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]"
          >
            Pratik Patil
          </Link>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-caption text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  )
}
