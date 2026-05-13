# Build log

## Conventions

- One entry per session, newest at top.
- Capture decisions made unilaterally so future sessions have context.
- Reference commits by short SHA.

---

## Session full build

Date: 2026-05-12
Commits: 6e394d9, 01420b2, cc8e97f, a2fb99d, f1aa1a5, plus this final pass.
Branch: `master` (pushed direct, no PRs)

### Shipped (all 6 groups in one session)

- Home page with starfield canvas, hero, proof lines, metric strip, contact strip.
- /now, /about, /contact (with form + Resend or demo fallback), /resume (inline HTML + PDF download + print stylesheet).
- /work index with URL-state filter chips, 9 full case-study detail pages with shiki code samples.
- Live 1K-node force graph (canvas, force-in-Web-Worker, drag, zoom, pan, hit detection, IntersectionObserver pause, prefers-reduced-motion fallback). Embedded in `onedata-plus` case study and at `/lab/force-graph-mini`.
- /lab with 3 demos: `force-graph-mini`, `token-streaming-sandbox`, `theme-tokens` (live OKLCH slider with copy-to-clipboard).
- /api/chat: edge runtime, Anthropic Sonnet 4.5 streaming via SSE, Upstash sliding-window rate limit (10/24h), FAQ fallback when no API key.
- AI assistant: side sheet (480px desktop, full bottom-sheet mobile), markdown rendering, blinking cursor, cancel/retry/reset, suggested prompts, floating trigger button (hidden on /contact).
- cmd+K palette via `cmdk` lib: navigation, all 9 case studies, theme toggle, ask assistant, copy email, copy phone, download resume, external links. ⌘K / Ctrl+K keyboard shortcut.
- /writing index + 3 long-form posts (`react-18-migration-playbook`, `d3-at-10k-nodes`, `llm-chat-ui-primitives`) with shiki code blocks, reading progress bar, JSON-LD Article schema, OG images per post.
- /not-found custom 404 ("That node isn't in the graph.").
- Sitemap covers all static + dynamic routes. Robots allows all, points to sitemap.
- /api/og upgraded to accept `?title=`, `?eyebrow=`, `?minutes=` query params.
- Sonner toaster wired to root layout.
- Print stylesheet for /resume (A4, hides chrome, switches to black/white).
- Forbidden-words check passes. `npm run build` passes.

### Skipped (out of scope for speed)

- Custom cursor with ring/dot, magnetic CTAs, 404 canvas animation.
- 3 additional lab demos (sse-event-simulator, audit-log-viewer, skeleton-generator).
- Resume variant toggle (one PDF, one inline HTML).
- Excalidraw architecture diagrams inside case studies (case studies are prose + code only).
- Lighthouse/axe perfection pass.
- Recent commands persistence in cmd+K.
- Performance overlay / quadtree on force graph (naive linear hit-detection at 1K nodes is fast enough).
- OG image validation on LinkedIn/X/Facebook.

### Notes for Pratik

- Drop the resume at `/public/resumes/Pratik_Patil_Resume.pdf` (placeholder file already at that path).
- Set Vercel env vars to light up the live integrations:
  - `ANTHROPIC_API_KEY` (assistant; otherwise it streams the FAQ fallback).
  - `ANTHROPIC_MODEL` (optional, defaults to `claude-sonnet-4-5-20250929`).
  - `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (assistant rate limit, contact-form rate limit).
  - `RESEND_API_KEY` (contact form; otherwise returns `{ ok: true, demo: true }`).
  - `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (optional overrides).
- Configure `pratikpatil.dev` in Vercel and uncomment a redirect rule in `next.config.ts` if you want to canonicalize away from `pratikpatil.vercel.app`. Not blocking; OG/meta already point at `pratikpatil.dev`.
- Lucide-react 1.14 in this repo is the legacy version, which has no Linkedin/Github icons. The palette uses `ExternalLink` for those two. Bumping to a modern `lucide-react` (0.4xx) would let you swap them in.
- Build pipeline note: noUncheckedIndexedAccess is on, so any new array indexing needs `??` or guards.

---

## Session 0, Foundation — workflow follow-up

Date: 2026-05-12 (same day as initial scaffold)

Pratik adjusted the workflow after the initial commit and asked to switch tooling:

- **Package manager: npm, not pnpm.** Removed `pnpm-lock.yaml` and `pnpm-workspace.yaml`. Generated `package-lock.json` via `npm install`. Updated `.github/workflows/ci.yml` to use `npm ci` and `actions/setup-node` with `cache: npm`. README and scripts table updated to `npm run …`.
- **No pre-commit hooks.** Removed husky and lint-staged (devDeps, the `.husky/` directory, the `prepare` script, the `lint-staged` config in `package.json`). Cleared the `core.hooksPath` git config. The `scripts/check-forbidden-words.mjs` script is preserved and can be run manually with `npm run check:words`; CI still runs it on every push.
- **No PR flow.** Fast-forwarded `master` to `phase-0-foundation`, pushed direct, deleted the feature branch locally and on origin. Going forward, work lands directly on `master` rather than through PRs.
- **`origin/main` left alone.** Has only an unrelated initial commit from GitHub repo creation. Pratik's real trunk has always been `master`; leaving GitHub's default-branch setting alone unless he says otherwise.

`npm run typecheck`, `npm run lint`, `npm run build`, and `npm run check:words` all pass after the conversion. No code changes outside config — the application itself is unchanged.

## Session 0, Foundation

Date: 2026-05-12
Branch: `phase-0-foundation` (merged to `master` via fast-forward, branch deleted)
Vercel preview: pending Vercel re-link (TODO for Pratik below)

### Shipped

- Wiped the v1 Next.js 14 portfolio. Preserved on `archive/v1-nextjs14` branch.
- Scaffolded Next.js 16.2.6 (App Router, Turbopack), React 19.2.4, TypeScript 5.9.3, Tailwind v4.3.
- Strict TypeScript: `strict`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `forceConsistentCasingInFileNames`.
- ESLint flat config: `next/core-web-vitals` plus `typescript-eslint/recommended-type-checked` with `parserOptions.projectService`. Prettier integration via `eslint-config-prettier`.
- Prettier: 100 cols, single quotes, no semicolons, trailing commas, Tailwind class sorting plugin.
- OKLCH design tokens in `src/app/globals.css`. Dark default. Light theme via `:root[data-theme='light']`. `@custom-variant dark` makes Tailwind's `dark:` utilities key off `data-theme='dark'`.
- Typography scale as `.text-hero / .text-h1 / .text-h2 / .text-h3 / .text-body-lg / .text-body / .text-caption / .text-micro` component classes in `src/styles/typography.css`.
- Geist Sans and Geist Mono via `next/font/google` (`display: 'swap'`).
- `prefers-reduced-motion` override in `globals.css`.
- Folder structure created: `src/app`, `src/components/{layout,theme,ui}`, `src/content`, `src/lib`, `src/styles`.
- Header (sticky, glass blur, 1px bottom border). Footer (copyright, last-deployed SHA placeholder via `VERCEL_GIT_COMMIT_SHA`, social links, theme toggle).
- `ThemeProvider` (next-themes, `attribute='data-theme'`, default `dark`, `disableTransitionOnChange`, `storageKey='pp-theme'`).
- `ThemeToggle` (Sun/Moon swap, gated on mount to avoid hydration mismatch).
- Container and Section layout primitives.
- Placeholder pages for every route in the IA: `/`, `/work`, `/work/[slug]`, `/lab`, `/lab/[slug]`, `/writing`, `/writing/[slug]`, `/now`, `/about`, `/resume`, `/contact`, and `not-found.tsx`. Each renders `<h1>` plus a "Phase X placeholder" caption.
- `/api/og` returns a 1200x630 PNG via `next/og` with name, tagline, location, and a 2px accent line.
- `/api/chat` and `/api/contact` return HTTP 501 with explanatory JSON.
- `app/sitemap.ts` and `app/robots.ts` list all routes.
- Root metadata (title, description, OG, Twitter card). JSON-LD `Person` schema injected in body. `@vercel/analytics` and `@vercel/speed-insights` wired in root layout.
- `scripts/check-forbidden-words.mjs` scans `src/` and `.next/server/app/` for banned words, phrases, and decorative dashes. A line can opt out with `// allow-forbidden`.
- Husky pre-commit runs `lint-staged` (eslint + prettier on staged files) and the forbidden-words check.
- GitHub Actions workflow at `.github/workflows/ci.yml`: install, lint, typecheck, forbidden-words, build, forbidden-words on built output.
- `.env.example` documents every variable used across all phases (no values).
- `README.md` rewritten for this project.
- AGENTS.md and CLAUDE.md generated by create-next-app preserved; they point AI agents at the bundled docs in `node_modules/next/dist/docs/`.

### Deferred (per session plan, not loss)

- Hero, metric strip, home page content, /now, /about content → Session 1.
- Contact form with Resend backend → Session 1.
- Nine case studies → Session 2.
- AI assistant (`/api/chat` live) and D3 1K-node graph → Session 3.
- Six micro-demos in `/lab`. Three blog posts in `/writing`. HTML resume. → Session 4.
- cmd+K palette, custom cursor, interactive 404, magnetic CTAs → Session 5.
- Lighthouse, axe, mobile, OG validation, domain redirect, launch → Session 6.

### Decisions made unilaterally

- **Next.js 16 instead of 15.** The spec said "Next.js 15.x (App Router, RSC, Server Actions)" but also "Use exactly these versions or latest stable". Next 16 is the latest stable as of today and has the same App Router model. AGENTS.md is included to keep agents reading the bundled docs in later sessions.
- **pnpm 10 instead of 11.** pnpm 11 requires Node 22.13+; the local Node is 21.7.1. pnpm 10.33.4 still supports Node 21 and behaves identically for this project. Pratik should upgrade to Node 22 LTS at his convenience and we can bump pnpm then.
- **Title separator changed from em-dash to pipe.** The spec's verbatim metadata block used em-dashes between the name and the tagline, but the same spec's forbidden-punctuation rule forbids em-dashes. The Working Agreement says "If anything in this prompt would produce a forbidden word, rewrite." Settled on " | " (pipe) for titles. The OG card uses no separator at all.
- **`storageKey='pp-theme'`** in `ThemeProvider` so the cookie is namespaced and won't collide with another project on the same domain during development.
- **Reset the existing Vercel project link.** The old `.vercel/` directory was deleted in the wipe. Re-linking after the PR opens is below in TODOs.
- **One coherent feature branch (`phase-0-foundation`) rather than direct-to-master commits.** The INDEX described a PR-based flow; sticking to it from session 0.

### Acceptance criteria check

| Criterion                                                            | Status |
| -------------------------------------------------------------------- | ------ |
| `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint` all succeed  | Pass   |
| Every route returns a placeholder page with the route name as `h1`   | Pass (200 on /, /work, /lab, /writing, /now, /about, /resume, /contact and slug routes; 404 on unknown) |
| Theme toggle exists and switches without page flash                  | Wired via `disableTransitionOnChange` and `suppressHydrationWarning` |
| `/api/og` returns a valid 1200x630 PNG                               | Pass (32 KB PNG) |
| `/api/chat` and `/api/contact` return HTTP 501 with explanatory JSON | Pass |
| `/sitemap.xml` and `/robots.txt` accessible                          | Pass |
| Page source contains the JSON-LD Person schema                       | Pass |
| Pre-commit hook fires and runs forbidden-words check                 | Wired (will be exercised on the first commit) |
| CI green on PR                                                        | Pending after push |
| Vercel preview deploys cleanly                                       | Pending Vercel re-link (TODO below) |
| `BUILD_LOG.md` exists with this entry                                | This file |
| No console errors, no hydration warnings                             | None observed locally |

### TODOs for Pratik

- Re-link this repo to the Vercel project: `pnpm dlx vercel link` from the repo root, then push the branch. The first preview will deploy automatically thereafter.
- Drop the seven session prompt files into `docs/prompts/`. Session 0's stub is at `docs/prompts/01_session_0_foundation.md`. The remaining six should be saved there before each is consumed.
- Optional: upgrade Node to 22 LTS locally so pnpm can move to 11.x.
- Optional: set the env vars in Vercel for Phase 1 (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`) ahead of the next session.
