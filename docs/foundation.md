# Foundation Brief

## UX & Experience Principles (Step 1)
1. **Clarity in 50ms:** Hero must immediately state Itunu's name, role ("Writer & storyteller"), and primary action (Read / Collaborate). Supporting copy stays under two short sentences.
2. **Single Focal Point per Page:** Each route highlights one CTA: Home → "Work with me", About → "Collaborate", Writing → "Explore commissions", Blog → "Read the journal", Contact → "Send a note", Post → "Back to writing". Secondary links remain muted.
3. **Editorial Hierarchy:** Heading scale (display, h1, h2, h3, body, small) follows a 1.25–1.33 modular ratio with generous line-height. Body max-width ≈ 68ch to preserve readability.
4. **Breathing Room:** Sections follow an 8-based spacing scale (8/12/16/24/32/48/64/96px). Vertical rhythm pairs `padding-y` 32–64px with `max-w-6xl` containers.
5. **Semantic Layout:** App Router layouts define `<header>`, `<main>`, `<footer>`, `section` landmarks with `aria-labelledby`. Interactive elements (buttons, links) expose accessible names and focus rings derived from the accent token.
6. **Performance Simplicity:** Use native Next.js features (app router, `next/image`, `Metadata`). Avoid heavy animation libs; prefer CSS transitions with reduced-motion respect.
7. **Systemization:** Shared primitives (Container, SectionHeader, Button, Card, Tag) encapsulate spacing, typography, and color semantics so pages cannot drift stylistically.

## Color System Strategy (Step 1)
- **Base Palette:**
  - `brand` `#C49A6C`, `brand-soft` `#E0BA8A`, `accent-primary` `#4F7C70`, `accent-strong` `#31574A`, `danger` `#B1463D`, `success` `#2F7C4A`.
  - Light neutrals: `light.bg-page #F5F0E8`, `light.bg-surface #FFFFFF`, `light.bg-elevated #F0E6D8`, `light.bg-soft #FAF4EC`, text/border tokens as provided.
  - Dark neutrals: `dark.bg-page #11100E`, etc.
- **Semantic Mapping:**
  - Backgrounds → `bg-page`, `bg-surface`, `bg-elevated`, `bg-soft` map to light/dark tokens via CSS variables (`--bg-page`, etc.) toggled by `data-theme`.
  - Text → `text-primary`, `text-muted`, `text-soft`, `text-on-accent` (`#F6F1E7` for light on brand/accent backgrounds).
  - Borders → `border-subtle`, `border-strong`.
  - Buttons → `button-primary-bg = accent-primary`, `button-primary-hover = accent-strong`, `button-secondary-bg = transparent` with `border-strong` outline.
  - Focus ring color uses `accent-primary` at 35% opacity.
- **Implementation Plan:**
  1. Declare CSS variables in `app/globals.css` root for light theme; attach `[data-theme="dark"]` overrides.
  2. Tailwind `theme.extend.colors` references CSS variables to ensure runtime theming.
  3. Utility classes like `bg-surface` implemented through plugin or `@layer utilities` so components stay semantic.

## Strapi Integration Summary (Step 1)
- **Content Type:** `api::blog-post.blog-post` with `id`, `documentId`, `title`, `slug`, `description`, `content` (Markdown/rich text), `tags[]`, `status`, `publishedDate`, `isFeatured`, `featuredImage`, timestamps.
- **Public Endpoints (no auth):**
  1. `GET /api/blog-posts` – paginated published posts sorted by `publishedDate desc`. Accepts Strapi filters (pagination[page], pagination[pageSize], filters[tags][$containsi], etc.).
  2. `GET /api/blog-posts/slug/:slug` – fetch single published post; 404 if draft or missing.
  3. `GET /api/blog-posts/tag/:tag` – case-insensitive filter for published posts containing the tag.
  4. `GET /api/health` – used for uptime, will surface in monitoring but not UI.
- **Response Shape:** Strapi v5 default: `{ data: [{ id, attributes: {...} }], meta: { pagination } }`. Single fetch returns `{ data: { id, attributes }, meta: {} }`.
- **Integration Rules:**
  - Never assume drafts appear in public GETs.
  - Always request `populate=featuredImage` when the UI needs imagery.
  - Pass through `X-Request-ID` header value (if provided via config) so backend tracing works; fallback to generated UUID and echo in logs.
  - Gracefully handle 404/empty states with friendly messaging, never expose raw errors.

## Environment & Config Contract
| Variable | Scope | Purpose | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | client | Canonical site origin for metadata/canonical tags. | Required in production; dev default `http://localhost:3000`.
| `NEXT_PUBLIC_STRAPI_BASE_URL` | client | Fully qualified Strapi base (e.g., `https://cms.example.com`). | Used by API client; must not include trailing slash.
| `STRAPI_BLOG_API_TOKEN` | server | Read-only token for authenticated fetches (if public endpoints locked later). | Stored server-side only; add to Next.js runtime config. (Current contract says reads are public, but we keep token support.)
| `NEXT_PUBLIC_REQUEST_ID_HEADER` | client | Name of header for request correlation (default `X-Request-ID`). | Allows overriding without code changes.
| `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` | client | Default pagination size for blog listing. | Validate as integer.

- **Validation:** Implement runtime guard via Zod in `src/config/env.ts`. Fail fast on missing required vars.
- **Secrets Handling:** Never expose `STRAPI_BLOG_API_TOKEN` to client. Fetch blog data via server components/actions or Route Handlers.
- **Open Items:** Strapi deployment URL not yet known; document placeholder values in `.env.example` and annotate once backend host is confirmed.
