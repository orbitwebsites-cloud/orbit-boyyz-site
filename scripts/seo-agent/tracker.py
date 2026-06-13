"""
Delta tracker — compares the current run against the most recent previous report.

Surfaces:
  - Queries that escalated in priority (P2 → P1)
  - Newly added queries (from expander)
  - Queries that were fixed / downgraded (P1 → P2 or P3)
  - Queries that still have unresolved P1 findings (stale)

Output is a markdown string appended to the report.
"""

import json
import logging
from pathlib import Path
from datetime import datetime

log = logging.getLogger(__name__)


def load_previous(reports_dir: str, current_date: str) -> list[dict] | None:
    """Load the most recent JSON report that is NOT today's run."""
    out = Path(reports_dir)
    candidates = sorted(out.glob("geo-audit-????-??-??.json"), reverse=True)
    for path in candidates:
        if current_date not in path.name:
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
                log.info("Delta: comparing against %s", path.name)
                return data
            except Exception as exc:
                log.debug("Could not load %s: %s", path.name, exc)
    log.info("Delta: no previous report found — skipping comparison")
    return None


def build_delta(current: list[dict], previous: list[dict] | None) -> str:
    """Return a markdown delta section, or empty string if no previous data."""
    if not previous:
        return ""

    prev_map = {a.get("query", ""): a for a in previous if "error" not in a}
    cur_map = {a.get("query", ""): a for a in current if "error" not in a}

    escalated = []
    fixed = []
    stale_p1 = []
    new_queries = []

    for query, cur in cur_map.items():
        prev = prev_map.get(query)
        cur_p = cur.get("priority", "P3")
        if prev is None:
            new_queries.append(query)
            continue
        prev_p = prev.get("priority", "P3")
        if _rank(cur_p) > _rank(prev_p):
            escalated.append((query, prev_p, cur_p))
        elif _rank(cur_p) < _rank(prev_p):
            fixed.append((query, prev_p, cur_p))
        elif cur_p == "P1":
            stale_p1.append(query)

    if not any([escalated, fixed, stale_p1, new_queries]):
        return "\n## Delta vs Previous Run\nNo priority changes detected.\n"

    lines = ["\n---\n\n## Delta vs Previous Run\n"]

    if escalated:
        lines.append("### Escalated (got worse)")
        for q, old, new in escalated:
            lines.append(f"- `{q}` — {old} → **{new}**")
        lines.append("")

    if stale_p1:
        lines.append("### Still P1 (unresolved from last run)")
        for q in stale_p1:
            lines.append(f"- `{q}`")
        lines.append("")

    if fixed:
        lines.append("### Improved")
        for q, old, new in fixed:
            lines.append(f"- `{q}` — {old} → {new}")
        lines.append("")

    if new_queries:
        lines.append("### New Queries (auto-generated)")
        for q in new_queries:
            lines.append(f"- `{q}`")
        lines.append("")

    return "\n".join(lines)


def _rank(priority: str) -> int:
    return {"P1": 3, "P2": 2, "P3": 1}.get(priority, 0)
