// x402 bot paywall — humans browse free; AI crawlers / scrapers get HTTP 402
// with x402 payment requirements, and get the page once they pay.
//
// Wired into src/proxy.ts. Everything here FAILS OPEN: any exception or
// facilitator outage serves the page normally.
//
// Env (all optional):
//   X402_ENABLED=false            kill switch
//   X402_PAY_TO                   receiving wallet (default below)
//   X402_PRICE                    per-request price (default "$0.001")
//   X402_NETWORK                  CAIP-2 network (default Base mainnet "eip155:8453")
//   CDP_API_KEY_ID + CDP_API_KEY_SECRET  -> Coinbase CDP facilitator (authenticated)
//   X402_FACILITATOR_URL          otherwise this facilitator (default https://x402.org/facilitator)
import { NextResponse, type NextRequest } from 'next/server'
import { paymentProxyFromHTTPServer, x402HTTPResourceServer, x402ResourceServer, type Network } from '@x402/next'
import { HTTPFacilitatorClient, decodePaymentRequiredHeader, type FacilitatorConfig } from '@x402/core/http'
import { ExactEvmScheme } from '@x402/evm/exact/server'
import { createFacilitatorConfig } from '@coinbase/x402'

const DEFAULT_PAY_TO = '0x0ba3b8796ce61ef8Cbd11A7F33Be31F1Fd4A03B3'
const DEFAULT_PRICE = '$0.001'
const DEFAULT_NETWORK = 'eip155:8453'
const DEFAULT_FACILITATOR_URL = 'https://x402.org/facilitator'
// Library default is 90s; keep bots from hanging on a slow facilitator.
const FACILITATOR_TIMEOUT_MS = 10_000

/** User-Agent substrings (case-insensitive) that are charged. */
export const BOT_UA_PATTERNS = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'CCBot', 'PerplexityBot', 'Perplexity-User', 'Bytespider', 'Amazonbot',
  'Applebot-Extended', 'Google-Extended', 'Meta-ExternalAgent', 'meta-externalfetcher',
  'FacebookBot', 'Diffbot', 'cohere-ai', 'cohere-training-data-crawler', 'YouBot',
  'AI2Bot', 'Ai2Bot-Dolma', 'Timpibot', 'ImagesiftBot', 'omgili', 'PetalBot',
  'Scrapy', 'python-requests', 'aiohttp', 'Go-http-client', 'curl', 'wget',
  'HeadlessChrome', 'PhantomJS',
].map((p) => p.toLowerCase())

/** User-Agent substrings that are never charged — checked first. */
export const ALLOWED_BOT_UA_PATTERNS = [
  'Googlebot', 'Bingbot', 'DuckDuckBot', 'Slurp', 'Applebot', 'Twitterbot',
  'facebookexternalhit', 'LinkedInBot', 'Slackbot', 'Discordbot', 'WhatsApp',
  'TelegramBot', 'Vercel',
  // uptime monitors
  'UptimeRobot', 'Pingdom', 'StatusCake', 'Better Uptime', 'BetterStack', 'Uptime-Kuma',
  'Site24x7', 'Datadog', 'Checkly', 'Freshping', 'HetrixTools', 'Cron-Job.org', 'NewRelicPinger',
].map((p) => p.toLowerCase())

/** True when the UA is an AI crawler / scraper that should pay. */
export function isChargeableBot(userAgent: string | null): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  // Plain "Applebot" is free, "Applebot-Extended" is charged.
  const uaForAllow = ua.replaceAll('applebot-extended', '')
  if (ALLOWED_BOT_UA_PATTERNS.some((p) => uaForAllow.includes(p))) return false
  return BOT_UA_PATTERNS.some((p) => ua.includes(p))
}

const FREE_PATH =
  /^\/(?:robots\.txt|llms\.txt|sitemap[^/]*\.xml|favicon[^/]*|\.well-known\/.*|api\/.*|_next\/.*|_vercel\/.*)$|\.(?:png|svg|jpe?g|gif|webp|avif|ico|css|js|mjs|map|woff2?|ttf|otf|eot)$/i

/** Paths that are always free, even for bots (also excluded by the proxy matcher). */
export function isFreePath(pathname: string): boolean {
  return FREE_PATH.test(pathname)
}

export function isPaywallEnabled(): boolean {
  return (process.env.X402_ENABLED ?? '').trim().toLowerCase() !== 'false'
}

function facilitatorConfig(): FacilitatorConfig {
  const { CDP_API_KEY_ID, CDP_API_KEY_SECRET } = process.env
  if (CDP_API_KEY_ID && CDP_API_KEY_SECRET) {
    // Official Coinbase helper: CDP facilitator (https://api.cdp.coinbase.com/platform/v2/x402) + JWT auth.
    return { ...createFacilitatorConfig(CDP_API_KEY_ID, CDP_API_KEY_SECRET), timeoutMs: FACILITATOR_TIMEOUT_MS }
  }
  return { url: process.env.X402_FACILITATOR_URL || DEFAULT_FACILITATOR_URL, timeoutMs: FACILITATOR_TIMEOUT_MS }
}

type PaymentProxyHandler = (req: NextRequest) => Promise<NextResponse>
// Retry a failed facilitator sync at most this often; bots pass free meanwhile.
const INIT_RETRY_MS = 60_000
let handler: PaymentProxyHandler | null = null
let initPromise: Promise<PaymentProxyHandler> | null = null
let lastInitFailure = 0

async function createHandler(): Promise<PaymentProxyHandler> {
  const network = (process.env.X402_NETWORK || DEFAULT_NETWORK) as Network
  const server = new x402ResourceServer(new HTTPFacilitatorClient(facilitatorConfig())).register(
    network,
    new ExactEvmScheme(),
  )
  const httpServer = new x402HTTPResourceServer(server, {
    // Bare route config = every path the proxy hands us.
    accepts: {
      scheme: 'exact',
      price: process.env.X402_PRICE || DEFAULT_PRICE,
      network,
      payTo: process.env.X402_PAY_TO || DEFAULT_PAY_TO,
    },
    description: 'Paid access for automated agents',
    mimeType: 'text/html',
  })
  // Sync with the facilitator ourselves: with syncFacilitatorOnStart=true the
  // library calls process.exit(1) on a facilitator/route mismatch, which would
  // take the whole site down. Here a failure just throws -> fail open.
  await httpServer.initialize()
  return paymentProxyFromHTTPServer(httpServer, undefined, undefined, false)
}

/** Resolves the payment proxy, or null while the facilitator is unavailable. */
async function getHandler(): Promise<PaymentProxyHandler | null> {
  if (handler) return handler
  if (Date.now() - lastInitFailure < INIT_RETRY_MS) return null
  initPromise ??= createHandler()
  try {
    handler = await initPromise
    return handler
  } catch (error) {
    initPromise = null
    lastInitFailure = Date.now()
    throw error
  }
}

export type PaywallOutcome =
  /** Not a bot / free path / disabled / failed open — continue normally. */
  | { kind: 'pass' }
  /** Payment settled — continue normally and attach these headers (PAYMENT-RESPONSE etc.). */
  | { kind: 'paid'; headers: Headers }
  /** Stop here and return this response (402 with requirements). */
  | { kind: 'block'; response: NextResponse }

const PASS: PaywallOutcome = { kind: 'pass' }

/**
 * Run the bot paywall for a request. Never throws.
 * Non-bot requests return immediately after the UA check.
 */
export async function runBotPaywall(request: NextRequest): Promise<PaywallOutcome> {
  try {
    if (!isChargeableBot(request.headers.get('user-agent'))) return PASS
    if (!isPaywallEnabled() || isFreePath(request.nextUrl.pathname)) return PASS

    const paymentProxy = await getHandler()
    if (!paymentProxy) return PASS
    const res = await paymentProxy(request)

    // Verified + settled: the library returns a NextResponse.next() carrying the settlement headers.
    if (res.status < 400 && res.headers.get('x-middleware-next')) {
      const headers = new Headers()
      res.headers.forEach((value, key) => {
        const k = key.toLowerCase()
        if (!k.startsWith('x-middleware-') && !['content-length', 'content-type', 'transfer-encoding'].includes(k)) {
          headers.set(key, value)
        }
      })
      return { kind: 'paid', headers }
    }

    // 402 (or 412 permit2) with standard requirements in the PAYMENT-REQUIRED header.
    // Return them as the JSON body too (the library's default body is {} or an HTML paywall).
    const required = res.headers.get('payment-required')
    if ((res.status === 402 || res.status === 412) && required) {
      const headers = new Headers(res.headers)
      headers.set('Content-Type', 'application/json')
      headers.set('Vary', 'User-Agent')
      headers.delete('content-length')
      return {
        kind: 'block',
        response: new NextResponse(JSON.stringify(decodePaymentRequiredHeader(required)), {
          status: res.status,
          headers,
        }),
      }
    }

    // Anything else (500/502 facilitator errors, 402 without requirements from a
    // settlement exception, 403, ...) is an internal failure -> fail open.
    console.warn(`[x402] failing open: paywall returned ${res.status}`)
    return PASS
  } catch (error) {
    console.warn('[x402] failing open:', error)
    return PASS
  }
}
