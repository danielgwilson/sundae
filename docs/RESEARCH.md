# Research (sundae)

Goal: build a creator-focused “link in bio” + lightweight creator hub, inspired by Beacons + Linktree, for individual creators (no org/team features in v1), while keeping the data model extensible toward future teams/roles.

## What Beacons supports (high-level)

Beacons positions itself as an “all-in-one creator platform” built around:

- Link in bio page builder (blocks + themes + preview)
- Monetization (storefront + digital/physical products, appointments)
- Media kit (creator portfolio for brands; optionally gated)
- Audience capture (email signups / lead magnets) and basic email automation
- Analytics (page views + clicks, plus more advanced app-specific reporting)

References (primary):
- Beacons “What blocks are available?” (block taxonomy): `https://help.beacons.ai/en/articles/4697269`
- Beacons Store page (marketing): `https://home.beacons.ai/app-pages/store`
- Beacons Store overview (help center): `https://help.beacons.ai/en/articles/4699009`
- Beacons Store block (help center): `https://help.beacons.ai/en/articles/4698113`
- Beacons Lead magnet setup (help center): `https://help.beacons.ai/en/articles/4697729`
- Beacons Media kit marketing page: `https://beacons.ai/i/app-pages/media-kit`
- Beacons “Why do I need a media kit?” (help center): `https://help.beacons.ai/en/articles/4704129`

## Beacons Link-in-bio block types (from help center)

Beacons’ block inventory is broad. A non-exhaustive list of named blocks includes:

### Core content
- Links, Text, Divider, Image, Video, Gallery, Carousel, Icon, Logo cloud

### Social + embeds
- Social icons, Follow button, Social follow buttons, Snapchat lens
- TikTok profile embed, Twitch live, YouTube embed, Spotify embed, Apple Music embed, SoundCloud embed

### Contact + audience
- Contact form / Email signup
- Collect phone number (SMS)

### Monetization / commerce
- Donations
- Store block (digital products; also mentions appointments + physical product import)

### Other utilities
- Survey, “Custom code” (HTML)
- Visitor counter
- Custom domain support exists as a feature (handled at app/platform level)

Reference: `https://help.beacons.ai/en/articles/4697269`

## What’s “must-have” for our v1 cohort (individual creators)

If we’re aiming for “everything required for an individual creator” (not enterprise), the baseline must-haves are:

1) Identity + presence
- Public profile URL/handle (ex: `/myhandle`)
- Avatar, name, bio, social links
- Mobile-first, fast public page

2) Page builder
- Add/reorder/toggle blocks
- Edit basic block types: Link, Text, Image, Video/Embed, Social icons
- Theme controls: colors, typography, button style, background

3) Basic monetization hooks
- Link-out “Products” / “Shop” (external links) in v1
- “Tip” / “Support” link-out block (PayPal/Ko-fi/etc.)

4) Lead capture
- Email signup / contact form that stores leads
- Simple “thank you” behavior; optional “deliverable link” (lead magnet) as a URL

5) Analytics
- Track page views and link clicks
- Creator dashboard with daily charts and top links

6) Safety + operational basics
- Auth for creators (Google OAuth)
- Onboarding flow (pick a handle; create first page)
- Basic rate limiting / spam controls on forms
- Reasonable SEO/OG tags for public pages

## v1 “stretch” features (valuable, but dependent on more infra)

- Media kit page (public portfolio) with optional email-gating
- Auto-updating stats (requires connecting social accounts + APIs)
- Built-in email marketing campaigns and audience segmentation
- Integrated checkout (Stripe) + digital file delivery emails
- Custom domain verification + host-based routing (Vercel domains)
- “Custom code” embeds (security implications; needs sandboxing)

## Implementation notes for this repo

Given the repo already includes Next.js App Router, NextAuth (Google), and Drizzle/Postgres, a sensible architecture for future “teams/roles” is:

- `workspaces` (personal workspace in v1)
- `workspace_members` (role column; v1 always “owner”)
- `creator_profiles` (a workspace’s public identity + theme)
- `blocks` (typed blocks with `data` JSON)
- `leads` (form submissions / audience capture)
- `analytics_events` (page views + link clicks)

This keeps the v1 UX single-user while allowing a future pivot to multi-editor roles without rewriting core tables.
