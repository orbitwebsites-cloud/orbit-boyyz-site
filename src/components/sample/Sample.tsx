'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type ReactNode } from 'react'
import posthog from 'posthog-js'
import { leadsContact } from '@/content/leads'
import { SAMPLE_FORM_ENDPOINT, SAMPLE_STORAGE_KEY } from '@/content/sampleConfig'
import { emailCheckLabel } from '@/lib/emailCheck'
import { Check, EmailSuggestion, LoaderCircle, Send, firstName, focusSoon, looksLikeEmail, scrollToTop, useEmailCheck } from '@/components/qualify/shared'

// /sample: request a free sample of 25 leads. Written for a telecom advisor /
// broker (phone, internet and related services; carrier-agnostic, sits between
// the carriers and the business), worded so other advisors and brokers fit too.
// One page in grouped sections, not the one-question-at-a-time flow of
// /qualify and /book, but the same look (qf- classes from qualify.css plus the
// sf- classes in ./sample.css), the same email check and the same FormSubmit
// inbox as /book. leads.orbitboyzz.com serves this page too, so its rules
// apply: no prices, no call or calendar step (it ends on the thank-you), no
// results promises, and the owner / decision-maker only "where public sources
// show it". Import only the form pieces from qualify/shared, never
// qualify/calendly or '@/content/qualifyConfig'.

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

type Option = { id: string; label: string }

const OTHER = 'other'

const SERVICES: Option[] = [
  { id: 'voice', label: 'Phone systems / VoIP / UCaaS' },
  { id: 'internet', label: 'Internet / fiber / SD-WAN' },
  { id: 'mobile', label: 'Mobile / fleet plans' },
  { id: 'contact-center', label: 'Contact center' },
  { id: 'cabling', label: 'Cabling / IT / security' },
  { id: OTHER, label: 'Other' },
]

const EMPLOYEES: Option[] = [
  { id: '1-4', label: '1–4' },
  { id: '5-19', label: '5–19' },
  { id: '20-49', label: '20–49' },
  { id: '50-199', label: '50–199' },
  { id: '200-plus', label: '200+' },
]

const LOCATIONS: Option[] = [
  { id: '1', label: '1' },
  { id: '2-5', label: '2–5' },
  { id: '6-plus', label: '6+' },
]

const DECIDERS: Option[] = [
  { id: 'owner', label: 'Owner' },
  { id: 'cfo', label: 'CFO / controller' },
  { id: 'office-manager', label: 'Office manager' },
  { id: 'it-director', label: 'IT director' },
  { id: OTHER, label: 'Other' },
]

const SIGNALS: Option[] = [
  { id: 'contract-ending', label: 'Contract ending soon' },
  { id: 'moving', label: 'Moving or opening a location' },
  { id: 'bills-up', label: 'Bills going up' },
  { id: 'outages', label: 'Outages or service complaints' },
  { id: 'growing', label: 'Growing headcount' },
  { id: OTHER, label: 'Other' },
]

const FORMATS: Option[] = [
  { id: 'excel', label: 'Spreadsheet (Excel)' },
  { id: 'google-sheet', label: 'Google Sheet' },
  { id: 'csv', label: 'CSV for your CRM' },
]

const CAPACITY: Option[] = [
  { id: 'under-25', label: 'Under 25' },
  { id: '25-100', label: '25–100' },
  { id: '100-250', label: '100–250' },
  { id: '250-plus', label: '250+' },
]

const WINS: Option[] = [
  { id: 'meetings', label: 'Booked meetings' },
  { id: 'conversations', label: 'Conversations' },
  { id: 'signed', label: 'Signed clients' },
  { id: OTHER, label: 'Other' },
]

const OUTREACH: Option[] = [
  { id: 'self', label: 'Me or my team (calls / email)' },
  { id: 'not-sure', label: 'Not sure yet' },
]

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

type Form = {
  name: string
  company: string
  email: string
  phone: string
  role: string
  services: string[]
  servicesOther: string
  providers: string
  area: string
  employees: string
  locations: string
  minBill: string
  industriesBest: string
  industriesAvoid: string
  decider: string
  deciderOther: string
  signals: string[]
  signalsOther: string
  exclude: string
  format: string
  columns: string
  capacity: string
  outreach: string
  channels: string
  clientValue: string
  win: string
  winOther: string
  ongoing: string
  notes: string
}

type ListKey = 'services' | 'signals'
type TextKey = Exclude<keyof Form, ListKey>

/** maxLength of every text field (and the cap applied to a restored draft). */
const TEXT_LIMITS: Record<TextKey, number> = {
  name: 80,
  company: 120,
  email: 160,
  phone: 30,
  role: 80,
  servicesOther: 120,
  providers: 200,
  area: 200,
  employees: 20,
  locations: 20,
  minBill: 60,
  industriesBest: 200,
  industriesAvoid: 200,
  decider: 20,
  deciderOther: 80,
  signalsOther: 160,
  exclude: 5000,
  format: 20,
  columns: 200,
  capacity: 20,
  outreach: 20,
  channels: 1000,
  clientValue: 80,
  win: 20,
  winOther: 160,
  ongoing: 300,
  notes: 2000,
}

/** Single-choice fields: a restored value must be one of these ids. */
const SINGLE_OPTIONS: Partial<Record<TextKey, Option[]>> = {
  employees: EMPLOYEES,
  locations: LOCATIONS,
  decider: DECIDERS,
  format: FORMATS,
  capacity: CAPACITY,
  outreach: OUTREACH,
  win: WINS,
}

const LIST_OPTIONS: Record<ListKey, Option[]> = { services: SERVICES, signals: SIGNALS }

function emptyForm(): Form {
  return {
    name: '',
    company: '',
    email: '',
    phone: '',
    role: '',
    services: [],
    servicesOther: '',
    providers: '',
    area: '',
    employees: '',
    locations: '',
    minBill: '',
    industriesBest: '',
    industriesAvoid: '',
    decider: '',
    deciderOther: '',
    signals: [],
    signalsOther: '',
    exclude: '',
    format: '',
    columns: '',
    capacity: '',
    outreach: '',
    channels: '',
    clientValue: '',
    win: '',
    winOther: '',
    ongoing: '',
    notes: '',
  }
}

/** Rebuilds a saved draft defensively so a stale or tampered value can't break the page. */
function restoreForm(raw: unknown): Form {
  const form = emptyForm()
  if (!raw || typeof raw !== 'object') return form
  const saved = raw as Record<string, unknown>
  for (const key of Object.keys(TEXT_LIMITS) as TextKey[]) {
    const value = saved[key]
    if (typeof value !== 'string') continue
    const options = SINGLE_OPTIONS[key]
    if (!options) form[key] = value.slice(0, TEXT_LIMITS[key])
    else if (options.some((option) => option.id === value)) form[key] = value
  }
  for (const key of Object.keys(LIST_OPTIONS) as ListKey[]) {
    const value = saved[key]
    if (Array.isArray(value)) form[key] = LIST_OPTIONS[key].filter((option) => value.includes(option.id)).map((option) => option.id)
  }
  return form
}

function readSaved(): Form {
  try {
    const raw = window.sessionStorage.getItem(SAMPLE_STORAGE_KEY)
    return raw ? restoreForm(JSON.parse(raw)) : emptyForm()
  } catch {
    return emptyForm()
  }
}

function writeSaved(form: Form) {
  try {
    window.sessionStorage.setItem(SAMPLE_STORAGE_KEY, JSON.stringify(form))
  } catch {
    // Private mode or blocked storage: the form still works, it just won't survive a reload.
  }
}

function clearSaved() {
  try {
    window.sessionStorage.removeItem(SAMPLE_STORAGE_KEY)
  } catch {
    // Nothing to clear.
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

type Errors = Partial<Record<keyof Form, string>>

/** Fields that can carry an error, in page order: the first invalid one takes focus. */
const FIELD_ORDER: Array<keyof Form> = ['name', 'company', 'email', 'phone', 'services', 'servicesOther', 'area', 'employees', 'locations', 'decider', 'format', 'win']

/** Optional, but when given: a US number, 10 digits (or 11 with a leading 1). */
function phoneError(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  let digits = trimmed.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  if (digits.length !== 10) return 'Use a 10-digit number, like 609 555 0142, or leave it blank.'
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits) || /^(\d)\1{9}$/.test(digits)) return 'That number doesn’t look right. Check it for typos.'
  return ''
}

function validate(form: Form): Errors {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = 'Add your name.'
  if (!form.company.trim()) errors.company = 'Add your company name.'
  if (!form.email.trim()) errors.email = 'Add your work email so we can send the sample.'
  else if (!looksLikeEmail(form.email)) errors.email = 'That email doesn’t look right. Check for typos.'
  const phone = phoneError(form.phone)
  if (phone) errors.phone = phone
  if (!form.services.length) errors.services = 'Pick at least one.'
  else if (form.services.includes(OTHER) && !form.servicesOther.trim()) errors.servicesOther = 'Say what else you help with.'
  if (!form.area.trim()) errors.area = 'Add the towns, counties or states you cover.'
  if (!form.employees) errors.employees = 'Pick a company size.'
  if (!form.locations) errors.locations = 'Pick a number of locations.'
  if (!form.decider) errors.decider = 'Pick who usually decides.'
  if (!form.format) errors.format = 'Pick a format.'
  if (!form.win) errors.win = 'Pick what would make it a win.'
  return errors
}

// Shown when /api/verify-email rejects the address (typo domain, no mail
// server, disposable inbox, impossible Gmail name...).
const EMAIL_UNDELIVERABLE = 'That email doesn’t look deliverable. Check it for typos, or use another address.'

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

const BLANK = '(left blank)'

function text(value: string) {
  return value.trim() || BLANK
}

function optionLabel(option: Option, other: string) {
  return option.id === OTHER && other.trim() ? `Other: ${other.trim()}` : option.label
}

function pickLabel(options: Option[], id: string, other = '') {
  const option = options.find((item) => item.id === id)
  return option ? optionLabel(option, other) : BLANK
}

function listLabel(options: Option[], ids: string[], other: string) {
  const labels = options.filter((option) => ids.includes(option.id)).map((option) => optionLabel(option, other))
  return labels.length ? labels.join('; ') : BLANK
}

function buildPayload(form: Form, honey: string, emailCheck: string) {
  const company = form.company.trim()
  const email = form.email.trim()
  const fields: Record<string, string> = {
    _subject: `Sample request: ${company}`,
    _template: 'table',
    _captcha: 'false',
    // Lets you hit Reply in the notification and land in their inbox.
    _replyto: email,
    name: form.name.trim(),
    company,
    email,
    // ok, ok (<note>) or unverified (the check timed out or failed).
    email_check: emailCheck,
    phone: text(form.phone),
    role: text(form.role),
    'Helps businesses with': listLabel(SERVICES, form.services, form.servicesOther),
    'Providers their best prospects use now': text(form.providers),
    'Area they cover': text(form.area),
    'Ideal client size: employees': pickLabel(EMPLOYEES, form.employees),
    'Ideal client size: locations': pickLabel(LOCATIONS, form.locations),
    'Smallest monthly telecom bill worth their time': text(form.minBill),
    'Industries that close best': text(form.industriesBest),
    'Industries to avoid': text(form.industriesAvoid),
    'Who usually decides at their clients': pickLabel(DECIDERS, form.decider, form.deciderOther),
    'Signals a business is ready to switch': listLabel(SIGNALS, form.signals, form.signalsOther),
    'Current clients to leave out': text(form.exclude),
    'Delivery format': pickLabel(FORMATS, form.format),
    'Columns they need': text(form.columns),
    'New conversations they can handle per month': pickLabel(CAPACITY, form.capacity),
    'Who will reach out to the leads': pickLabel(OUTREACH, form.outreach),
    'Where new clients come from today, and what it costs': text(form.channels),
    'A new client is worth per year': text(form.clientValue),
    'What would make the 25 a win': pickLabel(WINS, form.win, form.winOther),
    'Ongoing list: who decides, how soon they could start': text(form.ongoing),
    'Anything else': text(form.notes),
    'Submitted from': window.location.host,
  }
  if (honey) fields._honey = honey
  return fields
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Sent = { first: string; email: string; area: string }

export default function Sample() {
  const [form, setForm] = useState<Form>(emptyForm)
  const [loaded, setLoaded] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState<Sent | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const honeyRef = useRef<HTMLInputElement>(null)
  // Synchronous guards: a second Enter/click can arrive before the re-render
  // that disables the button.
  const submittingRef = useRef(false)
  const checkingRef = useRef(false)
  const emailCheck = useEmailCheck(form.email)
  const { precheck, verify } = emailCheck
  // Fields are read-only while the address is checked and sent: an edit made
  // then would reach the inbox unverified.
  const busy = submitting || emailCheck.checking

  // Restore this tab's draft after hydration, so the prerendered HTML and the
  // first client render stay identical.
  useEffect(() => {
    const saved = readSaved()
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate from sessionStorage once on mount */
    setForm(saved)
    setLoaded(true)
    /* eslint-enable react-hooks/set-state-in-effect */
    precheck(saved.email)
  }, [precheck])

  useEffect(() => {
    if (loaded && !sent) writeSaved(form)
  }, [loaded, sent, form])

  function clearError(...keys: Array<keyof Form>) {
    setErrors((current) => {
      if (!keys.some((key) => current[key])) return current
      const next = { ...current }
      for (const key of keys) delete next[key]
      return next
    })
  }

  function setText(key: TextKey, value: string) {
    if (busy) return
    setForm((current) => ({ ...current, [key]: value }))
    clearError(key)
  }

  function toggle(key: ListKey, id: string) {
    if (busy) return
    setForm((current) => {
      const list = current[key]
      return { ...current, [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id] }
    })
    clearError(key, key === 'services' ? 'servicesOther' : key)
  }

  function focusField(key: keyof Form) {
    // Radio and checkbox groups share the name: the first input takes focus.
    formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus()
  }

  function applySuggestion(email: string) {
    if (busy) return
    setText('email', email)
    precheck(email)
    focusField('email')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submittingRef.current || checkingRef.current) return
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setAttempted(true)
    // An address the check already rejected counts as invalid in page order too.
    const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key] || (key === 'email' && emailCheck.rejected))
    if (firstInvalid) {
      focusField(firstInvalid)
      return
    }
    // Nothing is sent until the address passes (fails open if the check can't run).
    checkingRef.current = true
    const result = await verify(form.email)
    checkingRef.current = false
    if (!result) {
      focusField('email')
      return
    }
    await send(emailCheckLabel(result))
  }

  async function send(emailCheckResult: string) {
    submittingRef.current = true
    setSubmitting(true)
    setSubmitError('')
    try {
      const response = await fetch(SAMPLE_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload(form, honeyRef.current?.value ?? '', emailCheckResult)),
      })
      const data: unknown = await response.json().catch(() => null)
      const rejected =
        data !== null && typeof data === 'object' && 'success' in data && String((data as { success: unknown }).success) === 'false'
      if (!response.ok || rejected) throw new Error('Submission rejected')
      // Option ids only: no names, emails, companies or free text.
      posthog.capture('sample_request_submitted', {
        services: form.services,
        employees: form.employees,
        locations: form.locations,
        decision_maker: form.decider,
        signals: form.signals,
        delivery_format: form.format,
        capacity: form.capacity || 'not answered',
        outreach: form.outreach || 'not answered',
        success_metric: form.win,
      })
      clearSaved()
      setSent({ first: firstName(form.name), email: form.email.trim(), area: form.area.trim() })
      scrollToTop()
    } catch {
      setSubmitError('That didn’t go through. Your answers are still on this page, so check your connection and try again.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const emailError = errors.email || (emailCheck.rejected ? EMAIL_UNDELIVERABLE : '')
  const errorCount = Object.values(errors).filter(Boolean).length + (emailCheck.rejected && !errors.email ? 1 : 0)

  return (
    // data-lenis-prevent: the site's Lenis smooth scroll leaves this page (and
    // its textareas) on native scrolling, like /qualify and /book.
    <div className="qf-shell" data-lenis-prevent="">
      <header className="qf-header">
        <span className="qf-brand">
          <Image src="/orbit-icon.svg" alt="" width={30} height={30} unoptimized loading="eager" />
          <span>{leadsContact.brand}</span>
        </span>
      </header>

      {sent ? (
        <ThankYou sent={sent} />
      ) : (
        <div className="sf-main">
          <div className="sf-intro">
            <p className="qf-kicker">
              <span aria-hidden="true" />
              Free sample · 25 leads
            </p>
            <h1 className="sf-title">Get your free 25-lead sample</h1>
            <p className="sf-lede">
              Tell us who you help. We’ll build 25 businesses that fit, each with a verified email, a business phone number, the decision-maker’s name
              where public sources show it, and the public signals that point to a switch or renewal. We can’t see contract end dates, so those are yours
              to confirm. The sheet arrives by email within a few business days.
            </p>
            <p className="sf-required-note">
              Fields marked <span className="sf-req-inline" aria-hidden="true">*</span>
              <span className="qf-sr-only">with an asterisk</span> are required.
            </p>
          </div>

          <form ref={formRef} className="sf-form" onSubmit={handleSubmit} noValidate aria-busy={busy}>
            <Section num="01" title="About you">
              <TextField name="name" label="Your name" required value={form.name} error={errors.name} readOnly={busy} onChange={(v) => setText('name', v)} autoComplete="name" placeholder="First and last name" />
              <TextField name="company" label="Company" required value={form.company} error={errors.company} readOnly={busy} onChange={(v) => setText('company', v)} autoComplete="organization" placeholder="Your company" />
              <TextField
                name="email"
                label="Work email"
                required
                type="email"
                inputMode="email"
                value={form.email}
                error={emailError}
                readOnly={busy}
                onChange={(v) => setText('email', v)}
                onBlur={(v) => precheck(v)}
                autoComplete="email"
                placeholder="you@company.com"
                live
                after={
                  emailCheck.rejected && (
                    <>
                      <EmailSuggestion suggestion={emailCheck.suggestion} disabled={busy} onUse={applySuggestion} />
                      {/* The check can be wrong about a real address; don't leave that person stuck. */}
                      <p className="qf-email-help">
                        Sure it’s right? Email <a href={`mailto:${leadsContact.email}`}>{leadsContact.email}</a> and we’ll set up your sample from there.
                      </p>
                    </>
                  )
                }
              />
              <TextField name="phone" label="Phone" optional type="tel" inputMode="tel" value={form.phone} error={errors.phone} readOnly={busy} onChange={(v) => setText('phone', v)} autoComplete="tel" placeholder="609 555 0142" />
              <TextField name="role" label="Your role" optional value={form.role} readOnly={busy} onChange={(v) => setText('role', v)} autoComplete="organization-title" placeholder="e.g. Telecom advisor, partner" />
            </Section>

            <Section num="02" title="What you offer">
              <ChoiceGroup
                name="services"
                type="checkbox"
                legend="What do you help businesses with?"
                helper="Pick all that apply."
                required
                options={SERVICES}
                selected={form.services}
                error={errors.services}
                layout="two"
                onPick={(id) => toggle('services', id)}
              >
                {form.services.includes(OTHER) && (
                  <TextField name="servicesOther" label="What else?" required value={form.servicesOther} error={errors.servicesOther} readOnly={busy} onChange={(v) => setText('servicesOther', v)} placeholder="e.g. TV / streaming for waiting rooms" nested />
                )}
              </ChoiceGroup>
              <TextField
                name="providers"
                label="Providers your best prospects use now"
                optional
                full
                value={form.providers}
                readOnly={busy}
                onChange={(v) => setText('providers', v)}
                placeholder="e.g. Spectrum, Comcast Business, Verizon, RingCentral"
                helper="Businesses on these come first."
              />
            </Section>

            <Section num="03" title="Your ideal client">
              <TextField
                name="area"
                label="Area you cover"
                required
                full
                value={form.area}
                error={errors.area}
                readOnly={busy}
                onChange={(v) => setText('area', v)}
                placeholder="e.g. Mercer and Middlesex counties, NJ"
                helper="Towns, counties or states."
              />
              <fieldset className="sf-group sf-subgroup">
                <legend className="sf-legend">Ideal client size</legend>
                <div className="sf-grid sf-grid-tight">
                  <SelectField
                    name="employees"
                    label="Employees"
                    required
                    options={EMPLOYEES}
                    placeholder="Choose a size"
                    value={form.employees}
                    error={errors.employees}
                    onChange={(v) => setText('employees', v)}
                  />
                  <ChoiceGroup
                    name="locations"
                    type="radio"
                    legend="Locations"
                    required
                    options={LOCATIONS}
                    selected={[form.locations]}
                    error={errors.locations}
                    layout="row"
                    nested
                    onPick={(id) => setText('locations', id)}
                  />
                </div>
              </fieldset>
              <TextField
                name="minBill"
                label="Smallest monthly telecom bill worth your time"
                optional
                full
                value={form.minBill}
                readOnly={busy}
                onChange={(v) => setText('minBill', v)}
                helper="Your client’s monthly telecom spend."
              />
              <TextField name="industriesBest" label="Industries that close best" optional value={form.industriesBest} readOnly={busy} onChange={(v) => setText('industriesBest', v)} placeholder="e.g. auto repair shops, property managers" />
              <TextField name="industriesAvoid" label="Industries to avoid" optional value={form.industriesAvoid} readOnly={busy} onChange={(v) => setText('industriesAvoid', v)} placeholder="e.g. restaurants, home-based" />
              <ChoiceGroup
                name="decider"
                type="radio"
                legend="Who usually decides at your clients?"
                required
                options={DECIDERS}
                selected={[form.decider]}
                error={errors.decider}
                layout="two"
                onPick={(id) => setText('decider', id)}
              >
                {form.decider === OTHER && (
                  <TextField name="deciderOther" label="Which role?" optional value={form.deciderOther} readOnly={busy} onChange={(v) => setText('deciderOther', v)} placeholder="e.g. operations manager" nested />
                )}
              </ChoiceGroup>
            </Section>

            <Section num="04" title="Ready-to-switch signals">
              <ChoiceGroup
                name="signals"
                type="checkbox"
                legend="Signals that a business is ready to switch"
                helper="Pick all that apply."
                options={SIGNALS}
                selected={form.signals}
                layout="two"
                onPick={(id) => toggle('signals', id)}
              >
                {form.signals.includes(OTHER) && (
                  <TextField name="signalsOther" label="Which other signal?" optional value={form.signalsOther} readOnly={busy} onChange={(v) => setText('signalsOther', v)} placeholder="e.g. a new office lease" nested />
                )}
              </ChoiceGroup>
              <TextField
                name="exclude"
                label="Current clients to leave out"
                optional
                full
                rows={4}
                value={form.exclude}
                readOnly={busy}
                onChange={(v) => setText('exclude', v)}
                placeholder={'northlineroofing.com\nRiver Road Logistics'}
                helper="Company names or domains, one per line. Only used to exclude them from your sample."
              />
            </Section>

            <Section num="05" title="Delivery">
              <ChoiceGroup
                name="format"
                type="radio"
                legend="Delivery format"
                required
                options={FORMATS}
                selected={[form.format]}
                error={errors.format}
                layout="row"
                onPick={(id) => setText('format', id)}
              />
              <TextField name="columns" label="Columns you need" optional full value={form.columns} readOnly={busy} onChange={(v) => setText('columns', v)} placeholder="e.g. address, website, number of locations" />
              <SelectField
                name="capacity"
                label="New conversations you can handle per month"
                optional
                options={CAPACITY}
                placeholder="Choose a range"
                value={form.capacity}
                onChange={(v) => setText('capacity', v)}
                full
              />
              <ChoiceGroup
                name="outreach"
                type="radio"
                legend="Who will reach out to the leads?"
                optional
                options={OUTREACH}
                selected={[form.outreach]}
                layout="row"
                onPick={(id) => setText('outreach', id)}
              >
                <p className="sf-note">
                  <Check size={15} />
                  We check numbers against the Do Not Call list before delivery.
                </p>
              </ChoiceGroup>
            </Section>

            <Section num="06" title="What a win looks like">
              <TextField
                name="channels"
                label="Where new clients come from today, and what it costs you"
                optional
                full
                rows={3}
                value={form.channels}
                readOnly={busy}
                onChange={(v) => setText('channels', v)}
                placeholder="e.g. carrier referrals and BNI, plus a paid list vendor"
              />
              <TextField
                name="clientValue"
                label="What a new client is typically worth to you per year"
                optional
                full
                value={form.clientValue}
                readOnly={busy}
                onChange={(v) => setText('clientValue', v)}
                placeholder="e.g. yearly residuals per client"
              />
              <ChoiceGroup
                name="win"
                type="radio"
                legend="What would make the 25 a win?"
                required
                options={WINS}
                selected={[form.win]}
                error={errors.win}
                layout="two"
                onPick={(id) => setText('win', id)}
              >
                {form.win === OTHER && (
                  <TextField name="winOther" label="What would make it a win?" optional value={form.winOther} readOnly={busy} onChange={(v) => setText('winOther', v)} placeholder="e.g. three new site surveys" nested />
                )}
              </ChoiceGroup>
              <TextField
                name="ongoing"
                label="Who decides on an ongoing list, and how soon could you start?"
                optional
                full
                value={form.ongoing}
                readOnly={busy}
                onChange={(v) => setText('ongoing', v)}
                placeholder="e.g. me and my partner, within a month"
              />
              <TextField name="notes" label="Anything else" optional full rows={3} value={form.notes} readOnly={busy} onChange={(v) => setText('notes', v)} />
            </Section>

            <div className="qf-honey" aria-hidden="true">
              <label htmlFor="sf-honey">Leave this field empty</label>
              <input ref={honeyRef} id="sf-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="sf-submit">
              {/* Polite: focus is already moving to the first field that needs a fix. */}
              <div aria-live="polite">
                {attempted && errorCount > 0 && (
                  <p className="sf-summary">
                    {errorCount === 1 ? '1 field needs a fix' : `${errorCount} fields need a fix`} before we can build your sample. They’re marked above.
                  </p>
                )}
              </div>

              {submitError && (
                <div className="qf-submit-error" role="alert">
                  <p>{submitError}</p>
                  <p>
                    If it keeps failing, email <a href={`mailto:${leadsContact.email}`}>{leadsContact.email}</a> and we’ll take it from there.
                  </p>
                </div>
              )}

              <div className="qf-actions">
                <button type="submit" className="qf-primary" disabled={busy}>
                  {busy ? <LoaderCircle className="qf-spin" size={18} /> : <Send size={17} />}
                  {emailCheck.checking ? 'Checking email…' : submitting ? 'Sending…' : submitError ? 'Try again' : 'Request my free sample'}
                </button>
              </div>
              <p className="sf-fine">Only used to build your sample and follow up about it.</p>
            </div>
          </form>
        </div>
      )}

      <footer className="sf-footer">
        <span>{leadsContact.brand}</span>
        <span aria-hidden="true">·</span>
        <a href={`mailto:${leadsContact.email}`}>{leadsContact.email}</a>
      </footer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Req() {
  return (
    <span className="sf-req" aria-hidden="true">
      *
    </span>
  )
}

function OptionalTag() {
  return <span className="qf-optional">Optional</span>
}

/** Names and titles: capitalise each word on touch keyboards. */
const WORD_CAPS: ReadonlySet<TextKey> = new Set(['name', 'company', 'role'])

function describedBy(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(' ') || undefined
}

function Section({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  const headingId = `sf-section-${num}`
  return (
    <section className="sf-section" aria-labelledby={headingId}>
      <div className="sf-section-head">
        <span className="sf-num" aria-hidden="true">
          {num}
        </span>
        <h2 id={headingId} className="sf-section-title">
          {title}
        </h2>
      </div>
      <div className="sf-grid">{children}</div>
    </section>
  )
}

function TextField({
  name,
  label,
  value,
  onChange,
  readOnly,
  required,
  optional,
  helper,
  error,
  full,
  nested,
  rows,
  type = 'text',
  inputMode,
  autoComplete = 'off',
  placeholder,
  onBlur,
  live,
  after,
}: {
  name: TextKey
  label: string
  value: string
  onChange: (value: string) => void
  readOnly: boolean
  required?: boolean
  optional?: boolean
  helper?: ReactNode
  error?: string
  /** Spans both grid columns. */
  full?: boolean
  /** The follow-up text box under an "Other" choice. */
  nested?: boolean
  /** Renders a textarea with this many rows. */
  rows?: number
  type?: 'text' | 'email' | 'tel'
  inputMode?: 'text' | 'email' | 'tel'
  autoComplete?: string
  placeholder?: string
  onBlur?: (value: string) => void
  /** Announce the error politely: the email check can answer after blur. */
  live?: boolean
  after?: ReactNode
}) {
  const id = `sf-${name}`
  const helpId = helper ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const isEmail = type === 'email'
  const common = {
    id,
    name,
    value,
    readOnly,
    required,
    placeholder,
    maxLength: TEXT_LIMITS[name],
    'aria-required': required || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(helpId, errorId),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
    onBlur: onBlur ? (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => onBlur(event.target.value) : undefined,
  }
  const className = ['qf-field', full && 'qf-field-full', nested && 'sf-nested'].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <label htmlFor={id}>
        <span>
          {label}
          {required && <Req />}
        </span>
        {optional && <OptionalTag />}
      </label>
      {rows ? (
        <textarea {...common} rows={rows} />
      ) : (
        <input
          {...common}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoCapitalize={isEmail ? 'off' : WORD_CAPS.has(name) ? 'words' : 'sentences'}
          spellCheck={isEmail ? false : undefined}
        />
      )}
      {helper && (
        <p className="sf-help" id={helpId}>
          {helper}
        </p>
      )}
      <div aria-live={live ? 'polite' : undefined}>
        {error && (
          <p className="qf-field-error" id={errorId}>
            {error}
          </p>
        )}
        {after}
      </div>
    </div>
  )
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function SelectField({
  name,
  label,
  options,
  placeholder,
  value,
  onChange,
  required,
  optional,
  error,
  full,
}: {
  name: TextKey
  label: string
  options: Option[]
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  optional?: boolean
  error?: string
  full?: boolean
}) {
  const id = `sf-${name}`
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={`qf-field${full ? ' qf-field-full' : ''}`}>
      <label htmlFor={id}>
        <span>
          {label}
          {required && <Req />}
        </span>
        {optional && <OptionalTag />}
      </label>
      <div className="sf-select">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>
      {error && (
        <p className="qf-field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

function ChoiceGroup({
  name,
  type,
  legend,
  options,
  selected,
  onPick,
  required,
  optional,
  helper,
  error,
  layout = 'stack',
  nested,
  children,
}: {
  name: ListKey | TextKey
  type: 'checkbox' | 'radio'
  legend: string
  options: Option[]
  selected: string[]
  onPick: (id: string) => void
  required?: boolean
  optional?: boolean
  helper?: string
  error?: string
  layout?: 'stack' | 'two' | 'row'
  /** Inside another group's grid: takes one column, not the full row. */
  nested?: boolean
  children?: ReactNode
}) {
  const id = `sf-${name}`
  const helpId = helper ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const radio = type === 'radio'
  return (
    <fieldset
      className={`sf-group${nested ? ' sf-group-nested' : ''}`}
      role={radio ? 'radiogroup' : undefined}
      aria-required={radio && required ? true : undefined}
      aria-invalid={radio && error ? true : undefined}
      aria-describedby={describedBy(helpId, errorId)}
      data-invalid={error ? 'true' : undefined}
    >
      <legend className="sf-legend">
        <span>
          {legend}
          {required && <Req />}
          {/* A checkbox group has no aria-required: say it in the legend. */}
          {required && !radio && <span className="qf-sr-only"> (required)</span>}
        </span>
        {optional && <OptionalTag />}
      </legend>
      {helper && (
        <p className="sf-help sf-help-top" id={helpId}>
          {helper}
        </p>
      )}
      <div className={`sf-choices sf-choices-${layout}`}>
        {options.map((option) => (
          <label key={option.id} className="sf-choice">
            <input type={type} name={name} value={option.id} checked={selected.includes(option.id)} onChange={() => onPick(option.id)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="qf-field-error" id={errorId}>
          {error}
        </p>
      )}
      {children}
    </fieldset>
  )
}

function ThankYou({ sent }: { sent: Sent }) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    focusSoon(titleRef.current)
  }, [])

  return (
    <div className="sf-main sf-done">
      <p className="qf-kicker">
        <span aria-hidden="true" />
        Request received
      </p>
      <h1 ref={titleRef} tabIndex={-1} className="qf-title-xl">
        Thanks{sent.first ? `, ${sent.first}` : ''}.
      </h1>
      <p className="qf-result-copy">
        We’ll email you at <strong className="sf-email">{sent.email}</strong> when your 25 leads are ready, within a few business days.
      </p>
      {sent.area && (
        <div className="qf-recap">
          <span>Your sample covers</span>
          <strong>{sent.area}</strong>
        </div>
      )}
      <p className="sf-fine sf-done-contact">
        Questions before then? Email <a href={`mailto:${leadsContact.email}`}>{leadsContact.email}</a>.
      </p>
    </div>
  )
}
