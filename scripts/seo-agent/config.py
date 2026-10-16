"""
Orbit Boyzz SEO/GEO/AEO Agent — Configuration
"""

OUR_SITE_URL = "https://orbitboyzz.com"

# Seed queries — the expander auto-generates PAA variants from these.
# Keep focused on commercial intent; the expander handles the long tail.
TARGET_QUERIES = [
    # Cost / decision — highest intent
    "how much does a custom website cost for a local business",
    "how much does an AI website cost small business",
    "custom web design vs Wix Squarespace template",
    "AI operations website vs regular website",
    "website cost for local service business NJ",
    # Industry — feed industry landing pages
    "website design for HVAC company New Jersey",
    "website for plumber NJ",
    "website for electrician Central NJ",
    "landscaping company website NJ",
    "AI automation for HVAC company intake and dispatch",
    "AI receptionist for plumbing contractor",
    "speed to lead home services contractor",
    # Local commercial — feed town landing pages
    "web design agency Central New Jersey",
    "web design Ewing NJ",
    "web design Trenton NJ",
    "web design Hamilton NJ",
    "web design Princeton NJ",
    "web design Mercer County NJ",
    "small business website Robbinsville NJ",
    # AI / automation
    "AI automation for home services NJ",
    "should my home services business get an AI intake system",
    # Lead data for outbound agencies (leads.orbitboyzz.com)
    "exclusive verified lead lists for cold email agencies",
    "Clay alternative lead lists for agencies",
]

# How many PAA-style questions to auto-generate per run (0 = disabled)
EXPAND_QUERIES_COUNT = 6

# Our key pages — crawler auto-discovers from sitemap, falls back to these
OUR_KEY_PAGES = [
    "https://orbitboyzz.com/",
    "https://orbitboyzz.com/pricing",
    "https://orbitboyzz.com/web-design-central-nj",
    "https://orbitboyzz.com/blog/web-design-cost-factors-mercer-county-nj",
    "https://leads.orbitboyzz.com/",
]

# Static site summary used when live fetch fails (update monthly).
# Facts only, from src/content/site.ts, src/content/leads.ts and public/pricing.md
# (last synced 2026-10-16). No invented stats, results, reviews or prices.
OUR_SITE_SUMMARY = """
Company: Orbit Websites (also OrbitBoyzz / Orbit Boyzz) — https://orbitboyzz.com
Location: Plainsboro, NJ — Central New Jersey service area
(Plainsboro, Princeton, West Windsor, Ewing, Hamilton, Lawrence, Hopewell, Trenton,
Robbinsville, East Windsor, Bordentown)

Website services (pricing as published on /pricing):
  1. Launch build — quoted on a free call. 7-day sprint, 50% to start, 50% on approval.
  2. Premium build — from $3,500. Hand-coded Next.js, Tailwind, Vercel.
  3. AI operations — $5,000–$15,000+ build; optional retainer $750–$2,500/mo, recommended
     only when it replaces measurable admin labor or recovers high-intent leads.
  4. Care plans — optional, month to month, after launch: $300 / $500 / $700 per month.

Ideal client: established home-service businesses (HVAC, plumbing, electrical, roofing,
  landscaping, remodeling) in Central NJ. Not a fit: medical, dental and legal practices.

Second offer, https://leads.orbitboyzz.com/: exclusive, verified lead lists for US outbound
  and lead-gen agencies. 25 free leads to test, then 300 for qualified agencies; replaces
  Clay + Apollo spend for at least 30% less or they don't pay; month-to-month; 10 agencies
  max, one per niche. Pricing is not published.

Proof: the site publishes no reviews, testimonials, case-study numbers or results.
  Never claim any.

Schema implemented: LocalBusiness/ProfessionalService, WebSite, FAQPage, BlogPosting,
  BreadcrumbList, Service
Existing pages: /pricing, /quote, town pages, industry pages, comparison posts
  (custom vs Wix/Squarespace, AI receptionist vs answering service)
"""

# Cerebras model (run: python main.py --list-models to see available)
CEREBRAS_MODEL = "gpt-oss-120b"

# Competitor pages to fetch per query
MAX_COMPETITORS = 3

# Page fetch timeout (seconds)
FETCH_TIMEOUT = 12

# Output directory
REPORTS_DIR = "reports"
