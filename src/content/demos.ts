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
  // Home-service leads with an email (Central NJ, verified no website). Facts used: name, trade, town, phone.
  {
    slug: 'p-c-brower-plumbing-heating-hamilton',
    name: 'P C Brower Plumbing & Heating',
    trade: 'hvac',
    town: 'Hamilton',
    phone: '(609) 439-0033',
  },
  {
    slug: 'century-plumbing-heating-cream-ridge',
    name: 'Century Plumbing & Heating',
    trade: 'hvac',
    town: 'Cream Ridge',
    phone: '(609) 286-2335',
  },
  {
    slug: 'hackneys-heating-service-lambertville',
    name: "Hackney's Heating Service",
    trade: 'hvac',
    town: 'Lambertville',
    phone: '(609) 397-2877',
  },
  {
    slug: 'kd-heating-and-air-conditioning-south-plainfield',
    name: 'KD Heating and Air Conditioning',
    trade: 'hvac',
    town: 'South Plainfield',
    phone: '(732) 476-8090',
  },
  {
    slug: 'all-american-advanced-air-vent-mount-holly',
    name: 'All American Advanced Air Vent',
    trade: 'hvac',
    town: 'Mount Holly',
    phone: '(609) 581-4770',
  },
  {
    slug: 'mdm-fajardo-sons-roofing-trenton',
    name: 'MDM Fajardo Sons Roofing',
    trade: 'roofing',
    town: 'Trenton',
    phone: '(609) 571-1414',
  },
  {
    slug: 'clemens-john-sons-roofing-siding-edison',
    name: 'Clemens John & Sons Roofing & Siding',
    trade: 'roofing',
    town: 'Edison',
    phone: '(732) 548-5435',
  },
  {
    slug: 'karcher-richard-watchung',
    name: 'Karcher Richard',
    trade: 'roofing',
    town: 'Watchung',
    phone: '(908) 754-1812',
  },
  {
    slug: 'len-pizzolato-iii-bathroom-remodeling-belle-mead',
    name: 'Len Pizzolato III Bathroom Remodeling',
    trade: 'plumbing',
    town: 'Belle Mead',
    phone: '(908) 874-7997',
    tagline: 'Plumbing repairs and bathroom and kitchen remodeling in Belle Mead and the surrounding area, with a clear price before any work starts.',
    services: ['Plumbing repairs', 'Bathroom remodeling', 'Kitchen remodeling'],
  },
  {
    slug: 'brower-plumbing-heating-trenton',
    name: 'Brower Plumbing & Heating',
    trade: 'plumbing',
    town: 'Trenton',
    phone: '(609) 989-1155',
  },
  {
    slug: 'easy-flow-drain-cleaning-south-plainfield',
    name: 'Easy Flow Drain Cleaning',
    trade: 'plumbing',
    town: 'South Plainfield',
    phone: '(908) 239-1486',
    services: ['Drain cleaning', 'Leak repair', 'Water heaters', 'Sewer & water lines', 'Fixture installation', 'Sump pumps'],
  },
  {
    slug: 'moores-construction-home-improvement-princeton',
    name: "Moore's Construction & Home Improvement",
    trade: 'remodeling',
    town: 'Princeton',
    phone: '(609) 924-6777',
  },
  {
    slug: 'aguilars-construction-new-brunswick',
    name: "Aguilar's Construction",
    trade: 'remodeling',
    town: 'New Brunswick',
    phone: '(732) 207-2412',
  },
  {
    slug: 'asap-remodeling-contractors-bordentown',
    name: 'ASAP Remodeling Contractors',
    trade: 'remodeling',
    town: 'Bordentown',
    phone: '(609) 379-6996',
  },
  {
    slug: 'archstone-construction-parlin',
    name: 'Archstone Construction',
    trade: 'remodeling',
    town: 'Parlin',
    phone: '(732) 599-6632',
  },
  {
    slug: 'alfonso-remodeling-parlin',
    name: 'Alfonso Remodeling',
    trade: 'remodeling',
    town: 'Parlin',
    phone: '(848) 266-8123',
  },
  {
    slug: 'cartwright-home-repairs-middletown',
    name: 'Cartwright Home Repairs',
    trade: 'general',
    town: 'Middletown',
    phone: '(732) 684-8500',
  },
  {
    slug: 'kontos-landscaping-design-lawrence',
    name: 'Kontos Landscaping & Design',
    trade: 'landscaping',
    town: 'Lawrence',
    phone: '(609) 577-1661',
  },
  {
    slug: 'ds-mozer-tree-service-trenton',
    name: 'DS Mozer Tree Service',
    trade: 'landscaping',
    town: 'Trenton',
    phone: '(609) 585-4356',
    services: ['Tree service', 'Lawn mowing & care', 'Spring & fall cleanups', 'Mulch & planting', 'Landscape design', 'Shrub & hedge trimming'],
  },
  {
    slug: 'm-e-landscaping-edison',
    name: 'M&E Landscaping',
    trade: 'landscaping',
    town: 'Edison',
    phone: '(732) 619-9007',
  },
  {
    slug: 'klm-tree-service-and-landscaping-piscataway',
    name: 'KLM Tree Service and Landscaping',
    trade: 'landscaping',
    town: 'Piscataway',
    phone: '(732) 752-4857',
    services: ['Tree service', 'Lawn mowing & care', 'Spring & fall cleanups', 'Mulch & planting', 'Landscape design', 'Shrub & hedge trimming'],
  },
  {
    slug: 'unique-landscape-design-construction-somerset',
    name: 'Unique Landscape Design & Construction',
    trade: 'landscaping',
    town: 'Somerset',
    phone: '(908) 812-9901',
  },
  {
    slug: 'newsehir-painting-trenton',
    name: 'Newsehir Painting',
    trade: 'general',
    town: 'Trenton',
    phone: '(609) 468-6374',
    tagline: 'Painting in Trenton and the surrounding area, with a clear price before any work starts.',
    services: ['Painting'],
  },
  {
    slug: 'caballero-painting-hillsborough',
    name: 'Caballero Painting',
    trade: 'general',
    town: 'Hillsborough',
    phone: '(908) 392-0712',
    tagline: 'Painting and home improvement in Hillsborough and the surrounding area, with a clear price before any work starts.',
    services: ['Painting', 'Home improvement'],
  },
  {
    slug: 'mr-tees-plus-dunellen',
    name: 'Mr Tees Plus',
    trade: 'landscaping',
    town: 'Dunellen',
    phone: '(732) 529-5454',
    tagline: 'Tree service in Dunellen and the surrounding area, with a clear price before any work starts.',
    services: ['Tree service'],
  },
  // Nearest-to-Plainsboro HVAC / roofing / plumbing / electrical leads without an email.
  {
    slug: 'skillful-plumbing-service-plainsboro',
    name: 'Skillful Plumbing Service',
    trade: 'plumbing',
    town: 'Plainsboro',
    phone: '(609) 297-5431',
  },
  {
    slug: 'pdm-group-hvac-rocky-hill',
    name: 'PDM Group HVAC',
    trade: 'hvac',
    town: 'Rocky Hill',
    phone: '(609) 430-8314',
  },
  {
    slug: 'monair-jamesburg',
    name: 'MonAir',
    trade: 'hvac',
    town: 'Jamesburg',
    phone: '(732) 605-7808',
  },
  {
    slug: 'herkert-edw-j-sons-general-contractors-jamesburg',
    name: 'Herkert Edw J & Sons General Contractors',
    trade: 'roofing',
    town: 'Jamesburg',
    phone: '(732) 521-1340',
  },
  {
    slug: 'gutters-k-w-seemless-helmetta',
    name: 'Gutters K & W Seemless',
    trade: 'roofing',
    town: 'Helmetta',
    phone: '(732) 521-0840',
    services: ['Gutters', 'Roof repair', 'Roof replacement', 'Storm damage', 'Roof inspections', 'Siding & trim'],
  },
  {
    slug: 'mats-sons-north-brunswick',
    name: "Mat's & Sons",
    trade: 'hvac',
    town: 'North Brunswick',
    phone: '(732) 545-7332',
  },
  {
    slug: 'm-j-lacina-plumbing-heating-north-brunswick',
    name: 'M J Lacina Plumbing & Heating',
    trade: 'hvac',
    town: 'North Brunswick',
    phone: '(732) 398-8901',
  },
  {
    slug: 'lightning-mechanical-spotswood',
    name: 'Lightning Mechanical',
    trade: 'hvac',
    town: 'Spotswood',
    phone: '(732) 387-8723',
  },
  {
    slug: 'thomas-mackey-pennington',
    name: 'Thomas Mackey',
    trade: 'plumbing',
    town: 'Pennington',
    phone: '(609) 737-6550',
  },
  {
    slug: 'd-b-roofing-east-brunswick',
    name: 'D & B Roofing',
    trade: 'roofing',
    town: 'East Brunswick',
    phone: '(732) 565-0909',
  },
  {
    slug: 'nek-electric-co-east-brunswick',
    name: 'Nek Electric Co',
    trade: 'electrical',
    town: 'East Brunswick',
    phone: '(732) 251-0813',
  },
  {
    slug: 'bruce-venslavsky-plumbing-heating-ewing',
    name: 'Bruce Venslavsky Plumbing & Heating and Home Improvement',
    trade: 'hvac',
    town: 'Ewing',
    phone: '(609) 581-0307',
  },
  {
    slug: 'born-brothers-plumbing-heating-trenton',
    name: 'Born Brothers Plumbing & Heating',
    trade: 'hvac',
    town: 'Trenton',
    phone: '(609) 392-0523',
  },
  {
    slug: 'sherman-r-c-trenton',
    name: 'Sherman R C',
    trade: 'roofing',
    town: 'Trenton',
    phone: '(609) 587-7832',
  },
  {
    slug: 'swal-builders-trenton',
    name: 'Swal Builders',
    trade: 'roofing',
    town: 'Trenton',
    phone: '(609) 259-0855',
  },
  // Nearest-to-Plainsboro restaurants without a website. Tagline = CSV category + town only.
  {
    slug: 'east-asian-fusion-plainsboro',
    name: 'East Asian Fusion',
    trade: 'restaurant',
    town: 'Plainsboro',
    phone: '(609) 936-8989',
    tagline: 'Korean and Asian food in Plainsboro. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'village-store-plainsboro',
    name: 'Village Store',
    trade: 'restaurant',
    town: 'Plainsboro',
    phone: '(609) 799-8578',
    tagline: 'Your neighborhood deli in Plainsboro. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'juwei-kitchen-plainsboro',
    name: 'Juwei Kitchen',
    trade: 'restaurant',
    town: 'Plainsboro',
    phone: '(929) 262-8430',
    tagline: 'Chinese food in Plainsboro. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'china-chen-princeton',
    name: 'China Chen',
    trade: 'restaurant',
    town: 'Princeton',
    phone: '(609) 951-9188',
    tagline: 'Chinese food in Princeton. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'tasty-tacos-west-windsor',
    name: 'Tasty Tacos',
    trade: 'restaurant',
    town: 'West Windsor',
    phone: '(609) 833-2699',
    tagline: 'Mexican food in West Windsor. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'hunan-chinese-restaurant-princeton',
    name: 'Hunan Chinese Restaurant',
    trade: 'restaurant',
    town: 'Princeton',
    phone: '(609) 921-6950',
    tagline: 'Chinese food in Princeton. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'tigers-deli-princeton',
    name: 'Tiger’s Deli',
    trade: 'restaurant',
    town: 'Princeton',
    phone: '(609) 924-9555',
    tagline: 'Breakfast and deli favorites in Princeton. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'chapin-cuisine-princeton',
    name: 'Chapin Cuisine',
    trade: 'restaurant',
    town: 'Princeton',
    phone: '(609) 924-5772',
    tagline: 'Mexican food in Princeton. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'kalluri-corner-princeton',
    name: 'Kalluri Corner',
    trade: 'restaurant',
    town: 'Princeton',
    phone: '(609) 688-8916',
    tagline: 'Asian food to take out in Princeton. Call ahead and we’ll have your order ready.',
  },
  {
    slug: 'yogorino-princeton',
    name: 'Yogorino',
    trade: 'restaurant',
    town: 'Princeton',
    phone: '(609) 919-0561',
  },
]

export function getDemo(slug: string) {
  return demos.find((demo) => demo.slug === slug)
}
