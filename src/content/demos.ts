// Free demo homepages for leads, served at orbitboyzz.com/demo/<slug>.
//
// To add a lead: append ONE object to `demos` below and deploy. Everything else
// (hero copy, services, FAQ, emergency CTA, service area) is generated from the
// trade + town — see src/content/demoCopy.ts and DEMOS.md.
//
// Demo pages are noindex,nofollow and never listed in the sitemap, feed or llms.txt.
// Facts only: never add reviews, ratings, years in business or claims the lead
// hasn't given us. The page shows labeled placeholders for those instead.

export const demoTrades = ['hvac', 'plumbing', 'electrical', 'roofing', 'landscaping', 'remodeling', 'restaurant', 'general'] as const

export type DemoTrade = (typeof demoTrades)[number]

export type DemoBusiness = {
  /** URL segment: /demo/<slug>. Lowercase letters, numbers and hyphens, e.g. 'joes-plumbing-hamilton'. Must be unique. */
  slug: string
  /** Business name exactly as the owner writes it. */
  name: string
  trade: DemoTrade
  /** Town only, e.g. 'Hamilton' — shown as "Hamilton, NJ". */
  town: string
  /** The LEAD's phone, any format, e.g. '(609) 555-0142'. Every call button on their preview uses it. */
  phone: string
  /** Their real services (restaurants: menu favorites). Defaults to the trade's standard list. */
  services?: string[]
  /** One line under the hero headline. Defaults to the trade's copy. */
  tagline?: string
  /** Brand color as hex, e.g. '#0f766e'. Defaults to the trade's color. */
  accent?: string
  /** Nearby towns for the service-area line. Defaults to a Central NJ lookup for `town`. */
  areas?: string[]
}

// Clearly fictional samples (555-01xx numbers are reserved for fiction) so the
// route always has pages to build. Real leads go below them.
export const demos: DemoBusiness[] = [
  {
    slug: 'sample-hvac-co-hamilton',
    name: 'Sample HVAC Co.',
    trade: 'hvac',
    town: 'Hamilton',
    phone: '(609) 555-0142',
  },
  {
    slug: 'sample-electric-west-windsor',
    name: 'Sample Electric LLC',
    trade: 'electrical',
    town: 'West Windsor',
    phone: '609-555-0187',
    tagline: 'Panel upgrades, EV chargers and lighting, done safely and to code.',
    services: ['Panel upgrades', 'EV charger installation', 'Recessed lighting', 'Whole-home surge protection'],
    accent: '#7c3aed',
  },
  {
    slug: 'sample-pizzeria-east-windsor',
    name: 'Sample Pizzeria',
    trade: 'restaurant',
    town: 'East Windsor',
    phone: '(609) 555-0119',
    services: ['Brick-oven Margherita', 'Grandma pie', 'Chicken parm hero', 'Cannoli'],
  },
]

export function getDemo(slug: string) {
  return demos.find((demo) => demo.slug === slug)
}
