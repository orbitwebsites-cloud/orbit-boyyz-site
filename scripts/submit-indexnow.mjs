import { readFileSync } from 'node:fs'
import { request } from 'node:https'
import { join } from 'node:path'

const ORIGIN = 'https://orbitboyzz.me'
const HOST = new URL(ORIGIN).host
const ENDPOINT = 'https://www.bing.com/indexnow'
const SITEMAP_PATH = join(process.cwd(), 'dist', 'sitemap.xml')
const KEY_PATH = join(process.cwd(), 'public', 'orbitboyzz-indexnow-key.txt')

const live = process.argv.includes('--live')

function readKey() {
  return readFileSync(KEY_PATH, 'utf-8').trim()
}

function readSitemapUrls() {
  const sitemap = readFileSync(SITEMAP_PATH, 'utf-8')
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith(`${ORIGIN}/`))
}

function submitIndexNow(payload) {
  const body = JSON.stringify(payload)
  const endpoint = new URL(ENDPOINT)

  return new Promise((resolve, reject) => {
    const req = request(
      {
        method: 'POST',
        hostname: endpoint.hostname,
        path: endpoint.pathname,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let responseBody = ''
        res.setEncoding('utf-8')
        res.on('data', (chunk) => {
          responseBody += chunk
        })
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body: responseBody })
        })
      },
    )

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

const key = readKey()
const urls = readSitemapUrls()
const payload = {
  host: HOST,
  key,
  keyLocation: `${ORIGIN}/orbitboyzz-indexnow-key.txt`,
  urlList: urls,
}

console.log(`IndexNow endpoint: ${ENDPOINT}`)
console.log(`Host: ${payload.host}`)
console.log(`Key location: ${payload.keyLocation}`)
console.log(`URLs discovered from dist/sitemap.xml: ${urls.length}`)

if (!urls.length) {
  throw new Error('No URLs found in dist/sitemap.xml. Run npm run build first.')
}

if (!live) {
  console.log('Dry run only. Re-run with --live to submit URLs.')
  console.log(JSON.stringify({ ...payload, key: '[redacted]' }, null, 2))
  process.exit(0)
}

const result = await submitIndexNow(payload)
console.log(`IndexNow response status: ${result.statusCode}`)
if (result.body) console.log(result.body)

if (![200, 202].includes(result.statusCode)) {
  process.exitCode = 1
}
