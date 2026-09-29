"""
Discovers local businesses with no real website by scraping yellowpages.com.
Free, no API key, good coverage for NJ service businesses.
"""

import logging
import re
import time

import requests
from bs4 import BeautifulSoup

from config import (
    CATEGORIES_YP,
    FAKE_WEBSITE_DOMAINS,
    LOCATIONS,
)

log = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def _location_slug(location: str) -> str:
    """'Lawrence Township, NJ' → 'lawrence-township-nj'"""
    return re.sub(r"[^a-z0-9]+", "-", location.lower()).strip("-")


def _has_real_website(url: str | None) -> bool:
    if not url:
        return False
    lower = url.lower()
    return not any(d in lower for d in FAKE_WEBSITE_DOMAINS)


def _scrape_page(location: str, yp_category: str, cat_label: str, page: int = 1) -> list[dict]:
    slug = _location_slug(location)
    url  = f"https://www.yellowpages.com/{slug}/{yp_category}"
    if page > 1:
        url += f"?page={page}"

    try:
        r = requests.get(url, headers=_HEADERS, timeout=15)
        if r.status_code == 404:
            return []
        if r.status_code != 200:
            log.warning("YP %d for %s/%s", r.status_code, location, yp_category)
            return []
    except Exception as exc:
        log.warning("YP fetch failed [%s/%s]: %s", location, yp_category, exc)
        return []

    soup = BeautifulSoup(r.text, "lxml")
    results = []

    for card in soup.select(".result"):
        # Business name
        name_el = card.select_one(".business-name span") or card.select_one(".business-name")
        name = name_el.get_text(strip=True) if name_el else ""
        if not name:
            continue

        # Phone
        phone_el = card.select_one(".phones.phone.primary")
        phone = phone_el.get_text(strip=True) if phone_el else ""

        # Address
        street_el  = card.select_one(".street-address")
        locality_el = card.select_one(".locality")
        address = ""
        if street_el:
            address = street_el.get_text(strip=True)
        if locality_el:
            address += (", " if address else "") + locality_el.get_text(strip=True)

        # Website — YP shows a "Website" link if business has one
        website_el = card.select_one("a.track-visit-website") or card.select_one("a[class*='website']")
        website = website_el["href"] if website_el and website_el.get("href") else None

        # YP listing URL (for email enrichment later)
        listing_el = card.select_one("a.business-name")
        yp_url = "https://www.yellowpages.com" + listing_el["href"] if listing_el and listing_el.get("href") else ""

        # Unique ID from the card data attribute or YP URL
        biz_id = card.get("data-listing-id") or re.sub(r"[^a-z0-9]", "", yp_url.lower())[-40:]

        results.append({
            "yp_id":    biz_id,
            "name":     name,
            "category": cat_label,
            "location": location,
            "phone":    phone,
            "address":  address,
            "website":  website,
            "yp_url":   yp_url,
            "email":    None,
        })

    return results


def find_candidates(seen_ids: set[str]) -> list[dict]:
    """
    Scrape Yellow Pages for all CATEGORIES_YP × LOCATIONS.
    Returns businesses not in seen_ids that have no real website.
    """
    leads: list[dict] = []
    seen_in_run: set[str] = set()

    for location in LOCATIONS:
        for yp_slug, cat_label in CATEGORIES_YP:
            for page in (1, 2):   # grab 2 pages (~60 results) per search
                results = _scrape_page(location, yp_slug, cat_label, page)
                if not results:
                    break

                for biz in results:
                    bid = biz["yp_id"]
                    if not bid or bid in seen_ids or bid in seen_in_run:
                        continue
                    seen_in_run.add(bid)

                    if _has_real_website(biz.get("website")):
                        continue  # already has a real site

                    leads.append(biz)

                time.sleep(1.5)   # be polite to YP

    log.info("New no-website leads from Yellow Pages: %d", len(leads))
    return leads
