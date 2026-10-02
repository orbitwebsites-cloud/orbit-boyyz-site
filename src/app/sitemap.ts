import type { MetadataRoute } from 'next'
import { blogPosts } from '@/content/blog'
import { NOINDEX_ROUTES, ORIGIN, isoDate, legacyPageMeta } from '@/lib/legacy-seo'

// Same URL set and order as the old site's prerender.mjs writeSitemap(), minus
// the pages redirected in next.config.ts and the noindex routes
// (/project-brief, /developers: still live, just not search landing pages).
// (/form was never in the sitemap and stays out.)

// Every non-post page changed in the 2026-10-02 SEO pass (organization schema
// address on every page; homepage, /growth and trade-page copy).
const PAGES_UPDATED = '2026-10-02'

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
  if (route === '/blog' || route.startsWith('/web-design-') || route.startsWith('/website-design-for-')) return 0.8
  if (route.startsWith('/blog/')) return 0.7
  return 0.6
}

function changeFrequency(route: string): 'weekly' | 'monthly' {
  return route === '/' || route === '/blog' ? 'weekly' : 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.keys(legacyPageMeta).filter((route) => !NOINDEX_ROUTES.has(route))
  const routes = [...pages, ...blogPosts.map((p) => `/blog/${p.slug}`)]
  return routes.map((route) => ({
    url: route === '/' ? ORIGIN : `${ORIGIN}${route}`,
    lastModified: lastMod(route),
    changeFrequency: changeFrequency(route),
    priority: priority(route),
  }))
}
