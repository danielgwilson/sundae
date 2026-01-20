import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  creatorProfiles,
  leads,
  users,
  workspaceMembers,
} from "@/lib/db/schema";
import { sendEmail } from "@/lib/server/email";

function safeString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const db = getDb();
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profileId") ?? "";
  const kind = url.searchParams.get("kind") ?? "";

  if (!profileId || (kind !== "signup" && kind !== "contact")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const profile = await db.query.creatorProfiles.findFirst({
    where: eq(creatorProfiles.id, profileId),
    columns: { id: true, handle: true, displayName: true, workspaceId: true },
  });
  if (!profile) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const formData = await request.formData();

  const honeypot = safeString(formData.get("company"));
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const email = safeString(formData.get("email"));
  const name = safeString(formData.get("name"));
  const message = safeString(formData.get("message"));

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await db.insert(leads).values({
    profileId: profile.id,
    kind: kind as "signup" | "contact",
    email,
    name: name || null,
    message: kind === "contact" ? message || null : null,
    meta: {},
  });

  try {
    const owner = await db
      .select({
        email: users.email,
        name: users.name,
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(
        and(
          eq(workspaceMembers.workspaceId, profile.workspaceId),
          eq(workspaceMembers.role, "owner"),
        ),
      )
      .limit(1);

    const ownerEmail = owner[0]?.email;
    if (ownerEmail) {
      const baseUrl = process.env.APP_URL?.trim() || url.origin;
      const inboxUrl = `${baseUrl}/app/leads`;
      const publicUrl = `${baseUrl}/${profile.handle}`;
      const subject =
        kind === "contact"
          ? `New message for ${profile.displayName}`
          : `New subscriber for ${profile.displayName}`;

      const messageLine =
        kind === "contact" && message
          ? `<p><b>Message</b>: ${escapeHtml(message)}</p>`
          : "";

      void (await sendEmail({
        to: ownerEmail,
        subject,
        replyTo: kind === "contact" ? email : undefined,
        html: `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
            <h2 style="margin:0 0 12px 0;">${escapeHtml(subject)}</h2>
            <p style="margin:0 0 12px 0;"><b>From</b>: ${escapeHtml(email)}${name ? ` (${escapeHtml(name)})` : ""}</p>
            ${messageLine}
            <p style="margin:0 0 12px 0;"><b>Public page</b>: <a href="${publicUrl}">${publicUrl}</a></p>
            <p style="margin:0 0 12px 0;"><b>Inbox</b>: <a href="${inboxUrl}">${inboxUrl}</a></p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
            <p style="margin:0;color:#6b7280;font-size:12px;">Sent by Sundae</p>
          </div>
        `,
      }));
    }
  } catch {
    // Ignore email failures; lead capture is the source of truth.
  }

  const referrer = request.headers.get("referer");
  if (referrer) {
    try {
      const r = new URL(referrer);
      if (r.origin === url.origin) {
        r.searchParams.set("submitted", "1");
        return NextResponse.redirect(r);
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
