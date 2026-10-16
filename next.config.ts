import type { NextConfig } from "next";

const CANONICAL = "https://orbitboyzz.com";

// Old .me hosts serve the same deployment — send every request on them to the
// canonical .com URL so Google never sees a second indexable copy.
// Config redirects run before proxy.ts, so this also covers /robots.txt,
// /sitemap.xml and /api/* (which the proxy matcher skips).
const ME_HOST = "(?:www\\.)?orbitboyzz\\.me";
const GROWTH_ME_HOST = "growth\\.orbitboyzz\\.me";
// leads.orbitboyzz.com gets its own /llms.txt (public/llms-leads.txt).
const LEADS_HOST = "leads\\.orbitboyzz\\.com";

// Pages removed in the 2026-09-30 SEO cleanup → closest live page.
//  - Medical / restaurant / catering pages are outside the home-service offer.
//  - Duplicate blog posts collapse into the one post that answers the question.
const MOVED: Array<[from: string, to: string]> = [
  ["/website-design-for-dental-practices-nj", "/services"],
  ["/website-design-for-clinics-nj", "/services"],
  ["/website-design-for-restaurants-nj", "/services"],
  ["/blog/dental-practice-website-princeton-nj", "/blog"],
  ["/blog/automated-dental-website-no-monthly-fee", "/blog"],
  ["/blog/ai-intake-systems-dental-practice-nj", "/blog"],
  ["/blog/clinic-website-design-central-nj", "/blog"],
  ["/blog/med-spa-website-design-new-jersey", "/blog"],
  ["/blog/restaurant-website-central-nj-checklist", "/blog"],
  ["/blog/catering-proposal-automation", "/blog"],
  ["/blog/ai-catering-proposals-corporate-clients", "/blog"],
  ["/blog/ai-receptionist-price-for-small-business", "/blog/ai-receptionist-cost-small-business"],
  ["/blog/custom-website-cost-local-business-nj", "/blog/custom-website-cost-central-nj"],
  ["/blog/custom-website-price-local-business-nj", "/blog/custom-website-cost-central-nj"],
  ["/blog/custom-website-cost-estimate-nj", "/blog/custom-website-cost-central-nj"],
  ["/blog/plumbing-company-website-necessity", "/blog/should-plumbing-company-have-website"],
  ["/blog/plumbing-company-website-essential", "/blog/should-plumbing-company-have-website"],
  ["/blog/plumbing-company-website-need", "/blog/should-plumbing-company-have-website"],
  ["/blog/handcoded-vs-template-local-seo", "/blog/handcoded-websites-local-seo"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: GROWTH_ME_HOST }],
        destination: `${CANONICAL}/growth`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: GROWTH_ME_HOST }],
        destination: `${CANONICAL}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: ME_HOST }],
        destination: `${CANONICAL}/:path*`,
        permanent: true,
      },
      ...MOVED.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
  async rewrites() {
    return {
      // Must be beforeFiles: the plain array form runs after public/ files, so
      // public/llms.txt would win on the leads host. proxy.ts's matcher already
      // skips *.txt, so nothing else rewrites or redirects this path.
      beforeFiles: [
        { source: "/llms.txt", has: [{ type: "host", value: LEADS_HOST }], destination: "/llms-leads.txt" },
      ],
      // PostHog goes through our own domain so ad blockers don't drop events.
      // proxy.ts skips /ingest/ (matcher) so leads.orbitboyzz.com keeps it too.
      afterFiles: [
        { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
        { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
      ],
      fallback: [],
    };
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
