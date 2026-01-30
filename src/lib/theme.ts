import type React from "react";

export type CreatorTheme = {
  background?: string;
  cardBackground?: string;
  text?: string;
  mutedText?: string;
  buttonBackground?: string;
  buttonText?: string;
  accent?: string;
  layout?: "default" | "showcase";
  effects?: "full" | "minimal";
};

export function themeToStyle(theme: CreatorTheme | null | undefined) {
  const t = theme ?? {};
  return {
    "--creator-bg":
      t.background ??
      "radial-gradient(860px 560px at 10% 8%, oklch(0.86 0.08 245 / 26%), transparent 62%), radial-gradient(720px 520px at 88% 10%, oklch(0.86 0.12 80 / 18%), transparent 64%), radial-gradient(680px 520px at 72% 86%, oklch(0.74 0.1 300 / 12%), transparent 60%), linear-gradient(180deg, oklch(0.995 0.005 255), oklch(0.965 0.01 255))",
    "--creator-card": t.cardBackground ?? "oklch(0.99 0.01 250 / 96%)",
    "--creator-text": t.text ?? "oklch(0.18 0.02 265)",
    "--creator-muted": t.mutedText ?? "oklch(0.46 0.02 265)",
    "--creator-btn-bg": t.buttonBackground ?? "oklch(0.56 0.2 248)",
    "--creator-btn-text": t.buttonText ?? "oklch(0.98 0 0)",
    "--creator-accent": t.accent ?? "oklch(0.86 0.12 80)",
  } as React.CSSProperties;
}

export function coerceCreatorTheme(value: unknown): CreatorTheme | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as CreatorTheme;
  }
  return null;
}
