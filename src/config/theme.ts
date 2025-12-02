export type ThemeMode = "light" | "dark" | "auto";

export const themeStorageKey = "itunus-theme";

export const themeMediaQuery = "(prefers-color-scheme: dark)";

export const themeOptions: Array<{ value: ThemeMode; label: string; ariaLabel: string }> = [
  { value: "auto", label: "Auto", ariaLabel: "Use system appearance" },
  { value: "light", label: "Light", ariaLabel: "Use light theme" },
  { value: "dark", label: "Dark", ariaLabel: "Use dark theme" },
];
