"""
Creates GitHub Issues from audit findings for Codex Pro to implement.

Codex watches the repo (via GitHub App integration) and auto-opens a PR
for each issue assigned to it. Issues include full brand context so Codex
never breaks the design system.

Creates max 3 issues per run, P1 first, skips already-open issues.
"""

import json
import logging
import subprocess
from pathlib import Path

log = logging.getLogger(__name__)

# Brand context injected into every issue so Codex matches the design system
_BRAND_CONTEXT = """
### Brand & Code Context (read before touching any file)
- **File:** `src/App.tsx` — single-file React app, all routes and components live here
- **Colors:** bg `#060606`, primary text `#f4efe6`, muted `#b7afa3`, gold accent `#d6b36a`
- **Typography:** `font-display` for headings, `font-mono` for labels/tags, `font-light` for body
- **Components:** use existing `BentoCard`, `Label` — do NOT invent new components
- **Tone:** dark, premium, minimal — no emojis, no colored backgrounds, no marketing fluff
- **Schema:** inject via `<script type="application/ld+json">` inside the relevant route component
- **Do NOT** change any Tailwind class on existing elements — only add new content sections
"""

_ISSUE_TEMPLATE = """## Task
Implement the SEO/GEO/AEO changes below for the query: **`{query}`**

These changes were identified by the autonomous audit agent. Apply them to
`src/App.tsx`. If a new route or blog post is created, `npm run build`
generates `dist/sitemap.xml` and `dist/feed.xml` from the current route list;
do not manually edit `public/sitemap.xml`.

{brand_context}

---

### 1. Title tag & meta description
**Page/route:** `{page}`

| Field | Value |
|-------|-------|
| Title | `{title_tag}` |
| Meta description | `{meta_desc}` |

Update the `<title>` and `<meta name="description">` in the relevant route's
`<Helmet>` block (or add one if missing, matching the pattern already used in
other routes).

---

### 2. H-tag additions
Add these headings inside the relevant page section:

{h_tags}

---

### 3. Schema (JSON-LD)
Add this inside the route component as a `<script type="application/ld+json">`:

```json
{schema}
```

---

### 4. Featured snippet paragraph (AEO)
Place this paragraph directly under the first matching H2 heading:

> {snippet}

---

### 5. Entity / copy insertions (GEO)
{copy_edits}

---

### Acceptance criteria
- [ ] New content renders correctly on the relevant page
- [ ] No existing styles, colors, or components changed
- [ ] Schema is valid JSON-LD
- [ ] New route or blog post appears in generated `dist/sitemap.xml` after `npm run build`
- [ ] TypeScript compiles without errors (`npm run build`)
"""


def _run_gh(args: list[str]) -> str:
    result = subprocess.run(
        ["gh"] + args,
        capture_output=True, text=True
    )
    return result.stdout.strip()


def _existing_issue_titles() -> set[str]:
    """Fetch open issue titles from GitHub to avoid duplicates."""
    try:
        out = _run_gh(["issue", "list", "--state", "open",
                       "--json", "title", "--limit", "50"])
        issues = json.loads(out) if out else []
        return {i["title"] for i in issues}
    except Exception as exc:
        log.warning("Could not fetch existing issues: %s", exc)
        return set()


def _format_h_tags(h_tag_additions: list[dict]) -> str:
    if not h_tag_additions:
        return "_None_"
    lines = []
    for h in h_tag_additions:
        level = "#" * h.get("level", 2)
        lines.append(
            f"- `{level} {h.get('text','')}` — "
            f"page `{h.get('page','?')}`, after section _{h.get('after_section','?')}_"
        )
    return "\n".join(lines)


def _format_copy_edits(geo: dict) -> str:
    edits = geo.get("copy_edits", [])
    entities = geo.get("entity_gaps", [])
    lines = []
    for e in entities[:3]:
        s = e.get("suggested_sentence", "")
        if s:
            lines.append(f"- Insert: _{s}_")
    for ed in edits[:2]:
        lines.append(
            f"\n**Page `{ed.get('page','?')}`**\n"
            f"Before: {ed.get('before','missing')}\n"
            f"After: **{ed.get('after','')}**"
        )
    return "\n".join(lines) or "_None_"


def _pick_schema(analysis: dict) -> str:
    """Pick the most important schema change from the audit."""
    aeo_schema = analysis.get("aeo", {}).get("schema_additions", [])
    seo_schema = analysis.get("seo", {}).get("schema_changes", [])

    # Prefer FAQPage from AEO (highest citation value)
    for s in aeo_schema:
        details = s.get("details", "")
        if "{" in details:
            return details

    # Fall back to first SEO schema change
    if seo_schema:
        s = seo_schema[0]
        return json.dumps({
            "@context": "https://schema.org",
            "@type": s.get("schema_type", "Thing"),
            s.get("property", "name"): s.get("value", "")
        }, indent=2)

    return "{}"


def create_issues(analyses: list[dict], max_issues: int = 3) -> int:
    """
    Create GitHub Issues for the top P1 audit findings.
    Returns number of issues created.
    """
    existing = _existing_issue_titles()
    p1s = [a for a in analyses if a.get("priority") == "P1" and "error" not in a]
    created = 0

    for a in p1s[:max_issues]:
        query = a.get("query", "?")
        title = f"SEO/GEO/AEO Fix: {query}"

        if title in existing:
            log.info("Issue already open for: %s — skipping", query)
            continue

        seo = a.get("seo", {})
        geo = a.get("geo", {})
        aeo = a.get("aeo", {})

        tt = seo.get("title_tag", {})
        md = seo.get("meta_description", {})
        fs = aeo.get("featured_snippet", {})

        # Infer the page from the first h_tag or copy_edit
        h_tags = seo.get("h_tag_additions", [])
        page = h_tags[0].get("page", "/") if h_tags else "/"

        body = _ISSUE_TEMPLATE.format(
            query=query,
            brand_context=_BRAND_CONTEXT,
            page=page,
            title_tag=tt.get("optimized", "_no change_"),
            meta_desc=md.get("optimized", "_no change_"),
            h_tags=_format_h_tags(h_tags),
            schema=_pick_schema(a),
            snippet=fs.get("answer", "_none_"),
            copy_edits=_format_copy_edits(geo),
        )

        try:
            out = _run_gh([
                "issue", "create",
                "--title", title,
                "--body", body,
                "--label", "seo-fix,codex",
            ])
            log.info("Created issue: %s → %s", title, out)
            created += 1
        except Exception as exc:
            log.error("Failed to create issue for '%s': %s", query, exc)

    return created
