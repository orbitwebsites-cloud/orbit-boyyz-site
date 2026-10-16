import { siteFaq, SEO_PLANS_SENTENCE, type KeywordPage } from './types'

// Primary keyword: "roofing website design" (320/mo US, KD 8). Secondary: "roofing web design"
// (320, KD 14), "roofing website" (170, KD 29), "roofing website examples". There is no
// NJ-specific roofing page, so this is the only roofing page on the site.
// Angle: storm and insurance work, inspections, photo galleries, estimate requests.
export const websiteDesignForRoofers: KeywordPage = {
  path: '/website-design-for-roofers',
  primaryKeyword: 'roofing website design',
  secondaryKeywords: ['roofing web design', 'roofing website', 'roofing website examples'],

  title: 'Roofing Website Design for Storm Calls and Estimates',
  description:
    'Roofing website design from a Plainsboro, NJ studio: a fast path for leaks and storm damage, inspection and estimate forms, and galleries of your own jobs.',
  name: 'Website design for roofers',
  serviceType: 'Website design for roofing companies',
  breadcrumbs: [['Home-service website design', '/home-service-website-design']],

  hero: {
    label: '[WEB DESIGN // ROOFERS]',
    h1: ['', 'Roofing website design', ' for storm calls and estimates.'],
    intro:
      'A homeowner with water dripping into the attic after a storm and one pricing a new roof for spring want different things from your site. Roofing website design at Orbit Websites, a studio in Plainsboro, NJ, starts from that split: a call button that is always one tap away, inspection and estimate forms that ask the right questions, and galleries of your own finished roofs.',
  },

  directAnswer: {
    question: 'What should a roofing website include?',
    answer:
      'A roofing website should keep a tap-to-call number on every page, give leaks and storm damage their own fast path apart from planned replacements, offer an inspection or estimate form that asks for the address, roof type and photos, show real photos of your own jobs, list the towns you serve, show your license or registration number and load fast on a phone.',
  },

  sections: [
    {
      id: 'storm-and-insurance',
      heading: 'Storm damage and insurance work need their own page',
      paragraphs: [
        'After a hail or wind storm, people search differently. They type “roof leak repair” or “storm damage roofer” on a phone, sometimes with water coming through the ceiling. They want to know that you answer and how soon someone can cover the roof. Many are also wondering whether their insurance will pay, which is a different question from what a new roof costs.',
        'So storm work gets its own page: a large call button, a few plain steps for while they wait, such as moving belongings away from the leak and taking photos for the insurer, and a clear explanation of how you document damage: dated photos, notes on what you found and a written estimate they can share with the adjuster.',
        'Keep that page to what you really do. Negotiating a claim on a homeowner’s behalf is public adjusting, which needs its own license in New Jersey and many other states, so “we photograph and document the damage for your claim” is safer than “we handle your claim.” We write the storm page with you, in your words.',
      ],
      bullets: {
        title: 'What a storm page covers',
        items: [
          'A call button above everything else',
          'What to do before the crew arrives',
          'Emergency tarping, if you offer it',
          'How you photograph and document damage',
          'The towns you can reach quickly after a storm',
        ],
      },
    },
    {
      id: 'inspections-and-estimates',
      heading: 'Inspection and estimate requests that arrive with the details',
      paragraphs: [
        'Most roofing work starts with someone looking at the roof, so the main ask on your site is rarely “buy now.” It is “book an inspection” or “get an estimate.” A form that only asks for a name, an email and a message means you call back and ask the same questions every time.',
        'A better form asks what you would ask on the phone, lets people attach photos from the yard or the attic, and stays short enough to finish on a phone. Repair, replacement, storm and inspection requests go to the inbox you choose, labeled so you can tell them apart at a glance.',
        'After a big storm, calls can pile up faster than anyone can answer them. If that is costing you jobs, AI intake can collect the address, the damage and photos, text you a summary and tell the homeowner what happens next. It is optional and costs more, so we only suggest it when it would replace real office work or recover leads you are losing now.',
      ],
      bullets: {
        title: 'What the estimate form asks',
        items: [
          'Repair, replacement, storm damage or inspection',
          'Town or address, and house, townhouse or commercial building',
          'Roof type if they know it: shingle, flat, slate or metal',
          'Whether water is coming in right now',
          'Whether an insurance claim is already open',
          'Photos, and a good time to call back',
        ],
      },
    },
    {
      id: 'photo-galleries',
      heading: 'Photo galleries that help a homeowner decide',
      paragraphs: [
        'A new roof is a large purchase that most homeowners rarely make, so they look hard at your past work. Real photos of your crews, your trucks and finished roofs on local homes tell them more than stock images ever will.',
        'Galleries work best when they are sorted the way people shop: by job type, such as repairs, full replacements, flat roofs and gutters, and by town. Each project gets a short caption saying what was wrong and what you did, and before-and-after pairs are shot from the same angle. Images are sized so the page still loads quickly on a phone.',
        'If you hold manufacturer certifications or offer warranties, show them next to the photos, in the wording the manufacturer allows. We don’t add badges, ratings or reviews you don’t actually have.',
      ],
    },
    {
      id: 'service-and-town-pages',
      heading: 'A page for each roofing job and each town you cover',
      paragraphs: [
        'Roof repair, roof replacement, flat roofing, gutters and siding are separate searches from people with separate problems. A single services page with a bullet list answers none of them well. A dedicated page can explain the job, what changes the price, how long it usually takes and what the homeowner should expect on the day.',
        'Town pages help when they are honest: the towns you really work in, with something specific to say about each one, such as the kind of housing you see there. Pages that only swap one town name for another help nobody. Start with your two or three best jobs and your core towns, and add more once those are live.',
        'Your registration or license number belongs on these pages as well. In New Jersey, contractors who do residential roofing register with the Division of Consumer Affairs as home improvement contractors, and some other states license roofing contractors directly. Showing the number in the footer and next to each form answers the question before anyone goes looking.',
      ],
      bullets: {
        title: 'Pages roofers often start with',
        items: [
          'Roof repair and leak repair',
          'Roof replacement',
          'Storm damage and emergency tarping',
          'Roof inspections',
          'Flat and low-slope roofing',
          'Gutters, siding and trim',
        ],
      },
    },
    {
      id: 'ready-before-the-storm',
      heading: 'Ready before the next storm, not after it',
      paragraphs: [
        'There is no time to write a storm page the morning after a hailstorm, when everyone is calling. Have it live before storm season, with your Google Business Profile showing current hours and the area you really cover, so the people searching “roof leak repair” on a phone find a page that already answers them.',
        'The same goes for the questions homeowners ask before they call: how soon you can tarp, whether you work with insurance, what an inspection involves. Answer them in plain sentences on the page, which is also the kind of text a search engine or an AI assistant can quote. Every page is hand-coded in Next.js rather than a template with a stack of plugins, so it stays fast on a phone with one bar of signal.',
        `Launch builds include local SEO basics: services and towns named in clear headings. Premium builds add a page for each core service and service area, structured data and analytics. ${SEO_PLANS_SENTENCE}`,
      ],
    },
  ],

  includes: {
    heading: 'What a roofing website from Orbit includes.',
    items: [
      ['Tap-to-call on every page', 'Your number stays visible on phones, with a call button in the header and next to every form.'],
      ['Storm and estimate paths', 'A fast route for leaks and storm damage, plus inspection and estimate forms for planned work, sent to the inbox you choose.'],
      ['Project galleries', 'Your own job photos, sorted by job type and town, with short captions and images sized for phones.'],
      ['Premium: service and town pages', 'Premium builds add a page for each roofing job you want more of and each core town, with structured data and analytics.'],
      ['Hand-coded and fast', 'Built in Next.js, mobile-first, with no page builder or plugin stack to keep updating.'],
      ['Yours to keep', 'You approve the finished site before the final payment, and then it is yours. Hosting with us is optional.'],
    ],
  },

  examples: {
    heading: 'See a sample roofing demo.',
    intro:
      'Most roofing website examples online are other companies’ live sites. This one is a demo homepage for a made-up company, so nothing on it describes a real business. It shows the kind of structure we build around: service cards for repair, replacement, storm damage, inspections, gutters and siding, an emergency leak section with a call button, and a short roofing FAQ. Your own site is designed from scratch around your services, towns and photos.',
    demos: ['sample-roofing-co-lawrence'],
  },

  process: {
    heading: 'How a roofing website gets built.',
    intro: 'Five steps from the first call to launch, and you deal with the people building the site at every one.',
  },

  pricing: {
    question: 'How much does a roofing website cost?',
    lead: 'The price depends on how many service and town pages you need, how much of the copy and gallery we write and organize from scratch, and whether you want AI intake for busy storm weeks.',
  },

  faqHeading: 'What roofers ask before hiring us.',
  faqs: [
    [
      'Should storm damage have its own page on my website?',
      'In most cases, yes. Someone with a leak after a storm wants to call right away and wants to know you work with insurance claims, while someone pricing a replacement wants details and photos first. A storm page with a large call button and a plain explanation of how you document damage serves the first group without getting in the way of the second.',
    ],
    [
      'What should a roofing estimate form ask?',
      'The questions you would ask on the phone: repair, replacement, storm damage or inspection; the town or address; the roof type if they know it; whether water is coming in now; whether an insurance claim is open; and photos. Keep it short enough to finish on a phone, and put a call button next to it for anyone who would rather talk.',
    ],
    [
      'What do the best roofing websites have in common?',
      'They load fast on a phone, keep the phone number in reach on every screen, show real photos of local jobs, give repair, replacement and storm work separate pages, and show proof a homeowner can check, such as a license or registration number and any manufacturer certifications the company really holds. Animation and stock photos matter far less than those basics.',
    ],
    [
      'Can my website help me win insurance claim work?',
      'It can make you the easy call after a storm. Explain how you inspect and photograph damage, what your written estimate includes and whether you can tarp the roof in the meantime, and ask on the form whether a claim is already open. Keep the wording to what you really do: promising to negotiate the claim itself can cross into public adjusting, which is licensed separately.',
    ],
    [
      'Can you guarantee my roofing company ranks on Google?',
      'No. Nobody can honestly promise a ranking, and we don’t. Roofing search comes in surges: after a storm, many roofers chase the same searches at once, and map results depend partly on how close the homeowner is to you. What we can do is make your storm, repair and replacement work easy to understand, name the towns you cover and keep the pages fast, with a page for each core service and town on premium builds. The optional monthly plans after launch add ongoing local SEO.',
    ],
    [
      'How long does a roofing website take?',
      'A launch build runs on a seven-day sprint once scope and direction are clear. Premium builds with more service and town pages, a large project gallery or AI intake get a timeline you agree to on the call, before you pay anything.',
    ],
    siteFaq('Do you build on WordPress, Wix or Squarespace?'),
  ],

  related: {
    posts: ['home-service-website-structure', 'speed-to-lead-home-services', 'local-business-website-checklist-2026'],
    links: [
      ['Check your current site for free', '/free-website-check'],
      ['Get a rough price range', '/quote'],
      ['See live sites we have built', '/projects'],
    ],
  },

  cta: {
    title: 'Let’s build your roofing website.',
    copy: 'Book a free call and tell us which jobs you want more of: storm repairs, replacements or inspections. You talk directly with the people who build the site.',
  },
}
