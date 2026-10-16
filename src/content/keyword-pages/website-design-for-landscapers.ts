import { SEO_PLANS_SENTENCE, type KeywordPage } from './types'

// Primary keyword: "lawn care website design" (260/mo US, KD 7); "lawn care web design"
// (260, KD 8) and "landscaping website design" (210, KD 9) are close seconds.
// The NJ-specific page is /website-design-for-landscaping-companies-nj; this one is
// the general trade page.
// Angle (2026-10-16): seasonal services, recurring maintenance plans and project
// galleries. The ranking pages are agency pages built on client logos, counters and
// testimonials, or long "best examples" lists; few explain how a site should change
// through the season, what a plan sign-up form should ask, or how to caption photos.
export const websiteDesignForLandscapers: KeywordPage = {
  path: '/website-design-for-landscapers',
  primaryKeyword: 'lawn care website design',
  secondaryKeywords: [
    'lawn care web design',
    'landscaping website design',
    'landscaping website',
    'landscaping web design',
    'website for landscaping business',
  ],

  title: 'Lawn Care Website Design for Landscaping Companies',
  description:
    'Lawn care website design from a Plainsboro, NJ studio: seasonal service pages, maintenance plan sign-ups, project galleries and phone-friendly quote forms.',
  name: 'Website design for landscapers and lawn care',
  serviceType: 'Website design for landscaping and lawn care companies',
  breadcrumbs: [['Home-service website design', '/home-service-website-design']],

  hero: {
    label: '[WEB DESIGN // LAWN CARE + LANDSCAPING]',
    h1: ['', 'Lawn care website design', ' for seasonal work and yearly plans.'],
    intro:
      'A spring cleanup, a season of weekly mowing and a new patio are three different sales. Orbit Websites is a small studio in Plainsboro, NJ, and our lawn care website design gives each one its place: service pages that follow the season, a simple way to sign up for a maintenance plan, and project galleries that show your work.',
  },

  directAnswer: {
    question: 'What should a lawn care or landscaping website include?',
    answer:
      'A lawn care or landscaping website should keep the phone number and quote form one tap away, give each main service its own page, feature the services people need this season, explain your maintenance plans and how to sign up, show before-and-after photos of your own work, and list the towns you actually cover. It should also load fast on a phone.',
  },

  sections: [
    {
      id: 'seasonal-services',
      heading: 'A website that changes with the season',
      paragraphs: [
        'Lawn and landscape work runs on a calendar. Cleanups and mulch in early spring, mowing all summer, aeration and overseeding on cool-season lawns as summer ends, leaves in the fall, and snow removal in winter if you plow. A homepage that says the same thing in January as it does in May wastes most of the visits it gets.',
        'So we build the homepage around a seasonal block: the service people are looking for right now, and a short line about booking the next one, such as when fall cleanup spots open. When the season turns, swapping it is a text change, not a redesign. On a monthly care plan you just text us what to change.',
        'If your spring schedule fills up, the site can say so and keep taking requests for the next opening. That beats a voicemail box nobody has time to return in April.',
      ],
      bullets: {
        title: 'What the homepage can feature',
        items: [
          'Early spring: cleanups, mulch, bed edging',
          'Late spring and summer: mowing, trimming, plantings',
          'Late summer into fall: aeration and overseeding',
          'Fall: leaf cleanup and bed cutbacks',
          'Winter: snow removal, if you offer it, and next year’s design projects',
        ],
      },
    },
    {
      id: 'maintenance-plans',
      heading: 'Make the maintenance plan easy to say yes to',
      paragraphs: [
        'Weekly and every-other-week customers are the steady base of many lawn care businesses, yet many landscaping websites bury the plan in one line on a services list. Give it its own page. Say what each visit includes, how often you come, roughly when the season starts and ends, what costs extra (leaf cleanup, mulch, shrub trimming) and how billing and cancelling work, in your own terms.',
        'The sign-up form should ask what you would ask on the phone, so you can price the property without a callback. Many owners price mowing by lot size and frequency. If that is how you work and requests pile up in spring, optional AI intake can send back a price range on standard lots and flag the odd ones for you. It costs more, so we only suggest it when it replaces admin work or recovers leads you are losing now.',
      ],
      bullets: {
        title: 'What the plan sign-up form asks',
        items: [
          'Address and town',
          'Rough lot size, or front yard, back yard or both',
          'Weekly or every other week',
          'When they want to start, and any extras this season',
          'Gates, dogs or areas to skip',
          'The best way to reach them',
        ],
      },
    },
    {
      id: 'project-galleries',
      heading: 'Project galleries that sell the bigger jobs',
      paragraphs: [
        'Nobody books a patio, a retaining wall or a full planting plan from a bullet list. They book it after seeing work like it. A gallery does that job when the photos are honest and easy to follow: before and after shot from the same spot, each project captioned with what was done, the town and the season.',
        'Group projects by type, such as patios and walkways, plantings or cleanups, and put the matching photos on each service page, where someone is deciding, instead of one long grid nobody scrolls. We size and compress every image so the gallery stays fast on a phone.',
        'Use only your own work. Stock photos of perfect lawns are easy to spot, and they tell a customer nothing about your crew. Clear phone photos of real jobs do more than any of them.',
      ],
      bullets: {
        title: 'Gallery details that help',
        items: [
          'Before and after from the same angle',
          'A caption with the job, town and season',
          'Projects grouped by type of work',
          'Photos on the matching service page',
          'Your crew and trucks, not stock images',
        ],
      },
    },
    {
      id: 'customers-and-towns',
      heading: 'Homeowners, property managers and the towns you cover',
      paragraphs: [
        'A homeowner with one lawn and a property manager with six buildings want different things. If you take commercial or HOA work, give it its own page with a bid request form, and say what you handle: mowing, seasonal color, cleanups and snow, if you do it. Property managers often ask for proof of insurance early, so tell them how to get it.',
        'Mowing routes pay best when stops are close together, so the service area matters more than it looks. List the towns you really cover, say where you want more customers, and say where a route is full. A town earns its own page only when you have real jobs, photos and something specific to say about working there.',
        'Show the credentials that apply to you. If you apply pesticides, many states require a license; in New Jersey that is handled by the Department of Environmental Protection. If you build patios or walls for homeowners, check whether your state requires a home improvement registration and how the number must appear in your advertising.',
      ],
      bullets: {
        title: 'Trust details worth showing',
        items: [
          'Insurance, stated plainly',
          'Pesticide or fertilizer credentials, if you apply them',
          'Home improvement registration, where your state requires it',
          'The towns you cover, and any you are full in',
          'Your address, or your service area if you hide it',
        ],
      },
    },
    {
      id: 'seasonal-search',
      heading: 'Getting found before the season starts',
      paragraphs: [
        'People start searching for spring cleanups and mowing before the grass needs cutting, and for aeration and leaf cleanup weeks before the work begins. If the seasonal block changes a few weeks ahead, the homepage already talks about what people are looking for when they arrive. Change it once the phone is already ringing and the busiest weeks start with last season’s message.',
        'Your Google Business Profile matters as much as the site for the map results. Keep your business name and phone number the same on both, link them, and add photos of real jobs through the season, not only in spring. A lot of landscaping web design starts from a builder template and a stack of plugins; ours is hand-coded in Next.js, so photo-heavy pages stay fast on a phone.',
        `Launch builds name your services and towns in clear headings, with local SEO basics. Premium builds add a page for each service you sell and each core service area, structured data and analytics. ${SEO_PLANS_SENTENCE}`,
      ],
    },
  ],

  includes: {
    heading: 'What a landscaping website from Orbit includes.',
    intro: 'Most of this list comes with every build; the card marked Premium is what a premium build adds. Then the site is shaped around the services, plans and towns you want more of.',
    items: [
      ['Tap-to-call on every page', 'Your number stays visible on phones, with a call button in the header and next to every form.'],
      ['Quote and plan sign-up paths', 'A quote form for one-time jobs and a separate sign-up for maintenance plans, sent to the inbox you choose.'],
      ['Premium: seasonal service pages', 'Premium builds add a page for each service you sell and each core service area, with structured data and analytics. Every build features this season’s work on the homepage.'],
      ['Project galleries', 'Before-and-after photos of your own work, captioned and grouped by job type, sized so pages stay fast.'],
      ['Hand-coded and fast', 'Built in Next.js, mobile-first, with local SEO basics and no page builder or plugin stack to keep updating.'],
      ['Yours to keep', 'You approve the finished site before the final payment, and then it is yours. Hosting with us is optional.'],
    ],
  },

  examples: {
    heading: 'A landscaping website example you can click through.',
    intro:
      'This is a demo homepage for a made-up landscaping company with a fictional 555 phone number, not a client site. It shows a service list from mowing to hardscaping, a storm cleanup call block, a service area section and a short FAQ about seasonal plans. When you compare lawn care web design examples, open them on your phone and see how fast you find the number, the plan sign-up and the list of towns.',
    demos: ['sample-landscaping-co-princeton'],
  },

  process: {
    heading: 'How a landscaping website gets built.',
    intro: 'Five steps, with the people building your site at every one. Starting in the off-season means the site is live before spring calls pick up.',
  },

  pricing: {
    question: 'How much does a lawn care or landscaping website cost?',
    lead: 'The price of a website for a landscaping business depends on how many service and town pages you need, how large the project gallery is, whether the copy is written from scratch, and whether you want AI intake that prices standard mowing plans.',
  },

  faqHeading: 'What landscapers and lawn care owners ask us.',
  faqs: [
    [
      'Should lawn care and landscape design be on separate pages?',
      'Usually, yes. A homeowner looking for weekly mowing wants to know what is included, how often you come and how to sign up. Someone planning a patio or a new planting bed wants photos and a sense of the process first. Separate pages, each with its own form, serve both without making either one dig.',
    ],
    [
      'How do I keep my website current from season to season?',
      'Build the homepage around a seasonal block that features the service people need now, plus a line about booking the next one. Changing it is a quick text edit, not a redesign. On a monthly care plan you text us the change and we make it. Update it a few weeks before each season starts, when people begin searching.',
    ],
    [
      'Should my landscaping website show prices?',
      'Weekly mowing on a standard lot is the easiest service to price in public, and a per-visit "starting at" figure sorts out people expecting half the price. Mulch by the yard and spring cleanups can work the same way if your pricing is consistent. Design, patios and walls depend on the property, so explain what moves the price, like size, materials, access and grading, and ask for photos or rough measurements.',
    ],
    [
      'What photos should go on a lawn care website?',
      'Your own work only: before and after shots from the same angle, finished projects, your crew and your trucks. Clear phone photos are fine. Caption each one with the job, the town and the season, and put the photos on the matching service page. Skip stock images, because customers can tell.',
    ],
    [
      'Do I need a page for every town I mow in?',
      'No. For mowing, the towns that matter are the ones that fill your routes, because stops close together pay better than stops spread across the county. List every town you cover, name the ones where you want more customers, and say which routes are full. Write a full town page only where you have real jobs and photos to show, not a copy with the name changed.',
    ],
    [
      'Can customers sign up for a maintenance plan on the website?',
      'Yes. A sign-up form collects the address, lot size, frequency, start date and anything to watch for, then sends it to your inbox so you can confirm the price. If you want a price range sent back automatically, optional AI intake can do that. It costs more, and we only suggest it when it saves real admin time.',
    ],
    [
      'Can you guarantee my lawn care company ranks on Google?',
      'No. Nobody can honestly promise a ranking, and we don’t. Lawn care searches rise and fall with the season, and distance from the person searching is one of the things Google weighs, so towns at the far end of your routes are harder to show up in than the ones near your yard. What helps is a site that names the services and towns you want, a seasonal block that is current before people start searching, and a Google Business Profile with real job photos. After launch, the optional monthly plans add ongoing local SEO.',
    ],
  ],

  related: {
    posts: ['landscaping-company-website-central-nj', 'home-service-website-structure', 'custom-web-design-vs-wix-squarespace'],
    links: [
      ['Check your current site for free', '/free-website-check'],
      ['Get a rough price range', '/quote'],
      ['AI intake for quote and plan requests', '/services#ai-operations'],
    ],
  },

  cta: {
    title: 'Let’s build your landscaping website.',
    copy: 'Book a free call and tell us which services, plans and towns you want more of before the season starts. You talk directly with the people who build the site.',
  },
}
