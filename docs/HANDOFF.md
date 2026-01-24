# Handoff (sundae)

## Current state

- Core creator-only v1 is wired end-to-end:
  - Auth: Google OAuth via NextAuth (`src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`)
  - DB: Drizzle schema + migrations (`src/lib/db/schema.ts`, `src/lib/db/drizzle/`)
  - Public pages: `/{handle}` renders blocks and tracks views/clicks
  - App: `/app/*` pages for editor, analytics, leads, settings
- UI/brand refresh (Jan 20, 2026):
  - New font stack + tokenized palette/elevation in `src/app/globals.css`
  - Pixel-cloud + grid animated backdrop (`src/components/brand/pixel-cloud-grid.tsx`)
  - Halftone dot-matrix gradient overlay (prominent landing hero, subtle sitewide)
  - Updated landing/signin/app shell + creator page visuals, plus refreshed theme presets
- First sign-in provisions:
  - `users` row, a personal `workspace`, `workspace_members` owner membership, and a `creator_profile`
  - A few starter blocks (link + social; signup disabled)

## Open questions

- Email sending: do we want Resend/Postmark/etc for lead confirmations + lead magnet delivery?
- Custom domains: implement verification + host-based routing (Vercel domains + edge-safe mapping).
- Payments: do we want Stripe in v1.5 (checkout + products) or keep “link-out store” in v1?
