"""
Orbit Boyzz SEO/GEO/AEO Agent — Configuration
"""

OUR_SITE_URL = "https://orbitboyzz.me"

# Seed queries — the expander auto-generates PAA variants from these.
# Keep focused on commercial intent; the expander handles the long tail.
TARGET_QUERIES = [
    # Cost / decision — highest intent, no page yet
    "how much does a custom website cost for a local business",
    "how much does an AI website cost small business",
    "custom web design vs Wix Squarespace template",
    "AI operations website vs regular website",
    # Vertical fit
    "AI automation for HVAC company intake and dispatch",
    "AI receptionist for plumbing contractor",
    "caterer corporate proposal automation",
    "should my home services business get an AI intake system",
    # Local commercial
    "web design agency Central New Jersey",
    "AI automation for home services NJ",
]

# How many PAA-style questions to auto-generate per run (0 = disabled)
EXPAND_QUERIES_COUNT = 6

# Our key pages — crawler auto-discovers from sitemap, falls back to these
OUR_KEY_PAGES = [
    "https://orbitboyzz.me",
    "https://orbitboyzz.me/blog/what-is-ai-operations-website",
    "https://orbitboyzz.me/blog/hvac-ai-intake",
    "https://orbitboyzz.me/blog/caterer-proposals",
]

# Static site summary used when live fetch fails (update monthly)
OUR_SITE_SUMMARY = """
Company: Orbit Boyzz (Orbit Websites) — orbitboyzz.me
Location: Plainsboro, NJ — Central New Jersey service area
(Princeton, West Windsor, Ewing, Hamilton, Lawrence, Hopewell, Robbinsville, Trenton)

Services:
  1. Premium custom website — from $10,000. Hand-coded Next.js/React/Tailwind, Vercel.
  2. AI operations website — from $10,000. Automated intake, lead qualification,
     booking, proposal generation, and lead routing.
  3. AI automation retainer — $2,000–$4,000/month.

Ideal client: Local service businesses (HVAC, plumbing, electrical, catering, dental,
  real estate) in Central NJ where one job is worth hundreds–thousands of dollars.

Key proof points:
  - Sub-15-second speed-to-lead via AI intake
  - Avoids $35,000–$54,000/yr in admin labor (NJ admin salary basis)
  - Proposals sent in under 5 minutes vs 6+ hours manually

Schema implemented: FAQPage, BlogPosting, BreadcrumbList, Service, Organization
Blog topics: AI ops website definition, HVAC AI intake, caterer proposal automation
Gaps: no pricing page, no comparison page, no "should I" decision guide
"""

# Cerebras model (run: python main.py --list-models to see available)
CEREBRAS_MODEL = "gpt-oss-120b"

# Competitor pages to fetch per query
MAX_COMPETITORS = 3

# Page fetch timeout (seconds)
FETCH_TIMEOUT = 12

# Output directory
REPORTS_DIR = "reports"
