'use client'

// /book: the short flow every "Book a free call" button leads to. Three quick
// marketing questions (the first two are yes/no), contact details, then the
// calendar. The answers are saved to the Orbit CRM and emailed to the inbox
// before the calendar loads, and they also travel with the Calendly booking,
// so a failed save never stops someone from booking.
// Copy, questions and their rules: src/content/bookFlow.ts.

import Link from 'next/link'
import posthog from 'posthog-js'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { buildCalendlyUrl } from '@/components/qualify/calendly'
import { looksLikeEmail, useEmailCheck } from '@/components/qualify/shared'
import { OrbitMark } from '@/components/ui/Logo'
import { BOOK_CALENDLY_URL, BOOK_FORM_ENDPOINT } from '@/content/bookConfig'
import { BOOK_FLOW_STORAGE_KEY, BOOK_QUESTIONS, bookIntro, bookNextSteps, type BookAnswerKey } from '@/content/bookFlow'
import { site } from '@/content/siteInfo'
import { gsap, useGSAP } from '@/lib/agencyMotion'
import { emailCheckLabel } from '@/lib/emailCheck'
import { MQ } from '@/lib/motion/tokens'
import { BookTrust } from './BookTrust'

type Answers = Record<BookAnswerKey, string> & { name: string; business: string; phone: string; email: string; notes: string }

const EMPTY: Answers = { owner: '', spending: '', need: '', name: '', business: '', phone: '', email: '', notes: '' }
const CONTACT = BOOK_QUESTIONS.length
const SCHEDULE = CONTACT + 1
const LETTERS = 'ABCDEF'

const digits = (value: string) => value.replace(/\D/g, '')
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? ''
const isYesNo = (options: string[]) => options.length === 2 && options[0] === 'Yes' && options[1] === 'No'

function contactProblem(a: Answers): { field: 'name' | 'business' | 'phone' | 'email'; message: string } | null {
  if (!a.name.trim()) return { field: 'name', message: 'Add your name.' }
  if (!a.business.trim()) return { field: 'business', message: 'Add your business name.' }
  if (digits(a.phone).length < 10) return { field: 'phone', message: 'Add a phone number with area code.' }
  if (!looksLikeEmail(a.email.trim())) return { field: 'email', message: 'That email doesn’t look right. Check for typos.' }
  return null
}

/** One line that carries the answers into the Calendly booking. */
function summary(a: Answers) {
  return [`${a.business.trim()}`, `wants: ${a.need}`, `decides: ${a.owner}`, `spending now: ${a.spending}`, a.phone.trim(), a.notes.trim()].filter(Boolean).join(' · ')
}

function calendarUrl(a: Answers) {
  const base = buildCalendlyUrl(BOOK_CALENDLY_URL, { name: a.name, email: a.email, a1: summary(a) })
  if (!base) return ''
  const url = new URL(base)
  url.searchParams.set('embed_type', 'Inline')
  url.searchParams.set('embed_domain', window.location.host)
  url.searchParams.set('hide_gdpr_banner', '1')
  return url.toString().replace(/\+/g, '%20')
}

const fieldClass =
  'w-full border-b border-line-strong bg-transparent pb-2.5 text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium tracking-[-0.02em] text-fg outline-none transition-colors placeholder:text-fg/25 focus:border-accent read-only:opacity-60'

export default function BookFlow() {
  const root = useRef<HTMLDivElement>(null)
  const honey = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [booked, setBooked] = useState(false)
  const direction = useRef(1)
  const leaving = useRef(false)
  const loaded = useRef(false)
  const emailCheck = useEmailCheck(answers.email)

  // Restore a draft, then keep it saved. The calendar screen is never restored:
  // a returning visitor lands on their contact details and continues from there.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(BOOK_FLOW_STORAGE_KEY) || 'null')
      /* eslint-disable react-hooks/set-state-in-effect -- hydrate from sessionStorage once on mount (same as Intake.tsx) */
      if (saved && typeof saved === 'object') {
        if (saved.answers && typeof saved.answers === 'object') setAnswers({ ...EMPTY, ...saved.answers })
        if (Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= CONTACT) setStep(saved.step)
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {}
    loaded.current = true
  }, [])
  useEffect(() => {
    if (!loaded.current) return
    try {
      sessionStorage.setItem(BOOK_FLOW_STORAGE_KEY, JSON.stringify({ step: Math.min(step, CONTACT), answers }))
    } catch {}
  }, [step, answers])

  // Calendly tells the page when a time has been booked.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return
      const data = event.data as { event?: unknown } | null
      if (data && data.event === 'calendly.event_scheduled') setBooked(true)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const question = step < CONTACT ? BOOK_QUESTIONS[step] : null
  const motionOk = () => window.matchMedia(MQ.motion).matches

  function goTo(next: number) {
    if (leaving.current) return
    direction.current = next > step ? 1 : -1
    setError('')
    if (!motionOk()) return setStep(next)
    leaving.current = true
    gsap.to('[data-screen] > *', {
      opacity: 0,
      y: -24 * direction.current,
      duration: 0.2,
      stagger: 0.025,
      ease: 'power2.in',
      onComplete: () => {
        leaving.current = false
        setStep(next)
      },
    })
  }

  // Each screen rises in and its first control takes focus.
  useGSAP(
    () => {
      const field = root.current?.querySelector<HTMLElement>('[data-autofocus]')
      if (step > 0) window.scrollTo(0, 0)
      if (!motionOk()) return field?.focus({ preventScroll: true })
      gsap.fromTo(
        '[data-screen] > *',
        { opacity: 0, y: 40 * direction.current },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', onStart: () => field?.focus({ preventScroll: true }) },
      )
    },
    { scope: root, dependencies: [step] },
  )

  function pick(option: string) {
    if (!question) return
    setAnswers((a) => ({ ...a, [question.key]: option }))
    // A beat so the choice is seen before the screen changes.
    window.setTimeout(() => goTo(step + 1), 180)
  }

  function onKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (!question || event.metaKey || event.ctrlKey || event.altKey) return
    const keys = isYesNo(question.options) ? 'yn' : LETTERS.toLowerCase()
    const index = keys.indexOf(event.key.toLowerCase())
    if (index >= 0 && index < question.options.length) {
      event.preventDefault()
      pick(question.options[index])
    }
  }

  const set = (key: keyof Answers, value: string) => {
    setError('')
    setAnswers((a) => ({ ...a, [key]: value }))
  }

  async function submitContact(event: FormEvent) {
    event.preventDefault()
    if (sending || emailCheck.checking) return
    const problem = contactProblem(answers)
    if (problem) {
      setError(problem.message)
      root.current?.querySelector<HTMLElement>(`#book-${problem.field}`)?.focus()
      return
    }
    setSending(true)
    try {
      const check = await emailCheck.verify(answers.email)
      if (!check) return // the rejection and any suggested fix show under the field

      // Bots fill the hidden field. Let them through to nothing.
      if (!honey.current?.value) {
        const email = answers.email.trim()
        const crmFields: Record<string, string> = {
          business: answers.business.trim(),
          contact_name: answers.name.trim(),
          phone: answers.phone.trim(),
          email,
          category: answers.need,
          decision_maker: answers.owner,
          spending_on_marketing_now: answers.spending,
          wants: answers.need,
          notes_from_form: answers.notes.trim(),
          email_check: emailCheckLabel(check),
          details: `Booked through /book. ${summary(answers)}`,
        }
        const inbox: Record<string, string> = {
          _subject: `Marketing call: ${answers.business.trim()}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: email,
          name: answers.name.trim(),
          business: answers.business.trim(),
          'decides on marketing': answers.owner,
          'spending on ads or outreach now': answers.spending,
          'needs more of': answers.need,
          phone: answers.phone.trim(),
          email,
          email_check: emailCheckLabel(check),
          'anything we should know': answers.notes.trim() || '(left blank)',
        }
        const post = (url: string, body: unknown) =>
          fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
        await Promise.allSettled([post('/api/crm-lead', { source: 'book', fields: crmFields }), post(BOOK_FORM_ENDPOINT, inbox)])
        posthog.capture('booking_intake_submitted', { need: answers.need, decision_maker: answers.owner, spending_now: answers.spending })
      }
      goTo(SCHEDULE)
    } finally {
      setSending(false)
    }
  }

  const total = SCHEDULE + 1
  const progress = step / SCHEDULE
  const name = firstName(answers.name)
  const locked = sending || emailCheck.checking
  const url = step === SCHEDULE ? calendarUrl(answers) : ''

  return (
    <div ref={root} className="relative flex min-h-svh flex-col overflow-x-clip bg-bg text-fg">
      {/* Progress: the orbit closes as the questions are answered. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute left-1/2 top-[50svh] size-[140vmax] -translate-x-1/2 -translate-y-1/2 -rotate-90 md:size-[120vmin]"
      >
        <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.12" />
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.2"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          className="transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        />
        <g className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `rotate(${progress * 360}deg)` }}>
          <circle cx="99" cy="50" r="0.7" fill="var(--accent)" />
        </g>
      </svg>

      <div className="relative z-10 flex min-h-svh flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight">
            <OrbitMark className="size-7" />
            {site.name}
          </Link>
          <div className="flex items-center gap-5">
            <a href={site.phoneHref} className="hidden text-[14px] text-muted hover:text-fg sm:block">
              {site.phoneDisplay}
            </a>
            <p className="alabel text-muted" aria-live="polite">
              {step === SCHEDULE ? 'Last step' : `${step + 1} of ${total}`}
            </p>
          </div>
        </header>
        <div aria-hidden="true" className="mx-5 h-px bg-line md:mx-10">
          <div className="h-px origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-14 pt-10 md:px-10">
          {question ? (
            <form key={step} onSubmit={(e) => e.preventDefault()} onKeyDown={onKeyDown} data-screen className="flex flex-col items-start">
              {step === 0 ? (
                <h1 className="alabel text-accent">
                  {bookIntro.label} · <span className="text-muted">{bookIntro.note}</span>
                </h1>
              ) : (
                <p className="alabel text-accent">
                  Question {step + 1} of {BOOK_QUESTIONS.length}
                </p>
              )}
              <p id={`book-${question.key}-label`} className="display mt-4 text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.05]">
                {question.label}
              </p>
              {question.hint && <p className="mt-3 text-[15px] text-muted">{question.hint}</p>}

              <div role="radiogroup" aria-labelledby={`book-${question.key}-label`} className="mt-9 w-full">
                {question.options.map((option, i) => {
                  const active = answers[question.key] === option
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      data-autofocus={i === 0 ? true : undefined}
                      onClick={() => pick(option)}
                      className={`group flex w-full items-center gap-4 border-t border-line py-4 text-left text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium tracking-[-0.02em] outline-none transition-[padding,color,box-shadow] duration-300 last:border-b hover:pl-2 focus-visible:pl-3 focus-visible:shadow-[inset_3px_0_0_var(--accent)] ${
                        active ? 'pl-2 text-accent' : 'text-fg'
                      }`}
                    >
                      <kbd
                        className={`grid size-7 shrink-0 place-items-center rounded-md border font-mono text-xs font-normal ${
                          active ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-muted'
                        }`}
                      >
                        {isYesNo(question.options) ? option[0] : LETTERS[i]}
                      </kbd>
                      {option}
                    </button>
                  )
                })}
              </div>

              {step === 0 ? (
                <>
                  <ul className="mt-9 flex flex-col gap-2 text-[15px] text-muted sm:flex-row sm:flex-wrap sm:gap-x-7">
                    {bookIntro.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a href="#about-the-call" className="mt-8 text-[15px] text-muted underline decoration-1 underline-offset-4 hover:text-fg">
                    What happens on the call, and how we get paid
                  </a>
                </>
              ) : (
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button type="button" onClick={() => goTo(step - 1)} className="py-2 text-[15px] text-muted underline-offset-4 hover:text-fg hover:underline">
                    Back
                  </button>
                  <span className="alabel hidden text-dim md:inline">
                    {isYesNo(question.options) ? 'Press Y or N' : `Press ${LETTERS[0]} to ${LETTERS[question.options.length - 1]}`}
                  </span>
                </div>
              )}
            </form>
          ) : step === CONTACT ? (
            <form onSubmit={submitContact} noValidate data-screen className="flex flex-col items-start">
              <p className="alabel text-accent">Last one</p>
              <h2 className="display mt-4 text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.05]">Who should we send the invite to?</h2>
              <p className="mt-3 text-[15px] text-muted">
                We use this to confirm your call and prepare for it.{' '}
                <Link href="/privacy" className="underline decoration-1 underline-offset-4 hover:text-fg">
                  Privacy policy
                </Link>
              </p>

              <div className="mt-9 grid w-full gap-x-8 gap-y-7 sm:grid-cols-2">
                {(
                  [
                    ['name', 'Your name', 'text', 'name'],
                    ['business', 'Business name', 'text', 'organization'],
                    ['phone', 'Phone', 'tel', 'tel'],
                    ['email', 'Email', 'email', 'email'],
                  ] as const
                ).map(([key, label, type, autoComplete], i) => (
                  <label key={key} className="block">
                    <span className="alabel text-muted">{label}</span>
                    <input
                      id={`book-${key}`}
                      data-autofocus={i === 0 ? true : undefined}
                      type={type}
                      autoComplete={autoComplete}
                      value={answers[key]}
                      onChange={(e) => set(key, e.target.value)}
                      onBlur={key === 'email' ? (e) => emailCheck.precheck(e.target.value) : undefined}
                      readOnly={locked}
                      maxLength={120}
                      aria-invalid={key === 'email' && emailCheck.rejected ? true : undefined}
                      className={`${fieldClass} mt-2`}
                    />
                  </label>
                ))}
                <label className="block sm:col-span-2">
                  <span className="alabel text-muted">
                    Anything we should know? <span className="text-dim">Optional</span>
                  </span>
                  <input
                    id="book-notes"
                    value={answers.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    readOnly={locked}
                    maxLength={400}
                    className={`${fieldClass} mt-2`}
                  />
                </label>
              </div>
              {/* Hidden from people; bots that fill it are dropped. */}
              <input ref={honey} name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] size-px opacity-0" />

              <div role="alert" className="mt-5 text-[15px] text-accent-hi empty:hidden">
                {error ||
                  (emailCheck.rejected && (
                    <>
                      That email doesn’t look deliverable. Check it for typos, or use another address.
                      {emailCheck.suggestion && (
                        <button type="button" disabled={locked} onClick={() => set('email', emailCheck.suggestion)} className="ml-2 underline decoration-1 underline-offset-4">
                          Did you mean {emailCheck.suggestion}?
                        </button>
                      )}
                      <span className="mt-1 block text-muted">
                        Sure it’s right? Call or text{' '}
                        <a href={site.phoneHref} className="text-fg underline decoration-1 underline-offset-4">
                          {site.phoneDisplay}
                        </a>{' '}
                        and we’ll book it with you.
                      </span>
                    </>
                  ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button type="submit" disabled={locked} className="abtn abtn-accent h-14 px-8 disabled:opacity-60">
                  {locked ? 'One moment…' : 'Pick a time'}
                  <span aria-hidden="true" className="abtn-arrow">
                    →
                  </span>
                </button>
                <button type="button" disabled={locked} onClick={() => goTo(step - 1)} className="py-2 text-[15px] text-muted underline-offset-4 hover:text-fg hover:underline">
                  Back
                </button>
              </div>
            </form>
          ) : (
            <div data-screen className="flex flex-col items-start">
              <p className="alabel text-accent">{booked ? 'Booked' : 'Got it. One step left'}</p>
              <h2 className="display mt-4 text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.05]">
                {booked ? (
                  <>
                    You’re booked{name ? `, ${name}` : ''}. <span className="serif-accent text-accent">Talk soon.</span>
                  </>
                ) : (
                  <>Pick a time{name ? `, ${name}` : ''}.</>
                )}
              </h2>
              <ol className="mt-5 flex flex-col gap-1.5 text-[15px] text-muted sm:flex-row sm:flex-wrap sm:gap-x-7">
                {bookNextSteps.map((line, i) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="alabel text-accent">{i + 1}</span>
                    {line}
                  </li>
                ))}
              </ol>
              {url ? (
                <div className="mt-7 w-full overflow-hidden rounded-3xl bg-white shadow-[0_0_0_1px_rgba(243,241,236,0.14)]">
                  <iframe title="Pick a time for your call" src={url} className="h-[min(700px,74svh)] w-full" />
                </div>
              ) : null}
              <p className="mt-5 text-[15px] text-muted">
                Calendar not showing?{' '}
                <a href={url || BOOK_CALENDLY_URL} target="_blank" rel="noreferrer" className="text-fg underline decoration-1 underline-offset-4">
                  Open it in a new tab
                </a>
                , or call or text{' '}
                <a href={site.phoneHref} className="text-fg underline decoration-1 underline-offset-4">
                  {site.phoneDisplay}
                </a>{' '}
                and we’ll book it with you.
              </p>
            </div>
          )}
        </div>

        <footer className="px-6 pb-6 text-center text-[13px] text-dim md:px-10">
          {site.name} · {site.location} ·{' '}
          <a href={site.phoneHref} className="text-muted underline decoration-1 underline-offset-4">
            Call or text {site.phoneDisplay}
          </a>
        </footer>
      </div>

      {step === 0 && (
        <BookTrust
          onStart={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            root.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true })
          }}
        />
      )}
    </div>
  )
}
