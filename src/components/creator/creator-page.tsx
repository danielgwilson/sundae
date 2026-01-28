import {
  ArrowUpRight,
  Instagram,
  Link as LinkIcon,
  Mail,
  Music,
  Phone,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { CreatorAnalyticsBeacon } from "@/components/creator/analytics-beacon";
import { CreatorActionBar } from "@/components/creator/creator-action-bar";
import { CreatorNoiseField } from "@/components/creator/creator-noise-field";
import type { BlockType } from "@/lib/blocks";
import { type CreatorTheme, themeToStyle } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Profile = {
  id: string;
  handle: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  theme: CreatorTheme | null;
};

type BlockRow = {
  id: string;
  type: BlockType;
  enabled: boolean;
  data: unknown;
};

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function safeObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (!v) return null;
      return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      const v = u.pathname.replace("/", "");
      if (!v) return null;
      return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const v = u.pathname.split("/").filter(Boolean)[0];
      if (!v) return null;
      return `https://player.vimeo.com/video/${v}`;
    }
    return null;
  } catch {
    return null;
  }
}

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  const props = { className: "h-5 w-5" };
  if (p.includes("instagram")) return <Instagram {...props} />;
  if (p.includes("youtube")) return <Youtube {...props} />;
  if (p.includes("twitch")) return <Twitch {...props} />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter {...props} />;
  if (p.includes("email")) return <Mail {...props} />;
  if (p.includes("phone")) return <Phone {...props} />;
  if (p.includes("music") || p.includes("spotify")) return <Music {...props} />;
  return <LinkIcon {...props} />;
}

function BlockShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("creator-surface px-5 py-4", className)}
    >
      {children}
    </div>
  );
}

function LinkBlock({ blockId, data }: { blockId: string; data: unknown }) {
  const obj = safeObject(data);
  const title = safeString(obj.title);
  const url = safeString(obj.url);
  const subtitle = safeString(obj.subtitle);
  const href = `/r/${blockId}`;

  return (
    <a
      href={href}
      className={cn(
        [
          "creator-surface creator-surface--interactive",
          "flex items-center justify-between gap-4 px-5 py-4",
        ].join(" "),
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="creator-icon-badge">
          <LinkIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold tracking-tight text-[var(--creator-text)]">
            {title || "Link"}
          </div>
          <div className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-[var(--creator-muted)]">
            {subtitle || url}
          </div>
        </div>
      </div>
      <span className="creator-arrow">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      <div className="sr-only">{url}</div>
    </a>
  );
}

function DirectLinkBlock({ data }: { data: unknown }) {
  const obj = safeObject(data);
  const title = safeString(obj.title);
  const url = safeString(obj.url);
  const subtitle = safeString(obj.subtitle);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        [
          "creator-surface creator-surface--interactive",
          "flex items-center justify-between gap-4 px-5 py-4",
        ].join(" "),
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="creator-icon-badge">
          <LinkIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold tracking-tight text-[var(--creator-text)]">
            {title || "Link"}
          </div>
          <div className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-[var(--creator-muted)]">
            {subtitle || url}
          </div>
        </div>
      </div>
      <span className="creator-arrow">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      <div className="sr-only">{url}</div>
    </a>
  );
}

function TextBlock({ data }: { data: unknown }) {
  const obj = safeObject(data);
  const title = safeString(obj.title);
  const markdown = safeString(obj.markdown);

  return (
    <BlockShell>
      {title ? <div className="font-medium">{title}</div> : null}
      <div
        className={cn("text-sm text-[var(--creator-muted)]", title && "mt-1")}
      >
        {markdown.split("\n").map((line, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: stable within a saved block body
          <p key={i} className={cn(i > 0 && "mt-2")}>
            {line}
          </p>
        ))}
      </div>
    </BlockShell>
  );
}

function ImageBlock({ data }: { data: unknown }) {
  const obj = safeObject(data);
  const url = safeString(obj.url);
  const alt = safeString(obj.alt) || "Image";
  const href = safeString(obj.href);

  const image = (
    <div className="creator-surface overflow-hidden">
      <div className="relative aspect-[16/10] w-full">
        <Image src={url} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {image}
      </a>
    );
  }

  return image;
}

function EmbedBlock({ data }: { data: unknown }) {
  const obj = safeObject(data);
  const url = safeString(obj.url);
  const title = safeString(obj.title) || "Embed";
  const src = getEmbedSrc(url);

  if (!src) {
    return (
      <BlockShell>
        <div className="font-medium">{title}</div>
        <div className="mt-1 text-sm text-[var(--creator-muted)]">
          Unsupported embed URL.
        </div>
      </BlockShell>
    );
  }

  return (
    <div className="creator-surface overflow-hidden">
      <div className="relative aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function SocialBlock({ data }: { data: unknown }) {
  const obj = safeObject(data);
  const links = Array.isArray(obj.links) ? obj.links : [];

  const normalized = links
    .map((l) => safeObject(l))
    .map((l) => ({
      platform: safeString(l.platform),
      url: safeString(l.url),
    }))
    .filter((l) => l.platform && l.url);

  if (normalized.length === 0) return null;

  return (
    <BlockShell className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.22em] text-[var(--creator-muted)]">
          Socials
        </div>
        <div className="text-xs text-[var(--creator-muted)]">
          Tap to follow
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {normalized.map((l) => (
          <a
            key={`${l.platform}-${l.url}`}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="creator-pill"
          >
            <span className="creator-pill-icon">
              <SocialIcon platform={l.platform} />
            </span>
            <span className="capitalize text-[var(--creator-text)]">
              {l.platform}
            </span>
          </a>
        ))}
      </div>
    </BlockShell>
  );
}

function SupportBlock({ data }: { data: unknown }) {
  const obj = safeObject(data);
  const title = safeString(obj.title) || "Support";
  const url = safeString(obj.url);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="creator-cta"
    >
      {title}
    </a>
  );
}

function SignupBlock({
  profileId,
  data,
}: {
  profileId: string;
  data: unknown;
}) {
  const obj = safeObject(data);
  const title = safeString(obj.title) || "Sign up";
  const description = safeString(obj.description);

  return (
    <BlockShell className="p-5">
      <div className="space-y-1">
        <div className="text-base font-semibold tracking-tight">{title}</div>
        {description ? (
          <div className="text-sm text-[var(--creator-muted)]">
            {description}
          </div>
        ) : null}
      </div>
      <form
        className="mt-4 flex flex-col gap-2"
        action={`/api/leads?profileId=${encodeURIComponent(profileId)}&kind=signup`}
        method="post"
      >
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />
        <input
          name="email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          required
          className="creator-input"
        />
        <button
          type="submit"
          className="creator-cta h-11 text-sm"
        >
          Subscribe
        </button>
      </form>
    </BlockShell>
  );
}

function ContactBlock({
  profileId,
  data,
}: {
  profileId: string;
  data: unknown;
}) {
  const obj = safeObject(data);
  const title = safeString(obj.title) || "Contact";
  const description = safeString(obj.description);

  return (
    <BlockShell className="p-5">
      <div className="space-y-1">
        <div className="text-base font-semibold tracking-tight">{title}</div>
        {description ? (
          <div className="text-sm text-[var(--creator-muted)]">
            {description}
          </div>
        ) : null}
      </div>
      <form
        className="mt-4 grid gap-2"
        action={`/api/leads?profileId=${encodeURIComponent(profileId)}&kind=contact`}
        method="post"
      >
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />
        <input
          name="name"
          placeholder="Name"
          autoComplete="name"
          className="creator-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          className="creator-input"
        />
        <textarea
          name="message"
          placeholder="Message"
          autoComplete="off"
          required
          rows={4}
          className="creator-input min-h-[120px] resize-none py-3"
        />
        <button
          type="submit"
          className="creator-cta h-11 text-sm"
        >
          Send
        </button>
      </form>
    </BlockShell>
  );
}

function renderBlock(
  block: BlockRow,
  profileId: string,
  linkMode: "tracked" | "direct",
) {
  if (!block.enabled) return null;

  switch (block.type) {
    case "link":
      return linkMode === "direct" ? (
        <DirectLinkBlock data={block.data} />
      ) : (
        <LinkBlock blockId={block.id} data={block.data} />
      );
    case "text":
      return <TextBlock data={block.data} />;
    case "image":
      return <ImageBlock data={block.data} />;
    case "embed":
      return <EmbedBlock data={block.data} />;
    case "social":
      return <SocialBlock data={block.data} />;
    case "support":
      return <SupportBlock data={block.data} />;
    case "signup":
      return <SignupBlock profileId={profileId} data={block.data} />;
    case "contact":
      return <ContactBlock profileId={profileId} data={block.data} />;
  }
}

export function CreatorPage({
  profile,
  blocks,
  showPreviewBadge,
  hidePreviewBadge,
  disableAnalytics,
  embed,
  linkMode = "tracked",
  isOwner,
  layout = "default",
  effects,
}: {
  profile: Profile;
  blocks: BlockRow[];
  showPreviewBadge?: boolean;
  hidePreviewBadge?: boolean;
  disableAnalytics?: boolean;
  embed?: boolean;
  linkMode?: "tracked" | "direct";
  isOwner?: boolean;
  layout?: "default" | "showcase";
  effects?: "full" | "minimal";
}) {
  const showBadge = Boolean(showPreviewBadge && !hidePreviewBadge);
  const shouldTrack = !(disableAnalytics || showPreviewBadge);
  const showActionBar = Boolean(isOwner && !embed && !showPreviewBadge);
  const effectsMode = effects ?? (embed ? "minimal" : "full");
  const hasBlocks = blocks.some((block) => block.enabled);
  const layoutPadding =
    layout === "showcase"
      ? "px-0 py-6 sm:px-0 sm:py-7"
      : "px-6 py-12 sm:px-7 sm:py-14";
  const canvasPadding = embed
    ? "px-0 py-6 sm:px-0 sm:py-7"
    : layoutPadding;
  const layoutWidth =
    embed
      ? "max-w-none"
      : layout === "showcase"
        ? "max-w-none"
        : "max-w-[32rem]";

  return (
    <div
      className={cn(
        "creator-shell",
        effectsMode === "minimal" && "creator-shell--minimal",
        !embed && "min-h-screen",
      )}
      style={themeToStyle(profile.theme)}
      data-handle={profile.handle}
    >
      <div
        className={cn(
          "relative creator-canvas text-[var(--creator-text)]",
          canvasPadding,
          embed ? "min-h-full" : "min-h-screen",
          showActionBar && "pb-24",
        )}
      >
        <div
          className="absolute inset-0 -z-20"
          style={{ background: "var(--creator-bg)" }}
        />
        {effectsMode === "full" ? (
          <>
            <CreatorNoiseField className="-z-10" />
            <div className="absolute inset-0 -z-10 creator-grid opacity-[0.22]" />
          </>
        ) : null}

        <div className={cn("mx-auto w-full space-y-6", layoutWidth)}>
          <header className="creator-hero">
            {showBadge ? (
              <div className="mb-3 inline-flex items-center rounded-full border border-[color-mix(in_oklab,var(--creator-text)_14%,transparent)] bg-[color-mix(in_oklab,var(--creator-card)_85%,transparent)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--creator-muted)] shadow-sm backdrop-blur">
                Preview
              </div>
            ) : null}
            {profile.avatarUrl ? (
              <div className="creator-avatar-shell">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              {profile.displayName}
            </h1>
            {profile.bio ? (
              <p className="mt-2 max-w-sm text-sm text-[var(--creator-muted)]">
                {profile.bio}
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--creator-muted)]">
              <span className="creator-handle">
                @{profile.handle}
              </span>
            </div>
          </header>

          {hasBlocks ? (
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[var(--creator-muted)]">
              <span>Links</span>
              <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--creator-text)_12%,transparent)]" />
            </div>
          ) : null}

          <div className="grid gap-4">
            {blocks.map((b) => (
              <React.Fragment key={b.id}>
                {renderBlock(b, profile.id, linkMode)}
              </React.Fragment>
            ))}
          </div>

          <footer className="pt-2 text-center text-[11px] uppercase tracking-[0.22em] text-[var(--creator-muted)]">
            <a className="hover:text-[var(--creator-text)]" href="/">
              Powered by Sundae
            </a>
          </footer>
        </div>
      </div>

      {shouldTrack ? <CreatorAnalyticsBeacon handle={profile.handle} /> : null}
      {showActionBar ? <CreatorActionBar handle={profile.handle} /> : null}
    </div>
  );
}
