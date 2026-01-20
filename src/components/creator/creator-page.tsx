import {
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
import { Badge } from "@/components/ui/badge";
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
      className={cn(
        "rounded-3xl border border-black/10 bg-[var(--creator-card)] px-4 py-3 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur",
        className,
      )}
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
        "group relative block overflow-hidden rounded-3xl border border-black/10 bg-[var(--creator-card)] px-4 py-3 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur transition",
        "hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-40px_rgba(0,0,0,0.45)] active:translate-y-0",
      )}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-[var(--creator-accent)]/20 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-[var(--creator-btn-bg)]/25 blur-3xl" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-semibold tracking-tight">
            {title || "Link"}
          </div>
          {subtitle ? (
            <div className="truncate text-sm text-[var(--creator-muted)]">
              {subtitle}
            </div>
          ) : null}
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 rounded-full bg-background/70"
        >
          Open
        </Badge>
      </div>
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
    <div className="overflow-hidden rounded-xl border bg-[var(--creator-card)] shadow-sm">
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
    <div className="overflow-hidden rounded-xl border bg-[var(--creator-card)] shadow-sm">
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
    <BlockShell className="flex flex-wrap items-center justify-center gap-2">
      {normalized.map((l) => (
        <a
          key={`${l.platform}-${l.url}`}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-background/60 px-3 py-2 text-sm shadow-sm backdrop-blur transition hover:bg-background/80"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--creator-accent)]/15 text-[var(--creator-text)]">
            <SocialIcon platform={l.platform} />
          </span>
          <span className="capitalize text-[var(--creator-text)]">
            {l.platform}
          </span>
        </a>
      ))}
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
      className="block rounded-xl bg-[var(--creator-btn-bg)] px-4 py-3 text-center font-medium text-[var(--creator-btn-text)] shadow-sm hover:opacity-95"
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
    <BlockShell className="p-4">
      <div className="space-y-1">
        <div className="font-semibold tracking-tight">{title}</div>
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
          required
          className="h-11 rounded-2xl border border-black/10 bg-background/75 px-4 text-sm text-[var(--creator-text)] outline-none placeholder:text-[var(--creator-muted)] focus:border-black/20 focus:ring-4 focus:ring-[var(--creator-accent)]/15"
        />
        <button
          type="submit"
          className="h-11 w-full rounded-2xl bg-[var(--creator-btn-bg)] px-4 text-sm font-semibold text-[var(--creator-btn-text)] shadow-sm transition hover:opacity-95"
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
    <BlockShell className="p-4">
      <div className="space-y-1">
        <div className="font-semibold tracking-tight">{title}</div>
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
          className="h-11 rounded-2xl border border-black/10 bg-background/75 px-4 text-sm text-[var(--creator-text)] outline-none placeholder:text-[var(--creator-muted)] focus:border-black/20 focus:ring-4 focus:ring-[var(--creator-accent)]/15"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="h-11 rounded-2xl border border-black/10 bg-background/75 px-4 text-sm text-[var(--creator-text)] outline-none placeholder:text-[var(--creator-muted)] focus:border-black/20 focus:ring-4 focus:ring-[var(--creator-accent)]/15"
        />
        <textarea
          name="message"
          placeholder="Message"
          required
          rows={4}
          className="min-h-[110px] resize-none rounded-2xl border border-black/10 bg-background/75 px-4 py-3 text-sm text-[var(--creator-text)] outline-none placeholder:text-[var(--creator-muted)] focus:border-black/20 focus:ring-4 focus:ring-[var(--creator-accent)]/15"
        />
        <button
          type="submit"
          className="h-11 w-full rounded-2xl bg-[var(--creator-btn-bg)] px-4 text-sm font-semibold text-[var(--creator-btn-text)] shadow-sm transition hover:opacity-95"
        >
          Send
        </button>
      </form>
    </BlockShell>
  );
}

function renderBlock(block: BlockRow, profileId: string) {
  if (!block.enabled) return null;

  switch (block.type) {
    case "link":
      return <LinkBlock blockId={block.id} data={block.data} />;
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
}: {
  profile: Profile;
  blocks: BlockRow[];
  showPreviewBadge?: boolean;
}) {
  return (
    <div
      className="min-h-screen"
      style={themeToStyle(profile.theme)}
      data-handle={profile.handle}
    >
      <div
        className="min-h-screen px-5 py-10 text-[var(--creator-text)]"
        style={{ background: "var(--creator-bg)" }}
      >
        <div className="mx-auto w-full max-w-md space-y-6">
          <header className="flex flex-col items-center text-center">
            {showPreviewBadge ? (
              <div className="mb-3 inline-flex items-center rounded-full border bg-[var(--creator-card)] px-3 py-1 text-xs text-[var(--creator-muted)]">
                Preview
              </div>
            ) : null}
            {profile.avatarUrl ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-black/10 bg-[var(--creator-card)] shadow-sm">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              {profile.displayName}
            </h1>
            {profile.bio ? (
              <p className="mt-1 max-w-sm text-sm text-[var(--creator-muted)]">
                {profile.bio}
              </p>
            ) : null}
            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--creator-muted)]">
              <span className="rounded-full border border-black/10 bg-background/60 px-3 py-1 backdrop-blur">
                @{profile.handle}
              </span>
            </div>
          </header>

          <div className="grid gap-3">
            {blocks.map((b) => (
              <React.Fragment key={b.id}>
                {renderBlock(b, profile.id)}
              </React.Fragment>
            ))}
          </div>

          <footer className="pt-4 text-center text-xs text-[var(--creator-muted)]">
            <a className="underline underline-offset-4" href="/">
              Powered by Sundae
            </a>
          </footer>
        </div>
      </div>

      {!showPreviewBadge ? (
        <CreatorAnalyticsBeacon handle={profile.handle} />
      ) : null}
    </div>
  );
}
