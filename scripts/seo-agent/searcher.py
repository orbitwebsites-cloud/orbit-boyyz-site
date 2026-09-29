"""
DuckDuckGo search wrapper with retry + rate-limit handling.
Returns structured result dicts for downstream fetching and analysis.
"""

import time
import random
import logging
from typing import Optional

log = logging.getLogger(__name__)


def search(query: str, max_results: int = 5, retries: int = 3) -> list[dict]:
    """
    Search DuckDuckGo and return up to max_results results.

    Each result: {url, title, snippet}
    Returns empty list on failure rather than raising.
    """
    from ddgs import DDGS

    for attempt in range(1, retries + 1):
        try:
            with DDGS() as ddgs:
                raw = list(ddgs.text(query, max_results=max_results))
            results = [
                {
                    "url": r.get("href", ""),
                    "title": r.get("title", ""),
                    "snippet": r.get("body", ""),
                }
                for r in raw
                if r.get("href")
            ]
            log.info("  DDG '%s' → %d results", query, len(results))
            return results
        except Exception as exc:
            wait = 2 ** attempt + random.uniform(0, 1)
            log.warning("  DDG attempt %d/%d failed (%s). Retrying in %.1fs…", attempt, retries, exc, wait)
            if attempt < retries:
                time.sleep(wait)

    log.error("  DDG search exhausted retries for: %s", query)
    return []


def filter_our_domain(results: list[dict], our_domain: str = "orbitboyzz.me") -> list[dict]:
    """Strip our own pages from competitor results."""
    return [r for r in results if our_domain not in r.get("url", "")]
