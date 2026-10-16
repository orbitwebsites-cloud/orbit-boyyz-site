// Copy for leads.orbitboyzz.com (src/app/leads/page.tsx).
// Facts only: the offer exactly as stated here. No stats, testimonials,
// client logos, results or guarantees beyond it, no prices (they depend on
// volume) and no dashboard.

export const leadsContact = {
  brand: 'OrbitBoyzz',
  email: 'alex@orbitboyzz.com',
  address: '2401 Deer Creek Drive, Plainsboro, NJ 08536',
} as const

export const leadsHero = {
  eyebrow: 'Exclusive verified leads for outbound agencies',
  line1: 'Your list.',
  line2: 'Nobody else’s.',
  sub: 'Clay and Apollo sell the same records to every agency. We build exclusive, verified leads fresh for one of your client niches, and only you get them.',
  cta: 'Get 25 free leads',
  ctaShort: 'Free leads',
  secondary: 'How it works',
  chips: ['25 free leads to start', 'Every email verified', 'One agency per niche', 'Month-to-month'],
} as const

export const leadsTicker = [
  '25 free leads to start',
  '300 for qualified agencies',
  'Built fresh for your niche',
  'Owner name and title',
  'Only “valid” emails count',
  '10 agencies max',
  'One per niche',
  'Month-to-month',
] as const

export const leadsProblem = {
  label: '[01 // THE PROBLEM]',
  statement: 'Clay and Apollo sell the same records to every agency. Your prospects get the same pitch from everyone, and the list burns out.',
  accent: ['same', 'burns', 'out.'],
  foot: 'We do the opposite: a list built fresh for one agency in one niche, that nobody else gets.',
} as const

export const leadsOffer = {
  label: '[02 // THE OFFER]',
  title: 'Exclusive, verified leads.',
  titleAccent: 'Built fresh for one of your client niches.',
  audience: 'For outbound and lead-gen agencies (cold email, appointment setting) that pay for Clay and Apollo.',
  cards: [
    {
      figure: '25',
      unit: 'free leads',
      title: 'Start free',
      copy: 'Built fresh for one of your client niches. Qualified agencies start with 300.',
    },
    {
      figure: '30%',
      unit: 'less, at least',
      title: 'Replace Clay and Apollo',
      copy: 'If they beat what Clay gives you, we replace your Clay and Apollo spend for at least 30% less, or you don’t pay.',
    },
    {
      figure: '10',
      unit: 'agencies max',
      title: 'One per niche',
      copy: 'One agency per niche, so nobody else gets your list. Month-to-month.',
    },
  ],
} as const

export const leadsSteps = {
  label: '[03 // HOW IT WORKS]',
  title: 'From the map',
  titleAccent: 'to your sheet.',
  intro: 'Every list is built fresh for your niche, and every email is verified before it ships.',
  steps: [
    {
      number: '01',
      title: 'Find',
      copy: 'We find the businesses in your niche on Google Maps and on their own websites.',
    },
    {
      number: '02',
      title: 'Identify the owner',
      copy: 'We identify the actual owner of each business, with their name and title.',
    },
    {
      number: '03',
      title: 'Verify every email',
      copy: 'Every email is verified before it ships. Only “valid” counts. Catch-all and risky addresses are never sold as verified.',
    },
    {
      number: '04',
      title: 'Deliver',
      copy: 'Your leads arrive as a sheet.',
    },
  ],
} as const

/** Spreadsheet columns, A to I. */
export const leadFields = [
  { key: 'company', label: 'Company' },
  { key: 'owner', label: 'Owner name' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Verified email' },
  { key: 'phone', label: 'Phone' },
  { key: 'website', label: 'Website' },
  { key: 'city', label: 'City / State' },
  { key: 'rating', label: 'Google rating' },
  { key: 'reviews', label: 'Google reviews' },
] as const

export const leadsFieldsSection = {
  label: '[04 // IN EVERY LEAD]',
  title: 'What’s in',
  titleAccent: 'every lead.',
  note: 'An email is marked verified only when it comes back “valid”. Catch-all and risky addresses are never sold as verified.',
} as const

export const leadsOutreach = {
  title: 'Need the outreach run too?',
  copy: 'We can send it for you from your own domains.',
} as const

export const leadsFaqs = [
  {
    q: 'Who is this for?',
    a: 'Outbound and lead-gen agencies (cold email, appointment setting) that pay for Clay and Apollo today.',
  },
  {
    q: 'Where does the data come from?',
    a: 'We find businesses on Google Maps and on their own websites, then identify the actual owner. Every list is built fresh for your niche.',
  },
  {
    q: 'How do you verify the emails?',
    a: 'Every email is verified before it ships, and only addresses that come back “valid” count. Catch-all and risky addresses are never sold as verified.',
  },
  {
    q: 'Is my list really exclusive?',
    a: 'Yes. We take 10 agencies max, one per niche, so nobody else gets your list.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on volume, and it’s always at least 30% under your current Clay + Apollo spend, or you don’t pay. Start with 25 free leads (300 for qualified agencies).',
  },
  {
    q: 'Is there a long-term contract?',
    a: 'No. It’s month-to-month.',
  },
] as const

export const leadsFinal = {
  label: '[06 // START FREE]',
  title: 'Get your free 25.',
  copy: 'Answer a few quick questions about your agency. We’ll build 25 exclusive, verified leads for one of your client niches, or 300 if you qualify.',
  cta: 'Get 25 free leads',
  small: '10 agencies max · one per niche · month-to-month',
} as const
