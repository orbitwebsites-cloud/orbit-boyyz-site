"""
Fetches a URL and extracts GEO-relevant signals:
  title, meta description, H1-H4 hierarchy, JSON-LD schema,
  FAQ pairs, body excerpt, word count.

Falls back gracefully on 403s / JS-rendered pages — returns whatever was
extracted, plus an error note. Callers use the snippet as a fallback.
"""

import json
import logging
import re
import time

import requests
from bs4 import BeautifulSoup

log = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

_STRIP_TAGS = ["script", "style", "nav", "footer", "header", "aside", "noscript"]


def fetch(url: str, timeout: int = 12, delay: float = 1.5) -> dict:
    """
    Fetch and parse a single page. Returns a structured dict.

    Schema:
      url, title, meta_description, h_tags [{level, text}],
      schema_blocks [JSON-LD objects], faq_pairs [{q, a}],
      body_excerpt (first 2500 chars of visible text), word_count,
      error (None or string)
    """
    result = {
        "url": url,
        "title": "",
        "meta_description": "",
        "h_tags": [],
        "schema_blocks": [],
        "faq_pairs": [],
        "body_excerpt": "",
        "word_count": 0,
        "error": None,
    }

    time.sleep(delay)  # polite crawl delay

    try:
        resp = requests.get(url, headers=_HEADERS, timeout=timeout, allow_redirects=True)
        resp.raise_for_status()

        content_type = resp.headers.get("content-type", "")
        if "html" not in content_type:
            result["error"] = f"non-HTML content-type: {content_type}"
            return result

        soup = BeautifulSoup(resp.text, "lxml")

        # --- Title ---
        title_tag = soup.find("title")
        if title_tag:
            result["title"] = title_tag.get_text(strip=True)

        # --- Meta description ---
        meta = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
        if meta:
            result["meta_description"] = meta.get("content", "")[:300]

        # --- H-tag hierarchy ---
        for tag in soup.find_all(["h1", "h2", "h3", "h4"]):
            text = tag.get_text(separator=" ", strip=True)
            if text:
                result["h_tags"].append({"level": int(tag.name[1]), "text": text})

        # --- JSON-LD schema blocks ---
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                raw = script.string or ""
                data = json.loads(raw)
                # Unwrap @graph arrays
                if isinstance(data, dict) and "@graph" in data:
                    result["schema_blocks"].extend(data["@graph"])
                elif isinstance(data, list):
                    result["schema_blocks"].extend(data)
                else:
                    result["schema_blocks"].append(data)
            except (json.JSONDecodeError, TypeError):
                pass

        # --- FAQ pairs from FAQPage schema ---
        for block in result["schema_blocks"]:
            if isinstance(block, dict) and block.get("@type") == "FAQPage":
                for item in block.get("mainEntity", []):
                    q = item.get("name", "")
                    a_node = item.get("acceptedAnswer", {})
                    a = a_node.get("text", "") if isinstance(a_node, dict) else ""
                    if q:
                        result["faq_pairs"].append({"q": q, "a": a[:350]})

        # --- Body text (stripped) ---
        for tag in soup(_STRIP_TAGS):
            tag.decompose()
        body = soup.get_text(separator=" ", strip=True)
        body = re.sub(r"\s{2,}", " ", body)
        result["word_count"] = len(body.split())
        result["body_excerpt"] = body[:2500]

    except requests.HTTPError as exc:
        result["error"] = f"HTTP {exc.response.status_code}"
        log.debug("  fetch %s → HTTP error: %s", url, exc)
    except requests.RequestException as exc:
        result["error"] = str(exc)
        log.debug("  fetch %s → request error: %s", url, exc)

    return result


def schema_types(page: dict) -> list[str]:
    """Return the list of @type values found in a page's schema blocks."""
    types = []
    for block in page.get("schema_blocks", []):
        if isinstance(block, dict):
            t = block.get("@type")
            if isinstance(t, list):
                types.extend(t)
            elif t:
                types.append(t)
    return list(set(types))
