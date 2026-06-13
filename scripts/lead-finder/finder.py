"""
Discovers local businesses with no real website via Yelp Fusion API.
Returns a list of lead dicts: name, phone, address, category, yelp_url, yelp_id.
"""

import logging
import time

import requests

from config import (
    CATEGORIES,
    FAKE_WEBSITE_DOMAINS,
    LOCATIONS,
    MAX_DETAIL_CALLS,
    YELP_DETAIL_URL,
    YELP_RESULTS_PER_CALL,
    YELP_SEARCH_URL,
)

log = logging.getLogger(__name__)


def _has_real_website(url: str | None) -> bool:
    if not url:
        return False
    lower = url.lower()
    return not any(d in lower for d in FAKE_WEBSITE_DOMAINS)


def _search(api_key: str, location: str, category: str) -> list[dict]:
    headers = {"Authorization": f"Bearer {api_key}"}
    params = {
        "categories": category,
        "location": location,
        "limit": YELP_RESULTS_PER_CALL,
    }
    try:
        r = requests.get(YELP_SEARCH_URL, headers=headers, params=params, timeout=12)
        if r.status_code == 429:
            log.warning("Yelp rate limit hit — sleeping 60s")
            time.sleep(60)
            r = requests.get(YELP_SEARCH_URL, headers=headers, params=params, timeout=12)
        r.raise_for_status()
        return r.json().get("businesses", [])
    except Exception as exc:
        log.warning("Search failed [%s / %s]: %s", location, category, exc)
        return []


def _details(api_key: str, biz_id: str) -> dict | None:
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        r = requests.get(
            YELP_DETAIL_URL.format(id=biz_id),
            headers=headers,
            timeout=12,
        )
        r.raise_for_status()
        return r.json()
    except Exception as exc:
        log.warning("Detail fetch failed [%s]: %s", biz_id, exc)
        return None


def find_candidates(api_key: str, seen_ids: set[str]) -> list[dict]:
    """
    Run searches across all CATEGORIES × LOCATIONS.
    Returns businesses not in seen_ids, with no real website.
    Caps detail API calls at MAX_DETAIL_CALLS to stay within free tier.
    """
    raw: dict[str, dict] = {}  # yelp_id → search-result dict

    for location in LOCATIONS:
        for cat_alias, cat_label in CATEGORIES:
            results = _search(api_key, location, cat_alias)
            for biz in results:
                bid = biz.get("id", "")
                if not bid or bid in seen_ids or bid in raw:
                    continue
                raw[bid] = {"biz": biz, "category": cat_label, "location": location}
            time.sleep(0.25)  # gentle rate limiting

    log.info("Found %d new candidate businesses from search", len(raw))

    # Fetch details for up to MAX_DETAIL_CALLS candidates
    leads: list[dict] = []
    detail_count = 0

    for biz_id, meta in raw.items():
        if detail_count >= MAX_DETAIL_CALLS:
            log.info("Detail call cap (%d) reached — deferring rest to next run", MAX_DETAIL_CALLS)
            break

        details = _details(api_key, biz_id)
        detail_count += 1
        time.sleep(0.25)

        if details is None:
            continue

        website = details.get("website") or ""
        if _has_real_website(website):
            continue  # skip businesses that already have a real site

        biz = meta["biz"]
        address_parts = biz.get("location", {}).get("display_address", [])
        phone = details.get("display_phone") or biz.get("display_phone", "")

        leads.append({
            "yelp_id":  biz_id,
            "name":     biz.get("name", ""),
            "category": meta["category"],
            "location": meta["location"],
            "phone":    phone,
            "address":  ", ".join(address_parts),
            "yelp_url": biz.get("url", ""),
            "email":    None,   # filled in by enricher
        })

    log.info("Leads with no real website: %d", len(leads))
    return leads
