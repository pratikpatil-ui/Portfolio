import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { highlight } from '@/lib/highlight'

async function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const html = await highlight(code, lang || 'text')
  return (
    <div
      className="shiki-block overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--color-border-muted)] bg-[var(--color-code-bg)] p-4 font-mono text-[13px] leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export async function Markdown({ source }: { source: string }) {
  // Pre-render code blocks via shiki, then split markdown into segments.
  const blocks = source.split(/(\n```[\s\S]*?\n```)/g)
  const rendered: React.ReactNode[] = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] ?? ''
    const fence = block.match(/^\n```(\w*)\n([\s\S]*?)\n```$/)
    if (fence) {
      const [, lang, code] = fence
      rendered.push(
        <HighlightedCode key={`c-${i}`} code={code ?? ''} lang={lang || 'text'} />,
      )
    } else {
      rendered.push(
        <ReactMarkdown
          key={`m-${i}`}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-h1 pt-8 text-[var(--color-fg)]">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-h2 pt-8 text-[var(--color-fg)]">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-h3 pt-6 text-[var(--color-fg)]">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-body text-[var(--color-fg-muted)]">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-[var(--color-fg-muted)]">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-body text-[var(--color-fg-muted)]">
                {children}
              </ol>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                className="text-[var(--color-accent)] hover:underline"
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="text-[var(--color-fg)]">{children}</strong>
            ),
            code: ({ children }) => (
              <code className="rounded bg-[var(--color-code-bg)] px-1 py-0.5 font-mono text-[0.9em]">
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-[var(--color-accent)] pl-4 text-body italic text-[var(--color-fg-muted)]">
                {children}
              </blockquote>
            ),
          }}
        >
          {block}
        </ReactMarkdown>,
      )
    }
  }
  return <div className="flex flex-col gap-4 leading-relaxed">{rendered}</div>
}
