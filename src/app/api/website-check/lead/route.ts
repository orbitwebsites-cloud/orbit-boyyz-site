// POST /api/website-check/lead — "Send me the full report + a free homepage
// mockup" on /free-website-check. Validates the contact details (name plus
// phone and/or email, same patterns as /api/lead-form) and forwards them, with
// a summary of the report the visitor just saw, to the owner via formsubmit.co.
// Unlike /api/lead-form there is no CRM copy, so a failed email is a 502 —
// the page then tells the visitor to call or email instead of losing the lead.
import { json, jsonError, methodNotAllowed, readBody } from '@/lib/api'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { hasErrors, validateCheckLead } from '@/lib/websiteCheck'

const NOTIFY_EMAIL = 'alex@orbitboyzz.com'
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000

function str(value: unknown, max = 300): string {
  // Strip control characters so nothing odd lands in the email.
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max) : ''
}

type ReportSummary = { score: number | null; grade: string; hasWebsite: boolean; summary: string; issues: string[]; fixes: string[] }

/** The report summary comes from the browser, so treat it as untrusted text and cap everything. */
function readReport(value: unknown): ReportSummary {
  const r = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  const list = (v: unknown, n: number) => (Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean).slice(0, n) : [])
  const score = typeof r.score === 'number' && Number.isFinite(r.score) ? Math.min(100, Math.max(0, Math.round(r.score))) : null
  return {
    score,
    grade: str(r.grade, 60),
    hasWebsite: r.hasWebsite !== false,
    summary: str(r.summary, 600),
    issues: list(r.issues, 15),
    fixes: list(r.fixes, 8),
  }
}

export async function POST(request: Request) {
  const body = await readBody(request)
  if (body === null) return jsonError(400, 'invalid_json', 'The request body is not valid JSON.')

  // Honeypot: real visitors never see this field. Pretend success for bots.
  if (str(body.company_website)) return json({ received: true, emailSent: true })

  const contactName = str(body.contactName, 200)
  const phone = str(body.phone, 40)
  const email = str(body.email, 250)
  const businessName = str(body.businessName, 200)
  const town = str(body.town, 120)
  const website = str(body.url, 300)

  const errors = validateCheckLead({ contactName, phone, email })
  if (hasErrors(errors)) {
    const [field, message] = Object.entries(errors)[0]
    return jsonError(400, 'invalid_field', `"${field}": ${message}`)
  }
  if (!businessName || businessName.length > 120) return jsonError(400, 'invalid_field', '"businessName" is required and must be under 120 characters.')
  if (town.length > 80) return jsonError(400, 'invalid_field', '"town" must be under 80 characters.')

  const retryAfter = rateLimit('website-check-lead', clientIp(request), RATE_LIMIT, RATE_WINDOW_MS)
  if (retryAfter !== null) {
    return jsonError(429, 'rate_limited', 'Too many requests from this connection. Try again in a few minutes.', undefined, { 'Retry-After': String(retryAfter) })
  }

  const report = readReport(body.report)
  try {
    await notifyOwner({ contactName, phone, email, businessName, town, website, report })
  } catch (err) {
    console.error('website-check lead email failed', err)
    return jsonError(502, 'notify_failed', 'We could not send your request. Please call or email us instead.')
  }
  return json({ received: true, emailSent: true })
}

const notAllowed = methodNotAllowed('/api/website-check/lead', 'POST')
export { notAllowed as GET, notAllowed as HEAD, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as OPTIONS }

async function notifyOwner(input: {
  contactName: string
  phone: string
  email: string
  businessName: string
  town: string
  website: string
  report: ReportSummary
}) {
  const { report } = input
  const scoreText = report.hasWebsite ? (report.score === null ? 'n/a' : `${report.score}/100`) : 'NO WEBSITE'
  const payload = new URLSearchParams()
  payload.append('_subject', `Website check lead: ${input.businessName}${input.town ? ` (${input.town})` : ''} | ${scoreText}`)
  payload.append('_template', 'table')
  payload.append('_captcha', 'false')
  if (input.email) {
    payload.append(
      '_autoresponse',
      `Hey ${input.contactName.split(' ')[0] || 'there'}, thanks for running the free website check for ${input.businessName}. ` +
        `We'll put together your full report and a free homepage mockup and reach out ${input.phone ? `at ${input.phone} or ` : ''}by email shortly. ` +
        'Questions before then? Call or text 609 662 8052.',
    )
  }
  payload.append('name', input.contactName)
  if (input.email) payload.append('email', input.email)
  payload.append('phone', input.phone || '[none given]')
  payload.append('business', input.businessName)
  payload.append('town', input.town || '[none given]')
  payload.append('website', input.website || (report.hasWebsite ? '[not given]' : 'NO WEBSITE'))
  payload.append('requested', 'Full report + free homepage mockup')
  payload.append('score', `${scoreText}${report.grade ? ` (${report.grade})` : ''}`)
  payload.append('summary', report.summary || '[none]')
  payload.append('issues', report.issues.length ? report.issues.join(' | ') : '[none]')
  payload.append('top_fixes', report.fixes.length ? report.fixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n') : '[none]')
  payload.append('source', 'https://orbitboyzz.com/free-website-check')

  const response = await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString(),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`formsubmit.co failed: ${response.status} ${await response.text()}`)
}
