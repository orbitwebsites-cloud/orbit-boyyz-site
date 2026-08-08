# DM Lead Finder

Finds local businesses with **no website** in high-ticket, socially-active niches, and
hands you a one-click path to their Instagram so you can DM them yourself.

Built for outreach that doesn't require phone calls.

## Why it doesn't just give you the @handle

Instagram serves an **identical 608 KB JavaScript shell for every handle** — real ones and
made-up ones are indistinguishable without executing JS and being logged in. Verified on
2026-08-08: `takatakastreetgreek`, `toplinenailshboro` and `thishandledoesnotexist99871` all
returned the same page, titled just "Instagram", with no profile data. Facebook returned 400.

The only way to resolve handles automatically is browser automation against a logged-in
session. That breaks Instagram's terms, trips CAPTCHAs, and risks the account you'd be
messaging from. **Not worth it.**

So the tool automates the part that's actually tedious — finding who to message — and gives
you a search link for the last ten seconds.

## Usage

```sh
node scripts/dm-finder/find.mjs                              # default niches, top 60
node scripts/dm-finder/find.mjs --limit=40
node scripts/dm-finder/find.mjs --niches=medspa,dental
node scripts/dm-finder/find.mjs --town=Hamilton
node scripts/dm-finder/find.mjs --bbox=40.1,-74.9,40.4,-74.5
```

Output lands in `leads/<date>-dm-batch.csv` (open in Excel, click the links) and
`.json` (used by the messaged-log).

After a round of DMs:

```sh
node scripts/dm-finder/mark-messaged.mjs 2026-08-08              # whole batch
node scripts/dm-finder/mark-messaged.mjs 2026-08-08 --only=1,4,9 # just some
```

Anything logged in `messaged.json` never appears in a future batch.

## Niches

Selected for **high ticket value** and **visual/social presence** — a business that can
justify a $3,500 build and a $300–700/month plan.

| Key | Niche | No-website count (Central NJ) |
|---|---|---|
| `medspa` | Med spa / aesthetics / wellness | 256 |
| `dental` | Dental practice | 165 |
| `furniture` | Furniture / cabinetry / interiors | 122 |
| `jewelry` | Jewelry | 75 |
| `venue` | Event venue | 34 |
| `landscaping` | Landscaping / hardscape | 30 |
| `tattoo` | Tattoo studio | 28 |
| `bridal` | Bridal / formalwear | 12 |
| `pool` | Pool / spa install | 11 |
| `auto` | Auto repair / custom *(mixed value, off by default)* | 481 |

⚠️ **Nail and hair salons are deliberately excluded.** OSM tags them `shop=beauty` alongside
med spas, but they can't justify the price. Filtering them removed 352 of 883 results.

**Total addressable in Central NJ: ~531 businesses with no website in the default niches.**

## Data source

OpenStreetMap via the Overpass API — free, no key, no terms problem. Rotates three mirrors
and backs off on 429/504, because Overpass is a shared service that regularly rate-limits.

⚠️ **Known gap:** OSM coverage is incomplete and city fields are often blank. A missing city
weakens the Instagram search string, so the row also carries a Google search link and a Maps
link as fallbacks. OSM undercounts newer businesses.

## Schedule

`.github/workflows/dm-finder.yml` runs weekly and commits a fresh batch. Because the messaged
log is committed too, each week's batch excludes everyone already contacted.

## UI (no terminal)

Double-click **`Orbit DM Finder.bat`** in the repo root. A browser opens at
`http://localhost:4180`. Close the black window to stop it.

- Pick niches as chips, set how many, optionally filter by town, hit **Find leads**
- Each row has an **Instagram** button (opens their search) and a **Copy DM** button
  that puts a personalised message on your clipboard
- Mark **Messaged / Replied / No** — anything marked never reappears
- Filter tabs across the top: new · messaged · replied · client · no · all

State lives in `messaged.json`, so it survives restarts.
