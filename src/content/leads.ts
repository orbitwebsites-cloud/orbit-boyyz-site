// Copy for leads.orbitboyzz.com (src/app/leads/page.tsx).
// Facts only: the offer exactly as stated here. 25 free leads in one niche,
// built from Google Maps listings and each business's own website, the owner's
// name where public sources show it, every email verified, the business phone
// included, delivered within a few business days.
// Never add: exclusivity, prices or price comparisons, guarantees, results
// promises (reply rates, meetings, revenue), urgency or scarcity, a call or
// calendar step, or medical, dental or legal niches in examples.

export const leadsContact = {
  brand: 'Orbit Boyzz',
  email: 'alex@orbitboyzz.com',
  address: '2401 Deer Creek Drive, Plainsboro, NJ 08536',
} as const

export const leadsHero = {
  eyebrow: 'Verified lead lists for outbound agencies',
  /** Screen-reader H1: the visual headline (line1 + line2) is aria-hidden. */
  srHeadline: 'Verified lead lists for outbound agencies, built for your client’s niche',
  line1: 'Your niche.',
  line2: 'Verified leads.',
  sub: 'Tell us a niche and an area. We build the list from Google Maps listings and each business’s own website, verify every email and send it to you as a sheet. Start with 25 free leads.',
  cta: 'Get 25 free leads',
  ctaShort: 'Free leads',
  secondary: 'How it works',
  chips: ['25 free leads', 'Every email verified', 'Business phone included', 'Delivered within a few business days'],
} as const

export const leadsTicker = [
  '25 free leads in one niche',
  'Built from Google Maps listings',
  'And each business’s own website',
  'Owner name where public sources show it',
  'Every email verified',
  'Business phone included',
  'Delivered as a sheet',
  'Within a few business days',
] as const

export const leadsProblem = {
  label: '[01 // THE PROBLEM]',
  statement: 'Stale data bounces. Owners change, inboxes go dead, and every bounce hurts the domain you send from.',
  accent: ['bounces.', 'dead,', 'hurts'],
  foot: 'So we build each list when you ask for it, from Google Maps listings and each business’s own website, and verify every email before it ships.',
} as const

export const leadsOffer = {
  label: '[02 // THE OFFER]',
  title: 'Verified leads.',
  titleAccent: 'Built for one of your client niches.',
  audience: 'For outbound and lead-gen agencies (cold email, appointment setting) that need local-business leads for their clients.',
  cards: [
    {
      figure: '1',
      unit: 'niche, one area',
      title: 'You choose',
      copy: 'Roofers in Austin, TX. HVAC companies in Mercer County, NJ. Tell us the niche and the area you want.',
    },
    {
      figure: '25',
      unit: 'free leads',
      title: 'Start free',
      copy: 'Built for that niche and area, and delivered as a sheet within a few business days. No call, no card.',
    },
    {
      figure: '9',
      unit: 'columns per lead',
      title: 'In every row',
      copy: 'Verified email, business phone, website and Google reviews, plus the owner’s name and title where public sources show it.',
    },
  ],
  note: 'No call and no card. Just the niche, the area and your work email.',
} as const

export const leadsSteps = {
  label: '[03 // HOW IT WORKS]',
  title: 'From the map',
  titleAccent: 'to your sheet.',
  intro: 'Every list is built for your niche and area, and every email is verified before it ships.',
  steps: [
    {
      number: '01',
      title: 'Find',
      copy: 'We find the businesses in your niche and area on Google Maps, then read each business’s own website.',
    },
    {
      number: '02',
      title: 'Add the owner',
      copy: 'We add the owner’s name and title where public sources show it.',
    },
    {
      number: '03',
      title: 'Verify every email',
      copy: 'Every email is verified before it ships. Only “valid” counts. Catch-all and risky addresses are never marked as verified.',
    },
    {
      number: '04',
      title: 'Deliver',
      copy: 'Your 25 leads arrive as a sheet within a few business days.',
    },
  ],
} as const

/** Spreadsheet columns, A to I. */
export const leadFields = [
  { key: 'company', label: 'Company' },
  { key: 'owner', label: 'Owner name' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Verified email' },
  { key: 'phone', label: 'Business phone' },
  { key: 'website', label: 'Website' },
  { key: 'city', label: 'City / State' },
  { key: 'rating', label: 'Google rating' },
  { key: 'reviews', label: 'Google reviews' },
] as const

export const leadsFieldsSection = {
  label: '[04 // IN EVERY LEAD]',
  title: 'What’s in',
  titleAccent: 'every lead.',
  note: 'Owner name and title are included where public sources show them. An email is marked verified only when it comes back “valid”. Catch-all and risky addresses are never marked as verified.',
} as const

export const leadsOutreach = {
  title: 'Need the outreach run too?',
  copy: 'We can send it for you from your own domains.',
} as const

export const leadsFaqs = [
  {
    q: 'Who is this for?',
    a: 'Outbound and lead-gen agencies (cold email, appointment setting) that need local-business leads for their clients.',
  },
  {
    q: 'Where does the data come from?',
    a: 'Google Maps listings and each business’s own website. We add the owner’s name and title where public sources show it.',
  },
  {
    q: 'How do you verify the emails?',
    a: 'Every email is verified before it ships, and only addresses that come back “valid” count as verified. Catch-all and risky addresses are never marked as verified.',
  },
  {
    q: 'What is in each lead?',
    a: 'Company, owner name and title (where public sources show them), verified email, business phone, website, city/state, Google rating and Google reviews, delivered as a sheet.',
  },
  {
    q: 'Which niches can I ask for?',
    a: 'Local service niches such as roofers, HVAC, plumbers, landscapers, electricians, home cleaning and auto repair. Tell us the niche and the area in the form.',
  },
  {
    q: 'How long does it take?',
    a: 'Your 25 leads arrive by email within a few business days.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. The 25 leads are free. There is no call to book and no card to enter.',
  },
  {
    q: 'How do I start?',
    a: 'Fill in the short form on this page: the niche, the area and your work email.',
  },
  {
    q: 'Who runs this?',
    a: 'Orbit Boyzz, based in Plainsboro, NJ. Email alex@orbitboyzz.com.',
  },
] as const

export const leadsRequest = {
  label: '[06 // START FREE]',
  title: 'Get your free 25.',
  copy: 'Tell us the niche and the area. We’ll build 25 verified leads and email them to you as a sheet within a few business days.',
  small: 'No call · no calendar · no card',
  fields: {
    niche: { label: 'Niche', placeholder: 'e.g. Roofers' },
    area: { label: 'Area (city / state)', placeholder: 'e.g. Austin, TX' },
    email: { label: 'Work email', placeholder: 'you@youragency.com' },
    name: { label: 'Your name', placeholder: 'First and last name' },
    agency: { label: 'Agency', placeholder: 'Your agency' },
  },
  submit: 'Send me 25 free leads',
  fine: 'Only used to build your leads and follow up about them.',
  done: {
    kicker: 'Request received',
    copy: 'Your 25 free leads arrive within a few business days, as a sheet sent to',
    next: 'No call, no calendar. We’ll just email the sheet.',
  },
} as const

/**
 * orbitboyzz.com/qualify (src/app/qualify/page.tsx): the same 25-free-leads
 * request as the leads page's form, on one short page. Same rules as above.
 */
export const leadsQualify = {
  eyebrow: 'Verified lead lists for outbound agencies',
  title: 'Get 25',
  titleAccent: 'free leads.',
  explainer: 'Tell us a niche and an area. We build the list from Google Maps listings and each business’s own website, and verify every email.',
  pointsLabel: 'What you get',
  points: [
    'Each row: company, verified email, business phone, website, city/state, Google rating and Google reviews.',
    'The owner’s name and title, where public sources show them.',
    'Delivered as a sheet within a few business days.',
    'No call and no card. Just the niche, the area and your work email.',
  ],
} as const
