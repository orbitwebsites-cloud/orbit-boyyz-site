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
    title: 'Custom Business Websites Ready in 7 Days | Orbit Websites',
    description:
      'Meet directly with Orbit Websites, choose a design direction, pay 50% to begin, and receive a custom business website ready for review in seven days.',
  },
  '/orbitboyzz': {
    title: 'OrbitBoyzz | Orbit Websites — Web Design Studio in Plainsboro, NJ',
    description:
      'OrbitBoyzz is the official brand handle for Orbit Websites, a hand-coded web design studio in Plainsboro, NJ building fast, conversion-focused sites for local businesses.',
  },
  '/about': {
    title: 'About Orbit Websites | Hand-Coded Web Design in Plainsboro, NJ',
    description:
      'Orbit Websites is a Plainsboro, NJ web design studio. We hand-code every site in Next.js — no templates, no plugins — so your site is fast, secure, and built to rank locally.',
  },
  '/services': {
    title: 'Web Design Services for Local Businesses in NJ | Orbit Websites',
    description:
      'New websites, redesigns, local SEO, booking forms, and quote automation for local businesses in Central NJ. Starting at $150. Free demo call — no commitment.',
  },
  '/pricing': {
    title: 'Website Design Pricing in NJ | Starting at $150 | Orbit Websites',
    description:
      'Transparent website pricing for local businesses. Starter builds from $150–$400 + $100–$300/mo. Custom enterprise builds from $3,500. See what you get before you pay.',
  },
  '/web-design-central-nj': {
    title: 'Web Design Agency Central NJ | Local Business Websites | Orbit Websites',
    description:
      'Central NJ web design agency serving Plainsboro, Princeton, Ewing, Hamilton, Trenton, and surrounding towns. Hand-coded sites starting at $150. Free live demo.',
  },
  '/web-design-ewing-nj': {
    title: 'Web Design Ewing NJ | Fast, Hand-Coded Local Business Websites',
    description:
      'Website design for local businesses in Ewing, NJ. Hand-coded Next.js, mobile-first, built to rank in Ewing Township searches. Starting at $150 — free demo before you pay.',
  },
  '/web-design-plainsboro-nj': {
    title: 'Web Design Plainsboro NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Plainsboro, NJ. Fast, hand-coded, mobile-first sites that rank in Plainsboro and Middlesex County searches. Starting at $150.',
  },
  '/web-design-west-windsor-nj': {
    title: 'Web Design West Windsor NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in West Windsor Township, NJ. Hand-coded, fast, and built to bring in calls and bookings. Starting at $150 — free demo.',
  },
  '/web-design-princeton-nj': {
    title: 'Web Design Princeton NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Princeton, NJ. Hand-coded Next.js sites that load fast and rank in Princeton searches. Starting at $150 — free live demo.',
  },
  '/web-design-hamilton-nj': {
    title: 'Web Design Hamilton NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Hamilton Township, NJ. Fast, hand-coded, mobile-first. Built to rank in Hamilton and Mercer County searches. Starting at $150.',
  },
  '/web-design-lawrence-nj': {
    title: 'Web Design Lawrence Township NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Lawrence Township, NJ. Hand-coded, blazing-fast, built to generate calls and bookings from local search. Starting at $150.',
  },
  '/web-design-trenton-nj': {
    title: 'Web Design Trenton NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Trenton, NJ. Hand-coded Next.js sites that rank in Trenton and Mercer County searches. Starting at $150 — free demo call.',
  },
  '/web-design-robbinsville-nj': {
    title: 'Web Design Robbinsville NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Robbinsville, NJ. Fast, hand-coded, mobile-first sites built to rank in Robbinsville and Mercer County searches. Starting at $150.',
  },
  '/web-design-bordentown-nj': {
    title: 'Web Design Bordentown NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in Bordentown, NJ. Hand-coded Next.js sites that rank locally and convert visitors into calls. Starting at $150 — free demo.',
  },
  '/web-design-east-windsor-nj': {
    title: 'Web Design East Windsor NJ | Local Business Websites | Orbit Websites',
    description:
      'Website design for local businesses in East Windsor, NJ. Fast, hand-coded, mobile-first sites built to generate calls and bookings from local search. Starting at $150.',
  },
  '/website-design-for-hvac-companies-nj': {
    title: 'HVAC Website Design NJ | Capture Emergency Calls 24/7 | Orbit Websites',
    description:
      'Website design for HVAC companies in New Jersey. Capture emergency service calls after hours, rank in local search, and never lose a hot lead. Starting at $150 — free demo.',
  },
  '/website-design-for-plumbers-nj': {
    title: 'Plumber Website Design NJ | Get More Emergency Jobs | Orbit Websites',
    description:
      'Website design for plumbers in New Jersey. Capture emergency calls overnight, rank in Mercer County searches, and get more booked jobs. Starting at $150 — free demo.',
  },
  '/website-design-for-electricians-nj': {
    title: 'Electrician Website Design NJ | Rank Locally & Get More Calls | Orbit Websites',
    description:
      'Website design for electricians in New Jersey. Hand-coded, fast, and built to rank in local searches. Residential and commercial lead capture. Starting at $150.',
  },
  '/website-design-for-landscaping-companies-nj': {
    title: 'Landscaping Company Website Design NJ | Get More Contracts | Orbit Websites',
    description:
      'Website design for landscaping companies in New Jersey. Capture seasonal and annual contract leads, rank in local search, and grow your client base. Starting at $150.',
  },
  '/website-design-for-dental-practices-nj': {
    title: 'Dental Website Design NJ | Attract New Patients | Orbit Websites',
    description:
      'Website design for dental practices in New Jersey. Capture new patient requests, show insurance info, and rank in local searches. Starting at $150 — free demo.',
  },
  '/website-design-for-restaurants-nj': {
    title: 'Restaurant Website Design NJ | Reservations, Menus & Catering | Orbit Websites',
    description:
      'Website design for restaurants, cafes, and caterers in New Jersey. Online menus, reservation links, catering inquiry forms, and local SEO. Starting at $150 — free demo.',
  },
  '/website-design-for-clinics-nj': {
    title: 'Clinic & Med Spa Website Design NJ | Book More Patients | Orbit Websites',
    description:
      'Website design for clinics and med spas in New Jersey. Capture appointment requests, showcase services, and rank in local searches. Starting at $150 — free demo.',
  },
  '/quote': {
    title: 'Free Website Quote for NJ Local Businesses | Starting at $150 | Orbit Websites',
    description:
      'Get a rough price range for your website in 60 seconds. Answer a few questions about your business and we\'ll show you what a build would cost — no commitment.',
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
    email: 'orbitboyzz@gmail.com',
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
    'Restaurant websites',
    'Dental practice websites',
    'Clinic websites',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Design Services',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Starter Website Build',
        description: 'Hand-coded Next.js website for local businesses. Mobile-first, fast, with booking and quote forms built in.',
        price: '150',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '150',
          maxPrice: '400',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'Offer',
        name: 'Monthly Website Care Plan',
        description: 'Global hosting, security updates, and unlimited text and photo changes.',
        price: '100',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '100',
          maxPrice: '300',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'Offer',
        name: 'Enterprise Custom Build',
        description: 'Advanced custom systems — automated intake, proposal generation, CRM integrations, and AI-powered workflows.',
        price: '3500',
        priceCurrency: 'USD',
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
        text: 'A starter website for a local business typically ranges from $150 to $400, while broader custom websites often range from $3,500 to $15,000 based on design, features, and AI automation. Orbit Boyzz starts with a lower entry range and around $5,000 when AI intake is included.',
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
  const date = isoDate(post.updated)
  const fallbackFaqs = {
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
  const graph = [
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

function isoDate(displayDate) {
  const months = {
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

function breadcrumbGraph(route, name) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Web Design Central NJ', item: `${ORIGIN}/web-design-central-nj` },
      { '@type': 'ListItem', position: 3, name, item: `${ORIGIN}${route}` },
    ],
  }
}

function faqGraph(route, id, entries) {
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

const townFaqMap = {
  '/web-design-ewing-nj': {
    town: 'Ewing, NJ',
    county: 'Mercer County',
    nearby: 'Trenton, Lawrence, Hamilton, Princeton, and West Windsor',
  },
  '/web-design-plainsboro-nj': {
    town: 'Plainsboro, NJ',
    county: 'Middlesex County',
    nearby: 'Princeton, West Windsor, Cranbury, Monroe, and South Brunswick',
  },
  '/web-design-west-windsor-nj': {
    town: 'West Windsor, NJ',
    county: 'Mercer County',
    nearby: 'Princeton, Plainsboro, Hamilton, Lawrence Township, and Robbinsville',
  },
  '/web-design-princeton-nj': {
    town: 'Princeton, NJ',
    county: 'Mercer County',
    nearby: 'Plainsboro, West Windsor, Lawrence Township, Hamilton, and Hopewell',
  },
  '/web-design-hamilton-nj': {
    town: 'Hamilton, NJ',
    county: 'Mercer County',
    nearby: 'Trenton, Lawrence Township, Robbinsville, Bordentown, and Ewing',
  },
  '/web-design-lawrence-nj': {
    town: 'Lawrence Township, NJ',
    county: 'Mercer County',
    nearby: 'Princeton, Ewing, Hamilton, Trenton, and West Windsor',
  },
  '/web-design-trenton-nj': {
    town: 'Trenton, NJ',
    county: 'Mercer County',
    nearby: 'Ewing, Hamilton, Lawrence Township, Bordentown, and Morrisville',
  },
  '/web-design-robbinsville-nj': {
    town: 'Robbinsville, NJ',
    county: 'Mercer County',
    nearby: 'Hamilton, East Windsor, West Windsor, Allentown, and Bordentown',
  },
  '/web-design-bordentown-nj': {
    town: 'Bordentown, NJ',
    county: 'Burlington County',
    nearby: 'Hamilton, Trenton, Robbinsville, Florence, and Chesterfield',
  },
  '/web-design-east-windsor-nj': {
    town: 'East Windsor, NJ',
    county: 'Mercer County',
    nearby: 'Hightstown, Robbinsville, West Windsor, Cranbury, and Monroe',
  },
}

function townLandingFaqGraph(route, page) {
  return faqGraph(route, 'local-faq', [
    [
      `How much does web design cost in ${page.town}?`,
      `A focused starter website for a ${page.town} business usually ranges from $150 to $400. AI intake, booking logic, quote routing, and deeper custom design can move the project into the $5,000 to $15,000 range.`,
    ],
    [
      `Do you work with businesses near ${page.town}?`,
      `Yes. Orbit Websites serves ${page.town}, ${page.county}, and nearby areas including ${page.nearby}. Pages should only target towns where the business actually works.`,
    ],
    [
      'What makes a local business website convert?',
      'The highest-converting local websites make the next step obvious: call, request a quote, book a visit, or start intake. The page also needs clear services, proof, service-area context, fast mobile performance, and pricing or budget guidance.',
    ],
  ])
}

const industryFaqMap = {
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
  '/website-design-for-dental-practices-nj': {
    short: 'Dental',
    jobType: 'new patient appointments',
  },
  '/website-design-for-restaurants-nj': {
    short: 'Restaurant',
    jobType: 'orders, reservations, catering leads, and private event inquiries',
  },
  '/website-design-for-clinics-nj': {
    short: 'Clinic',
    jobType: 'consultation requests, appointment bookings, and patient intake forms',
  },
}

function industryLandingFaqGraph(route, page) {
  const lower = page.short.toLowerCase()
  return faqGraph(route, 'industry-faq', [
    [
      `How much does a website cost for a ${lower} company in NJ?`,
      `A focused starter site for a ${lower} company usually ranges from $150 to $400. AI intake, routing, booking, proposal logic, and deeper custom workflows usually move the project into the $5,000 to $15,000 range.`,
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

function topLevelBreadcrumbGraph(route, name) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name, item: `${ORIGIN}${route}` },
    ],
  }
}

function graphFor(route) {
  const graph = [organization, website]
  const topLevelBreadcrumbs = {
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
  }
  if (topLevelBreadcrumbs[route]) {
    graph.push(topLevelBreadcrumbGraph(route, topLevelBreadcrumbs[route]))
  }
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
        'Custom website design and AI operations for local businesses in Ewing Township, NJ. Starter sites usually range from $150-$400, with AI lead intake builds starting around $5,000.',
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
        'Custom website design and AI operations for local businesses in Plainsboro, NJ. Starter sites usually range from $150-$400, with AI lead intake builds starting around $5,000.',
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
        'Custom website design and AI operations for local businesses in West Windsor Township, NJ. Starter sites usually range from $150-$400, with AI lead intake builds starting around $5,000.',
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
        'Custom website design and AI operations for local businesses in Princeton, NJ. Starter sites usually range from $150-$400, with AI lead intake builds starting around $5,000.',
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
        'Custom website design and AI operations for local businesses in Hamilton Township, NJ. Starter sites usually range from $150-$400, with AI lead intake builds starting around $5,000.',
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
        'Custom website design and AI operations for local businesses in Lawrence Township, NJ. Starter sites usually range from $150-$400, with AI lead intake builds starting around $5,000.',
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
  if (townFaqMap[route]) {
    graph.push(townLandingFaqGraph(route, townFaqMap[route]))
  }
  const industryServiceMap = {
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
    '/website-design-for-dental-practices-nj': {
      id: 'dental-web-design-nj',
      name: 'Website Design for Dental Practices in NJ',
      serviceType: 'Website design for dental practices',
      desc: 'Custom websites and AI new-patient intake for dental practices in New Jersey. Insurance capture, treatment interest, and appointment windows.',
      label: 'Website Design for Dental Practices in NJ',
    },
    '/website-design-for-restaurants-nj': {
      id: 'restaurant-web-design-nj',
      name: 'Restaurant Website Design in NJ',
      serviceType: 'Website design for restaurants and caterers',
      desc: 'Custom websites and AI catering intake for restaurants, cafes, bakeries, and caterers in New Jersey. Capture orders, reservations, private events, and catering leads.',
      label: 'Restaurant Website Design in NJ',
    },
    '/website-design-for-clinics-nj': {
      id: 'clinic-web-design-nj',
      name: 'Clinic Website Design in NJ',
      serviceType: 'Website design for clinics and healthcare practices',
      desc: 'Custom websites and AI patient intake for clinics, med spas, and appointment-based healthcare practices in New Jersey. Capture consultation requests, appointment bookings, and patient intake.',
      label: 'Clinic Website Design in NJ',
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
    `<link rel="alternate" type="application/rss+xml" title="Orbit Websites Blog" href="${ORIGIN}/feed.xml" />`,
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

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function rfc822Date(displayDate) {
  return new Date(`${isoDate(displayDate)}T12:00:00Z`).toUTCString()
}

function writeFeed() {
  const items = blogPosts
    .map((post) => {
      const url = `${ORIGIN}/blog/${post.slug}`
      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xmlEscape(post.description)}</description>
      <pubDate>${rfc822Date(post.updated)}</pubDate>
    </item>`
    })
    .join('\n')

  const latestPost = blogPosts
    .map((post) => isoDate(post.updated))
    .sort()
    .at(-1)

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Orbit Websites Blog</title>
    <link>${ORIGIN}/blog</link>
    <description>Direct answers about local business websites, AI intake, pricing, and web design in Central New Jersey.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(`${latestPost ?? '2026-06-13'}T12:00:00Z`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

  writeFileSync(join(distDir, 'feed.xml'), feed, 'utf-8')
}

function sitemapLastMod(route) {
  if (route.startsWith('/blog/')) {
    const slug = route.replace('/blog/', '')
    const post = blogPosts.find((item) => item.slug === slug)
    return post ? isoDate(post.updated) : '2026-06-13'
  }
  if (
    route === '/pricing' ||
    route === '/quote' ||
    route === '/blog' ||
    route.startsWith('/web-design-') ||
    route.startsWith('/website-design-for-')
  ) {
    return '2026-06-13'
  }
  return '2026-06-01'
}

function sitemapPriority(route) {
  if (route === '/') return '1.0'
  if (route === '/pricing' || route === '/quote' || route === '/contact') return '0.9'
  if (route === '/blog' || route.startsWith('/web-design-') || route.startsWith('/website-design-for-')) return '0.8'
  if (route.startsWith('/blog/')) return '0.7'
  return '0.6'
}

function sitemapChangeFreq(route) {
  if (route === '/' || route === '/blog') return 'weekly'
  if (route.startsWith('/blog/')) return 'monthly'
  return 'monthly'
}

function writeSitemap(routes) {
  const urls = routes
    .map((route) => {
      const loc = route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`
      return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${sitemapLastMod(route)}</lastmod>
    <changefreq>${sitemapChangeFreq(route)}</changefreq>
    <priority>${sitemapPriority(route)}</priority>
  </url>`
    })
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf-8')
}

// --- Run --------------------------------------------------------------------
const staticRoutes = Object.keys(pageMeta)
const prerenderedRoutes = []
let count = 0
for (const route of staticRoutes) {
  writePage(route, pageMeta[route], graphFor(route))
  prerenderedRoutes.push(route)
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
  prerenderedRoutes.push(route)
  count++
}
writeFeed()
writeSitemap(prerenderedRoutes)

console.log(`Prerendered ${count} routes to dist/.`)
