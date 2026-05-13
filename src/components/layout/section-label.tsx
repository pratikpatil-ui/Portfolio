export function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <p className="font-mono text-[11px] tracking-widest uppercase">
      <span className="text-[var(--color-accent)]">{number}</span>
      <span className="mx-2 text-[var(--color-fg-subtle)]">/</span>
      <span className="text-[var(--color-fg-muted)]">{label}</span>
    </p>
  )
}
