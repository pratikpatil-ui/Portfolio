# Portfolio

Personal portfolio of Pratik Patil. Next.js 16, React 19, TypeScript strict, Tailwind v4. Deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

| Script                  | What it does                                                          |
| ----------------------- | --------------------------------------------------------------------- |
| `npm run dev`           | Run the Next.js dev server with Turbopack                             |
| `npm run build`         | Production build                                                      |
| `npm start`             | Serve the production build                                            |
| `npm run lint`          | Run ESLint (flat config, type-checked)                                |
| `npm run typecheck`     | Run `tsc --noEmit`                                                    |
| `npm run format`        | Run Prettier in write mode                                            |
| `npm run format:check`  | Run Prettier in check mode                                            |
| `npm run check:words`   | Scan source and built output for forbidden words, phrases, and dashes |

## Code style

Prettier is configured for:

- 100-column line width
- single quotes
- no semicolons (relies on ASI)
- trailing commas everywhere
- Tailwind class sorting via `prettier-plugin-tailwindcss`

ESLint extends `next/core-web-vitals` plus `typescript-eslint/recommended-type-checked`. Type-aware lint rules run against the project's `tsconfig.json` via `parserOptions.projectService`.

## Forbidden words

`scripts/check-forbidden-words.mjs` scans source and the built output for banned cliches and decorative dashes. Run it manually with `npm run check:words` before committing. CI runs it on every push.

## Project structure

```
src/
  app/                  # App Router pages, API routes, sitemap, robots
  components/
    layout/             # Header, Footer, Container, Section, PlaceholderPage
    theme/              # ThemeProvider, ThemeToggle
    ui/                 # shadcn primitives (added per-feature)
  content/              # profile.ts, metrics.ts (single source of truth)
  lib/                  # cn(), constants, fonts
  styles/               # typography.css
scripts/                # check-forbidden-words.mjs
docs/                   # MASTER_PROMPT.md, prompts/, BUILD_LOG.md
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. Required by phase:

- Phase 1: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (contact form)
- Phase 2b: `ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## Phase status

Tracked in `BUILD_LOG.md`.

## Archive

The original Next.js 14 portfolio is preserved on the `archive/v1-nextjs14` branch.
