// POST /api/website-check — the free "Website & Google Check" on /free-website-check.
// Public and unauthenticated. Takes { name, town, url? } and returns a scored
// WebsiteCheckReport (lib/websiteCheck.ts). Fetches the homepage (6s), probes
// http→https (5s) and asks Google PageSpeed for a mobile score (15s, optional)
// in parallel. Checks that can't run come back "unavailable" — never a pass.
import { json, jsonError, methodNotAllowed, readBody } from '@/lib/api'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { hasErrors, normalizeWebsiteUrl, validateCheckInput } from '@/lib/websiteCheck'
import { BlockedHostError, runWebsiteCheck } from '@/lib/websiteCheckRun'

// PageSpeed alone can take 15s; leave headroom for the parallel page fetch.
export const maxDuration = 30

const RATE_LIMIT = 8
const RATE_WINDOW_MS = 10 * 60 * 1000

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  const body = await readBody(request)
  if (body === null) {
    return jsonError(400, 'invalid_json', 'The request body is not valid JSON.', 'Send a JSON object: { "name": "...", "town": "...", "url": "optional" }.')
  }

  const input = { name: str(body.name), town: str(body.town), url: str(body.url) }
  const errors = validateCheckInput(input)
  if (hasErrors(errors)) {
    const [field, message] = Object.entries(errors)[0]
    return jsonError(400, 'invalid_field', `"${field}": ${message}`)
  }

  const retryAfter = rateLimit('website-check', clientIp(request), RATE_LIMIT, RATE_WINDOW_MS)
  if (retryAfter !== null) {
    return jsonError(429, 'rate_limited', 'Too many checks from this connection. Try again in a few minutes.', undefined, { 'Retry-After': String(retryAfter) })
  }

  try {
    const report = await runWebsiteCheck({
      name: input.name,
      town: input.town,
      url: input.url ? normalizeWebsiteUrl(input.url) : null,
    })
    return json(report, 200, { 'Cache-Control': 'no-store' })
  } catch (err) {
    if (err instanceof BlockedHostError) {
      return jsonError(400, 'invalid_field', '"url": Enter a public website address like yourbusiness.com.')
    }
    console.error('website check failed', err)
    return jsonError(500, 'check_failed', 'The check hit an unexpected error. Please try again.')
  }
}

const notAllowed = methodNotAllowed('/api/website-check', 'POST', 'Send a POST request with a JSON body: { "name": "...", "town": "...", "url": "optional" }.')
export { notAllowed as GET, notAllowed as HEAD, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as OPTIONS }
