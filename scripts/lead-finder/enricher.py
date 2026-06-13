"""
Enriches leads with contact email by scraping their Yelp business page.
~15-25% of no-website local businesses list an email on Yelp.
"""

import logging
import re
import time

import requests
from bs4 import BeautifulSoup

log = logging.getLogger(__name__)

_EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

_SKIP_DOMAINS = {"example.com", "yelp.com", "sentry.io", "apple.com", "google.com"}


def _is_real_email(addr: str) -> bool:
    domain = addr.split("@")[-1].lower()
    if domain in _SKIP_DOMAINS:
        return False
    if domain.endswith(".png") or domain.endswith(".jpg"):
        return False
    return True


def find_email(yelp_url: str) -> str | None:
    """Scrape a Yelp business page and return the first plausible contact email."""
    if not yelp_url:
        return None
    try:
        r = requests.get(yelp_url, headers=_HEADERS, timeout=12)
        if r.status_code != 200:
            return None

        soup = BeautifulSoup(r.text, "lxml")

        # 1. Check for mailto: links
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if href.startswith("mailto:"):
                addr = href[7:].split("?")[0].strip()
                if _EMAIL_RE.match(addr) and _is_real_email(addr):
                    return addr

        # 2. Scan all text for email pattern
        text = soup.get_text(" ", strip=True)
        for match in _EMAIL_RE.finditer(text):
            addr = match.group(0)
            if _is_real_email(addr):
                return addr

    except Exception as exc:
        log.debug("Email scrape failed for %s: %s", yelp_url, exc)

    return None


def enrich(leads: list[dict]) -> list[dict]:
    """Add 'email' field to each lead in-place. Returns the same list."""
    for i, lead in enumerate(leads):
        if lead.get("email"):
            continue
        email = find_email(lead.get("yelp_url", ""))
        if email:
            lead["email"] = email
            log.info("[%d/%d] Email found for %s: %s", i + 1, len(leads), lead["name"], email)
        else:
            log.debug("[%d/%d] No email for %s", i + 1, len(leads), lead["name"])
        time.sleep(0.5)  # don't hammer Yelp
    return leads
