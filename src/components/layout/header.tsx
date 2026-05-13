'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Container } from './container'
import { Logo } from '@/components/brand/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { openPalette } from '@/lib/events'

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/lab', label: 'Lab' },
  { href: '/writing', label: 'Writing' },
  { href: '/now', label: 'Now' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const pathname = usePathname() ?? '/'

  useEffect(() => {
    // Detect Mac client-side only; the platform string isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent))
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-muted)] bg-[color-mix(in_oklch,var(--color-bg)_72%,transparent)] backdrop-blur-md backdrop-saturate-150">
      <Container size="wide">
        <div className="flex h-14 items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Pratik Patil, home"
            className="inline-flex items-center transition-opacity hover:opacity-80"
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={
                        'relative text-caption transition-colors ' +
                        (active
                          ? 'text-[var(--color-fg)]'
                          : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]')
                      }
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden
                          className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-[var(--color-accent)]"
                        />
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className="hidden items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 font-mono text-[11px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg-muted)] hover:text-[var(--color-fg)] sm:inline-flex"
            >
              <span>{isMac ? '⌘' : 'Ctrl'}</span>
              <span>K</span>
            </button>
            <ThemeToggle />
            <Link
              href="/resume"
              className="hidden rounded-[var(--radius-sm)] border border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-1 text-caption font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-90 md:inline-flex"
            >
              Resume
            </Link>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-fg-muted)] md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-[var(--color-border-muted)] bg-[var(--color-bg)] md:hidden">
          <Container size="wide">
            <ul className="flex flex-col gap-1 py-4">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={
                        'flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-body hover:bg-[var(--color-surface)] ' +
                        (active
                          ? 'text-[var(--color-fg)]'
                          : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]')
                      }
                    >
                      {active ? (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                        />
                      ) : (
                        <span aria-hidden className="h-1.5 w-1.5" />
                      )}
                      {item.label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  href="/resume"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-body text-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]"
                >
                  <span aria-hidden className="h-1.5 w-1.5" />
                  Resume
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
