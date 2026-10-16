// Submit the URLs in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver...
// share submissions), so new and changed pages are picked up fast.
//
// The sitemap (https://orbitboyzz.com/sitemap.xml) lists orbitboyzz.com pages
// plus one cross-host entry, https://leads.orbitboyzz.com/. IndexNow only
// accepts URLs on the host a payload names, so URLs are grouped by host and
// each host gets its own payload, with that host's copy of the key file as
// keyLocation (public/ is served on both hosts).
//
// Run AFTER a production deploy: it reads the deployed sitemap and checks the
// deployed key files:
//   node scripts/submit-indexnow.mjs            dry run: list what would be sent, per host
//   node scripts/submit-indexnow.mjs --live     submit (one POST per host)
// Options:
//   --sitemap=<url|path>   read URLs from another sitemap (default: the live one)
//   --since=YYYY-MM-DD     only send URLs whose sitemap <lastmod> (first 10
//                          characters) is on or after that date; URLs with no
//                          <lastmod> are kept
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ORIGIN = 'https://orbitboyzz.com'
const ALLOWED_HOSTS = ['orbitboyzz.com', 'leads.orbitboyzz.com']
const ENDPOINT = 'https://www.bing.com/indexnow'
const KEY_FILE = 'orbitboyzz-indexnow-key.txt'
const KEY_PATH = join(process.cwd(), 'public', KEY_FILE)

const args = process.argv.slice(2)
const live = args.includes('--live')
const sitemapArg = args.find((arg) => arg.startsWith('--sitemap='))?.slice('--sitemap='.length)
const sitemapSource = sitemapArg || `${ORIGIN}/sitemap.xml`
const sinceArg = args.find((arg) => arg.startsWith('--since='))?.slice('--since='.length)

if (sinceArg !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(sinceArg)) {
  throw new Error(`--since must be YYYY-MM-DD, got "${sinceArg}".`)
}

const keyLocation = (host) => `https://${host}/${KEY_FILE}`

function readKey() {
  return readFileSync(KEY_PATH, 'utf-8').trim()
}

async function readText(source) {
  if (!/^https?:\/\//.test(source)) return readFileSync(source, 'utf-8')
  const res = await fetch(source, { headers: { 'User-Agent': 'orbitboyzz-indexnow-script' } })
  if (!res.ok) throw new Error(`GET ${source} -> HTTP ${res.status}`)
  return res.text()
}

/** Sitemap entries as { url, lastmod } (lastmod: first 10 chars, or null). */
async function readSitemapEntries() {
  const sitemap = await readText(sitemapSource)
  return [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((match) => {
      const block = match[1]
      const loc = /<loc>([\s\S]*?)<\/loc>/.exec(block)?.[1].trim()
      const lastmod = /<lastmod>([\s\S]*?)<\/lastmod>/.exec(block)?.[1].trim().slice(0, 10) || null
      return loc ? { url: loc, lastmod } : null
    })
    .filter(Boolean)
}

/** URLs grouped by host, allowed hosts only, deduped, in sitemap order. */
function groupByHost(entries) {
  const byHost = new Map(ALLOWED_HOSTS.map((host) => [host, []]))
  for (const { url, lastmod } of entries) {
    let host
    try {
      host = new URL(url).host
    } catch {
      continue
    }
    const list = byHost.get(host)
    if (!list || list.includes(url)) continue
    // ISO dates compare correctly as strings.
    if (sinceArg && lastmod && lastmod < sinceArg) continue
    list.push(url)
  }
  return byHost
}

/** The engine fetches keyLocation to verify ownership; make sure it's live first. */
async function keyFileIsLive(location, key) {
  try {
    const body = await readText(location)
    return body.trim() === key
  } catch {
    return false
  }
}

const key = readKey()
const entries = await readSitemapEntries()
const byHost = groupByHost(entries)
const total = [...byHost.values()].reduce((sum, list) => sum + list.length, 0)

console.log(`IndexNow endpoint: ${ENDPOINT}`)
console.log(`Sitemap: ${sitemapSource}`)
console.log(`Sitemap entries: ${entries.length}`)
if (sinceArg) console.log(`Since: ${sinceArg} (lastmod on or after; entries with no lastmod kept)`)
console.log(`URLs to send: ${total}`)

if (!total) {
  throw new Error(`No ${ALLOWED_HOSTS.join(' / ')} URLs to send from ${sitemapSource}${sinceArg ? ` since ${sinceArg}` : ''}.`)
}

if (!live) {
  for (const [host, urls] of byHost) {
    console.log(`\nHost: ${host} (${urls.length} URL${urls.length === 1 ? '' : 's'})`)
    console.log(`Key location: ${keyLocation(host)}`)
    for (const url of urls) console.log(`  ${url}`)
  }
  console.log('\nDry run only. Re-run with --live to submit these URLs.')
  process.exit(0)
}

const toSend = [...byHost].filter(([, urls]) => urls.length)

// Check every host's key file before sending anything.
for (const [host] of toSend) {
  if (!(await keyFileIsLive(keyLocation(host), key))) {
    throw new Error(`${keyLocation(host)} is not live or does not contain the key from public/${KEY_FILE}. Deploy first.`)
  }
}

for (const [host, urls] of toSend) {
  const location = keyLocation(host)
  console.log(`\nHost: ${host} (${urls.length} URL${urls.length === 1 ? '' : 's'})`)
  console.log(`Key location: ${location}`)

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: location, urlList: urls }),
  })
  const body = await res.text()
  console.log(`IndexNow response status: ${res.status}`)
  if (body) console.log(body)

  // 200 = submitted; 202 = accepted, key check still pending on the engine's side.
  if (![200, 202].includes(res.status)) {
    process.exitCode = 1
  }
}
