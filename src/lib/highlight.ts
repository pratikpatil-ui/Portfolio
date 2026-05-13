import { codeToHtml } from 'shiki'

export async function highlight(code: string, lang: string) {
  return codeToHtml(code, {
    lang,
    themes: { dark: 'github-dark-dimmed', light: 'github-light' },
    defaultColor: false,
  })
}
