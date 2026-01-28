import { asc, eq } from "drizzle-orm";
import { CreatorPage } from "@/components/creator/creator-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getDb } from "@/lib/db";
import { blocks } from "@/lib/db/schema";
import { getMyWorkspaceAndProfile } from "@/lib/me";
import { coerceCreatorTheme } from "@/lib/theme";
import { THEME_PRESET_IDS, THEME_PRESETS } from "@/lib/theme-presets";

import {
  applyThemePreset,
  updateHandle,
  updateProfile,
  updateTheme,
} from "./actions";

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default async function SettingsPage() {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const pageBlocks = await db
    .select()
    .from(blocks)
    .where(eq(blocks.profileId, profile.id))
    .orderBy(asc(blocks.sortOrder), asc(blocks.createdAt));

  const theme = (profile.theme ?? {}) as Record<string, unknown>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Update your profile, handle, and theme.
          </p>
        </div>

        <Card className="studio-card p-6">
          <div className="text-sm font-medium">Profile</div>
          <Separator className="my-4" />
          <form className="grid gap-4" action={updateProfile}>
            <div className="grid gap-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={profile.displayName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio ?? ""}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                defaultValue={profile.avatarUrl ?? ""}
              />
            </div>
            <Button type="submit" className="h-10 rounded-full">
              Save profile
            </Button>
          </form>
        </Card>

        <Card className="studio-card p-6">
          <div className="text-sm font-medium">Handle</div>
          <Separator className="my-4" />
          <form className="grid gap-4" action={updateHandle}>
            <div className="grid gap-2">
              <Label htmlFor="handle">Public handle</Label>
              <Input id="handle" name="handle" defaultValue={profile.handle} />
              <div className="text-xs text-muted-foreground">
                Your public URL:{" "}
                <span className="brand-mono">/{profile.handle}</span>
              </div>
            </div>
            <Button type="submit" className="h-10 rounded-full">
              Update handle
            </Button>
          </form>
        </Card>

        <Card className="studio-card p-6">
          <div className="text-sm font-medium">Theme</div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="text-xs text-muted-foreground">Presets (fast)</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {THEME_PRESET_IDS.map((id) => (
                <form key={id} action={applyThemePreset.bind(null, id)}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-10 w-full justify-start gap-2 rounded-2xl"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: THEME_PRESETS[id].theme.accent }}
                    />
                    {THEME_PRESETS[id].name}
                  </Button>
                </form>
              ))}
            </div>
          </div>

          <Separator className="my-6" />
          <form className="grid gap-4" action={updateTheme}>
            <div className="grid gap-2">
              <Label htmlFor="background">Background</Label>
              <Input
                id="background"
                name="background"
                defaultValue={safeString(theme.background)}
                placeholder="#0b1020"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardBackground">Card background</Label>
              <Input
                id="cardBackground"
                name="cardBackground"
                defaultValue={safeString(theme.cardBackground)}
                placeholder="rgba(255,255,255,0.06)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                name="text"
                defaultValue={safeString(theme.text)}
                placeholder="#ffffff"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mutedText">Muted text</Label>
              <Input
                id="mutedText"
                name="mutedText"
                defaultValue={safeString(theme.mutedText)}
                placeholder="rgba(255,255,255,0.75)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="buttonBackground">Button background</Label>
              <Input
                id="buttonBackground"
                name="buttonBackground"
                defaultValue={safeString(theme.buttonBackground)}
                placeholder="#7c3aed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="buttonText">Button text</Label>
              <Input
                id="buttonText"
                name="buttonText"
                defaultValue={safeString(theme.buttonText)}
                placeholder="#ffffff"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accent">Accent</Label>
              <Input
                id="accent"
                name="accent"
                defaultValue={safeString(theme.accent)}
                placeholder="#22c55e"
              />
            </div>

            <Button type="submit" className="h-10 rounded-full">
              Save theme
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="space-y-1">
            <div className="text-sm font-medium">Custom domain (scaffold)</div>
            <div className="text-sm text-muted-foreground">
              Store a custom domain in the database and surface setup
              instructions in the UI. Host-based routing and verification is
              intentionally deferred (needs Vercel domain integration +
              edge-safe lookup).
            </div>
          </div>
        </Card>
      </div>

      <div className="brand-screen sticky top-24 h-fit overflow-hidden">
        <CreatorPage
          showPreviewBadge
          effects="minimal"
          profile={{
            id: profile.id,
            handle: profile.handle,
            displayName: profile.displayName,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            theme: coerceCreatorTheme(profile.theme),
          }}
          blocks={pageBlocks.map((b) => ({
            id: b.id,
            type: b.type,
            enabled: b.enabled,
            data: b.data,
          }))}
        />
      </div>
    </div>
  );
}
