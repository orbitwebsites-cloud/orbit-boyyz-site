"""
Auto-discovers and fetches our own site's key pages.

Priority order:
  1. sitemap.xml — extracts all <loc> URLs
  2. Homepage links — follows <a href> pointing to the same domain
  3. config.OUR_KEY_PAGES — hardcoded fallback

Returns a dict {url: fetched_page} and a merged content string for the prompt.
"""

import logging
import re
from urllib.parse import urljoin, urlparse
from xml.etree import ElementTree

import requests
from bs4 import BeautifulSoup

import fetcher
from config import OUR_KEY_PAGES, OUR_SITE_URL, FETCH_TIMEOUT

log = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; OrbitBoyzz-SEOBot/1.0)",
    "Accept": "text/html,application/xml,application/xhtml+xml",
}

_SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def _from_sitemap(base_url: str) -> list[str]:
    try:
        resp = requests.get(f"{base_url}/sitemap.xml", headers=_HEADERS, timeout=10)
        resp.raise_for_status()
        root = ElementTree.fromstring(resp.content)
        urls = [loc.text.strip() for loc in root.findall(".//sm:loc", _SITEMAP_NS) if loc.text]
        log.info("Sitemap: found %d URLs", len(urls))
        return urls
    except Exception as exc:
        log.debug("Sitemap fetch failed: %s", exc)
        return []


def _from_homepage(base_url: str) -> list[str]:
    try:
        resp = requests.get(base_url, headers=_HEADERS, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")
        domain = urlparse(base_url).netloc
        seen = set()
        urls = []
        for a in soup.find_all("a", href=True):
            href = urljoin(base_url, a["href"])
            parsed = urlparse(href)
            if parsed.netloc == domain and parsed.scheme in ("http", "https"):
                clean = f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")
                if clean not in seen and clean != base_url.rstrip("/"):
                    seen.add(clean)
                    urls.append(clean)
        log.info("Homepage links: found %d internal URLs", len(urls))
        return urls
    except Exception as exc:
        log.debug("Homepage crawl failed: %s", exc)
        return []


def crawl(max_pages: int = 6) -> tuple[dict, str]:
    """
    Fetch our key pages. Returns (pages_dict, combined_summary_string).

    pages_dict:  {url: fetched_page_dict}
    summary:     merged text for the Cerebras prompt
    """
    urls = _from_sitemap(OUR_SITE_URL)
    if not urls:
        urls = _from_homepage(OUR_SITE_URL)
    if not urls:
        log.warning("Auto-discovery failed — using hardcoded OUR_KEY_PAGES")
        urls = OUR_KEY_PAGES

    # Always include homepage
    base = OUR_SITE_URL.rstrip("/")
    if base not in [u.rstrip("/") for u in urls]:
        urls.insert(0, base)

    # Prioritize blog/service pages over generic pages
    priority_patterns = ["/blog/", "/service", "/ai-", "/automation"]
    urls.sort(key=lambda u: (0 if any(p in u for p in priority_patterns) else 1))

    pages = {}
    for url in urls[:max_pages]:
        log.info("  Crawling our page: %s", url)
        page = fetcher.fetch(url, timeout=FETCH_TIMEOUT, delay=0.5)
        if not page.get("error"):
            pages[url] = page

    if not pages:
        log.warning("All our-site fetches failed — using static summary only")
        return {}, ""

    summary = _build_summary(pages)
    log.info("Our site: %d pages crawled", len(pages))
    return pages, summary


def _build_summary(pages: dict) -> str:
    blocks = []
    for url, page in pages.items():
        h_tags = " | ".join(
            f"H{h['level']}: {h['text']}"
            for h in page.get("h_tags", [])[:10]
        )
        schemas = ", ".join(
            _type_str(b) for b in page.get("schema_blocks", []) if isinstance(b, dict)
        )
        faqs = "; ".join(f['q'] for f in page.get("faq_pairs", [])[:4])
        excerpt = page.get("body_excerpt", "")[:600]
        blocks.append(
            f"URL: {url}\n"
            f"  Title: {page.get('title', '')}\n"
            f"  Meta: {page.get('meta_description', '')}\n"
            f"  Schema: {schemas or 'none'}\n"
            f"  H-tags: {h_tags or 'none'}\n"
            f"  FAQs: {faqs or 'none'}\n"
            f"  Excerpt: {excerpt}"
        )
    return "\n\n".join(blocks)


def _type_str(b: dict) -> str:
    t = b.get("@type", "?")
    return "/".join(t) if isinstance(t, list) else str(t)
