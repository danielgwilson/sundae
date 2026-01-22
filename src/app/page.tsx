import type { CSSProperties } from "react";
import { auth } from "@/auth";
import { BrandMark } from "@/components/brand/brand-mark";
import { HalftoneDotGradient } from "@/components/brand/halftone-dot-gradient";
import { CreatorPage } from "@/components/creator/creator-page";
import { Button } from "@/components/ui/button";
import { DEMO_BLOCKS, DEMO_PROFILE } from "@/lib/demo";
import { THEME_PRESETS, type ThemePresetId } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <a href="/" className="group inline-flex items-center gap-3">
            <BrandMark className="h-9 w-9 transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="text-sm font-semibold tracking-tight">Sundae</span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a className="hover:text-foreground" href="#features">
              Product
            </a>
            <a className="hover:text-foreground" href="#themes">
              Themes
            </a>
            <a className="hover:text-foreground" href="#stories">
              Stories
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {session?.user?.email ? (
              <a href="/app">
                <Button variant="outline" className="rounded-full">
                  Studio
                </Button>
              </a>
            ) : (
              <a href="/signin">
                <Button variant="outline" className="rounded-full">
                  Sign in
                </Button>
              </a>
            )}
            <a href={session?.user?.email ? "/app/editor" : "/signin"}>
              <Button className="rounded-full">Start</Button>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <section className="relative grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <HalftoneDotGradient
            variant="hero"
            behavior="cursor"
            className="absolute -inset-x-24 -top-28 h-[680px]"
            style={{ "--halftone-opacity": "0.62" } as CSSProperties}
          />

          <div className="max-w-xl space-y-7">
            <div className="brand-chip w-fit">
              <span className="brand-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70">
                Pixel‑clean creator pages
              </span>
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="text-[11px] font-semibold tracking-tight text-muted-foreground">
                blocks · leads · analytics
              </span>
            </div>

            <h1 className="brand-title text-5xl leading-[0.92] sm:text-6xl lg:text-7xl">
              A link‑in‑bio that feels like a product — not a template.
            </h1>

            <p className="brand-subtitle text-base text-muted-foreground sm:text-lg">
              Sundae gives creators a page with real rhythm: sharp typography,
              clean blocks, and a quiet kind of confidence. Capture leads, track
              clicks, and ship updates in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href={session?.user?.email ? "/app/editor" : "/signin"}>
                <Button className="h-11 rounded-full px-7">Build yours</Button>
              </a>
              <a href="/demo">
                <Button variant="outline" className="h-11 rounded-full px-7">
                  See a live page
                </Button>
              </a>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <Stat label="Blocks" value="8" />
              <Stat label="Leads" value="Built‑in" />
              <Stat label="Analytics" value="Clicks" />
            </div>
          </div>

          <div className="relative">
            <div className="brand-screen">
              <div className="brand-embed">
                <div className="brand-embed-scale">
                  <CreatorPage
                    profile={DEMO_PROFILE}
                    blocks={DEMO_BLOCKS}
                    linkMode="direct"
                    disableAnalytics
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="brand-mono">/demo</span>
              <span>·</span>
              <span>real UI, not a mock</span>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="brand-card p-8 sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  Built for solo creators right now
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Clean path to teams and editors later.
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                No enterprise noise. Just ship.
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <FeatureCard
                eyebrow="01"
                title="Blocks, not bloat"
                desc="Links, embeds, socials, images, and forms — arranged like a tiny homepage."
              />
              <FeatureCard
                eyebrow="02"
                title="Leads built in"
                desc="Collect signup emails and contact messages, then follow up fast."
              />
              <FeatureCard
                eyebrow="03"
                title="Know what converts"
                desc="Tracked clicks + analytics so you stop guessing what your audience taps."
              />
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <h2 className="brand-title text-3xl leading-tight sm:text-4xl">
                Your page should match your taste.
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Start with a theme, then tune it until it feels like you. The
                result: a page that looks like it belongs on purpose.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href={session?.user?.email ? "/app/settings" : "/signin"}>
                  <Button className="h-11 rounded-full px-7">
                    Edit styles
                  </Button>
                </a>
                <a href="/demo">
                  <Button variant="outline" className="h-11 rounded-full px-7">
                    Open demo
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MiniPanel
                title="Signup + Contact"
                desc="Turn taps into conversations."
              />
              <MiniPanel title="Tracked links" desc="Every click counts." />
              <MiniPanel title="Fast publishing" desc="Instant updates." />
              <MiniPanel title="Domains" desc="Bring your own later." />
            </div>
          </div>
        </section>

        <section id="themes" className="mt-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="brand-title text-3xl leading-tight sm:text-4xl">
                Themes with personality — not presets with paint.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Pick a flavor, publish, then iterate. These ship today.
              </p>
            </div>
            <a href={session?.user?.email ? "/app/settings" : "/signin"}>
              <Button variant="outline" className="h-11 rounded-full px-7">
                Browse themes
              </Button>
            </a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(
              [
                "vanilla",
                "strawberry-night",
                "mint-chip",
                "blueberry-soda",
              ] as ThemePresetId[]
            ).map((presetId) => (
              <ThemeCard key={presetId} presetId={presetId} />
            ))}
          </div>
        </section>

        <section id="stories" className="mt-16">
          <div className="brand-card bg-[oklch(0.16_0.02_265)] p-8 text-[oklch(0.985_0.01_95)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div>
                <h2 className="brand-title text-3xl leading-tight sm:text-4xl">
                  Less noise. More signal.
                </h2>
                <p className="mt-2 text-sm text-[oklch(0.985_0.01_95/72%)] sm:text-base">
                  A calmer canvas makes your work stand out — and the data tells
                  you what to keep.
                </p>
              </div>
              <div className="grid gap-4">
                <Quote
                  name="Maya Cruz"
                  handle="@mayacruzzz"
                  quote="I swapped themes and it actually matched my feed. No more default link‑in‑bio energy."
                />
                <Quote
                  name="Ari Blake"
                  handle="@ariblake"
                  quote="Signup + contact on the same page saved me so many DMs. It feels like a real mini‑site."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="brand-card p-8 sm:p-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="brand-title text-3xl leading-tight sm:text-4xl">
                Make your bio link feel like a brand.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Start with Sundae, publish a real page, then iterate with data.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <a href={session?.user?.email ? "/app/editor" : "/signin"}>
                <Button className="h-11 rounded-full px-7">Start</Button>
              </a>
              <a href="/demo">
                <Button variant="outline" className="h-11 rounded-full px-7">
                  View demo
                </Button>
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <BrandMark className="h-8 w-8" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Sundae</span>
              <span>·</span>
              <span>sundae.to</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href="/demo">
              Demo
            </a>
            <a className="hover:text-foreground" href="/signin">
              Sign in
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="brand-card p-4 shadow-[0_14px_36px_-28px_oklch(0.17_0.02_265/35%)]">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      className={cn(
        "brand-card group p-6",
        "transition-[transform,box-shadow] duration-200",
        "hover:-translate-y-1 hover:shadow-[0_22px_50px_-34px_oklch(0.17_0.02_265/45%)]",
      )}
    >
      <div className="relative">
        <div className="brand-mono text-[10px] uppercase tracking-[0.24em] text-foreground/55">
          {eyebrow}
        </div>
        <div className="mt-3 text-lg font-semibold tracking-tight">{title}</div>
        <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
}

function MiniPanel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="brand-card p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_22px_50px_-34px_oklch(0.17_0.02_265/45%)]">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}

function ThemeCard({ presetId }: { presetId: ThemePresetId }) {
  const preset = THEME_PRESETS[presetId];

  return (
    <div className="brand-card overflow-hidden">
      <div className="h-28" style={{ background: preset.theme.background }} />
      <div className="p-5">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {preset.name}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">preset theme</div>
      </div>
    </div>
  );
}

function Quote({
  name,
  handle,
  quote,
}: {
  name: string;
  handle: string;
  quote: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-44px_oklch(0_0_0/70%)]">
      <div className="text-sm font-semibold tracking-tight">{name}</div>
      <div className="text-xs text-[oklch(0.985_0.01_95/70%)]">{handle}</div>
      <p className="mt-4 text-sm text-[oklch(0.985_0.01_95/86%)]">{quote}</p>
    </div>
  );
}
