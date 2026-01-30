export type BlockType =
  | "link"
  | "text"
  | "image"
  | "embed"
  | "social"
  | "support"
  | "signup"
  | "contact";

export type LinkBlockData = {
  title: string;
  url: string;
  subtitle?: string;
};

export type TextBlockData = {
  title?: string;
  markdown: string;
};

export type ImageBlockData = {
  url: string;
  alt?: string;
  href?: string;
};

export type EmbedBlockData = {
  url: string;
  title?: string;
};

export type SocialBlockData = {
  links: Array<{ platform: string; url: string }>;
};

export type SupportBlockData = {
  title: string;
  url: string;
};

export type SignupBlockData = {
  title: string;
  description?: string;
  leadMagnetUrl?: string;
  thankYouMessage?: string;
};

export type ContactBlockData = {
  title: string;
  description?: string;
  thankYouMessage?: string;
};

export type BlockDataByType = {
  link: LinkBlockData;
  text: TextBlockData;
  image: ImageBlockData;
  embed: EmbedBlockData;
  social: SocialBlockData;
  support: SupportBlockData;
  signup: SignupBlockData;
  contact: ContactBlockData;
};

export function defaultBlockData(type: BlockType): BlockDataByType[BlockType] {
  switch (type) {
    case "link":
      return { title: "New link", url: "https://example.com" };
    case "text":
      return { title: "About", markdown: "Write something…" };
    case "image":
      return { url: "https://placehold.co/1200x800/png", alt: "Image" };
    case "embed":
      return { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" };
    case "social":
      return {
        links: [{ platform: "instagram", url: "@yourhandle" }],
      };
    case "support":
      return { title: "Support my work", url: "https://ko-fi.com/" };
    case "signup":
      return {
        title: "Join my newsletter",
        description: "No spam. Unsubscribe anytime.",
      };
    case "contact":
      return { title: "Contact me", description: "I read every message." };
  }
}
