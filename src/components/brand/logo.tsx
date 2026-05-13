import { cn } from '@/lib/cn'

type Props = {
  size?: number
  withWordmark?: boolean
  className?: string
}

export function Logo({ size = 28, withWordmark = true, className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {withWordmark ? (
        <span className="font-display text-[15px] font-medium tracking-tight text-[var(--color-fg)]">
          Pratik Patil
        </span>
      ) : null}
    </span>
  )
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pratik Patil logo"
    >
      <defs>
        <linearGradient id="pp-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-sage)" />
          <stop offset="1" stopColor="var(--color-sage-deep)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#pp-bg)" />
      {/* Two stylized P forms overlapping: stems + bowls */}
      <g>
        <rect x="7" y="8" width="2.4" height="16" rx="1" fill="var(--color-accent-fg)" />
        <path
          d="M9.4 8 H14 a4 4 0 0 1 0 8 H9.4 V13.6 H13.4 a1.6 1.6 0 0 0 0 -3.2 H9.4 Z"
          fill="var(--color-accent-fg)"
        />
        <rect x="17.6" y="8" width="2.4" height="16" rx="1" fill="var(--color-gold)" />
        <path
          d="M20 8 H24.6 a4 4 0 0 1 0 8 H20 V13.6 H24 a1.6 1.6 0 0 0 0 -3.2 H20 Z"
          fill="var(--color-gold)"
        />
      </g>
    </svg>
  )
}
