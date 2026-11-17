# Jobs portal implementation and rollout

## Architecture and changed files

The project remains Next.js 16 App Router, React 19, Tailwind 4, Supabase SSR Auth and Postgres. Existing job_posts, post_views, applied_reactions, presence, booking and admin charts are retained. Categories remain a Postgres enum; employers stay in job_posts.company rather than introducing a breaking normalization. Existing company/salary/eligibility/apply_url/deadline_at columns map to employer name, salary text, eligibility, official application URL and application deadline.

Modified: src/types/database.ts; src/lib/{categories,portal,job-fields,ads}.ts (the last three are new); src/lib/schemas/job-post.ts; src/lib/queries/{jobs,stats}.ts; src/app/layout.tsx; public homepage and jobs listing/detail pages; admin analytics, job actions and edit page; job form, results, cards, footer and category chart.
Created: /internships, /disclaimer, robots.ts, sitemap.ts; ad-slot, job-tracking and admin/campaign-analytics components; /api/admin/logo and /api/job-traffic handlers; migrations 0006 through 0010; tests/portal.mjs; this guide. Existing .env.local.example changes belong to the user and were left intact.

## Database (manual, approval required)

No migration or live data mutation was performed. Review and back up before applying migrations with your normal Supabase workflow. First apply 0006_portal_category.sql in a separately committed transaction; then 0007_portal_fields.sql, 0008_campaign_analytics.sql, 0009_campaign_rpc.sql, 0010_company_logos.sql in order. Test on staging first. Existing 0001�0005 must already be applied.

Check public.is_admin() in 0004: its configured email must match ADMIN_EMAIL. Do not broaden access to all authenticated users. Published-only public reads and admin-only job writes remain enforced by existing RLS. Traffic tables permit admin reads; only service_role can invoke the atomic aggregate function. Logo bucket permits raster uploads under 2 MB by admins only.

After migrations succeed, set PORTAL_SCHEMA_READY=true and restart/redeploy. Until then, list queries use the original columns and saving jobs excludes extended fields. Do not enter extended fields or publish apprenticeships before enabling the schema switch. Extended fields are optional; no unknown salary or deadline is fabricated. Expiration is derived from deadline without changing draft/published/archived editorial status. Application dates entered by admin close at 23:59:59 India time.

## Environment variables

Keep NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ADMIN_EMAIL, and NEXT_PUBLIC_SITE_URL. For production set NEXT_PUBLIC_SITE_URL=https://careerwithkumar.in. Keep SUPABASE_SERVICE_ROLE_KEY server-only; required for campaign aggregates, never prefix it NEXT_PUBLIC_. Existing booking/email/push settings remain unchanged.

New server flag: PORTAL_SCHEMA_READY=true only after migrations.
Optional advertising build variables (leave absent/disabled now):

```
NEXT_PUBLIC_ADS_ENABLED=false
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=
NEXT_PUBLIC_AD_SLOT_INTRO=
NEXT_PUBLIC_AD_SLOT_DETAILS=
```

## Publish the first job

Sign in at /admin/login with the configured admin account. Open New posting. Enter title, employer, category, location, an original description and official apply URL. Enter only verified salary, dates, eligibility and optional structured fields. Upload a raster company logo or enter its HTTPS URL. Structured import accepts a JSON object with form field names, for example:

```
{"title":"Graduate internship","company":"Employer","category":"internship","description":"Your original summary","qualification":"Official qualification","application_steps":"1. Open the official portal\n2. Read the notification"}
```

Paste JSON then leave the paste field to import. Review every field manually, check the verification box and use Preview before saving. Save Draft to finish later; choose Published to publish. Edit to unpublish/archive. Duplicate as draft is on the edit page. Existing dashboard search/filter and delete confirmation remain available. Extended fields cannot be saved until migrations are enabled.

## Campaign links and reporting

Share /jobs/YOUR-SLUG?utm_source=instagram&utm_medium=autodm&utm_campaign=cpcl2026 (use the actual published slug). WhatsApp example: ?utm_source=whatsapp&utm_medium=channel&utm_campaign=cpcl2026. Use short non-personal campaign identifiers with letters, numbers, underscores or hyphens. Never put emails or personal data in UTM values.

Optional analytics requires an explicit Allow choice on job pages. Preference can be changed there. Only day, listing ID, source, medium, campaign and event totals are stored; no visitor identities or IP addresses are persisted by this new feature. Pageviews are not unique visitors. Official-click counts differ from the existing user-reported Marked applied count. Analytics shows 30/90-day daily charts and filterable source/campaign rows, alongside existing charts. Existing legacy view/presence/session tracking is unchanged and has separate counts. The new choice governs the new campaign tracker only. Aggregate reporting uses UTC dates and latest 5,000 rows. Hosting/provider request logs have their own retention settings.

Before public rollout configure hosting-level rate limits for /api/job-traffic to reduce fabricated counts. Do not use these aggregate numbers as audited advertising or billing metrics. Validate opted-in and declined flows on staging. Raw referrer URLs are not stored. Consider scheduled aggregate retention cleanup (e.g. 13 months) under your own privacy policy.

## AdSense later

Ads are disabled by default. Disabled components return null: no ad script or empty ad space. After approval, supply your actual ca-pub publisher ID and actual numeric ad slots, enable ads, and rebuild. Two labeled, reserved-height placements are separate from the official Apply control. This code does not guarantee approval. Before enabling personalized advertising, configure the appropriate certified consent platform/geographic controls with your ad provider; campaign analytics consent is not advertising consent. Review the content, privacy disclosures and ad placements against current provider requirements before activation.

## SEO and deployment

Metadata is server-rendered. Job details include canonical, Open Graph, Twitter and breadcrumb JSON-LD. JobPosting data is emitted only for non-expired listings with known publication date, location and official application link; no salary or employer claims are invented. Expired pages remain accessible for reference, show a closed notice, remove the Apply control and omit JobPosting data. ISR may take up to five minutes to reflect deadline boundaries. Sitemap omits expired listings. Submit /sitemap.xml in Search Console after deployment and inspect representative jobs with Google's validation tools; rich results are not guaranteed.

Run npm ci, node tests/portal.mjs, npm run lint, npx tsc --noEmit, npm run build. For local dev use npm run dev; for a local production smoke test use npm run start. Node 22 is supported. On this machine Node was installed temporarily under the Windows temp directory; install a persistent Node LTS runtime for future shells if needed.

Deploy through your existing Next.js hosting workflow only after approval, after migrations and environment setup. No hosting configuration was replaced. Public NEXT_PUBLIC_* values are baked into the build. Keep a database backup and previous deployment; additive columns can remain during a code rollback. Remove PORTAL_SCHEMA_READY when rolling back to an unextended schema.

## Remaining manual verification

Live database migrations, storage/RLS/admin tests, campaign ingestion, upload, draft/publish/delete and mobile browser checks require a staging Supabase database and authenticated admin session. They were not exercised against live data. No production deployment was performed. Review policy text for your actual business practices and jurisdiction before launch. Existing dependency audit findings were not resolved as part of this feature change.

The current listing UI paginates 15 cards from the fetched result set; server-side pagination is a future scaling task for a large catalog. Job fields use safe plain text, not executable rich HTML. Salary remains a verified free-text field; numeric salary ranges are not inferred. Campaign table supplies medium/campaign detail with source and period filters; monthly totals can be derived from the daily data. A full historical monthly dashboard and separate employer-management interface are not included.
