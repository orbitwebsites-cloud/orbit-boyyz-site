import { siteFaq, type KeywordPage } from './types'

// Primary keyword: "plumber web design" (480/mo US, KD 8). The NJ-specific page is
// /website-design-for-plumbers-nj; this one is the general trade page.
// Intent check (2026-10-16): "plumber website design" (480, KD 7) is informational and its
// top 10 is galleries (Workiz templates, Hook Agency's examples, WebFX's 21 designs, Pinterest,
// Webflow, Dribbble). A text page with one sample demo will not outrank 9–21 visual examples,
// so this page targets "plumber web design", whose top results are service pages
// (scriptablesolutions, relentless-digital, thriveagency), and Search Console already shows
// "plumbing web design company" impressions. "Plumbing website examples" is dropped on purpose.
// Angle: emergency calls, booking, service areas, and the license, insurance, reviews and
// financing details a plumber should show, which the ranking agency pages barely cover.
export const websiteDesignForPlumbers: KeywordPage = {
  path: '/website-design-for-plumbers',
  primaryKeyword: 'plumber web design',
  secondaryKeywords: [
    'plumbing web design',
    'plumber website design',
    'plumbing website design',
    'plumbing web design company',
    'plumbing website',
  ],

  title: 'Plumber Web Design: What Every Plumbing Website Needs',
  description:
    'Plumber web design from a Plainsboro, NJ studio, and what every plumbing site needs: one-tap calls, service and town pages, your license, reviews and booking.',
  name: 'Website design for plumbers',
  serviceType: 'Website design for plumbing companies',
  breadcrumbs: [['Home-service website design', '/home-service-website-design']],

  hero: {
    label: '[WEB DESIGN // PLUMBERS]',
    h1: ['', 'Plumber web design', ' for emergency calls and planned jobs.'],
    intro:
      'A burst pipe at 11 pm and a water heater quote for next month are two different customers. Orbit Websites is a small studio in Plainsboro, NJ, and our plumber web design gives each one its own path: a call button that is always one tap away, and quote forms that collect the details before you call back.',
  },

  directAnswer: {
    question: 'What should a plumbing website include?',
    answer:
      'A plumbing website should keep the phone number one tap away on every page, separate emergency calls from scheduled work, give each main service its own page and name the towns you cover. Show your license number, insurance, real job photos and real Google reviews, linked to your profile. Add online booking for routine jobs and financing if you offer them, and keep every page fast on a phone.',
  },

  sections: [
    {
      id: 'emergency-and-scheduled',
      heading: 'Emergency calls, planned jobs and online booking',
      paragraphs: [
        'Someone with water coming through the ceiling does not want to read. They want to know you answer now, and they want to call. Someone planning a water heater replacement or a bathroom rough-in is comparing companies and wants details first. One generic contact page serves neither of them well.',
        'So the site splits early. Emergency visitors get a large call button, the hours you really answer, and a short note on what to do while they wait, such as closing the main shut-off valve. Visitors with planned work get a quote form that asks the questions you would ask on the phone. Routine jobs, like drain cleaning or a water heater flush, can get a book-online button. If your shop already takes bookings through scheduling software, premium builds wire the site into that tool rather than adding a second calendar.',
        'Be straight about nights and weekends. If you do not take calls after hours, say when you call back and let the form take the details, so the request is waiting in the morning instead of a vague voicemail. If missed calls are costing you real jobs, optional AI intake can sort emergencies from scheduled work and text you a summary. It costs more, so we only suggest it when it replaces admin work or recovers leads you are losing now.',
      ],
      bullets: {
        title: 'What the quote form asks',
        items: [
          'What is happening, in their own words',
          'Whether water is leaking right now, and whether it is shut off',
          'Town or address, and house, condo or rental',
          'Owner, tenant or property manager',
          'Photos of the fixture, water heater or leak',
          'A callback window that suits them',
        ],
      },
    },
    {
      id: 'service-pages',
      heading: 'A page for each job you want more of',
      paragraphs: [
        'Drain cleaning, water heaters, sump pumps, sewer lines and leak repair are separate searches from people with separate problems. Lump them onto one services page and none of them gets a real answer. A dedicated page can explain the job, what changes the price, how long it usually takes and what the customer should have ready.',
        'Start with the two or three jobs that pay best or that you most want to grow. If you also take commercial or property-management work, give it its own page: a landlord with forty units asks different questions than a homeowner with one bathroom.',
        'Every site is hand-coded in Next.js rather than built on a template with a stack of plugins, so it stays fast on a phone. Launch builds name your main services and towns in clear headings, with local SEO basics. Premium builds add a full page for each core service and service area, plus structured data that describes your business to search engines.',
      ],
      bullets: {
        title: 'Service pages to consider',
        items: [
          'Emergency plumbing and leak repair',
          'Water heater repair and replacement',
          'Drain and sewer line cleaning',
          'Sump pumps and battery backups',
          'Fixture installs and bathroom rough-ins',
          'Commercial and property-management work',
        ],
      },
    },
    {
      id: 'service-areas',
      heading: 'Service areas: the towns you actually drive to',
      paragraphs: [
        'People search with a town in mind, and Google looks at relevance and distance when it picks local results. A clear service-area section tells both where you work. List the towns you really cover, put the ones you most want work from first, and say plainly where you do not go, so you stop getting calls from two counties away.',
        'A town page earns its place when it says something specific: the kind of housing you see there, the jobs that come up often, how soon you can usually get out. Where you have nothing specific to say yet, a line in the service-area list does the job.',
        'Keep your business name and phone number the same on the site and on your Google Business Profile, and link the two. If you work from home and hide your address on Google, the site should show a service area instead of a street address.',
      ],
      bullets: {
        title: 'What a town page should say',
        items: [
          'The towns and neighborhoods you cover from there',
          'Jobs that come up often there, in your own words',
          'Real photos from jobs in that area',
          'How soon you can usually get out, stated honestly',
          'The same call button and quote form as every page',
        ],
      },
    },
    {
      id: 'license-insurance-financing',
      heading: 'License, insurance, reviews and financing: what customers check',
      paragraphs: [
        'Plumbers are licensed in many states, and customers can often look a license up online in a minute. In New Jersey, master plumbers are licensed by the State Board of Examiners of Master Plumbers. Put your license number in the footer, next to each quote form and on the about page, so nobody has to go looking. Some states also require the number on advertising, so check your board’s rules.',
        'Financing matters most on the big tickets: water heater replacements, sewer lines, repiping. If you offer it through a lender, say so on those pages and link to the application. Use the wording your lender gives you, because advertising specific payment terms comes with disclosure rules. If you do not offer financing, leave it off.',
        'Then comes the proof only your customers can give. Real photos of your van, your crew and finished work say more than stock images, and your real Google reviews, linked to your profile so anyone can check them, tell people what it is like to hire you. Ask after every job with a direct link, and reply to the reviews you get. Never write or buy reviews: Google bans them, and the FTC’s 2024 rule on fake reviews makes them a legal risk too.',
      ],
      bullets: {
        title: 'Trust details worth showing',
        items: [
          'License number and the board that issued it',
          'Proof of insurance, stated plainly',
          'Your real Google reviews, linked to your profile',
          'Financing, only if you really offer it',
          'Warranty terms, if you put them in writing',
          'Real photos of your crew, van and work',
        ],
      },
    },
    {
      id: 'repeat-work',
      heading: 'Pages that keep work coming after the first job',
      paragraphs: [
        'A plumbing website is not only for the first call. Plenty of shops get steady work from people who have already hired them once, and a few extra pages help with that. Add each one only if it is true for your business.',
        'A maintenance plan page, with a yearly water heater flush or drain check and priority scheduling, belongs on the site only if you really sell one. A careers page helps when you are hiring, because good techs look you up too. Before-and-after photos and short job videos shot on your own phone show the work better than any description. Specials work only when they are real and have an end date.',
      ],
      bullets: {
        title: 'Worth adding when it is true',
        items: [
          'Maintenance plan sign-up, if you offer one',
          'A careers page, when you are hiring',
          'Before-and-after photos of real jobs',
          'Short job videos from your own phone',
          'Specials, only real ones with an end date',
        ],
      },
    },
  ],

  includes: {
    heading: 'What a plumbing website from Orbit includes.',
    intro: 'Every build includes the cards below except the one marked Premium. The pages and forms are then shaped around the jobs and towns you want more of.',
    items: [
      ['Tap-to-call on every page', 'Your number stays visible on phones, with a call button in the header and next to every form.'],
      ['Emergency, quote and booking paths', 'A fast route for urgent problems, a quote form for planned work and a book-online button for routine jobs, with requests sent to the inbox you choose.'],
      ['License, insurance and reviews', 'Your license number, insurance details, real reviews linked to your Google profile, financing if you offer it, and real job photos, placed where customers decide.'],
      ['Hand-coded and fast', 'Built in Next.js, mobile-first, with local SEO basics and no page builder or plugin stack to keep updating.'],
      ['Premium: service pages and booking', 'Premium builds add a page for each core service and service area, structured data, analytics, and booking wired into the scheduling tool you already use.'],
      ['Yours to keep', 'You approve the finished site before the final payment, and then it is yours. Hosting with us is optional.'],
    ],
  },

  examples: {
    heading: 'Two sample demos you can click through.',
    intro:
      'These are demo homepages for made-up companies with fictional 555 phone numbers, not client sites. The plumbing demo shows an emergency block, a service list and a short FAQ. The heating and cooling demo is here because many shops do both. Your own site is designed from scratch around your jobs and towns.',
    demos: ['sample-plumbing-co-ewing', 'sample-hvac-co-hamilton'],
  },

  process: {
    heading: 'How a plumbing website gets built.',
    intro: 'Five steps, and the people you talk to on the first call are the people who build the site.',
  },

  pricing: {
    question: 'How much does a plumbing website cost?',
    lead: 'The price depends on how many service and town pages you need, whether the copy is written from scratch, whether booking is wired into your scheduling software, and whether you want AI intake for after-hours calls.',
  },

  faqHeading: 'What plumbers ask before hiring us.',
  faqs: [
    [
      'Should emergency plumbing and scheduled work be on separate pages?',
      'Usually, yes. Someone with an active leak wants to call right away, while someone pricing a water heater wants details first. An emergency page with a large call button, plus service pages with quote forms or a book-online button for planned work, serves both without slowing either one down.',
    ],
    [
      'Where should my plumbing license number go?',
      'Anywhere a customer is deciding whether to trust you: the footer of every page, next to each quote form and on the about page. Customers can often look a license up online, and some states require the number on advertising, so check your licensing board’s rules too.',
    ],
    [
      'Should I mention financing on my plumbing website?',
      'Only if you really offer it. If you do, put it on the pages for bigger jobs, such as water heater replacement, sewer lines and repiping, with a link to the application. Use the wording your lender provides, because advertising specific payment terms brings disclosure rules with it.',
    ],
    [
      'Do I need a separate page for every town I serve?',
      'No. Start with a clear list of the towns you cover, and write full pages only for the few where you want more work and have something specific to say. A page that only swaps in a town name helps nobody, and Google’s spam policies describe pages like that as doorway pages.',
    ],
    [
      'Should a plumber show prices on the website?',
      'Some jobs are priced much the same way each time, such as a service-call fee, a standard drain clearing or a toilet swap. A "starting at" figure for those can screen out shoppers before they call. Water heaters, sewer lines and repiping depend on what you find, so explain what moves the price, like tank or tankless, access, permits and the condition of the line, and ask for photos on the quote form.',
    ],
    [
      'Should a plumber use a website template or a builder like Wix?',
      'It depends on where the business is. A template or builder is cheap and quick to start, and for a new one-truck shop it beats having no site. The trade-offs show up later: plugins and heavy scripts slow pages on phones, the layout is made for any business rather than for emergency calls and quote requests, and you rent the platform instead of owning the site. Custom work pays off once the site has to split emergencies from planned jobs, take bookings and load fast on one bar of signal in a basement.',
    ],
    siteFaq('Do you build on WordPress, Wix or Squarespace?'),
    [
      'Can you guarantee my plumbing company ranks on Google?',
      'No. Nobody can honestly promise a ranking, and we don’t. Plumbing searches are often urgent and local, like “emergency plumber near me” late at night, and the map results depend partly on how close the person searching is and on your Google Business Profile, which no website controls. What the site can do is make it obvious which jobs you do and where: clear headings, fast pages and, on premium builds, a page for each core service and town. The optional monthly plans after launch add ongoing local SEO.',
    ],
  ],

  related: {
    posts: ['should-plumbing-company-have-website', 'home-service-website-structure', 'local-seo-website-structure-service-business'],
    links: [
      ['Check your current site for free', '/free-website-check'],
      ['Get a price range in 60 seconds', '/quote'],
      ['AI intake for after-hours calls', '/services#ai-operations'],
    ],
  },

  cta: {
    title: 'Let’s build your plumbing website.',
    copy: 'Book a free call and tell us which jobs and towns you want more of. You talk directly with the people who build the site.',
  },
}
