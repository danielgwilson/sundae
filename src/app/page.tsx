import {
  BarChart3,
  Layers3,
  Mail,
  MousePointerClick,
  Sparkles,
} from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await auth();

  return (
    <div className="sundae-wrap min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-10">
        <nav className="flex items-center justify-between gap-4">
          <a href="/" className="group inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl border bg-background/70 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Sundae</span>
          </a>

          <div className="flex items-center gap-2">
            {session?.user?.email ? (
              <a href="/app">
                <Button variant="secondary" className="rounded-full">
                  Dashboard
                </Button>
              </a>
            ) : (
              <a href="/signin">
                <Button variant="secondary" className="rounded-full">
                  Sign in
                </Button>
              </a>
            )}
            <a href={session?.user?.email ? "/app/editor" : "/signin"}>
              <Button className="rounded-full">Get started</Button>
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="sundae-chip">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                Solo creators
              </span>
              <span className="sundae-chip">Blocks</span>
              <span className="sundae-chip">Leads</span>
              <span className="sundae-chip">Analytics</span>
            </div>

            <h1 className="sundae-title text-5xl leading-[0.92] sm:text-6xl lg:text-7xl">
              Your creator homepage,
              <span className="block">
                served{" "}
                <span className="relative text-primary">
                  sweet
                  <span className="absolute -bottom-1 left-0 h-[10px] w-full rounded-full bg-primary/20 blur-[1px]" />
                </span>
                .
              </span>
            </h1>

            <p className="sundae-subtitle max-w-xl text-base text-muted-foreground sm:text-lg">
              Put your best links, embeds, and offers in one place — then turn
              taps into subscribers and customers with built‑in lead capture and
              click analytics.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href={session?.user?.email ? "/app" : "/signin"}>
                <Button className="h-11 rounded-full px-6">
                  Start building
                </Button>
              </a>
              <a href="/demo">
                <Button variant="secondary" className="h-11 rounded-full px-6">
                  View demo
                </Button>
              </a>
            </div>

            <div className="grid gap-3 pt-3 sm:grid-cols-3">
              <Feature
                icon={Layers3}
                title="Blocks"
                desc="Links, embeds, socials, forms."
              />
              <Feature
                icon={MousePointerClick}
                title="Click tracking"
                desc="Know what’s working."
              />
              <Feature
                icon={Mail}
                title="Leads"
                desc="Collect emails + messages."
              />
            </div>
          </div>

          <div className="lg:pt-2">
            <div className="sundae-card overflow-hidden">
              <div className="relative border-b bg-background/50 p-5 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/15" />
                    <div className="space-y-1">
                      <div className="text-sm font-semibold tracking-tight">
                        Demo Creator
                      </div>
                      <div className="text-xs text-muted-foreground">
                        sundae.to/demo
                      </div>
                    </div>
                  </div>
                  <span className="sundae-chip">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Live clicks
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-5">
                <PreviewButton tone="strawberry">
                  Watch the latest video
                </PreviewButton>
                <PreviewButton tone="blueberry">
                  Join the newsletter
                </PreviewButton>
                <PreviewButton tone="mint">Tip jar</PreviewButton>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <Card className="gap-2 p-4">
                    <div className="text-sm font-medium">Signup form</div>
                    <div className="text-xs text-muted-foreground">
                      built‑in lead capture
                    </div>
                    <div className="mt-2 h-10 rounded-xl border bg-background/60" />
                  </Card>
                  <Card className="gap-2 p-4">
                    <div className="text-sm font-medium">Themes</div>
                    <div className="text-xs text-muted-foreground">
                      your vibe, your colors
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Swatch className="bg-[oklch(0.63_0.23_12)]" />
                      <Swatch className="bg-[oklch(0.78_0.14_150)]" />
                      <Swatch className="bg-[oklch(0.7_0.14_250)]" />
                      <Swatch className="bg-[oklch(0.76_0.15_70)]" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          <BigFeature
            title="Looks premium by default"
            desc="Sundae pages are fast, clean, and mobile-first. No design skills required."
          />
          <BigFeature
            title="Built for conversion"
            desc="Lead capture blocks + tracked links means fewer taps wasted."
          />
          <BigFeature
            title="Grows with you"
            desc="Start solo. Keep a path open for products, email, and teams when you’re ready."
          />
        </section>

        <section className="mt-14">
          <div className="sundae-card p-8 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl leading-tight sm:text-4xl">
                  Make your bio link feel like a brand.
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Your followers shouldn’t land on a bland list of links. Give
                  them a homepage that feels intentional — and measurable.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={session?.user?.email ? "/app/editor" : "/signin"}>
                  <Button className="h-11 rounded-full px-6">
                    Create yours
                  </Button>
                </a>
                <a href="/demo">
                  <Button
                    variant="secondary"
                    className="h-11 rounded-full px-6"
                  >
                    View demo
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Sundae</span>
            <span>·</span>
            <span>Creator pages</span>
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

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Sparkles;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/60 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/15 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="text-sm font-semibold tracking-tight">{title}</div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}

function BigFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="sundae-card p-6">
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}

function Swatch({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-7 w-7 rounded-2xl border shadow-[0_8px_18px_-10px_rgba(0,0,0,0.35)]",
        className,
      )}
    />
  );
}

function PreviewButton({
  tone,
  children,
}: {
  tone: "strawberry" | "mint" | "blueberry";
  children: string;
}) {
  const toneClass =
    tone === "strawberry"
      ? "from-[oklch(0.64_0.22_12)] to-[oklch(0.7_0.21_32)]"
      : tone === "mint"
        ? "from-[oklch(0.77_0.13_150)] to-[oklch(0.83_0.11_120)]"
        : "from-[oklch(0.7_0.14_250)] to-[oklch(0.64_0.12_280)]";

  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-background/70 p-3 shadow-sm backdrop-blur">
      <div
        className={cn(
          "absolute inset-0 opacity-40",
          "bg-gradient-to-br",
          toneClass,
        )}
      />
      <div className="relative flex items-center justify-between gap-4 rounded-2xl bg-background/85 px-4 py-3">
        <div className="flex min-w-0 flex-col">
          <div className="truncate text-sm font-semibold tracking-tight">
            {children}
          </div>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-2xl border bg-background/80">
          <MousePointerClick className="h-4 w-4 text-foreground/70" />
        </span>
      </div>
    </div>
  );
}
