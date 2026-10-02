// Shared site content — single source of truth for both builds.
// Facts only. Do not add testimonials, results or clients that don't exist.

export const site = {
  name: 'Orbit Websites',
  handle: 'OrbitBoyzz',
  tagline: 'Designed personally. Built quickly. Owned by you.',
  url: 'https://orbitboyzz.com',
  phone: '609-662-8052',
  phoneDisplay: '609 662 8052',
  phoneHref: 'tel:+16096628052',
  email: 'alex@orbitboyzz.com',
  booking: 'https://calendly.com/orbitwebsites/30min',
  location: 'Plainsboro, NJ',
  serviceArea: 'Central New Jersey',
  towns: [
    'Plainsboro',
    'Princeton',
    'West Windsor',
    'Ewing',
    'Hamilton',
    'Lawrence',
    'Hopewell',
    'Trenton',
    'Robbinsville',
    'East Windsor',
    'Bordentown',
  ],
} as const

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/projects' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const

export const footerPages = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Quote', href: '/quote' },
  { label: 'Free website check', href: '/free-website-check' },
  { label: 'Web Design NJ', href: '/web-design-central-nj' },
  { label: 'Blog', href: '/blog' },
  { label: 'OrbitBoyzz', href: '/orbitboyzz' },
  { label: 'Developers / API', href: '/developers' },
  { label: 'Privacy', href: '/privacy' },
] as const

export const industries = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'Roofing',
  'Landscaping',
  'Contractors',
  'Remodeling',
  'Painting',
  'Tree service',
  'Pest control',
  'Garage doors',
  'Pressure washing',
] as const

export const hero = {
  eyebrow: 'Custom websites & AI systems · Central NJ',
  headline: 'Your website should book jobs, not just sit there.',
  // The H1's accessible (and indexed) text; the visual headline above stays as designed.
  srHeadline: 'Custom website design for New Jersey home-service businesses that books jobs',
  sub: 'Hand-coded, conversion-first websites for local businesses — designed with you on a call, launched in days, and fully yours.',
  primaryCta: 'Book a free call',
  secondaryCta: 'See the work',
  chips: ['50% to start', '7-day build', 'You approve before final payment'],
} as const

export const problem = {
  label: '[01 // THE PROBLEM]',
  statement:
    'Most local business websites just sit there. They look fine, load slow, and quietly lose the customer who was ready to call.',
} as const

export const services = [
  {
    id: '01',
    slug: 'websites',
    title: 'Custom website design',
    short: 'A premium site that makes people trust you and take the next step.',
    copy: 'Hand-coded Next.js, mobile-first, built around calls, quotes and bookings. No templates, no plugins, no monthly platform lock-in.',
    bullets: ['Conversion-first structure', 'Local SEO foundations', 'Fast on every phone', 'You own the code'],
  },
  {
    id: '02',
    slug: 'refresh',
    title: 'Website refresh',
    short: 'Keep what works, fix what costs you leads.',
    copy: 'Cleaner copy, modern layout, faster paths to call or book — for businesses whose current site is outdated, slow or confusing.',
    bullets: ['Sharper messaging', 'Modern mobile layout', 'Clear calls to action', 'Speed and accessibility fixes'],
  },
  {
    id: '03',
    slug: 'ai-operations',
    title: 'AI intake & booking',
    short: 'Answer, qualify and book leads while you sleep.',
    copy: 'Smart intake forms and automations that capture job details, qualify urgency, text you a summary and send priced proposals in minutes.',
    bullets: ['After-hours lead capture', 'Instant quote & proposal links', 'Booking and routing', 'CRM and SMS integrations'],
  },
  {
    id: '04',
    slug: 'care',
    title: 'Care & growth plans',
    short: 'We keep it online, protected and improving.',
    copy: 'Managed hosting, security, content updates and ongoing local SEO — optional, month to month, only after launch.',
    bullets: ['Managed hosting & backups', 'Unlimited text/photo edits', 'Local SEO maintenance', 'Priority support'],
  },
] as const

export const projects = [
  {
    slug: 'weichert-princeton-pages',
    name: 'Weichert Princeton Pages',
    category: 'Real estate',
    headline: 'Find your next home.',
    description: 'A focused local property experience built to make listings and contact options easy to find.',
    url: 'https://weichert-princeton-pages.vercel.app/',
    // TODO(assets): replace with real screenshot/recording from the client
    image: '/work/weichert.png',
    accent: '#D6B36A',
  },
  {
    slug: 'real-estate-website',
    name: 'Real Estate Website',
    category: 'Property services',
    headline: 'Move with confidence.',
    description: 'A modern service website with clear navigation, trust signals and direct lead paths.',
    url: 'https://real-estate1-tau.vercel.app/',
    image: '/work/real-estate.png',
    accent: '#7FB4FF',
  },
  {
    slug: 'grand-treats-by-tony',
    name: 'Grand Treats by Tony',
    category: 'Specialty food',
    headline: 'Made for sweet moments.',
    description: 'A warm, product-led website that helps customers understand the brand and get in touch.',
    url: 'https://grandtreatsbytony.com/',
    image: '/work/grand-treats.png',
    accent: '#F28C6B',
  },
] as const

export const process = [
  { number: '01', title: 'Book a call', copy: 'Choose a time that works. The first conversation is free and focused on what your business needs.' },
  { number: '02', title: 'Talk directly with us', copy: 'You speak with the people building your site — no sales handoff, no guessing.' },
  { number: '03', title: 'Choose the direction', copy: 'Show us sites you like, pick from our previous work, or let us create a direction for you.' },
  { number: '04', title: 'Pay 50% to begin', copy: 'Once scope and direction are clear, the first half reserves your build and starts the sprint.' },
  { number: '05', title: 'Launch', copy: 'Approve the finished site, pay the remaining 50%, and it is yours. Hosting with us is optional.' },
] as const

export const tiers = [
  {
    id: 'launch',
    name: 'Launch build',
    price: 'Quoted after the call',
    meta: '7-day sprint · 50% to start',
    copy: 'A polished custom website for businesses that need to look credible and get calls — fast.',
    features: ['Custom design, hand-coded', 'Mobile-first, fast', 'Calls, quote and booking paths', 'Local SEO basics', 'You approve before final payment'],
    cta: 'Start a launch build',
  },
  {
    id: 'premium',
    name: 'Premium build',
    price: 'From $3,500',
    meta: 'Next.js · conversion-focused',
    copy: 'A premium website system for brands that need trust, clarity and a serious first impression.',
    features: ['Everything in Launch', 'Deeper strategy and copy', 'Service and area pages', 'Structured data and analytics', 'Booking and lead flows wired in'],
    cta: 'Talk about a premium build',
    featured: true,
  },
  {
    id: 'ai',
    name: 'AI operations',
    price: '$5,000 – $15,000+',
    meta: 'Retainer $750 – $2,500/mo',
    copy: 'Automate intake, qualification, pricing, booking and proposals so no lead slips through after hours.',
    features: ['Smart intake and lead triage', 'Instant proposal links', 'SMS and CRM routing', 'Booking automation', 'Retainer tied to measurable savings'],
    cta: 'Scope an AI system',
  },
] as const

export const carePlans = [
  { price: '$300', name: 'Site Care', copy: 'We keep the website online, protected and handled.', features: ['Managed hosting', 'Security and backups', 'Routine content updates'] },
  { price: '$500', name: 'Website + Leads Plan', copy: 'For established home-service shops: steady local SEO and site improvements aimed at more calls and quote requests.', features: ['Everything in Site Care', 'Local SEO maintenance', 'Monthly site improvements'], featured: true },
  { price: '$700', name: 'Growth Partner', copy: 'Active SEO, content support and closer attention.', features: ['Everything in Website + Leads Plan', 'Ongoing SEO and content', 'Priority updates and support'] },
] as const

export const roi = {
  label: '[04 // THE BUSINESS CASE]',
  title: 'A clearer website can pay for itself.',
  copy: 'The exact return depends on your traffic, service value and sales process — we never promise results we cannot prove. But the math is simple.',
  defaults: { jobValue: 500, extraCustomers: 2 },
  benefits: ['Clear services and pricing direction', 'Faster quote, call or booking paths', 'Less time explaining the basics manually'],
} as const

export const faqs = [
  { q: 'Why hand-coded Next.js instead of a free website builder?', a: 'Speed, security and zero platform limitations. Free builders load heavy scripts and plugins that slow your site and hurt your mobile score. Hand-coded Next.js is lean, fast and built to rank — and you own it.' },
  { q: 'How long does it take to launch?', a: 'A launch build runs on a seven-day sprint once scope and direction are clear. Larger premium or AI projects are scoped on the call with a timeline you agree to before paying anything.' },
  { q: 'How does payment work?', a: '50% reserves your build and starts the sprint. You approve the finished site before paying the remaining 50%. Monthly care plans are optional and begin only after launch.' },
  { q: 'What does a monthly care plan cover?', a: 'Fast managed hosting, security updates, backups and content changes — just text us what you need updated. Higher plans add local SEO maintenance and ongoing improvements.' },
  { q: 'Is OrbitBoyzz the same as Orbit Websites?', a: 'Yes. OrbitBoyzz is the domain and brand handle for Orbit Websites, a Plainsboro, NJ website design and AI operations studio.' },
  { q: 'Where is Orbit Websites based?', a: 'Plainsboro, NJ. We serve businesses across Central New Jersey, including Princeton, West Windsor, Ewing, Hamilton, Lawrence, Robbinsville and Trenton.' },
  { q: 'What kinds of businesses do you build for?', a: 'Established home-service businesses: HVAC, plumbing, electrical, roofing, landscaping, remodeling and other contractors where one booked job is worth hundreds or thousands of dollars.' },
  { q: 'Do you guarantee Google rankings?', a: 'No one can honestly promise rankings. We build strong local SEO foundations and clean structure that search engines reward, so your site is built the right way from day one.' },
  { q: 'What is the AI operations tier?', a: 'A build ($5,000–$15,000+) plus an optional retainer ($750–$2,500/mo) for businesses that want automated intake, lead qualification, instant proposals, booking and routing. We recommend it only when it replaces measurable admin labor or recovers high-intent leads.' },
] as const

export const about = {
  label: '[ABOUT]',
  title: 'A small studio that builds like a big one.',
  copy: [
    'Orbit Websites is a Plainsboro, NJ web design and AI operations studio. You talk to the builder, not a sales floor.',
    'We hand-code every site on Next.js, Tailwind and Vercel — the same stack used by the fastest companies on the web — and we wire it around how your business actually takes on work: calls, quotes, bookings.',
    'We are a new brand with premium standards. We do not invent case studies or reviews; our proof is the work, the offer and the speed at which we deliver.',
  ],
} as const
