"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { BlockType } from "@/lib/blocks";
import { defaultBlockData } from "@/lib/blocks";
import { getDb } from "@/lib/db";
import { blocks } from "@/lib/db/schema";
import { getMyWorkspaceAndProfile } from "@/lib/me";

function safeString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseSocialLines(
  lines: string,
): Array<{ platform: string; url: string }> {
  return lines
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [platform, ...rest] = line.split(/[,\s]+/);
      return { platform: platform ?? "", url: rest.join(" ") };
    })
    .filter((l) => l.platform && l.url)
    .slice(0, 12);
}

function safeLower(value: string) {
  return value.trim().toLowerCase();
}

function normalizeSocialUrl(platform: string, raw: string): string | null {
  const p = safeLower(platform);
  const v = raw.trim();
  if (!p || !v) return null;

  if (/^https?:\/\//i.test(v)) return v;

  // Common "paste without scheme" cases.
  if (/^(www\.)/i.test(v)) return `https://${v}`;

  if (p === "email") {
    if (/^mailto:/i.test(v)) return v;
    if (v.includes("@")) return `mailto:${v}`;
    return null;
  }

  if (p === "phone") {
    if (/^tel:/i.test(v)) return v;
    const digits = v.replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : null;
  }

  const handle = v.replace(/^@/, "").trim();
  if (!handle) return null;

  if (p === "instagram") return `https://instagram.com/${handle}`;
  if (p === "x" || p === "twitter") return `https://x.com/${handle}`;
  if (p === "tiktok") return `https://www.tiktok.com/@${handle}`;
  if (p === "twitch") return `https://www.twitch.tv/${handle}`;

  if (p === "youtube") {
    const yt = handle.startsWith("@") ? handle : `@${handle}`;
    return `https://www.youtube.com/${yt}`;
  }

  // Default to a best-effort website URL if it looks like a hostname.
  if (p === "website" && /^[^/\s]+\.[^/\s]+/.test(v)) {
    return `https://${v}`;
  }

  return v;
}

function parseSocialJson(
  raw: string,
): Array<{ platform: string; url: string }> {
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .map((row) => (row && typeof row === "object" ? row : null))
      .filter(Boolean)
      .map((row) => row as Record<string, unknown>)
      .map((row) => ({
        platform: typeof row.platform === "string" ? row.platform.trim() : "",
        url: typeof row.url === "string" ? row.url.trim() : "",
      }))
      .filter((row) => row.platform && row.url)
      .slice(0, 12);
  } catch {
    return [];
  }
}

function normalizeSocialLinks(
  links: Array<{ platform: string; url: string }>,
): Array<{ platform: string; url: string }> {
  return links
    .map((row) => ({
      platform: row.platform.trim(),
      url: normalizeSocialUrl(row.platform, row.url) ?? "",
    }))
    .filter((row) => row.platform && row.url)
    .slice(0, 12);
}

export async function createBlock(type: BlockType) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();
  const existing = await db.query.blocks.findMany({
    where: eq(blocks.profileId, profile.id),
    orderBy: asc(blocks.sortOrder),
    columns: { sortOrder: true },
  });

  const nextSort = (existing.at(-1)?.sortOrder ?? 0) + 1;

  await db.insert(blocks).values({
    profileId: profile.id,
    type,
    sortOrder: nextSort,
    enabled: true,
    data: defaultBlockData(type),
  });

  revalidatePath("/app/editor");
  revalidatePath(`/${profile.handle}`);
}

export async function deleteBlock(blockId: string) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const block = await db.query.blocks.findFirst({
    where: eq(blocks.id, blockId),
    columns: { id: true, profileId: true },
  });

  if (!block || block.profileId !== profile.id) {
    throw new Error("Block not found.");
  }

  await db.delete(blocks).where(eq(blocks.id, blockId));

  revalidatePath("/app/editor");
  revalidatePath(`/${profile.handle}`);
}

export async function toggleBlock(blockId: string) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const block = await db.query.blocks.findFirst({
    where: eq(blocks.id, blockId),
    columns: { id: true, profileId: true, enabled: true },
  });

  if (!block || block.profileId !== profile.id) {
    throw new Error("Block not found.");
  }

  await db
    .update(blocks)
    .set({ enabled: !block.enabled, updatedAt: new Date() })
    .where(eq(blocks.id, blockId));

  revalidatePath("/app/editor");
  revalidatePath(`/${profile.handle}`);
}

export async function moveBlock(blockId: string, direction: "up" | "down") {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const list = await db
    .select()
    .from(blocks)
    .where(eq(blocks.profileId, profile.id))
    .orderBy(asc(blocks.sortOrder), asc(blocks.createdAt));

  const index = list.findIndex((b) => b.id === blockId);
  if (index < 0) throw new Error("Block not found.");

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= list.length) return;

  const a = list[index];
  const b = list[swapWith];
  if (!a || !b) return;

  await db.transaction(async (tx) => {
    await tx
      .update(blocks)
      .set({ sortOrder: b.sortOrder, updatedAt: new Date() })
      .where(eq(blocks.id, a.id));
    await tx
      .update(blocks)
      .set({ sortOrder: a.sortOrder, updatedAt: new Date() })
      .where(eq(blocks.id, b.id));
  });

  revalidatePath("/app/editor");
  revalidatePath(`/${profile.handle}`);
}

export async function updateBlock(blockId: string, formData: FormData) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const block = await db.query.blocks.findFirst({
    where: eq(blocks.id, blockId),
    columns: { id: true, profileId: true, type: true },
  });

  if (!block || block.profileId !== profile.id) {
    throw new Error("Block not found.");
  }

  const type = block.type as BlockType;

  let data: unknown;

  switch (type) {
    case "link":
      data = {
        title: safeString(formData.get("title")),
        url: safeString(formData.get("url")),
        subtitle: safeString(formData.get("subtitle")) || undefined,
      };
      break;
    case "text":
      data = {
        title: safeString(formData.get("title")) || undefined,
        markdown: safeString(formData.get("markdown")),
      };
      break;
    case "image":
      data = {
        url: safeString(formData.get("url")),
        alt: safeString(formData.get("alt")) || undefined,
        href: safeString(formData.get("href")) || undefined,
      };
      break;
    case "embed":
      data = {
        url: safeString(formData.get("url")),
        title: safeString(formData.get("title")) || undefined,
      };
      break;
    case "social":
      {
        const json = safeString(formData.get("links_json"));
        const fromJson = json ? parseSocialJson(json) : [];
        const fromLines = parseSocialLines(safeString(formData.get("links")));
        const picked = fromJson.length > 0 ? fromJson : fromLines;
        data = { links: normalizeSocialLinks(picked) };
      }
      break;
    case "support":
      data = {
        title: safeString(formData.get("title")),
        url: safeString(formData.get("url")),
      };
      break;
    case "signup":
      data = {
        title: safeString(formData.get("title")),
        description: safeString(formData.get("description")) || undefined,
        leadMagnetUrl: safeString(formData.get("leadMagnetUrl")) || undefined,
        thankYouMessage:
          safeString(formData.get("thankYouMessage")) || undefined,
      };
      break;
    case "contact":
      data = {
        title: safeString(formData.get("title")),
        description: safeString(formData.get("description")) || undefined,
        thankYouMessage:
          safeString(formData.get("thankYouMessage")) || undefined,
      };
      break;
  }

  await db
    .update(blocks)
    .set({
      data,
      updatedAt: new Date(),
    })
    .where(eq(blocks.id, blockId));

  revalidatePath("/app/editor");
  revalidatePath(`/${profile.handle}`);
}
