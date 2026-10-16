import { siteFaq, PAYMENT_SENTENCE, SEO_PLANS_SENTENCE, type KeywordPage } from './types'

// Primary keyword: "web design new jersey" (480/mo US, KD 23), with the NJ variants below.
// Statewide hub: the renderer adds the grid of every town page right after the direct answer and the
// trade grid near the end. /web-design-central-nj stays the Central Jersey page (town list, fit / not a fit),
// so this page covers the statewide questions: towns and counties, NJ license numbers, local SEO in NJ,
// choosing a designer, and working with a Plainsboro studio from elsewhere in the state.
export const webDesignNewJersey: KeywordPage = {
  path: '/web-design-new-jersey',
  primaryKeyword: 'web design new jersey',
  secondaryKeywords: [
    'web design nj',
    'website design nj',
    'website design new jersey',
    'web design company nj',
    'web designer new jersey',
    'web designer nj',
    'website designer nj',
    'website designer new jersey',
    'local seo nj',
    'small business web design nj',
    'web developer nj',
    'web design agency nj',
  ],

  title: 'Web Design New Jersey | Hand-Coded Sites for NJ Businesses',
  description:
    'New Jersey web design from a Plainsboro studio: hand-coded, mobile-first sites for contractors and local businesses, with local SEO basics. Yours to own.',
  name: 'Web design in New Jersey',
  serviceType: 'Website design for New Jersey businesses',
  breadcrumbs: [],

  hero: {
    label: '[WEB DESIGN // NEW JERSEY]',
    h1: ['', 'Web design in New Jersey', ', built around the towns you serve.'],
    intro:
      'Orbit Websites is a small web design studio in Plainsboro, NJ. We design and hand-code websites for New Jersey home-service and other small businesses: plumbers, HVAC companies, electricians, roofers, landscapers and contractors. Each site is built around calls, quote requests and the towns you actually work in, and it is yours when it is done.',
  },

  directAnswer: {
    question: 'How do you choose a web designer in New Jersey?',
    answer:
      'Choose a New Jersey web designer who shows real sites they have built, explains pricing before you commit, lets you talk directly to the people building your site, designs for phones first and hands you ownership when it is done. For a local service business, also ask how the site will handle calls, quote requests and the towns you serve, and what happens after launch.',
  },

  sections: [
    {
      id: 'across-new-jersey',
      heading: 'A Plainsboro studio, building for businesses across New Jersey',
      paragraphs: [
        'The studio is in Plainsboro, in Middlesex County, and our local pages above cover Central Jersey towns such as Princeton, West Windsor, Ewing, Hamilton and Trenton. If you are nearby, start with your town.',
        'Businesses in the rest of the state can work with us remotely, on calls and by email. That includes North and northwest Jersey, such as Hunterdon, Warren and Morris counties; the Shore, from Monmouth County towns like Howell, Neptune and Colts Neck down into Ocean County; and South Jersey, such as Haddon Township and Pennsauken in Camden County or Evesham in Burlington County. We have no office in those areas and don’t pretend to.',
        'The process is the same wherever you are: a free call, direct conversations with the people who design and code your site, and a finished site you approve before the final payment. You know your market better than we do, so you tell us the towns you serve and the jobs you want more of. Running a trade? The trade pages further down go deeper, and the SEO for contractors page covers search after launch.',
      ],
      bullets: {
        title: 'Where we take on projects',
        items: [
          'Central Jersey: Mercer and Middlesex, with town pages above',
          'North and northwest Jersey: Hunterdon, Warren and Morris counties',
          'The Shore: Monmouth and Ocean counties',
          'South Jersey: Camden, Burlington and Gloucester counties',
          'Outside Central Jersey, everything happens on calls and by email',
        ],
      },
    },
    {
      id: 'towns-and-counties',
      heading: 'New Jersey customers search by town, so your site should name them',
      paragraphs: [
        'New Jersey has 564 municipalities in 21 counties, and customers rarely look for a contractor by county. They type the town they live in: roofer in Hamilton, electrician near Princeton, lawn care in Ewing. A site that only says “serving New Jersey” gives a search engine very little to match.',
        'Town names also repeat. There are two Hamilton Townships, one in Mercer County and one in Atlantic County, and several Franklin Townships around the state. Writing “Hamilton Township, Mercer County” in your service area removes the doubt for customers and for Google.',
        'Give a town its own page only when you have something real to say there, such as jobs you have done, photos or how far you travel. Near-identical pages with the town name swapped are what Google’s spam policies call doorway abuse, and they rarely help anyone.',
      ],
      bullets: {
        title: 'How we write your service area',
        items: [
          'The towns you actually work in, not every town in the state',
          'Town plus county wherever a name repeats',
          'The same business name, address and phone as your Google Business Profile',
          'A dedicated page only for towns with real jobs behind them',
          'Plain sentences a customer can read, not a block of keywords',
        ],
      },
    },
    {
      id: 'license-numbers',
      heading: 'Show the license number New Jersey customers check',
      paragraphs: [
        'Many New Jersey trades are licensed or registered by the state. Master plumbers are licensed by the State Board of Examiners of Master Plumbers, electrical contractors by the Board of Examiners of Electrical Contractors, and HVACR contractors by the State Board of Examiners of Master HVACR Contractors. Home improvement contractors register with the Division of Consumer Affairs, and the state requires that registration number in their advertising.',
        'Customers can check a New Jersey license or registration online through the Division of Consumer Affairs. We put your number in the footer, next to quote forms and on your about page, so a careful customer sees it before they go looking.',
      ],
    },
    {
      id: 'local-seo-nj',
      heading: 'Local SEO in New Jersey: what a website can and cannot do',
      paragraphs: [
        'Google says its local results are based mainly on relevance, distance and how well known a business is. A website does most of its work on relevance: a clear page for each service, the towns you serve named plainly, your business details marked up for search engines, and pages that load fast on a phone.',
        'Distance is out of your hands, and reputation builds over time through reviews, your Google Business Profile and mentions around the web. A good site supports both, but no website can promise a spot in the map results.',
        `Every build starts with local SEO basics. ${SEO_PLANS_SENTENCE}`,
      ],
      bullets: {
        title: 'What the website controls',
        items: [
          'A page for each main service',
          'Towns and counties named in plain text',
          'Structured data for your business details',
          'Fast, mobile-first pages',
          'Answers to the questions customers actually ask',
        ],
      },
    },
    {
      id: 'choosing-a-designer',
      heading: 'Web design company, freelancer or small studio?',
      paragraphs: [
        'Look for a web designer or web developer in NJ and you will find large agencies, solo freelancers and everything in between. Larger agencies bring more process, and their custom projects often run for months. Freelancers are often direct and flexible. Whoever you talk to, ask to see live sites they have built, and ask who handles changes and support after launch.',
        `Orbit Websites is a small studio. You talk directly with the people who design and code your site, with no sales handoff. A launch build runs on a seven-day sprint once scope and direction are clear: ${PAYMENT_SENTENCE}`,
        'Our work page shows live sites we have built: real estate and property-services sites and a specialty food brand, not trade businesses. The trade examples on this page are fictional sample demos, labeled as such.',
      ],
      bullets: {
        title: 'Questions to ask any NJ web designer',
        items: [
          'Who will I actually talk to during the build?',
          'Do I own the finished site?',
          'Is hosting required, and what does it cost?',
          'Can I see real sites you have built?',
          'What happens when I need a change after launch?',
        ],
      },
    },
  ],

  includes: {
    heading: 'What a website from Orbit includes.',
    intro:
      'Launch builds cover the essentials below. Premium builds add deeper strategy and copy, service and area pages, structured data and analytics.',
    items: [
      ['Custom design, hand-coded', 'Designed from scratch around your business and built in Next.js, with no template, page builder or plugin stack to keep updating.'],
      ['Mobile-first and fast', 'Built for the phone first, because that is where many customers find and call a local business.'],
      ['Call, quote and booking paths', 'Tap-to-call, quote forms and booking buttons placed where customers decide, with requests sent to the inbox you choose.'],
      ['Local SEO basics', 'Your services and towns named plainly, with clean page structure and the technical groundwork search engines read.'],
      ['Optional AI intake', 'Intake that captures job details, sorts urgent requests and texts you a summary. It costs more, so we suggest it only when it replaces admin work or recovers leads.'],
      ['Yours to keep', 'You approve the finished site before the final payment, and then it is yours. Hosting with us is optional.'],
    ],
  },

  examples: {
    heading: 'See what a New Jersey trade site can look like.',
    intro:
      'These demo homepages are for made-up companies set in Mercer County towns, each with a fictional 555 phone number, and they are not client work. They show the kind of structure we build around, such as an emergency block, service cards and a short FAQ. Your site is designed from scratch around your business.',
    demos: ['sample-hvac-co-hamilton', 'sample-roofing-co-lawrence', 'sample-landscaping-co-princeton'],
  },

  process: {
    heading: 'How a website gets built.',
    intro: 'Five steps, and you talk to the people building your site at every one.',
  },

  pricing: {
    question: 'How much does website design cost in New Jersey?',
    lead: 'Web design quotes in New Jersey range widely because they cover very different amounts of work, from a template refresh to a months-long agency project. Ours depend on how many service and town pages you need, whether the copy is written from scratch, and whether you want AI intake.',
  },

  faqHeading: 'What New Jersey business owners ask before hiring a web designer.',
  faqs: [
    [
      'Do you work with businesses outside Central New Jersey?',
      'Yes. The studio is in Plainsboro and our focus is Central Jersey, but we also build for home-service and local businesses elsewhere in New Jersey. The process does not depend on being nearby: a free call, direct conversations with the people building your site, and a finished site you approve before the final payment.',
    ],
    [
      'Should my website list every New Jersey town I serve?',
      'List the towns you really work in, with the county where a name repeats, in a service area every visitor can find. Give a town its own page only when you have something specific to say there, such as jobs, photos or travel details. Many copies of one page with the town name swapped help nobody, and Google treats them as doorway pages.',
    ],
    [
      'Is local SEO included in your New Jersey web design?',
      `Every build includes local SEO basics: fast pages, your services and towns named clearly, and clean structure search engines can read. ${SEO_PLANS_SENTENCE} We don’t guarantee rankings, because nobody honestly can.`,
    ],
    [
      'Should I hire a freelance web designer or a web design company in NJ?',
      'Decide based on who you will talk to and what happens after launch. Agencies bring more process, usually with bigger budgets and longer timelines, and freelancers are often more direct. Either way, ask who handles changes and support once the site is live. Orbit Websites is a small studio: you talk directly with the people building your site, and optional monthly plans are there if you want help after launch.',
    ],
    [
      'How long does a website take to build?',
      'A launch build runs on a seven-day sprint once scope and direction are clear. Premium builds with more service and town pages, or AI intake, get a timeline you agree to on the call, before you pay anything.',
    ],
    [
      'Can I update the website myself?',
      'Not through a drag-and-drop editor, because there isn’t one: the site is hand-coded in Next.js, so changes are made in the code. On a monthly care plan you text us the change, such as new photos, hours or a service, and we make it. You own the code and hosting with us is optional, so any developer who works with Next.js can edit it too.',
    ],
    siteFaq('What kinds of businesses do you build for?'),
    siteFaq('Do you build on WordPress, Wix or Squarespace?'),
  ],

  related: {
    posts: ['how-much-does-a-website-cost-for-a-local-business', 'local-seo-website-structure-service-business', 'local-business-website-checklist-2026'],
    links: [
      ['See live sites we have built', '/projects'],
      ['Check your current site for free', '/free-website-check'],
      ['Get a project range', '/quote'],
      ['About the studio', '/about'],
    ],
  },

  cta: {
    title: 'Let’s talk about your New Jersey website.',
    copy: 'Book a free call, tell us the towns you serve and the jobs you want more of, and talk directly with the people who build the site.',
  },
}
