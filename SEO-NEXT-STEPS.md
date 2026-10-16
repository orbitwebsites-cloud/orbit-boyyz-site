# Orbit Websites - Search Growth Next Steps

Last updated: October 16, 2026

Priority goal: grow qualified search clicks toward 1K+ per month while converting that traffic into 1-4 client conversations per month.

Business type: service-area web design and AI operations studio serving Central New Jersey.

## Current On-Site State

The site now has:

- A Next.js App Router site (this repo), deployed on Vercel.
- `sitemap.xml` and `feed.xml` are Next.js routes (`src/app/sitemap.ts`, `src/app/feed.xml/route.ts`), generated from the page list and blog posts. The sitemap also lists https://leads.orbitboyzz.com/ as its one cross-host entry.
- `robots.txt`, `llms.txt`, and `pricing.md`.
- Local town pages for Central NJ, Plainsboro, West Windsor, Princeton, Ewing, Hamilton, Lawrence, Trenton, Robbinsville, Bordentown, and East Windsor.
- Industry pages for HVAC, plumbers, electricians, and landscaping companies (the dental, restaurant and clinic pages now redirect, see `next.config.ts`).
- Blog clusters for local SEO, AI intake, pricing, and industries, including Plainsboro cost, Mercer County cost factors, and electrician AI chatbot articles.
- Breadcrumb, LocalBusiness, Service, FAQ, BlogPosting, and Blog schema.
- Conversion tracking hooks for calls, quote clicks, pricing clicks, email clicks, and Calendly clicks.
- A mobile sticky call/quote bar.
- IndexNow helper script: `npm run submit:indexnow`.

## 1. Submit The Current Site To Google Search Console

1. Go to https://search.google.com/search-console and select the domain property `sc-domain:orbitboyzz.com` (it covers orbitboyzz.com and leads.orbitboyzz.com).
2. Open **Sitemaps** and submit `sitemap.xml`.
3. Use **URL Inspection** and request indexing for:
   - https://orbitboyzz.com/
   - https://orbitboyzz.com/services
   - https://orbitboyzz.com/pricing
   - https://orbitboyzz.com/quote
   - https://orbitboyzz.com/web-design-central-nj
   - https://orbitboyzz.com/website-design-for-hvac-companies-nj
   - https://orbitboyzz.com/website-design-for-plumbers-nj
   - https://orbitboyzz.com/blog/local-business-website-checklist-2026
   - https://orbitboyzz.com/blog/home-service-website-structure
   - https://orbitboyzz.com/blog/small-business-website-cost-plainsboro-nj
   - https://orbitboyzz.com/blog/web-design-cost-factors-mercer-county-nj
   - https://orbitboyzz.com/blog/ai-chatbot-electrician-central-nj
   - https://leads.orbitboyzz.com/ (lead data for outbound agencies; not yet known to Google)
4. Check the **Pages** and **Performance** reports weekly.

## 2. Submit New URLs Through IndexNow After Deploys

After a production deploy reaches orbitboyzz.com: `npm run submit:indexnow` (dry run, reads the live sitemap, lists URLs per host), then `npm run submit:indexnow -- --live`; expect HTTP 200 or 202 per host (orbitboyzz.com and leads.orbitboyzz.com). Add --since=YYYY-MM-DD to send only URLs whose sitemap lastmod is on or after that date.

```bash
npm run submit:indexnow
npm run submit:indexnow -- --live
npm run submit:indexnow -- --live --since=2026-10-16
```

## 3. Set Up Google Business Profile

1. Go to https://business.google.com.
2. Business name: `Orbit Websites`.
3. Category: `Website designer`.
4. Hide the street address and configure service areas.
5. Use the same phone and website everywhere:
   - Phone: 609-662-8052
   - Website: https://orbitboyzz.com/
6. Add logo, hours, services, and one launch/update post.

## 4. Build Entity Profiles

Create the profiles below with the exact same name, phone, and website:

- LinkedIn company page.
- Instagram business profile.
- Facebook business page.
- Optional: YouTube, X/Twitter, Clutch, Bark, or local chamber profile.

Once URLs exist, add them to the `sameAs` array in schema.

## 5. Monthly Content Targets

Use Search Console impressions to decide future pages. Good next targets:

- More town-specific restaurant website design pages after the restaurant/catering industry page gets impressions.
- Caterer proposal automation comparisons and cost pages.
- Real estate website design in Princeton / Central NJ.
- More town-specific clinic and med spa pages after the clinic page gets impressions.
- Small business website cost articles for Princeton, West Windsor, and Hamilton after the Plainsboro cost page gets impressions.
- Follow-up service pages for electrician AI intake and dental patient intake if the new blog posts get impressions.

Each new page should have:

- Direct answer intro.
- Pricing or budget context.
- Service-area relevance.
- Proof or process section.
- FAQ/schema-ready answers.
- Quote CTA.
- Internal links to `/pricing`, `/quote`, one town page, and one related blog post.

## 6. Conversion Review

Review these monthly:

- Search Console clicks and queries.
- Calls from mobile sticky CTA.
- Quote page clicks.
- Quote email clicks.
- Pricing page clicks.
- Calendly clicks.

If a page gets impressions but no clicks, improve title/meta. If it gets clicks but no leads, improve above-the-fold offer and CTA.
