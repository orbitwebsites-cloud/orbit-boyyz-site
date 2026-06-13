# Orbit Websites - Search Growth Next Steps

Last updated: June 13, 2026

Priority goal: grow qualified search clicks toward 1K+ per month while converting that traffic into 1-4 client conversations per month.

Business type: service-area web design and AI operations studio serving Central New Jersey.

## Current On-Site State

The site now has:

- Prerendered static HTML for 53 routes.
- Generated `dist/sitemap.xml` and `dist/feed.xml`.
- `robots.txt`, `llms.txt`, and `pricing.md`.
- Local town pages for Central NJ, Plainsboro, West Windsor, Princeton, Ewing, Hamilton, Lawrence, Trenton, Robbinsville, Bordentown, and East Windsor.
- Industry pages for HVAC, plumbers, electricians, landscaping companies, dental practices, restaurants/caterers, and clinics/med spas.
- Blog clusters for local SEO, AI intake, pricing, and industries, including clinic, med spa, and Plainsboro cost articles.
- Breadcrumb, LocalBusiness, Service, FAQ, BlogPosting, and Blog schema.
- Conversion tracking hooks for calls, quote clicks, pricing clicks, email clicks, and Calendly clicks.
- A mobile sticky call/quote bar.
- IndexNow helper script: `npm run submit:indexnow`.

## 1. Submit The Current Site To Google Search Console

1. Go to https://search.google.com/search-console and select `orbitboyzz.me`.
2. Open **Sitemaps** and submit `sitemap.xml`.
3. Use **URL Inspection** and request indexing for:
   - https://orbitboyzz.me/
   - https://orbitboyzz.me/services
   - https://orbitboyzz.me/pricing
   - https://orbitboyzz.me/quote
   - https://orbitboyzz.me/web-design-central-nj
   - https://orbitboyzz.me/website-design-for-hvac-companies-nj
   - https://orbitboyzz.me/website-design-for-plumbers-nj
   - https://orbitboyzz.me/website-design-for-restaurants-nj
   - https://orbitboyzz.me/website-design-for-clinics-nj
   - https://orbitboyzz.me/blog/local-business-website-checklist-2026
   - https://orbitboyzz.me/blog/home-service-website-structure
   - https://orbitboyzz.me/blog/clinic-website-design-central-nj
   - https://orbitboyzz.me/blog/med-spa-website-design-new-jersey
   - https://orbitboyzz.me/blog/small-business-website-cost-plainsboro-nj
4. Check the **Pages** and **Performance** reports weekly.

## 2. Submit New URLs Through IndexNow After Deploys

After a production deploy:

```bash
npm run build
npm run submit:indexnow
npm run submit:indexnow -- --live
```

The first command verifies the generated files. The second command is a dry run. The `--live` command submits the current `dist/sitemap.xml` URLs to the IndexNow endpoint.

## 3. Set Up Google Business Profile

1. Go to https://business.google.com.
2. Business name: `Orbit Websites`.
3. Category: `Website designer`.
4. Hide the street address and configure service areas.
5. Use the same phone and website everywhere:
   - Phone: 609-662-8052
   - Website: https://orbitboyzz.me/
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
