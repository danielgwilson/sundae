import type { BlockType } from "@/lib/blocks";
import type { CreatorTheme } from "@/lib/theme";
import { THEME_PRESETS } from "@/lib/theme-presets";

export type DemoProfile = {
  id: string;
  handle: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  theme: CreatorTheme;
};

export type DemoBlock = {
  id: string;
  type: BlockType;
  enabled: boolean;
  data: unknown;
};

export const DEMO_PROFILE: DemoProfile = {
  id: "00000000-0000-0000-0000-000000000000",
  handle: "demo",
  displayName: "Demo Creator",
  bio: "A real Sundae page: links, embeds, lead capture, and click tracking.",
  avatarUrl: "/brand/demo-avatar.svg",
  theme: THEME_PRESETS.vanilla.theme,
};

export const DEMO_BLOCKS: DemoBlock[] = [
  {
    id: "demo-link-1",
    type: "link",
    enabled: true,
    data: {
      title: "Watch the latest video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      subtitle: "new upload",
    },
  },
  {
    id: "demo-social-1",
    type: "social",
    enabled: true,
    data: {
      links: [
        { platform: "instagram", url: "https://instagram.com" },
        { platform: "youtube", url: "https://youtube.com" },
        { platform: "x", url: "https://x.com" },
      ],
    },
  },
  {
    id: "demo-image-1",
    type: "image",
    enabled: true,
    data: {
      url: "/brand/demo-banner.svg",
      alt: "A colorful demo banner",
      href: "https://sundae.to",
    },
  },
  {
    id: "demo-text-1",
    type: "text",
    enabled: true,
    data: {
      title: "About",
      markdown:
        "I share weekly behind‑the‑scenes on building products.\nWant updates? Subscribe below.",
    },
  },
  {
    id: "demo-signup-1",
    type: "signup",
    enabled: true,
    data: {
      title: "Join my newsletter",
      description: "One email a week. No spam. Unsubscribe anytime.",
    },
  },
  {
    id: "demo-contact-1",
    type: "contact",
    enabled: true,
    data: {
      title: "Contact",
      description: "Collabs, speaking, brand work.",
    },
  },
  {
    id: "demo-support-1",
    type: "support",
    enabled: true,
    data: { title: "Tip jar", url: "https://ko-fi.com" },
  },
];
