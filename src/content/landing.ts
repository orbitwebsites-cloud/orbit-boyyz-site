// GENERATED from src/App.tsx (townWebDesignPages, industryWebDesignPages, webDesign*, localWebDesignLinks, faqs, services, localUseCases) (old site, read-only) by a one-off extraction script.
// Copy started verbatim; town intro/local/faqs and audience were rewritten 2026-10-01 (SEO audit:
// near-duplicate town pages). Edit here if the owner changes wording.

export type TownPage = {
  path: string
  label: string
  town: string
  county: string
  nearby: string
  audience: string
  /** Unique opening paragraph (hero lead). */
  intro: string
  /** Two town-specific "what you get" cards. */
  local: Array<[title: string, copy: string]>
  /** Two town-specific FAQs, shown on the page and marked up as FAQPage. */
  faqs: Array<[question: string, answer: string]>
}
export type IndustryPage = {
  path: string
  label: string
  industry: string
  industryShort: string
  jobType: string
  avgJob: string
  aiUseCase: string
  towns: string
  // Optional per-trade blocks (SEO plan 2026-10-02). A trade without them
  // renders the shared template exactly as before; add them one trade at a time.
  /** Cost H2 phrased the way people ask it + a 40–60 word direct answer, shown above the shared tier table. */
  cost?: { question: string; answer: string }
  /** Prominent link to the lead-response / AI intake offer for this trade. */
  leadSystem?: { title: string; copy: string; href: string; anchor: string }
  /** Trade-specific page that replaces the shared template body. */
  rewrite?: IndustryRewrite
}

/** A trade page written for that trade only (the model for de-templating the others). */
export type IndustryRewrite = {
  /** H1 as [before, accent, after]; the accent renders in the serif gold. */
  h1: [before: string, accent: string, after: string]
  lead: string
  leadPathsIntro: string
  /** One H2 per job type the trade wants more of, each with its own intake questions. */
  leadPaths: Array<{ id: string; title: string; body: string; intake: string[] }>
  routing: { title: string; body: string; lanes: Array<{ name: string; items: string[] }>; note: string }
  license: { title: string; body: string; placements: string[] }
  areas: string
  faqHeading: string
  /** Shown on the page and marked up as its FAQPage (lib/legacy-seo). */
  faqs: Array<[question: string, answer: string]>
  cta: { title: string; copy: string }
}

/** "a" or "an" by sound: acronyms are read letter by letter ("an HVAC"), words by their first vowel ("an electrical"). */
export function aOrAn(word: string) {
  if (/^[A-Z]{2,}\b/.test(word)) return /^[AEFHILMNORSX]/.test(word) ? 'an' : 'a'
  return /^[aeiou]/i.test(word) && !/^(?:one|uni|use|usu|eu)/i.test(word) ? 'an' : 'a'
}

/** Lowercase for mid-sentence use, but keep acronyms like HVAC as-is. */
export const inlineName = (s: string) => (/^[A-Z]{2,}$/.test(s) ? s : s.toLowerCase())

/** Shared tier table under each trade's cost answer. Real Orbit tiers: keep in step with content/site tiers + carePlans. */
export const websiteCostTiers: Array<[tier: string, price: string, covers: string]> = [
  ['Launch build', 'Quoted on a free call', '7-day sprint, 50% to start. A custom mobile site with call, quote and booking paths.'],
  ['Premium build', 'From $3,500', 'Deeper strategy and copy, service and area pages, structured data and analytics.'],
  ['AI operations', '$5,000–$15,000+', 'AI intake, urgency routing, booking and follow-up. Optional retainer $750–$2,500/mo.'],
  ['Monthly plans (optional)', '$300–$700/mo', 'Site Care $300, Website + Leads Plan $500, Growth Partner $700. Month to month, after launch.'],
]

/** Generic town landing pages. Ewing and Central NJ have custom pages (see landing-custom.ts). */
export const townPages: Record<string, TownPage> = {
  "plainsboro": {
    "path": "/web-design-plainsboro-nj",
    "label": "[WEB DESIGN // PLAINSBORO NJ]",
    "town": "Plainsboro, NJ",
    "county": "Middlesex County",
    "nearby": "Princeton, West Windsor, Cranbury, Monroe, and South Brunswick",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "Plainsboro is our home base. We build websites for the HVAC, plumbing, electrical, and remodeling companies that work the condo, townhome, and apartment communities between Route 1, Scudders Mill Road, and Plainsboro Road, plus the single-family streets toward Cranbury.",
    "local": [
      [
        "Condo and HOA work",
        "A lot of Plainsboro housing sits in managed communities, so many jobs start with a property manager or HOA, not just a homeowner. Your site should make it easy for both to request service and send unit details."
      ],
      [
        "Searches that cross the county line",
        "Plainsboro is in Middlesex County, but people here also compare Princeton, West Windsor, and Cranbury companies. Your service-area copy should say plainly which neighboring towns you cover."
      ]
    ],
    "faqs": [
      [
        "Is Orbit Websites actually based in Plainsboro?",
        "Yes. The studio is in Plainsboro, so you talk directly with the people building your site, and we can meet in person nearby when that helps."
      ],
      [
        "Should my site name the apartment and condo communities I work in?",
        "Only the ones where you really do regular work. Naming a few communities you serve often can help customers trust you; listing every complex just to rank looks spammy to people and to Google."
      ]
    ]
  },
  "westWindsor": {
    "path": "/web-design-west-windsor-nj",
    "label": "[WEB DESIGN // WEST WINDSOR NJ]",
    "town": "West Windsor Township, NJ",
    "county": "Mercer County",
    "nearby": "Princeton, Plainsboro, Lawrence Township, Hamilton, and Cranbury",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "West Windsor homeowners compare contractors carefully, and many commute through Princeton Junction, so they search and book from a phone in the evening. We build websites for West Windsor home-service companies that need to look established and take requests after hours.",
    "local": [
      [
        "After-hours requests",
        "With so many commuters, evening and weekend requests are common in West Windsor. A quote form that collects job details at 9 pm beats a voicemail you return the next afternoon."
      ],
      [
        "The names locals use",
        "Customers search for Princeton Junction, Dutch Neck, and Grover's Mill as well as West Windsor. Your service-area copy should use the names people actually say."
      ]
    ],
    "faqs": [
      [
        "Should I target Princeton Junction or West Windsor?",
        "Both, on the same page. Princeton Junction is part of West Windsor Township and people search for either name. One strong page that mentions both beats two thin ones."
      ],
      [
        "Do West Windsor customers really book online?",
        "Many prefer it. A form that lets someone describe the job, attach a photo, and pick a callback window catches the people who won't phone during work hours."
      ]
    ]
  },
  "princeton": {
    "path": "/web-design-princeton-nj",
    "label": "[WEB DESIGN // PRINCETON NJ]",
    "town": "Princeton, NJ",
    "county": "Mercer County",
    "nearby": "Plainsboro, West Windsor, Lawrence Township, and Hamilton",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "Princeton customers expect a polished first impression, whether the job is an older house in one of the historic districts or a newer home on the edge of town. We build websites for home-service companies that need to earn that trust before the first call.",
    "local": [
      [
        "Older-home expertise",
        "Princeton has many older houses and several historic districts. If your crew handles older wiring, plumbing, boilers, or slate and cedar roofs, show it with real photos and specifics. That is a real reason to choose you."
      ],
      [
        "One Princeton since 2013",
        "Princeton Borough and Princeton Township merged into one municipality in 2013. Your site should simply say Princeton and can mention nearby Kingston and Rocky Hill if you work there."
      ]
    ],
    "faqs": [
      [
        "Do I need a Princeton page if I already mention Mercer County?",
        "Usually yes. Princeton is searched on its own, and customers want proof you already work in town. A page with Princeton job photos and service details does more than a county-wide mention."
      ],
      [
        "What should a Princeton contractor show on their website?",
        "Real job photos, license and insurance details, clear service areas, and how fast you respond. Princeton customers usually compare several companies, so specifics beat slogans."
      ]
    ]
  },
  "hamilton": {
    "path": "/web-design-hamilton-nj",
    "label": "[WEB DESIGN // HAMILTON NJ]",
    "town": "Hamilton, NJ",
    "county": "Mercer County",
    "nearby": "Trenton, Ewing, Lawrence Township, Robbinsville, and Princeton",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "Hamilton is the most populous township in Mercer County, so home-service companies there compete with a lot of other trucks. We build websites that help Hamilton contractors show up for the neighborhood names people search and turn those visits into calls.",
    "local": [
      [
        "Neighborhood searches",
        "People search for Hamilton Square, Mercerville, Yardville, White Horse, and Groveville, not only Hamilton. Naming the sections you actually serve helps you match those searches."
      ],
      [
        "First to answer wins",
        "Hamilton customers often call whoever responds first. Click-to-call on every page and a short quote form keep you in the running when someone is comparing three companies at once."
      ]
    ],
    "faqs": [
      [
        "Should I build a page for each Hamilton neighborhood?",
        "Not at first. One strong Hamilton page that names the sections you serve usually beats five thin pages. Add separate pages later only if you have real projects to show in each one."
      ],
      [
        "Is Hamilton too competitive to rank in?",
        "It is crowded, but many competitors still have slow, generic sites. A fast site with clear services, real photos, and reviews has a fair shot over time. Nobody can honestly promise a ranking."
      ]
    ]
  },
  "lawrence": {
    "path": "/web-design-lawrence-nj",
    "label": "[WEB DESIGN // LAWRENCE NJ]",
    "town": "Lawrence Township, NJ",
    "county": "Mercer County",
    "nearby": "Princeton, Ewing, Hamilton, Trenton, and West Windsor",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "Lawrence Township runs from the Route 1 corridor to the village of Lawrenceville, and homeowners search both names. We build websites for Lawrence home-service companies that want to cover the whole township clearly.",
    "local": [
      [
        "Lawrence vs. Lawrenceville",
        "Lawrenceville is the village inside Lawrence Township, and customers search for both. Using both names, accurately, matches either search without keyword stuffing."
      ],
      [
        "Between Princeton and Trenton",
        "Lawrence sits between Princeton, Ewing, and Trenton, and many crews cover all four. A clear service-area list tells customers right away whether you will come to their street."
      ]
    ],
    "faqs": [
      [
        "Should my site say Lawrence or Lawrenceville?",
        "Both. The township is Lawrence; Lawrenceville is the village within it. Something like 'serving Lawrence Township, including Lawrenceville' is accurate and matches how people search."
      ],
      [
        "If I work Lawrence and Princeton, do I need two sites?",
        "No. One site with an accurate section for each town works better than a generic page that names neither."
      ]
    ]
  },
  "trenton": {
    "path": "/web-design-trenton-nj",
    "label": "[WEB DESIGN // TRENTON NJ]",
    "town": "Trenton, NJ",
    "county": "Mercer County",
    "nearby": "Hamilton, Ewing, Lawrence Township, Bordentown, and Burlington",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "Trenton is New Jersey's capital and the Mercer County seat, with dense rowhome neighborhoods and older buildings where repair calls come in fast. We build websites for Trenton-area home-service companies that need to catch those calls quickly.",
    "local": [
      [
        "Rowhomes and older buildings",
        "Much of Trenton’s housing is older rowhomes and multi-family buildings. If you handle older plumbing, heating, electrical, or roofing, show it with real job photos."
      ],
      [
        "Landlords and property managers",
        "Many Trenton repair calls come from owners managing several units. A request form that captures the address, unit, and tenant contact saves a round of phone tag."
      ]
    ],
    "faqs": [
      [
        "Should my Trenton website be in English and Spanish?",
        "If someone on your team speaks Spanish, say so and offer a Spanish contact option. Trenton has a large Spanish-speaking community. Only add Spanish pages you can actually support on the phone."
      ],
      [
        "Can the site handle requests from landlords with several properties?",
        "Yes. We can build a request form that takes multiple addresses or units and sends urgent problems, like no heat or an active leak, to your phone first."
      ]
    ]
  },
  "robbinsville": {
    "path": "/web-design-robbinsville-nj",
    "label": "[WEB DESIGN // ROBBINSVILLE NJ]",
    "town": "Robbinsville Township, NJ",
    "county": "Mercer County",
    "nearby": "Hamilton, East Windsor, Allentown, Bordentown, and Hightstown",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "Robbinsville has grown around its Town Center and newer developments, which means many homeowners with newer systems looking for maintenance, upgrades, and finishing work. We build websites for Robbinsville home-service companies that want those jobs.",
    "local": [
      [
        "Newer homes, different jobs",
        "Much of Robbinsville’s housing is newer, so demand leans toward maintenance plans, upgrades, finished basements, EV chargers, irrigation, and landscaping. Your site should lead with the services those homeowners want."
      ],
      [
        "The old name still shows up",
        "Robbinsville was formerly Washington Township, and some old directories still list it that way. Keep your site and listings consistent on the current name."
      ]
    ],
    "faqs": [
      [
        "Should I sell maintenance plans on my website?",
        "If you offer them, yes. Newer homes are a good fit for seasonal HVAC tune-ups, irrigation start-ups, and similar recurring work. A simple sign-up form turns one job into repeat business."
      ],
      [
        "Does it matter that Robbinsville used to be Washington Township?",
        "Only for consistency. Use Robbinsville on your site and listings, and update any old directory entry that still shows Washington Township."
      ]
    ]
  },
  "bordentown": {
    "path": "/web-design-bordentown-nj",
    "label": "[WEB DESIGN // BORDENTOWN NJ]",
    "town": "Bordentown, NJ",
    "county": "Burlington County",
    "nearby": "Trenton, Hamilton, Robbinsville, Burlington City, and Florence",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "Bordentown means two places: Bordentown City, with its historic downtown on Farnsworth Avenue, and the larger Bordentown Township around it. We build websites for home-service companies that work both, plus the Route 130 and Route 206 corridor nearby.",
    "local": [
      [
        "City and Township",
        "Bordentown City and Bordentown Township are separate municipalities, and customers don't always know which one they live in. Naming both lets people from either side see that you serve them."
      ],
      [
        "Right on the county line",
        "Bordentown is in Burlington County, next to Mercer. If you also work Hamilton, Trenton, or Robbinsville, say so. It tells customers you are close without needing extra pages."
      ]
    ],
    "faqs": [
      [
        "Do I need separate pages for Bordentown City and Bordentown Township?",
        "Usually not. One Bordentown page that clearly says you serve both is enough unless you have a lot of distinct work in each."
      ],
      [
        "Can a Burlington County company show up in Mercer County searches?",
        "It can, if your site lists the Mercer towns you serve and your Google Business Profile service area matches. Distance still matters, so be realistic about how far you reach."
      ]
    ]
  },
  "eastWindsor": {
    "path": "/web-design-east-windsor-nj",
    "label": "[WEB DESIGN // EAST WINDSOR NJ]",
    "town": "East Windsor, NJ",
    "county": "Mercer County",
    "nearby": "Robbinsville, Hightstown, West Windsor, Cranbury, and Monroe",
    "audience": "HVAC, plumbing, electrical, roofing, landscaping, and remodeling companies",
    "intro": "East Windsor surrounds the borough of Hightstown, sits on Routes 130 and 33, and has New Jersey Turnpike Exit 8 in town. We build websites for East Windsor home-service companies that cover that whole area.",
    "local": [
      [
        "East Windsor and Hightstown",
        "Hightstown is its own borough, surrounded by East Windsor, and customers search for both. Naming both matches how people describe where they live."
      ],
      [
        "Planned communities",
        "East Windsor has many townhome and condo communities, including Twin Rivers. A form that asks for the community name and unit helps you quote faster and handle HOA rules up front."
      ]
    ],
    "faqs": [
      [
        "Should I mention Hightstown on an East Windsor page?",
        "Yes, if you work there. Hightstown sits inside East Windsor, and many customers say one when they mean the other."
      ],
      [
        "Do HOA communities change what my website needs?",
        "Often. Say whether you handle HOA approval paperwork or work with property managers. In planned communities like Twin Rivers, that can decide who gets the call."
      ]
    ]
  }
}

export const industryPages: Record<string, IndustryPage> = {
  "hvac": {
    "path": "/website-design-for-hvac-companies-nj",
    "label": "[WEB DESIGN // HVAC NJ]",
    "industry": "HVAC companies",
    "industryShort": "HVAC",
    "jobType": "heating and cooling service calls",
    "avgJob": "$450–$1,200",
    "aiUseCase": "After-hours emergency requests are captured by AI intake, qualified by equipment type and urgency, and texted to your phone as a scoped summary — so no emergency call slips through overnight.",
    "towns": "Ewing, Hamilton, Lawrence Township, Trenton, Mercer County, and Central New Jersey",
    "cost": {
      "question": "How much does an HVAC website cost?",
      "answer": "An HVAC website with Orbit falls into one of three build tiers. A launch build is quoted on a free call and ships in a 7-day sprint. Premium builds start at $3,500. AI operations builds, with after-hours intake, urgency routing and booking, run $5,000–$15,000+. Optional monthly plans are $300–$700, and you own the site."
    },
    "leadSystem": {
      "title": "Pair the website with a lead response system.",
      "copy": "The website brings the calls in. Orbit Growth Systems answers the ones your crew can't pick up: missed-call text-back, follow-up on open estimates, and booking straight onto your calendar.",
      "href": "/growth",
      "anchor": "HVAC lead response system"
    }
  },
  "plumbing": {
    "path": "/website-design-for-plumbers-nj",
    "label": "[WEB DESIGN // PLUMBERS NJ]",
    "industry": "plumbing contractors",
    "industryShort": "Plumbing",
    "jobType": "plumbing service and repair calls",
    "avgJob": "$300–$1,500",
    "aiUseCase": "AI intake sorts emergency from scheduled jobs the moment a form is submitted — emergency requests fire a text to your phone in under 30 seconds, scheduled ones collect job description, address, and timing so you quote without a call.",
    "towns": "Ewing, Trenton, Hamilton, Lawrence, Princeton, Mercer County, and Central New Jersey",
    "cost": {
      "question": "How much does a plumbing website cost?",
      "answer": "A plumbing website with Orbit falls into one of three build tiers. A launch build is quoted on a free call and ships in a 7-day sprint. Premium builds start at $3,500. AI operations builds that sort emergency leaks from scheduled jobs and text you the details run $5,000–$15,000+. Optional monthly plans are $300–$700."
    },
    "leadSystem": {
      "title": "Catch the emergency calls you can't answer.",
      "copy": "Burst pipes and backed-up drains don't wait for a callback. AI intake sorts emergencies from scheduled work, texts you the address and details, and tells the customer what happens next.",
      "href": "/services#ai-operations",
      "anchor": "AI intake for plumbing emergency calls"
    }
  },
  "electrician": {
    "path": "/website-design-for-electricians-nj",
    "label": "[WEB DESIGN // ELECTRICIANS NJ]",
    "industry": "electricians and electrical contractors",
    "industryShort": "Electrical",
    "jobType": "electrical service and installation jobs",
    "avgJob": "$350–$2,000",
    "aiUseCase": "AI intake captures job type (panel upgrade, outlet repair, EV charger install), address, and urgency level. Residential and commercial requests are routed separately so you prioritize correctly without triaging a full voicemail box.",
    "towns": "Ewing, Princeton, Lawrence Township, Hamilton, West Windsor, Mercer County, and Central NJ",
    "cost": {
      "question": "How much does an electrician website cost?",
      "answer": "An electrician website runs from a launch build quoted on a free call to $5,000–$15,000+ for AI intake and routing. Premium builds with separate panel upgrade, EV charger and generator pages start at $3,500. The launch tier ships in a 7-day sprint. Optional monthly plans run $300–$700, month to month."
    },
    // Rewritten 2026-10-02 (the page did not rank, so it was safe to replace the template).
    "rewrite": {
      "h1": ["Website design for New Jersey ", "electricians", "."],
      "lead": "Panel upgrades, EV charger installs and standby generators bring in three different customers with three different questions. We build electrician websites that give each of those jobs its own page and intake form, keep commercial requests apart from homeowner calls, and put your New Jersey license number where people check it.",
      "leadPathsIntro": "A single \"electrical services\" page with a bullet list asks every visitor the same thing. The jobs that pay best don't work that way. Each one below gets its own page, its own answers and its own form, so the request that reaches you already has what you need to quote.",
      "leadPaths": [
        {
          "id": "panel-upgrades",
          "title": "Panel upgrade and service change leads",
          "body": "Most panel work starts with a trigger. A home inspection flags an old Federal Pacific or Zinsco panel, an insurer asks questions, or the owner wants central air, an induction range or a car charger the 100-amp service can't carry. These buyers are researching, not panicking, so the page explains why the upgrade matters, what the permit and inspection involve, and how long the power will be off.",
          "intake": [
            "Current service size and panel brand, if they know it",
            "A photo of the panel with the cover on",
            "What's driving it: inspection, new appliance, EV charger or addition",
            "Owner or landlord, and the town",
            "When they want the work done"
          ]
        },
        {
          "id": "ev-chargers",
          "title": "EV charger installation leads",
          "body": "EV charger buyers usually arrive with the car ordered and a charger already in the cart. Their questions are specific: can my panel handle it, how far is the garage from the panel, do I need a permit. A dedicated EV charger page with a photo-based quote form answers those before the call, and it catches the panel upgrades that come along when a load calculation says the service is too small.",
          "intake": [
            "Vehicle and charger model, or a request for a recommendation",
            "Mounting spot: garage, driveway or outside wall",
            "Rough distance from the panel to that spot",
            "Photos of the panel and the mounting spot",
            "House, condo or townhouse, since HOA approval may apply"
          ]
        },
        {
          "id": "generators",
          "title": "Standby generator and transfer switch leads",
          "body": "Generator demand in New Jersey follows the weather. After a nor'easter or a summer storm takes the power out for days, searches jump and people want an install date, not a brochure. The generator page explains standby units versus a portable with an inlet and interlock, asks the sizing questions up front, and offers a maintenance plan sign-up so one install becomes a yearly service visit. If you are a factory-authorized dealer, the page says so.",
          "intake": [
            "Whole-home backup or essential circuits only",
            "Fuel on site: natural gas or propane",
            "Any existing transfer switch or inlet",
            "Must-run loads such as a well pump, sump pump or medical equipment",
            "Planning ahead, or calling right after an outage"
          ]
        }
      ],
      "routing": {
        "title": "Residential and commercial requests, routed separately",
        "body": "A homeowner with a breaker that keeps tripping and a property manager pricing a tenant fit-out need different answers at different speeds. The form asks one question first, home or business, then sends each request down its own path to the inbox or phone you choose, with the details that kind of job needs.",
        "lanes": [
          {
            "name": "Residential",
            "items": [
              "Job type, address and photos",
              "Urgency: no power, partial outage or planned work",
              "A callback window that fits a workday"
            ]
          },
          {
            "name": "Commercial",
            "items": [
              "Company, site contact and building access hours",
              "Scope: fit-out, lighting retrofit, service call or maintenance contract",
              "Billing contact, PO number or bid due date"
            ]
          }
        ],
        "note": "Requests that mention a burning smell, sparking or a full outage are flagged and sent to your phone first."
      },
      "license": {
        "title": "Your NJ electrical license, shown where customers check",
        "body": "New Jersey licenses electrical contractors through the Board of Examiners of Electrical Contractors, and anyone can look up a license online in a minute. Plenty of homeowners do before they let someone open a panel or wire in a generator. We put your license number where that check happens, so the answer is already on the page.",
        "placements": [
          "In the header or footer on every page",
          "Next to every quote form",
          "On each service page",
          "On the about page, with your insurance details",
          "In the site's structured data"
        ]
      },
      "areas": "We build for electrical contractors across Mercer and Middlesex counties, including Plainsboro, Princeton, West Windsor, Hamilton, Ewing, Lawrence Township and Trenton. The studio is in Plainsboro, so you deal directly with the people building the site.",
      "faqHeading": "What NJ electricians ask before hiring us.",
      "faqs": [
        [
          "Should panel upgrades, EV chargers and generators each get their own page?",
          "Yes, if you want more of each. They are separate searches from different customers, and each needs its own answers and its own form. One \"electrical services\" page with a bullet list rarely ranks for any of them. Start with the two or three jobs you most want to grow."
        ],
        [
          "Can the site keep commercial requests away from homeowner calls?",
          "Yes. The form asks home or business first, then only the questions that matter for that kind of job. Commercial requests can go to a different email, phone number or person, so a bid request doesn't sit behind a stack of outlet repairs."
        ],
        [
          "Where should my NJ license number appear?",
          "Anywhere a customer is deciding whether to trust you: the header or footer, next to the quote form, on each service page and on the about page. It costs nothing and answers the question before they go looking."
        ],
        [
          "Should an electrician show prices on the website?",
          "For jobs you quote often, like a standard EV charger install, a \"starting at\" price can filter out poor fits, if you are comfortable publishing one. For panel upgrades and generators, explain what changes the price and ask for photos instead. Either way you get fewer calls that go nowhere."
        ],
        [
          "How long does an electrician website take?",
          "A launch build runs on a seven-day sprint once scope and direction are clear. Premium builds with a page per job type and routed intake get a timeline you agree to on the call, before you pay anything."
        ]
      ],
      "cta": {
        "title": "Let's build your electrician website.",
        "copy": "Book a free call and tell us which jobs you want more of. You talk directly with the people who build the site."
      }
    }
  },
  "landscaping": {
    "path": "/website-design-for-landscaping-companies-nj",
    "label": "[WEB DESIGN // LANDSCAPING NJ]",
    "industry": "landscaping and lawn care companies",
    "industryShort": "Landscaping",
    "jobType": "landscaping and lawn maintenance contracts",
    "avgJob": "$2,400–$6,000/year per client",
    "aiUseCase": "An AI proposal form collects property size, service frequency, and preferred start date. It auto-sends a scoped price range by email so you spend time converting real buyers, not answering basic questions over the phone.",
    "towns": "Princeton, West Windsor, Plainsboro, Ewing, Hamilton, Mercer County, and Central NJ"
  }
}

/** "What our web design includes" — /web-design-central-nj */
export const webDesignIncludes: Array<[title: string, copy: string]> = [
  [
    "Custom design, never a template",
    "Every site is designed from scratch around your business and your market — built to make you look like the most credible option a customer can call."
  ],
  [
    "Hand-coded, mobile-first build",
    "Fast, lightweight pages that stay sharp on every phone, because most local searches happen on mobile and slow sites lose the click."
  ],
  [
    "Conversion-focused copy",
    "Clear messaging and calls-to-action engineered to turn visitors into phone calls, quote requests, and booked work — not just compliments."
  ],
  [
    "Local SEO foundations",
    "Clean structure, local schema, prerendered pages, and the technical groundwork that search engines and AI assistants reward."
  ],
  [
    "Contact, booking & lead paths",
    "Click-to-call, contact forms, booking buttons, and quote flows wired to how your business actually takes on work."
  ],
  [
    "Launch on Vercel & full handoff",
    "We design, build, test, and launch — then hand off a fast, modern site that you fully own."
  ]
]

/** "Towns we design websites for" — /web-design-central-nj */
export const webDesignTowns: Array<[town: string, copy: string]> = [
  [
    "Plainsboro, NJ",
    "Our home base. We build websites for Plainsboro home-service contractors and local service businesses that want to be the obvious local choice."
  ],
  [
    "Princeton, NJ",
    "Premium websites for Princeton firms, practices, and boutiques where presentation and trust directly drive the sale."
  ],
  [
    "West Windsor Township, NJ",
    "Conversion-focused sites for West Windsor contractors, home services, and local providers competing on quality."
  ],
  [
    "Ewing, Hamilton & Lawrence, NJ",
    "Websites and AI automation for businesses in Ewing, Hamilton Township, and Lawrence that want to stand out in a competitive local market."
  ],
  [
    "Across Central New Jersey",
    "We also serve Hopewell, Trenton, Robbinsville, East Windsor, Hightstown, Cranbury, Monroe, and Pennington — businesses anywhere in Central NJ."
  ]
]

export const webDesignFit: string[] = [
  "You compete on quality and trust, not the lowest price.",
  "One new customer is worth hundreds or thousands of dollars to you.",
  "You want a site that can also automate intake, booking, and follow-up.",
  "You value a fast, hand-built website that you fully own."
]

export const webDesignNotFit: string[] = [
  "You need a $300 template site live by the weekend.",
  "Cheapest-possible is the only thing that matters.",
  "You are not ready to invest in how your business shows up online."
]

/** "[LOCAL PAGES // MERCER COUNTY]" link grid on every landing page. */
export const localWebDesignLinks: Array<[label: string, href: string]> = [
  [
    "Central New Jersey",
    "/web-design-central-nj"
  ],
  [
    "Plainsboro, NJ",
    "/web-design-plainsboro-nj"
  ],
  [
    "West Windsor, NJ",
    "/web-design-west-windsor-nj"
  ],
  [
    "Ewing, NJ",
    "/web-design-ewing-nj"
  ],
  [
    "Princeton, NJ",
    "/web-design-princeton-nj"
  ],
  [
    "Hamilton, NJ",
    "/web-design-hamilton-nj"
  ],
  [
    "Lawrence Township, NJ",
    "/web-design-lawrence-nj"
  ],
  [
    "Trenton, NJ",
    "/web-design-trenton-nj"
  ],
  [
    "Robbinsville, NJ",
    "/web-design-robbinsville-nj"
  ],
  [
    "Bordentown, NJ",
    "/web-design-bordentown-nj"
  ],
  [
    "East Windsor, NJ",
    "/web-design-east-windsor-nj"
  ]
]

/** Old site FAQ list (the first 3 are shown + marked up on /web-design-central-nj). */
export const legacyFaqs: Array<[question: string, answer: string]> = [
  [
    "Why hand-coded Next.js instead of a free website builder?",
    "Speed, security, and zero platform limitations. Free builders load heavy scripts and third-party plugins that slow your site down and tank your mobile score. Hand-coded Next.js is lean, blazing-fast, and built to rank — most of our sites score 90+ on mobile performance and load in under 1 second."
  ],
  [
    "How long does it take to launch?",
    "A launch build runs on a seven-day sprint once scope and direction are clear. You approve the finished site before the final payment, then we connect it to your domain."
  ],
  [
    "What does a monthly care plan cover?",
    "Care plans are optional and start only after launch. They cover fast managed hosting, security updates, backups and content changes — just text us what you need updated and we handle it, no tech knowledge required on your end."
  ],
  [
    "Is OrbitBoyzz the same as Orbit Websites?",
    "Yes. OrbitBoyzz is the domain and brand handle for Orbit Websites, a Plainsboro, NJ website design and performance studio."
  ],
  [
    "Where is Orbit Websites based?",
    "Orbit Websites is based in Plainsboro, NJ and serves businesses across Central New Jersey — including Princeton, West Windsor, Ewing, Hamilton, Lawrence, and Trenton."
  ],
  [
    "What kinds of businesses do you build websites for?",
    "HVAC companies, plumbers, electricians, roofers, landscapers, contractors, and other established home-service businesses that need more calls and bookings from mobile search."
  ],
  [
    "Can you add calls, email, booking, or quote forms?",
    "Yes. We wire in click-to-call, quote request forms, booking buttons, and lead capture flows — built around exactly how your business takes on new work."
  ],
  [
    "Do you guarantee Google rankings?",
    "We set up strong local SEO foundations and clean page structure that search engines reward. We do not promise specific rankings — no one can — but your site will be built the right way from day one."
  ],
  [
    "What is the Enterprise Custom Build?",
    "The Enterprise tier ($3,500+) is for businesses that need advanced systems — automated intake, AI-powered lead triage, CRM integrations, and custom proposal workflows. Launch websites are quoted on a free call, AI operations systems run $5,000–$15,000+, and optional care plans are $300–$700/mo."
  ]
]

/** Old ServicesPreview cards (shown on /orbitboyzz). */
export const legacyServices: Array<{ id: string; title: string; copy: string; icon: string }> = [
  {
    "id": "[01 // WEBSITE]",
    "title": "New Website Design",
    "copy": "Premium website systems for local brands that need trust, clarity, calls, bookings, and a serious first impression.",
    "icon": "Sparkles"
  },
  {
    "id": "[02 // REFRESH]",
    "title": "Website Refreshes",
    "copy": "Cleaner copy, more modern layouts, mobile-first structure, and sharper conversion paths for businesses with outdated sites.",
    "icon": "FileText"
  },
  {
    "id": "[03 // SEO]",
    "title": "Local SEO Foundations",
    "copy": "Service pages, area signals, structured content, and technical basics that help customers understand what you do and where you serve.",
    "icon": "Search"
  },
  {
    "id": "[04 // FORMS]",
    "title": "Booking & Lead Forms",
    "copy": "Click-to-call, email, quote, booking, and lead capture flows that make the next step obvious.",
    "icon": "CalendarClock"
  },
  {
    "id": "[05 // INTAKE]",
    "title": "Instant Booking Engine",
    "copy": "Smart intake forms that capture job details, qualify urgency, and text you a lead summary — so no inquiry slips through after hours.",
    "icon": "Workflow"
  },
  {
    "id": "[06 // OPS]",
    "title": "Quote & Proposal Automation",
    "copy": "Automated quote forms that collect job specs and send a priced proposal link in minutes — no back-and-forth phone tag required.",
    "icon": "DatabaseZap"
  }
]

/** Old AreasSection rows (shown on /orbitboyzz). */
export const localUseCases: Array<[title: string, copy: string]> = [
  [
    "Websites for HVAC, plumbing, and electrical contractors",
    "Emergency call paths, service areas, quote forms, and reviews"
  ],
  [
    "Websites for real estate and local service brands",
    "Service pages, listings, forms, and trust signals"
  ],
  [
    "Website refreshes for businesses with outdated sites",
    "Cleaner copy, mobile layout, faster calls to action"
  ]
]

/** Town FAQ: shown on the page and marked up as FAQPage (lib/legacy-seo). */
export function townLandingFaqs(page: TownPage): Array<[string, string]> {
  return [
    [
      `How much does web design cost in ${page.town}?`,
      `Launch builds for ${page.town} businesses are quoted on a free call after a quick look at your needs, and premium builds start at $3,500. AI intake, booking logic, quote routing, and deeper automation run $5,000 to $15,000+, and optional monthly plans are $300–$700/mo.`,
    ],
    ...page.faqs,
    [
      `Do you work with businesses near ${page.town}?`,
      `Yes. Orbit Websites serves ${page.town}, ${page.county}, and nearby areas including ${page.nearby}.`,
    ],
  ]
}

/**
 * Industry FAQ: shown on the trade page and marked up as its FAQPage (lib/legacy-seo).
 * A rewritten trade page uses its own FAQs; the others keep the old template set.
 */
export function industryLandingFaqs(page: IndustryPage): Array<[string, string]> {
  if (page.rewrite) return page.rewrite.faqs
  const name = inlineName(page.industryShort)
  const a = aOrAn(name)
  return [
    [
      `How much does a website cost for ${a} ${name} company in NJ?`,
      `A focused launch site for ${a} ${name} company is quoted on a free call after a quick look at your needs, and premium builds start at $3,500. AI intake, routing, booking, proposal logic, and deeper custom workflows run $5,000 to $15,000+, and optional care plans are $300–$700/mo.`,
    ],
    [
      `What should ${a} ${name} website include?`,
      `A strong ${name} website should include service details, local service areas, trust signals, clear calls to action, mobile-first pages, and an intake path built around ${page.jobType}.`,
    ],
    [
      'When does AI intake make sense?',
      `AI intake makes sense when faster response or better qualification can recover revenue. For ${name} businesses, it can collect the details staff need before calling back and route higher-value requests sooner.`,
    ],
  ]
}

/** Ewing FAQ: shown on /web-design-ewing-nj and marked up as its FAQPage (lib/legacy-seo). */
export const ewingFaqs: Array<[string, string]> = [
  [
    'How much does web design cost in Ewing, NJ?',
    'Launch builds for Ewing businesses are quoted on a free call after a quick look at your needs, and premium builds start at $3,500. AI intake, booking logic, quote routing, and deeper automation run $5,000 to $15,000+, and optional monthly plans are $300–$700/mo.',
  ],
  [
    'Do you work with businesses near Ewing?',
    'Yes. Orbit Websites serves Ewing Township, Mercer County, and nearby towns including Trenton, Lawrence, Hamilton, Princeton, and West Windsor.',
  ],
  [
    'What makes an Ewing local business website convert?',
    'The site needs clear services, local proof, fast mobile pages, direct click-to-call actions, quote or booking paths, and enough service-area context for buyers and search engines to understand the business quickly.',
  ],
]
