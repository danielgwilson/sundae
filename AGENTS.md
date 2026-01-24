# Agent Instructions (Codex/Claude/Cursor)

This repo is designed to be worked on by humans + coding agents. Optimize for **velocity** while minimizing regressions.

## Project Links (keep updated)

<!-- kit:project-links:start -->
- GitHub: danielgwilson/sundae
- Vercel: gsl-is/sundae
- Domain: sundae.to
- App URL (prod): https://sundae.to
- DB (provider + project): Vercel Postgres (Neon) - TODO provision
- Redis (provider): (fill)
- Inngest: (fill)
- Stripe: (fill)
- GCP project: (fill)
<!-- kit:project-links:end -->

## Workflow Defaults

- Keep changes small and shippable; avoid opportunistic refactors unless asked.
- Deploys should happen via **GitHub → Vercel** integration:
  - PRs → Preview deploys
  - Merge to `main` → Production deploy
  - Use Vercel CLI mainly for logs/inspection/env (not for ad-hoc production deploys).
  - Avoid `vercel link` / `vercel --prod` unless explicitly requested (easy to mis-link/mis-deploy).

## LLM Product Guidance (important)

- Don’t add brittle deterministic “guardrail” logic to compensate for agent mistakes.
  - Prefer better prompts/tool descriptions, targeted tests, and clearer errors/observability.
- If you’re unsure about a change with cost/infra risk (Vercel/DB/Redis/GCP/Stripe), ask first.


<!-- kit:section:git-workflow:start -->
## Git Workflow (authority)

- You have permission to land changes on `main` **if the repo allows it**.
- If `main` is protected / requires PRs (or `git push` is rejected):
  - work on a branch, open a PR, and request review/merge
  - do **not** force-push `main`
  - do **not** auto-merge PRs into `main` unless explicitly confirmed
<!-- kit:section:git-workflow:end -->







<!-- kit:section:testing:start -->
## Testing

- Unit tests (Vitest): `pnpm test:run`
- E2E (Playwright): `pnpm test:e2e`
  - Starts `pnpm dev` automatically on port `3107`
  - Sets `E2E=1` for E2E-only routes (see `src/app/e2e/page.tsx`)
- All tests: `pnpm test:all`
- Fast checks before handing off work: `pnpm lint` + `pnpm typecheck`
<!-- kit:section:testing:end -->







<!-- kit:section:auth-google:start -->
## Auth (NextAuth Google)

- Env vars (preferred): `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
- Redirect URIs cannot be wildcarded; Google OAuth typically won’t work on Vercel preview deploy URLs.
- Recommended helper (prints the exact Console steps + redirect URIs): `dgkit gcp bootstrap --project-id <id>`

Console UI:
- OAuth consent screen: https://console.cloud.google.com/apis/credentials/consent
- Create OAuth client: https://console.cloud.google.com/apis/credentials/oauthclient

Use these values:
- Authorized JavaScript origins: http://localhost:3000
- Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
<!-- kit:section:auth-google:end -->






<!-- kit:section:drizzle:start -->
## Drizzle (migrations)

- Preferred workflow: `pnpm db:generate` → review SQL → `pnpm db:migrate`.
- Avoid `drizzle-kit push` for anything important (OK only for throwaway local prototyping).
- Keep `db:generate` / `db:migrate` scripts in `package.json` and keep `.env.example` up to date.
<!-- kit:section:drizzle:end -->





<!-- kit:section:db:start -->
## Database (Postgres)

- Keep schema changes reviewable and reproducible (migrations > ad-hoc edits).
- Avoid destructive commands against any shared/production database.
- Prefer adding small helper scripts for debugging/inspection (wired as `pnpm` scripts), rather than re-deriving SQL/queries each time.
<!-- kit:section:db:end -->




<!-- kit:section:db-neon:start -->
## Neon (notes)

- If you’re using Vercel Postgres (powered by Neon), provision it in the Vercel dashboard (Project → Storage).
- After provisioning, Vercel will set Postgres env vars like `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` for Preview + Production.
- Prefer the pooled/serverless connection string in production runtimes.
- Keep `DATABASE_URL` consistent across local/dev/prod and avoid pointing migrations at the wrong database.
<!-- kit:section:db-neon:end -->



## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm lint
pnpm typecheck
pnpm dev
```

## Where to Put “The Truth”

- Progress: `docs/PROGRESS.md`
- Handoff: `docs/HANDOFF.md`
- Decisions: `docs/DECISIONS.md`
- Agent guide: `docs/AGENT_GUIDE.md`
