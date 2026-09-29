"""
Autonomous blog post generator.

Topic selection order:
  1. Highest-priority audit gap (P1/P2 query with no existing blog page)
  2. config.BLOG_TOPIC_BACKLOG (rotating hardcoded topics)

Generates a post matching the exact App.tsx blogPosts object shape,
then hands it to site_patcher to write it into the site.
"""

import json
import logging
import re
from datetime import datetime
from pathlib import Path

from cerebras.cloud.sdk import Cerebras

from config import CEREBRAS_MODEL, REPORTS_DIR

log = logging.getLogger(__name__)

# Rotating backlog — used when audit finds no untouched gap
BLOG_TOPIC_BACKLOG = [
    "Should a plumbing company have its own website?",
    "How much does an AI receptionist cost for a small business?",
    "Custom web design vs Wix or Squarespace for local business",
    "What is speed-to-lead and why does it matter for home services?",
    "How do HVAC companies lose money on missed after-hours calls?",
    "AI intake systems for dental practices in New Jersey",
    "How real estate teams can automate buyer inquiry follow-up",
    "What makes a website rank on Google for local service searches?",
    "How caterers can win corporate clients faster with AI proposals",
    "What is a conversion-focused website for a local business?",
    "AI vs human receptionist: cost comparison for contractors",
    "Why handcoded websites outperform template sites for local SEO",
    "Web design for local businesses in Ewing, NJ — what to look for",
    "Why Ewing NJ contractors need a custom website, not a template",
    "How Mercer County small businesses can rank on Google without ads",
    # Industry pages — feed traffic to /website-design-for-*
    "How HVAC companies in NJ can stop losing emergency calls overnight",
    "What a plumbing company website should do differently from other local sites",
    "How electricians in Central NJ can rank above competitors on Google",
    "Landscaping company websites that actually generate annual contracts",
    "What dental practices in New Jersey need on their websites to attract new patients",
    "Why HVAC companies lose 30% of after-hours revenue without AI intake",
    "Speed-to-lead for plumbers: why the first response wins the job",
    "How a New Jersey electrician doubled booked jobs with a new website",
    # Town pages — feed traffic to /web-design-*-nj
    "Web design for small businesses in Trenton, NJ",
    "Best website options for Robbinsville NJ contractors and service businesses",
    "Why Bordentown NJ business owners need a custom site, not a template",
    "Web design for East Windsor NJ local businesses",
    "How Hamilton NJ restaurants can get more reservations with a better website",
    # Funnel/commercial-intent content
    "Website cost breakdown for a New Jersey service business in 2026",
    "DIY website vs professional web design for a NJ local business",
    "What is a local SEO website and why does it matter for NJ contractors",
    "How to tell if your current website is losing you leads",
    "Why Google Business Profile and a website work together for local ranking",
]

_PROMPT = """\
You are writing a blog post for Orbit Boyzz (orbitboyzz.me), a web design
and AI automation agency in Plainsboro, NJ serving Central New Jersey.

TOPIC: {topic}

EXISTING SLUGS (do NOT duplicate): {existing_slugs}

Rules:
- First section heading MUST be exactly "Direct answer" (enables featured snippets)
- Every section body must be 2-4 sentences, fact-dense, entity-rich
- Include at least one specific stat or dollar figure
- Reference "Central New Jersey", "Orbit Boyzz", or specific NJ towns naturally
- No fluff, no "In today's world", no generic opener
- Takeaways: 3 extractable one-sentence facts an LLM can cite
- Description: 1-2 sentences, direct answer format, max 160 chars
- Slug: lowercase, hyphens, max 60 chars, keyword-first

Return ONLY valid JSON — no markdown, no prose:
{{
  "slug": "keyword-first-slug-here",
  "title": "Exact title as a question or direct statement",
  "description": "1-2 sentence direct answer, max 160 chars.",
  "audience": "Who specifically this post is for",
  "takeaways": [
    "Fact one — specific, citable.",
    "Fact two — specific, citable.",
    "Fact three — specific, citable."
  ],
  "sections": [
    {{
      "heading": "Direct answer",
      "body": "2-3 sentence direct answer to the topic question. Include a stat or figure."
    }},
    {{
      "heading": "Second section heading",
      "body": "2-4 sentences expanding on the answer with specifics."
    }},
    {{
      "heading": "Third section heading",
      "body": "2-4 sentences on practical implications or next steps for the reader."
    }}
  ]
}}
"""


def _pick_topic(existing_slugs: list[str], used_backlog_index: int) -> str:
    """Pick the best topic: audit gap first, then backlog rotation."""
    latest = Path(REPORTS_DIR) / "geo-audit-LATEST.json"
    if latest.exists():
        try:
            analyses = json.loads(latest.read_text(encoding="utf-8"))
            # Collect P1 then P2 queries that have no existing blog post
            for priority in ("P1", "P2"):
                for a in analyses:
                    if a.get("priority") != priority or "error" in a:
                        continue
                    query = a.get("query", "")
                    slug_guess = re.sub(r"[^a-z0-9]+", "-", query.lower()).strip("-")
                    if not any(slug_guess[:20] in s for s in existing_slugs):
                        log.info("Blog topic from audit gap (%s): %s", priority, query)
                        return query
        except Exception as exc:
            log.warning("Could not load audit for topic selection: %s", exc)

    # Fall back to rotating backlog
    idx = used_backlog_index % len(BLOG_TOPIC_BACKLOG)
    topic = BLOG_TOPIC_BACKLOG[idx]
    log.info("Blog topic from backlog[%d]: %s", idx, topic)
    return topic


def _extract_json(text: str) -> str:
    if "```" in text:
        for part in text.split("```"):
            part = part.strip().lstrip("json").strip()
            if part.startswith("{"):
                return part
    start, end = text.find("{"), text.rfind("}") + 1
    return text[start:end] if start != -1 and end > start else text


def generate(
    existing_slugs: list[str],
    api_key: str,
    backlog_index: int = 0,
) -> dict:
    """
    Generate one blog post dict matching the App.tsx blogPosts shape.
    Returns dict with all required keys on success, raises on failure.
    """
    topic = _pick_topic(existing_slugs, backlog_index)

    client = Cerebras(api_key=api_key)
    prompt = _PROMPT.format(
        topic=topic,
        existing_slugs=json.dumps(existing_slugs),
    )

    # The model occasionally returns truncated JSON or strings with raw
    # newlines/control chars. Retry a few times, and parse with strict=False
    # so literal control characters inside string values don't blow up.
    post = None
    last_err: Exception | None = None
    for attempt in range(3):
        response = client.chat.completions.create(
            model=CEREBRAS_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.35,
            max_completion_tokens=4096,
        )
        text = _extract_json(response.choices[0].message.content.strip())
        try:
            post = json.loads(text, strict=False)
            break
        except json.JSONDecodeError as exc:
            last_err = exc
            log.warning("Blog JSON parse failed (attempt %d/3): %s", attempt + 1, exc)
    if post is None:
        raise ValueError(f"Could not parse model JSON after 3 attempts: {last_err}")

    # Inject today's date
    d = datetime.now()
    post["updated"] = f"{d.strftime('%B')} {d.day}, {d.year}"

    required = {"slug", "title", "description", "audience", "takeaways", "sections", "updated"}
    missing = required - set(post.keys())
    if missing:
        raise ValueError(f"Generated post missing keys: {missing}")

    log.info("Blog post generated: '%s' (%s)", post["title"], post["slug"])
    return post
