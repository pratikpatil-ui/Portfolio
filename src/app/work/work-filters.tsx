'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function WorkFilters({ tags, active }: { tags: string[]; active: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const update = useCallback(
    (next: string[]) => {
      const sp = new URLSearchParams(params.toString())
      if (next.length === 0) sp.delete('tags')
      else sp.set('tags', next.join(','))
      const qs = sp.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, params],
  )

  function toggle(tag: string) {
    const next = active.includes(tag) ? active.filter((t) => t !== tag) : [...active, tag]
    update(next)
  }

  function clear() {
    update([])
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={clear}
        aria-pressed={active.length === 0}
        className={
          active.length === 0
            ? 'rounded-full bg-[var(--color-accent)] px-3 py-1 font-mono text-[12px] text-[var(--color-accent-fg)]'
            : 'rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[12px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
        }
      >
        All
      </button>
      {tags.map((tag) => {
        const on = active.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            aria-pressed={on}
            className={
              on
                ? 'rounded-full bg-[var(--color-accent)] px-3 py-1 font-mono text-[12px] text-[var(--color-accent-fg)]'
                : 'rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[12px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
            }
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
