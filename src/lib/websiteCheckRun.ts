// Server-only: the network side of the free website check
// (POST /api/website-check). Never import this from a client component —
// it uses node:dns. Every function here catches its own failures: a check
// that couldn't run is reported as "unavailable", never as a pass.
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import {
  CHECK_LABELS,
  CHECK_WEIGHTS,
  STATUS_CREDIT,
  gradeFor,
  scoreChecks,
  type CheckId,
  type CheckResult,
  type CheckStatus,
  type PageSpeedMetrics,
  type WebsiteCheckReport,
} from './websiteCheck'

const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 OrbitWebsiteCheck/1.0 (+https://orbitboyzz.com/free-website-check)'
const PAGE_TIMEOUT_MS = 6000
const HTTP_PROBE_TIMEOUT_MS = 5000
const FALLBACK_TIMEOUT_MS = 5000
const DNS_TIMEOUT_MS = 3000
const PSI_TIMEOUT_MS = 15000
const MAX_HTML_BYTES = 3_000_000
const MAX_REDIRECTS = 5
const TOTAL_CHECKS = Object.keys(CHECK_WEIGHTS).length

/** Thrown when the address (or a redirect) points at a private/internal network. */
export class BlockedHostError extends Error {}

// --- SSRF guard ----------------------------------------------------------------

function isPrivateV4(ip: string) {
  const [a, b, c] = ip.split('.').map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  )
}

function isPrivateIp(ip: string) {
  if (isIP(ip) === 4) return isPrivateV4(ip)
  const v = ip.toLowerCase()
  if (v === '::' || v === '::1') return true
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(v)
  if (mapped) return isPrivateV4(mapped[1])
  return /^(fc|fd|fe8|fe9|fea|feb|ff)/.test(v) || v.startsWith('64:ff9b:')
}

type HostState = 'public' | 'private' | 'notfound' | 'error'

/**
 * Resolves a hostname and refuses private/loopback/link-local targets (cloud
 * metadata, localhost…). Best effort: fetch re-resolves, so this does not
 * defend against DNS rebinding — acceptable for a read-only GET of a homepage.
 */
async function hostState(host: string, cache: Map<string, HostState>): Promise<HostState> {
  const cached = cache.get(host)
  if (cached) return cached
  let state: HostState
  if (isIP(host)) {
    state = isPrivateIp(host) ? 'private' : 'public'
  } else {
    try {
      const addresses = await Promise.race([
        lookup(host, { all: true, verbatim: true }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('dns timeout')), DNS_TIMEOUT_MS)),
      ])
      state = !addresses.length ? 'notfound' : addresses.some((a) => isPrivateIp(a.address)) ? 'private' : 'public'
    } catch (err) {
      const code = (err as { code?: string }).code
      state = code === 'ENOTFOUND' || code === 'ENODATA' || code === 'ESERVFAIL' ? 'notfound' : 'error'
    }
  }
  cache.set(host, state)
  return state
}

// --- Fetching --------------------------------------------------------------------

type FetchFailure = { reason: 'timeout' | 'dns' | 'tls' | 'refused' | 'redirects' | 'other'; code: string }

function classifyFetchError(err: unknown): FetchFailure {
  const e = err as { name?: string; code?: string; cause?: { code?: string; name?: string } }
  const code = e.cause?.code ?? e.code ?? e.name ?? 'unknown'
  if (e.name === 'TimeoutError' || e.name === 'AbortError' || code === 'UND_ERR_CONNECT_TIMEOUT' || code === 'UND_ERR_HEADERS_TIMEOUT') {
    return { reason: 'timeout', code }
  }
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') return { reason: 'dns', code }
  if (/CERT|TLS|SSL|SELF_SIGNED|UNABLE_TO_VERIFY|DEPTH_ZERO|EPROTO/i.test(code)) return { reason: 'tls', code }
  if (code === 'ECONNREFUSED' || code === 'ECONNRESET' || code === 'EHOSTUNREACH' || code === 'ENETUNREACH') return { reason: 'refused', code }
  return { reason: 'other', code }
}

type Hop = { response: Response; url: URL; hops: string[]; ttfbMs: number }

/** GET with manual redirect-following so every hop goes through the SSRF guard. */
async function fetchFollowing(start: URL, signal: AbortSignal, cache: Map<string, HostState>, maxRedirects = MAX_REDIRECTS): Promise<Hop> {
  let current = start
  const hops: string[] = []
  for (let i = 0; i <= maxRedirects; i++) {
    const state = await hostState(current.hostname, cache)
    if (state === 'private') throw new BlockedHostError(`${current.hostname} is not a public website address.`)
    // Never fetch a host we couldn't vet — a failed lookup must not bypass the guard.
    if (state === 'notfound') throw Object.assign(new Error('dns'), { code: 'ENOTFOUND' })
    if (state === 'error') throw Object.assign(new Error('dns'), { code: 'EAI_AGAIN' })

    const startedAt = performance.now()
    const response = await fetch(current, {
      method: 'GET',
      redirect: 'manual',
      cache: 'no-store',
      signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' },
    })
    const ttfbMs = Math.round(performance.now() - startedAt)
    const location = response.headers.get('location')
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel().catch(() => {})
      hops.push(current.toString())
      const next = new URL(location, current)
      if (next.protocol !== 'http:' && next.protocol !== 'https:') throw Object.assign(new Error('bad redirect'), { code: 'BAD_REDIRECT' })
      current = next
      continue
    }
    return { response, url: current, hops, ttfbMs }
  }
  throw Object.assign(new Error('too many redirects'), { code: 'TOO_MANY_REDIRECTS' })
}

async function readCapped(response: Response, max: number) {
  if (!response.body) return { text: '', bytes: 0, truncated: false }
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let bytes = 0
  let truncated = false
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    bytes += value.byteLength
    if (bytes > max) {
      truncated = true
      await reader.cancel().catch(() => {})
      break
    }
    chunks.push(value)
  }
  return { text: Buffer.concat(chunks).toString('utf8'), bytes, truncated }
}

type PageResult =
  | { ok: true; url: URL; hops: string[]; status: number; contentType: string; html: string | null; bytes: number; truncated: boolean; ttfbMs: number; viaHttpFallback: boolean; tlsProblem: string | null }
  | { ok: false; failure: FetchFailure; tlsProblem: string | null }

async function fetchPageOnce(url: URL, timeoutMs: number, cache: Map<string, HostState>) {
  const signal = AbortSignal.timeout(timeoutMs)
  const hop = await fetchFollowing(url, signal, cache)
  const contentType = hop.response.headers.get('content-type') ?? ''
  const isHtml = /html|xml/i.test(contentType) || !contentType
  if (!isHtml) await hop.response.body?.cancel().catch(() => {})
  const body = isHtml ? await readCapped(hop.response, MAX_HTML_BYTES) : { text: '', bytes: 0, truncated: false }
  return {
    url: hop.url,
    hops: hop.hops,
    status: hop.response.status,
    contentType,
    html: isHtml ? body.text : null,
    bytes: body.bytes,
    truncated: body.truncated,
    ttfbMs: hop.ttfbMs,
  }
}

async function fetchPage(url: URL, cache: Map<string, HostState>): Promise<PageResult> {
  try {
    const page = await fetchPageOnce(url, PAGE_TIMEOUT_MS, cache)
    return { ok: true, ...page, viaHttpFallback: false, tlsProblem: null }
  } catch (err) {
    if (err instanceof BlockedHostError) throw err
    const failure = classifyFetchError(err)
    // Many small-business sites only work over plain http — retry once so we
    // can still report on the page (and flag the missing/broken HTTPS).
    if (url.protocol === 'https:' && (failure.reason === 'tls' || failure.reason === 'refused')) {
      const httpUrl = new URL(url)
      httpUrl.protocol = 'http:'
      try {
        const page = await fetchPageOnce(httpUrl, FALLBACK_TIMEOUT_MS, cache)
        return { ok: true, ...page, viaHttpFallback: true, tlsProblem: failure.code }
      } catch (fallbackErr) {
        if (fallbackErr instanceof BlockedHostError) throw fallbackErr
      }
    }
    return { ok: false, failure, tlsProblem: failure.reason === 'tls' ? failure.code : null }
  }
}

type ProbeResult = { kind: 'redirects-to-https'; to: string } | { kind: 'stays-http'; status: number } | { kind: 'error'; failure: FetchFailure }

/** Does http://host/ send visitors to https? */
async function probeHttp(url: URL, cache: Map<string, HostState>): Promise<ProbeResult> {
  const httpUrl = new URL(url)
  httpUrl.protocol = 'http:'
  try {
    const hop = await fetchFollowing(httpUrl, AbortSignal.timeout(HTTP_PROBE_TIMEOUT_MS), cache, 3)
    await hop.response.body?.cancel().catch(() => {})
    if (hop.url.protocol === 'https:') return { kind: 'redirects-to-https', to: hop.url.toString() }
    return { kind: 'stays-http', status: hop.response.status }
  } catch (err) {
    if (err instanceof BlockedHostError) throw err
    // A redirect that lands on https but then fails (e.g. a bad certificate)
    // still counts as "redirects to https" only if we saw the hop — we didn't, so report unavailable.
    return { kind: 'error', failure: classifyFetchError(err) }
  }
}

type PsiResult = { ok: true; metrics: PageSpeedMetrics } | { ok: false; note: string }

type PsiJson = {
  lighthouseResult?: {
    categories?: { performance?: { score?: number | null } }
    audits?: Record<string, { numericValue?: number; displayValue?: string }>
    runtimeError?: { code?: string; message?: string }
  }
  error?: { code?: number; message?: string }
}

/** Google PageSpeed Insights (mobile). Optional: slow and often rate-limited without a key. */
async function runPageSpeed(url: URL): Promise<PsiResult> {
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  endpoint.searchParams.set('url', url.toString())
  endpoint.searchParams.set('strategy', 'mobile')
  endpoint.searchParams.set('category', 'performance')
  // Optional — raises the free quota. Read at request time; never hardcoded.
  const key = process.env.PAGESPEED_API_KEY
  if (key) endpoint.searchParams.set('key', key)

  try {
    const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(PSI_TIMEOUT_MS), headers: { Accept: 'application/json' } })
    if (response.status === 429) return { ok: false, note: 'Google PageSpeed is limiting free checks right now, so mobile speed was not scored. Try again in a few minutes.' }
    const data = (await response.json().catch(() => null)) as PsiJson | null
    if (!response.ok || !data) {
      return { ok: false, note: `Google PageSpeed could not test this page (HTTP ${response.status}), so mobile speed was not scored.` }
    }
    const lh = data.lighthouseResult
    const score = lh?.categories?.performance?.score
    if (!lh || lh.runtimeError?.code || typeof score !== 'number') {
      return { ok: false, note: 'Google PageSpeed could not finish testing this page, so mobile speed was not scored.' }
    }
    const lcp = lh.audits?.['largest-contentful-paint']
    const weight = lh.audits?.['total-byte-weight']
    return {
      ok: true,
      metrics: {
        performance: Math.round(score * 100),
        lcpMs: typeof lcp?.numericValue === 'number' ? Math.round(lcp.numericValue) : null,
        lcpDisplay: lcp?.displayValue?.replace(/ /g, ' ') ?? null,
        totalBytes: typeof weight?.numericValue === 'number' ? Math.round(weight.numericValue) : null,
      },
    }
  } catch (err) {
    const { reason } = classifyFetchError(err)
    return {
      ok: false,
      note:
        reason === 'timeout'
          ? 'Google PageSpeed took longer than 15 seconds, so mobile speed was not scored.'
          : 'Google PageSpeed was unavailable, so mobile speed was not scored.',
    }
  }
}

// --- HTML analysis -------------------------------------------------------------

function codePoint(n: number) {
  return Number.isInteger(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ' '
}

function decodeEntities(text: string) {
  return text
    .replace(/&#(\d{1,7});/g, (_, n: string) => codePoint(Number(n)))
    .replace(/&#x([0-9a-f]{1,6});/gi, (_, n: string) => codePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

// Inline tags join their text directly ("Y<span>o</span>u" → "You"); every other tag is a word break.
const INLINE_TAG = /<\/?(?:a|abbr|b|bdi|bdo|cite|code|data|dfn|em|font|i|kbd|mark|q|s|samp|small|span|strong|sub|sup|time|u|var|wbr)\b[^>]*>/gi

function clean(text: string) {
  return decodeEntities(text.replace(INLINE_TAG, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

/** Animated headings often repeat their text (screen-reader copy + per-letter copy): "A. A." → "A." */
function dedupeRepeat(text: string) {
  if (text.length > 400) return text
  const m = /^(.{4,}?)\s*\1$/.exec(text)
  return m ? m[1].trim() : text
}

function attrs(tag: string) {
  const out: Record<string, string> = {}
  for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    out[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '')
  }
  return out
}

const LOCAL_TYPES = new Set([
  'LocalBusiness', 'ProfessionalService', 'HomeAndConstructionBusiness', 'Electrician', 'GeneralContractor', 'HVACBusiness',
  'HousePainter', 'Locksmith', 'MovingCompany', 'Plumber', 'RoofingContractor', 'AutomotiveBusiness', 'AutoRepair', 'AutoBodyShop',
  'AutoDealer', 'AutoWash', 'ChildCare', 'DryCleaningOrLaundry', 'EmergencyService', 'EmploymentAgency', 'EntertainmentBusiness',
  'FinancialService', 'AccountingService', 'InsuranceAgency', 'FoodEstablishment', 'Restaurant', 'Bakery', 'BarOrPub',
  'CafeOrCoffeeShop', 'FastFoodRestaurant', 'HealthAndBeautyBusiness', 'BeautySalon', 'HairSalon', 'DaySpa', 'NailSalon',
  'HealthClub', 'LegalService', 'Attorney', 'LodgingBusiness', 'MedicalBusiness', 'Dentist', 'Physician', 'MedicalClinic',
  'Optician', 'Pharmacy', 'RealEstateAgent', 'SelfStorage', 'SportsActivityLocation', 'Store', 'TravelAgency', 'AnimalShelter',
  'VeterinaryCare', 'Notary', 'TattooParlor', 'ExerciseGym',
])

function isLocalType(type: string) {
  return LOCAL_TYPES.has(type) || /(Business|Contractor|Store|Restaurant|Shop|Salon|Clinic)$/.test(type)
}

function collectTypes(node: unknown, out: Set<string>, depth = 0) {
  if (depth > 8 || node === null || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, out, depth + 1)
    return
  }
  const record = node as Record<string, unknown>
  const t = record['@type']
  for (const value of Array.isArray(t) ? t : [t]) {
    if (typeof value === 'string') out.add(value.split(/[/:]/).pop() ?? value)
  }
  for (const value of Object.values(record)) if (value && typeof value === 'object') collectTypes(value, out, depth + 1)
}

/** "Plainsboro, NJ" → "plainsboro"; "West Windsor Township" → "west windsor". */
function townKey(town: string) {
  return town
    .split(',')[0]
    .replace(/\b(township|twp\.?|borough|boro|city|village)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

const FORM_EMBEDS: Array<[RegExp, string]> = [
  [/calendly\.com/i, 'Calendly'],
  [/jotform/i, 'Jotform'],
  [/typeform\.com/i, 'Typeform'],
  [/docs\.google\.com\/forms|forms\.gle/i, 'Google Forms'],
  [/hsforms|hs-scripts|js\.hsforms\.net/i, 'HubSpot form'],
  [/wufoo\.com/i, 'Wufoo'],
  [/formstack/i, 'Formstack'],
  [/cognitoforms/i, 'Cognito Forms'],
  [/housecallpro/i, 'Housecall Pro'],
  [/getjobber|jobber\.com/i, 'Jobber'],
  [/servicetitan/i, 'ServiceTitan'],
  [/podium\.com/i, 'Podium'],
  [/wpforms|wpcf7|contact-form-7|gform_wrapper|gravityforms/i, 'WordPress form'],
  [/formspree|getform\.io|formsubmit\.co|elfsight/i, 'form service'],
]

function analyzeHtml(html: string, town: string) {
  const ldJsonBlocks = [...html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  const head = /<head\b[\s\S]*?<\/head>/i.exec(markup)?.[0] ?? markup

  const titleMatch = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(head)
  const title = titleMatch ? clean(titleMatch[1]) : null

  const metas = [...markup.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]))
  const metaContent = (name: string) => metas.find((m) => m.name?.toLowerCase() === name)?.content?.trim() ?? null
  const description = metaContent('description')
  const viewport = metaContent('viewport')

  const h1s = [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => dedupeRepeat(clean(m[1])))

  const body = /<body\b[\s\S]*$/i.exec(markup)?.[0] ?? markup
  const text = clean(body)

  const telLinks = [...markup.matchAll(/href\s*=\s*["']?\s*tel:([^"'\s>]+)/gi)].map((m) => {
    try {
      return decodeURIComponent(m[1]).trim()
    } catch {
      return m[1]
    }
  })
  const phoneInText = /\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/.test(text)

  const forms = [...markup.matchAll(/<form\b[\s\S]*?<\/form>/gi)].map((m) => m[0])
  const contactForm = forms.some((f) => /<textarea\b|type\s*=\s*["']?(email|tel)\b|name\s*=\s*["'][^"']*(email|phone|message)/i.test(f))
  const embed = FORM_EMBEDS.find(([re]) => re.test(html))?.[1] ?? null
  // \b keeps "facebook.com" from counting as a "book" link.
  const contactLink = /href\s*=\s*["'][^"']*\b(contact|quote|estimate|book|schedule)[^"']*["']/i.test(markup)

  const types = new Set<string>()
  let invalidJsonLd = 0
  for (const block of ldJsonBlocks) {
    try {
      collectTypes(JSON.parse(block.trim()), types)
    } catch {
      invalidJsonLd++
    }
  }
  for (const m of html.matchAll(/itemtype\s*=\s*["']https?:\/\/schema\.org\/([A-Za-z]+)/gi)) types.add(m[1])
  const localTypes = [...types].filter(isLocalType)

  const key = townKey(town)
  const haystack = `${title ?? ''} ${description ?? ''} ${text}`.toLowerCase()
  const townFound = key.length > 1 && haystack.includes(key)

  // Only call it a JavaScript-built page when there's an app root AND almost no server-rendered text.
  const jsShell = text.length < 200 && /<div\b[^>]*\bid\s*=\s*["']?(root|app|__next|__nuxt|___gatsby|svelte)\b/i.test(markup)

  return { title, description, viewport, h1s, text, jsShell, telLinks, phoneInText, contactForm, embed, contactLink, types: [...types], localTypes, invalidJsonLd, townFound, townKey: key }
}

// --- Report assembly -----------------------------------------------------------

function check(id: Exclude<CheckId, 'website'>, status: CheckStatus, detail: string, fix?: string, earnedOverride?: number): CheckResult {
  const weight = CHECK_WEIGHTS[id]
  const earned = status === 'unavailable' ? 0 : earnedOverride ?? weight * STATUS_CREDIT[status]
  return { id, label: CHECK_LABELS[id], status, weight, earned: Math.round(earned * 10) / 10, detail, ...(status === 'pass' || !fix ? {} : { fix }) }
}

function kb(bytes: number) {
  return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`
}

const NOT_READ = 'Skipped: we could not read your homepage.'

const SOCIAL_HOSTS = /(^|\.)(facebook\.com|fb\.com|instagram\.com|yelp\.com|nextdoor\.com|linktr\.ee|angi\.com|angieslist\.com|homeadvisor\.com|thumbtack\.com|yellowpages\.com|bbb\.org|houzz\.com|tiktok\.com|x\.com|twitter\.com|linkedin\.com|g\.page|business\.site|maps\.app\.goo\.gl|google\.com)$/i

function noWebsiteReport(name: string, town: string, url: URL | null, now: string): WebsiteCheckReport {
  const listing = url ? url.hostname.replace(/^www\./, '') : null
  const headline = listing ? `${listing} is a listing, not a website you own` : `No website found for ${name}`
  const detail = listing
    ? `You entered a ${listing} page. That helps, but it is not a website you own and control.`
    : `No website address was entered for ${name}.`
  return {
    business: { name, town },
    hasWebsite: false,
    url: url ? { input: url.toString(), final: null } : null,
    score: 0,
    grade: 'No website found',
    summary: `${headline}. Customers in ${town} who search for what you do can't find, check out, or contact you on a site of your own, so many of them call whoever they do find.`,
    checksRun: 1,
    checksTotal: 1,
    checks: [
      {
        id: 'website',
        label: 'Business website',
        status: 'fail',
        weight: 100,
        earned: 0,
        detail,
        fix: 'Get a simple, fast website with your services, your town, a tap-to-call button and a quote form.',
      },
    ],
    fixes: [
      'Get a simple, fast website with your services, your town, a tap-to-call button and a quote form.',
      'Claim or update your free Google Business Profile and link it to the new site.',
    ],
    metrics: { responseTimeMs: null, htmlBytes: null, redirects: [], pageSpeed: null, pageSpeedNote: null },
    noWebsite: {
      headline,
      costs: [
        `When someone in ${town} searches for what you do, Google has no site of yours to show, so those clicks go to competitors who have one.`,
        'People who hear about you by word of mouth usually look you up before they call. With no site there is nothing to confirm you are real, see your services or tap to call.',
        'Your Google Business Profile has no website to link to, so searchers get less information about you than about competitors who have one.',
        'Facebook, Yelp and directory pages help, but you do not control them, and they show your competitors right next to you.',
      ],
      nextSteps: [
        'Claim or check your free Google Business Profile: correct phone, hours, service area and photos.',
        `Get a simple, fast website: a page for each main service, ${town} and nearby towns named on the page, a tap-to-call button and a short quote form.`,
        'Add a clear page title and LocalBusiness structured data so Google knows who you are and where you work.',
        'Want a head start? Leave your details below and we will send a free homepage mockup for your business.',
      ],
    },
    checkedAt: now,
  }
}

export async function runWebsiteCheck({ name, town, url }: { name: string; town: string; url: URL | null }): Promise<WebsiteCheckReport> {
  const now = new Date().toISOString()
  if (!url) return noWebsiteReport(name, town, null, now)
  if (SOCIAL_HOSTS.test(url.hostname)) return noWebsiteReport(name, town, url, now)

  const cache = new Map<string, HostState>()
  const initial = await hostState(url.hostname, cache)
  if (initial === 'private') throw new BlockedHostError(`${url.hostname} is not a public website address.`)

  // Domain doesn't resolve: nothing else can run.
  const [page, probe, psi] =
    initial === 'notfound'
      ? ([{ ok: false, failure: { reason: 'dns', code: 'ENOTFOUND' }, tlsProblem: null }, null, null] as const)
      : await Promise.all([fetchPage(url, cache), probeHttp(url, cache), runPageSpeed(url)])

  const checks: CheckResult[] = []
  const host = url.hostname

  // 1. Reachable
  let html: string | null = null
  if (!page.ok) {
    const { reason, code } = page.failure
    const detail =
      reason === 'dns'
        ? `We couldn't find ${host}. The domain doesn't point to a website (DNS lookup failed).`
        : reason === 'timeout'
          ? `${host} didn't respond within 6 seconds.`
          : reason === 'tls'
            ? `${host} has a security-certificate problem (${code}), so browsers show visitors a warning page instead of your site.`
            : reason === 'refused'
              ? `${host} refused the connection (${code}).`
              : `We couldn't load ${host} (${code}).`
    const fix =
      reason === 'dns'
        ? 'Check that your domain is renewed and pointed at your website host.'
        : reason === 'tls'
          ? 'Renew or reinstall your SSL certificate (most hosts do this free with Let’s Encrypt).'
          : 'Ask your host why the site is not loading. A homepage that does not open loses every visitor who tries it.'
    checks.push(check('reachable', 'fail', detail, fix))
  } else if (page.status === 401 || page.status === 403 || page.status === 429) {
    checks.push(check('reachable', 'unavailable', `${host} answered HTTP ${page.status} to our checker. It may block automated visitors, so we couldn't read the page.`))
  } else if (page.status >= 400) {
    checks.push(
      check('reachable', 'fail', `Your homepage returned HTTP ${page.status}, so visitors see an error page.`, 'Fix the error on your homepage (ask your host or developer). Every visitor right now sees an error.'),
    )
  } else if (page.html === null) {
    checks.push(check('reachable', 'warn', `${host} loaded, but returned "${page.contentType}" instead of a web page.`, 'Make sure your homepage address serves a normal web page.'))
  } else {
    html = page.html
    checks.push(check('reachable', 'pass', `Your homepage loaded (HTTP ${page.status}${page.hops.length ? ` after ${page.hops.length} redirect${page.hops.length > 1 ? 's' : ''}` : ''}).`))
  }

  // 2. HTTPS
  if (page.ok) {
    if (page.url.protocol === 'https:') {
      checks.push(check('https', 'pass', 'Your site loads over HTTPS (the padlock).'))
    } else {
      const why = page.tlsProblem ? ` HTTPS failed with a certificate/connection problem (${page.tlsProblem}).` : ''
      checks.push(
        check('https', 'fail', `Your site loads over plain HTTP, so Chrome labels it "Not secure".${why}`, 'Turn on HTTPS with a free SSL certificate. Visitors and Google both distrust "Not secure" sites.'),
      )
    }
  } else if (page.tlsProblem) {
    checks.push(check('https', 'fail', `HTTPS is broken (${page.tlsProblem}), so browsers block or warn visitors.`, 'Renew or reinstall your SSL certificate.'))
  } else {
    checks.push(check('https', 'unavailable', 'Skipped: we could not connect to your site.'))
  }

  // 3. http → https redirect
  if (!probe) {
    checks.push(check('httpsRedirect', 'unavailable', 'Skipped: we could not connect to your site.'))
  } else if (probe.kind === 'redirects-to-https') {
    checks.push(check('httpsRedirect', 'pass', 'Visitors who type http:// are sent to the secure https:// version.'))
  } else if (probe.kind === 'stays-http') {
    checks.push(
      check(
        'httpsRedirect',
        'fail',
        `http://${host} stays on the insecure version (HTTP ${probe.status}) instead of redirecting to https://.`,
        'Set up a permanent (301) redirect from http:// to https:// so nobody lands on the "Not secure" copy.',
      ),
    )
  } else {
    checks.push(check('httpsRedirect', 'unavailable', `We couldn't connect to http://${host} to test this (${probe.failure.code}).`))
  }

  // 4–11. On-page checks
  let a: ReturnType<typeof analyzeHtml> | null = null
  if (html !== null) {
    try {
      a = analyzeHtml(html, town)
    } catch (err) {
      console.error('website check: html analysis failed', err)
    }
  }
  if (a === null) {
    const why = html === null ? NOT_READ : 'Skipped: we could not analyze your homepage.'
    for (const id of ['title', 'metaDescription', 'viewport', 'h1', 'clickToCall', 'contactForm', 'localSchema', 'townMention', 'pageWeight'] as const) {
      checks.push(check(id, 'unavailable', why))
    }
  } else {

    if (!a.title) {
      checks.push(check('title', 'fail', 'Your homepage has no page title.', `Add a title like "${name} | Your Service in ${town}". It is the blue headline Google shows.`))
    } else if (a.title.length < 15 || a.title.length > 65) {
      checks.push(
        check(
          'title',
          'warn',
          `Title (${a.title.length} characters): "${a.title.slice(0, 90)}${a.title.length > 90 ? '…' : ''}".`,
          a.title.length < 15
            ? `Make the title more descriptive, e.g. "${name} | Your Service in ${town}".`
            : 'Shorten the title to about 60 characters so Google does not cut it off. Lead with your service and town.',
        ),
      )
    } else {
      checks.push(check('title', 'pass', `Title (${a.title.length} characters): "${a.title}".`))
    }

    if (!a.description) {
      checks.push(check('metaDescription', 'fail', 'No meta description.', 'Add a 1–2 sentence description (about 150 characters) of what you do and where. Google often shows it under your title.'))
    } else if (a.description.length < 70 || a.description.length > 160) {
      checks.push(
        check(
          'metaDescription',
          'warn',
          `Meta description is ${a.description.length} characters.`,
          a.description.length < 70
            ? 'Expand the description to about 150 characters: your main services, your town, and a reason to call.'
            : 'Trim the description to under 160 characters so Google does not cut it off.',
        ),
      )
    } else {
      checks.push(check('metaDescription', 'pass', `Meta description is ${a.description.length} characters.`))
    }

    if (!a.viewport) {
      checks.push(check('viewport', 'fail', 'No mobile viewport tag, so phones show a shrunken desktop page.', 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> and make sure the layout adapts to phones.'))
    } else if (!/width\s*=\s*device-width/i.test(a.viewport)) {
      checks.push(check('viewport', 'warn', `Viewport tag is set to "${a.viewport}", not device width.`, 'Set the viewport to width=device-width so the page fits phone screens.'))
    } else {
      checks.push(check('viewport', 'pass', 'The page is set up to fit phone screens.'))
    }

    if (!a.h1s.length) {
      checks.push(
        check(
          'h1',
          'fail',
          a.jsShell
            ? 'No main heading in the HTML. The page looks like it is built by JavaScript in the browser, so Google sees very little text at first.'
            : 'No main heading (H1) on the page.',
          'Add one clear H1 that says what you do and where, e.g. "Emergency Plumbing in Plainsboro, NJ".',
        ),
      )
    } else if (a.h1s.length > 1) {
      checks.push(check('h1', 'warn', `${a.h1s.length} H1 headings found.`, 'Use one H1 for the main message and H2s for sections, so Google knows what the page is about.'))
    } else {
      checks.push(check('h1', 'pass', `Main heading: "${a.h1s[0].slice(0, 90)}".`))
    }

    if (a.telLinks.length) {
      checks.push(check('clickToCall', 'pass', `Tap-to-call link found (${a.telLinks[0]}).`))
    } else if (a.phoneInText) {
      checks.push(check('clickToCall', 'warn', 'Your phone number is on the page, but phones can’t tap it to call.', 'Wrap your phone number in a tel: link (and add a "Call now" button) so mobile visitors can call in one tap.'))
    } else {
      checks.push(check('clickToCall', 'fail', 'No phone number or tap-to-call link on the homepage.', 'Put your phone number at the top of the page as a tap-to-call button.'))
    }

    if (a.contactForm) {
      checks.push(check('contactForm', 'pass', 'Contact form found on the homepage.'))
    } else if (a.embed) {
      checks.push(check('contactForm', 'pass', `Form or booking widget found (${a.embed}).`))
    } else if (a.contactLink) {
      checks.push(
        check(
          'contactForm',
          'warn',
          'No form on the homepage. There is a link to a contact/quote page, which we did not check.',
          'Add a short quote form (name, phone, what you need) to the homepage. People who won’t call will still fill one in.',
        ),
      )
    } else {
      checks.push(check('contactForm', 'fail', 'No contact or quote form found.', 'Add a short quote form (name, phone, what you need) so people who won’t call can still reach you.'))
    }

    if (a.localTypes.length) {
      checks.push(check('localSchema', 'pass', `LocalBusiness structured data found (${a.localTypes.slice(0, 3).join(', ')}).`))
    } else if (a.types.length) {
      checks.push(
        check(
          'localSchema',
          'warn',
          `Structured data found (${a.types.slice(0, 3).join(', ')}), but not the LocalBusiness kind.`,
          'Add LocalBusiness structured data with your name, address/service area, phone and hours, so Google can connect your site to your business.',
        ),
      )
    } else {
      checks.push(
        check(
          'localSchema',
          'fail',
          a.invalidJsonLd ? 'Structured data is present but broken (invalid JSON).' : 'No structured data (schema.org) found.',
          'Add LocalBusiness structured data with your name, address/service area, phone and hours, so Google can connect your site to your business.',
        ),
      )
    }

    if (a.townFound) {
      checks.push(check('townMention', 'pass', `"${town}" appears on your homepage.`))
    } else {
      checks.push(check('townMention', 'fail', `"${town}" doesn't appear on your homepage.`, `Name ${town} (and nearby towns you serve) in your title, heading and page text. Google matches local searches to the towns your site mentions.`))
    }

    if (page.ok && page.truncated) {
      checks.push(check('pageWeight', 'fail', `The HTML alone is over ${kb(MAX_HTML_BYTES)}.`, 'Your page code is very heavy. A rebuild or cleanup of page builders and plugins will speed it up.'))
    } else if (page.ok) {
      const status: CheckStatus = page.bytes <= 300_000 ? 'pass' : page.bytes <= 1_000_000 ? 'warn' : 'fail'
      checks.push(check('pageWeight', status, `HTML document is ${kb(page.bytes)} (images and scripts not included).`, 'Slim down the page: page builders and plugins often bloat the HTML. Lighter pages load faster on phones.'))
    }
  }

  // 12. Server response time
  if (page.ok) {
    const ms = page.ttfbMs
    const status: CheckStatus = ms < 800 ? 'pass' : ms < 1800 ? 'warn' : 'fail'
    checks.push(check('responseTime', status, `Your server answered in ${ms} ms.`, 'Your server is slow to answer. Better hosting or caching usually fixes this.'))
  } else {
    checks.push(check('responseTime', 'unavailable', 'Skipped: we could not connect to your site.'))
  }

  // 13. Mobile speed (PageSpeed)
  if (psi?.ok) {
    const { performance: perf, lcpDisplay, totalBytes } = psi.metrics
    const status: CheckStatus = perf >= 90 ? 'pass' : perf >= 50 ? 'warn' : 'fail'
    const parts = [`Google PageSpeed mobile score: ${perf}/100.`]
    if (lcpDisplay) parts.push(`Main content appears after ${lcpDisplay} (Google wants under 2.5 s).`)
    if (totalBytes) parts.push(`Total download: ${kb(totalBytes)}.`)
    checks.push(
      check(
        'mobileSpeed',
        status,
        parts.join(' '),
        'Compress and resize images, remove heavy sliders/plugins and use fast hosting. Slow phone pages lose visitors before they see your number.',
        (CHECK_WEIGHTS.mobileSpeed * perf) / 100,
      ),
    )
  } else {
    checks.push(check('mobileSpeed', 'unavailable', psi?.note ?? 'Skipped: we could not connect to your site.'))
  }

  const score = scoreChecks(checks)
  const ran = checks.filter((c) => c.status !== 'unavailable')
  const problems = ran.filter((c) => c.status !== 'pass').length
  const skipped = checks.length - ran.length
  const fixes = ran
    .filter((c) => c.fix)
    .sort((a, b) => b.weight - b.earned - (a.weight - a.earned))
    .map((c) => c.fix as string)

  const summary = [
    html === null
      ? page.ok
        ? `We reached ${host} but couldn't read the homepage (HTTP ${page.status}), so most checks couldn't run.`
        : `We couldn't load ${host}, so most checks couldn't run.`
      : `Your website scored ${score}/100 (${gradeFor(score).toLowerCase()})${
          problems ? ` with ${problems} thing${problems === 1 ? '' : 's'} to fix.` : ' and passed every check we could run.'
        }`,
    skipped ? `${skipped} of ${checks.length} checks couldn't run and don't count toward the score.` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    business: { name, town },
    hasWebsite: true,
    url: { input: url.toString(), final: page.ok ? page.url.toString() : null },
    score,
    grade: gradeFor(score),
    summary,
    checksRun: ran.length,
    checksTotal: TOTAL_CHECKS,
    checks,
    fixes,
    metrics: {
      responseTimeMs: page.ok ? page.ttfbMs : null,
      htmlBytes: page.ok && page.html !== null ? page.bytes : null,
      redirects: page.ok ? page.hops : [],
      pageSpeed: psi?.ok ? psi.metrics : null,
      pageSpeedNote: psi && !psi.ok ? psi.note : null,
    },
    noWebsite: null,
    checkedAt: now,
  }
}
