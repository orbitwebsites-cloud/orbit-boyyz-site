import type { Metadata } from 'next'
import { ORIGIN, legacyPageMeta } from './legacy-seo'
import { jsonLd } from './seo'

const OG_IMAGE = `${ORIGIN}/orbit-logo.png`

export function canonicalFor(route: string) {
  return route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`
}

/**
 * <head> for a ported route, mirroring the old prerender's buildHead(): the
 * exact old <title> (no " · Orbit Websites" template suffix), description,
 * absolute canonical, RSS alternate, robots and OG/Twitter tags.
 */
export function legacyMetadata(
  route: string,
  meta: { title: string; description: string } = legacyPageMeta[route],
  { article = false }: { article?: boolean } = {},
): Metadata {
  if (!meta) throw new Error(`No legacy metadata for ${route}`)
  const url = canonicalFor(route)
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: url,
      types: { 'application/rss+xml': [{ url: `${ORIGIN}/feed.xml`, title: 'Orbit Websites Blog' }] },
    },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type: article ? 'article' : 'website',
      siteName: 'OrbitBoyzz / Orbit Websites',
      title: meta.title,
      description: meta.description,
      url,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [OG_IMAGE] },
  }
}

/** Inline JSON-LD <script> (server-rendered). */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
}
