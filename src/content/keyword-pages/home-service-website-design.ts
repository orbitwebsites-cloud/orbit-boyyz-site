import { SEO_PLANS_SENTENCE, type KeywordPage } from './types'

// Primary keyword: "home service website design" (320/mo US, KD 7), with "home service web design" (320, KD 7).
// This is the hub: the renderer adds the "Pick your trade." grid of every trade page right under the
// direct answer, so the body covers the shared pattern and the smaller trades that have no page of their
// own: cleaning (480), home builders (210), pest control (140), moving (140), tree service (110),
// pressure washing (110), handyman (70) and junk removal (70).
// Angle (2026-10-16): the ranking pages are generic checklists (Scorpion, WebFX, Marketing Vines),
// WordPress agency pages, or portfolios built on case-study numbers and big-brand examples. None of them
// explain how the site should change by trade or show the license each trade has to display.
// The homepage title is "Home-Service Website Design in NJ"; keep this page about the trade-by-trade view.
// NJ licensing facts used below were checked on 2026-10-16 against the NJ Division of Consumer Affairs
// (home improvement contractors, public movers), the NJ Board of Tree Experts and the NJDEP Pesticide
// Control Program.
export const homeServiceWebsiteDesign: KeywordPage = {
  path: '/home-service-website-design',
  primaryKeyword: 'home service website design',
  secondaryKeywords: [
    'home service web design',
    'cleaning company website',
    'home builder website design',
    'pest control website design',
    'moving company web design',
    'tree service website design',
    'pressure washing website design',
    'handyman website design',
    'junk removal website design',
    'contractor website',
    'contractor website examples',
  ],

  title: 'Home Service Website Design for Every Trade | Orbit Websites',
  description:
    'Home service website design by trade: plumbing, HVAC, roofing, cleaning, pest control, tree work, moving and more, hand-coded by a Plainsboro, NJ studio.',
  name: 'Home-service website design',
  serviceType: 'Website design for home-service businesses',
  breadcrumbs: [],

  hero: {
    label: '[WEB DESIGN // HOME SERVICES]',
    h1: ['', 'Home service website design', ', trade by trade.'],
    intro:
      'Home service website design for the trades that keep a house running: plumbing, HVAC, electrical, roofing and landscaping, plus cleaning, pest control, tree work, moving, junk removal and handyman jobs. Orbit Websites is a small studio in Plainsboro, NJ. We hand-code each site around how your customers hire you: a call now, a quote first, or a booking that repeats.',
  },

  directAnswer: {
    question: 'What should a home service website include?',
    answer:
      'A home service website should keep a tap-to-call button on every page, give each main service its own page, name the towns you really cover, and show proof such as your license number, insurance and real job photos. Then match the main button to how your trade gets hired: a call for urgent work, a quote form for bigger jobs, and online booking for recurring visits.',
  },

  sections: [
    {
      id: 'how-customers-hire',
      heading: 'Three ways customers hire a home-service business',
      paragraphs: [
        'Most trades follow one of three patterns, and the pattern decides what the top of every page should do. Urgent work, like a burst pipe, a dead furnace or a tree on the garage, comes in by phone, and the customer calls whoever answers first. Planned big-ticket work, like a new roof, a remodel or a move, gets compared, so the site has to explain the job and collect details before you price it.',
        'Recurring work, like house cleaning, lawn care and quarterly pest service, is a relationship. The customer wants to know what a visit includes, how often you come and how to book or reschedule without a phone call. Plenty of businesses do two of these at once, such as a plumber who also replaces water heaters, so each kind of job gets its own path instead of one generic contact page.',
        'Good home service web design starts with that question, not with a template for your trade: which jobs pay best, and how do they usually come in?',
      ],
      bullets: {
        title: 'The main button, by kind of job',
        items: [
          'Urgent repairs: a call button that stays on screen',
          'Big planned jobs: a quote form with photo upload',
          'Recurring visits: booking with a how-often choice',
          'Commercial work: its own contact path',
          'After hours: a form that says when you call back',
        ],
      },
    },
    {
      id: 'main-trades',
      heading: 'Plumbers, HVAC, electricians, roofers and landscapers',
      paragraphs: [
        'These five trades have their own pages, in the grid above, because each has its own mix of urgent and planned work. Plumbing and HVAC sites put emergency calls next to big installs like water heaters and new systems. Electrician sites separate quick repairs from panel upgrades, EV chargers and generators. Roofing sites lean on photos, inspections and the questions people ask after a storm. Landscaping and lawn care sites mix weekly service with one-time design and install projects.',
        'General contractors, remodelers, painters and garage door companies follow the planned-work pattern. A good contractor website gives each service its own page, shows real finished jobs with the town named, and uses a quote form that asks about scope, timing and photos. In New Jersey, home improvement contractors register with the Division of Consumer Affairs, and the law requires the registration number in advertising, so it belongs in your site’s footer.',
      ],
    },
    {
      id: 'cleaning-pest-control-pressure-washing',
      heading: 'Websites for cleaning, pest control and pressure washing',
      paragraphs: [
        'A cleaning company website has to answer three questions quickly: what a standard clean includes, what a deep or move-out clean adds, and how you set the price, whether by bedrooms and bathrooms, square footage or the hour. The booking form asks for home size, how often, pets and the first date that works. If your cleaners are insured or bonded, or the same cleaner comes every visit, say so beside the form. Someone letting a stranger into their home is looking for exactly that.',
        'Pest control website design works best organized by pest: termites, mice and rats, ants, bed bugs, mosquitoes, each with a page that explains the treatment and how many visits it usually takes. Separate one-time treatments from service plans, and answer the safety question parents and pet owners always ask in plain words. New Jersey licenses pesticide applicator businesses through the Department of Environmental Protection, so show that license number. If you do wood-destroying insect inspections for home sales, give them their own page for buyers and agents.',
        'A pressure washing website sells on before-and-after photos, so put them on the homepage and every service page instead of in a gallery nobody opens. Split services by surface, such as house washing, driveways and concrete, decks and fences, and roofs, and explain when you soft wash instead of using high pressure. A quote form with photo upload and rough square footage lets you send a price range before you drive out.',
      ],
      bullets: {
        title: 'What a booking form asks',
        items: [
          'Home size, rooms or square footage',
          'How often: once, weekly, monthly or quarterly',
          'Which pest, surface or rooms are involved',
          'Photos straight from the phone',
          'Pets, gate codes and parking notes',
          'The first date that works',
        ],
      },
    },
    {
      id: 'moving-junk-removal-handyman',
      heading: 'Websites for movers, junk removal and handymen',
      paragraphs: [
        'Moving company web design is mostly about the estimate form. Ask for the move date, both addresses, home size, stairs or elevators, and big or fragile items like a piano or a safe, so your estimate starts from facts instead of phone tag. Keep local and long-distance moves on separate pages. People check movers before handing over everything they own: interstate movers need a USDOT number from the FMCSA, and New Jersey licenses movers through the Division of Consumer Affairs. Show the numbers that apply to you.',
        'A junk removal website should answer the price question first. Explain how you charge, whether by how much of the truck the load fills, by the item or by the hour, and if you price by volume, show what a quarter, half and full load look like. A photo-upload form lets you send a range before you book the truck. List what you won’t take, such as paint, chemicals or tires, and only mention donating or recycling if you really do it.',
        'A handyman website wins by being specific. List the jobs you take, like drywall patches, doors, shelving, caulking and TV mounting, and the ones you send elsewhere, such as work that needs a licensed electrician or plumber. Say whether you have a minimum charge or bill by the hour or by the job. Most handyman work in New Jersey counts as home improvement, so your registration number belongs on the site too.',
      ],
      bullets: {
        title: 'What a good estimate form collects',
        items: [
          'Addresses, dates and access: stairs, elevators, parking',
          'Photos or a short video of the items or the job',
          'Big, heavy or fragile items',
          'Home, office or storage unit',
          'The best time and way to reach them',
        ],
      },
    },
    {
      id: 'tree-service-home-builders',
      heading: 'Websites for tree services and home builders',
      paragraphs: [
        'Tree work is expensive and dangerous, and customers know it, so a tree service website has to show you are insured and qualified before anyone asks. Put proof of insurance near every quote form and name any ISA Certified Arborist on your crew. In New Jersey, a tree care business must register with the Board of Tree Experts and employ at least one Licensed Tree Expert or Licensed Tree Care Operator, so show your registration. Give storm damage its own page with a call button, separate from planned removals, pruning and stump grinding.',
        'A home builder website is a different project from the rest of this page. Buyers take months to decide, so the site works as a portfolio and a guide: finished homes with real photos, plans or available lots if you build on spec, and a plain walk-through of the process from design and permits to move-in. The inquiry form asks about land, timeline and budget range, so your first meeting is with someone ready to build. We’ll tell you on the first call whether your project fits the way we work.',
      ],
      bullets: {
        title: 'Proof people check on big jobs',
        items: [
          'Liability and workers’ comp insurance',
          'License or registration numbers, and who issued them',
          'Real photos of your crew, equipment and finished work',
          'Certifications you really hold',
          'Warranty terms, if you put them in writing',
        ],
      },
    },
  ],

  includes: {
    heading: 'What a home-service website from Orbit includes.',
    intro: 'The trade changes the pages and the forms. Most of this list comes with every build; the card marked Premium is what a premium build adds.',
    items: [
      ['Tap-to-call on every page', 'Your number stays in reach on phones, with a call button in the header and beside every form.'],
      ['A path for each kind of job', 'Call, quote and booking paths matched to how customers hire your trade, with requests sent to the inbox you choose.'],
      ['Premium: service and town pages', 'Premium builds add a page for each job you want more of and each core town, with structured data, analytics, and booking wired into the tool you already use.'],
      ['Your license and proof, up front', 'License or registration numbers, insurance details and real job photos, placed where customers decide instead of buried on an about page.'],
      ['Hand-coded and fast', 'Built in Next.js, mobile-first, with local SEO basics and no page builder or plugin stack to keep patching.'],
      ['Yours to keep', 'You approve the finished site before the final payment, and then it is yours. Hosting with us is optional.'],
    ],
  },

  examples: {
    heading: 'Home-service website examples by trade.',
    intro:
      'Five demo homepages for made-up companies with fictional 555 numbers, not client sites: plumbing, heating and cooling, electrical, roofing and landscaping. There is no demo yet for cleaning, pest control, moving or the other trades on this page. The same layout ideas carry over, and your site is designed from scratch either way.',
    demos: [
      'sample-plumbing-co-ewing',
      'sample-hvac-co-hamilton',
      'sample-electric-west-windsor',
      'sample-roofing-co-lawrence',
      'sample-landscaping-co-princeton',
    ],
  },

  process: {
    heading: 'How a home-service website gets built.',
    intro: 'The same five steps for every trade, and you talk to the people building your site from the first call to launch.',
  },

  pricing: {
    question: 'How much does a home-service website cost?',
    lead: 'The trade matters less than the scope: how many service and town pages you need, whether we write the copy from scratch, and whether you want online booking or AI intake.',
  },

  faqHeading: 'What home-service owners ask before hiring us.',
  faqs: [
    [
      'Do you build websites for cleaning, pest control, moving and other trades?',
      'Yes, when the business fits how we work. Beyond the five trades with their own pages, we also take on remodelers, painters, tree services, and pest control, garage door and pressure washing companies. Cleaning companies, movers, junk removal and handyman businesses are welcome to book a call too: the fit depends on what a booked job is worth and how you take on work, not on the trade, and we will say plainly on the first call if it is not a fit. The process and pricing tiers are the same for every trade.',
    ],
    [
      'Is a website builder good enough for a small home-service business?',
      'Sometimes. If you are just starting out with one truck, a simple builder site with your number, services and towns beats having nothing. A custom site starts to make sense when one booked job is worth hundreds or thousands of dollars and a slow or confusing site is costing you calls. We hand-code in Next.js, and you own the code.',
    ],
    [
      'Which home-service trades should publish prices online?',
      'The trades where most jobs look alike: a standard house clean priced by bedrooms and bathrooms, junk removal by the load, a driveway wash by square footage. A starting price there helps people decide before they call. Roofing, tree removal, remodeling and new builds change too much from one job to the next, so those sites explain what moves the price and ask for photos with the quote request.',
    ],
    [
      'How many pages does a home-service website need?',
      'Fewer than most people expect at the start. A homepage, a page for each of the three to six services that pay best, a service-area page, an about page with your license and insurance, and a quote or contact page cover most businesses. Add town pages only where you have something specific to say, because pages that just swap in a town name help nobody.',
    ],
    [
      'What should I look for in contractor website examples?',
      'Skip the screenshots and open the live site on your phone. Count the taps to the phone number, to the list of services and to the towns covered, then fill in the quote form and see how many questions it asks. Look for a license or registration number too. A good-looking site that hides those things still loses calls. Our demos are fictional samples, so judge the layout, not the business.',
    ],
    [
      'Can customers book online, or should everything go through the phone?',
      'It depends on the job. Recurring work like cleaning, lawn care and pest service suits online booking, while urgent repairs should still lead with a call button. Premium builds include booking and lead flows wired in. AI intake that sorts requests and texts you a summary is optional and costs more, so we only suggest it when it replaces admin work or recovers leads you are losing now.',
    ],
    [
      'Will a new website get my business to the top of Google?',
      `Not on its own, and nobody can honestly guarantee rankings. We don’t. A new site gives you the foundations: fast pages, your services and towns named clearly, and real answers to the questions people search, with a page for each core service and town plus structured data on premium builds. ${SEO_PLANS_SENTENCE}`,
    ],
  ],

  related: {
    posts: ['home-service-website-structure', 'custom-web-design-vs-wix-squarespace', 'local-business-website-checklist-2026'],
    links: [
      ['Check your current site for free', '/free-website-check'],
      ['Get a rough price range', '/quote'],
      ['Refresh the site you already have', '/services#refresh'],
      ['AI intake and booking', '/services#ai-operations'],
    ],
  },

  cta: {
    title: 'Let’s build the website your trade needs.',
    copy: 'Book a free call and tell us which jobs and towns you want more of. You talk directly with the people who build the site.',
  },
}
