// Route + SEO parity checker for the ported site.
//   node check.mjs [--refresh-live]
// Expected values come from expected.json (built by build-expected.mjs from the
// old prerender.mjs). Live old pages (https://www.orbitboyzz.me) are cached in
// ./live-cache and used for a verbatim-text containment check + API parity.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'

const BASE = process.env.BASE ?? 'http://localhost:3110'
const LIVE = 'https://www.orbitboyzz.me'
const expected = JSON.parse(readFileSync(new URL('./expected.json', import.meta.url), 'utf8'))
const liveRoutes = readFileSync('D:/orbitboyzz-revamp/live-routes.txt', 'utf8').split(/\r?\n/).filter(Boolean)
const KEPT = new Set(['/', '/about', '/services', '/pricing', '/projects', '/contact', '/faq'])
const refresh = process.argv.includes('--refresh-live')
mkdirSync(new URL('./live-cache/', import.meta.url), { recursive: true })

// ---------------------------------------------------------------- helpers
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
const pick = (html, re) => {
  const m = html.match(re)
  return m ? decode(m[1]) : null
}
const meta = (html) => ({
  title: pick(html, /<title>([^<]*)<\/title>/),
  description: pick(html, /<meta name="description" content="([^"]*)"/),
  canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
  ogTitle: pick(html, /<meta property="og:title" content="([^"]*)"/),
  robots: pick(html, /<meta name="robots" content="([^"]*)"/),
  jsonLd: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1])
    } catch {
      return { __invalid: m[1].slice(0, 80) }
    }
  }),
})
const squash = (s) => s.replace(/\s+/g, '')

// Old <main> → text segments (block-level), for the verbatim containment check.
function oldSegments(html) {
  const start = html.indexOf('<main')
  const end = html.lastIndexOf('</main>')
  if (start < 0 || end < 0) return []
  let body = html.slice(start, end)
  body = body.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
  body = body.replace(/<\/(p|h[1-6]|li|summary|div|section|article|button|dt|dd|label|pre|a|span|strong|small|code|ol|ul)>/g, '\n')
  body = body.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')
  return decode(body)
    .split('\n')
    .map((s) => s.replace(/\s+/g, ' ').trim().replace(/^—\s*/, ''))
    .filter((s) => s.length >= 24 && s.includes(' '))
}
function newText(html) {
  const start = html.indexOf('<main')
  const end = html.lastIndexOf('</main>')
  const body = (start >= 0 ? html.slice(start, end) : html).replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')
  return squash(decode(body))
}

async function get(url, init) {
  const res = await fetch(url, { redirect: 'manual', ...init })
  return { res, text: await res.text() }
}

async function live(path) {
  const file = new URL(`./live-cache/${path.replace(/[^a-z0-9-]/gi, "_") || "_"}.html`, import.meta.url)
  if (!refresh && existsSync(file)) return readFileSync(file, 'utf8')
  const { res, text } = await get(LIVE + path)
  if (res.status !== 200) return null
  writeFileSync(file, text)
  return text
}

async function pool(items, n, fn) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++
        out[k] = await fn(items[k], k)
      }
    }),
  )
  return out
}

// ---------------------------------------------------------------- 1. pages
const pages = [...liveRoutes, '/form']
const newHtml = new Map()
const rows = await pool(pages, 6, async (path) => {
  const exp = expected.routes[path]
  const { res, text } = await get(BASE + path)
  newHtml.set(path, text)
  const m = meta(text)
  const kept = KEPT.has(path)
  const problems = []
  if (res.status !== 200) problems.push(`status ${res.status}`)
  if (!m.title) problems.push('empty <title>')
  const titleOk = m.title === exp.title
  const descOk = m.description === exp.description
  if (!kept) {
    if (!titleOk) problems.push(`title "${m.title}" != "${exp.title}"`)
    if (!descOk) problems.push(`description mismatch`)
    if (exp.canonical && m.canonical !== exp.canonical) problems.push(`canonical ${m.canonical}`)
    if (exp.jsonLd) {
      const found = m.jsonLd.some((d) => isDeepStrictEqual(d, exp.jsonLd))
      if (!found) problems.push(`JSON-LD differs (${m.jsonLd.length} blocks)`)
      if (m.jsonLd.length !== 1) problems.push(`expected 1 JSON-LD block, found ${m.jsonLd.length}`)
    }
    if (m.ogTitle !== exp.title) problems.push('og:title mismatch')
  }
  // Verbatim text: every old <main> text segment must appear on the new page.
  let missing = []
  let checked = 0
  const oldHtml = await live(path === '/form' ? '/__none__' : path).catch(() => null)
  if (oldHtml && !kept) {
    const hay = newText(text)
    const segs = [...new Set(oldSegments(oldHtml))]
    checked = segs.length
    missing = segs.filter((seg) => !hay.includes(squash(seg)))
  }
  return { path, status: res.status, kept, titleOk, descOk, problems, missing, checked, title: m.title }
})

// ---------------------------------------------------------------- 2. files
const fileRows = []
{
  const { res, text } = await get(`${BASE}/feed.xml`)
  const p = []
  if (res.status !== 200) p.push(`status ${res.status}`)
  if (text !== expected.feed) p.push('feed differs from old writeFeed() output')
  fileRows.push({ path: '/feed.xml', status: res.status, problems: p })
}
{
  const { res, text } = await get(`${BASE}/sitemap.xml`)
  const p = []
  if (res.status !== 200) p.push(`status ${res.status}`)
  const parse = (xml) =>
    [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
      loc: pick(m[1], /<loc>([^<]*)<\/loc>/),
      lastmod: pick(m[1], /<lastmod>([^<]*)<\/lastmod>/),
      changefreq: pick(m[1], /<changefreq>([^<]*)<\/changefreq>/),
      priority: Number(pick(m[1], /<priority>([^<]*)<\/priority>/)),
    }))
  const a = parse(text)
  const b = parse(expected.sitemap)
  if (!isDeepStrictEqual(a, b)) p.push(`sitemap entries differ (${a.length} vs ${b.length})`)
  fileRows.push({ path: '/sitemap.xml', status: res.status, problems: p, note: `${a.length} urls` })
}
{
  const { res, text } = await get(`${BASE}/llms.txt`)
  const p = []
  if (res.status !== 200) p.push(`status ${res.status}`)
  if (text !== readFileSync('D:/orbitboyzz-revamp/old-site-src/public/llms.txt', 'utf8')) p.push('llms.txt differs from old public/llms.txt')
  fileRows.push({ path: '/llms.txt', status: res.status, problems: p })
}

// ---------------------------------------------------------------- 3. internal links
const hrefs = new Set()
for (const html of newHtml.values()) {
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const h = decode(m[1]).split('#')[0].split('?')[0]
    if (!h || h.startsWith('/_next/') || h.startsWith('//')) continue
    hrefs.add(h)
  }
}
const broken = []
await pool([...hrefs], 6, async (h) => {
  const { res } = await get(BASE + h)
  if (res.status !== 200) broken.push(`${h} → ${res.status}`)
})

// ---------------------------------------------------------------- 4. APIs + negotiation
const api = []
const curlBody = { need: 'ai', complexity: 'complex', urgency: 'urgent', employee: 'dispatcher', automation: true }
// Expected quote numbers come from the OLD SOURCE lib (old-site-src/src/lib/quoteEstimate.ts).
const { createRequire } = await import('node:module')
const ts = createRequire('D:/orbitboyzz-revamp/site/package.json')('typescript')
const oldQuoteJs = ts.transpileModule(readFileSync('D:/orbitboyzz-revamp/old-site-src/src/lib/quoteEstimate.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const oldQuote = await import('data:text/javascript;base64,' + Buffer.from(oldQuoteJs).toString('base64'))
const oldEstimate = (b) => {
  const input = { need: b.need ?? 'site', complexity: b.complexity ?? 'simple', urgency: b.urgency ?? 'normal', employee: b.employee ?? 'none', automation: b.automation === true }
  return { input, estimate: oldQuote.calculateQuoteEstimate(input) }
}
const liveNotes = []
async function apiCase(name, path, init, { status, compareLive = true, check, expectBody, liveKeys } = {}) {
  const n = await get(BASE + path, init)
  let body = null
  try {
    body = JSON.parse(n.text)
  } catch {}
  const p = []
  if (n.res.status !== status) p.push(`status ${n.res.status} (want ${status})`)
  if (!/application\/json/.test(n.res.headers.get('content-type') ?? '')) p.push(`content-type ${n.res.headers.get('content-type')}`)
  if (body === null) p.push('not JSON')
  if (check) p.push(...check(body, n.res))
  if (expectBody && !isDeepStrictEqual(body, expectBody)) p.push('body differs from old source calculation')
  if (compareLive) {
    const l = await get(LIVE + path, init)
    let lb = null
    try {
      lb = JSON.parse(l.text)
    } catch {}
    if (l.res.status !== n.res.status) p.push(`live status ${l.res.status}`)
    const strip = (o) => (o && typeof o === 'object' ? JSON.parse(JSON.stringify(o, (k, v) => (k === 'time' ? undefined : v))) : o)
    const view = (o) => (liveKeys ? liveKeys(o) : strip(o))
    if (!isDeepStrictEqual(view(lb), view(body))) {
      if (compareLive === 'info') liveNotes.push(`${name}: live (current production build) returns ${l.text.slice(0, 220)}`)
      else p.push(`body differs from live: ${l.text.slice(0, 160)}`)
    }
  }
  api.push({ name, status: n.res.status, problems: p, sample: n.text.slice(0, 140) })
}
const jsonPost = (b) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })
await apiCase('POST /api/quote-estimate (Developers curl example)', '/api/quote-estimate', jsonPost(curlBody), { status: 200, expectBody: oldEstimate(curlBody), compareLive: 'info' })
await apiCase('POST /api/quote-estimate {} (defaults)', '/api/quote-estimate', jsonPost({}), { status: 200, expectBody: oldEstimate({}), compareLive: 'info' })
await apiCase('POST /api/quote-estimate site/medium/fast+automation', '/api/quote-estimate', jsonPost({ need: 'site', complexity: 'medium', urgency: 'fast', automation: true, employee: 'receptionist' }), { status: 200, expectBody: oldEstimate({ need: 'site', complexity: 'medium', urgency: 'fast', automation: true, employee: 'receptionist' }), compareLive: 'info' })
await apiCase('POST /api/quote-estimate need=bad → 400', '/api/quote-estimate', jsonPost({ need: 'bad' }), { status: 400 })
await apiCase('GET /api/quote-estimate → 405', '/api/quote-estimate', { method: 'GET' }, { status: 405, check: (_b, r) => (r.headers.get('allow') === 'POST' ? [] : ['Allow header']) })
await apiCase('GET /api/health', '/api/health', { method: 'GET' }, { status: 200, check: (b) => (b?.status === 'ok' && b?.service === 'orbitboyzz-site' && !Number.isNaN(Date.parse(b?.time)) ? [] : ['shape']) })
await apiCase('POST /api/health → 405', '/api/health', { method: 'POST' }, { status: 405 })
await apiCase('GET /api/nope → 404 JSON', '/api/nope', { method: 'GET' }, { status: 404, liveKeys: (o) => [o?.error?.code, o?.error?.hint] })
await apiCase('GET /api/lead-form → 405', '/api/lead-form', { method: 'GET' }, { status: 405 })
await apiCase('POST /api/lead-form invalid (no email/CRM side effects) → 400', '/api/lead-form', jsonPost({ businessName: '' }), { status: 400 })
await apiCase('POST /api/lead-form bad phone → 400', '/api/lead-form', jsonPost({ businessName: 'A', industry: 'B', contactName: 'C D', phone: '12', email: 'x@y.co' }), { status: 400 })

// markdown negotiation + Vary
const neg = []
for (const [path, accept] of [
  ['/', 'text/markdown'],
  ['/pricing', 'text/markdown, text/html;q=0.9'],
  ['/developers', 'text/markdown'],
]) {
  const n = await get(BASE + path, { headers: { Accept: accept } })
  const l = await get(LIVE + path, { headers: { Accept: accept } })
  const p = []
  if (n.res.status !== 200) p.push(`status ${n.res.status}`)
  if (!/text\/markdown/.test(n.res.headers.get('content-type') ?? '')) p.push(`content-type ${n.res.headers.get('content-type')}`)
  if (n.text !== l.text) p.push('markdown differs from live')
  neg.push({ name: `Accept: ${accept} on ${path}`, problems: p, vary: n.res.headers.get('vary') })
}
{
  const n = await get(`${BASE}/blog`, { headers: { Accept: 'text/html' } })
  const vary = (n.res.headers.get('vary') ?? '').toLowerCase()
  const p = []
  if (!/text\/html/.test(n.res.headers.get('content-type') ?? '')) p.push('not html')
  if (!vary.includes('accept,') && !vary.endsWith('accept')) p.push(`Vary lacks Accept: ${vary}`)
  if (!vary.includes('accept-encoding')) p.push(`Vary lacks Accept-Encoding: ${vary}`)
  neg.push({ name: 'HTML page Vary header (/blog)', problems: p, vary: n.res.headers.get('vary') })
}
{
  const n = await get(`${BASE}/`, { headers: { Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' } })
  neg.push({ name: 'Browser Accept on / stays HTML', problems: /text\/html/.test(n.res.headers.get('content-type') ?? '') ? [] : ['not html'], vary: n.res.headers.get('vary') })
}

// ---------------------------------------------------------------- report
const pad = (s, n) => String(s).padEnd(n)
console.log('\n=== ROUTES (77 live sitemap + /form) ===')
console.log(pad('path', 52), pad('status', 7), pad('title', 7), pad('desc', 6), 'result')
let pass = 0
let keptDiff = []
for (const r of rows) {
  const ok = r.problems.length === 0
  if (ok) pass++
  if (r.kept && (!r.titleOk || !r.descOk)) keptDiff.push(r)
  const t = r.kept ? (r.titleOk ? 'same' : 'KEPT≠') : r.titleOk ? 'ok' : 'DIFF'
  const d = r.kept ? (r.descOk ? 'same' : 'KEPT≠') : r.descOk ? 'ok' : 'DIFF'
  console.log(pad(r.path, 52), pad(r.status, 7), pad(t, 7), pad(d, 6), ok ? 'PASS' : `FAIL: ${r.problems.join('; ')}`)
}
console.log('\n=== FILES ===')
for (const r of fileRows) {
  const ok = r.problems.length === 0
  if (ok) pass++
  console.log(pad(r.path, 52), pad(r.status, 7), ok ? `PASS ${r.note ?? ''}` : `FAIL: ${r.problems.join('; ')}`)
}
const total = rows.length + fileRows.length
console.log(`\nPAGES+FILES: ${pass}/${total} pass`)
if (keptDiff.length) {
  console.log(`\nKept (unchanged) new pages whose title/description differ from the old site (${keptDiff.length}) — owner decision:`)
  for (const r of keptDiff) console.log(`  ${r.path}: new "${r.title}"  |  old "${expected.routes[r.path].title}"`)
}

console.log('\n=== VERBATIM TEXT (old <main> segments missing on new page) ===')
let segMissing = 0
for (const r of rows) {
  if (!r.missing.length) continue
  segMissing += r.missing.length
  console.log(`${r.path} (${r.missing.length})`)
  for (const s of r.missing.slice(0, 8)) console.log(`   - ${s.slice(0, 150)}`)
}
console.log(`segments checked: ${rows.reduce((a, r) => a + r.checked, 0)} across ${rows.filter((r) => r.checked).length} ported pages`)
console.log(segMissing ? `total missing segments: ${segMissing}` : 'all old text segments present on every ported page')

console.log(`\n=== INTERNAL LINKS (${hrefs.size} unique) ===`)
console.log(broken.length ? broken.join('\n') : 'all resolve 200')

console.log('\n=== API ===')
for (const r of api) console.log(pad(r.problems.length ? 'FAIL' : 'PASS', 5), pad(r.name, 70), r.problems.join('; ') || r.sample)
if (liveNotes.length) console.log('INFO (not failures):\n  ' + liveNotes.join('\n  '))
console.log('\n=== MARKDOWN / VARY ===')
for (const r of neg) console.log(pad(r.problems.length ? 'FAIL' : 'PASS', 5), pad(r.name, 50), r.problems.join('; ') || `Vary: ${r.vary}`)

writeFileSync(new URL('./check-result.json', import.meta.url), JSON.stringify({ pass, total, rows, fileRows, broken, api, neg }, null, 1))
