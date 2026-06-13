#!/usr/bin/env python3
"""
Orbit Boyzz — Autonomous SEO / GEO / AEO Agent

Runs fully unattended. Every Monday via GitHub Actions, or on demand:

  python main.py                          # full run, all queries
  python main.py --queries "one" "two"    # specific queries
  python main.py --skip-crawl             # skip live site fetch (faster)
  python main.py --no-expand              # skip query expansion
  python main.py --list-models            # print available Cerebras models
  CEREBRAS_API_KEY=xyz python main.py
"""

import argparse
import json
import logging
import os
import sys
import time
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import config as cfg
import fetcher
import reporter
import searcher
import tracker
from analyzer import analyze
from blog_writer import generate as write_blog
from expander import expand
from site_crawler import crawl
from site_patcher import get_existing_slugs, patch_blog_post

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

RECOVERY_PATH = Path("RECOVERY.md")


def _list_models(api_key: str) -> None:
    from cerebras.cloud.sdk import Cerebras
    client = Cerebras(api_key=api_key)
    models = client.models.list()
    print("Available Cerebras models:")
    for m in models.data:
        print(f"  {m.id}")


def _write_recovery(state: dict) -> None:
    """Checkpoint current progress so interrupted runs can resume."""
    lines = [
        "# SEO Agent Recovery Checkpoint",
        f"Written: {datetime.now().isoformat()}",
        "",
        f"**Status:** {state.get('status','')}",
        f"**Completed:** {state.get('done',0)}/{state.get('total',0)} queries",
        f"**Last query:** `{state.get('last_query','')}`",
        "",
        "## Completed queries so far",
    ]
    for a in state.get("analyses", []):
        p = a.get("priority", "?")
        q = a.get("query", "?")
        err = f" — ERROR: {a['error']}" if "error" in a else ""
        lines.append(f"- [{p}] {q}{err}")
    lines += ["", "## To resume", "```bash", "python main.py --queries \\"]
    remaining = state.get("remaining", [])
    for q in remaining:
        lines.append(f'  "{q}" \\')
    lines.append("```")
    RECOVERY_PATH.write_text("\n".join(lines), encoding="utf-8")


def _run_query(
    query: str,
    our_site_summary: str,
    api_key: str,
) -> dict:
    log.info("--- Query: %s", query)

    results = searcher.search(query, max_results=cfg.MAX_COMPETITORS + 2)
    competitors = searcher.filter_our_domain(results)[: cfg.MAX_COMPETITORS]

    if not competitors:
        log.warning("  No search results — skipping")
        return {"query": query, "error": "no search results"}

    comp_pages = []
    comp_snippets = []
    for r in competitors:
        log.info("  Fetching: %s", r["url"])
        comp_pages.append(fetcher.fetch(r["url"], timeout=cfg.FETCH_TIMEOUT))
        comp_snippets.append(r.get("snippet", ""))

    log.info("  Analyzing (SEO + GEO + AEO)...")
    result = analyze(
        query=query,
        our_site_summary=our_site_summary,
        our_static_summary=cfg.OUR_SITE_SUMMARY,
        competitor_pages=comp_pages,
        competitor_snippets=comp_snippets,
        api_key=api_key,
    )

    # Polite pause — keeps us inside free-tier rate limits
    time.sleep(4)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Orbit Boyzz SEO/GEO/AEO agent")
    parser.add_argument("--queries", nargs="+", default=None)
    parser.add_argument("--skip-crawl", action="store_true",
                        help="Skip live crawl of orbitboyzz.me")
    parser.add_argument("--no-expand", action="store_true",
                        help="Skip PAA query expansion")
    parser.add_argument("--output-dir", default=cfg.REPORTS_DIR)
    parser.add_argument("--api-key", default=None)
    parser.add_argument("--list-models", action="store_true")
    parser.add_argument("--blog", action="store_true",
                        help="Generate + publish one blog post, then exit")
    parser.add_argument("--backlog-index", type=int, default=0,
                        help="Which backlog topic to use if no audit gap found (default: 0)")
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("CEREBRAS_API_KEY", "")
    if not api_key:
        log.error(
            "CEREBRAS_API_KEY not set. "
            "Pass --api-key or set the env var. "
            "Free key: https://cloud.cerebras.ai"
        )
        sys.exit(1)

    if args.list_models:
        _list_models(api_key)
        return

    # ── Blog-only mode ─────────────────────────────────────────────────────
    if args.blog:
        log.info("=== Blog writer mode ===")
        existing = get_existing_slugs()
        log.info("Existing slugs: %d", len(existing))
        post = write_blog(
            existing_slugs=existing,
            api_key=api_key,
            backlog_index=args.backlog_index,
        )
        patch_blog_post(post)
        print(f"\n[BLOG] Published: {post['title']}")
        print(f"       URL: https://orbitboyzz.me/blog/{post['slug']}")
        return

    # ── Step 1: Crawl our own site ─────────────────────────────────────────
    our_site_summary = ""
    if not args.skip_crawl:
        log.info("=== Step 1: Crawling our site ===")
        _, our_site_summary = crawl(max_pages=6)
    else:
        log.info("=== Step 1: Skipped (--skip-crawl) ===")

    # ── Step 2: Build query list ───────────────────────────────────────────
    log.info("=== Step 2: Building query list ===")
    queries = list(args.queries or cfg.TARGET_QUERIES)

    if not args.no_expand and not args.queries:
        expanded = expand(
            seeds=queries,
            count=cfg.EXPAND_QUERIES_COUNT,
            api_key=api_key,
            model=cfg.CEREBRAS_MODEL,
        )
        if expanded:
            log.info("Expanded query list by %d questions", len(expanded))
            queries = queries + expanded

    log.info("Total queries to run: %d", len(queries))

    # ── Step 3: Load previous report for delta tracking ───────────────────
    log.info("=== Step 3: Loading previous report ===")
    today = datetime.now().strftime("%Y-%m-%d")
    previous = tracker.load_previous(args.output_dir, today)

    # ── Step 4: Run each query ─────────────────────────────────────────────
    log.info("=== Step 4: Running queries ===")
    analyses = []
    for i, query in enumerate(queries, 1):
        log.info("[%d/%d]", i, len(queries))
        result = _run_query(query, our_site_summary, api_key)
        analyses.append(result)

        # Checkpoint after every query
        _write_recovery({
            "status": "in_progress",
            "done": i,
            "total": len(queries),
            "last_query": query,
            "analyses": analyses,
            "remaining": queries[i:],
        })

    # ── Step 5: Build delta section ────────────────────────────────────────
    log.info("=== Step 5: Building delta ===")
    delta_md = tracker.build_delta(analyses, previous)

    # ── Step 6: Generate report ────────────────────────────────────────────
    log.info("=== Step 6: Generating report ===")
    md_path, json_path = reporter.generate(
        analyses,
        delta_section=delta_md,
        output_dir=args.output_dir,
    )

    # Final recovery state: done
    _write_recovery({
        "status": "COMPLETE",
        "done": len(queries),
        "total": len(queries),
        "last_query": queries[-1] if queries else "",
        "analyses": analyses,
        "remaining": [],
    })

    print(f"\n[DONE] Report: {md_path}")
    print(f"       JSON:   {json_path}")

    p1s = [a for a in analyses if a.get("priority") == "P1" and "error" not in a]
    if p1s:
        print(f"\n[P1 — {len(p1s)} critical queries]")
        for a in p1s:
            print(f"  * {a['query']}")
            geo = a.get("geo", {})
            gap = geo.get("answerability_gap", a.get("priority_reason", ""))
            print(f"    {str(gap)[:110]}")


if __name__ == "__main__":
    main()
