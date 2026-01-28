import type React from "react";

export type CreatorTheme = {
  background?: string;
  cardBackground?: string;
  text?: string;
  mutedText?: string;
  buttonBackground?: string;
  buttonText?: string;
  accent?: string;
};

export function themeToStyle(theme: CreatorTheme | null | undefined) {
  const t = theme ?? {};
  return {
    "--creator-bg":
      t.background ??
      "radial-gradient(860px 560px at 8% 12%, oklch(0.76 0.14 245 / 18%), transparent 62%), radial-gradient(720px 520px at 92% 10%, oklch(0.86 0.12 80 / 14%), transparent 62%), radial-gradient(640px 520px at 72% 88%, oklch(0.7 0.12 280 / 12%), transparent 60%), linear-gradient(180deg, oklch(1 0 0), oklch(0.97 0 0))",
    "--creator-card": t.cardBackground ?? "oklch(1 0 0 / 72%)",
    "--creator-text": t.text ?? "oklch(0.17 0.02 265)",
    "--creator-muted": t.mutedText ?? "oklch(0.49 0.02 265)",
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
