import type { Metadata } from 'next'
import { services, site } from '@/content/site'
import { graphFor, organization, website } from '@/lib/legacy-seo'

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { title: `${title} · ${site.name}`, description, url: path, type: 'website', siteName: site.name },
    twitter: { card: 'summary_large_image', title: `${title} · ${site.name}`, description },
  }
}

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}

// One business entity everywhere: the `#organization` node from legacy-seo is
// the same @id the town, industry and blog graphs reference.
const ORG_ID = `${site.url}/#organization`

export function localBusinessSchema() {
  return { '@context': 'https://schema.org', ...organization }
}

export function websiteSchema() {
  return { '@context': 'https://schema.org', ...website }
}

/** Organization + WebSite + breadcrumb (+ ContactPage etc.) for a top-level route. */
export function pageSchema(route: string) {
  return { '@context': 'https://schema.org', '@graph': graphFor(route) }
}

/** FAQPage for the questions a page actually shows. */
export function faqSchema(items: ReadonlyArray<{ readonly q: string; readonly a: string }>, path = '/faq') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${site.url}${path === '/' ? '' : path}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function servicesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.copy,
        provider: { '@id': ORG_ID },
        areaServed: site.serviceArea,
        url: `${site.url}/services#${s.slug}`,
      },
    })),
  }
}
