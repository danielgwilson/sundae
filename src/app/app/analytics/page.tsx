import { sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDb } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";
import { getMyWorkspaceAndProfile } from "@/lib/me";
import { cn } from "@/lib/utils";

type DayRow = { day: string; views: number; clicks: number };

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default async function AnalyticsPage() {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const rows = (await db.execute(
    sql<DayRow>`
      select
        to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
        sum(case when type = 'view' then 1 else 0 end)::int as views,
        sum(case when type = 'click' then 1 else 0 end)::int as clicks
      from ${analyticsEvents}
      where profile_id = ${profile.id}
        and created_at >= now() - interval '14 days'
      group by 1
      order by 1 asc
    `,
  )) as unknown as { rows: DayRow[] };

  const days = rows.rows ?? [];
  const maxViews = Math.max(0, ...days.map((d) => d.views ?? 0));
  const maxClicks = Math.max(0, ...days.map((d) => d.clicks ?? 0));

  const topDestinations = (await db.execute(
    sql<{ url: string; clicks: number }>`
      select
        coalesce(url, '') as url,
        count(*)::int as clicks
      from ${analyticsEvents}
      where profile_id = ${profile.id}
        and type = 'click'
        and url is not null
      group by 1
      order by 2 desc
      limit 10
    `,
  )) as unknown as { rows: Array<{ url: string; clicks: number }> };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Views and clicks for the last 14 days.
        </p>
      </div>

      <Card className="sundae-card p-6">
        <div className="text-sm font-medium">Daily</div>
        <div className="mt-4 grid gap-3">
          {days.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No data yet. Share your page to start collecting views.
            </div>
          ) : (
            days.map((d) => (
              <div key={d.day} className="grid gap-2 sm:grid-cols-[140px_1fr]">
                <div className="text-sm text-muted-foreground">{d.day}</div>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Views</span>
                      <span>{d.views}</span>
                    </div>
                    <Bar value={d.views} max={maxViews} />
                  </div>
                  <div className="grid gap-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Clicks</span>
                      <span>{d.clicks}</span>
                    </div>
                    <Bar value={d.clicks} max={maxClicks} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="sundae-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-medium">Top destinations</div>
          <a href={`/${profile.handle}`}>
            <Button variant="secondary" className="rounded-full">
              View public page
            </Button>
          </a>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          {topDestinations.rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No clicks tracked yet.
            </div>
          ) : (
            topDestinations.rows.map((r, i) => (
              <div
                key={`${r.url}-${i}`}
                className={cn("grid gap-1 sm:grid-cols-[1fr_80px]")}
              >
                <div className="truncate text-sm">{r.url}</div>
                <div className="text-right text-sm text-muted-foreground">
                  {r.clicks}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
