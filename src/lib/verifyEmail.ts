// Server-side email deliverability check for POST /api/verify-email (used by
// the /qualify and /book booking flows). Free checks only:
//   syntax -> typo domains (known list, plus one-key slips of Gmail, Yahoo,
//   Hotmail, Outlook, iCloud) -> junk local parts / placeholder domains ->
//   disposable domains -> provider local-part rules (Gmail, Outlook, Yahoo) ->
//   DNS (MX, or an A/AAAA fallback) -> optional paid mailbox check (Treg, only
//   when TREG_TOKEN and TREG_ORG are set).
// Anything that can't be decided (DNS timeout, Treg down) passes: this gate
// exists to stop typos and junk, never to lose a real lead.
// Never import this into client code: it uses node:dns.

import { Resolver } from 'node:dns/promises'
// Same syntax rule and normalisation (lowercase, punycode domain) as the forms.
import { EMAIL_RE, normalizeEmail } from '@/lib/emailCheck'

export type EmailVerdict = {
  ok: boolean
  /** Why it was rejected, or a note on an accepted address (e.g. "no MX, has A"). */
  reason?: string
  /** A corrected address to offer as a one-click fix. */
  suggestion?: string
}

/** Internal result: `final` false means "don't cache, a retry could differ". */
type Checked = EmailVerdict & { final: boolean }

// ---------------------------------------------------------------------------
// Typos
// ---------------------------------------------------------------------------

// Mistyped big-provider domains. Rejected even when the typo domain has MX
// records: several of these are registered by typo-squatters to catch mail.
const TYPO_DOMAINS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'gmail.vom': 'gmail.com',
  'gmail.xom': 'gmail.com',
  'gmail.ocm': 'gmail.com',
  'gmail.coom': 'gmail.com',
  'gmail.net': 'gmail.com',
  'gmail.org': 'gmail.com',
  'googlemail.co': 'googlemail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotamil.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmail.om': 'hotmail.com',
  'homail.com': 'hotmail.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.om': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yaoo.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outloook.com': 'outlook.com',
  'icloud.co': 'icloud.com',
  'icloud.con': 'icloud.com',
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'iclould.com': 'icloud.com',
  'aol.co': 'aol.com',
  'aol.con': 'aol.com',
  'comcast.ne': 'comcast.net',
  'verizon.ne': 'verizon.net',
}

// Top-level domains that don't exist but are one slip away from ones that do.
const TLD_TYPOS: Record<string, string> = {
  con: 'com',
  cmo: 'com',
  ocm: 'com',
  vom: 'com',
  xom: 'com',
  cpm: 'com',
  comm: 'com',
  coom: 'com',
  nte: 'net',
  ner: 'net',
  nett: 'net',
  ogr: 'org',
  orgg: 'org',
}

// Domains people actually use for mail, for "did you mean" when a typed
// domain has no mail server. Only offered as a hint, never forced.
const POPULAR_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'live.com',
  'msn.com',
  'comcast.net',
  'verizon.net',
  'optonline.net',
  'att.net',
  'protonmail.com',
  'ymail.com',
  'me.com',
]

/** Optimal string alignment distance (Levenshtein plus adjacent swaps). */
function editDistance(a: string, b: string) {
  const rows = a.length + 1
  const cols = b.length + 1
  const d: number[][] = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)))
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}

function closestPopularDomain(domain: string) {
  let best = ''
  let bestDistance = Infinity
  for (const candidate of POPULAR_DOMAINS) {
    const distance = editDistance(domain, candidate)
    if (distance < bestDistance) {
      best = candidate
      bestDistance = distance
    }
  }
  // Short domains (me.com, aol.com) only match a single slip.
  const allowed = best.length <= 7 ? 1 : 2
  return bestDistance > 0 && bestDistance <= allowed ? best : ''
}

// Nearly every one-key slip of these five (gmil.com, gmsil.com, outlool.com,
// yhaoo.com, icloud.co...) is registered by a typo-squatter with working MX
// records, so DNS alone waves them through. Measured 2026-10-15: 807 of the
// 3,341 one-edit variants of these domains accept mail.
const SLIP_PROVIDERS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']

// QWERTY neighbours (same row, plus the keys above and below).
const KEY_NEIGHBOURS: Record<string, string> = {
  '1': '2q', '2': '13qw', '3': '24we', '4': '35er', '5': '46rt', '6': '57ty', '7': '68yu', '8': '79ui', '9': '80io', '0': '9op',
  q: '12wa', w: '23qeas', e: '34wrsd', r: '45etdf', t: '56ryfg', y: '67tugh', u: '78yihj', i: '89uojk', o: '90ipkl', p: '0ol',
  a: 'qwsz', s: 'weadzx', d: 'erfsxc', f: 'rtdgcv', g: 'tyfhvb', h: 'yugjbn', j: 'uihknm', k: 'iojlm', l: 'opk.',
  z: 'asx', x: 'zsdc', c: 'xdfv', v: 'cfgb', b: 'vghn', n: 'bhjm', m: 'njk', '.': 'l',
}

function nearKeys(a: string, b: string) {
  return a === b || Boolean(KEY_NEIGHBOURS[a]?.includes(b) || KEY_NEIGHBOURS[b]?.includes(a))
}

/**
 * True when `typed` is `intended` with one slip of the finger: two letters
 * swapped, one key missed, one key doubled or hit next to the right one.
 * Edits to the first letter don't count: mail.com, email.com, ymail.com,
 * cloud.com, pcloud.com and wahoo.com are real domains, not typos. Neither
 * does a wrong key that isn't next to the right one (grail.com, yazoo.com).
 */
function isSlipOf(typed: string, intended: string) {
  if (typed === intended) return false
  let i = 0
  while (i < typed.length && i < intended.length && typed[i] === intended[i]) i++
  if (typed.length === intended.length) {
    const swapped =
      i + 1 < typed.length && typed[i] === intended[i + 1] && typed[i + 1] === intended[i] && typed.slice(i + 2) === intended.slice(i + 2)
    if (swapped) return true
    return i >= 1 && nearKeys(typed[i], intended[i]) && typed.slice(i + 1) === intended.slice(i + 1)
  }
  if (typed.length === intended.length + 1) {
    // One extra key, a double tap or a neighbour of a letter it sits beside.
    if (i < 1 || typed.slice(i + 1) !== intended.slice(i)) return false
    return nearKeys(typed[i], typed[i - 1]) || (i < intended.length && nearKeys(typed[i], intended[i]))
  }
  if (typed.length === intended.length - 1) return i >= 1 && typed.slice(i) === intended.slice(i + 1)
  return false
}

function typoSuggestion(domain: string) {
  if (TYPO_DOMAINS[domain]) return TYPO_DOMAINS[domain]
  const dot = domain.lastIndexOf('.')
  const tld = domain.slice(dot + 1)
  if (TLD_TYPOS[tld]) return `${domain.slice(0, dot)}.${TLD_TYPOS[tld]}`
  if (KNOWN_MAIL_DOMAINS.has(domain)) return ''
  return SLIP_PROVIDERS.find((provider) => isSlipOf(domain, provider)) ?? ''
}

// ---------------------------------------------------------------------------
// Junk and throwaway addresses
// ---------------------------------------------------------------------------

const JUNK_LOCAL_PARTS = new Set([
  'test',
  'testing',
  'tester',
  'test123',
  'asdf',
  'qwerty',
  'aaa',
  'abc123',
  'fake',
  'fakeemail',
  'noemail',
  'nomail',
  'no-email',
  'none',
  'nope',
  'null',
  'nobody',
  'nothing',
  'notreal',
  'xxx',
  'foo',
  'foobar',
  'spam',
  'junk',
  'blah',
  'sample',
  'example',
  'youremail',
  'yourname',
  'idk',
  '123',
  '1234',
  '12345',
  '123456',
])

// Reserved (RFC 2606/6761) or placeholder domains nobody receives mail on.
const PLACEHOLDER_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'example.co',
  'test.com',
  'testing.com',
  'fake.com',
  'fakeemail.com',
  'noemail.com',
  'nomail.com',
  'none.com',
  'nothing.com',
  'sample.com',
  'domain.com',
  'yourdomain.com',
  'youremail.com',
  'yourcompany.com',
  'yourbusiness.com',
  'company.com',
  'asdf.com',
])
const PLACEHOLDER_TLDS = new Set(['test', 'example', 'invalid', 'localhost', 'local', 'lan', 'internal'])

// Throwaway inbox services. Subdomains are blocked too.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'mailinator.net',
  'mailinator.org',
  'mailinator2.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.info',
  'guerrillamailblock.com',
  'grr.la',
  'sharklasers.com',
  'pokemail.net',
  'spam4.me',
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.co.uk',
  '20minutemail.com',
  'minuteinbox.com',
  'temp-mail.org',
  'temp-mail.io',
  'tempmail.com',
  'tempmail.net',
  'tempmail.dev',
  'tempmailo.com',
  'tempmailaddress.com',
  'tempinbox.com',
  'tempr.email',
  'tmpmail.org',
  'tmpmail.net',
  'mytemp.email',
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  'trashmail.com',
  'trashmail.de',
  'trashmail.net',
  'trashmail.me',
  'getnada.com',
  'nada.email',
  'dispostable.com',
  'maildrop.cc',
  'mailnesia.com',
  'mintemail.com',
  'mohmal.com',
  'throwawaymail.com',
  'fakeinbox.com',
  'fakemail.net',
  'emailfake.com',
  'emailondeck.com',
  'moakt.com',
  'mailcatch.com',
  'burnermail.io',
  'discard.email',
  'discardmail.com',
  'getairmail.com',
  'inboxkitten.com',
  'mailpoof.com',
  '1secmail.com',
  '1secmail.org',
  '1secmail.net',
  'mail.tm',
  'mail.gw',
  'harakirimail.com',
  'spambox.us',
  'spamgourmet.com',
  'crazymailing.com',
  'mailsac.com',
  'mvrht.net',
  'emltmp.com',
  'tempmail.plus',
])

function isDisposable(domain: string) {
  if (DISPOSABLE_DOMAINS.has(domain)) return true
  for (const blocked of DISPOSABLE_DOMAINS) if (domain.endsWith(`.${blocked}`)) return true
  return false
}

function isJunkLocal(local: string) {
  const base = local.split('+')[0]
  if (JUNK_LOCAL_PARTS.has(base)) return true
  // Keyboard mashes and one repeated character: asdfgh, qwertyuiop, zzzz.
  if (/^(?:asdf|qwer|zxcv|hjkl)/.test(base)) return true
  return /^(.)\1{2,}$/.test(base)
}

// ---------------------------------------------------------------------------
// Provider local-part rules
// ---------------------------------------------------------------------------

/** Returns a rejection reason when the mailbox name can't exist at this provider. */
function providerRule(local: string, domain: string): string {
  // Gmail, Outlook and Yahoo all ignore a +tag when routing.
  const base = local.split('+')[0]

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    if (!/^[a-z0-9.]+$/.test(base)) return 'gmail allows only letters, digits and dots'
    if (base.startsWith('.') || base.endsWith('.') || base.includes('..')) return 'gmail address has a misplaced dot'
    // Gmail ignores dots, so b.o.i@gmail.com is boi@gmail.com.
    const length = base.replace(/\./g, '').length
    if (length < 6) return 'gmail address too short'
    if (length > 30) return 'gmail address too long'
    return ''
  }

  if (/^(?:outlook|hotmail|live|msn)\.(?:com|co\.uk|ca|fr|de|it|es)$/.test(domain)) {
    if (base.length < 1 || base.length > 64) return 'outlook address length invalid'
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(base)) return 'outlook address has invalid characters'
    if (base.endsWith('.') || base.includes('..')) return 'outlook address has a misplaced dot'
    return ''
  }

  if (/^(?:yahoo\.(?:com|co\.uk|ca|fr|de|it|es|com\.au)|ymail\.com|rocketmail\.com)$/.test(domain)) {
    if (base.length < 4) return 'yahoo address too short'
    if (base.length > 32) return 'yahoo address too long'
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(base)) return 'yahoo address has invalid characters'
    return ''
  }

  return ''
}

// Big providers known to accept mail: skip the DNS round trip for them.
const KNOWN_MAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'comcast.net',
  'verizon.net',
  'optonline.net',
  'att.net',
  'protonmail.com',
  'proton.me',
])

// ---------------------------------------------------------------------------
// DNS
// ---------------------------------------------------------------------------

type DnsResult = { kind: 'mx' } | { kind: 'a-only' } | { kind: 'null-mx' } | { kind: 'none' } | { kind: 'error' }

const DNS_TIMEOUT_MS = 2000
const DNS_BUDGET_MS = 4500

function dnsCode(error: unknown) {
  return error && typeof error === 'object' && 'code' in error ? String((error as { code: unknown }).code) : ''
}

// "This name or record doesn't exist" answers. Everything else (timeouts,
// SERVFAIL, refused) is a lookup failure, not a verdict.
const DNS_MISSING = new Set(['ENOTFOUND', 'ENODATA', 'NXDOMAIN', 'ENONAME'])

async function hasAddress(resolver: Resolver, domain: string) {
  const attempts = await Promise.allSettled([resolver.resolve4(domain), resolver.resolve6(domain)])
  if (attempts.some((attempt) => attempt.status === 'fulfilled' && attempt.value.length > 0)) return 'yes'
  const failures = attempts.filter((attempt): attempt is PromiseRejectedResult => attempt.status === 'rejected')
  return failures.every((failure) => DNS_MISSING.has(dnsCode(failure.reason))) ? 'no' : 'error'
}

async function lookupDomain(domain: string): Promise<DnsResult> {
  const resolver = new Resolver({ timeout: DNS_TIMEOUT_MS, tries: 2 })
  try {
    const records = await resolver.resolveMx(domain)
    // RFC 7505 "null MX": the domain explicitly accepts no mail.
    if (records.length === 1 && (records[0].exchange === '' || records[0].exchange === '.')) return { kind: 'null-mx' }
    if (records.length > 0) return { kind: 'mx' }
  } catch (error) {
    if (!DNS_MISSING.has(dnsCode(error))) return { kind: 'error' }
  }
  // No MX: SMTP falls back to the domain's own address record.
  const address = await hasAddress(resolver, domain)
  if (address === 'yes') return { kind: 'a-only' }
  return address === 'no' ? { kind: 'none' } : { kind: 'error' }
}

const domainCache = new Map<string, DnsResult>()

async function checkDomain(domain: string): Promise<DnsResult> {
  const cached = domainCache.get(domain)
  if (cached) return cached
  let timer: ReturnType<typeof setTimeout> | undefined
  const budget = new Promise<DnsResult>((resolve) => {
    timer = setTimeout(() => resolve({ kind: 'error' }), DNS_BUDGET_MS)
  })
  const result = await Promise.race([lookupDomain(domain).catch((): DnsResult => ({ kind: 'error' })), budget])
  clearTimeout(timer)
  if (result.kind !== 'error') remember(domainCache, domain, result)
  return result
}

// ---------------------------------------------------------------------------
// Optional mailbox check (paid, Treg)
// ---------------------------------------------------------------------------

const TREG_URL = 'https://treg.to/call/treg.people.email.verify'
const TREG_TIMEOUT_MS = 4000

// Treg passes each provider's own verdict word through. Same reading as the
// agency-leads checker (agency-leads/checkmail.mjs): these mean the mailbox
// can't take mail (or is a throwaway / trap); valid/ok/deliverable mean it
// can; anything else (accept_all, unknown...) can't be confirmed and passes.
const MAILBOX_GONE =
  /^(?:invalid|undeliverable|bounced?|rejected|does_not_exist|not_found|mailbox_not_found|no_mailbox|syntax_error|invalid_syntax|invalid_domain|no_mx)$/
const MAILBOX_JUNK = /^(?:disposable|spam_?trap)$/
const MAILBOX_OK = /^(?:valid|ok|deliverable|verified|safe)$/

// Process-wide ceiling on paid lookups. The per-IP limit in the route doesn't
// stop many IPs (or one rotating) running up the bill with fresh addresses;
// past the ceiling the paid check is skipped, never the form.
const TREG_MAX_PER_MINUTE = 30
const tregWindow = { start: 0, calls: 0 }

function tregBudgetLeft() {
  const now = Date.now()
  if (now - tregWindow.start >= 60_000) {
    tregWindow.start = now
    tregWindow.calls = 0
  }
  if (tregWindow.calls >= TREG_MAX_PER_MINUTE) return false
  tregWindow.calls++
  return true
}

/** 'invalid' and 'junk' reject; 'valid' and 'skipped' pass silently; 'error' passes uncached; anything else passes with a note. */
async function mailboxStatus(email: string): Promise<string> {
  const token = process.env.TREG_TOKEN
  const org = process.env.TREG_ORG
  if (!token || !org) return 'skipped'
  if (!tregBudgetLeft()) return 'error'
  try {
    const response = await fetch(TREG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Treg-Token': token,
        'X-Treg-Org': org,
        // Cap what one lookup may cost (the agency-leads scripts use the same).
        'X-Treg-Route-Max-Cost': '0.006',
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(TREG_TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!response.ok) return 'error'
    const data: unknown = await response.json().catch(() => null)
    const output = data && typeof data === 'object' && 'output' in data ? (data as { output: unknown }).output : null
    if (!output || typeof output !== 'object') return 'error'
    const { status, valid } = output as { status?: unknown; valid?: unknown }
    const word = typeof status === 'string' ? status.toLowerCase().trim().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 30) : ''
    if (MAILBOX_GONE.test(word) || (!word && valid === false)) return 'invalid'
    if (MAILBOX_JUNK.test(word)) return 'junk'
    if (MAILBOX_OK.test(word) || (!word && valid === true)) return 'valid'
    return word || 'unknown'
  } catch {
    return 'error'
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const MAX_CACHE = 5000

function remember<T>(cache: Map<string, T>, key: string, value: T) {
  // Maps iterate in insertion order: drop the oldest entry once full.
  if (cache.size >= MAX_CACHE) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
  cache.set(key, value)
}

const emailCache = new Map<string, EmailVerdict>()

/** A corrected address worth offering: only one that would itself pass the local checks. */
function suggestion(local: string, domain: string) {
  if (!domain || isJunkLocal(local) || providerRule(local, domain)) return {}
  return { suggestion: `${local}@${domain}` }
}

async function runChecks(email: string): Promise<Checked> {
  if (email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, reason: 'invalid syntax', final: true }
  const at = email.lastIndexOf('@')
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (local.length > 64 || domain.split('.').some((label) => label.length > 63)) {
    return { ok: false, reason: 'invalid syntax', final: true }
  }

  const fixedDomain = typoSuggestion(domain)
  if (fixedDomain) return { ok: false, reason: 'domain typo', ...suggestion(local, fixedDomain), final: true }

  const tld = domain.slice(domain.lastIndexOf('.') + 1)
  if (PLACEHOLDER_DOMAINS.has(domain) || PLACEHOLDER_TLDS.has(tld)) return { ok: false, reason: 'placeholder domain', final: true }
  if (isJunkLocal(local)) return { ok: false, reason: 'placeholder address', final: true }
  if (isDisposable(domain)) return { ok: false, reason: 'disposable domain', final: true }

  const ruleBroken = providerRule(local, domain)
  if (ruleBroken) return { ok: false, reason: ruleBroken, final: true }

  let note: string | undefined
  if (!KNOWN_MAIL_DOMAINS.has(domain)) {
    const dns = await checkDomain(domain)
    if (dns.kind === 'none' || dns.kind === 'null-mx') {
      return {
        ok: false,
        reason: dns.kind === 'null-mx' ? 'domain accepts no mail' : 'domain has no mail server',
        ...suggestion(local, closestPopularDomain(domain)),
        final: true,
      }
    }
    // DNS couldn't answer: let the address through, flagged.
    if (dns.kind === 'error') return { ok: true, reason: 'dns lookup failed', final: false }
    if (dns.kind === 'a-only') {
      // A web-only domain one slip from a big provider (gmal.co) is a typo,
      // usually a parked typo-squat, not someone's mail server.
      const closest = closestPopularDomain(domain)
      if (closest) return { ok: false, reason: 'domain typo', ...suggestion(local, closest), final: true }
      note = 'no MX, has A'
    }
  }

  const mailbox = await mailboxStatus(email)
  if (mailbox === 'invalid') return { ok: false, reason: 'mailbox does not exist', final: true }
  if (mailbox === 'junk') return { ok: false, reason: 'disposable mailbox', final: true }
  if (mailbox === 'error') return { ok: true, ...(note ? { reason: note } : {}), final: false }
  if (mailbox !== 'valid' && mailbox !== 'skipped') note = note ? `${note}; mailbox ${mailbox}` : `mailbox ${mailbox}`
  return { ok: true, ...(note ? { reason: note } : {}), final: true }
}

/** Checks one address. Results are cached per address for the process lifetime. */
export async function verifyEmail(raw: string): Promise<EmailVerdict> {
  const email = normalizeEmail(raw)
  const cached = emailCache.get(email)
  if (cached) return cached
  const { final, ...verdict } = await runChecks(email)
  if (final) remember(emailCache, email, verdict)
  return verdict
}
