import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { AppNav } from "@/components/app/app-nav";
import { Button } from "@/components/ui/button";
import { clearE2EEmail, getAuthIdentity } from "@/lib/server/auth-identity";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const identity = await getAuthIdentity();
  if (!identity) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/75 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a href="/app" className="inline-flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-2xl border bg-background/70 shadow-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                </span>
                <span className="font-semibold tracking-tight">Sundae</span>
              </a>
              <div className="hidden text-sm text-muted-foreground sm:block">
                Studio
              </div>
            </div>

            <AppNav />

            <form
              action={async () => {
                "use server";
                if (process.env.E2E === "1") {
                  await clearE2EEmail();
                  redirect("/");
                }
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                type="submit"
                variant="secondary"
                className="rounded-full"
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
