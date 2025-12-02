# Page Plan (Text-Only)

Each page aligns with the editorial, beige art direction. Dominant tokens reference the semantic palette defined in `foundation.md`.

## Home
- **Purpose:** Introduce Itunu, highlight positioning, funnel visitors to work inquiries or featured writing.
- **Sections (top→bottom):**
  1. Hero (name, descriptor, CTA "Work with me", secondary "Read writing").
  2. What I Do (three pillars: Brand Narratives, Editorial Essays, Speaking/Workshops) with supporting copy.
  3. Featured Writing (cards for curated Strapi posts marked `isFeatured` or curated list).
  4. Testimonial Pull Quote.
  5. Final CTA Banner (“Let’s collaborate”).
- **Main CTA:** "Work with me" button linking to Contact.
- **Core Components:** HeroSection, PillarList, PostCard (featured variant), QuoteBlock, CTASection.
- **Dominant Tokens:** Background `bg-page`, hero `bg-elevated`, cards `bg-surface`, accents `brand` + `accent-primary`.

## About
- **Purpose:** Share story, philosophy, and collaborations to build trust.
- **Sections:**
  1. Intro narrative (image + copy).
  2. Values / Approach grid (insightful statements).
  3. Focus Areas (chips describing beats/topics).
  4. Select Milestones timeline (3–4 entries) with future-friendly placeholders.
  5. Call-to-action linking to Writing/Contact.
- **Main CTA:** "Collaborate with Itunu".
- **Components:** SplitSection, ValueCard, TagList, Timeline, CTASection.
- **Dominant Tokens:** `bg-page` overall, `bg-soft` for timeline rows, `accent-primary` for headings.

## Writing / Portfolio
- **Purpose:** Curate highlight pieces (mix of Strapi + external commissions) with filtering.
- **Sections:**
  1. Intro/filter bar (tags: Essays, Brand, Interview, etc.).
  2. Grid of Featured Pieces (cards with category chip, description, link type indicator).
  3. Secondary CTA pointing to Blog for deeper archive.
- **Main CTA:** "Request commissioned piece" (links to Contact).
- **Components:** FilterBar, PieceCard, EmptyState, Button.
- **Dominant Tokens:** `bg-page`, cards `bg-surface`, filter chips `brand-soft`, active `accent-primary`.

## Blog (Listing)
- **Purpose:** Provide paginated access to Strapi posts.
- **Sections:**
  1. Intro hero (title + short copy).
  2. Tag filter row (driven by Strapi tags or curated set).
  3. Paginated PostList (list or grid) with metadata.
  4. Newsletter teaser / CTA to contact.
- **Main CTA:** "Subscribe for updates" (placeholder) or "Get in touch" depending on final decision; primary action remains reading posts via cards.
- **Components:** PostFilterBar, PostList, PaginationControls, EmptyState, CTASection.
- **Dominant Tokens:** `bg-page`, list `bg-surface`, filter `bg-soft`, accent `accent-primary` for active tag.

## Single Blog Post
- **Purpose:** Showcase one article with beautiful typography and navigation points.
- **Sections:**
  1. Post header (title, deck, published date, reading time, tags).
  2. Featured image (optional) using `next/image`.
  3. Prose content (Markdown rendered via MDX/remark).
  4. Share/back section (CTA to contact or read next post).
- **Main CTA:** "Back to writing" or "Work with me" (contextual, but only one primary button at a time).
- **Components:** PostHeader, TagList, ProseContent, PostFooterNav.
- **Dominant Tokens:** `bg-page`, `bg-surface` for prose container, accent tokens for tag pills.

## Contact
- **Purpose:** Capture collaboration inquiries with a form and alternative contact info.
- **Sections:**
  1. Intro copy (availability statement).
  2. Contact form (name, email, company, message) with validation + placeholder success state.
  3. Alternate channels (email placeholder using env, social links from config).
- **Main CTA:** "Send message" (form submit).
- **Components:** Form fields (Input, Textarea, Label, HelperText), ContactCard, Button, AlertBanner.
- **Dominant Tokens:** `bg-page`, form card `bg-surface`, inputs use `border-subtle`, focus ring `accent-primary`.

## Global Elements
- **Header:** Logo/wordmark (text), nav links (Home, About, Writing, Blog, Contact), theme toggle placeholder.
- **Footer:** Copyright (dynamic year), social links (config-driven), secondary CTA.
- **Utilities:** Container, Section, Grid classes, Request ID provider (context for logging), analytics hook placeholder.
