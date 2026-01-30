"use client";

import { ChevronDown, Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SocialRow = { platform: string; url: string };

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram", hint: "@you" },
  { value: "x", label: "X", hint: "@you" },
  { value: "tiktok", label: "TikTok", hint: "@you" },
  { value: "youtube", label: "YouTube", hint: "@you" },
  { value: "twitch", label: "Twitch", hint: "@you" },
  { value: "spotify", label: "Spotify", hint: "artist/track URL" },
  { value: "email", label: "Email", hint: "you@domain.com" },
  { value: "phone", label: "Phone", hint: "+1 555 555 5555" },
  { value: "website", label: "Website", hint: "https://example.com" },
] as const;

function labelForPlatform(platform: string) {
  return (
    PLATFORM_OPTIONS.find((p) => p.value === platform)?.label ??
    (platform ? platform : "Website")
  );
}

function hintForPlatform(platform: string) {
  return PLATFORM_OPTIONS.find((p) => p.value === platform)?.hint;
}

function newRowId() {
  return Math.random().toString(36).slice(2);
}

export function SocialLinksField({
  name = "links_json",
  defaultValue,
  max = 12,
  className,
}: {
  name?: string;
  defaultValue?: SocialRow[];
  max?: number;
  className?: string;
}) {
  const [rows, setRows] = React.useState<
    Array<{ id: string; platform: string; url: string }>
  >(() => {
    const seed =
      defaultValue?.filter((r) => r?.platform && r.url).slice(0, max) ?? [];
    if (seed.length > 0) {
      return seed.map((r) => ({
        id: newRowId(),
        platform: r.platform,
        url: r.url,
      }));
    }
    return [{ id: newRowId(), platform: "instagram", url: "" }];
  });

  const payload = React.useMemo(() => {
    const clean = rows
      .map((r) => ({
        platform: (r.platform || "").trim(),
        url: (r.url || "").trim(),
      }))
      .filter((r) => r.platform && r.url)
      .slice(0, max);
    return JSON.stringify(clean);
  }, [rows, max]);

  const canAdd = rows.length < max;

  return (
    <div className={cn("grid gap-3", className)}>
      <input type="hidden" name={name} value={payload} />

      <div className="grid gap-2">
        {rows.map((row, index) => {
          const hint = hintForPlatform(row.platform);
          return (
            <div
              key={row.id}
              className="grid grid-cols-[auto,1fr,auto] items-center gap-2"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 gap-2 rounded-2xl px-3"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="max-w-[10rem] truncate text-sm font-semibold">
                        {labelForPlatform(row.platform)}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={row.platform}
                    onValueChange={(value) => {
                      setRows((prev) =>
                        prev.map((p) =>
                          p.id === row.id ? { ...p, platform: value } : p,
                        ),
                      );
                    }}
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <DropdownMenuRadioItem key={p.value} value={p.value}>
                        {p.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Input
                value={row.url}
                onChange={(e) => {
                  const next = e.target.value;
                  setRows((prev) =>
                    prev.map((p) =>
                      p.id === row.id ? { ...p, url: next } : p,
                    ),
                  );
                }}
                placeholder={hint ? hint : "Paste a URL"}
                aria-label={`Social link ${index + 1}`}
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-11 rounded-2xl p-0"
                  disabled={!canAdd}
                  onClick={() => {
                    if (!canAdd) return;
                    setRows((prev) => [
                      ...prev,
                      { id: newRowId(), platform: "website", url: "" },
                    ]);
                  }}
                  aria-label="Add social link"
                  title="Add"
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-11 rounded-2xl p-0"
                  onClick={() => {
                    setRows((prev) => {
                      const next = prev.filter((p) => p.id !== row.id);
                      return next.length > 0
                        ? next
                        : [{ id: newRowId(), platform: "instagram", url: "" }];
                    });
                  }}
                  aria-label="Remove social link"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground">
        Pick a platform, then paste a URL or a handle. We&apos;ll clean it up on
        save.
      </div>
    </div>
  );
}
