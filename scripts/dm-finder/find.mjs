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

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const selected = arg('niches', DEFAULT_NICHES.join(',')).split(',').map((s) => s.trim()).filter((s) => NICHES[s])
const bbox = arg('bbox', DEFAULT_BBOX)
const limit = Number(arg('limit', '60'))
const townFilter = arg('town', '').toLowerCase()

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

  rows.push({
    name: t.name,
    niche: NICHES[nicheKey].label,
    value: NICHES[nicheKey].value,
    city,
    address,
    phone: t.phone || t['contact:phone'] || '',
    instagram_search: `https://www.instagram.com/explore/search/keyword/?q=${q}`,
    google_search: `https://www.google.com/search?q=${q}+instagram`,
    maps: lat && lon ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : '',
    key,
  })
}

// High-value niches first, then ones with a phone number (easier to verify they're real)
const rank = { high: 0, 'medium-high': 1, mixed: 2 }
rows.sort((a, b) => (rank[a.value] - rank[b.value]) || (b.phone ? 1 : 0) - (a.phone ? 1 : 0) || a.name.localeCompare(b.name))
const batch = rows.slice(0, limit)

if (!batch.length) {
  console.log('\nNo matching businesses found — leaving the previous batch untouched.')
  console.log('Try a wider area, more niches, or drop the town filter.')
  process.exit(0)
}

mkdirSync(OUT_DIR, { recursive: true })
const date = new Date().toISOString().slice(0, 10)
const cols = ['name', 'niche', 'city', 'address', 'phone', 'instagram_search', 'google_search', 'maps']
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
