"""
Writes generated content directly into the live site files.

  patch_blog_post(post)  — appends a new post to App.tsx + updates sitemap.xml
"""

import json
import logging
import re
from datetime import datetime
from pathlib import Path

log = logging.getLogger(__name__)

APP_TSX = Path("../../src/App.tsx")
SITEMAP = Path("../../public/sitemap.xml")


# ── TypeScript formatter ───────────────────────────────────────────────────────

def _ts_string(s: str) -> str:
    """Escape a Python string for a TypeScript single-quoted string."""
    return s.replace("\\", "\\\\").replace("'", "\\'")


def _format_post_ts(post: dict) -> str:
    """Render a post dict as a TypeScript object literal (2-space indent)."""
    slug = _ts_string(post["slug"])
    title = _ts_string(post["title"])
    desc = _ts_string(post["description"])
    updated = _ts_string(post["updated"])
    audience = _ts_string(post["audience"])

    takeaways = "\n".join(
        f"      '{_ts_string(t)}'," for t in post["takeaways"]
    )
    section_parts = []
    for s in post["sections"]:
        h = _ts_string(s["heading"])
        b = _ts_string(s["body"])
        section_parts.append(
            f"      {{\n"
            f"        heading: '{h}',\n"
            f"        body: '{b}',\n"
            f"      }},"
        )
    sections = "\n".join(section_parts)

    return (
        "  {\n"
        f"    slug: '{slug}',\n"
        f"    title: '{title}',\n"
        f"    description:\n"
        f"      '{desc}',\n"
        f"    updated: '{updated}',\n"
        f"    audience: '{audience}',\n"
        f"    takeaways: [\n"
        f"{takeaways}\n"
        f"    ],\n"
        f"    sections: [\n"
        f"{sections}\n"
        f"    ],\n"
        f"  }},"
    )


# ── App.tsx patcher ────────────────────────────────────────────────────────────

def _find_posts_array_end(content: str) -> int:
    """
    Return the index of the closing ] of the blogPosts array.
    Uses bracket-depth counting from the array's opening [ — never breaks
    if posts are added or removed.
    """
    marker = "export const blogPosts = ["
    start = content.find(marker)
    if start == -1:
        raise ValueError("blogPosts array not found in App.tsx")

    pos = start + len(marker) - 1  # index of opening [
    depth = 0
    for i in range(pos, len(content)):
        ch = content[i]
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return i
    raise ValueError("Could not find closing ] of blogPosts array")


def get_existing_slugs() -> list[str]:
    """Read App.tsx and extract all existing blog post slugs."""
    content = APP_TSX.read_text(encoding="utf-8")
    return re.findall(r"slug:\s*'([^']+)'", content)


def patch_app_tsx(post: dict) -> None:
    """Insert a new blog post into App.tsx blogPosts array."""
    content = APP_TSX.read_text(encoding="utf-8")

    if f"slug: '{post['slug']}'" in content:
        log.warning("Slug '%s' already exists in App.tsx — skipping", post["slug"])
        return

    end_idx = _find_posts_array_end(content)
    ts_block = "\n" + _format_post_ts(post) + "\n"
    new_content = content[:end_idx] + ts_block + content[end_idx:]

    APP_TSX.write_text(new_content, encoding="utf-8")
    log.info("App.tsx patched — added '%s'", post["slug"])


# ── Sitemap patcher ────────────────────────────────────────────────────────────

def patch_sitemap(post: dict) -> None:
    """Add a new <url> entry to sitemap.xml for the new blog post."""
    content = SITEMAP.read_text(encoding="utf-8")
    url = f"https://orbitboyzz.me/blog/{post['slug']}"

    if url in content:
        log.warning("Sitemap already contains %s — skipping", url)
        return

    today = datetime.now().strftime("%Y-%m-%d")
    new_entry = (
        f"  <url>\n"
        f"    <loc>{url}</loc>\n"
        f"    <lastmod>{today}</lastmod>\n"
        f"  </url>\n"
    )

    # Insert before closing </urlset>
    new_content = content.replace("</urlset>", new_entry + "</urlset>")
    SITEMAP.write_text(new_content, encoding="utf-8")
    log.info("Sitemap updated — added %s", url)


# ── Public API ─────────────────────────────────────────────────────────────────

def patch_blog_post(post: dict) -> None:
    """Write a new blog post into App.tsx and sitemap.xml."""
    patch_app_tsx(post)
    patch_sitemap(post)
    log.info("Site patched successfully for post: %s", post["slug"])
