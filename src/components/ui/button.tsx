import Link from 'next/link'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:brightness-110 border border-transparent',
  secondary:
    'bg-[var(--color-elevated)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[var(--color-fg-muted)]',
  ghost:
    'bg-transparent text-[var(--color-fg-muted)] border border-[var(--color-border)] hover:text-[var(--color-fg)] hover:border-[var(--color-fg-muted)]',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2 text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

type LinkProps = {
  href: string
  variant?: Variant
  className?: string
  children: ReactNode
  external?: boolean
}

export function LinkButton({ href, variant = 'primary', className, children, external }: LinkProps) {
  const cls = cn(base, variants[variant], className)
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

type ButtonProps = {
  type?: 'button' | 'submit'
  onClick?: () => void
  variant?: Variant
  className?: string
  children: ReactNode
  disabled?: boolean
  ariaLabel?: string
}

export function Button({
  type = 'button',
  onClick,
  variant = 'primary',
  className,
  children,
  disabled,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(base, variants[variant], 'disabled:opacity-50', className)}
    >
      {children}
    </button>
  )
}
