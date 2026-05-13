import { codeToHtml } from 'shiki'

type Lang = 'ts' | 'tsx' | 'js' | 'jsx' | 'json' | 'css' | 'bash' | 'md' | 'mdx' | string

let cached: Promise<void> | null = null
function warm() {
  if (!cached) cached = Promise.resolve()
  return cached
}

export async function highlight(code: string, lang: Lang) {
  await warm()
  return codeToHtml(code, {
    lang,
    themes: { dark: 'github-dark-dimmed', light: 'github-light' },
    defaultColor: false,
  })
}
