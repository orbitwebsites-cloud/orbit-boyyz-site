import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ORIGIN = 'https://orbitboyzz.me'
const { render, faqs } = await import('./dist-server/entry-server.js')

const distDir = join(__dirname, 'dist')
const indexPath = join(distDir, 'index.html')
const template = readFileSync(indexPath, 'utf-8')

const organization = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${ORIGIN}/#organization`,
  name: 'Orbit Websites',
  alternateName: ['OrbitBoyzz', 'Orbit Boyzz'],
  description: 'Orbit Websites builds custom business websites through a clear 50/50 payment process, with most focused builds ready for review within seven days.',
  url: `${ORIGIN}/`,
  logo: `${ORIGIN}/orbit-logo.png`,
  email: 'orbitboyzz@gmail.com',
  telephone: '+1-609-662-8052',
  priceRange: '$$-$$$',
  areaServed: [
    { '@type': 'City', name: 'Plainsboro', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
    { '@type': 'AdministrativeArea', name: 'Central New Jersey' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Website care plans',
    itemListElement: [
      { '@type': 'Offer', name: 'Site Care', price: '300', priceCurrency: 'USD', description: 'Managed hosting, security, backups, and routine content updates.' },
      { '@type': 'Offer', name: 'Local Growth', price: '500', priceCurrency: 'USD', description: 'Managed website care, local SEO maintenance, and monthly improvements.' },
      { '@type': 'Offer', name: 'Growth Partner', price: '700', priceCurrency: 'USD', description: 'Ongoing SEO, content support, priority updates, and managed hosting.' },
    ],
  },
  potentialAction: {
    '@type': 'ReserveAction',
    name: 'Book a free project call',
    target: 'https://calendly.com/orbitwebsites/30min',
  },
}

const website = {
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  name: 'Orbit Websites',
  alternateName: 'OrbitBoyzz',
  url: `${ORIGIN}/`,
  publisher: { '@id': `${ORIGIN}/#organization` },
}

const faqPage = {
  '@type': 'FAQPage',
  '@id': `${ORIGIN}/#faq`,
  mainEntity: faqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

const title = 'Custom Business Websites Ready in 7 Days | Orbit Websites'
const description = 'Meet directly with Orbit Websites, choose a design direction, pay 50% to begin, and receive a custom business website ready for review in seven days.'
const graph = JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, website, faqPage] })

const head = [
  `<title>${title}</title>`,
  `<meta name="description" content="${description}" />`,
  `<link rel="canonical" href="${ORIGIN}/" />`,
  '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />',
  '<meta property="og:type" content="website" />',
  '<meta property="og:site_name" content="Orbit Websites" />',
  `<meta property="og:title" content="${title}" />`,
  `<meta property="og:description" content="${description}" />`,
  `<meta property="og:url" content="${ORIGIN}/" />`,
  `<meta property="og:image" content="${ORIGIN}/orbit-logo.png" />`,
  '<meta name="twitter:card" content="summary_large_image" />',
  `<meta name="twitter:title" content="${title}" />`,
  `<meta name="twitter:description" content="${description}" />`,
  `<meta name="twitter:image" content="${ORIGIN}/orbit-logo.png" />`,
  `<script type="application/ld+json">${graph}</script>`,
].join('\n    ')

const seoPattern = /<!--SEO-->[\s\S]*?<!--\/SEO-->/
const appHtml = render('/')
let html = template.replace(seoPattern, `<!--SEO-->\n    ${head}\n    <!--/SEO-->`)
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
writeFileSync(indexPath, html, 'utf-8')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf-8')

console.log('Prerendered the Orbit Websites homepage to dist/.')
