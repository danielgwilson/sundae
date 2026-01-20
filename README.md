# beacons-ai (Creator Pages)

Creator-first “link in bio” platform built with Next.js App Router, NextAuth (Google), and Postgres/Drizzle.

## Features (v1)

- Public creator pages at `/{handle}`
- Block editor (`/app/editor`) with reordering + enable/disable
- Blocks: link, text, image, embed (YouTube/Vimeo), social, support, signup, contact
- Analytics: page views + tracked clicks (`/app/analytics`)
- Leads inbox: email signups + contact messages (`/app/leads`)

Docs:
- `docs/RESEARCH.md` (feature research)
- `docs/PRD_V1.md` (v1 scope)

## Local dev

```bash
pnpm install
cp .env.example .env.local

# set DATABASE_URL + auth env vars in .env.local
pnpm db:migrate
pnpm dev
```

## Required env vars

- `DATABASE_URL` (Postgres)
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

Optional:
- `ANALYTICS_SALT` (falls back to `AUTH_SECRET`)
- Email notifications (Resend):
  - `RESEND_API_KEY`
  - `RESEND_FROM` (example: `"Sundae <hello@sundae.to>"`)
- `APP_URL` (server-side base URL for absolute links in emails; use `https://sundae.to` in prod)

## Deploy

Deploy via GitHub → Vercel integration (Preview on PRs, Production on `main`).
