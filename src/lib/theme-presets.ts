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
        "radial-gradient(860px 560px at 10% 8%, oklch(0.86 0.08 245 / 26%), transparent 62%), radial-gradient(720px 520px at 88% 10%, oklch(0.86 0.12 80 / 18%), transparent 64%), radial-gradient(680px 520px at 72% 86%, oklch(0.74 0.1 300 / 12%), transparent 60%), linear-gradient(180deg, oklch(0.995 0.005 255), oklch(0.965 0.01 255))",
      cardBackground: "oklch(0.99 0.01 250 / 96%)",
      text: "oklch(0.18 0.02 265)",
      mutedText: "oklch(0.46 0.02 265)",
      buttonBackground: "oklch(0.56 0.2 248)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.86 0.12 80)",
    },
  },
  "strawberry-night": {
    name: "Midnight Neon",
    theme: {
      background:
        "radial-gradient(900px 560px at 16% 10%, oklch(0.6 0.2 285 / 18%), transparent 60%), radial-gradient(760px 520px at 86% 16%, oklch(0.62 0.22 255 / 20%), transparent 62%), linear-gradient(180deg, oklch(0.12 0.02 265), oklch(0.09 0.02 265))",
      cardBackground: "oklch(0.24 0.02 265 / 92%)",
      text: "oklch(0.98 0 0)",
      mutedText: "oklch(0.98 0 0 / 72%)",
      buttonBackground: "oklch(0.64 0.22 255)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.76 0.2 320)",
    },
  },
  "mint-chip": {
    name: "Lime Fog",
    theme: {
      background:
        "radial-gradient(860px 560px at 12% 18%, oklch(0.86 0.06 30 / 18%), transparent 62%), radial-gradient(720px 520px at 88% 18%, oklch(0.8 0.1 210 / 16%), transparent 64%), linear-gradient(180deg, oklch(0.995 0.005 255), oklch(0.965 0.01 255))",
      cardBackground: "oklch(0.99 0.01 240 / 94%)",
      text: "oklch(0.18 0.02 265)",
      mutedText: "oklch(0.46 0.02 265)",
      buttonBackground: "oklch(0.62 0.18 30)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.72 0.14 210)",
    },
  },
  "blueberry-soda": {
    name: "Ink Soda",
    theme: {
      background:
        "radial-gradient(900px 560px at 16% 14%, oklch(0.62 0.18 245 / 22%), transparent 62%), radial-gradient(760px 520px at 86% 22%, oklch(0.76 0.16 60 / 12%), transparent 64%), linear-gradient(180deg, oklch(0.11 0.02 265), oklch(0.08 0.02 265))",
      cardBackground: "oklch(0.22 0.02 265 / 92%)",
      text: "oklch(0.98 0 0)",
      mutedText: "oklch(0.98 0 0 / 72%)",
      buttonBackground: "oklch(0.66 0.2 245)",
      buttonText: "oklch(0.98 0 0)",
      accent: "oklch(0.84 0.12 80)",
    },
  },
};
