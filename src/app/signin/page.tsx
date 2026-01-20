import { Sparkles } from "lucide-react";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  const googleConfigured = Boolean(
    process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET &&
      process.env.AUTH_SECRET,
  );

  return (
    <div className="sundae-wrap min-h-screen">
      <main className="mx-auto grid min-h-screen max-w-5xl items-center gap-8 px-6 py-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Card className="sundae-card w-full p-7 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="sundae-chip w-fit">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  Sundae
                </div>
                <h1 className="mt-4 text-3xl leading-tight">
                  Sign in to start scooping.
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Build your page, track clicks, and collect leads — all in one
                  place.
                </p>
              </div>
            </div>

            {!googleConfigured ? (
              <div className="mt-5 rounded-2xl border bg-background/70 p-4 text-sm text-muted-foreground">
                Google auth isn’t configured. Set{" "}
                <span className="font-mono">AUTH_SECRET</span>,{" "}
                <span className="font-mono">AUTH_GOOGLE_ID</span>, and{" "}
                <span className="font-mono">AUTH_GOOGLE_SECRET</span>.
              </div>
            ) : null}

            <form
              className="mt-6"
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/app" });
              }}
            >
              <Button
                type="submit"
                className="h-11 w-full rounded-full"
                disabled={!googleConfigured}
              >
                Continue with Google
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <a className="hover:text-foreground" href="/">
                ← Back home
              </a>
              <a className="hover:text-foreground" href="/demo">
                View a demo page
              </a>
            </div>
          </Card>
        </div>

        <aside className="order-1 lg:order-2">
          <Card className="sundae-card p-7 sm:p-8">
            <h2 className="text-xl leading-snug">
              Cute, fast, and conversion‑first.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sundae is a creator homepage that doesn’t feel like a spreadsheet.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-semibold tracking-tight">
                    Premium defaults
                  </div>
                  <div className="text-muted-foreground">
                    Great typography, spacing, and mobile rhythm out of the box.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-semibold tracking-tight">
                    Built‑in leads
                  </div>
                  <div className="text-muted-foreground">
                    Email signups and contact messages straight to your inbox.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-semibold tracking-tight">
                    Click analytics
                  </div>
                  <div className="text-muted-foreground">
                    Track what’s getting taps — without changing your links.
                  </div>
                </div>
              </li>
            </ul>
          </Card>
        </aside>
      </main>
    </div>
  );
}
