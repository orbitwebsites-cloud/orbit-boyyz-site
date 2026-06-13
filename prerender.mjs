// Static prerender: renders each React route to HTML at build time and writes
// dist/<route>/index.html with full body content + per-route SEO/JSON-LD.
// This is what makes the site readable by AI crawlers (GPTBot, OAI-SearchBot,
// PerplexityBot, ClaudeBot, CCBot) that do NOT execute JavaScript.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ORIGIN = 'https://orbitboyzz.me'
const OG_IMAGE = `${ORIGIN}/orbit-logo.png`

// --- Brand entity signals (fill these in as off-site profiles go live) -------
// sameAs is the strongest brand-corroboration signal LLMs use. ONLY add a URL
// here AFTER the profile is live and public — a sameAs that 404s hurts more than
// an empty list. Uncomment each line the moment the corresponding profile exists.
const SAME_AS = [
  // 'https://www.linkedin.com/company/orbitboyzz',
  // 'https://www.instagram.com/orbitboyzz',
  // 'https://www.facebook.com/orbitboyzz',
  // 'https://www.crunchbase.com/organization/orbit-websites',
  // 'https://clutch.co/profile/orbit-websites',
  // 'https://www.wikidata.org/wiki/QXXXXXXX',
  // 'https://g.page/r/XXXXXXXXXXXX',   // Google Business Profile short link
]
// Founding date in ISO form, e.g. '2025'. Leave '' to omit until confirmed.
const FOUNDED = '2026'
// Operating hours (24h). Weekdays 4–8pm, weekends 12–8pm.
const OPENING_HOURS = [
  { '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '16:00', closes: '20:00' },
  { '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday', 'Sunday'],
    opens: '12:00', closes: '20:00' },
]
// areaServed as structured City objects — clearer entity signal than bare strings.
const SERVICE_AREA = [
  { '@type': 'City', name: 'Plainsboro', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'Princeton', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'West Windsor Township', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'Ewing', address: { '@type': 'PostalAddress', postalCode: '08628', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'Hamilton', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'Lawrence Township', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'Hopewell', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'Trenton', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'Robbinsville', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'City', name: 'East Windsor', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
  { '@type': 'AdministrativeArea', name: 'Central New Jersey' },
  { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
]

const { render, blogPosts, faqs } = await import('./dist-server/entry-server.js')

const distDir = join(__dirname, 'dist')
const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

// --- Per-route metadata -----------------------------------------------------
const pageMeta = {
  '/': {
    title: 'OrbitBoyzz | Orbit Websites - Web Design & AI Systems in Central NJ',
    description:
      'OrbitBoyzz, also known as Orbit Websites, is a Plainsboro, NJ web design and AI operations studio for local business websites, booking, intake, and revenue systems.',
  },
  '/orbitboyzz': {
    title: 'OrbitBoyzz | Official Orbit Websites Brand Page',
    description:
      'OrbitBoyzz is the official domain and brand handle for Orbit Websites, a Plainsboro, NJ web design and AI operations studio.',
  },
  '/about': {
    title: 'About Orbit Websites | Plainsboro, NJ Web & AI Studio',
    description:
      'Orbit Websites is a Plainsboro, NJ studio building conversion-focused websites and AI operations systems for Central New Jersey local businesses.',
  },
  '/services': {
    title: 'Web Design, Local SEO & AI Automation | Orbit Websites',
    description:
      'Web design, website refreshes, local SEO foundations, booking and lead forms, AI automation and intake systems, and pricing/operations pipelines.',
  },
  '/pricing': {
    title: 'AI Website & Custom Website Cost for Local Business',
    description:
      'Discover how much a custom or AI-powered website costs for a local business in Central NJ. Learn pricing factors, ROI, and get a free quote from Orbit Boyzz.',
  },
  '/web-design-central-nj': {
    title: 'Web Design Agency in Central New Jersey | Orbit Websites',
    description:
      'Web design agency and AI automation for local businesses in Plainsboro, Princeton, West Windsor, Ewing, Hamilton, Lawrence, Trenton, and across Central NJ.',
  },
  '/web-design-ewing-nj': {
    title: 'Web Design in Ewing, NJ | Orbit Websites',
    description:
      'Custom website design and AI automation for Ewing, NJ businesses. Hand-coded, fast-loading sites starting at $10,000. Serving Ewing Township and Mercer County.',
  },
  '/quote': {
    title: 'Get a Quote | Orbit Websites',
    description:
      'Answer a few questions and get a rough Orbit build range for a new website, refresh, lead forms, or an AI operations engine.',
  },
  '/contact': {
    title: 'Contact Orbit Websites | Book a Call (Plainsboro, NJ)',
    description:
      'Book a free 30-minute call with Orbit Websites, or reach us by phone or email. Serving Plainsboro, Princeton, West Windsor Township, and Central New Jersey.',
  },
  '/projects': {
    title: 'Projects | Orbit Websites',
    description:
      'Selected website and AI operations builds by Orbit Websites for local businesses in Central New Jersey.',
  },
  '/blog': {
    title: 'Blog | AI Operations Websites for Local Business',
    description:
      'Guides on AI operations websites, HVAC and plumbing AI dispatch, and catering proposal automation for local service businesses.',
  },
  '/faq': {
    title: 'FAQ | Orbit Websites',
    description:
      'Common buyer questions about Orbit Websites — location, business types, forms, SEO, and the premium AI operations offer.',
  },
}

// --- JSON-LD builders -------------------------------------------------------
const organization = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${ORIGIN}/#organization`,
  name: 'OrbitBoyzz',
  alternateName: ['Orbit Websites', 'Orbit Boyzz', 'ORBIT Websites', 'OrbitBoyzz Websites'],
  description:
    'OrbitBoyzz, also known as Orbit Websites, is a Plainsboro, New Jersey web design and AI operations studio building premium websites and automated intake, pricing, booking, and lead-routing systems for Central New Jersey local businesses.',
  url: `${ORIGIN}/`,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  telephone: '+1-609-662-8052',
  email: 'orbitboyzz@gmail.com',
  priceRange: '$$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '641 Plainsboro Rd',
    addressLocality: 'Plainsboro',
    addressRegion: 'NJ',
    postalCode: '08536',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '40.3329',
    longitude: '-74.5840',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-609-662-8052',
    email: 'orbitboyzz@gmail.com',
    contactType: 'customer support',
    areaServed: 'US',
    availableLanguage: 'English',
  },
  areaServed: SERVICE_AREA,
  knowsAbout: [
    'Website design',
    'AI operations websites',
    'AI intake systems',
    'Local SEO foundations',
    'Lead forms',
    'Booking forms',
    'Catering proposal automation',
    'HVAC dispatch automation',
  ],
  // Conditionally included so we never emit empty/placeholder entity signals.
  ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  ...(FOUNDED ? { foundingDate: FOUNDED } : {}),
  ...(OPENING_HOURS.length ? { openingHoursSpecification: OPENING_HOURS } : {}),
}

const website = {
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  name: 'OrbitBoyzz',
  alternateName: 'Orbit Websites',
  url: `${ORIGIN}/`,
  publisher: { '@id': `${ORIGIN}/#organization` },
}

const faqPage = {
  '@type': 'FAQPage',
  '@id': `${ORIGIN}/#faq`,
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const pricingFaqPage = {
  '@type': 'FAQPage',
  '@id': `${ORIGIN}/pricing#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a custom website cost for a local business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A custom website for a local business typically ranges from $3,500 to $15,000, based on design, features, and AI automation. Orbit Boyzz starts around $3,500 for a focused hand-coded site and around $5,000 when AI intake is included.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect custom website cost for a local business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Design complexity, page count, integrations, AI automation, and hosting or maintenance fees each add to the base price of a custom build.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect the cost of an AI website for a small business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cost varies by feature set such as lead automation, CRM integration, design complexity, hosting platform, and ongoing AI model maintenance. Starter AI intake builds begin around $5,000, while fully custom operations systems can exceed $15,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can a small business afford an AI website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With phased builds starting in the low thousands, many small businesses can start with a focused site and add AI intake once lead volume justifies the upgrade.',
      },
    },
  ],
}

function blogPostingGraph(post) {
  const url = `${ORIGIN}/blog/${post.slug}`
  return [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: '2026-05-31',
      dateModified: '2026-05-31',
      author: { '@id': `${ORIGIN}/#organization` },
      publisher: { '@id': `${ORIGIN}/#organization` },
      mainEntityOfPage: url,
      articleBody: post.sections.map((s) => s.body).join(' '),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${ORIGIN}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ]
}

function graphFor(route) {
  const graph = [organization, website]
  if (route === '/' || route === '/faq') graph.push(faqPage)
  if (route === '/orbitboyzz') {
    graph.push({
      '@type': 'AboutPage',
      '@id': `${ORIGIN}/orbitboyzz#about`,
      name: 'OrbitBoyzz official brand page',
      url: `${ORIGIN}/orbitboyzz`,
      mainEntity: { '@id': `${ORIGIN}/#organization` },
      description:
        'OrbitBoyzz is the official domain and brand handle for Orbit Websites, a Plainsboro, NJ web design and AI operations studio.',
    })
  }
  if (route === '/contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${ORIGIN}/contact#contactpage`,
      name: 'Contact Orbit Websites',
      url: `${ORIGIN}/contact`,
      mainEntity: { '@id': `${ORIGIN}/#organization` },
      description:
        'Book a free 30-minute call with Orbit Websites on Calendly, or reach the studio by phone or email.',
    })
  }
  if (route === '/web-design-central-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-central-nj#service`,
      name: 'Web Design in Central New Jersey',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: SERVICE_AREA,
      description:
        'Premium custom web design for local businesses in Plainsboro, Princeton, West Windsor Township, and Central New Jersey, with optional AI operations systems for intake, booking, and follow-up.',
    })
    // The page visibly shows the first 3 FAQs — mark them up for rich results.
    graph.push({
      '@type': 'FAQPage',
      '@id': `${ORIGIN}/web-design-central-nj#faq`,
      mainEntity: faqs.slice(0, 3).map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    })
  }
  if (route === '/web-design-ewing-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-ewing-nj#service`,
      name: 'Web Design in Ewing, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Ewing', address: { '@type': 'PostalAddress', postalCode: '08628', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description:
        'Custom hand-coded website design and AI operations for local businesses in Ewing Township, NJ. Starting at $10,000 with built-in lead intake and 15-second speed-to-lead.',
    })
  }
  if (route === '/pricing') {
    graph.push(pricingFaqPage)
  }
  if (route === '/blog') {
    graph.push({
      '@type': 'Blog',
      '@id': `${ORIGIN}/blog#blog`,
      name: 'Orbit Websites Blog',
      url: `${ORIGIN}/blog`,
      publisher: { '@id': `${ORIGIN}/#organization` },
      blogPost: blogPosts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        url: `${ORIGIN}/blog/${p.slug}`,
      })),
    })
  }
  return graph
}

// --- Head + body assembly ---------------------------------------------------
function buildHead(route, meta, graph) {
  const url = route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  return [
    `<title>${meta.title}</title>`,
    `<meta name="description" content="${meta.description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />`,
    `<meta property="og:type" content="${route.startsWith('/blog/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="OrbitBoyzz / Orbit Websites" />`,
    `<meta property="og:title" content="${meta.title}" />`,
    `<meta property="og:description" content="${meta.description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${meta.title}" />`,
    `<meta name="twitter:description" content="${meta.description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join('\n    ')
}

const SEO_RE = /<!--SEO-->[\s\S]*?<!--\/SEO-->/

function writePage(route, meta, graph) {
  const appHtml = render(route)
  const head = `<!--SEO-->\n    ${buildHead(route, meta, graph)}\n    <!--/SEO-->`

  let html = template
  if (SEO_RE.test(html)) {
    html = html.replace(SEO_RE, () => head)
  } else {
    // Fallback if the build stripped HTML comments: inject before </head>.
    html = html.replace('</head>', () => `    ${buildHead(route, meta, graph)}\n  </head>`)
  }
  html = html.split('<div id="root"></div>').join(`<div id="root">${appHtml}</div>`)

  const outPath =
    route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html, 'utf-8')
  return outPath
}

// --- Run --------------------------------------------------------------------
const staticRoutes = Object.keys(pageMeta)
let count = 0
for (const route of staticRoutes) {
  writePage(route, pageMeta[route], graphFor(route))
  count++
}
for (const post of blogPosts) {
  const route = `/blog/${post.slug}`
  // Blog titles are full questions (good for AEO); skip the brand suffix to
  // avoid SERP truncation. Brand is carried on every other page.
  writePage(
    route,
    { title: post.title, description: post.description },
    [organization, website, ...blogPostingGraph(post)],
  )
  count++
}

console.log(`Prerendered ${count} routes to dist/.`)
