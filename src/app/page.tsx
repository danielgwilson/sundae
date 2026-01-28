import type { CSSProperties } from "react";
import { auth } from "@/auth";
import { BrandMark } from "@/components/brand/brand-mark";
import { HalftoneDotGradient } from "@/components/brand/halftone-dot-gradient";
import { CreatorPage } from "@/components/creator/creator-page";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { DEMO_BLOCKS, DEMO_PROFILE } from "@/lib/demo";
import { THEME_PRESETS, type ThemePresetId } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await auth();
  const year = new Date().getFullYear();

  return (
    <div className="marketing min-h-screen">
      <div className="brand-frame min-h-screen">
        <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur">
          <div className="flex items-center justify-between gap-6 px-6 py-4 sm:px-8">
            <a href="/" className="group inline-flex items-center gap-3">
              <BrandMark className="h-9 w-9 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="brand-wordmark text-sm font-semibold tracking-tight">
                Sundae
              </span>
            </a>

            <nav className="hidden items-center gap-8 text-xs md:flex">
              <a
                className="brand-mono uppercase tracking-[0.22em] text-foreground/60 hover:text-foreground"
                href="#features"
              >
                Product
              </a>
              <a
                className="brand-mono uppercase tracking-[0.22em] text-foreground/60 hover:text-foreground"
                href="#themes"
              >
                Themes
              </a>
              <a
                className="brand-mono uppercase tracking-[0.22em] text-foreground/60 hover:text-foreground"
                href="#stories"
              >
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

        <main className="px-6 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
          <section className="relative grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="absolute inset-x-0 -top-14 h-[520px] overflow-hidden">
              <HalftoneDotGradient
                variant="hero"
                behavior="drift"
                className="absolute -inset-x-24 -top-16 h-[580px]"
                style={{ "--halftone-opacity": "0.22" } as CSSProperties}
              />
            </div>

            <div className="relative max-w-[640px] space-y-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="brand-chip">
                  <span className="text-foreground/75">[</span>
                  <span>platform v1</span>
                  <span className="text-foreground/75">]</span>
                </div>
                <div className="brand-chip">
                  <span className="text-foreground/75">•</span>
                  <span>blocks</span>
                  <span>leads</span>
                  <span>analytics</span>
                </div>
              </div>

              <h1 className="brand-title brand-display-hero text-[clamp(2.9rem,5.6vw,5.8rem)] leading-[0.86]">
                A link‑in‑bio{" "}
                <span className="brand-text-gradient italic">
                  that feels like a product
                </span>
                <span className="text-foreground/60"> — not a template.</span>
              </h1>

              <p className="brand-subtitle max-w-[54ch] text-base text-muted-foreground sm:text-lg">
                Clean blocks. Crisp type. A page that looks intentional — and
                the data to prove what your audience actually taps.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a href={session?.user?.email ? "/app/editor" : "/signin"}>
                  <Button className="h-11 rounded-full px-7">
                    Build yours
                  </Button>
                </a>
                <a href="/demo">
                  <Button variant="outline" className="h-11 rounded-full px-7">
                    View demo
                  </Button>
                </a>
              </div>

              <div className="grid gap-3 pt-3 sm:grid-cols-3">
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
                      layout="showcase"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="brand-mono uppercase tracking-[0.22em]">
                  /demo
                </span>
                <span>·</span>
                <span>real UI, not a mock</span>
              </div>
            </div>
          </section>

          <ScrollReveal id="features" className="mt-14">
            <div className="brand-card p-8 sm:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <div className="brand-mono text-[11px] uppercase tracking-[0.24em] text-foreground/60">
                    Core capabilities
                  </div>
                  <h2 className="brand-title text-3xl leading-tight sm:text-4xl">
                    Everything you need to build momentum.
                  </h2>
                  <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                    No enterprise dashboard theater. Just the tools a solo
                    creator needs — arranged like a product.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={session?.user?.email ? "/app/editor" : "/signin"}>
                    <Button className="h-11 rounded-full px-7">
                      Open editor
                    </Button>
                  </a>
                  <a href="/demo">
                    <Button
                      variant="outline"
                      className="h-11 rounded-full px-7"
                    >
                      See it live
                    </Button>
                  </a>
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <div className="reveal-child">
                  <FeatureCard
                    eyebrow="01"
                    title="Blocks, not bloat"
                    desc="Links, embeds, socials, images, and forms — arranged like a tiny homepage."
                  />
                </div>
                <div className="reveal-child">
                  <FeatureCard
                    eyebrow="02"
                    title="Leads built in"
                    desc="Signup emails and contact messages, stored and ready."
                  />
                </div>
                <div className="reveal-child">
                  <FeatureCard
                    eyebrow="03"
                    title="Know what converts"
                    desc="Tracked clicks + analytics so you stop guessing what your audience taps."
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-16">
            <div className="brand-card p-8 sm:p-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="brand-title text-3xl leading-tight sm:text-4xl">
                    Your page should match your{" "}
                    <span className="brand-text-gradient italic">taste</span>.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Start with a theme, then tune it until it feels like you.
                    The result: a page that looks like it belongs on purpose.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
                  <a href={session?.user?.email ? "/app/settings" : "/signin"}>
                    <Button className="h-11 rounded-full px-7">
                      Edit styles
                    </Button>
                  </a>
                  <a href="/demo">
                    <Button
                      variant="outline"
                      className="h-11 rounded-full px-7"
                    >
                      Open demo
                    </Button>
                  </a>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="reveal-child">
                  <MiniPanel
                    title="Signup + Contact"
                    desc="Turn taps into conversations."
                  />
                </div>
                <div className="reveal-child">
                  <MiniPanel title="Tracked links" desc="Every click counts." />
                </div>
                <div className="reveal-child">
                  <MiniPanel title="Fast publishing" desc="Instant updates." />
                </div>
                <div className="reveal-child">
                  <MiniPanel title="Domains" desc="Bring your own later." />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal id="themes" className="mt-16">
            <div className="brand-card p-8 sm:p-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="brand-title text-3xl leading-tight sm:text-4xl">
                    Themes with personality — not presets with paint.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Pick a flavor, publish, then iterate. These ship today.
                  </p>
                </div>
                <a href={session?.user?.email ? "/app/settings" : "/signin"}>
                  <Button variant="outline" className="h-11 rounded-full px-7">
                    Browse themes
                  </Button>
                </a>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    "vanilla",
                    "strawberry-night",
                    "mint-chip",
                    "blueberry-soda",
                  ] as ThemePresetId[]
                ).map((presetId) => (
                  <div key={presetId} className="reveal-child">
                    <ThemeCard presetId={presetId} />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal id="stories" className="mt-16">
            <div className="brand-ink-panel">
              <div className="absolute inset-0 brand-matrix" />
              <div className="absolute -bottom-20 left-1/2 w-full -translate-x-1/2 text-center">
                <div className="brand-wordmark text-[clamp(5rem,16vw,16rem)] italic text-white/10">
                  Sundae
                </div>
              </div>

              <div className="relative grid gap-8 p-8 text-[oklch(0.985_0.01_95)] sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-start">
                <div>
                  <div className="brand-mono text-[11px] uppercase tracking-[0.24em] text-white/65">
                    Signal over noise
                  </div>
                  <h2 className="brand-title mt-3 text-3xl leading-tight text-white sm:text-4xl">
                    Less noise.{" "}
                    <span className="italic text-primary">More signal</span>.
                  </h2>
                  <p className="mt-2 text-sm text-white/70 sm:text-base">
                    A calmer canvas makes your work stand out — and the data
                    tells you what to keep.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="reveal-child">
                    <Quote
                      name="Maya Cruz"
                      handle="@mayacruzzz"
                      quote="I swapped themes and it actually matched my feed. No more default link‑in‑bio energy."
                    />
                  </div>
                  <div className="reveal-child">
                    <Quote
                      name="Ari Blake"
                      handle="@ariblake"
                      quote="Signup + contact on the same page saved me so many DMs. It feels like a real mini‑site."
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-16">
            <div className="brand-ink-panel">
              <div className="absolute inset-0 brand-matrix opacity-[0.85]" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 to-transparent" />

              <div className="relative p-8 text-[oklch(0.985_0.01_95)] sm:p-10">
                <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <h2 className="brand-title text-3xl leading-tight text-white sm:text-4xl">
                      Make your bio link feel like a{" "}
                      <span className="italic text-primary">brand</span>.
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                      Start with Sundae, publish a real page, then iterate with
                      data.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a href={session?.user?.email ? "/app/editor" : "/signin"}>
                      <Button className="h-11 rounded-full px-7">Start</Button>
                    </a>
                    <a href="/demo">
                      <Button
                        variant="outline"
                        className="h-11 rounded-full px-7 border-white/20 bg-transparent text-white hover:bg-white/10"
                      >
                        View demo
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-3">
                  <div className="reveal-child space-y-2">
                    <div className="brand-mono text-[11px] uppercase tracking-[0.24em] text-white/60">
                      Platform
                    </div>
                    <div className="grid gap-2 text-sm text-white/70">
                      <a className="hover:text-white" href="#features">
                        Features
                      </a>
                      <a className="hover:text-white" href="/demo">
                        Demo
                      </a>
                    </div>
                  </div>
                  <div className="reveal-child space-y-2">
                    <div className="brand-mono text-[11px] uppercase tracking-[0.24em] text-white/60">
                      Account
                    </div>
                    <div className="grid gap-2 text-sm text-white/70">
                      <a className="hover:text-white" href="/signin">
                        Sign in
                      </a>
                      <a className="hover:text-white" href="/signin">
                        Start
                      </a>
                    </div>
                  </div>
                  <div className="reveal-child space-y-2">
                    <div className="brand-mono text-[11px] uppercase tracking-[0.24em] text-white/60">
                      Status
                    </div>
                    <div className="text-sm text-white/70">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.16_155)]" />
                        system operational
                      </span>
                      <div className="mt-2 text-xs text-white/45">© {year}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="brand-card p-4">
      <div className="brand-mono text-[11px] uppercase tracking-[0.22em] text-foreground/55">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold tracking-tight text-foreground">
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
        "hover:-translate-y-1 hover:shadow-[0_30px_74px_-56px_color-mix(in_oklab,var(--foreground)_55%,transparent)]",
      )}
    >
      <div className="relative">
        <div className="brand-mono text-[11px] uppercase tracking-[0.24em] text-foreground/55">
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
    <div className="brand-card p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_30px_74px_-56px_color-mix(in_oklab,var(--foreground)_55%,transparent)]">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}

function ThemeCard({ presetId }: { presetId: ThemePresetId }) {
  const preset = THEME_PRESETS[presetId];
  const { theme } = preset;

  return (
    <div className="brand-card overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      {/* Mini-preview mockup */}
      <div
        className="relative h-36 p-4"
        style={{ background: theme.background }}
      >
        <div className="flex flex-col items-center">
          {/* Avatar placeholder */}
          <div
            className="h-8 w-8 rounded-full"
            style={{ background: theme.cardBackground }}
          />
          {/* Name line */}
          <div
            className="mt-2 h-2 w-16 rounded-full"
            style={{ background: theme.text }}
          />
          {/* Bio line */}
          <div
            className="mt-1.5 h-1.5 w-12 rounded-full opacity-50"
            style={{ background: theme.mutedText }}
          />
          {/* Button */}
          <div
            className="mt-3 h-5 w-20 rounded-full"
            style={{ background: theme.buttonBackground }}
          />
          {/* Link card */}
          <div
            className="mt-2 h-4 w-24 rounded-lg"
            style={{ background: theme.cardBackground }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {preset.name}
        </div>
        <div className="mt-1 brand-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          preset theme
        </div>
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-70px_oklch(0_0_0/85%)] backdrop-blur">
      <div className="text-sm font-semibold tracking-tight text-white">
        {name}
      </div>
      <div className="brand-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
        {handle}
      </div>
      <p className="mt-4 text-sm text-white/80">{quote}</p>
    </div>
  );
}
