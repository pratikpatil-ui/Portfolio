import { VISA_CAPTION } from '@/lib/constants'

export function VisaCaption({ className = '' }: { className?: string }) {
  return (
    <p
      className={`font-mono text-[13px] tracking-tight text-[var(--color-accent)] ${className}`}
    >
      {VISA_CAPTION}
    </p>
  )
}
