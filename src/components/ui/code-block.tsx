import { highlight } from '@/lib/highlight'

export async function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string
  language: string
  filename?: string
}) {
  const html = await highlight(code, language)
  return (
    <figure className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-code-bg)]">
      {filename ? (
        <figcaption className="border-b border-[var(--color-border-muted)] px-4 py-2 font-mono text-[12px] text-[var(--color-fg-subtle)]">
          {filename}
        </figcaption>
      ) : null}
      <div
        className="shiki-block overflow-x-auto p-4 font-mono text-[13px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
