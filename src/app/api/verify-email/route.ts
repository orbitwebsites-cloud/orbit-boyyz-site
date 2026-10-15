// POST /api/verify-email — { email } -> { ok, reason?, suggestion? }.
// Called by the /qualify and /book forms before they send anything, so a
// typo or a junk address is caught while the person is still on the page.
// Checks live in lib/verifyEmail.ts (free: syntax, typos, provider rules,
// disposable domains, MX; plus a paid mailbox check only when TREG_TOKEN and
// TREG_ORG are set). The forms fail open on any non-200 answer, including 429.
import { json, jsonError, methodNotAllowed, readBody } from '@/lib/api'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { verifyEmail } from '@/lib/verifyEmail'

// node:dns needs the Node.js runtime.
export const runtime = 'nodejs'
export const maxDuration = 15

const RATE_LIMIT = 20
const RATE_WINDOW_MS = 60 * 1000

export async function POST(request: Request) {
  const retryAfter = rateLimit('verify-email', clientIp(request), RATE_LIMIT, RATE_WINDOW_MS)
  if (retryAfter !== null) {
    return jsonError(429, 'rate_limited', 'Too many checks from this connection. Try again in a minute.', undefined, {
      'Retry-After': String(retryAfter),
    })
  }

  const body = await readBody(request)
  if (body === null) {
    return jsonError(400, 'invalid_json', 'The request body is not valid JSON.', 'Send a JSON object: { "email": "you@example.com" }.')
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email) return json({ ok: false, reason: 'missing email' }, 200, { 'Cache-Control': 'no-store' })
  if (email.length > 320) return json({ ok: false, reason: 'invalid syntax' }, 200, { 'Cache-Control': 'no-store' })

  try {
    const verdict = await verifyEmail(email)
    return json(verdict, 200, { 'Cache-Control': 'no-store' })
  } catch (err) {
    console.error('verify-email failed', err)
    return jsonError(500, 'check_failed', 'The check hit an unexpected error.')
  }
}

const notAllowed = methodNotAllowed('/api/verify-email', 'POST', 'Send a POST request with a JSON body: { "email": "you@example.com" }.')
export { notAllowed as GET, notAllowed as HEAD, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as OPTIONS }
