"""
Generates the final Markdown report and companion JSON from tri-pillar analyses.
Each query section is organized as: SEO → GEO → AEO.
"""

import json
import logging
from datetime import datetime
from pathlib import Path

log = logging.getLogger(__name__)

_P_EMOJI = {"P1": "🔴", "P2": "🟡", "P3": "🟢"}
_P_LABEL = {"P1": "Critical — act this sprint", "P2": "Important — next sprint", "P3": "Backlog"}


# ── SEO section ────────────────────────────────────────────────────────────────

def _seo_block(seo: dict) -> str:
    if not seo:
        return ""
    lines = ["#### SEO\n"]

    tt = seo.get("title_tag", {})
    if tt.get("optimized"):
        lines.append(f"**Title tag**")
        lines.append(f"- Current: `{tt.get('current', 'not found')}`")
        lines.append(f"- Optimized: `{tt['optimized']}`")
        lines.append(f"- _{tt.get('rationale', '')}_\n")

    md = seo.get("meta_description", {})
    if md.get("optimized"):
        lines.append(f"**Meta description**")
        lines.append(f"- Current: {md.get('current', 'not found')}")
        lines.append(f"- Optimized: {md['optimized']}")
        lines.append(f"- _{md.get('rationale', '')}_\n")

    htags = seo.get("h_tag_additions", [])
    if htags:
        lines.append("**H-tag additions**")
        for h in htags:
            prefix = "#" * h.get("level", 2)
            lines.append(f"- `{prefix} {h.get('text', '')}`")
            lines.append(f"  Page: `{h.get('page', '?')}` · After: _{h.get('after_section', '?')}_")
            lines.append(f"  _{h.get('rationale', '')}_")
        lines.append("")

    schema = seo.get("schema_changes", [])
    if schema:
        lines.append("**Schema changes**")
        for s in schema:
            lines.append(
                f"- **{s.get('action','add').upper()}** `{s.get('schema_type','?')}` "
                f"→ `{s.get('property','?')}: {s.get('value','?')}`"
            )
            lines.append(f"  _{s.get('rationale', '')}_")
        lines.append("")

    links = seo.get("internal_links", [])
    if links:
        lines.append("**Internal link opportunities**")
        for lk in links:
            lines.append(
                f"- `{lk.get('from_page','?')}` → `{lk.get('to_page','?')}` "
                f"via anchor \"{lk.get('anchor_text','?')}\""
            )
            lines.append(f"  _{lk.get('rationale', '')}_")
        lines.append("")

    return "\n".join(lines)


# ── GEO section ────────────────────────────────────────────────────────────────

def _geo_block(geo: dict) -> str:
    if not geo:
        return ""
    lines = ["#### GEO\n"]
    score = geo.get("citability_score", "?")
    lines.append(f"**Citability score:** {score}/10  ")
    lines.append(f"**Answerability gap:** {geo.get('answerability_gap', '')}\n")

    entities = geo.get("entity_gaps", [])
    if entities:
        lines.append("**Missing entities**")
        lines.append("| Entity | Type | Competitor | Ours |")
        lines.append("|--------|------|-----------|------|")
        for e in entities:
            lines.append(
                f"| `{e.get('entity','')}` | {e.get('type','')} "
                f"| {e.get('competitor_uses','?')} | {e.get('our_uses','?')} |"
            )
        lines.append("")
        lines.append("**Suggested insertions**")
        for e in entities:
            if e.get("suggested_sentence"):
                lines.append(f"> {e['suggested_sentence']}")
        lines.append("")

    edits = geo.get("copy_edits", [])
    if edits:
        lines.append("**Copy edits**")
        for ed in edits:
            lines.append(f"Page: `{ed.get('page','?')}`")
            lines.append(f"Before: {ed.get('before','missing')}")
            lines.append(f"After: **{ed.get('after','')}**")
            lines.append(f"_{ed.get('rationale','')}_\n")

    return "\n".join(lines)


# ── AEO section ────────────────────────────────────────────────────────────────

def _aeo_block(aeo: dict) -> str:
    if not aeo:
        return ""
    lines = ["#### AEO\n"]

    fs = aeo.get("featured_snippet", {})
    if fs.get("answer"):
        lines.append(
            f"**Featured snippet target** ({fs.get('format','paragraph')} format)  "
        )
        lines.append(f"Page: `{fs.get('page','?')}` · Under: `{fs.get('under_heading','?')}`")
        lines.append(f"```\n{fs['answer']}\n```\n")

    paa = aeo.get("paa_coverage", [])
    if paa:
        lines.append("**People Also Ask targets**")
        for p in paa:
            lines.append(f"- **Q: {p.get('question','')}**")
            lines.append(f"  A: {p.get('answer','')}")
            lines.append(f"  Page: `{p.get('page','?')}` · Schema: `{p.get('schema_type','FAQPage')}`")
        lines.append("")

    schema = aeo.get("schema_additions", [])
    if schema:
        lines.append("**Schema additions**")
        for s in schema:
            lines.append(f"- **{s.get('type','?')}**: {s.get('details','')}")
            lines.append(f"  _{s.get('rationale','')}_")
        lines.append("")

    return "\n".join(lines)


# ── Query block ────────────────────────────────────────────────────────────────

def _query_block(a: dict) -> str:
    lines = [
        f"### Query: `{a.get('query','?')}`",
        f"**Priority reason:** {a.get('priority_reason','')}",
        "",
        _seo_block(a.get("seo", {})),
        _geo_block(a.get("geo", {})),
        _aeo_block(a.get("aeo", {})),
        "---",
    ]
    return "\n".join(lines)


def _priority_section(analyses: list[dict], priority: str) -> str:
    items = [a for a in analyses if a.get("priority") == priority and "error" not in a]
    if not items:
        return ""
    label = _P_LABEL[priority]
    emoji = _P_EMOJI[priority]
    lines = [f"\n---\n\n## {emoji} {priority} — {label}\n"]
    for a in items:
        lines.append(_query_block(a))
    return "\n".join(lines)


def _errors_section(analyses: list[dict]) -> str:
    errors = [a for a in analyses if "error" in a]
    if not errors:
        return ""
    lines = ["\n## Errors\n"]
    for e in errors:
        lines.append(f"- `{e.get('query','?')}`: {e.get('error','')}")
    return "\n".join(lines)


# ── Public API ─────────────────────────────────────────────────────────────────

def generate(
    analyses: list[dict],
    delta_section: str = "",
    output_dir: str = "reports",
) -> tuple[Path, Path]:
    """
    Write Markdown + JSON reports. Returns (md_path, json_path).
    Also writes a geo-audit-LATEST.json for delta tracking.
    """
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)

    stamp = datetime.now().strftime("%Y-%m-%d")
    md_path = out / f"geo-audit-{stamp}.md"
    json_path = out / f"geo-audit-{stamp}.json"
    latest_path = out / "geo-audit-LATEST.json"

    total = len(analyses)
    ok = sum(1 for a in analyses if "error" not in a)
    counts = {p: sum(1 for a in analyses if a.get("priority") == p) for p in ("P1", "P2", "P3")}

    header = f"""# SEO / GEO / AEO Audit — Orbit Boyzz (orbitboyzz.me)
Generated: {datetime.now().strftime("%Y-%m-%d %H:%M")} · {ok}/{total} queries analyzed

## Summary
| Discipline | Focus |
|-----------|-------|
| **SEO** | Title, meta, H-tags, schema, internal links |
| **GEO** | AI citability, entity gaps, copy for LLM extraction |
| **AEO** | Featured snippets, PAA answers, voice-search schema |

| Priority | Count | Action |
|----------|-------|--------|
| 🔴 P1 | {counts['P1']} | Fix this sprint |
| 🟡 P2 | {counts['P2']} | Fix next sprint |
| 🟢 P3 | {counts['P3']} | Backlog |

> Each query section gives you paste-ready changes: exact schema values, H-tag text,
> featured snippet paragraphs (40-60 words), and PAA answers. Apply in order: SEO → GEO → AEO.

"""

    body = (
        header
        + _priority_section(analyses, "P1")
        + _priority_section(analyses, "P2")
        + _priority_section(analyses, "P3")
        + _errors_section(analyses)
        + delta_section
    )

    md_path.write_text(body, encoding="utf-8")
    json_path.write_text(json.dumps(analyses, indent=2, ensure_ascii=False), encoding="utf-8")
    latest_path.write_text(json.dumps(analyses, indent=2, ensure_ascii=False), encoding="utf-8")

    log.info("Report  → %s", md_path)
    log.info("JSON    → %s", json_path)
    log.info("LATEST  → %s", latest_path)
    return md_path, json_path
