'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import posthog from 'posthog-js'
import { leadsContact, leadsRequest } from '@/content/leads'
import { LEADS_REQUEST_DEFAULT_SOURCE, LEADS_REQUEST_ENDPOINT } from '@/content/leadsRequestConfig'
import { ArrowIcon } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { checkEmail, emailCheckLabel, looksLikeEmail, normalizeEmail } from '@/lib/emailCheck'
import { isFreeMail } from '@/lib/freeMail'

// The 25-free-leads request form on leads.orbitboyzz.com (#request). Short on
// purpose: niche, area and a work email, plus an optional name and agency.
// No call or calendar step: the success state says the sheet arrives by email.
// Posted from the browser to FormSubmit (same inbox as /sample and /book),
// which 403s server-side requests. ?src= (or utm_source, else the referring
// site) rides along in a hidden field so the inbox shows where the visit came from.

type Field = 'niche' | 'area' | 'email' | 'name' | 'agency'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const EMPTY: Values = { niche: '', area: '', email: '', name: '', agency: '' }
const LIMITS: Record<Field, number> = { niche: 120, area: 120, email: 160, name: 80, agency: 120 }
const ORDER: readonly Field[] = ['niche', 'area', 'email', 'name', 'agency']

const FREE_MAIL_ERROR = 'Use your work email (your agency’s own domain). Gmail, Yahoo, Outlook, Hotmail, iCloud, AOL and Proton addresses aren’t accepted.'
const UNDELIVERABLE_ERROR = 'That email doesn’t look deliverable. Check it for typos.'

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.niche.trim()) errors.niche = 'Add the niche, e.g. roofers.'
  if (!values.area.trim()) errors.area = 'Add the city and state, e.g. Austin, TX.'
  const email = values.email.trim()
  if (!email) errors.email = 'Add your work email.'
  else if (!looksLikeEmail(email)) errors.email = 'That email doesn’t look right. Check it for typos.'
  else if (isFreeMail(email)) errors.email = FREE_MAIL_ERROR
  return errors
}

/** Lowercase letters, digits, dot, dash and underscore only, capped. */
function cleanSource(value: string | null) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 60)
}

/** ?src=, then utm_source, then the referring site, else 'direct'. */
function detectSource() {
  const params = new URLSearchParams(window.location.search)
  const tagged = cleanSource(params.get('src')) || cleanSource(params.get('utm_source'))
  if (tagged) return tagged
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./i, '')
      if (host && host !== window.location.hostname.replace(/^www\./i, '')) return `referrer:${host}`.slice(0, 80)
    }
  } catch {
    // Malformed referrer: fall through.
  }
  return LEADS_REQUEST_DEFAULT_SOURCE
}

function orBlank(value: string) {
  return value.trim() || '(left blank)'
}

function buildPayload(values: Values, source: string, emailCheck: string, honey: string) {
  const niche = values.niche.trim()
  const area = values.area.trim()
  const email = values.email.trim()
  const fields: Record<string, string> = {
    _subject: `25 free leads: ${niche} in ${area} [src: ${source}]`,
    _template: 'table',
    _captcha: 'false',
    // Lets you hit Reply in the notification and land in their inbox.
    _replyto: email,
    request: '25 free leads (one niche)',
    niche,
    area,
    email,
    // ok, ok (<note>) or unverified (the check timed out or failed).
    email_check: emailCheck,
    name: orBlank(values.name),
    agency: orBlank(values.agency),
    source,
    'Submitted from': window.location.host,
  }
  if (honey) fields._honey = honey
  return fields
}

type Sent = { first: string; email: string; niche: string; area: string }

export function LeadsRequestForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [source, setSource] = useState(LEADS_REQUEST_DEFAULT_SOURCE)
  const [suggestion, setSuggestion] = useState('')
  const [checking, setChecking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState<Sent | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const honeyRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)
  // Synchronous guard: a second Enter/click can arrive before the re-render that disables the button.
  const busyRef = useRef(false)
  const busy = checking || submitting

  // Read the visit's source after hydration, so the server HTML and the first client render match.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the URL once on mount
    setSource(detectSource())
  }, [])

  // The thank-you card is shorter than the form: bring it into view and move focus to it.
  useEffect(() => {
    const heading = doneRef.current
    if (!sent || !heading) return
    heading.focus({ preventScroll: true })
    heading.closest('[role="status"]')?.scrollIntoView({ block: 'center' })
  }, [sent])

  function setValue(field: Field, value: string) {
    if (busy) return
    setValues((current) => ({ ...current, [field]: value.slice(0, LIMITS[field]) }))
    if (field === 'email') setSuggestion('')
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function focusField(field: Field) {
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus()
  }

  function onEmailBlur() {
    const email = values.email.trim()
    if (email && looksLikeEmail(email) && isFreeMail(email)) setErrors((current) => ({ ...current, email: FREE_MAIL_ERROR }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (busyRef.current) return
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError('')
    const firstInvalid = ORDER.find((field) => nextErrors[field])
    if (firstInvalid) {
      focusField(firstInvalid)
      return
    }

    busyRef.current = true
    try {
      // Deliverability check (/api/verify-email). Fails open: a timeout or error comes back 'unverified'.
      setChecking(true)
      const check = await checkEmail(values.email)
      setChecking(false)
      if (check.status === 'rejected') {
        setErrors({ email: UNDELIVERABLE_ERROR })
        setSuggestion(check.suggestion && !isFreeMail(check.suggestion) ? check.suggestion : '')
        focusField('email')
        return
      }

      setSubmitting(true)
      const response = await fetch(LEADS_REQUEST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload(values, source, emailCheckLabel(check), honeyRef.current?.value ?? '')),
      })
      const data: unknown = await response.json().catch(() => null)
      const rejected = data !== null && typeof data === 'object' && 'success' in data && String((data as { success: unknown }).success) === 'false'
      if (!response.ok || rejected) throw new Error('Submission rejected')
      // Source only: no names, emails or free text.
      posthog.capture('leads_request_submitted', { source })
      setSent({
        first: values.name.trim().split(/\s+/)[0] ?? '',
        email: normalizeEmail(values.email),
        niche: values.niche.trim(),
        area: values.area.trim(),
      })
    } catch {
      setSubmitError('That didn’t go through. Your answers are still here, so check your connection and try again.')
    } finally {
      busyRef.current = false
      setChecking(false)
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-[calc(var(--radius)+0.5rem)] border border-accent/40 bg-panel bg-[radial-gradient(ellipse_at_top,rgba(214,179,106,0.16),transparent_60%)] p-7 text-center sm:p-10"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 12 12" fill="none">
            <path d="m2 6.2 2.6 2.6L10 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="label mt-6 text-accent">{leadsRequest.done.kicker}</p>
        <h3 ref={doneRef} tabIndex={-1} className="display mt-3 text-[clamp(2rem,4vw,2.8rem)] outline-none">
          Thanks{sent.first ? `, ${sent.first}` : ''}.
        </h3>
        <p className="mx-auto mt-4 max-w-md text-balance leading-relaxed text-muted">
          {leadsRequest.done.copy}
          <strong className="block break-words font-medium text-fg [overflow-wrap:anywhere]">{sent.email}</strong>
        </p>
        <p className="mx-auto mt-5 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-line px-4 py-2 text-sm text-muted">
          <span className="text-dim">Your request</span>
          <span className="text-fg">
            {sent.niche} · {sent.area}
          </span>
        </p>
        <p className="mx-auto mt-5 max-w-md text-sm text-dim">
          {leadsRequest.done.next} Questions before then? Email{' '}
          <a href={`mailto:${leadsContact.email}`} className="link-u text-fg">
            {leadsContact.email}
          </a>
          .
        </p>
      </div>
    )
  }

  const f = leadsRequest.fields
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={busy}
      className="relative grid gap-5 rounded-[calc(var(--radius)+0.5rem)] border border-line-strong bg-panel/90 p-5 shadow-[0_40px_120px_-40px_rgba(214,179,106,0.3)] backdrop-blur sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField field="niche" label={f.niche.label} placeholder={f.niche.placeholder} required value={values.niche} error={errors.niche} readOnly={busy} onChange={setValue} />
        <TextField
          field="area"
          label={f.area.label}
          placeholder={f.area.placeholder}
          required
          value={values.area}
          error={errors.area}
          readOnly={busy}
          onChange={setValue}
          autoComplete="address-level2"
        />
      </div>
      <TextField
        field="email"
        label={f.email.label}
        placeholder={f.email.placeholder}
        required
        type="email"
        inputMode="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        readOnly={busy}
        onChange={setValue}
        onBlur={onEmailBlur}
        after={
          suggestion ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setValue('email', suggestion)
                setSuggestion('')
                focusField('email')
              }}
              className="mt-2 text-left text-sm text-muted underline decoration-accent/60 underline-offset-4 hover:text-fg"
            >
              Did you mean <strong className="font-medium text-fg">{suggestion}</strong>?
            </button>
          ) : null
        }
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField field="name" label={f.name.label} placeholder={f.name.placeholder} optional autoComplete="name" value={values.name} readOnly={busy} onChange={setValue} />
        <TextField field="agency" label={f.agency.label} placeholder={f.agency.placeholder} optional autoComplete="organization" value={values.agency} readOnly={busy} onChange={setValue} />
      </div>

      {/* Where the visit came from (?src=, utm_source or the referring site). */}
      <input type="hidden" name="src" value={source} />
      {/* Honeypot: people never see it; FormSubmit drops submissions that fill it. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="ld-honey">Leave this field empty</label>
        <input ref={honeyRef} id="ld-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      {submitError && (
        <div role="alert" className="rounded-2xl border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm leading-relaxed text-red-200">
          <p>{submitError}</p>
          <p className="mt-1">
            If it keeps failing, email{' '}
            <a href={`mailto:${leadsContact.email}`} className="underline underline-offset-4">
              {leadsContact.email}
            </a>
            .
          </p>
        </div>
      )}

      <button type="submit" disabled={busy} aria-disabled={busy} className="btn btn-primary mt-1 w-full disabled:cursor-wait disabled:opacity-70">
        <span>{checking ? 'Checking email…' : submitting ? 'Sending…' : submitError ? 'Try again' : leadsRequest.submit}</span>
        <span className="btn-arrow" aria-hidden="true">
          {busy ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.2-8.56" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          ) : (
            <ArrowIcon />
          )}
        </span>
      </button>
      <p className="text-center text-xs leading-relaxed text-dim">{leadsRequest.fine}</p>
    </form>
  )
}

function TextField({
  field,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  optional = false,
  readOnly = false,
  type = 'text',
  inputMode,
  autoComplete,
  after,
}: {
  field: Field
  label: string
  value: string
  onChange: (field: Field, value: string) => void
  onBlur?: () => void
  error?: string
  placeholder?: string
  required?: boolean
  optional?: boolean
  readOnly?: boolean
  type?: 'text' | 'email'
  inputMode?: 'text' | 'email'
  autoComplete?: string
  after?: ReactNode
}) {
  const id = `ld-${field}-${useId().replace(/:/g, '')}`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="label mb-2 flex items-center gap-2">
        <span>{label}</span>
        {required && (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="normal-case tracking-normal text-dim">(optional)</span>}
      </label>
      <input
        id={id}
        name={field}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={LIMITS[field]}
        required={required}
        readOnly={readOnly}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          'h-[3.25rem] w-full rounded-2xl border bg-bg/60 px-4 text-base text-fg outline-none transition-colors duration-[var(--d-sm)] placeholder:text-dim focus:border-accent read-only:opacity-70',
          error ? 'border-red-400/80' : 'border-line-strong',
        )}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.82rem] leading-snug text-red-300">
          {error}
        </p>
      )}
      {after}
    </div>
  )
}
