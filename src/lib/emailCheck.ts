// Client side of POST /api/verify-email, shared by the /qualify and /book
// forms. Fails open: a timeout, network error, 429 or any odd answer comes
// back as 'unverified' so the form still sends (and says so in the email).

export type EmailCheck =
  | { status: 'ok'; reason?: string }
  | { status: 'rejected'; reason?: string; suggestion?: string }
  | { status: 'unverified' }

const ENDPOINT = '/api/verify-email'
// The server's DNS budget plus its optional 4s mailbox check fit inside this.
const TIMEOUT_MS = 9000

// Dot-atom local part + dotted hostname: rejects spaces, commas, "a@b..co",
// leading/trailing dots and hyphen-edged labels. Test it against
// normalizeEmail(raw), so an internationalised domain arrives as punycode
// (the xn-- TLD branch covers .рф and similar).
export const EMAIL_RE =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[a-z]{2,}|xn--[a-z0-9-]*[a-z0-9])$/i

/**
 * Trimmed and lowercased, with an internationalised domain (müller.de) in the
 * ASCII form mail servers use (xn--mller-kva.de). Shared with the server
 * check (lib/verifyEmail.ts) so both sides judge the same string.
 */
export function normalizeEmail(raw: string) {
  const email = raw.trim().toLowerCase()
  const at = email.lastIndexOf('@')
  const domain = email.slice(at + 1)
  // Only a plain non-ASCII hostname is converted; anything URL-like is left
  // as typed so it still fails the syntax check.
  if (at < 1 || !/[^\x00-\x7f]/.test(domain) || /[\s/\\?#@:[\]%]/.test(domain)) return email
  try {
    return `${email.slice(0, at)}@${new URL(`http://${domain}`).hostname}`
  } catch {
    return email
  }
}

/** Syntax only: true when the address is shaped like a deliverable one. */
export function looksLikeEmail(raw: string) {
  return EMAIL_RE.test(normalizeEmail(raw))
}

const checks = new Map<string, Promise<EmailCheck>>()

async function request(email: string): Promise<EmailCheck> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    })
    if (!response.ok) return { status: 'unverified' }
    const data: unknown = await response.json().catch(() => null)
    if (!data || typeof data !== 'object' || typeof (data as { ok?: unknown }).ok !== 'boolean') return { status: 'unverified' }
    const { ok, reason, suggestion } = data as { ok: boolean; reason?: unknown; suggestion?: unknown }
    const why = typeof reason === 'string' && reason ? reason.slice(0, 120) : undefined
    if (ok) return { status: 'ok', reason: why }
    const fix = typeof suggestion === 'string' && EMAIL_RE.test(suggestion) ? suggestion : undefined
    return { status: 'rejected', reason: why, suggestion: fix }
  } catch {
    return { status: 'unverified' }
  } finally {
    window.clearTimeout(timer)
  }
}

/** Checks an address once per page load; repeat calls share the same answer. */
export function checkEmail(raw: string): Promise<EmailCheck> {
  const email = normalizeEmail(raw)
  let check = checks.get(email)
  if (!check) {
    check = request(email)
    checks.set(email, check)
    // Don't pin a failed lookup: the next attempt may get through.
    void check.then((result) => {
      if (result.status === 'unverified') checks.delete(email)
    })
  }
  return check
}

/** The "email_check" line in the notification email: ok, ok (<note>) or unverified. */
export function emailCheckLabel(check: EmailCheck) {
  if (check.status === 'unverified') return 'unverified'
  if (check.status === 'rejected') return check.reason ? `rejected (${check.reason})` : 'rejected'
  return check.reason ? `ok (${check.reason})` : 'ok'
}
