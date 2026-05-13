import { cn } from '@/lib/cn'

type Props = {
  withWordmark?: boolean
  size?: number
  className?: string
}

export function Logo({ withWordmark = true, size = 24, className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {withWordmark ? (
        <span className="font-display text-[15px] font-semibold tracking-tight text-[var(--color-fg)]">
          Pratik Patil
          <span className="text-[var(--color-accent)]">.</span>
        </span>
      ) : null}
    </span>
  )
}

export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pratik Patil"
    >
      <defs>
        <linearGradient id="pp-frame" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-sage)" />
          <stop offset="1" stopColor="var(--color-sage-deep)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="7" fill="url(#pp-frame)" />
      {/* Geometric P: vertical stem + bowl with negative-space counter */}
      <path
        d="M 10 8 L 10 24 L 12.6 24 L 12.6 19 L 17 19 A 5.5 5.5 0 0 0 17 8 Z M 12.6 10.4 L 17 10.4 A 3.1 3.1 0 0 1 17 16.6 L 12.6 16.6 Z"
        fill="var(--color-accent-fg)"
      />
      {/* Accent dot, picking up the period in the wordmark */}
      <circle cx="22" cy="23" r="1.5" fill="var(--color-gold)" />
    </svg>
  )
}
