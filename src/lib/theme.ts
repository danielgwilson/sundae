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
      "radial-gradient(800px 520px at 10% 10%, oklch(0.94 0.08 12 / 65%), transparent 65%), radial-gradient(760px 520px at 92% 18%, oklch(0.92 0.09 250 / 65%), transparent 65%), radial-gradient(680px 520px at 70% 88%, oklch(0.93 0.08 140 / 55%), transparent 62%), linear-gradient(180deg, oklch(0.99 0.01 85), oklch(0.975 0.02 85))",
    "--creator-card": t.cardBackground ?? "oklch(0.995 0.01 85 / 72%)",
    "--creator-text": t.text ?? "oklch(0.2 0.03 40)",
    "--creator-muted": t.mutedText ?? "oklch(0.52 0.03 45)",
    "--creator-btn-bg": t.buttonBackground ?? "oklch(0.63 0.23 12)",
    "--creator-btn-text": t.buttonText ?? "oklch(0.985 0.015 85)",
    "--creator-accent": t.accent ?? "oklch(0.7 0.14 250)",
  } as React.CSSProperties;
}

export function coerceCreatorTheme(value: unknown): CreatorTheme | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as CreatorTheme;
  }
  return null;
}
