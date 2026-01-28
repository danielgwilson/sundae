import type { CreatorTheme } from "@/lib/theme";

export type ThemePresetId =
  | "vanilla"
  | "strawberry-night"
  | "mint-chip"
  | "blueberry-soda";

export const THEME_PRESET_IDS: ThemePresetId[] = [
  "vanilla",
  "strawberry-night",
  "mint-chip",
  "blueberry-soda",
];

export const THEME_PRESETS: Record<
  ThemePresetId,
  { name: string; theme: CreatorTheme }
> = {
  vanilla: {
    name: "Paper Grid",
    theme: {
      background:
        "radial-gradient(860px 560px at 8% 12%, oklch(0.76 0.14 245 / 18%), transparent 62%), radial-gradient(720px 520px at 92% 10%, oklch(0.86 0.12 80 / 14%), transparent 62%), radial-gradient(640px 520px at 72% 88%, oklch(0.7 0.12 280 / 12%), transparent 60%), linear-gradient(180deg, oklch(1 0 0), oklch(0.97 0 0))",
      cardBackground: "oklch(1 0 0 / 72%)",
      text: "oklch(0.17 0.02 265)",
      mutedText: "oklch(0.49 0.02 265)",
      buttonBackground: "oklch(0.56 0.2 248)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.86 0.12 80)",
    },
  },
  "strawberry-night": {
    name: "Midnight Neon",
    theme: {
      background:
        "radial-gradient(900px 560px at 16% 12%, oklch(0.48 0.18 250 / 20%), transparent 60%), radial-gradient(760px 520px at 88% 18%, oklch(0.7 0.2 320 / 16%), transparent 62%), linear-gradient(180deg, oklch(0.14 0.02 265), oklch(0.1 0.02 265))",
      cardBackground: "oklch(1 0 0 / 10%)",
      text: "oklch(0.98 0 0)",
      mutedText: "oklch(0.98 0 0 / 72%)",
      buttonBackground: "oklch(0.62 0.22 255)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.72 0.18 310)",
    },
  },
  "mint-chip": {
    name: "Lime Fog",
    theme: {
      background:
        "radial-gradient(860px 560px at 12% 18%, oklch(0.84 0.08 30 / 18%), transparent 62%), radial-gradient(720px 520px at 88% 18%, oklch(0.78 0.12 210 / 14%), transparent 64%), linear-gradient(180deg, oklch(1 0 0), oklch(0.97 0 0))",
      cardBackground: "oklch(1 0 0 / 70%)",
      text: "oklch(0.17 0.02 265)",
      mutedText: "oklch(0.49 0.02 265)",
      buttonBackground: "oklch(0.6 0.2 20)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.72 0.14 210)",
    },
  },
  "blueberry-soda": {
    name: "Ink Soda",
    theme: {
      background:
        "radial-gradient(900px 560px at 16% 14%, oklch(0.65 0.16 250 / 22%), transparent 62%), radial-gradient(760px 520px at 88% 20%, oklch(0.75 0.18 80 / 12%), transparent 64%), linear-gradient(180deg, oklch(0.13 0.02 265), oklch(0.09 0.02 265))",
      cardBackground: "oklch(1 0 0 / 12%)",
      text: "oklch(0.98 0 0)",
      mutedText: "oklch(0.98 0 0 / 72%)",
      buttonBackground: "oklch(0.68 0.2 245)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.84 0.12 80)",
    },
  },
};
