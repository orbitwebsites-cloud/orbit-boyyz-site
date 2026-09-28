import type { Metadata } from 'next'
import { faqs, services, site, tiers } from '@/content/site'

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · ${site.name}`, description, url: path, type: 'website', siteName: site.name },
    twitter: { card: 'summary_large_image', title: `${title} · ${site.name}`, description },
  }
}

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${site.url}/#business`,
    name: site.name,
    alternateName: site.handle,
    url: site.url,
    logo: `${site.url}/orbit-logo.png`,
    image: `${site.url}/orbit-logo.png`,
    slogan: site.tagline,
    description:
      'Website design and AI operations studio in Plainsboro, NJ building hand-coded, conversion-first websites and AI intake & booking systems for Central New Jersey businesses.',
    telephone: '+1-609-662-8052',
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Plainsboro',
      addressRegion: 'NJ',
      addressCountry: 'US',
    },
    areaServed: site.towns.map((town) => ({ '@type': 'City', name: `${town}, NJ` })),
    knowsAbout: services.map((s) => s.title),
    makesOffer: tiers.map((t) => ({
      '@type': 'Offer',
      name: t.name,
      description: t.copy,
      ...(t.id === 'premium'
        ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: 3500, priceCurrency: 'USD' } }
        : t.id === 'ai'
          ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: 5000, maxPrice: 15000, priceCurrency: 'USD' } }
          : {}),
    })),
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'Book a free call',
      target: site.booking,
    },
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    alternateName: site.handle,
    publisher: { '@id': `${site.url}/#business` },
  }
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
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
        provider: { '@id': `${site.url}/#business` },
        areaServed: site.serviceArea,
        url: `${site.url}/services#${s.slug}`,
      },
    })),
  }
}
