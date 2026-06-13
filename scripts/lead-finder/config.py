"""
Orbit Boyzz Lead Finder — Configuration
"""

# ── Yellow Pages category slugs → display label ──────────────────────────────
CATEGORIES_YP = [
    ("hvac",                   "HVAC"),
    ("plumbers",               "Plumbing"),
    ("electricians",           "Electrician"),
    ("landscaping",            "Landscaping"),
    ("dentists",               "Dental"),
    ("roofing-contractors",    "Roofing"),
    ("painting-contractors",   "Painting"),
    ("general-contractors",    "Contractor"),
]

LOCATIONS = [
    "Ewing, NJ",
    "Hamilton, NJ",
    "Lawrence Township, NJ",
    "Trenton, NJ",
    "Princeton, NJ",
    "Robbinsville, NJ",
    "West Windsor, NJ",
    "Plainsboro, NJ",
    "East Windsor, NJ",
    "Bordentown, NJ",
]

# ── Industry landing page mapping ─────────────────────────────────────────────
INDUSTRY_PAGE = {
    "HVAC":        "https://orbitboyzz.me/website-design-for-hvac-companies-nj",
    "Plumbing":    "https://orbitboyzz.me/website-design-for-plumbers-nj",
    "Electrician": "https://orbitboyzz.me/website-design-for-electricians-nj",
    "Landscaping": "https://orbitboyzz.me/website-design-for-landscaping-companies-nj",
    "Dental":      "https://orbitboyzz.me/website-design-for-dental-practices-nj",
    "Roofing":     "https://orbitboyzz.me/website-design-for-hvac-companies-nj",   # closest match
    "Painting":    "https://orbitboyzz.me/web-design-central-nj",
    "Carpentry":   "https://orbitboyzz.me/web-design-central-nj",
}

# ── Domains that mean "no real website" ──────────────────────────────────────
FAKE_WEBSITE_DOMAINS = [
    "facebook.com", "fb.com",
    "yelp.com",
    "instagram.com",
    "twitter.com", "x.com",
    "google.com",
    "yellowpages.com",
    "thumbtack.com",
    "angieslist.com", "angi.com",
    "homeadvisor.com",
    "houzz.com",
]

# ── Sending limits (warm-up ramp) ────────────────────────────────────────────
# Indexed by weeks_active (0-based).  After index 3, stay at 50.
EMAIL_DAILY_LIMITS = [20, 30, 40, 50]

# ── Sender identity ───────────────────────────────────────────────────────────
SENDER_NAME    = "Ritvik"
SENDER_PHONE   = "(609) 662-8052"
SENDER_SITE    = "orbitboyzz.me"
SENDER_ADDRESS = "641 Plainsboro Rd, Plainsboro NJ 08536"

# ── Cerebras ──────────────────────────────────────────────────────────────────
CEREBRAS_MODEL = "gpt-oss-120b"

# ── Paths ──────────────────────────────────────────────────────────────────────
import os
SCRIPT_DIR = os.path.dirname(__file__)
LEADS_DIR  = os.path.join(SCRIPT_DIR, "leads")
SENT_LOG   = os.path.join(LEADS_DIR,  "sent_log.json")
