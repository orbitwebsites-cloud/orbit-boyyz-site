import { SEO_PLANS_SENTENCE, type KeywordPage } from './types'

// Primary keyword: "hvac website design" (480/mo US, KD 14). Close variants: "hvac web design"
// (480, KD 11), "hvac website" (480, KD 24), "hvac website examples". The NJ-specific page is
// /website-design-for-hvac-companies-nj; this one is the general trade page.
// Angle: seasonal demand, maintenance plans and after-hours calls, which the ranking
// competitor pages (agency service pages and "best HVAC websites" galleries) barely cover.
export const websiteDesignForHvacCompanies: KeywordPage = {
  path: '/website-design-for-hvac-companies',
  primaryKeyword: 'hvac website design',
  secondaryKeywords: ['hvac web design', 'hvac website', 'website design for hvac companies', 'hvac website examples'],

  title: 'HVAC Website Design for Busy Seasons and After-Hours Calls',
  description:
    'HVAC website design from a Plainsboro, NJ studio: a fast path for no-heat and no-AC calls, maintenance plan sign-ups and replacement quote forms.',
  name: 'Website design for HVAC companies',
  serviceType: 'Website design for HVAC companies',
  breadcrumbs: [['Home-service website design', '/home-service-website-design']],

  hero: {
    label: '[WEB DESIGN // HVAC]',
    h1: ['', 'HVAC website design', ' for heat waves and cold snaps.'],
    intro:
      'Heating and cooling work comes in two rushes a year, with plenty of calls after hours and quieter months in between. Orbit Websites, a studio in Plainsboro, NJ, does HVAC website design around that rhythm: a fast path for no-heat and no-AC calls, a page that sells maintenance plans in the slow months, and quote forms that bring in replacement jobs with the details.',
  },

  directAnswer: {
    question: 'What should an HVAC website include?',
    answer:
      'An HVAC website should keep the phone number one tap away, give no-heat and no-cooling emergencies their own fast path, separate repair, replacement and tune-up requests, explain your maintenance plan, list the towns you serve, show your license and real photos, and load quickly on a phone. The homepage should lead with heating or cooling, depending on the season.',
  },

  sections: [
    {
      id: 'seasonal-demand',
      heading: 'A website that follows the heating and cooling seasons',
      paragraphs: [
        'HVAC demand follows the weather. The first heat wave of summer brings a rush of AC calls, the first cold snap brings no-heat calls, and spring and fall are quieter in between. A website that says the same thing all year misses the customer who is sweating in July or shivering in January.',
        'So the homepage leads with whatever is urgent right now: cooling repair in summer, heating repair from fall into winter, tune-ups and replacements in the shoulder seasons. Both sides stay on the site all year. On premium builds each system you work on gets its own page, so someone searching for a heat pump or boiler problem lands on a page about that system instead of a list of everything you do.',
        'Changing the seasonal message is a small content update. On a monthly care plan, it is a text to us.',
      ],
      bullets: {
        title: 'Pages worth having',
        items: [
          'AC repair and diagnostics',
          'Furnace and boiler repair',
          'Heat pumps and ductless mini-splits',
          'System replacement and new installs',
          'Seasonal tune-ups and maintenance plans',
          'Indoor air quality, if you offer it',
        ],
      },
    },
    {
      id: 'no-heat-no-cooling',
      heading: 'No heat at 10 pm: the after-hours path',
      paragraphs: [
        'Heating failures do not keep office hours, and a family with no heat in January will usually call the next company if nobody answers. On a phone, the next step should be obvious: one large button that reaches your on-call line or answering service, and a short note on what to check while they wait, such as thermostat batteries and settings, the breaker and a clogged filter. If they smell gas, the page tells them to leave the house and call the gas utility from outside.',
        'Not every evening request is an emergency. A homeowner whose AC is struggling on a hot night can fill out a short form instead, and the request is waiting in the morning with the answers you would otherwise ask for on the phone.',
        'If missed calls are a real cost for you, AI intake can sort true no-heat and no-cooling emergencies from routine requests, text you or your on-call tech a summary, and tell the customer what happens next. It is optional and costs more, so we only recommend it when it would replace admin work or recover leads you are losing now.',
      ],
      bullets: {
        title: 'What the service form asks',
        items: [
          'No heat, no cooling, or running but not keeping up',
          'System type: furnace, boiler, heat pump, central AC or ductless',
          'Rough age of the equipment, plus a photo of the data plate',
          'Whether anyone at home is elderly, an infant or medically vulnerable',
          'Address or town, and whether they are a plan member',
          'Best callback number and time',
        ],
      },
    },
    {
      id: 'maintenance-plans',
      heading: 'A maintenance plan page that fills the slow months',
      paragraphs: [
        'Many HVAC companies sell yearly maintenance agreements: a cooling check in spring, a heating check in fall, and perks such as priority scheduling or a repair discount. Plan members are customers who already chose you, and their tune-ups give the schedule steady work when repair calls slow down.',
        'A plan hidden behind a footer link does not sell. Yours gets its own page in plain words: what each visit covers, how many visits a year, what members get that other customers do not, and the price if you publish one. A short sign-up form collects the address, the equipment and a preferred visit window, and your office confirms and bills the way it already does.',
        'Repair pages and the thank-you page after every form can point back to the plan, so a one-time no-heat call has a clear next step toward becoming a yearly customer.',
      ],
      bullets: {
        title: 'What the plan page covers',
        items: [
          'What happens at the spring and fall visits',
          'Member perks, in plain terms',
          'The price per year or per month, if you publish it',
          'Which systems it covers, and how many units',
          'How to sign up, and how to cancel',
        ],
      },
    },
    {
      id: 'replacement-quotes',
      heading: 'Replacement quotes that arrive with the details',
      paragraphs: [
        'A new furnace, heat pump or central air system is one of the bigger checks a homeowner writes, so they compare companies and read before they call. They want to know what moves the price: system size, efficiency rating, fuel type, ductwork changes and the equipment you install.',
        'A replacement page that explains those factors in plain language, shows real photos of your installs and asks the right questions up front turns a vague “how much for a new AC?” into a request you can price or book for an in-home estimate. If you offer financing or help customers with rebates, it belongs here too, on one page that is easy to update when the details change.',
      ],
      bullets: {
        title: 'What the quote form asks',
        items: [
          'Heating, cooling or both',
          'Current system and fuel: gas, oil, electric or heat pump',
          'Approximate home size and number of floors',
          'Ductwork in place, or rooms without it',
          'Photos of the current equipment',
          'Timeline: failing now, or planning ahead',
        ],
      },
    },
    {
      id: 'judging-examples',
      heading: 'How to judge HVAC website examples',
      paragraphs: [
        'Search for HVAC website examples and you will find galleries of large, polished sites, and many of them look great on a desktop monitor. The test that matters is simpler: open the site on your phone, pretend your furnace just quit, and see how quickly you can call.',
        'Run the same checks on any HVAC web design you are considering, ours included. The demos below are made-up companies, not client sites, built to show the kind of structure we build around.',
      ],
      bullets: {
        title: 'Checks that take five minutes',
        items: [
          'The phone number is tappable without scrolling',
          'Emergency, repair, replacement and tune-up requests have separate paths',
          'Each main system has its own page',
          'The service area names real towns',
          'A license number and real photos are easy to find',
          'The page loads quickly on mobile data',
        ],
      },
    },
  ],

  includes: {
    heading: 'What an HVAC website from Orbit includes.',
    items: [
      ['Tap-to-call on every page', 'The number sits in the header on phones, with a call button beside every form and on the emergency page.'],
      ['Repair, replacement and tune-up paths', 'Separate routes for urgent calls, replacement quotes and maintenance plan sign-ups, sent to the inbox you choose.'],
      ['Premium: heating, cooling and town pages', 'Premium builds add a page for each system you work on and each core town, with structured data and analytics.'],
      ['License and real photos', 'Your license number, insurance details and real photos of installs, trucks and crew, placed where customers decide who to call.'],
      ['Hand-coded in Next.js', 'Mobile-first and fast, with local SEO basics built in and no page builder or plugin stack to keep patching.'],
      ['Yours to keep', 'You approve the finished site before the final payment, and then you own it. Hosting with us is optional.'],
    ],
  },

  examples: {
    heading: 'See a sample HVAC demo.',
    intro:
      'Two demo homepages for made-up companies: a heating and cooling shop, and a plumbing shop, since plenty of companies do plumbing and heating. They show the kind of structure we build around: a no-heat and no-AC call block, service cards for repairs, installs and tune-ups, and a short FAQ. Your own site is designed from scratch.',
    demos: ['sample-hvac-co-hamilton', 'sample-plumbing-co-ewing'],
  },

  process: {
    heading: 'How an HVAC website gets built.',
    intro: 'Five steps, and you speak with the people building your site at every one of them.',
  },

  pricing: {
    question: 'How much does an HVAC website cost?',
    lead: 'The price depends on how many heating, cooling and town pages you need, whether we write the copy from scratch, and whether you want AI intake to sort no-heat calls after hours.',
  },

  faqHeading: 'What HVAC companies ask before hiring us.',
  faqs: [
    [
      'Should an HVAC website change with the seasons?',
      'The homepage should. Lead with cooling repair in summer, heating repair from fall into winter, and tune-ups and replacements in spring and fall. Keep every service page live all year so searches still land in the right place. On a monthly care plan, changing the seasonal message is a routine content update: you text us and we make it.',
    ],
    [
      'What should my website do when someone has no heat at 2 a.m.?',
      'Get them to a person quickly. A large call button should reach your on-call line or answering service, with a short note on what to check while they wait. For requests that can wait until morning, a short form collects the system type, symptoms and address. Optional AI intake can sort emergencies and text you a summary, but it costs more, so we only suggest it when missed calls are a real cost.',
    ],
    [
      'Should I put maintenance plan prices on my website?',
      'If the price is the same for every customer, publishing it lets people sign up without waiting for a callback. If it depends on how many systems they have, show what each plan includes and a starting price, or ask for the equipment on the sign-up form. Either way, give the plan its own page rather than a line on the services list.',
    ],
    [
      'Can the new site be ready before our busy season?',
      'A launch build runs on a seven-day sprint once scope and direction are clear, so the schedule mostly depends on how quickly we have your services, towns, license details and photos. Premium builds and AI intake get a timeline you agree to on the call, before you pay anything. Reviewing a new site is easier in spring or fall than in the middle of a heat wave.',
    ],
    [
      'Where should my HVAC license number go?',
      'In the footer of every page, beside the service and quote forms, and on the about page, so customers never have to ask. Many states license HVAC contractors; in New Jersey, the one to show is the master HVACR license, issued through the state Division of Consumer Affairs. If your technicians hold EPA Section 608 certification for refrigerant work, that is worth listing too.',
    ],
    [
      'Can you guarantee my HVAC company shows up first on Google?',
      `No. Nobody can honestly promise a ranking, and we don’t. HVAC searches swing with the weather, and map results depend partly on how close the customer is to you, so where you show up shifts through the year. What we build is what search engines and AI assistants can read: fast pages, clear headings for each system and town you serve, and real answers to the questions customers ask, with a page for each core system and town on premium builds. ${SEO_PLANS_SENTENCE}`,
    ],
    [
      'We already have a website. Do we need to start over?',
      'Not always. A website refresh keeps the content that still works, such as your service descriptions and photos, and rebuilds the rest: slow pages, a phone number buried below the fold, and one contact form for every kind of request. If you are not sure which you need, the free website check is a good first step.',
    ],
  ],

  related: {
    posts: ['hvac-missed-after-hours-calls', 'hvac-contractor-website-mercer-county-nj', 'home-service-website-structure'],
    links: [
      ['Missed-call text-back for HVAC companies', '/growth'],
      ['Check your current site for free', '/free-website-check'],
      ['Get a price range in 60 seconds', '/quote'],
    ],
  },

  cta: {
    title: 'Let’s build your HVAC website.',
    copy: 'Book a free call and tell us which season stretches your phones the most. You talk directly with the people who build the site.',
  },
}
