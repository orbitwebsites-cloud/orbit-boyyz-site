import { SEO_PLANS_SENTENCE, type KeywordPage } from './types'

// Primary keyword: "seo for contractors" (590/mo US, KD 9). Secondary: "local seo for contractors",
// "seo for plumbers". The ranking pages are step-by-step how-to guides (Comrade's 10 strategies,
// Backlinko's 5 steps) and agency pages that promise page one, so this page leads with a numbered
// checklist and covers the same ground (citations, keywords, tracking) honestly, then the service
// view: local SEO built into a site made for calls, plus the optional $500/$700 plans (prices only via
// SEO_PLANS_SENTENCE). "seo for hvac companies" (390, KD 20) is a separate, HVAC-specific SERP, so it
// is no longer in the title; one FAQ covers it. The site already says nobody can promise rankings.
export const seoForContractors: KeywordPage = {
  path: '/seo-for-contractors',
  primaryKeyword: 'seo for contractors',
  secondaryKeywords: [
    'local seo for contractors',
    'contractor seo',
    'how to do seo for contractors',
    'seo for plumbers',
    'plumbing seo',
    'seo for hvac companies',
    'seo for home service businesses',
  ],

  title: 'SEO for Contractors: 7 Local Search Steps, Plainly Explained',
  description:
    'SEO for contractors in seven plain steps: Google Business Profile, service and town pages, listings, reviews and tracking. From a Plainsboro, NJ studio.',
  name: 'SEO for contractors and home-service companies',
  serviceType: 'Local SEO for contractors',
  breadcrumbs: [['Services', '/services']],

  hero: {
    label: '[LOCAL SEO // CONTRACTORS]',
    h1: ['', 'SEO for contractors', ', built on a website made for calls.'],
    intro:
      'SEO for contractors only pays off when the website turns a search into a phone call. Orbit Websites, a studio in Plainsboro, NJ, hand-codes that website for HVAC, plumbing, electrical, roofing and landscaping companies, builds the local SEO basics in from the start, and offers ongoing local SEO as an optional monthly plan after launch.',
  },

  directAnswer: {
    question: 'What is SEO for contractors?',
    answer:
      'Contractor SEO is the work that helps a local trade business appear when nearby homeowners search for its services, both in Google’s map results and in the regular results below them. It rests on a fast website with a page for each main service and real service area, consistent business details, structured data, a complete Google Business Profile and genuine reviews. Nobody can honestly guarantee rankings.',
  },

  sections: [
    {
      id: 'seven-steps',
      heading: 'Contractor SEO in seven steps',
      paragraphs: [
        'Most local SEO for a contractor is a short list done well and kept up. The steps are in the order we would tackle them, and each one is explained further down this page. None of them is a trick.',
        'The first four are mostly one-time setup. Reviews, new pages and tracking are the ongoing part, and they are the easiest to let slide in a busy season.',
      ],
      bullets: {
        title: 'The seven steps',
        ordered: true,
        items: [
          'Claim and complete your Google Business Profile',
          'Pick the searches that match the jobs you want',
          'Give each main service its own page, and towns only where you work',
          'Keep your name, address and phone the same on every listing',
          'Ask every customer for a review, and reply to them',
          'Keep adding useful pages and real job photos',
          'Check calls, forms and searches every month',
        ],
      },
    },
    {
      id: 'how-local-search-works',
      heading: 'Where homeowners actually find a contractor',
      paragraphs: [
        'Search for “furnace repair near me” or “plumber Hamilton NJ” and Google usually shows two things: a map with a few businesses pinned on it, and the regular list of websites underneath. The map results lean on Google Business Profiles. The list underneath comes from websites. A contractor who wants steady calls from search needs both, and both need to tell the same story.',
        'Google says local results are based mainly on relevance, distance and prominence. You cannot move your shop closer to every customer, so the work goes into the other two: making it obvious what you do and where you do it, and earning the reviews, links and mentions that show you are a real, active business.',
      ],
      bullets: {
        title: 'What Google weighs for local results',
        items: [
          'Relevance: how well your profile and site match the search',
          'Distance: how far you are from the person searching',
          'Prominence: reviews, links and how well known you are',
          'The map results lean on your Google Business Profile',
          'The regular results lean on your website',
        ],
      },
    },
    {
      id: 'choosing-searches',
      heading: 'Picking the searches to target',
      paragraphs: [
        'Start from the jobs, not from a keyword tool. Write down the three to six jobs that pay best or that you want more of, then the words a homeowner would type for each: the service and a town (“water heater replacement Hamilton”), the “near me” version, the emergency version (“no heat”, “roof leak”) and the cost question (“how much is a new furnace”).',
        'Each of those needs an answer somewhere on the site: the service and town in a page heading, the emergency version on a page that leads with the phone number, the cost question on the service page. Google’s own autocomplete, the “People also ask” box and the Search Console report for your site show the words people really use. Skip jobs you don’t do and towns you don’t serve: ranking for them only brings calls you have to turn away.',
      ],
      bullets: {
        title: 'Searches to cover for each job',
        items: [
          'The service plus a town',
          'The service plus “near me”',
          'The emergency version, if you take emergencies',
          'The cost question',
          'The problem in plain words, like “AC blowing warm air”',
        ],
      },
    },
    {
      id: 'built-for-calls',
      heading: 'SEO starts with a website built for calls',
      paragraphs: [
        'Traffic that never turns into a call is just a number in a report. So the site comes first: a phone number one tap away on every page, a quote form that asks the questions you would ask, and pages that load fast on a phone. Every Orbit site is hand-coded in Next.js, without a page builder or a stack of SEO plugins slowing it down.',
        'Launch builds include the local SEO basics: clean page structure, clear headings that name your services and towns, and fast mobile pages. Premium builds add a page for each core service and service area, structured data that describes your business to search engines, and analytics so you can see which pages people actually use.',
      ],
      bullets: {
        title: 'What a contractor site needs for search',
        items: [
          'One page for each main service',
          'Town pages only where you really work',
          'Name, phone and service area that match your Google profile',
          'Fast, readable pages on a phone',
          'Structured data for your business details',
          'A clear call or quote path on every page',
        ],
      },
    },
    {
      id: 'service-and-town-pages',
      heading: 'A page for each service, and only for towns you serve',
      paragraphs: [
        '“AC repair”, “heat pump installation” and “boiler replacement” are different searches from different people. One services page with a bullet list gives Google very little to match against any of them. A dedicated page can explain the job, the warning signs, what affects the price and how to book, which is what the person searching wants to know.',
        'Town pages follow one rule: each needs something true and specific about working in that town. Google’s spam policies warn against near-identical pages built to rank for one city after another, and customers spot them too. A handful of honest town pages beats fifty copies with the name swapped.',
      ],
      bullets: {
        title: 'Service pages by trade',
        items: [
          'HVAC: AC repair, furnace and boiler work, heat pumps',
          'Plumbing: water heaters, drains and sewer lines, sump pumps',
          'Electrical: panel upgrades, EV chargers, generators',
          'Roofing: replacements, repairs, storm damage',
          'Landscaping: lawn care, hardscaping, seasonal cleanups',
        ],
      },
    },
    {
      id: 'profile-and-reviews',
      heading: 'Your Google Business Profile and reviews',
      paragraphs: [
        'The profile is free, and it should be in your name with a login you control. Choose categories that match your real services, set a service area that matches where you actually drive, keep your hours current and add photos of real jobs. Then link it to your site.',
        'Reviews feed prominence, and they help the homeowner choosing between you and the next company. Ask after every finished job, make it easy with a direct link, and reply to them, including the bad ones. Fake or paid reviews break Google’s rules, and the FTC’s 2024 rule on fake reviews makes them a legal risk as well.',
        'On the website side, we match your business name, phone number and service area to the profile, and put your license or registration number where people look for it. In New Jersey, home improvement contractors register with the Division of Consumer Affairs, and customers can look the number up.',
      ],
    },
    {
      id: 'citations-and-links',
      heading: 'Directories, citations and local links',
      paragraphs: [
        'A citation is any listing of your business name, address and phone number on another site: Yelp, Angi, the Better Business Bureau, Houzz, Nextdoor, Bing Places, Apple Maps and the directories in your trade. Customers use them, and matching details everywhere make it easier for search engines to be sure which business is which. Use the exact same name, phone number and address or service area on every one, and fix old listings that still show a former number or address.',
        'Links from other local sites count too, and contractors usually have more real ones available than they think: the dealer locator of a manufacturer whose equipment you install, a trade association’s member list, a supplier’s list of installers, a local team or event you sponsor, your chamber of commerce. Stick to real relationships. Bought links break Google’s spam policies.',
      ],
      bullets: {
        title: 'Where to check your listings',
        items: [
          'Google Business Profile and Bing Places',
          'Apple Maps, through Apple Business Connect',
          'Yelp, Angi, the BBB, Houzz and Nextdoor',
          'Manufacturer dealer locators for brands you install',
          'Trade associations and your chamber of commerce',
        ],
      },
    },
    {
      id: 'tracking-results',
      heading: 'How to tell if it is working',
      paragraphs: [
        'Rankings for a single phrase bounce around by location and by day, so judge SEO on what it brings in. Free tools cover most of it. Google Search Console shows which searches your site appeared for, how often people clicked and which pages they landed on. Your Google Business Profile shows calls, direction requests and website clicks from the profile.',
        'Then count what reached you: form submissions and quote requests, and on premium builds, analytics that show which pages people used before getting in touch. Ask every new caller how they found you and write it down. Compare month to month and season to season, not week to week.',
      ],
      bullets: {
        title: 'What to check each month',
        items: [
          'Search Console: searches, clicks and top pages',
          'Business Profile: calls, direction requests, website clicks',
          'Form submissions and quote requests',
          'How new callers say they found you',
          'New reviews, and whether you replied',
        ],
      },
    },
    {
      id: 'monthly-local-seo',
      heading: 'What ongoing local SEO looks like, honestly',
      paragraphs: [
        `${SEO_PLANS_SENTENCE} Site Care, the plan below them, covers hosting, security and updates without the SEO work.`,
        'SEO is slow. Google’s own guidance says it often takes four months to a year to put improvements in place and start seeing a benefit, and a brand-new site usually takes longer than an established one. Rankings also move with competition, the searcher’s location and Google’s own updates.',
        'So a plan buys steady work, not a position on the page: the parts you control, kept up month after month, on a site you own, by the people who built it.',
      ],
    },
  ],

  includes: {
    heading: 'What contractor SEO from Orbit includes.',
    intro:
      'Launch builds include the local SEO basics. Premium builds add the pages and markup most contractors need in local search, and the monthly plans keep the work going after launch.',
    items: [
      ['Local SEO basics on every build', 'Clean page structure, clear service and town headings, and fast mobile pages on every site we launch.'],
      ['Service and area pages', 'Premium builds include a page for each core service and each real service area, written for the people searching.'],
      ['Structured data and analytics', 'Premium builds describe your business to search engines with structured data and set up analytics, so you can see which pages people use.'],
      ['Call, quote and booking paths', 'Tap-to-call, quote forms and booking paths, so a visitor from search has an easy way to become a job.'],
      ['Hand-coded and fast', 'Built in Next.js, mobile-first, with no page builder or SEO plugins to keep updating. You own the code.'],
      ['Optional monthly local SEO', 'Local SEO maintenance and monthly site improvements on the Website + Leads Plan, or active SEO and content on Growth Partner. Month to month, after launch.'],
    ],
  },

  examples: {
    heading: 'See the call-first layout in a demo.',
    intro:
      'These demo homepages are for made-up companies with fictional 555 phone numbers. They show the kind of site the SEO work sits on: services, service area and phone number up front.',
    demos: ['sample-hvac-co-hamilton', 'sample-plumbing-co-ewing', 'sample-roofing-co-lawrence'],
  },

  process: {
    heading: 'How a build starts.',
    intro: 'The SEO work sits on the site, so it starts with a build: five steps, and you talk directly with the people building it.',
  },

  pricing: {
    question: 'What does contractor SEO cost with Orbit?',
    lead: 'Local SEO basics come with every build. Ongoing local SEO is part of the two higher monthly plans, which are optional, start only after launch and run month to month.',
  },

  faqHeading: 'What contractors ask about SEO.',
  faqs: [
    [
      'Can you guarantee my company ranks on Google?',
      'No. Nobody can honestly guarantee rankings, and we don’t. Google decides, map results change with where the searcher is, and your competitors are working too. What we can do is build the parts you control well: a fast site, your services and towns named clearly (with a full page for each on premium builds), consistent business details and real answers to the questions customers type.',
    ],
    [
      'How long does SEO take for a contractor?',
      'Usually months, not weeks. Google’s own guidance says SEO often needs four months to a year to put improvements in place and see a benefit. A brand-new site or domain tends to take longer. Be wary of anyone who promises page one in 30 days.',
    ],
    [
      'Should I do SEO or pay for ads like Google Local Services Ads?',
      'They do different jobs. Ads, including Local Services Ads with the Google Guaranteed or Google Screened badge, can bring leads this week, but you pay for each lead or click and they stop when the budget does. SEO builds slowly and keeps working as long as the site and profile stay in good shape. Plenty of contractors use both. We don’t run ads; our part is the website that ads and searches both send people to.',
    ],
    [
      'How do I choose keywords for my contracting business?',
      'Start with the jobs you want more of and the towns you work in, not with a keyword tool. For each job, cover the service plus a town, the “near me” version, the emergency version if you take emergencies, and the cost question. Google’s autocomplete and your own Search Console report show the exact words people use. Leave out jobs and towns you don’t serve.',
    ],
    [
      'How can I track my SEO progress?',
      'Monthly, and on what reaches you rather than on one ranking. Check Search Console for the searches and pages that bring visits, your Google Business Profile for calls and direction requests, and your form submissions, and ask every new caller how they found you. Movement is slow, so compare months and seasons, not weeks.',
    ],
    [
      'Can you do SEO on my current website?',
      'The monthly SEO plans start after launch, on a site we built. If your current site is on WordPress, Wix or Squarespace, a website refresh keeps the content that works and rebuilds the rest in hand-coded Next.js. If you are not sure where you stand, start with the free website check.',
    ],
    [
      'Which monthly plan makes sense for a contractor?',
      'The Website + Leads Plan suits an established shop that wants local SEO maintenance and steady improvements to the site each month. Growth Partner adds active SEO, content and priority support, for a shop that wants the site to keep covering more. If you only need hosting, security and updates, Site Care is the plan without SEO work. All three are month to month.',
    ],
    [
      'Is SEO for HVAC companies different from SEO for plumbers?',
      'The foundations are the same, but the searches differ. HVAC demand follows the weather, with AC repair searches climbing in the first heat wave and furnace and boiler calls in the first cold snap, so seasonal service pages should be live before the season starts. Plumbing searches are more often urgent, like a burst pipe or no hot water, so those pages put the phone number first.',
    ],
    [
      'Does a contractor need a blog for SEO?',
      'Not to start. Service pages and town pages usually matter more. A blog post earns its place when it answers a question customers really ask, like whether an old water heater is worth repairing or what a panel upgrade involves, and links to the service page that does the selling.',
    ],
    [
      'Will this help my business show up in ChatGPT or Google’s AI answers?',
      'It can help, but nobody controls those answers either. AI assistants tend to draw on pages that state facts plainly: what you do, where you work and how to book. The clear service pages, consistent business details and structured data that help in Google also make your business easier for them to describe correctly.',
    ],
  ],

  related: {
    posts: ['local-seo-website-structure-service-business', 'handcoded-websites-local-seo', 'local-service-website-google-ranking'],
    links: [
      ['Check your current site for free', '/free-website-check'],
      ['Get a rough price range', '/quote'],
    ],
  },

  cta: {
    title: 'Let’s talk about local SEO for your trade.',
    copy: 'Book a free call. Tell us which jobs and towns you want more of, and we will tell you plainly what the site and the monthly plans can and cannot do.',
  },
}
