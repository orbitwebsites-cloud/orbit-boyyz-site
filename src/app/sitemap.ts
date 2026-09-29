import type { MetadataRoute } from 'next'
import { blogPosts } from '@/content/blog'
import { ORIGIN, isoDate, legacyPageMeta } from '@/lib/legacy-seo'

// Same URL set, order, lastmod, changefreq and priority as the old site's
// prerender.mjs writeSitemap() — i.e. the 77 URLs Google already knows.
// (/form was never in the sitemap and stays out.)

function lastMod(route: string) {
  if (route.startsWith('/blog/')) {
    const post = blogPosts.find((item) => item.slug === route.replace('/blog/', ''))
    return post ? isoDate(post.updated) : '2026-06-13'
  }
  if (route === '/pricing' || route === '/quote' || route === '/blog' || route.startsWith('/web-design-') || route.startsWith('/website-design-for-')) {
    return '2026-06-13'
  }
  return '2026-06-01'
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
  const routes = [...Object.keys(legacyPageMeta), ...blogPosts.map((p) => `/blog/${p.slug}`)]
  return routes.map((route) => ({
    url: route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`,
    lastModified: lastMod(route),
    changeFrequency: changeFrequency(route),
    priority: priority(route),
  }))
}
