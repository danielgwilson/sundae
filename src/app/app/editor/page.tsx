import { asc, eq } from "drizzle-orm";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { CreatorPage } from "@/components/creator/creator-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDb } from "@/lib/db";
import { blocks } from "@/lib/db/schema";
import { getMyWorkspaceAndProfile } from "@/lib/me";
import { coerceCreatorTheme } from "@/lib/theme";
import {
  createBlock,
  deleteBlock,
  moveBlock,
  toggleBlock,
  updateBlock,
} from "./actions";
import { EditorShell } from "./editor-shell";

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function safeObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export default async function EditorPage() {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const pageBlocks = await db
    .select()
    .from(blocks)
    .where(eq(blocks.profileId, profile.id))
    .orderBy(asc(blocks.sortOrder), asc(blocks.createdAt));

  const buildPane = (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Editor</h1>
          <p className="text-sm text-muted-foreground">
            Add blocks, reorder, and customize your page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={createBlock.bind(null, "link")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Link
            </Button>
          </form>
          <form action={createBlock.bind(null, "text")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Text
            </Button>
          </form>
          <form action={createBlock.bind(null, "image")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Image
            </Button>
          </form>
          <form action={createBlock.bind(null, "embed")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Embed
            </Button>
          </form>
          <form action={createBlock.bind(null, "social")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Social
            </Button>
          </form>
          <form action={createBlock.bind(null, "support")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Support
            </Button>
          </form>
          <form action={createBlock.bind(null, "signup")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Signup
            </Button>
          </form>
          <form action={createBlock.bind(null, "contact")}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + Contact
            </Button>
          </form>
        </div>
      </div>

      {pageBlocks.length === 0 ? (
        <Card className="studio-card p-6">
          <div className="font-medium">No blocks yet</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Add a block above to start building your page.
          </div>
        </Card>
      ) : null}

      <div className="space-y-4 pb-[max(4rem,env(safe-area-inset-bottom))]">
        {pageBlocks.map((block) => {
          const data = safeObject(block.data);
          const header = (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-medium">
                {block.type} {block.enabled ? "" : "(disabled)"}
              </div>
              <div className="flex items-center gap-2">
                <form action={moveBlock.bind(null, block.id, "up")}>
                  <Button
                    type="submit"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Move block up"
                  >
                    <ArrowUp />
                  </Button>
                </form>
                <form action={moveBlock.bind(null, block.id, "down")}>
                  <Button
                    type="submit"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Move block down"
                  >
                    <ArrowDown />
                  </Button>
                </form>
                <form action={toggleBlock.bind(null, block.id)}>
                  <Button
                    type="submit"
                    size="icon-sm"
                    variant="outline"
                    aria-label={
                      block.enabled ? "Disable block" : "Enable block"
                    }
                  >
                    {block.enabled ? <EyeOff /> : <Eye />}
                  </Button>
                </form>
                <form action={deleteBlock.bind(null, block.id)}>
                  <Button
                    type="submit"
                    size="icon-sm"
                    variant="destructive"
                    aria-label="Delete block"
                  >
                    <Trash2 />
                  </Button>
                </form>
              </div>
            </div>
          );

          return (
            <Card key={block.id} className="studio-card studio-card--interactive p-6">
              {header}

              <form
                className="mt-4 grid gap-3"
                action={updateBlock.bind(null, block.id)}
              >
                {block.type === "link" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-title`}>Title</Label>
                      <Input
                        id={`${block.id}-title`}
                        name="title"
                        defaultValue={safeString(data.title)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-url`}>URL</Label>
                      <Input
                        id={`${block.id}-url`}
                        name="url"
                        defaultValue={safeString(data.url)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-subtitle`}>Subtitle</Label>
                      <Input
                        id={`${block.id}-subtitle`}
                        name="subtitle"
                        defaultValue={safeString(data.subtitle)}
                      />
                    </div>
                  </>
                ) : null}

                {block.type === "text" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-title`}>Title</Label>
                      <Input
                        id={`${block.id}-title`}
                        name="title"
                        defaultValue={safeString(data.title)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-markdown`}>Text</Label>
                      <Textarea
                        id={`${block.id}-markdown`}
                        name="markdown"
                        defaultValue={safeString(data.markdown)}
                        rows={5}
                      />
                    </div>
                  </>
                ) : null}

                {block.type === "image" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-url`}>Image URL</Label>
                      <Input
                        id={`${block.id}-url`}
                        name="url"
                        defaultValue={safeString(data.url)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-alt`}>Alt text</Label>
                      <Input
                        id={`${block.id}-alt`}
                        name="alt"
                        defaultValue={safeString(data.alt)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-href`}>
                        Link URL (optional)
                      </Label>
                      <Input
                        id={`${block.id}-href`}
                        name="href"
                        defaultValue={safeString(data.href)}
                      />
                    </div>
                  </>
                ) : null}

                {block.type === "embed" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-url`}>Embed URL</Label>
                      <Input
                        id={`${block.id}-url`}
                        name="url"
                        defaultValue={safeString(data.url)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-title`}>
                        Title (optional)
                      </Label>
                      <Input
                        id={`${block.id}-title`}
                        name="title"
                        defaultValue={safeString(data.title)}
                      />
                    </div>
                  </>
                ) : null}

                {block.type === "social" ? (
                  <div className="grid gap-2">
                    <Label htmlFor={`${block.id}-links`}>Social links</Label>
                    <Textarea
                      id={`${block.id}-links`}
                      name="links"
                      defaultValue={
                        Array.isArray(data.links)
                          ? data.links
                              .map((l) => safeObject(l))
                              .map(
                                (l) =>
                                  `${safeString(l.platform)}, ${safeString(l.url)}`,
                              )
                              .join("\n")
                          : ""
                      }
                      rows={5}
                      placeholder={
                        "instagram, https://instagram.com/you\nx, https://x.com/you"
                      }
                    />
                    <div className="text-xs text-muted-foreground">
                      One per line:{" "}
                      <span className="font-mono">platform, url</span>
                    </div>
                  </div>
                ) : null}

                {block.type === "support" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-title`}>Button label</Label>
                      <Input
                        id={`${block.id}-title`}
                        name="title"
                        defaultValue={safeString(data.title)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-url`}>URL</Label>
                      <Input
                        id={`${block.id}-url`}
                        name="url"
                        defaultValue={safeString(data.url)}
                      />
                    </div>
                  </>
                ) : null}

                {block.type === "signup" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-title`}>Title</Label>
                      <Input
                        id={`${block.id}-title`}
                        name="title"
                        defaultValue={safeString(data.title)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-description`}>
                        Description
                      </Label>
                      <Textarea
                        id={`${block.id}-description`}
                        name="description"
                        defaultValue={safeString(data.description)}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-leadMagnetUrl`}>
                        Lead magnet URL (optional)
                      </Label>
                      <Input
                        id={`${block.id}-leadMagnetUrl`}
                        name="leadMagnetUrl"
                        defaultValue={safeString(data.leadMagnetUrl)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-thankYouMessage`}>
                        Thank you message (optional)
                      </Label>
                      <Textarea
                        id={`${block.id}-thankYouMessage`}
                        name="thankYouMessage"
                        defaultValue={safeString(data.thankYouMessage)}
                        rows={2}
                      />
                    </div>
                  </>
                ) : null}

                {block.type === "contact" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-title`}>Title</Label>
                      <Input
                        id={`${block.id}-title`}
                        name="title"
                        defaultValue={safeString(data.title)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-description`}>
                        Description
                      </Label>
                      <Textarea
                        id={`${block.id}-description`}
                        name="description"
                        defaultValue={safeString(data.description)}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${block.id}-thankYouMessage`}>
                        Thank you message (optional)
                      </Label>
                      <Textarea
                        id={`${block.id}-thankYouMessage`}
                        name="thankYouMessage"
                        defaultValue={safeString(data.thankYouMessage)}
                        rows={2}
                      />
                    </div>
                  </>
                ) : null}

                <Button type="submit" className="w-full sm:w-auto">
                  Save
                </Button>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const previewPane = (
    <div
      className={[
        "brand-screen",
        "overflow-auto overscroll-contain",
        "h-[72svh] sm:h-[76svh]",
        "lg:sticky lg:top-24 lg:h-auto lg:max-h-[calc(100vh-10rem)]",
      ].join(" ")}
    >
      <CreatorPage
        showPreviewBadge
        embed
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
  );

  return <EditorShell build={buildPane} preview={previewPane} />;
}
