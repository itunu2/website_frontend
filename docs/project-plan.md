# Frontend Delivery Plan

## Phase 1 – Strategic Foundations & System Definition
- **Goal:** Establish a shared product vision, IA blueprint, and design system contract before implementation.
- **Deliverables:**
  1. `docs/foundation.md` – UX principles, color/token strategy, Strapi/infra assumptions, environment contract.
  2. `docs/page-plan.md` – Text-only plan for Home, About, Writing, Blog, Post, Contact (purpose, sections, CTAs, component needs, dominant tokens).
  3. `docs/design-system.md` – Token dictionary, Tailwind theme extension spec, component library definitions with props/state patterns.
- **Success Criteria:** Stakeholders can review content architecture and system tokens without reading code; no unanswered questions about APIs, env vars, or brand direction remain before scaffolding.
- **Dependencies/Risks:** Requires accurate interpretation of `backend/FRONTEND_HANDOFF.md`; mitigation is to cite that document directly and flag assumptions inline.

## Phase 2 – Platform Scaffold & Infrastructure
- **Goal:** Stand up the production-ready Next.js (latest) + TypeScript + Tailwind stack, wire core layout, env loader, API client base, and automated quality gates.
- **Deliverables:**
  1. Initialize project via `create-next-app@latest` with App Router, Tailwind preset, ESLint, SWC.
  2. Configure Tailwind using tokens from Phase 1 (colors, spacing, typography) and add base styles (CSS variables, `@layer base`).
  3. Implement `src/config/env.ts` with runtime validation (e.g., Zod) for `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_STRAPI_BASE_URL`, `STRAPI_BLOG_API_TOKEN`, `NEXT_PUBLIC_REQUEST_ID_HEADER`, etc.
  4. Build Strapi API client scaffolding under `src/lib/strapi/` with typed DTOs, fetch wrapper (retry + error normalization), and logging hooks.
  5. Create global layout (`app/layout.tsx`) with font loading, metadata defaults, Header/Footer shells, and theming context (light/dark token mapping).
  6. Add CI-ready scripts (`lint`, `type-check`, `test`, `build`) plus initial Jest/Playwright config for upcoming tests.
- **Success Criteria:** `npm run lint`, `npm run test`, and `npm run build` succeed; visiting Home renders the shell with placeholder sections; API/client utilities compile.
- **Dependencies/Risks:** Blocking factors include env secrets availability and Strapi base URL; mitigate with `.env.example` and runtime validation that fails loudly when misconfigured.

## Phase 3 – Experience Implementation & Test Hardening
- **Goal:** Ship the complete editorial experience (all required pages, Strapi integration, contact form scaffolding) with production-grade resilience and coverage.
- **Deliverables:**
  1. Implement Home/About/Writing/Blog/Post/Contact routes using reusable sections and semantic layout primitives; ensure content matches page plan.
  2. Integrate Strapi data (listing, slug, tag filters) with graceful loading/empty/error states, caching hints, and request-id passthrough.
  3. Build form handling abstraction (client validation + API placeholder) for Contact, making submission ready for backend wiring.
  4. Add comprehensive component/page tests (unit + integration + visual regression smoke via Playwright) and accessibility checks (axe).
  5. Document deployment checklist (Vercel) and provide final design review log referencing the checklist from Phase 1.
- **Success Criteria:** All pages render with real data (where available) and pass Lighthouse performance/accessibility > 90, Jest/Playwright suites green, and documentation updated.
- **Dependencies/Risks:** Real Strapi content availability, contact form endpoint, and future localization. Mitigation: feature-flag networked functionality, provide placeholders, and clearly annotate follow-ups in docs.
