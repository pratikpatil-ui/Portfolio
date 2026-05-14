import Link from 'next/link'
import { Container } from './container'
import { SOCIAL } from '@/lib/constants'
import { caseStudies } from '@/content/case-studies'

// Reuse the same priority as the homepage so the footer surfaces the
// strongest evidence, not a random slice of the case-study array.
const FOOTER_WORK_PRIORITY = ['chatcdp', 'onedata-plus', 'modenx', 'chai-edition', 'bio-maker']
const FOOTER_WORK = FOOTER_WORK_PRIORITY.map((slug) => caseStudies.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c))
  .slice(0, 4)

const SITE_NAV = [
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
        <div className="grid grid-cols-1 gap-10 py-12 sm:py-16 md:grid-cols-12">
          {/* Identity */}
          <div className="flex flex-col gap-3 md:col-span-5">
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[var(--color-fg-muted)] uppercase">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
              />
              Pratik Patil · Senior Software Engineer
            </p>
            <p className="text-body max-w-md text-[var(--color-fg-muted)]">
              AI product UIs, large-scale data viz, and React platform migrations for Fortune 100
              banking, brokerage, and insurance.
            </p>
            <p className="flex items-center gap-2 pt-1 font-mono text-[11px] text-[var(--color-fg-subtle)]">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]"
              />
              Jersey City, NJ · Open to NYC + US remote
            </p>
          </div>

          {/* Site nav */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Site
            </p>
            <ul className="flex flex-col gap-2">
              {SITE_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Selected work */}
          <div className="flex flex-col gap-3 md:col-span-3">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Selected work
            </p>
            <ul className="flex flex-col gap-2">
              {FOOTER_WORK.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/work/${c.slug}`}
                    className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Connect
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href={SOCIAL.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  GitHub
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
              <li>
                <Link
                  href="/contact"
                  className="text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Contact form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-border-muted)] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
            © Pratik Patil {year}. Built with Next.js 16, Tailwind v4, and Vercel.
          </p>
          <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
            <Link
              href="https://github.com/pratikpatil-ui/Portfolio"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-fg)]"
            >
              Source on GitHub →
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  )
}
