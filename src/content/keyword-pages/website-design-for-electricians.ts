import { SEO_PLANS_SENTENCE, siteFaq, type KeywordPage } from './types'

// Primary keyword: "electrician website design" (320/mo US, KD 6). Close variants:
// "electrician website" (390, KD 7) and "electrician web design" (320, KD 12).
// The NJ-specific page is /website-design-for-electricians-nj; this one is the
// general trade page, so its copy must not repeat that page's text.
export const websiteDesignForElectricians: KeywordPage = {
  path: '/website-design-for-electricians',
  primaryKeyword: 'electrician website design',
  secondaryKeywords: [
    'electrician website',
    'electrician web design',
    'website design for electricians',
    'electrical contractor website',
    'electrician website examples',
  ],

  title: 'Electrician Website Design for Home and Commercial Work',
  description:
    'Electrician website design from a NJ studio: a page each for panel upgrades, EV chargers and generators, a separate commercial path, your license shown.',
  name: 'Website design for electricians',
  serviceType: 'Website design for electricians and electrical contractors',
  breadcrumbs: [['Home-service website design', '/home-service-website-design']],

  hero: {
    label: '[WEB DESIGN // ELECTRICIANS]',
    h1: ['', 'Electrician website design', ' for home and commercial work.'],
    intro:
      'A homeowner pricing a panel upgrade and a facilities manager sending out a bid want different things from your website. Orbit Websites is a small studio in Plainsboro, NJ, and our electrician website design starts with that split: a page for each job you want more of, a separate path for commercial work, and your number and license in plain view on every phone.',
  },

  directAnswer: {
    question: 'What should an electrician website include?',
    answer:
      'An electrician website should keep a tap-to-call number on every page, give each job you want more of its own page, such as panel upgrades, EV chargers and generators, keep homeowner requests apart from commercial bids, show your license number and insurance, name the towns you actually serve, and load fast on a phone. Real photos of your work beat stock images.',
  },

  sections: [
    {
      id: 'home-and-commercial',
      heading: 'Homeowners and commercial buyers hire you differently',
      paragraphs: [
        'A homeowner with flickering lights, a dead circuit or a kitchen remodel that needs new wiring is asking two things: can I trust this person in my house, and when can they come? They decide on a phone, from your license, your photos and how easy you are to reach.',
        'A general contractor, property manager or facilities manager is asking something else. Have you worked in this kind of building, are you insured for it, and how do they send you plans or a bid invitation? An electrical contractor website that only talks to homeowners tells them you probably don’t take commercial work, even when you do plenty of it.',
        'So the site gives each one its own way in. Homeowners get service pages with a call button and a short quote form. Commercial buyers get a page about the work you take on and how to request a bid, with a form that asks for the scope, the deadline and a site contact. The first question on every form, home or business, sends the request to the right person.',
      ],
      bullets: {
        title: 'What commercial buyers look for',
        items: [
          'The kinds of buildings and jobs you take on',
          'Proof of insurance, or how to request a certificate',
          'How to send plans, photos or a bid invitation',
          'Who to contact, and when you are reachable',
          'Maintenance or service agreements, if you offer them',
        ],
      },
    },
    {
      id: 'service-pages',
      heading: 'Panel upgrades, EV chargers and generators each need a page',
      paragraphs: [
        'A lot of electrician web design stops at a homepage and a services list with one line per job. That answers none of the questions these customers have. A page for each job can explain what the work involves, what changes the price, whether a permit and inspection are needed, and which photos help you quote before a site visit.',
        'The three jobs also come from different people. Panel upgrades usually have a trigger, such as a failed home inspection, an insurance question about an older panel, or new equipment like a heat pump or an induction range. EV charger buyers often know their car and charger already and mainly want to know whether the house can take a dedicated 240-volt circuit. Generator buyers tend to show up after a long outage, asking about sizing, fuel and transfer switches.',
        'Start with the two or three jobs that pay best or that you most want to grow, and add pages once those are live. A few pages that answer real questions do more than twenty thin ones that repeat each other.',
      ],
      bullets: {
        title: 'Service pages worth considering',
        items: [
          'Panel upgrades and service changes',
          'EV charger installation',
          'Standby generators and transfer switches',
          'Recessed, outdoor and fixture lighting',
          'Troubleshooting and repairs',
          'Commercial fit-outs and lighting retrofits',
        ],
      },
    },
    {
      id: 'license-permits-insurance',
      heading: 'Your license, permits and insurance, stated plainly',
      paragraphs: [
        'Electrical work is licensed in most of the country, either by the state or by the city or county. In New Jersey, electrical contractors are licensed by the Board of Examiners of Electrical Contractors. Customers can usually check a license online, and careful ones do before anyone works on their service. Showing the number, with the state or board that issued it, answers the question before they go looking.',
        'Permits come next. Panel upgrades, service changes, generator hookups and new circuits for chargers usually need a permit and an inspection. If you pull the permits and book the inspections, say so on each service page. It tells a homeowner the job will be done properly, and it helps explain your price next to someone who skips that step.',
        'Insurance matters most to commercial buyers, who often need a certificate before you set foot on site. A line about the coverage you carry, and how to request a certificate, saves an email back and forth.',
      ],
      bullets: {
        title: 'Trust details worth showing',
        items: [
          'License number, and the state or board that issued it',
          'Insurance, and how to request a certificate',
          'Whether you pull permits and schedule inspections',
          'Brands you are certified or authorized to install, if any',
          'Real photos of your panels, trucks and crew',
        ],
      },
    },
    {
      id: 'urgent-and-after-hours',
      heading: 'Urgent calls and requests that come in after hours',
      paragraphs: [
        'Some electrical calls should not wait for a form: a burning smell, a sparking outlet, half the house without power. Those visitors need your phone number in large type and a short note, written by you, on what to do while they wait, such as when to switch off a breaker and when to call 911 first.',
        'Planned work is different. Someone who finds you at 10 pm wants to send the details now and hear back tomorrow. A form that collects the job type, the address and a couple of photos means the request is waiting in the morning with what you need to quote.',
        'If missed calls are costing you jobs, AI intake can sort urgent requests from planned work, text you a summary and tell the customer what happens next. It is optional and costs more, so we only suggest it when it would replace real admin work or win back leads you are losing now.',
      ],
    },
    {
      id: 'local-search',
      heading: 'Built so people nearby can find you',
      paragraphs: [
        'People search for the job and the place: an EV charger installer near them, an electrician in their town. Pages that name the job and the towns you really cover, in clear headings, give search engines and AI assistants something specific to match. Town pages for places you don’t serve don’t belong on the site.',
        'Every page is hand-coded in Next.js instead of a template with plugins, so it stays quick on a phone. Launch builds include local SEO basics. Premium builds add a page for each core service and service area, structured data for your business details and analytics. If you want ongoing local SEO after launch, the optional monthly plans cover it.',
      ],
    },
  ],

  includes: {
    heading: 'What an electrician website from Orbit includes.',
    items: [
      ['Tap-to-call on every page', 'Your number stays in view on phones, with a call button in the header and beside every form.'],
      ['Home and commercial request paths', 'One first question, home or business, then a short form for each, sent to the inbox you choose.'],
      ['Premium: service and town pages', 'Premium builds add a page for each job you want more of and each core town, with structured data and analytics.'],
      ['License, insurance and real photos', 'Your license number, insurance details and job photos, placed where people decide whether to call.'],
      ['Hand-coded and fast', 'Built in Next.js, mobile-first, with local SEO basics and no page builder or plugins to keep patching.'],
      ['Yours to keep', 'You approve the finished site before the final payment, and then it is yours. Hosting with us is optional.'],
    ],
  },

  examples: {
    heading: 'See a sample electrician demo.',
    intro:
      'Electrician website examples are easier to judge when you can click through one. This demo homepage is for a made-up electrical contractor with a fictional 555 phone number. It lists panel upgrades, EV chargers, lighting and surge protection as separate services, the kind of structure we build around. Your own site is designed from scratch around your jobs and towns.',
    demos: ['sample-electric-west-windsor'],
  },

  process: {
    heading: 'How an electrician website gets built.',
    intro: 'Five steps from a free call to a site you own, and you deal with the people building it the whole way.',
  },

  pricing: {
    question: 'How much does an electrician website cost?',
    lead: 'It mostly depends on how many service and town pages you need, whether commercial work gets its own section, whether the copy is written from scratch, and whether AI intake is worth adding.',
  },

  faqHeading: 'What electricians ask before hiring us.',
  faqs: [
    [
      'Should residential and commercial electrical work share one website?',
      'Usually, yes, with separate sections. One business name and phone number keeps your reputation in one place, while separate pages and forms let homeowners and commercial buyers each find what they need. If commercial work is most of your business, it can lead the homepage instead of sitting behind the residential pages.',
    ],
    [
      'Which service pages should an electrician build first?',
      'The two or three jobs that pay best or that you most want to grow. For many residential shops that means panel upgrades, EV charger installs or standby generators, since each is its own search with its own questions. Add more once those pages are live, rather than launching twenty thin pages at once.',
    ],
    [
      'Should my license number be on my website?',
      'Yes. Put it in the footer, near each quote form and on your about page, with the state or board that issued it. Customers can usually look a license up online, and showing it saves them the trouble. If you hold licenses in more than one state, list each one.',
    ],
    [
      'Can the website handle emergency and after-hours requests?',
      'Yes, in two ways. A call button stays in view on every page, so urgent callers reach you directly. After hours, the quote form collects the job type, address and photos so you can price the work in the morning. AI intake that flags urgent requests and texts you a summary is optional, costs more and only makes sense if missed calls are costing you jobs.',
    ],
    [
      'Can you guarantee my electrical business will rank on Google?',
      `No. Nobody can honestly guarantee a ranking, and we don’t. Electrical searches are often for one job in one place, like an EV charger installer or a panel upgrade nearby, so what helps most is a fast page that answers that job plainly, with your license in view. Launch builds include local SEO basics; premium builds add a page for each core service and town, plus structured data. ${SEO_PLANS_SENTENCE}`,
    ],
    siteFaq('Do you build on WordPress, Wix or Squarespace?'),
    siteFaq('How long does it take to launch?'),
  ],

  related: {
    posts: ['electrician-website-ewing-nj', 'home-service-website-structure', 'ai-chatbot-electrician-central-nj'],
    links: [
      ['Check your current site for free', '/free-website-check'],
      ['Get a rough price range', '/quote'],
    ],
  },

  cta: {
    title: 'Let’s plan your electrician website.',
    copy: 'Book a free call and bring the list of jobs you want more of, at homes and businesses. You talk with the people who build the site, not a sales team.',
  },
}
