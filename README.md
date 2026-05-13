# Portfolio

Personal portfolio of Pratik Patil. Next.js 16, React 19, TypeScript strict, Tailwind v4. Deployed on Vercel.

## Local development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Scripts

| Script              | What it does                                                           |
| ------------------- | ---------------------------------------------------------------------- |
| `pnpm dev`          | Run the Next.js dev server with Turbopack                              |
| `pnpm build`        | Production build                                                       |
| `pnpm start`        | Serve the production build                                             |
| `pnpm lint`         | Run ESLint (flat config, type-checked)                                 |
| `pnpm typecheck`    | Run `tsc --noEmit`                                                     |
| `pnpm format`       | Run Prettier in write mode                                             |
| `pnpm format:check` | Run Prettier in check mode                                             |
| `pnpm check:words`  | Scan source and built output for forbidden words, phrases, and dashes  |

## Code style

Prettier is configured for:

- 100-column line width
- single quotes
- no semicolons (relies on ASI; clean reads after a few minutes of acclimation)
- trailing commas everywhere
- Tailwind class sorting via `prettier-plugin-tailwindcss`

ESLint extends `next/core-web-vitals` plus `typescript-eslint/recommended-type-checked`. Type-aware lint rules run against the project's `tsconfig.json` via `parserOptions.projectService`.

## Forbidden words

A pre-commit hook and a CI step run `scripts/check-forbidden-words.mjs`. It rejects copy that uses any of a banned list of corporate cliches and ornamental punctuation. To allow a single line where the rule does not apply, append `// allow-forbidden` to the end of the line.

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
scripts/                # check-forbidden-words.mjs, build utilities
docs/                   # MASTER_PROMPT.md, prompts/, BUILD_LOG.md
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. Required by phase:

- Phase 1: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (contact form)
- Phase 2b: `ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## Phase status

Tracked in `BUILD_LOG.md`. As of this commit: **Session 0 (Foundation) shipped.** Placeholder pages render for every route. Case studies, AI assistant, and content arrive in later sessions.

## Archive

The original Next.js 14 portfolio is preserved on the `archive/v1-nextjs14` branch.
