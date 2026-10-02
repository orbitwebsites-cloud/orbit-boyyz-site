// Pure types + validation shared by the /free-website-check page
// (components/port/WebsiteCheck.tsx) and its two route handlers
// (app/api/website-check). Single source of truth so the UI and API never
// drift apart — mirrors leadForm.ts / quoteEstimate.ts.
// The network checks themselves live in websiteCheckRun.ts (server only).

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'unavailable'

export type CheckId =
  | 'reachable'
  | 'https'
  | 'httpsRedirect'
  | 'title'
  | 'metaDescription'
  | 'viewport'
  | 'h1'
  | 'clickToCall'
  | 'contactForm'
  | 'localSchema'
  | 'townMention'
  | 'pageWeight'
  | 'responseTime'
  | 'mobileSpeed'
  | 'website'

export interface CheckResult {
  id: CheckId
  label: string
  status: CheckStatus
  /** Points this check is worth out of 100. */
  weight: number
  /** Points earned. Always 0 when status is "unavailable". */
  earned: number
  /** What we found, in plain English. */
  detail: string
  /** What to do about it. Omitted when the check passed. */
  fix?: string
}

export interface PageSpeedMetrics {
  /** Lighthouse mobile performance score, 0–100. */
  performance: number
  lcpMs: number | null
  lcpDisplay: string | null
  totalBytes: number | null
}

export interface WebsiteCheckReport {
  business: { name: string; town: string }
  hasWebsite: boolean
  url: { input: string; final: string | null } | null
  /** 0–100, weighted over the checks that actually ran. */
  score: number
  grade: string
  summary: string
  checksRun: number
  checksTotal: number
  checks: CheckResult[]
  /** Plain-English fixes, biggest point loss first. */
  fixes: string[]
  metrics: {
    responseTimeMs: number | null
    htmlBytes: number | null
    redirects: string[]
    pageSpeed: PageSpeedMetrics | null
    pageSpeedNote: string | null
  }
  noWebsite: { headline: string; costs: string[]; nextSteps: string[] } | null
  checkedAt: string
}

/** Check weights (sum = 100). */
export const CHECK_WEIGHTS: Record<Exclude<CheckId, 'website'>, number> = {
  reachable: 12,
  https: 10,
  httpsRedirect: 4,
  title: 6,
  metaDescription: 5,
  viewport: 10,
  h1: 4,
  clickToCall: 10,
  contactForm: 8,
  localSchema: 6,
  townMention: 5,
  pageWeight: 4,
  responseTime: 6,
  mobileSpeed: 10,
}

export const CHECK_LABELS: Record<Exclude<CheckId, 'website'>, string> = {
  reachable: 'Site loads',
  https: 'Secure (HTTPS)',
  httpsRedirect: 'http:// sends visitors to https://',
  title: 'Page title',
  metaDescription: 'Meta description',
  viewport: 'Mobile-friendly setup',
  h1: 'Main heading (H1)',
  clickToCall: 'Tap-to-call phone link',
  contactForm: 'Contact or quote form',
  localSchema: 'Local business info for Google',
  townMention: 'Mentions your town',
  pageWeight: 'Page size',
  responseTime: 'Server response time',
  mobileSpeed: 'Mobile speed (Google PageSpeed)',
}

/** Why each check matters, in plain English — shown on the page before anyone runs a check. */
export const CHECK_WHY: Record<Exclude<CheckId, 'website'>, string> = {
  reachable: 'Your homepage actually opens, without errors.',
  https: 'No "Not secure" warning in the browser.',
  httpsRedirect: 'Old http:// links land on the secure version.',
  title: 'The blue headline Google shows for your site.',
  metaDescription: 'The two lines of text under that headline.',
  viewport: 'The page fits a phone screen instead of shrinking.',
  h1: 'One clear heading that says what you do and where.',
  clickToCall: 'Mobile visitors can call you in one tap.',
  contactForm: 'People who won’t call can still ask for a quote.',
  localSchema: 'Structured data that tells Google your business details.',
  townMention: 'Your town is named, so you match local searches.',
  pageWeight: 'Lean page code loads faster on phones.',
  responseTime: 'How fast your server starts answering.',
  mobileSpeed: 'Google’s own mobile speed score and load time.',
}

export const STATUS_CREDIT: Record<CheckStatus, number> = { pass: 1, warn: 0.5, fail: 0, unavailable: 0 }

/** Score over the checks that ran — an unavailable check never counts for or against you. */
export function scoreChecks(checks: CheckResult[]): number {
  const ran = checks.filter((c) => c.status !== 'unavailable')
  const possible = ran.reduce((sum, c) => sum + c.weight, 0)
  if (!possible) return 0
  const earned = ran.reduce((sum, c) => sum + c.earned, 0)
  return Math.round((earned / possible) * 100)
}

export function gradeFor(score: number): string {
  if (score >= 85) return 'Strong'
  if (score >= 65) return 'Decent, with gaps'
  if (score >= 40) return 'Needs work'
  return 'Likely costing you calls'
}

// --- Input validation --------------------------------------------------------

export interface CheckInput {
  name: string
  town: string
  url: string
}

export type CheckInputErrors = Partial<Record<keyof CheckInput, string>>

/**
 * Normalizes what a business owner types ("joesplumbing.com", "www.x.com/",
 * "http://x.com") into an absolute http(s) URL, or returns null if it can't be
 * a public website address.
 */
export function normalizeWebsiteUrl(raw: string): URL | null {
  let value = raw.trim()
  if (!value) return null
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `https://${value}`
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  if (url.username || url.password) return null
  if (url.port && url.port !== '80' && url.port !== '443') return null
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  // Must look like a public domain name: at least one dot, a letter TLD, no IP literals.
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z][a-z0-9-]{1,62}$/.test(host)) return null
  // Reserved / internal-only suffixes (RFC 2606, RFC 6762, common LAN names).
  if (/(^|\.)(localhost|local|internal|intranet|lan|home|corp|test|invalid|example)$/.test(host)) return null
  url.hash = ''
  return url
}

export function validateCheckInput(input: CheckInput): CheckInputErrors {
  const errors: CheckInputErrors = {}
  const name = input.name.trim()
  const town = input.town.trim()
  const url = input.url.trim()

  if (!name) errors.name = 'Business name is required.'
  else if (name.length > 120) errors.name = 'Keep it under 120 characters.'

  if (!town) errors.town = 'Which town are you in?'
  else if (town.length > 80) errors.town = 'Keep it under 80 characters.'

  if (url) {
    if (url.length > 300) errors.url = 'That address is too long.'
    else if (!normalizeWebsiteUrl(url)) errors.url = 'Enter a website address like yourbusiness.com, or leave it blank.'
  }
  return errors
}

// --- Lead form -------------------------------------------------------------

export interface CheckLeadInput {
  contactName: string
  phone: string
  email: string
}

export type CheckLeadErrors = Partial<Record<keyof CheckLeadInput, string>>

// Same patterns as lib/leadForm.ts and app/api/lead-form/route.ts.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_RE = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

/** Name is required; at least one of phone or email, and whichever is given must be valid. */
export function validateCheckLead(input: CheckLeadInput): CheckLeadErrors {
  const errors: CheckLeadErrors = {}
  const contactName = input.contactName.trim()
  const phone = input.phone.trim()
  const email = input.email.trim()

  if (!contactName) errors.contactName = 'Your name is required.'
  else if (contactName.length > 120) errors.contactName = 'Keep it under 120 characters.'

  if (!phone && !email) {
    errors.phone = 'Add a phone number or an email so we can send the report.'
  } else {
    if (phone && !PHONE_RE.test(phone)) errors.phone = 'Enter a valid US phone number.'
    if (email && (!EMAIL_RE.test(email) || email.length > 200)) errors.email = 'Enter a valid email address.'
  }
  return errors
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0
}
