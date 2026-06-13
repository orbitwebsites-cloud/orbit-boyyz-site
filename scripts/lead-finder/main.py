"""
Orbit Boyzz Autonomous Lead Finder
Run: python main.py
     python main.py --dry-run   (find + enrich, skip sending + GitHub issue)
     python main.py --limit 10  (cap leads processed this run)
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from cerebras.cloud.sdk import Cerebras

import config
from enricher import enrich
from finder import find_candidates
from emailer import generate_email, send_email
from reporter import create_github_issue, write_call_sheet

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout,
)
log = logging.getLogger("main")


# ── Sent-log helpers ──────────────────────────────────────────────────────────

def load_sent_log() -> dict:
    Path(config.LEADS_DIR).mkdir(exist_ok=True)
    if os.path.exists(config.SENT_LOG):
        with open(config.SENT_LOG, encoding="utf-8") as f:
            return json.load(f)
    return {"contacted": {}, "weeks_active": 0, "created_at": datetime.now(timezone.utc).isoformat()}


def save_sent_log(log_data: dict) -> None:
    with open(config.SENT_LOG, "w", encoding="utf-8") as f:
        json.dump(log_data, f, indent=2)


def seen_ids(log_data: dict) -> set[str]:
    return set(log_data.get("contacted", {}).keys())


def email_limit(log_data: dict) -> int:
    weeks = log_data.get("weeks_active", 0)
    idx = min(weeks, len(config.EMAIL_DAILY_LIMITS) - 1)
    return config.EMAIL_DAILY_LIMITS[idx]


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Skip sending emails and GitHub Issue creation")
    parser.add_argument("--limit", type=int, default=0, help="Max leads to process (0 = unlimited)")
    args = parser.parse_args()

    yelp_key       = os.environ.get("YELP_API_KEY", "")
    cerebras_key   = os.environ.get("CEREBRAS_API_KEY", "")
    brevo_key      = os.environ.get("BREVO_API_KEY", "")
    gh_token       = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN", "")
    gh_repo        = os.environ.get("GH_REPO", "")

    if not yelp_key:
        log.error("YELP_API_KEY not set — exiting")
        sys.exit(1)
    if not cerebras_key:
        log.error("CEREBRAS_API_KEY not set — exiting")
        sys.exit(1)

    cerebras_client = Cerebras(api_key=cerebras_key)

    # ── 1. Load state ──
    log_data = load_sent_log()
    already_seen = seen_ids(log_data)
    max_emails   = email_limit(log_data)
    log.info("Weeks active: %d | Email cap today: %d | Already seen: %d",
             log_data.get("weeks_active", 0), max_emails, len(already_seen))

    # ── 2. Discover ──
    log.info("=== Step 1: Discovering leads via Yelp ===")
    leads = find_candidates(yelp_key, already_seen)
    if args.limit:
        leads = leads[:args.limit]
    log.info("New candidates: %d", len(leads))

    if not leads:
        log.info("No new leads this run — exiting")
        return

    # ── 3. Enrich (email finder) ──
    log.info("=== Step 2: Enriching leads ===")
    leads = enrich(leads)
    email_leads = [l for l in leads if l.get("email")]
    call_leads  = [l for l in leads if not l.get("email")]
    log.info("Email leads: %d | Call-only leads: %d", len(email_leads), len(call_leads))

    # ── 4. Send cold emails ──
    emailed: list[dict] = []
    if not args.dry_run and brevo_key:
        log.info("=== Step 3: Sending cold emails via Brevo (cap=%d) ===", max_emails)
        for lead in email_leads[:max_emails]:
            try:
                generated = generate_email(lead, cerebras_key)
                send_email(
                    to_addr=lead["email"],
                    subject=generated["subject"],
                    body=generated["body"],
                    brevo_api_key=brevo_key,
                    to_name=lead["name"],
                )
                lead["email_subject"] = generated["subject"]
                emailed.append(lead)
                log_data["contacted"][lead["yelp_id"]] = {
                    "name":     lead["name"],
                    "channel":  "email",
                    "email":    lead["email"],
                    "category": lead["category"],
                    "sent_at":  datetime.now(timezone.utc).isoformat(),
                }
            except Exception as exc:
                log.warning("Email failed for %s: %s", lead["name"], exc)
                call_leads.append(lead)  # fall back to call sheet
    elif args.dry_run:
        log.info("Dry run — skipping email sends")
        for lead in email_leads[:5]:
            try:
                generated = generate_email(lead, cerebras_key)
                log.info("[DRY RUN] Subject: %s → %s", generated["subject"], lead["email"])
                log.info("[DRY RUN] Body preview:\n%s", generated["body"][:300])
            except Exception as exc:
                log.warning("Email generation preview failed: %s", exc)
    else:
        log.warning("BREVO_API_KEY not set — all email leads fall back to call sheet")
        call_leads.extend(email_leads)
        email_leads = []

    # ── 5. Add call-only leads to sent_log (so we don't re-discover them) ──
    for lead in call_leads:
        if lead["yelp_id"] not in log_data["contacted"]:
            log_data["contacted"][lead["yelp_id"]] = {
                "name":     lead["name"],
                "channel":  "call_sheet",
                "category": lead["category"],
                "seen_at":  datetime.now(timezone.utc).isoformat(),
            }

    # ── 6. Write call sheet CSV ──
    log.info("=== Step 4: Writing call sheet ===")
    csv_path = write_call_sheet(call_leads, cerebras_client)

    # ── 7. Increment weeks_active + save log ──
    log_data["weeks_active"] = log_data.get("weeks_active", 0) + 1
    log_data["last_run"]     = datetime.now(timezone.utc).isoformat()
    save_sent_log(log_data)

    # ── 8. GitHub Issue ──
    if not args.dry_run and gh_token and gh_repo:
        log.info("=== Step 5: Creating GitHub Issue ===")
        create_github_issue(emailed, call_leads, csv_path, gh_token, gh_repo)
    else:
        log.info("Skipping GitHub Issue (dry_run=%s, token_set=%s)", args.dry_run, bool(gh_token))

    log.info("=== Done | Emailed: %d | Call sheet: %d ===", len(emailed), len(call_leads))


if __name__ == "__main__":
    main()
