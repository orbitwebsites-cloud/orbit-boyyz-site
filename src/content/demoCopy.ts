// Default copy for lead demo homepages (/demo/<slug>), one block per trade.
// Written to be true of any reputable shop in that trade: no ratings, review
// quotes, years in business, license numbers or guarantees — those must come
// from the lead. Copy functions get the lead's name, town and phone.
import type { DemoBusiness, DemoTrade } from './demos'

export type DemoCard = { title: string; copy: string }
export type DemoFaq = { q: string; a: string }
export type DemoContext = { name: string; town: string; phone: string }

type BaseCopy = {
  /** Eyebrow label, e.g. 'Heating & Cooling'. */
  label: string
  /** Used in the tab title: "<name> | <titleLabel> in <town>, NJ". */
  titleLabel: string
  /** Default brand color (white text on it passes WCAG AA). */
  accent: string
  headline: (c: DemoContext) => string
  sub: string
  faqs: (c: DemoContext) => DemoFaq[]
}

export type ServiceTradeCopy = BaseCopy & {
  services: DemoCard[]
  urgent: { eyebrow: string; title: string; copy: (c: DemoContext) => string }
}

export type RestaurantCopy = BaseCopy & {
  menuSections: string[]
  order: { eyebrow: string; title: string; copy: (c: DemoContext) => string }
  promises: DemoCard[]
}

export type ServiceTrade = Exclude<DemoTrade, 'restaurant'>

/** "Why choose us" points shared by every service trade. */
export function servicePromises({ town }: DemoContext): DemoCard[] {
  return [
    { title: 'Upfront pricing', copy: 'You approve the price before any work starts. No surprise charges on the bill.' },
    { title: 'Real arrival windows', copy: 'We give you a time window that means something, and call when we’re on the way.' },
    { title: 'Clean, respectful crews', copy: 'We protect your home while we work and clean up before we leave.' },
    { title: `Local to ${town}`, copy: `We work in ${town} and the towns around it, so help is never far away.` },
  ]
}

/** "How it works" steps in the hero card for service trades. */
export const serviceSteps: DemoCard[] = [
  { title: 'Call us', copy: 'Tell us what’s going on. We’ll ask a few quick questions.' },
  { title: 'Pick a time', copy: 'We’ll find a time that works for your schedule.' },
  { title: 'Get it done right', copy: 'Clear price first, quality work, clean finish.' },
]

export const serviceCopy: Record<ServiceTrade, ServiceTradeCopy> = {
  hvac: {
    label: 'Heating & Cooling',
    titleLabel: 'Heating & Cooling',
    accent: '#1d4ed8',
    headline: ({ town }) => `Heating and cooling you can count on in ${town}.`,
    sub: 'Repairs, tune-ups and new system installs, with upfront pricing and techs who explain the fix before they start.',
    services: [
      { title: 'AC repair', copy: 'Warm air, strange noises or a unit that won’t kick on? We find the problem and fix it right the first time.' },
      { title: 'Furnace & heating repair', copy: 'No heat on a cold night is an emergency. We repair furnaces, boilers and heat pumps of every major brand.' },
      { title: 'New system installation', copy: 'Honest sizing and clear options when it’s time to replace: central air, furnaces, heat pumps and ductless.' },
      { title: 'Seasonal tune-ups', copy: 'A spring and fall check keeps your system efficient, catches small problems early and protects the warranty.' },
      { title: 'Ductless mini-splits', copy: 'Quiet, efficient comfort for additions, finished basements and rooms the ductwork never reached.' },
      { title: 'Indoor air quality', copy: 'Filtration, humidifiers and duct cleaning for cleaner air and fewer allergy days.' },
    ],
    urgent: {
      eyebrow: 'No heat? No AC?',
      title: 'Emergency heating & cooling service',
      copy: ({ name }) => `When your system quits, call ${name} and we’ll get someone out as fast as we can, with a heads-up on the arrival time.`,
    },
    faqs: () => [
      { q: 'How much does an AC or furnace repair cost?', a: 'It depends on the part and the problem. We diagnose first, explain what’s wrong and give you a price before any work starts.' },
      { q: 'Should I repair or replace my system?', a: 'If your system is 12–15 years old, needs frequent repairs or a costly part like a compressor, replacing can save money over time. We’ll give you honest numbers for both options.' },
      { q: 'How often should my system be serviced?', a: 'Twice a year is ideal: the AC in spring and the heating in fall. Regular tune-ups keep efficiency up and catch small issues before they become breakdowns.' },
      { q: 'Do you handle heating and cooling emergencies?', a: 'Yes. If you have no heat or no cooling, call us and we’ll get to you as quickly as we can.' },
    ],
  },
  plumbing: {
    label: 'Plumbing',
    titleLabel: 'Plumber',
    accent: '#0e7490',
    headline: ({ town }) => `Fast, reliable plumbing in ${town}.`,
    sub: 'Leaks, clogs, water heaters and repipes, fixed right by a plumber who shows up on time and prices the job upfront.',
    services: [
      { title: 'Leak repair', copy: 'Dripping faucets, running toilets and hidden pipe leaks found fast and fixed before they cause water damage.' },
      { title: 'Drain cleaning', copy: 'Slow sinks, backed-up tubs and main line clogs cleared, with a camera inspection when the problem keeps coming back.' },
      { title: 'Water heaters', copy: 'Repair and replacement for tank and tankless water heaters, gas or electric.' },
      { title: 'Sewer & water lines', copy: 'Line repairs and replacements, with options that avoid tearing up your whole yard.' },
      { title: 'Fixture installation', copy: 'Faucets, toilets, sinks, disposals and shower valves installed cleanly and to code.' },
      { title: 'Sump pumps', copy: 'New pumps, replacements and battery backups that keep your basement dry.' },
    ],
    urgent: {
      eyebrow: 'Burst pipe? Water where it shouldn’t be?',
      title: 'Emergency plumbing',
      copy: ({ name }) => `Shut off the main water valve, then call ${name} and we’ll get a plumber to you as fast as we can.`,
    },
    faqs: () => [
      { q: 'What should I do if a pipe bursts?', a: 'Shut off the main water valve right away (usually near the water meter or where the line enters the house), then call us. Acting fast keeps the damage down.' },
      { q: 'Why does my drain keep clogging?', a: 'Repeat clogs usually mean buildup deeper in the line, or roots or damage in the sewer pipe. A camera inspection shows exactly what’s going on so you only pay for the right fix.' },
      { q: 'How long does a water heater last?', a: 'A tank water heater usually lasts 8–12 years and a tankless unit can last much longer. If yours is leaking, rusting or running out of hot water early, it may be time to replace it.' },
      { q: 'Do you give a price before starting?', a: 'Yes. We look at the problem, explain your options and give you the price before any work begins.' },
    ],
  },
  electrical: {
    label: 'Electrical',
    titleLabel: 'Electrician',
    accent: '#b45309',
    headline: ({ town }) => `Safe, code-compliant electrical work in ${town}.`,
    sub: 'From flickering lights to full panel upgrades, the job gets done safely, to code, and your home is left cleaner than we found it.',
    services: [
      { title: 'Panel upgrades', copy: 'Replace an old or overloaded panel to safely power today’s appliances, EV chargers and additions.' },
      { title: 'Lighting & fixtures', copy: 'Recessed lighting, ceiling fans, under-cabinet and outdoor lighting, installed and wired right.' },
      { title: 'Outlets & switches', copy: 'New circuits, GFCI and USB outlets, smart switches and dimmers, added where you actually need them.' },
      { title: 'EV charger installation', copy: 'Level 2 home chargers installed on the right circuit, with the permit and inspection handled.' },
      { title: 'Generators & surge protection', copy: 'Whole-home surge protection and generator hookups, ready for the next outage.' },
      { title: 'Troubleshooting & repairs', copy: 'Breakers that keep tripping, dead outlets, buzzing or flickering: tracked down and fixed safely.' },
    ],
    urgent: {
      eyebrow: 'Burning smell, sparks or no power?',
      title: 'Emergency electrical service',
      copy: ({ name }) => `Call ${name} and we’ll get an electrician to you fast. If you see smoke or fire, get out and call 911 first.`,
    },
    faqs: () => [
      { q: 'Why do my breakers keep tripping?', a: 'Usually an overloaded circuit, a short or a failing breaker. Repeated trips are a warning sign, so we find the cause and fix it properly.' },
      { q: 'Do I need a panel upgrade?', a: 'If your panel is 60–100 amps, you’re adding an EV charger or big appliances, or breakers feel warm or buzz, it’s worth a look. We’ll tell you honestly whether you need one.' },
      { q: 'Can you install an EV charger at my home?', a: 'Yes. We check your panel capacity, run a dedicated circuit, pull the permit and make sure it passes inspection.' },
      { q: 'Do you pull permits?', a: 'Yes, whenever the job requires one. Permitted, inspected work protects your home, your insurance and your resale value.' },
    ],
  },
  roofing: {
    label: 'Roofing',
    titleLabel: 'Roofing Contractor',
    accent: '#b91c1c',
    headline: ({ town }) => `Roof repair and replacement in ${town}.`,
    sub: 'Leaks fixed, storm damage handled and new roofs installed with quality materials and a clean job site.',
    services: [
      { title: 'Roof repair', copy: 'Missing shingles, leaks around chimneys and vents, and flashing problems fixed before they spread.' },
      { title: 'Roof replacement', copy: 'Full tear-off and replacement with quality shingles, underlayment and ventilation done right.' },
      { title: 'Storm damage', copy: 'Tarping and repairs after wind and hail, with photos and documentation for your insurance claim.' },
      { title: 'Roof inspections', copy: 'A detailed look at your roof’s condition, with photos, before you buy, sell or after a big storm.' },
      { title: 'Gutters', copy: 'Seamless gutters, guards and downspouts that move water away from your roof and foundation.' },
      { title: 'Siding & trim', copy: 'Siding, soffit and fascia repairs that keep water and pests out.' },
    ],
    urgent: {
      eyebrow: 'Roof leaking right now?',
      title: 'Emergency tarping & leak repair',
      copy: ({ name }) => `Water coming through the ceiling? Call ${name} and we’ll get your roof covered and the damage stopped fast.`,
    },
    faqs: () => [
      { q: 'Do I need a new roof or just a repair?', a: 'Age, the number of leaks and the condition of the decking all matter. Most asphalt roofs last 20–25 years. We inspect it and show you photos so you can decide.' },
      { q: 'Will insurance cover storm damage?', a: 'Often, when the damage came from wind or hail. We document everything with photos and can walk you through the claim.' },
      { q: 'How long does a roof replacement take?', a: 'Most homes take one to two days, weather permitting. We protect your landscaping and clean up every nail when we finish.' },
      { q: 'How do I get an estimate?', a: 'Call us to set up a time. We’ll inspect the roof and give you a written estimate.' },
    ],
  },
  landscaping: {
    label: 'Landscaping',
    titleLabel: 'Landscaping',
    accent: '#15803d',
    headline: ({ town }) => `Beautiful, low-stress yards in ${town}.`,
    sub: 'Lawn care, seasonal cleanups and landscape design, handled by a crew that shows up when it says it will.',
    services: [
      { title: 'Lawn mowing & care', copy: 'Regular mowing, edging, trimming and blowing, so your lawn always looks sharp.' },
      { title: 'Spring & fall cleanups', copy: 'Leaves, branches and debris cleared, beds refreshed and your yard ready for the season.' },
      { title: 'Mulch & planting', copy: 'Fresh mulch, shrubs, perennials and seasonal color that make your home stand out.' },
      { title: 'Landscape design', copy: 'Plans for new beds, walkways and plantings that fit your yard, your style and your budget.' },
      { title: 'Hardscaping', copy: 'Patios, walkways, retaining walls and fire pits built to last.' },
      { title: 'Shrub & hedge trimming', copy: 'Clean shaping and pruning that keeps plants healthy and your property tidy.' },
    ],
    urgent: {
      eyebrow: 'Storm left a mess?',
      title: 'Storm cleanup & fallen limbs',
      copy: ({ name }) => `Downed branches, a blocked driveway, debris everywhere? Call ${name} and we’ll get your property cleared and safe.`,
    },
    faqs: () => [
      { q: 'How often should my lawn be mowed?', a: 'During the growing season, weekly mowing keeps most lawns healthiest. When growth slows down we switch to every other week.' },
      { q: 'When should I book a spring cleanup?', a: 'Late March through April is ideal in New Jersey, before the grass really takes off. Spring schedules fill up fast, so book early.' },
      { q: 'Do you offer seasonal plans?', a: 'Yes. A season-long plan covers mowing, cleanups and mulching so you never have to think about your yard.' },
      { q: 'Can you design a new landscape for my yard?', a: 'Yes. We walk the property with you, talk through ideas and budget, and give you a clear plan and price.' },
    ],
  },
  remodeling: {
    label: 'Remodeling',
    titleLabel: 'Remodeling Contractor',
    accent: '#c2410c',
    headline: ({ town }) => `Kitchens, baths and basements, remodeled right in ${town}.`,
    sub: 'One team from design to final walkthrough, with clear pricing, a real schedule and a clean, respectful crew.',
    services: [
      { title: 'Kitchen remodeling', copy: 'Layouts, cabinets, counters, tile and lighting: a kitchen built around how you actually cook and live.' },
      { title: 'Bathroom remodeling', copy: 'Walk-in showers, tub-to-shower conversions, vanities and tile work built to last.' },
      { title: 'Basement finishing', copy: 'Turn unused space into a family room, office, gym or guest suite.' },
      { title: 'Additions', copy: 'More room without moving: planned, permitted and built to match your home.' },
      { title: 'Flooring', copy: 'Hardwood, luxury vinyl plank and tile installed level, tight and clean.' },
      { title: 'Interior carpentry', copy: 'Trim, built-ins, doors and the custom details that finish a space.' },
    ],
    urgent: {
      eyebrow: 'Water damage or an urgent repair?',
      title: 'Fast repairs when it can’t wait',
      copy: ({ name }) => `Leak-damaged ceilings, soft subfloors or a bathroom out of commission? Call ${name} and we’ll get it safe and back in use quickly.`,
    },
    faqs: () => [
      { q: 'How much does a kitchen or bathroom remodel cost?', a: 'It depends on size, layout changes and finishes. After a walkthrough we give you a detailed, line-by-line estimate so you know exactly what you’re paying for.' },
      { q: 'How long will my project take?', a: 'A bathroom often takes 2–4 weeks and a kitchen 4–8 weeks, depending on scope and materials. You get a written schedule before we start.' },
      { q: 'Do you handle permits?', a: 'Yes. We pull the required permits and schedule inspections so the work is done to code.' },
      { q: 'Can we stay home during the remodel?', a: 'Usually, yes. We set up dust protection, keep the work area contained and clean up at the end of every day.' },
    ],
  },
  general: {
    label: 'Home Services',
    titleLabel: 'Home Repair & Services',
    accent: '#0f766e',
    headline: ({ town }) => `Home repairs and improvements in ${town}, done right.`,
    sub: 'One call for the whole to-do list: repairs, installs and small projects, handled by someone who shows up on time.',
    services: [
      { title: 'Home repairs', copy: 'Sticking doors, drywall holes, loose railings and everything else on the list.' },
      { title: 'Installations', copy: 'TV mounts, shelving, fixtures, blinds and appliances installed securely.' },
      { title: 'Painting', copy: 'Interior rooms, trim and touch-ups with careful prep and clean lines.' },
      { title: 'Carpentry', copy: 'Trim, decks, fences and small builds done with care.' },
      { title: 'Assembly', copy: 'Furniture, playsets and storage put together right the first time.' },
      { title: 'Seasonal maintenance', copy: 'Caulking, gutter clearing and the small jobs that prevent big ones.' },
    ],
    urgent: {
      eyebrow: 'Need it fixed this week?',
      title: 'Quick-turn repairs',
      copy: ({ name }) => `Something broken that can’t wait? Call ${name} and we’ll get you on the schedule as soon as possible.`,
    },
    faqs: () => [
      { q: 'What kinds of jobs do you take?', a: 'Most repairs, installs and small improvement projects around the house. If a job needs a specialist, we’ll tell you so.' },
      { q: 'How do you price jobs?', a: 'You get a clear price before we start, so you know the cost upfront.' },
      { q: 'Can you handle a whole list in one visit?', a: 'Yes. Send us your list and we’ll plan the visit so as much as possible gets done in one trip.' },
      { q: 'How soon can you come out?', a: 'Call us with what you need and we’ll give you the first available time.' },
    ],
  },
}

export const restaurantCopy: RestaurantCopy = {
  label: 'Restaurant',
  titleLabel: 'Restaurant',
  accent: '#be123c',
  headline: ({ town }) => `Great food in the heart of ${town}.`,
  sub: 'Dine in, take out or call ahead. Fresh, made-to-order favorites for lunch, dinner and everything in between.',
  menuSections: ['Appetizers', 'Entrées', 'Sides & salads', 'Desserts & drinks'],
  order: {
    eyebrow: 'Hungry?',
    title: 'Call ahead for pickup',
    copy: ({ name }) => `Skip the wait: call ${name} to order and it’ll be ready when you walk in.`,
  },
  promises: [
    { title: 'Made to order', copy: 'Every dish is cooked fresh when you order it.' },
    { title: 'Easy pickup', copy: 'Call ahead and your order is ready when you arrive.' },
    { title: 'Groups & parties', copy: 'Feeding a crowd? Call and ask about trays and large orders.' },
  ],
  faqs: ({ phone }) => [
    { q: 'Can I order ahead for pickup?', a: `Yes. Call ${phone} and we’ll have your order ready when you arrive.` },
    { q: 'Do you take reservations?', a: `Call ${phone} to check availability, especially for larger groups and weekends.` },
    { q: 'Do you do large orders for parties?', a: 'Ask us about trays and large orders for parties, offices and family events. Call and we’ll put a menu together.' },
    { q: 'Can you work around allergies?', a: 'Tell us about allergies or dietary needs when you order and we’ll do our best to accommodate.' },
  ],
}

/** "Hamilton, NJ" / "Hamilton Township" → "Hamilton". */
export function cleanTown(town: string) {
  return town.replace(/,?\s*(NJ|New Jersey)\.?$/i, '').trim()
}

/** Lead phone in any format → display "(609) 555-0142" + tel: href. */
export function phoneLink(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const local = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (local.length !== 10) return { display: phone.trim(), href: `tel:${digits}` }
  return { display: `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`, href: `tel:+1${local}` }
}

export function demoCopy(trade: DemoTrade) {
  return trade === 'restaurant' ? restaurantCopy : serviceCopy[trade]
}

/** Their site's tab title, e.g. "Sample HVAC Co. | Heating & Cooling in Hamilton, NJ". */
export function demoTitle(demo: DemoBusiness) {
  return `${demo.name} | ${demoCopy(demo.trade).titleLabel} in ${cleanTown(demo.town)}, NJ`
}

// Nearby towns for the service-area line (Central NJ). Leads elsewhere: set `areas` in demos.ts.
const NEARBY: Record<string, string[]> = {
  hamilton: ['Trenton', 'Robbinsville', 'Lawrenceville', 'Ewing', 'Bordentown', 'West Windsor'],
  trenton: ['Hamilton', 'Ewing', 'Lawrenceville', 'Bordentown', 'Robbinsville'],
  ewing: ['Trenton', 'Lawrenceville', 'Pennington', 'Hopewell', 'Hamilton'],
  lawrence: ['Princeton', 'Ewing', 'Trenton', 'Hamilton', 'Pennington', 'West Windsor'],
  princeton: ['Lawrenceville', 'West Windsor', 'Plainsboro', 'Montgomery', 'Rocky Hill', 'Hopewell'],
  'west windsor': ['Princeton', 'Plainsboro', 'East Windsor', 'Hamilton', 'Lawrenceville', 'Robbinsville'],
  plainsboro: ['West Windsor', 'Princeton', 'Cranbury', 'South Brunswick', 'East Windsor'],
  'east windsor': ['Hightstown', 'West Windsor', 'Robbinsville', 'Cranbury', 'Plainsboro'],
  hightstown: ['East Windsor', 'Cranbury', 'Robbinsville', 'West Windsor', 'Monroe'],
  robbinsville: ['Hamilton', 'East Windsor', 'Hightstown', 'West Windsor', 'Allentown'],
  hopewell: ['Pennington', 'Ewing', 'Lawrenceville', 'Princeton', 'Montgomery'],
  pennington: ['Hopewell', 'Ewing', 'Lawrenceville', 'Princeton'],
  bordentown: ['Hamilton', 'Florence', 'Trenton', 'Mansfield', 'Chesterfield'],
  cranbury: ['Plainsboro', 'Monroe', 'East Windsor', 'South Brunswick', 'Jamesburg'],
  monroe: ['Jamesburg', 'Cranbury', 'Spotswood', 'Old Bridge', 'Hightstown', 'South Brunswick'],
  'south brunswick': ['North Brunswick', 'Plainsboro', 'Cranbury', 'Franklin', 'Monroe', 'Princeton'],
  'north brunswick': ['New Brunswick', 'South Brunswick', 'East Brunswick', 'Milltown', 'Franklin'],
  'new brunswick': ['Highland Park', 'North Brunswick', 'East Brunswick', 'Piscataway', 'Franklin', 'Edison'],
  'east brunswick': ['Milltown', 'South River', 'Spotswood', 'North Brunswick', 'Old Bridge', 'New Brunswick'],
  edison: ['Metuchen', 'Highland Park', 'Woodbridge', 'Piscataway', 'South Plainfield', 'New Brunswick'],
  piscataway: ['Edison', 'Highland Park', 'New Brunswick', 'South Plainfield', 'Dunellen', 'Middlesex'],
  woodbridge: ['Edison', 'Carteret', 'Perth Amboy', 'Rahway', 'Metuchen', 'Sayreville'],
  'old bridge': ['Sayreville', 'East Brunswick', 'Matawan', 'Spotswood', 'Monroe', 'Marlboro'],
  sayreville: ['South Amboy', 'Old Bridge', 'Perth Amboy', 'South River', 'East Brunswick'],
  montgomery: ['Princeton', 'Rocky Hill', 'Hillsborough', 'Franklin', 'Hopewell'],
  hillsborough: ['Somerville', 'Montgomery', 'Manville', 'Branchburg', 'Bridgewater', 'Raritan'],
  bridgewater: ['Somerville', 'Raritan', 'Bound Brook', 'Branchburg', 'Warren', 'Hillsborough'],
  somerville: ['Bridgewater', 'Raritan', 'Branchburg', 'Hillsborough', 'Manville'],
  franklin: ['New Brunswick', 'North Brunswick', 'South Brunswick', 'Hillsborough', 'Manville', 'Bound Brook'],
  freehold: ['Manalapan', 'Marlboro', 'Howell', 'Colts Neck', 'Englishtown'],
  manalapan: ['Freehold', 'Englishtown', 'Marlboro', 'Monroe', 'Millstone'],
  marlboro: ['Manalapan', 'Freehold', 'Holmdel', 'Old Bridge', 'Matawan', 'Colts Neck'],
}

// Village / CDP names that sit inside a township above.
const ALIASES: Record<string, string> = {
  lawrenceville: 'lawrence',
  mercerville: 'hamilton',
  yardville: 'hamilton',
  'princeton junction': 'west windsor',
  'kendall park': 'south brunswick',
  'monmouth junction': 'south brunswick',
  somerset: 'franklin',
  skillman: 'montgomery',
  'belle mead': 'montgomery',
  titusville: 'hopewell',
}

const townKey = (town: string) =>
  cleanTown(town)
    .toLowerCase()
    .replace(/\s+(township|twp\.?)$/, '')
    .trim()

/** Neighbors for "Serving <town> and …": `areas` override, else the lookup, else none. */
export function nearbyTowns(demo: DemoBusiness): string[] {
  if (demo.areas?.length) return demo.areas
  const key = townKey(demo.town)
  return (NEARBY[ALIASES[key] ?? key] ?? []).filter((t) => townKey(t) !== key)
}
