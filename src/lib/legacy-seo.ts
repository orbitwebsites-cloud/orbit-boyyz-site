// Ported from the old site's prerender.mjs (the SEO source of truth): the
// per-route <title>/description table and the JSON-LD graph builders are the
// same code, so every ported route emits exactly what the old prerender did.
// Copied programmatically — keep in sync with PORT-NOTES.md if edited.
import { blogPosts, type BlogPost } from '@/content/blog'
import { ewingFaqs, legacyFaqs as faqs, townLandingFaqs, townPages } from '@/content/landing'

export const ORIGIN = 'https://orbitboyzz.com'
const OG_IMAGE = `${ORIGIN}/orbit-logo.png`

// --- Brand entity signals (fill these in as off-site profiles go live) -------
// sameAs is the strongest brand-corroboration signal LLMs use. ONLY add a URL
// here AFTER the profile is live and public — a sameAs that 404s hurts more than
// an empty list. Uncomment each line the moment the corresponding profile exists.
const SAME_AS: string[] = [
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



// --- Per-route metadata -----------------------------------------------------
export const legacyPageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Custom Business Websites Ready in 7 Days | Orbit Websites',
    description:
      'Meet directly with Orbit Websites, choose a design direction, pay 50% to begin, and receive a custom business website ready for review in seven days.',
  },
  '/growth': {
    title: 'Orbit Growth Systems | Lead Response Systems for HVAC',
    description:
      'Orbit Growth Systems helps independent HVAC companies answer new leads faster, recover missed calls, automate follow-up, and book more qualified jobs.',
  },
  '/orbitboyzz': {
    title: 'OrbitBoyzz | Orbit Websites — Web Design Studio in Plainsboro, NJ',
    description:
      'OrbitBoyzz is the brand handle for Orbit Websites, a Plainsboro, NJ studio hand-coding fast, conversion-focused websites for local businesses.',
  },
  '/about': {
    title: 'About Orbit Websites | Hand-Coded Web Design in Plainsboro, NJ',
    description:
      'Orbit Websites is a Plainsboro, NJ web design studio. We hand-code every site in Next.js — no templates, no plugins — so your site is fast, secure, and built to rank locally.',
  },
  '/services': {
    title: 'Web Design Services for Local Businesses in NJ | Orbit Websites',
    description:
      'New websites, redesigns, local SEO, booking forms, and quote automation for local businesses in Central NJ. Free demo call — no commitment.',
  },
  '/pricing': {
    title: 'Website Design Pricing in NJ | Orbit Websites',
    description:
      'Transparent website pricing for local businesses. Launch builds quoted on a free call, premium builds from $3,500, AI systems $5,000–$15,000+, optional care $300–$700/mo. See what you get before you pay.',
  },
  '/web-design-central-nj': {
    title: 'Web Design Agency Central NJ | Local Business Websites | Orbit Websites',
    description:
      'Central NJ web design agency serving Plainsboro, Princeton, Ewing, Hamilton, Trenton, and surrounding towns. Hand-coded sites with a free live demo.',
  },
  '/web-design-ewing-nj': {
    title: 'Web Design Ewing NJ | Fast, Hand-Coded Local Business Websites',
    description:
      'Website design for local businesses in Ewing, NJ. Hand-coded Next.js, mobile-first, built to rank in Ewing Township searches. Free demo before you pay.',
  },
  '/web-design-plainsboro-nj': {
    title: 'Web Design Plainsboro NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Plainsboro, NJ. Fast, hand-coded, mobile-first sites that rank in Plainsboro and Middlesex County searches.',
  },
  '/web-design-west-windsor-nj': {
    title: 'Web Design West Windsor NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in West Windsor Township, NJ. Hand-coded, fast, and built to bring in calls and bookings. Free demo.',
  },
  '/web-design-princeton-nj': {
    title: 'Web Design Princeton NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Princeton, NJ. Hand-coded Next.js sites that load fast and rank in Princeton searches. Free live demo.',
  },
  '/web-design-hamilton-nj': {
    title: 'Web Design Hamilton NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Hamilton Township, NJ. Fast, hand-coded, mobile-first. Built to rank in Hamilton and Mercer County searches.',
  },
  '/web-design-lawrence-nj': {
    title: 'Web Design Lawrence Township NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Lawrence Township, NJ. Hand-coded, blazing-fast, built to generate calls and bookings from local search.',
  },
  '/web-design-trenton-nj': {
    title: 'Web Design Trenton NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Trenton, NJ. Hand-coded Next.js sites that rank in Trenton and Mercer County searches. Free demo call.',
  },
  '/web-design-robbinsville-nj': {
    title: 'Web Design Robbinsville NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Robbinsville, NJ. Fast, hand-coded, mobile-first sites built to rank in Robbinsville and Mercer County searches.',
  },
  '/web-design-bordentown-nj': {
    title: 'Web Design Bordentown NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Bordentown, NJ. Hand-coded Next.js sites that rank locally and convert visitors into calls. Free demo.',
  },
  '/web-design-east-windsor-nj': {
    title: 'Web Design East Windsor NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in East Windsor, NJ. Fast, hand-coded, mobile-first sites built to generate calls and bookings from local search.',
  },
  '/website-design-for-hvac-companies-nj': {
    title: 'HVAC Website Design NJ | Capture Emergency Calls 24/7 | Orbit Websites',
    description:
      'Website design for HVAC companies in New Jersey. Capture emergency service calls after hours, rank in local search, and never lose a hot lead. Free demo.',
  },
  '/website-design-for-plumbers-nj': {
    title: 'Plumber Website Design NJ | Get More Emergency Jobs | Orbit Websites',
    description:
      'Website design for plumbers in New Jersey. Capture emergency calls overnight, rank in Mercer County searches, and get more booked jobs. Free demo.',
  },
  '/website-design-for-electricians-nj': {
    title: 'Electrician Website Design NJ | Rank Locally & Get More Calls | Orbit Websites',
    description:
      'Website design for electricians in New Jersey. Hand-coded, fast, and built to rank in local searches. Residential and commercial lead capture.',
  },
  '/website-design-for-landscaping-companies-nj': {
    title: 'Landscaping Company Website Design NJ | Get More Contracts | Orbit Websites',
    description:
      'Website design for landscaping companies in New Jersey. Capture seasonal and annual contract leads, rank in local search, and grow your client base.',
  },
  '/quote': {
    title: 'Free Website Quote for NJ Local Businesses | Orbit Websites',
    description:
      'Get a rough price range for your website in 60 seconds. Answer a few questions about your business and we\'ll show you what a build would cost — no commitment.',
  },
  '/project-brief': {
    title: 'Client Discovery Brief | Orbit Websites',
    description:
      'Complete the inclusive Orbit Websites client discovery brief for a business, nonprofit, public initiative, personal brand, organization, or new project.',
  },
  '/contact': {
    title: 'Book a Free Demo Call | Orbit Websites | Plainsboro, NJ',
    description:
      'Book a free 15-minute call with Orbit Websites. We\'ll build a live demo of your site and show you before you pay a cent. Call 609-662-8052 or book online.',
  },
  '/projects': {
    title: 'Website Portfolio | Local Business Web Design Examples | Orbit Websites',
    description:
      'See real websites built by Orbit Websites for local businesses in Central NJ — HVAC, catering, and more. Hand-coded, fast, and built to get calls.',
  },
  '/blog': {
    title: 'Web Design & Local Business Growth Blog | Orbit Websites | Central NJ',
    description:
      'Practical guides on website design, local SEO, and getting more calls for local businesses in Central NJ. Written by Orbit Websites in Plainsboro, NJ.',
  },
  '/faq': {
    title: 'Website Design FAQ | Common Questions Answered | Orbit Websites NJ',
    description:
      'Common questions about web design pricing, timelines, what\'s included, and how Orbit Websites builds sites for local businesses in Central NJ.',
  },
  '/privacy': {
    title: 'Privacy Policy | Orbit Websites',
    description:
      'How Orbit Websites (OrbitBoyzz) collects, uses, and protects information submitted through orbitboyzz.com, including forms, analytics, and third-party services.',
  },
  '/developers': {
    title: 'Developer & API Docs | Orbit Websites',
    description:
      'Public OpenAPI 3.1 specification, endpoint reference, and example requests for the OrbitBoyzz / Orbit Websites project range estimator API.',
  },
}

// --- JSON-LD builders -------------------------------------------------------
export const organization = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${ORIGIN}/#organization`,
  name: 'Orbit Websites',
  alternateName: ['OrbitBoyzz', 'Orbit Boyzz', 'ORBIT Websites', 'OrbitBoyzz Websites'],
  description:
    'Orbit Websites, also known as OrbitBoyzz, is a Plainsboro, New Jersey web design and AI operations studio building premium websites and automated intake, pricing, booking, and lead-routing systems for Central New Jersey local businesses.',
  url: `${ORIGIN}/`,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  telephone: '+1-609-662-8052',
  email: 'alex@orbitboyzz.com',
  priceRange: '$$-$$$',
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
    email: 'alex@orbitboyzz.com',
    contactType: 'customer support',
    areaServed: 'US',
    availableLanguage: 'English',
  },
  areaServed: SERVICE_AREA,
  knowsAbout: [
    'Website design',
    'Local business website design',
    'Hand-coded Next.js websites',
    'Mobile-first web design',
    'Local SEO foundations',
    'Lead capture forms',
    'Booking and quote forms',
    'HVAC company websites',
    'Plumber websites',
    'Electrician websites',
    'Landscaping company websites',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Design Services',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Launch Website Build',
        description:
          'Hand-coded Next.js website for local businesses. Mobile-first, fast, with booking and quote forms built in. Quoted on a free call; 7-day sprint, 50% to start and 50% on approval.',
      },
      {
        '@type': 'Offer',
        name: 'Premium Website Build',
        description: 'Premium hand-coded website system with deeper strategy and copy, service and area pages, structured data, analytics, and booking and lead flows.',
        price: '3500',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '3500',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'Offer',
        name: 'AI Operations Build',
        description: 'Advanced custom systems — automated intake, proposal generation, CRM integrations, and AI-powered workflows. Typically $5,000–$15,000+.',
        price: '5000',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '5000',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'Offer',
        name: 'AI Operations Retainer',
        description: 'Optional monthly retainer for workflow monitoring, maintenance and improvements, when it replaces measurable admin labor or recovers high-intent leads.',
        price: '750',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          minPrice: '750',
          maxPrice: '2500',
          priceCurrency: 'USD',
          unitCode: 'MON',
        },
      },
      {
        '@type': 'Offer',
        name: 'Monthly Website Care Plan',
        description: 'Optional, month-to-month after launch: Site Care $300, Website + Leads Plan $500, Growth Partner $700 per month. Managed hosting, security, backups and content updates.',
        price: '300',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          minPrice: '300',
          maxPrice: '700',
          priceCurrency: 'USD',
          unitCode: 'MON',
        },
      },
    ],
  },
  potentialAction: [
    {
      '@type': 'ReserveAction',
      name: 'Book a Free Demo Call',
      target: 'https://calendly.com/orbitwebsites/30min',
    },
    {
      '@type': 'CommunicateAction',
      name: 'Call Orbit Websites',
      target: 'tel:+16096628052',
    },
  ],
  // Conditionally included so we never emit empty/placeholder entity signals.
  ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  ...(FOUNDED ? { foundingDate: FOUNDED } : {}),
  ...(OPENING_HOURS.length ? { openingHoursSpecification: OPENING_HOURS } : {}),
}

export const website = {
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  name: 'Orbit Websites',
  alternateName: 'OrbitBoyzz',
  url: `${ORIGIN}/`,
  publisher: { '@id': `${ORIGIN}/#organization` },
}



export function blogPostingGraph(post: BlogPost) {
  const url = `${ORIGIN}/blog/${post.slug}`
  const date = isoDate(post.updated)
  const fallbackFaqs: Record<string, Array<[string, string]>> = {
    'custom-web-design-vs-wix-squarespace': [
      [
        'Is a custom website better for local SEO than Wix or Squarespace?',
        'Often, yes. Custom sites give more control over page speed, schema, service-area structure, copy, and conversion paths than a generic template, which can make them a better fit for serious local SEO work.',
      ],
      [
        'What is the true cost difference between a template and a custom website?',
        'A template usually has a lower monthly platform cost, but the true cost depends on setup time, redesign work, add-ons, SEO limitations, integrations, and whether the site can create enough calls, quote requests, or bookings to justify a custom build.',
      ],
    ],
  }
  const postFaqs = post.faqs ?? fallbackFaqs[post.slug]
  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: date,
      dateModified: date,
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
  if (postFaqs) {
    graph.push(faqGraph(`/blog/${post.slug}`, 'faq', postFaqs))
  }
  return graph
}

export function isoDate(displayDate: string) {
  const months: Record<string, string> = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  }
  const match = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(displayDate)
  if (!match) return '2026-06-13'
  const [, monthName, day, year] = match
  return `${year}-${months[monthName] ?? '01'}-${day.padStart(2, '0')}`
}

function breadcrumbGraph(route: string, name: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Web Design Central NJ', item: `${ORIGIN}/web-design-central-nj` },
      { '@type': 'ListItem', position: 3, name, item: `${ORIGIN}${route}` },
    ],
  }
}

function faqGraph(route: string, id: string, entries: ReadonlyArray<readonly [string, string]>) {
  return {
    '@type': 'FAQPage',
    '@id': `${ORIGIN}${route}#${id}`,
    mainEntity: entries.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}



const industryFaqMap: Record<string, { short: string; jobType: string }> = {
  '/website-design-for-hvac-companies-nj': {
    short: 'HVAC',
    jobType: 'heating and cooling service calls',
  },
  '/website-design-for-plumbers-nj': {
    short: 'Plumbing',
    jobType: 'plumbing service and repair calls',
  },
  '/website-design-for-electricians-nj': {
    short: 'Electrical',
    jobType: 'electrical service and installation jobs',
  },
  '/website-design-for-landscaping-companies-nj': {
    short: 'Landscaping',
    jobType: 'landscaping and lawn maintenance contracts',
  },
}

function industryLandingFaqGraph(route: string, page: { short: string; jobType: string }) {
  const lower = page.short.toLowerCase()
  return faqGraph(route, 'industry-faq', [
    [
      `How much does a website cost for a ${lower} company in NJ?`,
      `A focused launch site for a ${lower} company is quoted on a free call after a quick look at your needs, and premium builds start at $3,500. AI intake, routing, booking, proposal logic, and deeper custom workflows run $5,000 to $15,000+, and optional care plans are $300–$700/mo.`,
    ],
    [
      `What should a ${lower} website include?`,
      `A strong ${lower} website should include service details, local service areas, trust signals, clear calls to action, mobile-first pages, and an intake path built around ${page.jobType}.`,
    ],
    [
      'When does AI intake make sense?',
      `AI intake makes sense when faster response or better qualification can recover revenue. For ${lower} businesses, it can collect the details staff need before calling back and route higher-value requests sooner.`,
    ],
  ])
}

function topLevelBreadcrumbGraph(route: string, name: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name, item: `${ORIGIN}${route}` },
    ],
  }
}

export function graphFor(route: string) {
  const graph: Array<Record<string, unknown>> = [organization, website]
  const topLevelBreadcrumbs: Record<string, string> = {
    '/about': 'About Orbit Websites',
    '/services': 'Website Services',
    '/pricing': 'Pricing',
    '/quote': 'Quote Estimator',
    '/contact': 'Contact',
    '/projects': 'Projects',
    '/blog': 'Blog',
    '/faq': 'FAQ',
    '/orbitboyzz': 'OrbitBoyzz',
    '/web-design-central-nj': 'Web Design Central NJ',
    '/privacy': 'Privacy Policy',
    '/developers': 'Developers / API',
  }
  if (topLevelBreadcrumbs[route]) {
    graph.push(topLevelBreadcrumbGraph(route, topLevelBreadcrumbs[route]))
  }
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
        'Custom website design and AI operations for local businesses in Ewing Township, NJ. Launch builds are quoted on a free call, premium builds start at $3,500, and AI lead intake builds run $5,000–$15,000+.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Ewing, NJ'))
  }
  if (route === '/web-design-plainsboro-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-plainsboro-nj#service`,
      name: 'Web Design in Plainsboro, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Plainsboro', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Middlesex County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description:
        'Custom website design and AI operations for local businesses in Plainsboro, NJ. Launch builds are quoted on a free call, premium builds start at $3,500, and AI lead intake builds run $5,000–$15,000+.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Plainsboro, NJ'))
  }
  if (route === '/web-design-west-windsor-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-west-windsor-nj#service`,
      name: 'Web Design in West Windsor Township, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'West Windsor Township', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description:
        'Custom website design and AI operations for local businesses in West Windsor Township, NJ. Launch builds are quoted on a free call, premium builds start at $3,500, and AI lead intake builds run $5,000–$15,000+.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in West Windsor Township, NJ'))
  }
  if (route === '/web-design-princeton-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-princeton-nj#service`,
      name: 'Web Design in Princeton, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Princeton', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description:
        'Custom website design and AI operations for local businesses in Princeton, NJ. Launch builds are quoted on a free call, premium builds start at $3,500, and AI lead intake builds run $5,000–$15,000+.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Princeton, NJ'))
  }
  if (route === '/web-design-hamilton-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-hamilton-nj#service`,
      name: 'Web Design in Hamilton, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Hamilton', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description:
        'Custom website design and AI operations for local businesses in Hamilton Township, NJ. Launch builds are quoted on a free call, premium builds start at $3,500, and AI lead intake builds run $5,000–$15,000+.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Hamilton, NJ'))
  }
  if (route === '/web-design-lawrence-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-lawrence-nj#service`,
      name: 'Web Design in Lawrence Township, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Lawrence Township', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description:
        'Custom website design and AI operations for local businesses in Lawrence Township, NJ. Launch builds are quoted on a free call, premium builds start at $3,500, and AI lead intake builds run $5,000–$15,000+.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Lawrence Township, NJ'))
  }
  if (route === '/web-design-trenton-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-trenton-nj#service`,
      name: 'Web Design in Trenton, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Trenton', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description: 'Custom hand-coded website design and AI operations for local businesses in Trenton, NJ.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Trenton, NJ'))
  }
  if (route === '/web-design-robbinsville-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-robbinsville-nj#service`,
      name: 'Web Design in Robbinsville, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Robbinsville', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description: 'Custom hand-coded website design and AI operations for local businesses in Robbinsville, NJ.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Robbinsville, NJ'))
  }
  if (route === '/web-design-bordentown-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-bordentown-nj#service`,
      name: 'Web Design in Bordentown, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'Bordentown', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Burlington County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description: 'Custom hand-coded website design and AI operations for local businesses in Bordentown, NJ.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in Bordentown, NJ'))
  }
  if (route === '/web-design-east-windsor-nj') {
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}/web-design-east-windsor-nj#service`,
      name: 'Web Design in East Windsor, NJ',
      serviceType: 'Website design',
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: [
        { '@type': 'City', name: 'East Windsor', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Mercer County', address: { '@type': 'PostalAddress', addressRegion: 'NJ', addressCountry: 'US' } },
      ],
      description: 'Custom hand-coded website design and AI operations for local businesses in East Windsor, NJ.',
    })
    graph.push(breadcrumbGraph(route, 'Web Design in East Windsor, NJ'))
  }
  const townPage = Object.values(townPages).find((p) => p.path === route)
  if (townPage) {
    graph.push(faqGraph(route, 'local-faq', townLandingFaqs(townPage)))
  } else if (route === '/web-design-ewing-nj') {
    graph.push(faqGraph(route, 'local-faq', ewingFaqs))
  }
  const industryServiceMap: Record<string, { id: string; name: string; serviceType: string; desc: string; label: string }> = {
    '/website-design-for-hvac-companies-nj': {
      id: 'hvac-web-design-nj',
      name: 'Website Design for HVAC Companies in NJ',
      serviceType: 'Website design for HVAC contractors',
      desc: 'Custom hand-coded websites and AI dispatch intake for HVAC companies in New Jersey. Emergency call capture, urgency routing, and local SEO.',
      label: 'Website Design for HVAC Companies in NJ',
    },
    '/website-design-for-plumbers-nj': {
      id: 'plumber-web-design-nj',
      name: 'Website Design for Plumbers in NJ',
      serviceType: 'Website design for plumbing contractors',
      desc: 'Custom websites and AI intake for plumbing contractors in New Jersey. Emergency job routing, quote capture, and local search visibility.',
      label: 'Website Design for Plumbers in NJ',
    },
    '/website-design-for-electricians-nj': {
      id: 'electrician-web-design-nj',
      name: 'Website Design for Electricians in NJ',
      serviceType: 'Website design for electricians',
      desc: 'Custom websites and AI intake for electricians in New Jersey. Residential and commercial lead routing for Mercer County and Central NJ.',
      label: 'Website Design for Electricians in NJ',
    },
    '/website-design-for-landscaping-companies-nj': {
      id: 'landscaping-web-design-nj',
      name: 'Website Design for Landscaping Companies in NJ',
      serviceType: 'Website design for landscaping companies',
      desc: 'Custom websites and AI proposal intake for landscaping companies in New Jersey. Capture annual contracts and grow in Central NJ local search.',
      label: 'Website Design for Landscaping Companies in NJ',
    },
  }
  if (industryServiceMap[route]) {
    const s = industryServiceMap[route]
    graph.push({
      '@type': 'Service',
      '@id': `${ORIGIN}${route}#service`,
      name: s.name,
      serviceType: s.serviceType,
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: SERVICE_AREA,
      description: s.desc,
    })
    graph.push(breadcrumbGraph(route, s.label))
    if (industryFaqMap[route]) {
      graph.push(industryLandingFaqGraph(route, industryFaqMap[route]))
    }
  }
  if (route === '/privacy') {
    graph.push({
      '@type': 'WebPage',
      '@id': `${ORIGIN}/privacy#page`,
      name: 'Privacy Policy',
      url: `${ORIGIN}/privacy`,
      about: { '@id': `${ORIGIN}/#organization` },
      description:
        'How Orbit Websites (OrbitBoyzz) collects, uses, and protects information submitted through orbitboyzz.com.',
    })
  }
  if (route === '/developers') {
    graph.push({
      '@type': 'WebAPI',
      '@id': `${ORIGIN}/developers#api`,
      name: 'OrbitBoyzz / Orbit Websites API',
      url: `${ORIGIN}/developers`,
      documentation: `${ORIGIN}/openapi.json`,
      provider: { '@id': `${ORIGIN}/#organization` },
      description:
        'Public, unauthenticated JSON API for computing website project price ranges, documented with an OpenAPI 3.1 specification.',
    })
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

/** Full JSON-LD document for a route, as the old prerender emitted it. */
export function legacyJsonLd(route: string) {
  return { '@context': 'https://schema.org', '@graph': graphFor(route) }
}

/** Full JSON-LD document for a blog post, as the old prerender emitted it. */
export function blogJsonLd(post: BlogPost) {
  return { '@context': 'https://schema.org', '@graph': [organization, website, ...blogPostingGraph(post)] }
}
