import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      <span className="font-display text-[18px] font-semibold tracking-tight text-[var(--color-fg)]">
        Pratik Patil
      </span>
      <span
        aria-hidden
        className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
      />
    </span>
  )
}
