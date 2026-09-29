// DM lead finder — local businesses with NO website, in high-ticket niches.
//
// Automates the tedious half: finding who to message. It deliberately does NOT
// resolve Instagram handles. Instagram serves an identical JS shell for real and
// fake handles alike, so handles cannot be verified server-side; the only route
// is browser automation against a logged-in session, which breaks Instagram's
// terms and risks the account. Instead each row carries a one-click search link.
//
//   node scripts/dm-finder/find.mjs
//   node scripts/dm-finder/find.mjs --niches=medspa,dental --limit=40
//   node scripts/dm-finder/find.mjs --town=Hamilton

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { NICHES, DEFAULT_NICHES, DEFAULT_BBOX } from './niches.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, 'leads')
const LOG_PATH = join(__dirname, 'messaged.json')
const UA = 'OrbitLeadFinder/0.1 (local business research; orbitboyzz@gmail.com)'
const BRAND = 'Orbit Websites' // never send "OrbitBoyzz" to a stranger — reads as a scam handle

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const selected = arg('niches', DEFAULT_NICHES.join(',')).split(',').map((s) => s.trim()).filter((s) => NICHES[s])
const bbox = arg('bbox', DEFAULT_BBOX)
// Quality over volume, per the actual math: 100 well-screened leads at a 10%
// close is 10 clients. 1,000 cold ones at the same rate is the same 10 clients
// for 10x the wasted sends and 10x the "does this even work" noise in results.
const limit = Number(arg('limit', '100'))
const townFilter = arg('town', '').toLowerCase()
// Confirming real Instagram presence costs a rate-limited DDG lookup per lead
// (it 202'd us after ~2 rapid requests last run), so it only runs on the
// top-ranked candidates, throttled, not the whole pool.
const igCheckCount = Number(arg('igcheck', '25'))

if (!selected.length) {
  console.error('No valid niches. Available:', Object.keys(NICHES).join(', '))
  process.exit(1)
}

// Overpass is a free shared service and regularly returns 429/504 under load.
// Rotate mirrors and back off rather than failing a scheduled run.
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.osm.jp/api/interpreter',
]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function overpass(query, attempts = 3) {
  let lastError = 'unknown'
  for (let round = 0; round < attempts; round++) {
    for (const endpoint of ENDPOINTS) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA, Accept: 'application/json' },
          body: 'data=' + encodeURIComponent(query),
        })
        if (res.status === 200) return (await res.json()).elements || []
        lastError = `${new URL(endpoint).hostname} -> ${res.status}`
        console.log(`  ${lastError}, trying next mirror`)
      } catch (e) {
        lastError = `${new URL(endpoint).hostname} -> ${String(e.message).slice(0, 50)}`
        console.log(`  ${lastError}, trying next mirror`)
      }
    }
    if (round < attempts - 1) {
      const wait = 15000 * (round + 1)
      console.log(`  all mirrors busy; waiting ${wait / 1000}s before retry ${round + 2}/${attempts}`)
      await sleep(wait)
    }
  }
  throw new Error(`Overpass unavailable after ${attempts} rounds (last: ${lastError})`)
}

// OSM's addr:city is blank on most business records, so filtering on that string
// throws away nearly everything. Resolve the town to a bounding box instead and
// search geographically — that catches businesses regardless of tagging quality.
async function townBbox(town) {
  // featureType=settlement keeps Nominatim on towns/townships. Without it a query
  // like "hamilton" can match a street and return a uselessly small box.
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(town + ', New Jersey, USA')}&format=json&featureType=settlement&limit=1`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (res.status !== 200) return null
  const hits = await res.json()
  if (!hits.length || !hits[0].boundingbox) return null
  const [s, n, w, e] = hits[0].boundingbox.map(Number) // Nominatim: south,north,west,east
  // Pad slightly — businesses serving a town often sit just outside its border.
  const pad = 0.02
  return { bbox: `${s - pad},${w - pad},${n + pad},${e + pad}`, label: hits[0].display_name }
}

let searchBbox = bbox
if (townFilter) {
  const found = await townBbox(townFilter)
  if (found) {
    searchBbox = found.bbox
    console.log(`Town "${townFilter}" resolved to ${found.label.split(',').slice(0, 3).join(',')}`)
  } else {
    // Falling back to the whole region would silently return the wrong leads for
    // a typo, so stop instead and leave any existing batch alone.
    console.error(`Could not find a town called "${townFilter}" in New Jersey.`)
    console.error('Check the spelling, or clear the town box to search all of Central NJ.')
    process.exit(1)
  }
}

const selectors = selected.flatMap((k) => NICHES[k].selectors).map((s) => `${s}(${searchBbox});`).join('\n  ')
const query = `[out:json][timeout:180];\n(\n  ${selectors}\n);\nout center tags;`

console.log(`Searching ${selected.length} niches: ${selected.map((k) => NICHES[k].label).join(', ')}`)
console.log(`Area ${searchBbox}\n`)

const elements = await overpass(query)

const messaged = existsSync(LOG_PATH) ? JSON.parse(readFileSync(LOG_PATH, 'utf8')) : {}
const seen = new Set()
const rows = []

for (const el of elements) {
  const t = el.tags || {}
  if (!t.name) continue
  if (t.website || t['contact:website']) continue // must have NO website — that is the pitch

  const nicheKey = selected.find((k) => NICHES[k].match(t))
  if (!nicheKey) continue

  const city = t['addr:city'] || ''

  const street = [t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' ')
  const address = [street, city, t['addr:state'], t['addr:postcode']].filter(Boolean).join(', ')

  const key = `${t.name.toLowerCase().trim()}|${city.toLowerCase()}`
  if (seen.has(key) || messaged[key]) continue
  seen.add(key)

  const q = encodeURIComponent(`${t.name} ${city}`.trim())
  const lat = el.lat ?? el.center?.lat
  const lon = el.lon ?? el.center?.lon

  // DuckDuckGo's !ducky bang jumps straight to the top result, and site: pins it
  // to Instagram — so this lands on the actual profile, not a search page. The
  // redirect happens in the browser, so there is nothing to scrape or rate-limit.
  // Verified 2026-08-08: "Avanzato Jewelers Hamilton NJ" -> instagram.com/avanzatojewelers/
  const jump = `https://duckduckgo.com/?q=${encodeURIComponent(`!ducky site:instagram.com ${t.name} ${city || 'NJ'}`)}`

  // Quality score, before any network check. This is a proxy for "a real,
  // actively-maintained business" built from what OSM already gave us — no
  // extra requests, so it runs on the full pool, not a sample.
  //   +3  phone number listed         (someone answers; not an abandoned listing)
  //   +2  opening_hours set           (maintained recently, not stale data)
  //   +2  full street address         (a real location, not a name with no place)
  //   +1  niche is high-ticket        (can support the price, per the niche table)
  let score = 0
  if (t.phone || t['contact:phone']) score += 3
  if (t.opening_hours) score += 2
  if (t['addr:housenumber'] && t['addr:street']) score += 2
  if (NICHES[nicheKey].value === 'high') score += 1

  rows.push({
    name: t.name,
    niche: NICHES[nicheKey].label,
    value: NICHES[nicheKey].value,
    city,
    address,
    phone: t.phone || t['contact:phone'] || '',
    score,
    instagram_search: jump,
    google_search: `https://www.google.com/search?q=site:instagram.com+${q}`,
    maps: lat && lon ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : '',
    key,
  })
}

// Highest quality score first — this is the "100 good leads beat 1,000 cold
// ones" ordering. Value and phone stay as tiebreakers for equal scores.
const rank = { high: 0, 'medium-high': 1, mixed: 2 }
rows.sort((a, b) => (b.score - a.score) || (rank[a.value] - rank[b.value]) || (b.phone ? 1 : 0) - (a.phone ? 1 : 0) || a.name.localeCompare(b.name))
// OSM having no `website` tag does NOT mean the business has no website — the tag
// is simply missing on most records. Measured 2026-08-08: of 14 "no website"
// leads, 4 demonstrably had one. So verify before handing them over.
//
// Guessing a domain from the name is noisy in both directions: cannonball-pools.com
// really is Cannonball Pools, while familydentist.com belongs to someone else
// entirely. A guess is only trusted when the page carries the business's own phone
// number or town. Anything weaker is surfaced for a human glance, never dropped.
const digitsOf = (s) => String(s || '').replace(/\D/g, '').replace(/^1/, '')

function domainGuesses(name) {
  const clean = name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, '').trim()
  const stop = new Set(['the', 'and', 'of', 'llc', 'inc', 'co'])
  const core = clean.split(/\s+/).filter((w) => !stop.has(w))
  const stems = new Set([core.join(''), core.join('-')])
  if (core.length > 2) stems.add(core.slice(0, 2).join(''))
  return [...stems].filter((s) => s.length > 3 && s.length < 40).flatMap((s) => [`${s}.com`, `${s}.net`])
}

async function siteFor(lead) {
  for (const host of domainGuesses(lead.name)) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 8000)
      const res = await fetch('https://' + host, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA } })
      clearTimeout(timer)
      if (res.status >= 400) continue
      const body = await res.text()
      if (body.length < 600) continue
      if (/domain (is )?for sale|buy this domain|parked (free|domain)/i.test(body.slice(0, 4000))) continue

      const text = body.replace(/<[^>]+>/g, ' ')
      const phoneHit = lead.phone && digitsOf(text).includes(digitsOf(lead.phone))
      const townHit = lead.city && new RegExp(lead.city.replace(/[^a-z ]/gi, ''), 'i').test(body)
      return { url: res.url, confirmed: Boolean(phoneHit || townHit) }
    } catch { /* unreachable guess — keep trying */ }
  }
  return null
}

// Verify a bit more than we need, since confirmed ones get dropped.
const toCheck = rows.slice(0, Math.min(rows.length, Math.ceil(limit * 1.8)))
process.stdout.write(`Checking ${toCheck.length} for websites OSM doesn't know about`)
const verified = []
for (const lead of toCheck) {
  const site = await siteFor(lead)
  if (site?.confirmed) { process.stdout.write('x'); continue }   // has a site — not a prospect
  if (site) lead.possible_site = site.url                        // ambiguous — flag, don't drop
  process.stdout.write(site ? '?' : '.')
  verified.push(lead)
  if (verified.length >= limit) break
}
console.log(`\n  ${toCheck.length - verified.length} dropped (site confirmed), ${verified.filter((l) => l.possible_site).length} flagged for a look\n`)

let batch = verified.slice(0, limit)

// Confirm real Instagram presence on the top-ranked leads only. A browser
// following the !ducky bang gets redirected client-side (verified: this landed
// on instagram.com/avanzatojewelers/ in a real browser tab). A plain fetch()
// never runs that JS — DDG instead serves a static fallback page with a
// <meta http-equiv="refresh"> and an obfuscated /l/?uddg=<encoded-target> link,
// which fetch() does not follow either. Missing both of those was an earlier
// bug here: it made every check register as "no profile found." Fixed by
// pulling the real target out of the uddg param instead of trusting res.url.
//
// This confirms presence, not activity — no way to see post recency this way,
// only that an account exists. Rate-limited hard after ~2 rapid requests in
// testing (HTTP 202), so this stays capped and throttled.
async function hasInstagramProfile(lead) {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 9000)
    const res = await fetch(lead.instagram_search, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA } })
    clearTimeout(timer)
    if (new URL(res.url).hostname.includes('instagram.com')) return true

    const body = await res.text()
    const m = body.match(/uddg=([^&"']+)/)
    if (!m) return false
    const target = decodeURIComponent(m[1])
    return new URL(target).hostname.includes('instagram.com')
  } catch {
    return null // inconclusive — network hiccup, not "no profile"
  }
}

const toIgCheck = batch.slice(0, Math.min(igCheckCount, batch.length))
if (toIgCheck.length) {
  process.stdout.write(`Confirming Instagram presence on the top ${toIgCheck.length} (rate-limited, one at a time)`)
  for (const lead of toIgCheck) {
    const found = await hasInstagramProfile(lead)
    lead.instagram_confirmed = found
    process.stdout.write(found === true ? '.' : found === false ? 'x' : '?')
    await sleep(4000) // stay well clear of the ~2-request limit seen earlier
  }
  const confirmed = toIgCheck.filter((l) => l.instagram_confirmed === true).length
  console.log(`\n  ${confirmed}/${toIgCheck.length} have a confirmed Instagram profile\n`)
}

if (!batch.length) {
  console.log('\nNo matching businesses found — leaving the previous batch untouched.')
  console.log('Try a wider area, more niches, or drop the town filter.')
  process.exit(0)
}

mkdirSync(OUT_DIR, { recursive: true })
const date = new Date().toISOString().slice(0, 10)
const cols = ['name', 'niche', 'city', 'address', 'phone', 'score', 'instagram_confirmed', 'possible_site', 'instagram_search', 'google_search', 'maps']
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
const csv = [cols.join(','), ...batch.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
const file = join(OUT_DIR, `${date}-dm-batch.csv`)
writeFileSync(file, csv, 'utf8')
writeFileSync(join(OUT_DIR, `${date}-dm-batch.json`), JSON.stringify(batch, null, 2), 'utf8')

console.log(`Found ${rows.length} businesses with no website; wrote the top ${batch.length}.\n`)
const byNiche = {}
for (const r of batch) byNiche[r.niche] = (byNiche[r.niche] || 0) + 1
for (const [n, c] of Object.entries(byNiche).sort((a, b) => b[1] - a[1])) console.log(`  ${String(c).padStart(3)}  ${n}`)

console.log(`\n  ${file}`)
console.log(`\n  Already messaged: ${Object.keys(messaged).length}. After a round, run:`)
console.log(`  node scripts/dm-finder/mark-messaged.mjs ${date}`)
