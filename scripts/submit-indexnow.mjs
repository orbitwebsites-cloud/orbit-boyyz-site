// Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver...
// share submissions), so the orbitboyzz.me -> orbitboyzz.com move is picked up fast.
//
// Run AFTER a production deploy: it reads the deployed sitemap and checks the
// deployed key file:
//   node scripts/submit-indexnow.mjs            dry run: list what would be sent
//   node scripts/submit-indexnow.mjs --live     submit
// Options:
//   --sitemap=<url|path>   read URLs from another sitemap (default: the live one)
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ORIGIN = 'https://orbitboyzz.com'
const HOST = new URL(ORIGIN).host
const ENDPOINT = 'https://www.bing.com/indexnow'
const KEY_FILE = 'orbitboyzz-indexnow-key.txt'
const KEY_PATH = join(process.cwd(), 'public', KEY_FILE)
const KEY_LOCATION = `${ORIGIN}/${KEY_FILE}`

const args = process.argv.slice(2)
const live = args.includes('--live')
const sitemapArg = args.find((arg) => arg.startsWith('--sitemap='))?.slice('--sitemap='.length)
const sitemapSource = sitemapArg || `${ORIGIN}/sitemap.xml`

function readKey() {
  return readFileSync(KEY_PATH, 'utf-8').trim()
}

async function readText(source) {
  if (!/^https?:\/\//.test(source)) return readFileSync(source, 'utf-8')
  const res = await fetch(source, { headers: { 'User-Agent': 'orbitboyzz-indexnow-script' } })
  if (!res.ok) throw new Error(`GET ${source} -> HTTP ${res.status}`)
  return res.text()
}

async function readSitemapUrls() {
  const sitemap = await readText(sitemapSource)
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim())
  // IndexNow only accepts URLs on the host the key belongs to.
  return [...new Set(urls.filter((url) => new URL(url).host === HOST))]
}

/** The engine fetches keyLocation to verify ownership; make sure it's live first. */
async function keyFileIsLive(key) {
  try {
    const body = await readText(KEY_LOCATION)
    return body.trim() === key
  } catch {
    return false
  }
}

const key = readKey()
const urls = await readSitemapUrls()
const payload = { host: HOST, key, keyLocation: KEY_LOCATION, urlList: urls }

console.log(`IndexNow endpoint: ${ENDPOINT}`)
console.log(`Host: ${HOST}`)
console.log(`Key location: ${KEY_LOCATION}`)
console.log(`Sitemap: ${sitemapSource}`)
console.log(`URLs on ${HOST}: ${urls.length}`)

if (!urls.length) {
  throw new Error(`No ${HOST} URLs found in ${sitemapSource}.`)
}

if (!live) {
  console.log('Dry run only. Re-run with --live to submit these URLs:')
  for (const url of urls) console.log(`  ${url}`)
  process.exit(0)
}

if (!(await keyFileIsLive(key))) {
  throw new Error(`${KEY_LOCATION} is not live or does not contain the key from public/${KEY_FILE}. Deploy first.`)
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
})
const body = await res.text()
console.log(`IndexNow response status: ${res.status}`)
if (body) console.log(body)

// 200 = submitted; 202 = accepted, key check still pending on the engine's side.
if (![200, 202].includes(res.status)) {
  process.exitCode = 1
}
