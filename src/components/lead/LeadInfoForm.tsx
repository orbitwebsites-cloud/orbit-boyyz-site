'use client'

// The /start form: a one-screen "tell us about your business" form we text to
// a lead (a window washer, a landscaper, any local service business). No call,
// no calendar. Answers go to the Orbit CRM (/api/crm-lead, source "start") and
// to the inbox through FormSubmit, the same two places /book saves to.

import Link from 'next/link'
import posthog from 'posthog-js'
import { useRef, useState, type FormEvent } from 'react'
import { looksLikeEmail, useEmailCheck } from '@/components/qualify/shared'
import { OrbitMark } from '@/components/ui/Logo'
import { BOOK_FORM_ENDPOINT } from '@/content/bookConfig'
import { site } from '@/content/siteInfo'
import { emailCheckLabel } from '@/lib/emailCheck'

type Text = 'business' | 'name' | 'trade' | 'area' | 'phone' | 'email' | 'notes'
type Answers = Record<Text, string> & { website: string; help: string[]; contact: string }

const EMPTY: Answers = { business: '', name: '', trade: '', area: '', phone: '', email: '', notes: '', website: '', help: [], contact: '' }

const WEBSITE = ['Yes', 'No', 'Yes, but it’s outdated']
const HELP = ['More calls and booked jobs', 'A new website', 'Google Maps and reviews', 'Running ads']
const CONTACT = ['Text', 'Call', 'Email']

const digits = (value: string) => value.replace(/\D/g, '')
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? ''

function problem(a: Answers): { field: Text; message: string } | null {
  if (!a.business.trim()) return { field: 'business', message: 'Add your business name.' }
  if (!a.name.trim()) return { field: 'name', message: 'Add your name.' }
  if (!a.trade.trim()) return { field: 'trade', message: 'Tell us what your business does.' }
  if (digits(a.phone).length < 10) return { field: 'phone', message: 'Add a phone number with area code.' }
  if (!looksLikeEmail(a.email.trim())) return { field: 'email', message: 'That email doesn’t look right. Check for typos.' }
  return null
}

const fieldClass =
  'mt-2 w-full border-b border-line-strong bg-transparent pb-2.5 text-[clamp(1.1rem,2vw,1.35rem)] font-medium tracking-[-0.02em] text-fg outline-none transition-colors placeholder:text-fg/25 focus:border-accent read-only:opacity-60'

function Chips({ label, options, value, onPick, multi }: { label: string; options: string[]; value: string | string[]; onPick: (option: string) => void; multi?: boolean }) {
  const on = (option: string) => (Array.isArray(value) ? value.includes(option) : value === option)
  return (
    <fieldset className="sm:col-span-2">
      <legend className="alabel text-muted">
        {label} {multi && <span className="text-dim">Pick any</span>}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role={multi ? 'checkbox' : 'radio'}
            aria-checked={on(option)}
            onClick={() => onPick(option)}
            className={`rounded-full border px-4 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              on(option) ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-fg hover:border-fg/60'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function LeadInfoForm() {
  const root = useRef<HTMLDivElement>(null)
  const honey = useRef<HTMLInputElement>(null)
  const [a, setA] = useState<Answers>(EMPTY)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const emailCheck = useEmailCheck(a.email)
  const locked = sending || emailCheck.checking

  const set = (key: Text, value: string) => {
    setError('')
    setA((prev) => ({ ...prev, [key]: value }))
  }
  const toggleHelp = (option: string) =>
    setA((prev) => ({ ...prev, help: prev.help.includes(option) ? prev.help.filter((h) => h !== option) : [...prev.help, option] }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (locked) return
    const bad = problem(a)
    if (bad) {
      setError(bad.message)
      root.current?.querySelector<HTMLElement>(`#start-${bad.field}`)?.focus()
      return
    }
    setSending(true)
    try {
      const check = await emailCheck.verify(a.email)
      if (!check) return // the rejection and any suggested fix show under the form

      // Bots fill the hidden field. Let them through to nothing.
      if (!honey.current?.value) {
        const email = a.email.trim()
        const help = a.help.join(', ')
        // ?src= on the link (which lead or campaign it was sent to) is kept with the lead.
        const src = (new URLSearchParams(window.location.search).get('src') || '').replace(/[^\w.-]/g, '').slice(0, 40)
        const summary = [a.trade.trim(), a.area.trim(), a.website && `Website: ${a.website}`, help && `Wants: ${help}`, a.contact && `Reach by: ${a.contact}`]
          .filter(Boolean)
          .join(' · ')
        const crmFields: Record<string, string> = {
          business: a.business.trim(),
          contact_name: a.name.trim(),
          phone: a.phone.trim(),
          email,
          category: a.trade.trim(),
          area: a.area.trim(),
          has_website: a.website,
          wants_help_with: help,
          preferred_contact: a.contact,
          notes_from_form: a.notes.trim(),
          email_check: emailCheckLabel(check),
          details: `Sent in through /start (no call booked). ${summary}`,
          ...(src ? { link_source: src } : {}),
        }
        const inbox: Record<string, string> = {
          _subject: `New lead info: ${a.business.trim()}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: email,
          business: a.business.trim(),
          name: a.name.trim(),
          'what they do': a.trade.trim(),
          area: a.area.trim() || '(left blank)',
          phone: a.phone.trim(),
          email,
          'has a website': a.website || '(left blank)',
          'wants help with': help || '(left blank)',
          'best way to reach': a.contact || '(left blank)',
          'anything else': a.notes.trim() || '(left blank)',
          email_check: emailCheckLabel(check),
          ...(src ? { 'link source': src } : {}),
        }
        const post = (url: string, body: unknown) =>
          fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
        const [crm, mail] = await Promise.allSettled([post('/api/crm-lead', { source: 'start', fields: crmFields }), post(BOOK_FORM_ENDPOINT, inbox)])
        const ok = (r: PromiseSettledResult<Response>) => r.status === 'fulfilled' && r.value.ok
        if (!ok(crm) && !ok(mail)) {
          setError('That didn’t go through. Your answers are still here. Check your connection and try again.')
          return
        }
        posthog.capture('lead_info_submitted', { has_website: a.website, wants: help, src })
      }
      setSent(true)
      window.scrollTo(0, 0)
    } finally {
      setSending(false)
    }
  }

  const name = firstName(a.name)

  return (
    <div ref={root} className="relative flex min-h-svh flex-col overflow-x-clip bg-bg text-fg">
      <header className="flex items-center justify-between gap-4 px-5 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight">
          <OrbitMark className="size-7" />
          {site.name}
        </Link>
        <a href={site.phoneHref} className="text-[14px] text-muted hover:text-fg">
          {site.phoneDisplay}
        </a>
      </header>
      <div aria-hidden="true" className="mx-5 h-px bg-line md:mx-10" />

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-12 md:px-10 md:pt-16">
        {sent ? (
          <div className="flex flex-col items-start">
            <p className="alabel text-accent">Got it</p>
            <h1 className="display mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05]">
              Thanks{name ? `, ${name}` : ''}. <span className="serif-accent text-accent">We’ll be in touch.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              We’ll look over your business and reach out{a.contact ? ` by ${a.contact.toLowerCase()}` : ''} from {site.phoneDisplay}. Nothing to book, nothing to pay.
            </p>
            <p className="mt-4 text-[15px] text-muted">
              Want to talk sooner? Call or text{' '}
              <a href={site.phoneHref} className="text-fg underline decoration-1 underline-offset-4">
                {site.phoneDisplay}
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col items-start">
            <p className="alabel text-accent">About a minute · no call to book</p>
            <h1 className="display mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05]">Tell us about your business.</h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted">
              Fill this out and we’ll take a look and get back to you. We won’t share your details.{' '}
              <Link href="/privacy" className="underline decoration-1 underline-offset-4 hover:text-fg">
                Privacy policy
              </Link>
            </p>

            <div className="mt-10 grid w-full gap-x-8 gap-y-8 sm:grid-cols-2">
              {(
                [
                  ['business', 'Business name', 'text', 'organization', ''],
                  ['name', 'Your name', 'text', 'name', ''],
                  ['trade', 'What does your business do?', 'text', 'off', 'Window cleaning'],
                  ['area', 'Town or area you serve', 'text', 'address-level2', 'Optional'],
                  ['phone', 'Phone', 'tel', 'tel', ''],
                  ['email', 'Email', 'email', 'email', ''],
                ] as const
              ).map(([key, label, type, autoComplete, placeholder]) => (
                <label key={key} className="block">
                  <span className="alabel text-muted">{label}</span>
                  <input
                    id={`start-${key}`}
                    type={type}
                    autoComplete={autoComplete}
                    value={a[key]}
                    placeholder={placeholder}
                    onChange={(e) => set(key, e.target.value)}
                    onBlur={key === 'email' ? (e) => emailCheck.precheck(e.target.value) : undefined}
                    readOnly={locked}
                    maxLength={120}
                    aria-invalid={key === 'email' && emailCheck.rejected ? true : undefined}
                    className={fieldClass}
                  />
                </label>
              ))}

              <Chips label="Do you have a website?" options={WEBSITE} value={a.website} onPick={(o) => setA((p) => ({ ...p, website: p.website === o ? '' : o }))} />
              <Chips label="What do you want help with?" options={HELP} value={a.help} onPick={toggleHelp} multi />
              <Chips label="Best way to reach you?" options={CONTACT} value={a.contact} onPick={(o) => setA((p) => ({ ...p, contact: p.contact === o ? '' : o }))} />

              <label className="block sm:col-span-2">
                <span className="alabel text-muted">
                  Anything else we should know? <span className="text-dim">Optional</span>
                </span>
                <textarea
                  id="start-notes"
                  rows={2}
                  value={a.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  readOnly={locked}
                  maxLength={600}
                  className={`${fieldClass} resize-none`}
                />
              </label>
            </div>
            {/* Hidden from people; bots that fill it are dropped. */}
            <input ref={honey} name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] size-px opacity-0" />

            <div role="alert" className="mt-6 text-[15px] text-accent-hi empty:hidden">
              {error ||
                (emailCheck.rejected && (
                  <>
                    That email doesn’t look deliverable. Check it for typos, or use another address.
                    {emailCheck.suggestion && (
                      <button type="button" disabled={locked} onClick={() => set('email', emailCheck.suggestion)} className="ml-2 underline decoration-1 underline-offset-4">
                        Did you mean {emailCheck.suggestion}?
                      </button>
                    )}
                  </>
                ))}
            </div>

            <button type="submit" disabled={locked} className="abtn abtn-accent mt-8 h-14 px-8 disabled:opacity-60">
              {locked ? 'Sending…' : 'Send my info'}
              <span aria-hidden="true" className="abtn-arrow">
                →
              </span>
            </button>
          </form>
        )}
      </div>

      <footer className="px-6 pb-6 text-center text-[13px] text-dim md:px-10">
        {site.name} · {site.location} ·{' '}
        <a href={site.phoneHref} className="text-muted underline decoration-1 underline-offset-4">
          Call or text {site.phoneDisplay}
        </a>
      </footer>
    </div>
  )
}
