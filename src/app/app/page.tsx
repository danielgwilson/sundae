import { sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDb } from "@/lib/db";
import { analyticsEvents, blocks } from "@/lib/db/schema";
import { getMyWorkspaceAndProfile } from "@/lib/me";

export default async function AppHomePage() {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const [{ blockCount }] = await db
    .select({ blockCount: sql<number>`count(*)` })
    .from(blocks)
    .where(sql`${blocks.profileId} = ${profile.id}`);

  const [{ views7d }] = await db
    .select({ views7d: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(
      sql`${analyticsEvents.profileId} = ${profile.id} and ${analyticsEvents.type} = 'view' and ${analyticsEvents.createdAt} >= now() - interval '7 days'`,
    );

  const [{ clicks7d }] = await db
    .select({ clicks7d: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(
      sql`${analyticsEvents.profileId} = ${profile.id} and ${analyticsEvents.type} = 'click' and ${analyticsEvents.createdAt} >= now() - interval '7 days'`,
    );

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your creator page and track performance.
          </p>
        </div>
        <a href={`/${profile.handle}`}>
          <Button variant="secondary" className="rounded-full">
            View public page
          </Button>
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sundae-card p-6">
          <div className="text-sm text-muted-foreground">Blocks</div>
          <div className="mt-1 text-3xl font-semibold">{blockCount ?? 0}</div>
          <div className="mt-4 text-sm">
            <a className="underline underline-offset-4" href="/app/editor">
              Edit blocks
            </a>
          </div>
        </Card>
        <Card className="sundae-card p-6">
          <div className="text-sm text-muted-foreground">Views (7d)</div>
          <div className="mt-1 text-3xl font-semibold">{views7d ?? 0}</div>
          <div className="mt-4 text-sm">
            <a className="underline underline-offset-4" href="/app/analytics">
              View analytics
            </a>
          </div>
        </Card>
        <Card className="sundae-card p-6">
          <div className="text-sm text-muted-foreground">Clicks (7d)</div>
          <div className="mt-1 text-3xl font-semibold">{clicks7d ?? 0}</div>
          <div className="mt-4 text-sm">
            <a className="underline underline-offset-4" href="/app/analytics">
              View analytics
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
