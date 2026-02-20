# Security Guidelines

## Environment Variables

### Public Variables (Safe to Expose to Browser)

All variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JavaScript:

- `NEXT_PUBLIC_SITE_URL` - Your frontend URL
- `NEXT_PUBLIC_STRAPI_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_REQUEST_ID_HEADER` - Request tracking header name
- `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` - Pagination size
- `NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS` - Cache revalidation interval

**IMPORTANT**: Never put secrets in `NEXT_PUBLIC_*` variables.

### Private Variables (Server-Side Only)

These are only accessible on the server and never sent to the browser:

- `STRAPI_BLOG_API_TOKEN` - API token for backend authentication

## API Security

- API tokens should be read-only when possible
- Use Server Components in Next.js to keep tokens server-side
- Never expose `STRAPI_BLOG_API_TOKEN` in Client Components

## Content Security

- All user-generated content should be sanitized
- Markdown rendering is safe (using `react-markdown` with `remark-gfm`)
- Image URLs are validated through Next.js Image component

## Deployment Checklist

Before deploying to production:

- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] `NEXT_PUBLIC_STRAPI_BASE_URL` set to production backend
- [ ] `STRAPI_BLOG_API_TOKEN` configured in hosting environment
- [ ] CSP headers properly configured (if custom)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Remove any development-only log statements
- [ ] Image optimization configured for remote patterns

## Best Practices

1. **Server vs Client Components**
   - Keep API calls with tokens in Server Components
   - Use Client Components only for interactivity
   - Pass sanitized data from Server to Client Components

2. **Error Handling**
   - Don't expose sensitive error details to users
   - Log detailed errors server-side only
   - Show user-friendly error messages

3. **Environment Configuration**
   - Development: Use `.env.local` (already gitignored)
   - Production: Use hosting platform's environment variables
   - Never commit `.env` files

## Reporting Security Issues

If you discover a security vulnerability, please do NOT create a public issue.
Contact the repository owner directly.
