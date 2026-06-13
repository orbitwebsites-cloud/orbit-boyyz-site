# OrbitBoyzz — Off-Site Profile Copy (Entity Building)

Created: 2026-06-01. Goal: build the third-party corroboration LLMs and Google use to
trust + cite the brand. **Use the EXACT same NAP on every platform** — inconsistency is
the #1 thing that weakens a brand entity.

> After you create each profile, paste its public URL into the `SAME_AS` array in
> `prerender.mjs` (uncomment the matching line), then rebuild + redeploy. The schema
> wiring is already in place — it stays inert until you add real, live URLs.

---

## Canonical NAP — copy/paste, never vary

- **Name:** Orbit Websites
- **Brand handle / alt name:** OrbitBoyzz
- **Phone:** 609-662-8052  (schema form: +1-609-662-8052)
- **Email:** orbitboyzz@gmail.com
- **Website:** https://orbitboyzz.me/
- **Location:** Plainsboro, New Jersey (service-area business — address hidden)
- **Service areas:** Plainsboro, Princeton, West Windsor Township, Ewing, Hamilton,
  Lawrence Township, Hopewell, Trenton, Robbinsville, East Windsor, and Central New Jersey
- **Primary category:** Website designer  ·  **Secondary:** Marketing agency

---

## Descriptions (pick by length limit)

**Short (≤ 160 chars) — GBP, X, IG bio:**
> Orbit Websites (OrbitBoyzz) builds premium custom websites + AI operations systems for local businesses in Central New Jersey. Plainsboro, NJ.

**Medium (~300 chars) — LinkedIn tagline + Clutch summary:**
> Orbit Websites, also known as OrbitBoyzz, is a Plainsboro, New Jersey studio building
> premium hand-coded websites and AI operations systems — automated intake, pricing,
> booking, and lead-routing — for local businesses across Central New Jersey.

**Long (~600 chars) — LinkedIn About, Crunchbase, Facebook:**
> Orbit Websites (OrbitBoyzz) is a web design and AI operations studio based in Plainsboro,
> New Jersey, serving local businesses across Central NJ — Princeton, West Windsor, Hamilton,
> Trenton, and surrounding towns. We build premium, hand-coded websites (Next.js, Tailwind,
> Vercel) and layer in AI operations systems that automate customer intake, instant pricing,
> booking, and lead routing — so a small business captures and converts more leads without
> adding staff. Every site is custom-built, fast, and designed to turn visitors into booked
> jobs. Free 30-minute consultation at https://orbitboyzz.me/.

---

## Platform checklist (do in this priority order)

### 1. Google Business Profile — HIGHEST IMPACT (business.google.com)
- Name: **Orbit Websites** · "I deliver goods and services" → **hide address** → set service areas above
- Category: Website designer (+ Marketing agency) · Phone 609-662-8052 · Website https://orbitboyzz.me/
- Verify (video/phone/email for service-area) → add logo, short description, 1 photo/post
- **Hours (must match site schema exactly):** Mon–Fri **4:00–8:00 PM**, Sat–Sun **12:00–8:00 PM**
- After live: grab the **review link** + **g.page short link** → add short link to `SAME_AS`

### 2. LinkedIn company page (linkedin.com/company setup)
- Name: Orbit Websites · Tagline: medium description · About: long description
- Website + location Plainsboro, NJ · Logo: `/orbit-logo.png`
- Target URL: `linkedin.com/company/orbitboyzz` (currently 404 — creating this closes a real gap)

### 3. Clutch + The Manifest + UpCity (B2B directories LLMs reproduce)
- Use long description, NAP, services: Web design, Web development, AI automation
- These rank well in "best agency" answers — worth the setup time

### 4. Crunchbase + Wikidata (entity graph)
- Crunchbase: org "Orbit Websites", short + long description, website, location
- Wikidata: create item "Orbit Websites", instance of: web design company, located in Plainsboro NJ,
  official website + add `sameAs` to your other profiles. This is what LLMs lean on most for "who is X".

### 5. Social (IG, Facebook, X/YouTube — optional but cheap)
- Handle `orbitboyzz` everywhere for consistency · short description · link to site

---

## After profiles are live — wire them in
In `prerender.mjs`, uncomment the matching lines in `SAME_AS`, set `FOUNDED` (e.g. `'2025'`),
optionally fill `OPENING_HOURS`, then rebuild + redeploy. Confirm at
https://validator.schema.org/ by pasting the homepage URL.
