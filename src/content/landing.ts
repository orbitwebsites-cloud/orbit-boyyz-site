// GENERATED from src/App.tsx (townWebDesignPages, industryWebDesignPages, webDesign*, localWebDesignLinks, faqs, services, localUseCases) (old site, read-only) by a one-off extraction script.
// Copy is verbatim — do not rewrite. Edit here if the owner changes wording.

export type TownPage = {
  path: string
  label: string
  town: string
  county: string
  nearby: string
  audience: string
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
}

/** Generic town landing pages. Ewing and Central NJ have custom pages (see landing-custom.ts). */
export const townPages: Record<string, TownPage> = {
  "plainsboro": {
    "path": "/web-design-plainsboro-nj",
    "label": "[WEB DESIGN // PLAINSBORO NJ]",
    "town": "Plainsboro, NJ",
    "county": "Middlesex County",
    "nearby": "Princeton, West Windsor, Cranbury, Monroe, and South Brunswick",
    "audience": "service businesses, clinics, restaurants, shops, consultants, and local providers"
  },
  "westWindsor": {
    "path": "/web-design-west-windsor-nj",
    "label": "[WEB DESIGN // WEST WINDSOR NJ]",
    "town": "West Windsor Township, NJ",
    "county": "Mercer County",
    "nearby": "Princeton, Plainsboro, Lawrence Township, Hamilton, and Cranbury",
    "audience": "contractors, professional services, clinics, restaurants, real estate teams, and local companies"
  },
  "princeton": {
    "path": "/web-design-princeton-nj",
    "label": "[WEB DESIGN // PRINCETON NJ]",
    "town": "Princeton, NJ",
    "county": "Mercer County",
    "nearby": "Plainsboro, West Windsor, Lawrence Township, and Hamilton",
    "audience": "firms, clinics, boutiques, consultants, home service companies, and local providers"
  },
  "hamilton": {
    "path": "/web-design-hamilton-nj",
    "label": "[WEB DESIGN // HAMILTON NJ]",
    "town": "Hamilton, NJ",
    "county": "Mercer County",
    "nearby": "Trenton, Ewing, Lawrence Township, Robbinsville, and Princeton",
    "audience": "contractors, home service companies, clinics, restaurants, and local service providers"
  },
  "lawrence": {
    "path": "/web-design-lawrence-nj",
    "label": "[WEB DESIGN // LAWRENCE NJ]",
    "town": "Lawrence Township, NJ",
    "county": "Mercer County",
    "nearby": "Princeton, Ewing, Hamilton, Trenton, and West Windsor",
    "audience": "professional services, clinics, contractors, restaurants, and local companies"
  },
  "trenton": {
    "path": "/web-design-trenton-nj",
    "label": "[WEB DESIGN // TRENTON NJ]",
    "town": "Trenton, NJ",
    "county": "Mercer County",
    "nearby": "Hamilton, Ewing, Lawrence Township, Bordentown, and Burlington",
    "audience": "contractors, food businesses, nonprofits, professional services, and local providers"
  },
  "robbinsville": {
    "path": "/web-design-robbinsville-nj",
    "label": "[WEB DESIGN // ROBBINSVILLE NJ]",
    "town": "Robbinsville Township, NJ",
    "county": "Mercer County",
    "nearby": "Hamilton, East Windsor, Allentown, Bordentown, and Hightstown",
    "audience": "contractors, home service companies, shops, clinics, and growing local businesses"
  },
  "bordentown": {
    "path": "/web-design-bordentown-nj",
    "label": "[WEB DESIGN // BORDENTOWN NJ]",
    "town": "Bordentown, NJ",
    "county": "Burlington County",
    "nearby": "Trenton, Hamilton, Robbinsville, Burlington City, and Florence",
    "audience": "contractors, restaurants, shops, service businesses, and local providers"
  },
  "eastWindsor": {
    "path": "/web-design-east-windsor-nj",
    "label": "[WEB DESIGN // EAST WINDSOR NJ]",
    "town": "East Windsor, NJ",
    "county": "Mercer County",
    "nearby": "Robbinsville, Hightstown, West Windsor, Cranbury, and Monroe",
    "audience": "home service companies, contractors, clinics, shops, and local businesses"
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
    "towns": "Ewing, Hamilton, Lawrence Township, Trenton, Mercer County, and Central New Jersey"
  },
  "plumbing": {
    "path": "/website-design-for-plumbers-nj",
    "label": "[WEB DESIGN // PLUMBERS NJ]",
    "industry": "plumbing contractors",
    "industryShort": "Plumbing",
    "jobType": "plumbing service and repair calls",
    "avgJob": "$300–$1,500",
    "aiUseCase": "AI intake sorts emergency from scheduled jobs the moment a form is submitted — emergency requests fire a text to your phone in under 30 seconds, scheduled ones collect job description, address, and timing so you quote without a call.",
    "towns": "Ewing, Trenton, Hamilton, Lawrence, Princeton, Mercer County, and Central New Jersey"
  },
  "electrician": {
    "path": "/website-design-for-electricians-nj",
    "label": "[WEB DESIGN // ELECTRICIANS NJ]",
    "industry": "electricians and electrical contractors",
    "industryShort": "Electrical",
    "jobType": "electrical service and installation jobs",
    "avgJob": "$350–$2,000",
    "aiUseCase": "AI intake captures job type (panel upgrade, outlet repair, EV charger install), address, and urgency level. Residential and commercial requests are routed separately so you prioritize correctly without triaging a full voicemail box.",
    "towns": "Ewing, Princeton, Lawrence Township, Hamilton, West Windsor, Mercer County, and Central NJ"
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
  },
  "dental": {
    "path": "/website-design-for-dental-practices-nj",
    "label": "[WEB DESIGN // DENTAL NJ]",
    "industry": "dental practices and orthodontists",
    "industryShort": "Dental",
    "jobType": "new patient appointments",
    "avgJob": "$800–$4,000/year per patient",
    "aiUseCase": "New patient intake captures insurance carrier, treatment interest, and preferred appointment window before any staff involvement. Urgent cases (toothache, broken crown) trigger a same-day callback flag automatically.",
    "towns": "Princeton, West Windsor, Plainsboro, Lawrence Township, East Windsor, and Central NJ"
  },
  "restaurants": {
    "path": "/website-design-for-restaurants-nj",
    "label": "[WEB DESIGN // RESTAURANTS NJ]",
    "industry": "restaurants, caterers, bakeries, and cafes",
    "industryShort": "Restaurant",
    "jobType": "orders, reservations, catering leads, and private event inquiries",
    "avgJob": "$500-$5,000+ per catering or event lead",
    "aiUseCase": "AI catering intake collects guest count, date, service style, menu preferences, dietary notes, delivery location, and budget range so staff can respond with a clearer proposal instead of chasing details by phone.",
    "towns": "Plainsboro, Princeton, West Windsor, Ewing, Hamilton, Robbinsville, and Central NJ"
  },
  "clinics": {
    "path": "/website-design-for-clinics-nj",
    "label": "[WEB DESIGN // CLINICS NJ]",
    "industry": "clinics, med spas, and appointment-based healthcare practices",
    "industryShort": "Clinic",
    "jobType": "consultation requests, appointment bookings, and patient intake forms",
    "avgJob": "$250-$3,000+ per patient or treatment plan",
    "aiUseCase": "AI intake collects appointment type, preferred location, urgency, insurance or payment context, and treatment interest so staff can prioritize qualified requests and reduce phone tag.",
    "towns": "Princeton, Plainsboro, West Windsor, Hamilton, Lawrence Township, East Windsor, and Central NJ"
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
    "Our home base. We build websites for Plainsboro service businesses, clinics, and shops that want to be the obvious local choice."
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
    "Once you approve your custom live demo, we can connect it to your domain and go live in under 48 hours."
  ],
  [
    "What does the monthly fee cover?",
    "Premium blazing-fast global hosting, continuous security updates, and unlimited text and photo changes. Just text us what you need updated and we handle it — no tech knowledge required on your end."
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
    "Contractors, detailers, HVAC technicians, plumbers, electricians, landscapers, restaurants, clinics, and any local service business that needs more calls and bookings from mobile search."
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
    "Websites for restaurants, bakeries, and food businesses",
    "Menus, ordering links, hours, location, and contact"
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
