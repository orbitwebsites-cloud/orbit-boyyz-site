import type { MetadataRoute } from 'next'
import { blogPosts } from '@/content/blog'
import { KEYWORD_PATHS } from '@/content/keyword-pages'
import { NOINDEX_ROUTES, ORIGIN, isoDate, legacyPageMeta } from '@/lib/legacy-seo'
import { LEADS_URL } from '@/lib/leadsSite'

// Same URL set and order as the old site's prerender.mjs writeSitemap(), minus
// the pages redirected in next.config.ts and the noindex routes
// (/project-brief, /developers: still live, just not search landing pages).
// Keyword landing pages (src/content/keyword-pages) come in through
// legacyPageMeta; one still marked `draft: true` is noindex and stays out.
// (/form was never in the sitemap and stays out.)
// /qualify and /book, the noindex,nofollow booking steps, must never be listed:
// IndexNow (scripts/submit-indexnow.mjs) submits exactly what this file lists.
//
// LEADS_URL (https://leads.orbitboyzz.com/) is the one deliberate cross-host
// entry: leads.orbitboyzz.com/robots.txt declares this sitemap
// (https://orbitboyzz.com/sitemap.xml), which makes the entry valid, and the
// sc-domain:orbitboyzz.com Search Console property covers both hosts.
const NEVER_LISTED: ReadonlySet<string> = new Set(['/qualify', '/book'])

// Every non-post page changed in the 2026-10-16 SEO pass (titles, town copy
// and the organization schema on every page).
const PAGES_UPDATED = '2026-10-16'

// Last change to the leads.orbitboyzz.com page (copy, schema, FAQ).
const LEADS_UPDATED = '2026-10-16'

function lastMod(route: string) {
  if (route.startsWith('/blog/')) {
    const post = blogPosts.find((item) => item.slug === route.replace('/blog/', ''))
    return post ? isoDate(post.updated) : PAGES_UPDATED
  }
  return PAGES_UPDATED
}

function priority(route: string) {
  if (route === '/') return 1.0
  if (route === '/pricing' || route === '/quote' || route === '/contact') return 0.9
  if (route === '/blog' || KEYWORD_PATHS.has(route) || route.startsWith('/web-design-') || route.startsWith('/website-design-for-')) return 0.8
  if (route.startsWith('/blog/')) return 0.7
  return 0.6
}

function changeFrequency(route: string): 'weekly' | 'monthly' {
  return route === '/' || route === '/blog' ? 'weekly' : 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.keys(legacyPageMeta).filter((route) => !NOINDEX_ROUTES.has(route))
  const routes = [...pages, ...blogPosts.map((p) => `/blog/${p.slug}`)].filter((route) => !NEVER_LISTED.has(route))
  return [
    ...routes.map((route) => ({
      url: route === '/' ? ORIGIN : `${ORIGIN}${route}`,
      lastModified: lastMod(route),
      changeFrequency: changeFrequency(route),
      priority: priority(route),
    })),
    { url: LEADS_URL, lastModified: LEADS_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
