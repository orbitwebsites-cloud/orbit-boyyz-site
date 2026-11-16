// Copy for leads.orbitboyzz.com (src/app/leads/page.tsx).
// Facts only: the offer exactly as stated here. Lead lists in one niche, built
// from Google Maps listings and each business's own website, the owner's name
// where public sources show it, every email verified, the business phone
// included. It starts with a free 30-minute call (/book-leads): there is no
// free sample of leads any more, so never offer one.
// Never add: exclusivity, prices or price comparisons, guarantees, results
// promises (reply rates, meetings, revenue), bounce replacement (not a policy
// yet), urgency or scarcity, or medical, dental or legal niches in examples.

export const leadsContact = {
  brand: 'Orbit Boyzz',
  email: 'alex@orbitboyzz.com',
  address: '2401 Deer Creek Drive, Plainsboro, NJ 08536',
} as const

/** The no-risk line, shown next to every booking button. */
export const leadsNoRisk = 'Free 30-minute call. Nothing to sign or pay on it.'

export const leadsHero = {
  eyebrow: 'Verified lead lists for outbound agencies',
  /** Screen-reader H1: the visual headline (line1 + line2) is aria-hidden. */
  srHeadline: 'Verified lead lists for outbound agencies, built for your client’s niche',
  line1: 'Your niche.',
  line2: 'Verified leads.',
  sub: 'Tell us a niche and an area. We build the list from Google Maps listings and each business’s own website, verify every email and send it to you as a sheet.',
  cta: 'Book a call',
  ctaShort: 'Book a call',
  secondary: 'How we verify',
  chips: ['Every email verified', 'Business phone included', 'Built for your niche and area'],
} as const

/**
 * One real row, masked, from the test list built on 2026-10-18
 * (agency-leads/out/samples-test/orbitboyzz-dryrun.test-2026-10-18.csv, row 2:
 * "Google Maps + website; owner email verified"). Business details are the
 * public Google Maps listing; the owner's name, the email and the phone are
 * masked so no full personal data is shown. Swap it only for another real row,
 * masked the same way (j•••@domain, (609) •••-••12, initials for names).
 */
export const leadsSample = {
  badge: 'Real row · masked',
  title: 'One lead, one row',
  context: 'HVAC · New Jersey',
  row: {
    company: 'B••• A•• O•• Heating & Air Conditioning',
    owner: 'M••• M•••',
    title: 'Founder',
    email: 'm•••@b•••••••••.com',
    phone: '(908) •••-••53',
    website: 'b•••••••••.com',
    city: 'Linden, NJ',
    rating: '4.9',
    reviews: '124',
  },
  caption: 'From a test list we built on October 18, 2026. Owner, email and phone are masked here; your sheet has them in full.',
} as const

export const leadsSteps = {
  label: '[01 // VERIFICATION]',
  title: 'How every email',
  titleAccent: 'is verified.',
  intro: 'Stale lists bounce, and every bounce hurts the domain you send from. So each list is built when you ask for it, in three steps.',
  steps: [
    {
      number: '01',
      title: 'Google Maps and the business’s own website',
      copy: 'Each lead starts from the business’s Google Maps listing and its own website.',
    },
    {
      number: '02',
      title: 'The owner, where public sources show it',
      copy: 'We add the owner’s name and title where public sources show them. Where they don’t, the field stays blank.',
    },
    {
      number: '03',
      title: 'Every email verified before delivery',
      copy: 'Every email is checked with a verification service before the sheet ships. Only “valid” counts as verified.',
    },
  ],
} as const

/** Spreadsheet columns, A to I. */
export const leadFields = [
  { key: 'company', label: 'Company', note: 'From Google Maps' },
  { key: 'owner', label: 'Owner name', note: 'Where public sources show it' },
  { key: 'title', label: 'Title', note: 'e.g. Founder, President' },
  { key: 'email', label: 'Verified email', note: 'Only “valid” counts' },
  { key: 'phone', label: 'Business phone', note: 'The listed business line' },
  { key: 'website', label: 'Website', note: 'The business’s own site' },
  { key: 'city', label: 'City / State', note: 'Where the business is' },
  { key: 'rating', label: 'Google rating', note: 'From the listing' },
  { key: 'reviews', label: 'Google reviews', note: 'Number of reviews' },
] as const

export const leadsFieldsSection = {
  label: '[02 // IN EVERY ROW]',
  title: 'What’s in',
  titleAccent: 'every row.',
  note: 'Delivered as a sheet, one row per lead. Owner name and title only where public sources show them. Catch-all and risky addresses are never marked as verified.',
} as const

export const leadsOutreach = {
  title: 'Need the outreach run too?',
  copy: 'We can send it for you from your own domains.',
} as const

export const leadsFaqSection = {
  label: '[03 // QUESTIONS]',
  title: 'Straight answers, before you start.',
} as const

export const leadsFaqs = [
  {
    q: 'How do I start?',
    a: 'Book a free 30-minute call. We go through your niche, your area and how many leads you need, and you leave with a scope and a price.',
  },
  {
    q: 'What if an email bounces?',
    a: 'Every email is verified before the sheet ships, and only addresses that come back “valid” are marked verified. An inbox can still close after it’s checked. If one bounces, reply to the email your sheet came with and tell us which address. We’ll check it.',
  },
  {
    q: 'What niches can I ask for?',
    a: 'Local service businesses with a Google Maps listing and their own website, such as roofers, HVAC, plumbers, landscapers, electricians, home cleaning and auto repair. Tell us the niche and the area on the call.',
  },
] as const

export const leadsRequest = {
  label: '[04 // BOOK A CALL]',
  title: 'Book a call.',
  copy: 'Three quick questions, then pick a time. On the call we go through your niche, your area and how many leads you need.',
  cta: 'Book a call',
  nextLabel: 'What happens after you book',
  next: [
    {
      title: 'We read your answers',
      copy: 'Before the call, so the 30 minutes go to your niche and your numbers.',
    },
    {
      title: 'We scope your list on the call',
      copy: 'The niche, the area, how many leads a month, and what each row has in it.',
    },
    {
      title: 'You leave with a scope and a price',
      copy: 'Then you decide. Nothing is signed or paid on the call.',
    },
  ],
  foot: 'Prefer email? Write to',
} as const
