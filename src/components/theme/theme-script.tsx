import { themeMediaQuery, themeStorageKey } from "@/config/theme";

const script = `(() => {
  const STORAGE_KEY = '${themeStorageKey}';
  const MEDIA_QUERY = '${themeMediaQuery}';

  const getMedia = () => window.matchMedia(MEDIA_QUERY);
  const getSystemTheme = () => (getMedia().matches ? 'dark' : 'light');
  const isValidMode = (value) => value === 'light' || value === 'dark' || value === 'auto';
  const applyTheme = (mode, persist) => {
    const resolved = mode === 'auto' ? getSystemTheme() : mode;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = mode;
    if (persist) {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const mode = isValidMode(stored) ? stored : 'auto';
    applyTheme(mode, false);

    const media = getMedia();
    const handleChange = () => {
      const current = localStorage.getItem(STORAGE_KEY) ?? 'auto';
      if (current === 'auto') {
        applyTheme('auto', false);
      }
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(handleChange);
    }
  } catch {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.dataset.themeMode = 'light';
  }
})();`;

export const ThemeScript = () => (
  <script
    suppressHydrationWarning
    dangerouslySetInnerHTML={{
      __html: script,
    }}
  />
);
