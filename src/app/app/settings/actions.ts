"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { creatorProfiles } from "@/lib/db/schema";
import { normalizeHandle, validateHandle } from "@/lib/handles";
import { getMyWorkspaceAndProfile } from "@/lib/me";
import { THEME_PRESETS, type ThemePresetId } from "@/lib/theme-presets";

function safeString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfile(formData: FormData) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const displayName = safeString(formData.get("displayName"));
  const bio = safeString(formData.get("bio"));
  const avatarUrl = safeString(formData.get("avatarUrl"));

  if (!displayName) {
    throw new Error("Display name is required.");
  }

  await db
    .update(creatorProfiles)
    .set({
      displayName,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(creatorProfiles.id, profile.id));

  revalidatePath("/app/settings");
  revalidatePath("/app");
  revalidatePath(`/${profile.handle}`);
}

export async function updateHandle(formData: FormData) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();
  const current = profile.handle;

  const desired = normalizeHandle(safeString(formData.get("handle")));
  const validated = validateHandle(desired);
  if (!validated.ok) {
    throw new Error(validated.reason);
  }

  if (validated.normalized === current) {
    return;
  }

  const existing = await db.query.creatorProfiles.findFirst({
    where: eq(creatorProfiles.handle, validated.normalized),
    columns: { id: true },
  });

  if (existing) {
    throw new Error("That handle is taken.");
  }

  await db
    .update(creatorProfiles)
    .set({ handle: validated.normalized, updatedAt: new Date() })
    .where(eq(creatorProfiles.id, profile.id));

  revalidatePath("/app/settings");
  revalidatePath("/app");
  revalidatePath(`/${current}`);
  revalidatePath(`/${validated.normalized}`);
}

export async function updateTheme(formData: FormData) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const background = safeString(formData.get("background"));
  const effects = safeString(formData.get("effects"));
  const layout = safeString(formData.get("layout"));
  const cardBackground = safeString(formData.get("cardBackground"));
  const text = safeString(formData.get("text"));
  const mutedText = safeString(formData.get("mutedText"));
  const buttonBackground = safeString(formData.get("buttonBackground"));
  const buttonText = safeString(formData.get("buttonText"));
  const accent = safeString(formData.get("accent"));

  const nextTheme = {
    ...(profile.theme ?? {}),
    ...(background ? { background } : {}),
    ...(effects === "full" || effects === "minimal" ? { effects } : {}),
    ...(layout === "default" || layout === "showcase" ? { layout } : {}),
    ...(cardBackground ? { cardBackground } : {}),
    ...(text ? { text } : {}),
    ...(mutedText ? { mutedText } : {}),
    ...(buttonBackground ? { buttonBackground } : {}),
    ...(buttonText ? { buttonText } : {}),
    ...(accent ? { accent } : {}),
  };

  await db
    .update(creatorProfiles)
    .set({ theme: nextTheme, updatedAt: new Date() })
    .where(eq(creatorProfiles.id, profile.id));

  revalidatePath("/app/settings");
  revalidatePath(`/${profile.handle}`);
}

export async function applyThemePreset(preset: ThemePresetId) {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const entry = THEME_PRESETS[preset];
  if (!entry) {
    throw new Error("Unknown theme preset.");
  }

  // Keep any extra theme prefs (e.g. layout/effects) while applying the preset colors.
  const nextTheme = { ...(profile.theme ?? {}), ...entry.theme };

  await db
    .update(creatorProfiles)
    .set({ theme: nextTheme, updatedAt: new Date() })
    .where(eq(creatorProfiles.id, profile.id));

  revalidatePath("/app/settings");
  revalidatePath(`/${profile.handle}`);
}
