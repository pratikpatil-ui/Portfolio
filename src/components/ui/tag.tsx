import { cn } from '@/lib/cn'

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 font-mono text-[11px] tracking-tight text-[var(--color-fg-muted)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
