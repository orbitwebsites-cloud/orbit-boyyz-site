'use client'

// The /intake flow: the questions we ask before a first call, one per screen.
// Answers are saved to the Orbit CRM through /api/crm-lead (source "intake").
// A draft is kept in sessionStorage so a refresh never loses what was typed.

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { OrbitMark } from '@/components/ui/Logo'
import { site } from '@/content/siteInfo'
import { gsap, useGSAP } from '@/lib/agencyMotion'
import { MQ } from '@/lib/motion/tokens'

type Kind = 'yesno' | 'text' | 'long' | 'email' | 'tel' | 'choice'
type Question = { key: string; label: string; kind: Kind; options?: string[]; required?: boolean; hint?: string; placeholder?: string }

// Four short parts, so 19 questions never read as one long list.
const PARTS: Array<{ title: string; questions: Question[] }> = [
  {
    title: 'About you',
    questions: [
      { key: 'is_owner', label: 'Are you a business owner or the person who makes the decisions?', kind: 'yesno', required: true },
      { key: 'name', label: 'What’s your name?', kind: 'text', required: true, placeholder: 'First and last' },
      { key: 'company', label: 'What’s the name of your company?', kind: 'text', required: true },
      { key: 'email', label: 'What’s your work email?', kind: 'email', required: true, placeholder: 'you@company.com' },
      { key: 'phone', label: 'What’s the best phone number to reach you?', kind: 'tel', placeholder: '(609) 555-0100' },
      { key: 'website', label: 'What’s your website?', kind: 'text', placeholder: 'yourcompany.com' },
      { key: 'role', label: 'What’s your role?', kind: 'choice', options: ['Owner / founder', 'Partner', 'Sales lead', 'Marketing lead', 'Other'], required: true },
      { key: 'team_size', label: 'How many people work at your company?', kind: 'choice', options: ['Just me', '2–5', '6–10', '11–25', '25+'], required: true },
    ],
  },
  {
    title: 'Your business',
    questions: [
      { key: 'what_you_sell', label: 'What exactly do you sell, and to whom?', kind: 'long', hint: 'Describe the service in your own words.', required: true },
      { key: 'icp', label: 'Who is your ideal client?', kind: 'long', hint: 'Think industry, company size, and where they are.', required: true },
      { key: 'deal_size', label: 'What does one typical job or deal bring in?', kind: 'choice', options: ['Under $1,000', '$1,000–5,000', '$5,000–20,000', '$20,000+', 'Not sure'] },
    ],
  },
  {
    title: 'Getting clients',
    questions: [
      { key: 'how_you_get_clients', label: 'How do you get new clients today?', kind: 'long', hint: 'Referrals, ads, cold outreach, events, search, other.' },
      { key: 'clients_per_month', label: 'How many new clients and contacts per month do you want?', kind: 'text', hint: 'For example: 10 clients and 1,000 contacts a month.' },
      { key: 'tried', label: 'What have you already tried to get leads, and what happened?', kind: 'long' },
      { key: 'bottleneck', label: 'What’s the biggest thing slowing your growth right now?', kind: 'long', required: true },
      { key: 'tools', label: 'Which tools do you use?', kind: 'long', hint: 'CRM, outreach, lead data, scheduling, other.' },
    ],
  },
  {
    title: 'Timing',
    questions: [
      { key: 'area', label: 'Which cities, states or regions do you serve?', kind: 'text' },
      { key: 'timing', label: 'When would you want to start?', kind: 'choice', options: ['This month', 'Next month', 'Within 3 months', 'Just exploring'] },
      { key: 'notes', label: 'Anything else we should know before the call?', kind: 'long' },
    ],
  },
]

const QUESTIONS = PARTS.flatMap((part, partIndex) => part.questions.map((q) => ({ ...q, partIndex })))
const TOTAL = QUESTIONS.length
const REVIEW = TOTAL
const STORAGE_KEY = 'orbit-intake-v1'
const LETTERS = 'ABCDEFGH'

const optionsFor = (q: Question) => (q.kind === 'yesno' ? ['Yes', 'No'] : (q.options ?? []))
const isPick = (q: Question) => q.kind === 'yesno' || q.kind === 'choice'

function problemWith(q: Question, value: string) {
  if (q.required && !value.trim()) return isPick(q) ? 'Pick one to continue.' : 'This one is needed to continue.'
  if (q.kind === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return 'That email doesn’t look right. Check for typos.'
  return ''
}

const fieldClass =
  'w-full border-b border-line-strong bg-transparent pb-3 text-[clamp(1.25rem,2.6vw,1.9rem)] font-medium tracking-[-0.02em] text-fg outline-none transition-colors placeholder:text-fg/20 focus:border-accent'

export function Intake() {
  const root = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  // True while fixing one answer from the review screen: Continue goes back there.
  const [editing, setEditing] = useState(false)
  const direction = useRef(1)
  const leaving = useRef(false)
  const loaded = useRef(false)

  // Restore a draft, then keep it saved.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
      /* eslint-disable react-hooks/set-state-in-effect -- hydrate from sessionStorage once on mount (same as Book.tsx) */
      if (saved && typeof saved === 'object') {
        if (saved.answers && typeof saved.answers === 'object') setAnswers(saved.answers)
        if (Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= REVIEW) setStep(saved.step)
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {}
    loaded.current = true
  }, [])
  useEffect(() => {
    if (!loaded.current || sent) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }))
    } catch {}
  }, [step, answers, sent])

  const question = step < TOTAL ? QUESTIONS[step] : null
  const value = question ? answers[question.key] || '' : ''
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

  // Each screen rises in and its field takes focus.
  useGSAP(
    () => {
      const field = root.current?.querySelector<HTMLElement>('[data-autofocus]')
      window.scrollTo(0, 0)
      if (!motionOk()) return field?.focus({ preventScroll: true })
      gsap.fromTo(
        '[data-screen] > *',
        { opacity: 0, y: 40 * direction.current },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', onStart: () => field?.focus({ preventScroll: true }) },
      )
    },
    { scope: root, dependencies: [step, sent] },
  )

  function advance(current = value) {
    if (!question) return
    const problem = problemWith(question, current)
    if (problem) return setError(problem)
    if (editing) {
      setEditing(false)
      return goTo(REVIEW)
    }
    goTo(step + 1)
  }

  function pick(option: string) {
    if (!question) return
    setError('')
    setAnswers((a) => ({ ...a, [question.key]: option }))
    // A beat so the choice is seen before the screen changes.
    window.setTimeout(() => advance(option), 180)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (step === REVIEW) return void send()
    advance()
  }

  function onKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (!question) return
    const target = event.target as HTMLElement
    // Enter moves on from a long answer; Shift+Enter adds a line.
    if (target.tagName === 'TEXTAREA' && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      return advance()
    }
    // Letter keys pick an option when no text field is being typed in.
    if (isPick(question) && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const options = optionsFor(question)
      const index = question.kind === 'yesno' ? ['y', 'n'].indexOf(event.key.toLowerCase()) : LETTERS.toLowerCase().indexOf(event.key.toLowerCase())
      if (index >= 0 && index < options.length) {
        event.preventDefault()
        pick(options[index])
      }
    }
  }

  async function send() {
    if (sending) return
    const firstMissing = QUESTIONS.findIndex((q) => problemWith(q, answers[q.key] || ''))
    if (firstMissing >= 0) {
      setEditing(true)
      return goTo(firstMissing)
    }
    setError('')
    setSending(true)
    const fields: Record<string, string> = { ...answers, business: answers.company || '', contact_name: answers.name || '' }
    try {
      const res = await fetch('/api/crm-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'intake', fields }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) throw new Error('not saved')
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {}
      setSent(true)
    } catch {
      setError('That didn’t go through. Your answers are still here, so try again.')
    } finally {
      setSending(false)
    }
  }

  const progress = sent ? 1 : Math.min(step, TOTAL) / TOTAL
  const firstName = (answers.name || '').trim().split(/\s+/)[0]
  const part = question ? PARTS[question.partIndex] : null
  const status = sent ? 'Sent' : step === REVIEW ? 'Review' : `${step + 1} of ${TOTAL}`

  return (
    <div ref={root} className="relative flex min-h-svh flex-col overflow-x-clip bg-bg text-fg">
      {/* Progress: the orbit closes as the questions are answered. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none fixed left-1/2 top-1/2 size-[140vmax] -translate-x-1/2 -translate-y-1/2 -rotate-90 md:size-[120vmin]"
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

      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight">
          <OrbitMark className="size-7" />
          {site.name}
        </Link>
        <p className="alabel text-muted" aria-live="polite">
          {status}
        </p>
      </header>

      {/* A plain bar as well: the ring is easy to miss on a phone. */}
      <div aria-hidden="true" className="relative z-10 mx-5 h-px bg-line md:mx-10">
        <div className="h-px origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <main id="main" className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-16 pt-10 md:px-10">
        {sent ? (
          <div data-screen className="flex flex-col items-start">
            <p className="alabel text-accent">All set</p>
            <h1 className="display mt-4 text-[clamp(2.6rem,7.5vw,5.5rem)]">
              Thanks{firstName ? `, ${firstName}` : ''}. <span className="serif-accent text-accent">That’s everything.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
              We’ll read your answers before the call and reach out to confirm the time.
            </p>
            <p className="mt-8 text-[15px] text-muted">
              Something to add? Call or text{' '}
              <a href={site.phoneHref} className="text-fg underline decoration-1 underline-offset-4">
                {site.phoneDisplay}
              </a>
              .
            </p>
          </div>
        ) : step === REVIEW ? (
          <form onSubmit={onSubmit} data-screen className="flex flex-col items-start">
            <p className="alabel text-accent">Last step</p>
            <h1 className="display mt-4 text-[clamp(2.2rem,6vw,4.25rem)]">
              Check your answers, <span className="serif-accent text-accent">then send.</span>
            </h1>
            <div className="mt-10 w-full space-y-10">
              {PARTS.map((p, partIndex) => (
                <section key={p.title} aria-label={p.title}>
                  <h2 className="alabel text-muted">{p.title}</h2>
                  <dl className="mt-3">
                    {QUESTIONS.map((q, index) =>
                      q.partIndex !== partIndex ? null : (
                        <div key={q.key} className="flex items-start justify-between gap-6 border-t border-line py-3.5">
                          <div className="min-w-0">
                            <dt className="text-sm text-muted">{q.label}</dt>
                            <dd className={`mt-1 whitespace-pre-wrap break-words ${answers[q.key] ? 'text-fg' : 'text-dim'}`}>
                              {answers[q.key] || 'Left blank'}
                            </dd>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(true)
                              goTo(index)
                            }}
                            className="shrink-0 py-1 text-sm text-muted underline decoration-1 underline-offset-4 hover:text-fg"
                          >
                            Edit<span className="sr-only">: {q.label}</span>
                          </button>
                        </div>
                      ),
                    )}
                  </dl>
                </section>
              ))}
            </div>
            <div className="mt-10 flex w-full flex-wrap items-center gap-x-6 gap-y-4">
              <button type="submit" data-autofocus disabled={sending} className="abtn abtn-accent h-14 px-8 disabled:opacity-60">
                {sending ? 'Sending…' : 'Send my answers'}
              </button>
              <p role="alert" className="basis-full text-[15px] text-accent-hi empty:hidden">
                {error}
              </p>
              {error && (
                <p className="basis-full text-[15px] text-muted">
                  Still stuck? Call or text{' '}
                  <a href={site.phoneHref} className="text-fg underline decoration-1 underline-offset-4">
                    {site.phoneDisplay}
                  </a>{' '}
                  and we’ll take it from there.
                </p>
              )}
            </div>
          </form>
        ) : question && part ? (
          <form key={step} onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate data-screen className="flex flex-col items-start">
            <p className="alabel text-accent">
              {step === 0 ? `Before your call · ${TOTAL} short questions` : `Part ${question.partIndex + 1} of ${PARTS.length} · ${part.title}`}
            </p>
            <label htmlFor={isPick(question) ? undefined : question.key} id={`${question.key}-label`} className="display mt-4 block text-[clamp(1.8rem,4.4vw,3.2rem)] leading-[1.05]">
              {question.label}
              {!question.required && <span className="ml-3 align-middle font-sans text-sm font-normal tracking-normal text-dim">Optional</span>}
            </label>
            {question.hint && <p className="mt-3 text-[15px] text-muted">{question.hint}</p>}

            <div className="mt-9 w-full">
              {isPick(question) ? (
                <div role="radiogroup" aria-labelledby={`${question.key}-label`}>
                  {optionsFor(question).map((option, i) => {
                    const active = value === option
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        data-autofocus={i === 0 ? true : undefined}
                        onClick={() => pick(option)}
                        className={`group flex w-full items-center gap-4 border-t border-line py-4 text-left text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium tracking-[-0.02em] outline-none transition-[padding,color,box-shadow] duration-300 last:border-b hover:pl-2 focus-visible:pl-3 focus-visible:shadow-[inset_3px_0_0_var(--accent)] ${
                          active ? 'pl-2 text-accent' : 'text-fg'
                        }`}
                      >
                        <kbd
                          className={`grid size-7 shrink-0 place-items-center rounded-md border font-mono text-xs font-normal ${
                            active ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-muted'
                          }`}
                        >
                          {question.kind === 'yesno' ? option[0] : LETTERS[i]}
                        </kbd>
                        {option}
                      </button>
                    )
                  })}
                </div>
              ) : question.kind === 'long' ? (
                <textarea
                  id={question.key}
                  data-autofocus
                  rows={3}
                  value={value}
                  onChange={(e) => {
                    setError('')
                    setAnswers((a) => ({ ...a, [question.key]: e.target.value }))
                  }}
                  maxLength={2000}
                  enterKeyHint="next"
                  className={`${fieldClass} resize-none !text-[clamp(1.1rem,2vw,1.4rem)] leading-snug`}
                />
              ) : (
                <input
                  id={question.key}
                  data-autofocus
                  type={question.kind === 'email' ? 'email' : question.kind === 'tel' ? 'tel' : 'text'}
                  inputMode={question.key === 'website' ? 'url' : undefined}
                  autoComplete={
                    question.key === 'name' ? 'name' : question.key === 'company' ? 'organization' : question.kind === 'email' ? 'email' : question.kind === 'tel' ? 'tel' : question.key === 'website' ? 'url' : 'off'
                  }
                  value={value}
                  onChange={(e) => {
                    setError('')
                    setAnswers((a) => ({ ...a, [question.key]: e.target.value }))
                  }}
                  placeholder={question.placeholder}
                  maxLength={300}
                  enterKeyHint="next"
                  className={fieldClass}
                />
              )}
            </div>

            <div className="mt-9 flex w-full flex-wrap items-center gap-x-6 gap-y-4">
              {!isPick(question) && (
                <button type="submit" className="abtn abtn-accent">
                  {editing ? 'Save answer' : !question.required && !value.trim() ? 'Skip' : step === TOTAL - 1 ? 'Review answers' : 'Continue'}
                </button>
              )}
              {isPick(question) && !question.required && !editing && (
                <button type="submit" className="abtn border border-line-strong">
                  Skip
                </button>
              )}
              {step > 0 && !editing && (
                <button type="button" onClick={() => goTo(step - 1)} className="py-2 text-[15px] text-muted underline-offset-4 hover:text-fg hover:underline">
                  Back
                </button>
              )}
              <span className="alabel hidden text-dim md:inline">
                {isPick(question)
                  ? question.kind === 'yesno'
                    ? 'Press Y or N'
                    : `Press ${LETTERS[0]} to ${LETTERS[optionsFor(question).length - 1]}`
                  : question.kind === 'long'
                    ? 'Enter to continue · Shift + Enter for a new line'
                    : 'Press Enter'}
              </span>
              <p role="alert" className="basis-full text-[15px] text-accent-hi empty:hidden">
                {error}
              </p>
            </div>
          </form>
        ) : null}
      </main>

      <footer className="relative z-10 px-6 pb-6 text-center text-[13px] text-dim md:px-10">
        Rather talk it through?{' '}
        <a href={site.phoneHref} className="text-muted underline decoration-1 underline-offset-4">
          Call {site.phoneDisplay}
        </a>
      </footer>
    </div>
  )
}
