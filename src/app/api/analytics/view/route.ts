import { and, desc, eq, gt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { analyticsEvents, creatorProfiles } from "@/lib/db/schema";
import { normalizeHandle } from "@/lib/handles";
import { hashIpForAnalytics, trackEvent } from "@/lib/server/analytics";
import { getRequestMeta } from "@/lib/server/request";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    handle?: string;
  } | null;

  const handle = normalizeHandle(body?.handle ?? "");
  if (!handle) {
    // Analytics is best-effort; never fail the page due to tracking.
    return NextResponse.json({ ok: true });
  }

  try {
    const db = getDb();
    const profile = await db.query.creatorProfiles.findFirst({
      where: eq(creatorProfiles.handle, handle),
      columns: { id: true },
    });

    if (!profile) {
      // Most commonly: demo/static pages. Don't emit 404s that show up in console.
      return NextResponse.json({ ok: true });
    }

    const meta = await getRequestMeta();
    if (meta.ip) {
      const ipHash = hashIpForAnalytics(meta.ip);
      const last = await db.query.analyticsEvents.findFirst({
        where: and(
          eq(analyticsEvents.profileId, profile.id),
          eq(analyticsEvents.type, "view"),
          gt(analyticsEvents.createdAt, sql`now() - interval '10 seconds'`),
        ),
        orderBy: desc(analyticsEvents.createdAt),
        columns: { ipHash: true },
      });

      if (ipHash && last?.ipHash === ipHash) {
        return NextResponse.json({ ok: true });
      }
    }

    await trackEvent({ profileId: profile.id, type: "view" });
  } catch {
    // Ignore analytics failures; tracking isn't worth breaking UX.
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
