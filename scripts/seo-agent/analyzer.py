"""
Cerebras tri-pillar analysis engine.

One API call per query covers all three disciplines simultaneously:
  SEO  — traditional search engine ranking signals
  GEO  — AI engine citability (ChatGPT / Perplexity / Gemini)
  AEO  — answer engine / featured snippet / voice search capture
"""

import json
import logging
import os
import textwrap

from cerebras.cloud.sdk import Cerebras

from config import CEREBRAS_MODEL

log = logging.getLogger(__name__)

_PROMPT = textwrap.dedent("""\
    You are a senior search optimization analyst covering three disciplines:

    SEO  — traditional search engine ranking signals (title, meta, H-tags, schema, links)
    GEO  — AI engine citability (ChatGPT, Perplexity, Gemini, Claude)
    AEO  — answer engine capture (featured snippets, People Also Ask, voice search)

    Your job: analyze why competitors rank/get cited for the target query, then
    give EXACT technical changes Orbit Boyzz must make. No generic advice.
    Every recommendation must include exact text, property names, or values.

    TARGET QUERY: {query}

    ─── OUR SITE (orbitboyzz.me) ──────────────────────────────────────────────
    {our_content}

    ─── TOP COMPETITOR PAGES ──────────────────────────────────────────────────
    {competitor_content}

    Return ONLY valid JSON — no markdown, no prose — matching this schema exactly:
    {{
      "query": "<query>",
      "priority": "P1|P2|P3",
      "priority_reason": "<15 words max>",

      "seo": {{
        "title_tag": {{
          "current": "<current title or 'not found'>",
          "optimized": "<exact title 50-60 chars, keyword-first>",
          "rationale": "<1 sentence>"
        }},
        "meta_description": {{
          "current": "<current meta or 'not found'>",
          "optimized": "<exact meta 150-160 chars with CTA>",
          "rationale": "<1 sentence>"
        }},
        "h_tag_additions": [
          {{
            "level": 2,
            "text": "<exact heading>",
            "page": "<page path or 'new page'>",
            "after_section": "<heading it should follow>",
            "rationale": "<1 sentence>"
          }}
        ],
        "schema_changes": [
          {{
            "action": "add|modify",
            "schema_type": "<Schema.org @type>",
            "property": "<property>",
            "value": "<exact value>",
            "rationale": "<1 sentence>"
          }}
        ],
        "internal_links": [
          {{
            "from_page": "<source page path>",
            "anchor_text": "<exact anchor text>",
            "to_page": "<destination path>",
            "rationale": "<1 sentence>"
          }}
        ]
      }},

      "geo": {{
        "answerability_gap": "<2 sentences: exact reason AI engines don't cite us>",
        "citability_score": 5,
        "entity_gaps": [
          {{
            "entity": "<missing entity>",
            "type": "location|service|stat|org|concept",
            "competitor_uses": "<N>",
            "our_uses": "<N>",
            "suggested_sentence": "<exact sentence to add>"
          }}
        ],
        "copy_edits": [
          {{
            "page": "<page path>",
            "before": "<current text or 'missing'>",
            "after": "<rewritten — direct, fact-dense, max 3 sentences>",
            "rationale": "<why this wins the LLM summary>"
          }}
        ]
      }},

      "aeo": {{
        "featured_snippet": {{
          "format": "paragraph|list|table",
          "answer": "<exact 40-60 word direct answer for this query>",
          "page": "<page path to place it on>",
          "under_heading": "<H2 or H3 heading it should appear under>"
        }},
        "paa_coverage": [
          {{
            "question": "<People Also Ask question to target>",
            "answer": "<exact 35-50 word direct answer>",
            "page": "<page path>",
            "schema_type": "FAQPage|HowTo"
          }}
        ],
        "schema_additions": [
          {{
            "type": "FAQPage|HowTo|Speakable|QAPage",
            "details": "<exact schema or description of what to add>",
            "rationale": "<1 sentence>"
          }}
        ]
      }}
    }}
""")


def _type_str(b: dict) -> str:
    t = b.get("@type", "?")
    return "/".join(t) if isinstance(t, list) else str(t)


def _format_our_content(our_site_summary: str, our_static_summary: str) -> str:
    return our_site_summary if our_site_summary.strip() else f"(Live fetch failed)\n\n{our_static_summary}"


def _format_competitor(idx: int, page: dict, snippet: str) -> str:
    if page.get("error") or not page.get("body_excerpt"):
        return (
            f"Competitor {idx}: {page.get('url', '?')}\n"
            f"  [fetch failed: {page.get('error', 'unknown')}]\n"
            f"  DDG snippet: {snippet[:400]}\n"
        )
    h_tags = "\n".join(
        f"    {'#' * h['level']} {h['text']}"
        for h in page.get("h_tags", [])[:18]
    )
    schemas = ", ".join(_type_str(b) for b in page.get("schema_blocks", []) if isinstance(b, dict))
    faqs = "\n".join(f"    Q: {f['q']}" for f in page.get("faq_pairs", [])[:5])
    return (
        f"Competitor {idx}: {page.get('url', '?')}\n"
        f"  Title: {page.get('title', '')}\n"
        f"  Meta: {page.get('meta_description', '')}\n"
        f"  Schema types: {schemas or 'none'}\n"
        f"  H-tags:\n{h_tags or '    (none)'}\n"
        f"  FAQs:\n{faqs or '    (none)'}\n"
        f"  Body excerpt: {page.get('body_excerpt', '')[:600]}\n"
    )


def _extract_json(text: str) -> str:
    """Best-effort extraction of a JSON object from model output."""
    if "```" in text:
        for part in text.split("```"):
            part = part.strip().lstrip("json").strip()
            if part.startswith("{"):
                text = part
                break
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        return text[start:end]
    return text


def analyze(
    query: str,
    our_site_summary: str,
    our_static_summary: str,
    competitor_pages: list[dict],
    competitor_snippets: list[str],
    api_key: str | None = None,
) -> dict:
    """
    Run tri-pillar (SEO + GEO + AEO) analysis for one query via Cerebras.
    Returns structured recommendations dict. Never raises — errors are captured.
    """
    key = api_key or os.environ.get("CEREBRAS_API_KEY", "")
    if not key:
        raise EnvironmentError("CEREBRAS_API_KEY not set.")

    client = Cerebras(api_key=key)

    our_block = _format_our_content(our_site_summary, our_static_summary)
    competitor_block = "\n\n".join(
        _format_competitor(i + 1, page, competitor_snippets[i] if i < len(competitor_snippets) else "")
        for i, page in enumerate(competitor_pages)
    ) or "(no competitor pages fetched)"

    prompt = _PROMPT.format(
        query=query,
        our_content=our_block,
        competitor_content=competitor_block,
    )

    try:
        response = client.chat.completions.create(
            model=CEREBRAS_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_completion_tokens=6000,
        )
        text = _extract_json(response.choices[0].message.content.strip())
        result = json.loads(text)
        log.info("  Cerebras OK — priority %s", result.get("priority", "?"))
        return result
    except json.JSONDecodeError as exc:
        log.error("  Non-JSON response: %s", exc)
        return {"query": query, "error": f"JSON parse error: {exc}"}
    except Exception as exc:
        log.error("  Cerebras API error: %s", exc)
        return {"query": query, "error": str(exc)}
