"""
Generates personalized cold emails with Cerebras, sends via Gmail SMTP.
"""

import json
import logging
import re
import smtplib
from email.mime.text import MIMEText

from cerebras.cloud.sdk import Cerebras

from config import (
    CEREBRAS_MODEL,
    INDUSTRY_PAGE,
    SENDER_ADDRESS,
    SENDER_NAME,
    SENDER_PHONE,
    SENDER_SITE,
)

log = logging.getLogger(__name__)

_PROMPT = """\
You are writing a cold email for Orbit Websites (orbitboyzz.me), a web design studio in
Plainsboro NJ run by {sender_name}. You are reaching out to a local business that has no website.

Business name:  {business_name}
Industry:       {category}
Town:           {town}
Industry page:  {industry_url}

Rules — follow exactly:
1. Subject: plain, max 8 words. Format: "[Business Name] — website?" or "[Business] in [Town]?"
2. Body: EXACTLY 5 sentences. Plain text. No HTML, no bullet points, no markdown.
3. Sentence 1: Prove you found them specifically. "Searched for [category] in [town] and noticed
   [Business Name] doesn't have a website — just a [Yelp / Google Maps] listing."
4. Sentence 2: One specific, vivid pain point for their industry. Use a scenario.
   - HVAC/Plumbing/Electrician: someone needing emergency service searches Google at night and calls whoever shows up first
   - Landscaping/Roofing/Painting: people search before calling for estimates, invisible without a site
   - Dental: new patients Google dentists before booking, can't find you without a site
5. Sentence 3: The pitch. "I build hand-coded websites for [industry] companies in Central NJ — starts at $3,500, most rank in local search within 60 days."
6. Sentence 4: Link only. "More details: {industry_url}"
7. Sentence 5: Soft CTA. "Worth 15 minutes?" or "Worth a look?"
8. Signature (exactly as shown, no changes):
   — {sender_name}
   {sender_phone} | {sender_site}
   {sender_address}
   Reply "stop" to opt out.

Do NOT use:
- "I hope this finds you well" or any filler opener
- Exclamation points
- "I wanted to reach out"
- "leverage", "synergy", "solutions", "digital presence"
- More or fewer than 5 body sentences

Return ONLY valid JSON — no markdown, no extra keys:
{{
  "subject": "...",
  "body": "..."
}}
"""


def _extract_json(text: str) -> str:
    if "```" in text:
        for part in text.split("```"):
            part = part.strip().lstrip("json").strip()
            if part.startswith("{"):
                return part
    start, end = text.find("{"), text.rfind("}") + 1
    return text[start:end] if start != -1 and end > start else text


def generate_email(lead: dict, api_key: str) -> dict:
    """Returns {'subject': str, 'body': str} or raises on failure."""
    town = lead.get("location", "").replace(", NJ", "")
    industry_url = INDUSTRY_PAGE.get(lead["category"], f"https://orbitboyzz.me/web-design-central-nj")

    client = Cerebras(api_key=api_key)
    prompt = _PROMPT.format(
        sender_name=SENDER_NAME,
        business_name=lead["name"],
        category=lead["category"],
        town=town,
        industry_url=industry_url,
        sender_phone=SENDER_PHONE,
        sender_site=SENDER_SITE,
        sender_address=SENDER_ADDRESS,
    )

    resp = client.chat.completions.create(
        model=CEREBRAS_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_completion_tokens=512,
    )
    raw = _extract_json(resp.choices[0].message.content.strip())
    result = json.loads(raw)

    for key in ("subject", "body"):
        if key not in result:
            raise ValueError(f"Missing key '{key}' in generated email")

    return result


def send_email(
    to_addr: str,
    subject: str,
    body: str,
    gmail_user: str,
    gmail_password: str,
) -> None:
    """Send plain-text email via Gmail SMTP."""
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"]    = f"{SENDER_NAME} at Orbit Websites <{gmail_user}>"
    msg["To"]      = to_addr
    msg["Reply-To"] = gmail_user

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(gmail_user, gmail_password)
        smtp.send_message(msg)

    log.info("Email sent → %s | Subject: %s", to_addr, subject)
