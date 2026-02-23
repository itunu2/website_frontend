# Deployment Checklist

This guide helps you prepare the frontend for deployment as a standalone repository.

## Pre-Deployment Security Checklist

- [x] Console logs wrapped with development checks
- [x] No secrets in `NEXT_PUBLIC_*` variables
- [x] Environment validation using Zod
- [x] Server vs client component separation
- [x] API tokens only in server components

## Environment Variables Setup

### Public Variables (Safe to expose)

```env
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_STRAPI_BASE_URL=https://your-backend.onrender.com
NEXT_PUBLIC_REQUEST_ID_HEADER=X-Request-ID
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=6
NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS=60
```

### Private Variables (Server-only)

```env
STRAPI_BLOG_API_TOKEN=<your-api-token-from-backend>
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
NEWSLETTER_ADMIN_TOKEN=<random-long-secret>
NEWSLETTER_WEBHOOK_SECRET=<random-long-secret>
NEWSLETTER_RATE_LIMIT_PER_HOUR=3
```

## Newsletter Setup (Supabase + Substack)

### 1) Create Supabase table and policies

Run the SQL in:

`scripts/newsletter_supabase.sql`

Automatic option (recommended):

```bash
npm run newsletter:apply-sql
```

This command copies `scripts/newsletter_supabase.sql` into a migration file and applies it to your remote Supabase database.

CI automation option (best for teams):

- A workflow exists at `.github/workflows/supabase-migrations.yml`
- It automatically runs on pushes to `main` when files in `supabase/migrations/**` change
- It can also be run manually via GitHub Actions (`workflow_dispatch`)

Required once in GitHub repository settings:

- Add secret `DATABASE_URL`

How to run it:

1. Set `DATABASE_URL` in your environment
2. Run `npm run newsletter:apply-sql`
3. Confirm `newsletter_subscribers` table exists

Manual fallback:

1. Open Supabase Dashboard → SQL Editor
2. Paste the contents of `scripts/newsletter_supabase.sql`
3. Execute and confirm `newsletter_subscribers` table exists

### 2) Get required Supabase credentials

1. Open Supabase Dashboard → Project Settings → API
2. Copy **Project URL** → use as `SUPABASE_URL`
3. Copy **service_role** key → use as `SUPABASE_SERVICE_ROLE_KEY`
4. Open Supabase Dashboard → Connect → Connection string (URI) → use as `DATABASE_URL`

Important:
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in `NEXT_PUBLIC_*` vars.

### 3) Configure Substack sync endpoint

Substack has no stable public API for server-side subscriber writes. The reliable path is:

1. Export pending subscribers as CSV from a protected admin route
2. Import that CSV in Substack Publisher UI
3. Mark that export batch as synced

### 4) Admin routes for CSV sync

Use a Bearer token equal to `NEWSLETTER_ADMIN_TOKEN`.

- `GET /api/admin/export-pending`
   - Exports all rows where `substack_synced=false` and `sync_batch_id is null`
   - Assigns a `sync_batch_id`
   - Returns a CSV attachment with header `X-Substack-Sync-Batch-Id`

- `POST /api/admin/mark-synced`
   - Body: `{ "batchId": "<uuid>" }`
   - Marks all rows in that batch as `substack_synced=true`

Optional webhook endpoint for future delayed-job batching:

- `POST /api/webhooks/subscriber-added`
   - Header: `x-newsletter-webhook-secret: <NEWSLETTER_WEBHOOK_SECRET>`
   - Can be used as Supabase DB webhook target

### 5) Deploy with env vars

On your hosting platform (Vercel/Netlify/etc), add all private vars above.
Then redeploy and test:

1. Open homepage and submit any newsletter form
2. Verify row appears in Supabase `newsletter_subscribers`
3. Verify `substack_synced=false` until CSV import is completed

### 6) Production checks

- Confirm popup appears after engagement trigger (scroll/time/exit intent)
- Confirm popup dismissal suppresses for 30 days
- Confirm blog/footer/home forms all submit successfully

### Migration cadence

- Run migrations when schema changes (not every deployment).
- If there are no new migration files, deploys can skip DB migration safely.

## Hosting Platforms

### Vercel (Recommended)

1. **Connect Repository**
   - Import from GitHub
   - Select the frontend folder as root directory
   - Vercel auto-detects Next.js

2. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables above
   - Mark `STRAPI_BLOG_API_TOKEN` as secret

3. **Configure Build**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Deploy**
   - Vercel auto-deploys on git push
   - Check deployment logs for errors

### Netlify

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   - Add in Site settings → Build & deploy → Environment
   - Same variables as above

3. **netlify.toml** (optional)
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
   ```

### Custom/Self-Hosted

1. **Build**
   ```bash
   npm run build
   ```

2. **Start**
   ```bash
   npm start
   # Or with PM2
   pm2 start npm --name "frontend" -- start
   ```

3. **nginx Configuration**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Post-Deployment Steps

1. **Verify Deployment**
   - Visit your site URL
   - Check all pages load correctly
   - Test navigation and links

2. **Test API Integration**
   - Verify blog posts appear
   - Check images load correctly
   - Test writing portfolio page

3. **SEO & Analytics**
   - Verify meta tags render correctly
   - Test social media previews
   - Configure analytics (if needed)

4. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify image optimization works

## Image Optimization

Next.js will optimize images from your Strapi backend automatically:

```tsx
<Image
  src={strapiImageUrl}
  alt="Description"
  width={800}
  height={600}
/>
```

The `remotePatterns` in `next.config.ts` is already configured for your Strapi domain.

## Caching Strategy

- Static pages: Generated at build time
- Blog posts: Revalidated every 60 seconds (configurable)
- Images: Cached by Next.js Image Optimization

## Troubleshooting

**Images Not Loading**
- Verify `NEXT_PUBLIC_STRAPI_BASE_URL` is correct
- Check Strapi CORS allows your domain
- Verify image URLs in API response

**API Errors**
- Check `STRAPI_BLOG_API_TOKEN` is set correctly
- Verify token has read permissions
- Check backend is accessible from hosting

**Build Fails**
- Check all environment variables are set
- Verify Node.js version (20.x recommended)
- Check for TypeScript errors

**Slow Performance**
- Enable Static Generation where possible
- Optimize images (already configured)
- Use `next/image` for all images
- Check Vercel/Netlify analytics

## Security Best Practices

- Never commit `.env.local` files
- Rotate API tokens regularly
- Keep dependencies updated
- Monitor for security vulnerabilities
- Use HTTPS in production
- Configure CSP headers (if needed)

## Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor Core Web Vitals
- Track user analytics
- Set up uptime monitoring

## See Also

- [SECURITY.md](./SECURITY.md) - Complete security guidelines
- [README.md](./README.md) - Development setup
- [Design System](./docs/design-system.md) - Component library
