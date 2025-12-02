# Design System Spec

## Token Dictionary
| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `bg-page` | `light.bg-page` | `dark.bg-page` | Body background.
| `bg-surface` | `light.bg-surface` | `dark.bg-surface` | Cards, form shells.
| `bg-elevated` | `light.bg-elevated` | `dark.bg-elevated` | Hero panels, nav.
| `bg-soft` | `light.bg-soft` | `dark.bg-soft` | Subtle sections, filters.
| `text-primary` | `light.text-primary` | `dark.text-primary` | Core copy.
| `text-muted` | `light.text-muted` | `dark.text-muted` | Secondary text.
| `text-soft` | `light.text-soft` | `dark.text-soft` | Captions.
| `text-on-accent` | `#FFFFFF` | `#F6F1E7` | Text on brand/accent surfaces.
| `border-subtle` | `light.border-subtle` | `dark.border-subtle` | Input borders.
| `border-strong` | `light.border-strong` | `dark.border-strong` | Dividers, cards.
| `brand` | `#C49A6C` | `#C49A6C` | Logo, highlights.
| `brand-soft` | `#E0BA8A` | `#E0BA8A` | Background flourishes.
| `accent-primary` | `#4F7C70` | `#4F7C70` | Buttons, links.
| `accent-strong` | `#31574A` | `#31574A` | Hover states.
| `danger` | `#B1463D` | `#B1463D` | Alerts.
| `success` | `#2F7C4A` | `#2F7C4A` | Success states.
| `focus-ring` | `accent-primary` @ 35% alpha | same | Focus outlines.

Spacing scale (px): `0, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 96`. Mapping to Tailwind via `spacing: { 1:4px, 1.5:6px, ... }` to preserve 8-base rhythm.

Type scale (Tailwind `fontSize`):
- `display`: `3.5rem/1.05`
- `h1`: `2.75rem/1.1`
- `h2`: `2.125rem/1.2`
- `h3`: `1.5rem/1.3`
- `body`: `1rem/1.65`
- `body-lg`: `1.125rem/1.6`
- `body-sm`: `0.875rem/1.5`
- `caption`: `0.75rem/1.4`

## Tailwind Theme Configuration
Tailwind v4 uses the inline `@theme` API, so tokens are declared in `app/globals.css` rather than a standalone config file. The mapping mirrors the table above:

```css
@theme inline {
  --color-brand: var(--brand);
  --color-bg-page: var(--bg-page);
  --color-text-primary: var(--text-primary);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  /* ...etc for every token */
}

.text-display {
  font-size: clamp(2.75rem, 5vw, 3.5rem);
  line-height: 1.05;
}

.text-body {
  font-size: 1rem;
  line-height: 1.65;
}
```

Custom utilities (e.g., `.shadow-soft`, `.text-body-sm`) live alongside the global theme file to keep Tailwind’s generated classes semantic.

## Component Library (Props & Responsibilities)
| Component | Props | Description |
| --- | --- | --- |
| `Container` | `children`, `size: 'sm' | 'md' | 'lg'`, `className?` | Centers content with responsive max-width + padding.
| `Section` | `title`, `eyebrow?`, `subtitle?`, `align?`, `children`, `id?` | Wraps sections with semantic `<section>` and spacing.
| `Button` | `variant: 'primary' | 'secondary' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `href?`, `asChild?`, `icon?`, `loading?` | Uses semantic tokens for background/text; handles disabled/loading states.
| `Badge` | `variant: 'brand' | 'accent' | 'neutral'`, `children` | Small label using tokens.
| `Card` | `variant: 'surface' | 'elevated'`, `as?: 'article' | 'div'`, `children`, `href?` | Standardized padding, border, hover.
| `TagPill` | `label`, `active?`, `onClick?` | Used for filters/tags; toggles accent background when active.
| `PostCard` | `post: BlogPost`, `variant?: 'featured' | 'default'` | Renders Strapi data (title, description, date, tags, image).
| `QuoteBlock` | `quote`, `author`, `role?` | Pull quote section.
| `Timeline` | `items: Array<{ title, description, date, status? }>` | Renders milestones with vertical rhythm.
| `FormField` | `label`, `name`, `type`, `placeholder?`, `helperText?`, `error?`, `required?` | Shared field wrapper with label + error text.
| `RequestIdProvider` | `children` | React context to store/generated `X-Request-ID` values for logging.

## Token → Utility Mapping
- `bg-page` → utility `.bg-page` (`background-color: var(--color-bg-page)`); same pattern for `bg-surface`, etc.
- `text-primary` → `.text-primary` etc.
- Buttons rely on semantic utilities (`bg-accent-primary text-text-on-accent hover:bg-accent-strong`) so every state maps to a real CSS variable.
- Borders: use `border-border-subtle` classes hooking to CSS variables.
- Focus ring: apply `.focus-ring` utility via plugin or `focus-visible:outline` classes referencing `--color-focus-ring`.

## Theme Modes
- Light tokens load by default; dark tokens override via `[data-theme="dark"]`.
- Users can toggle light, dark, or auto (system) modes from the site header; the choice persists in `localStorage` under `itunus-theme`.
- Auto mode listens to `prefers-color-scheme` changes so the UI updates immediately when the OS switches.

## Accessibility Guardrails
- Minimum contrast 4.5:1 maintained by pairing `text-primary` vs `bg-page` (contrast ~12:1) and `text-on-accent` vs `button-primary-bg` (contrast > 4.5:1).
- Buttons + links include `aria-label` when icon-only.
- Card grids ensure `article` semantics when representing standalone stories.
- Motion-reduced variant: `prefers-reduced-motion` media query disables any future parallax/transitions beyond opacity/transform 200ms.
