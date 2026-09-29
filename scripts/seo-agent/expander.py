"""
Query expander — generates PAA-style and long-tail question variants
from seed queries using Cerebras. Runs once at the start of each audit.

Output is merged into the main query list before processing begins,
giving the agent autonomous coverage of the long tail.
"""

import json
import logging

from cerebras.cloud.sdk import Cerebras

log = logging.getLogger(__name__)

_PROMPT = """\
You are a keyword research specialist for a web design + AI automation agency
serving local service businesses in Central New Jersey.

Given these seed queries:
{seeds}

Generate {count} additional question-format queries that:
- Would appear in Google's "People Also Ask" boxes for these topics
- Cover cost/pricing, how-it-works, comparisons, and decision ("should I") angles
- Include at least 2 with NJ geographic modifier
- Are phrased as a real user would type them (conversational)
- Are NOT duplicates of the seeds above

Return ONLY a JSON array of strings, no explanation.
Example: ["how much does AI answering cost for a plumber", "does HVAC need a website in 2025"]
"""


def expand(seeds: list[str], count: int, api_key: str, model: str) -> list[str]:
    """
    Returns `count` new question queries generated from seeds.
    Falls back to empty list on any error so the run is never blocked.
    """
    if count <= 0:
        return []

    client = Cerebras(api_key=api_key)
    prompt = _PROMPT.format(seeds=json.dumps(seeds, indent=2), count=count)

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_completion_tokens=512,
        )
        text = response.choices[0].message.content.strip()

        # Strip fences
        start = text.find("[")
        end = text.rfind("]") + 1
        if start != -1 and end > start:
            text = text[start:end]

        queries = json.loads(text)
        if isinstance(queries, list):
            clean = [q for q in queries if isinstance(q, str) and q.strip()]
            log.info("Expander: generated %d new queries", len(clean))
            return clean[:count]
    except Exception as exc:
        log.warning("Query expansion failed (non-blocking): %s", exc)

    return []
