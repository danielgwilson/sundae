import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { AppNav } from "@/components/app/app-nav";
import { BrandMark } from "@/components/brand/brand-mark";
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
    <div className="min-h-screen studio-shell">
      <header className="sticky top-0 z-20 studio-header">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="group inline-flex items-center gap-3"
                aria-label="Sundae Studio"
              >
                <BrandMark className="h-9 w-9 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-tight">
                    Sundae
                  </div>
                  <div className="text-xs text-muted-foreground">Studio</div>
                </div>
              </Link>
            </div>

            <AppNav className="order-3 w-full sm:order-none sm:w-auto" />

            <form
              className="order-2 sm:order-none"
              action={async () => {
                "use server";
                if (process.env.E2E === "1") {
                  await clearE2EEmail();
                  redirect("/");
                }
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" className="rounded-full">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
