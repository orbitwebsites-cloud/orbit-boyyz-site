'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react'
import posthog from 'posthog-js'
import { BOOK_CALENDLY_URL, BOOK_FORM_ENDPOINT, BOOK_STORAGE_KEY } from '@/content/bookConfig'
import { INSIGHT_MS } from '@/content/qualifyConfig'
import { site } from '@/content/site'
import { emailCheckLabel } from '@/lib/emailCheck'
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  EmailSuggestion,
  KEY_LETTERS,
  LoaderCircle,
  StageScreen,
  firstName,
  focusSoon,
  isTypingTarget,
  keyToIndex,
  looksLikeEmail,
  scrollToTop,
  useEmailCheck,
  useIsPresent,
  useScreenStage,
} from '@/components/qualify/shared'
import { CalendlyInline, buildCalendlyUrl } from '@/components/qualify/calendly'

// /book: the short questionnaire every "Book a call" button on the site leads
// to. Local businesses answer five one-at-a-time questions plus their contact
// details; the answers go to the inbox (FormSubmit) and only then does the
// Calendly scheduler load. Same look, transitions and email check as /qualify.

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

type TextId = 'name' | 'business' | 'service' | 'city'
type WebsiteId = 'none' | 'yes' | 'outdated'

type Answers = Record<TextId, string> & { website: WebsiteId | ''; websiteUrl: string }

type TextQuestion = {
  kind: 'text'
  id: TextId
  title: (answers: Answers) => string
  helper: string
  placeholder: string
  autoComplete: string
  maxLength: number
  missing: string
}

type WebsiteQuestion = { kind: 'website' }

type Question = TextQuestion | WebsiteQuestion

const businessOr = (answers: Answers, fallback: string) => answers.business.trim() || fallback

const QUESTIONS: Question[] = [
  {
    kind: 'text',
    id: 'name',
    title: () => 'First, what’s your first name?',
    helper: 'So we know who we’re talking to.',
    placeholder: 'Alex',
    autoComplete: 'given-name',
    maxLength: 80,
    missing: 'Add your first name.',
  },
  {
    kind: 'text',
    id: 'business',
    title: (answers) => {
      const name = firstName(answers.name)
      return `Nice to meet you${name ? `, ${name}` : ''}. What’s your business called?`
    },
    helper: 'The name your customers know you by.',
    placeholder: 'e.g. Ridgeline Plumbing',
    autoComplete: 'organization',
    maxLength: 120,
    missing: 'Add your business name.',
  },
  {
    kind: 'text',
    id: 'service',
    title: (answers) => `What does ${businessOr(answers, 'your business')} do?`,
    helper: 'The main service you want more calls for.',
    placeholder: 'e.g. HVAC repair and installs',
    autoComplete: 'off',
    maxLength: 160,
    missing: 'Tell us what you do in a few words.',
  },
  {
    kind: 'text',
    id: 'city',
    title: () => 'Which town or city are you based in?',
    helper: 'Where most of your customers are.',
    placeholder: 'e.g. Princeton, NJ',
    autoComplete: 'address-level2',
    maxLength: 80,
    missing: 'Add your town or city.',
  },
  { kind: 'website' },
]

const WEBSITE_OPTIONS: Array<{ id: WebsiteId; label: string; field: string; insight: string }> = [
  { id: 'none', label: 'No website yet', field: 'No website', insight: 'No problem. We’ll plan it from scratch on the call.' },
  { id: 'yes', label: 'Yes, and it works', field: 'Yes', insight: 'Add the link if you like and we’ll look at it before the call.' },
  { id: 'outdated', label: 'Yes, but it’s outdated', field: 'Yes, but outdated', insight: 'Add the link if you like and we’ll look at it before the call.' },
]

const INTRO_STEP = -1
const CONTACT_STEP = QUESTIONS.length
const RESULT_STEP = QUESTIONS.length + 1

const URL_RE = /^(?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?(?:[/?#]\S*)?$/i

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

type Contact = { phone: string; email: string; notes: string }

type BookState = {
  step: number
  answers: Answers
  contact: Contact
  /** True once the answers reached the inbox; unlocks the scheduler screen. */
  sent: boolean
}

function emptyState(): BookState {
  return {
    step: INTRO_STEP,
    answers: { name: '', business: '', service: '', city: '', website: '', websiteUrl: '' },
    contact: { phone: '', email: '', notes: '' },
    sent: false,
  }
}

function isAnswered(question: Question, answers: Answers) {
  return question.kind === 'website' ? Boolean(answers.website) : Boolean(answers[question.id].trim())
}

/** Index of the first unanswered question, or -1 when all are answered. */
function firstUnanswered(answers: Answers) {
  return QUESTIONS.findIndex((question) => !isAnswered(question, answers))
}

function asText(value: unknown, max: number) {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

/** Rebuilds a saved draft defensively so a stale or tampered value can't break the page. */
function restoreState(raw: unknown): BookState {
  const base = emptyState()
  if (!raw || typeof raw !== 'object') return base
  const saved = raw as Partial<BookState>
  const answers = saved.answers as Partial<Answers> | undefined
  const contact = saved.contact as Partial<Contact> | undefined
  const website = WEBSITE_OPTIONS.some((option) => option.id === answers?.website) ? (answers?.website as WebsiteId) : ''

  const restored: BookState = {
    step: typeof saved.step === 'number' && Number.isInteger(saved.step) ? saved.step : INTRO_STEP,
    answers: {
      name: asText(answers?.name, 80),
      business: asText(answers?.business, 120),
      service: asText(answers?.service, 160),
      city: asText(answers?.city, 80),
      website,
      websiteUrl: asText(answers?.websiteUrl, 200),
    },
    contact: { phone: asText(contact?.phone, 30), email: asText(contact?.email, 160), notes: asText(contact?.notes, 2000) },
    sent: saved.sent === true,
  }

  let step = Math.min(Math.max(restored.step, INTRO_STEP), RESULT_STEP)
  const missing = firstUnanswered(restored.answers)
  if (step === RESULT_STEP && (!restored.sent || missing >= 0)) step = CONTACT_STEP
  // Never resume past a question that has no answer (stale or edited draft).
  if (step !== RESULT_STEP && missing >= 0 && step > missing) step = missing
  return { ...restored, step }
}

function readSaved(): BookState {
  try {
    const raw = window.sessionStorage.getItem(BOOK_STORAGE_KEY)
    return raw ? restoreState(JSON.parse(raw)) : emptyState()
  } catch {
    return emptyState()
  }
}

function writeSaved(state: BookState) {
  try {
    window.sessionStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode or blocked storage: the flow still works, it just won't survive a reload.
  }
}

// ---------------------------------------------------------------------------
// Validation and payload
// ---------------------------------------------------------------------------

/** US numbers only: 10 digits (or 11 with a leading 1), valid area code and exchange. */
function phoneError(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) return 'Add a number we can call or text.'
  let digits = trimmed.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  if (digits.length !== 10) return 'Use a 10-digit number, like 609 555 0142.'
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits) || /^(\d)\1{9}$/.test(digits)) return 'That number doesn’t look right. Check it for typos.'
  return ''
}

function websiteUrlError(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed || URL_RE.test(trimmed)) return ''
  return 'That link doesn’t look right. Try yourbusiness.com, or leave it blank.'
}

function websiteLabel(answers: Answers) {
  return WEBSITE_OPTIONS.find((option) => option.id === answers.website)?.field ?? 'not answered'
}

function buildPayload(state: BookState, honey: string, emailCheck: string) {
  const { answers, contact } = state
  const business = answers.business.trim()
  const city = answers.city.trim()
  const email = contact.email.trim()
  const fields: Record<string, string> = {
    _subject: `Website call: ${business} (${city})`,
    _template: 'table',
    _captcha: 'false',
    // Lets you hit Reply in the notification and land in their inbox.
    _replyto: email,
    name: answers.name.trim(),
    business,
    'what they do': answers.service.trim(),
    'city / town': city,
    'current website': websiteLabel(answers),
    'website link': answers.website !== 'none' && answers.websiteUrl.trim() ? answers.websiteUrl.trim() : '(none given)',
    phone: contact.phone.trim(),
    email,
    // ok, ok (<note>) or unverified (the check timed out or failed).
    email_check: emailCheck,
    'anything we should know': contact.notes.trim() || '(left blank)',
  }
  if (honey) fields._honey = honey
  return fields
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type View = {
  state: BookState
  pending: boolean
  submitting: boolean
  submitError: string
}

const viewStep = (view: View) => view.state.step

export default function Book() {
  const [state, setState] = useState<BookState>(emptyState)
  const [loaded, setLoaded] = useState(false)
  const [direction, setDirection] = useState(1)
  const [pending, setPending] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const advanceTimer = useRef<number | null>(null)
  const honeyRef = useRef<HTMLInputElement>(null)
  // Synchronous guard: a second Enter/click can arrive before the
  // re-render that disables the button.
  const submittingRef = useRef(false)

  // Restore the session draft after hydration, so the prerendered HTML and
  // the first client render stay identical.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate from sessionStorage once on mount */
    setState(readSaved())
    setLoaded(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    if (loaded) writeSaved(state)
  }, [loaded, state])

  useEffect(
    () => () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    },
    [],
  )

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    advanceTimer.current = null
    setPending(false)
  }, [])

  const goTo = useCallback(
    (step: number, dir: number) => {
      cancelAdvance()
      setDirection(dir)
      setState((current) => ({ ...current, step }))
      scrollToTop()
    },
    [cancelAdvance],
  )

  const next = useCallback(() => {
    cancelAdvance()
    setDirection(1)
    setState((current) => ({ ...current, step: Math.min(current.step + 1, CONTACT_STEP) }))
    scrollToTop()
  }, [cancelAdvance])

  const back = useCallback(() => {
    if (submittingRef.current) return
    cancelAdvance()
    setDirection(-1)
    setState((current) => ({ ...current, step: Math.max(current.step - 1, INTRO_STEP) }))
    scrollToTop()
  }, [cancelAdvance])

  const chooseWebsite = useCallback(
    (website: WebsiteId) => {
      cancelAdvance()
      setState((current) => ({ ...current, answers: { ...current.answers, website } }))
      // "No website" has nothing more to ask: show the insight, then move on.
      if (website === 'none') {
        setPending(true)
        advanceTimer.current = window.setTimeout(() => {
          advanceTimer.current = null
          next()
        }, INSIGHT_MS)
      }
    },
    [cancelAdvance, next],
  )

  const setAnswer = useCallback((id: TextId | 'websiteUrl', value: string) => {
    setState((current) => ({ ...current, answers: { ...current.answers, [id]: value } }))
  }, [])

  const setContact = useCallback((field: keyof Contact, value: string) => {
    setState((current) => ({ ...current, contact: { ...current.contact, [field]: value } }))
  }, [])

  async function submit(emailCheck: string) {
    if (submittingRef.current) return
    // Every question must be answered before anything is sent.
    const missing = firstUnanswered(state.answers)
    if (missing >= 0) {
      goTo(missing, -1)
      return
    }
    submittingRef.current = true
    setSubmitting(true)
    setSubmitError('')
    try {
      const response = await fetch(BOOK_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload(state, honeyRef.current?.value ?? '', emailCheck)),
      })
      const data: unknown = await response.json().catch(() => null)
      const rejected =
        data !== null && typeof data === 'object' && 'success' in data && String((data as { success: unknown }).success) === 'false'
      if (!response.ok || rejected) throw new Error('Submission rejected')
      posthog.capture('booking_intake_submitted', {
        website_status: state.answers.website,
      })
      setDirection(1)
      setState((current) => ({ ...current, sent: true, step: RESULT_STEP }))
      scrollToTop()
    } catch {
      setSubmitError('That didn’t go through. Your answers are still saved on this page, so check your connection and try again.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const view = useMemo<View>(() => ({ state, pending, submitting, submitError }), [state, pending, submitting, submitError])
  const { stageView, stage } = useScreenStage(view, viewStep, direction)

  function renderScreen({ state: screenState, pending: screenPending, submitting: screenSubmitting, submitError: screenError }: View) {
    const { step: screenStep, answers } = screenState
    const question = screenStep >= 0 && screenStep < QUESTIONS.length ? QUESTIONS[screenStep] : null

    if (screenStep === INTRO_STEP) {
      return <IntroScreen resuming={Boolean(answers.name.trim())} onStart={() => goTo(0, 1)} />
    }
    if (question?.kind === 'text') {
      return (
        <TextScreen
          question={question}
          index={screenStep}
          title={question.title(answers)}
          value={answers[question.id]}
          onChange={(value) => setAnswer(question.id, value)}
          onNext={next}
        />
      )
    }
    if (question?.kind === 'website') {
      return (
        <WebsiteScreen
          index={screenStep}
          title={`Does ${businessOr(answers, 'your business')} have a website right now?`}
          value={answers.website}
          url={answers.websiteUrl}
          pending={screenPending}
          onChoose={chooseWebsite}
          onUrlChange={(value) => setAnswer('websiteUrl', value)}
          onNext={next}
        />
      )
    }
    if (screenStep === CONTACT_STEP) {
      return (
        <ContactScreen
          name={firstName(answers.name)}
          contact={screenState.contact}
          submitting={screenSubmitting}
          submitError={screenError}
          honeyRef={honeyRef}
          onChange={setContact}
          onSubmit={submit}
        />
      )
    }
    if (screenStep === RESULT_STEP && screenState.sent) {
      return <ResultScreen answers={answers} contact={screenState.contact} />
    }
    return null
  }

  const { step } = state
  const inFlow = step >= 0 && step <= CONTACT_STEP
  const progress = step === RESULT_STEP ? 100 : inFlow ? Math.round(((step + 1) / (CONTACT_STEP + 2)) * 100) : 0

  return (
    // data-lenis-prevent: the site's Lenis smooth scroll leaves this page (and
    // its textarea) on native scrolling.
    <div className="qf-shell" data-lenis-prevent="">
      <div
        className="qf-progress"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        data-visible={step === INTRO_STEP ? 'false' : 'true'}
      >
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      <header className="qf-header">
        <Link href="/" className="qf-brand">
          <Image src="/orbit-icon.svg" alt="" width={30} height={30} unoptimized loading="eager" />
          <span>{site.name}</span>
        </Link>
        {inFlow && (
          <div className="qf-header-tools">
            <span className="qf-counter" aria-hidden="true">
              {step === CONTACT_STEP ? 'Last step' : `${step + 1} / ${QUESTIONS.length}`}
            </span>
            <button type="button" className="qf-back" onClick={back} disabled={submitting}>
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        )}
      </header>

      <div className={`qf-stage${step === RESULT_STEP ? ' qf-stage-wide' : ''}`}>
        <StageScreen stage={stage} screenKey={`step-${stageView.state.step}`}>
          {renderScreen(stageView)}
        </StageScreen>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

function IntroScreen({ resuming, onStart }: { resuming: boolean; onStart: () => void }) {
  const isPresent = useIsPresent()

  useEffect(() => {
    if (!isPresent) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.repeat || isTypingTarget(event.target)) return
      if (event.target instanceof HTMLElement && event.target.closest('button, a')) return
      event.preventDefault()
      onStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPresent, onStart])

  return (
    <div className="qf-intro">
      <p className="qf-kicker">
        <span aria-hidden="true" />
        Free website call
      </p>
      <h1>Let’s book your call</h1>
      <p className="qf-lede">{QUESTIONS.length} quick questions, about a minute. Then pick a time that works for you.</p>
      <ul className="qf-offer" aria-label="About the call">
        <li><Check size={15} /> 30 minutes, free, weekdays 5 PM ET or later</li>
        <li><Check size={15} /> You talk to the people who build your site, no sales handoff</li>
        <li><Check size={15} /> We build a live demo of your site before you pay</li>
      </ul>
      <div className="qf-actions">
        <button type="button" className="qf-primary" onClick={onStart}>
          {resuming ? 'Continue' : 'Start'}
          <ArrowRight size={18} />
        </button>
        <span className="qf-hint">press <kbd>Enter ↵</kbd></span>
      </div>
    </div>
  )
}

function QuestionMeta({ index }: { index: number }) {
  return (
    <p className="qf-meta">
      <span className="qf-meta-num" aria-hidden="true">{index + 1}</span>
      <ArrowRight size={14} />
      <span className="qf-sr-only">Question {index + 1} of {QUESTIONS.length}</span>
    </p>
  )
}

function TextScreen({
  question,
  index,
  title,
  value,
  onChange,
  onNext,
}: {
  question: TextQuestion
  index: number
  title: string
  value: string
  onChange: (value: string) => void
  onNext: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const inputId = `qf-input-${question.id}`

  useEffect(() => {
    focusSoon(inputRef.current)
  }, [])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!value.trim()) {
      setError(question.missing)
      inputRef.current?.focus()
      return
    }
    inputRef.current?.blur()
    onNext()
  }

  return (
    <form className="qf-question" onSubmit={handleSubmit} noValidate>
      <QuestionMeta index={index} />
      <h2 className="qf-title">
        <label htmlFor={inputId}>{title}</label>
      </h2>
      <p className="qf-helper" id={`${inputId}-help`}>{question.helper}</p>
      <input
        ref={inputRef}
        id={inputId}
        className="qf-text"
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          if (error) setError('')
        }}
        placeholder={question.placeholder}
        autoComplete={question.autoComplete}
        autoCapitalize="words"
        enterKeyHint="next"
        maxLength={question.maxLength}
        required
        aria-required="true"
        aria-invalid={error ? true : undefined}
        aria-describedby={`${inputId}-help${error ? ` ${inputId}-error` : ''}`}
      />
      {error && (
        <p className="qf-field-error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      )}
      <div className="qf-actions">
        <button type="submit" className="qf-primary">
          OK
          <Check size={18} />
        </button>
        <span className="qf-hint">press <kbd>Enter ↵</kbd></span>
      </div>
    </form>
  )
}

function WebsiteScreen({
  index,
  title,
  value,
  url,
  pending,
  onChoose,
  onUrlChange,
  onNext,
}: {
  index: number
  title: string
  value: WebsiteId | ''
  url: string
  pending: boolean
  onChoose: (id: WebsiteId) => void
  onUrlChange: (value: string) => void
  onNext: () => void
}) {
  const isPresent = useIsPresent()
  const formRef = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  // Set by a pick that should move focus into the link field once it renders.
  const focusUrlNext = useRef(false)
  const [urlError, setUrlError] = useState('')
  const titleId = 'qf-title-website'
  const selected = WEBSITE_OPTIONS.find((option) => option.id === value)
  const askUrl = value === 'yes' || value === 'outdated'
  const lastKey = KEY_LETTERS[WEBSITE_OPTIONS.length - 1]

  useEffect(() => {
    focusSoon(titleRef.current)
  }, [])

  const choose = useCallback(
    (id: WebsiteId) => {
      onChoose(id)
      setUrlError('')
      // Desktop: go straight to the optional link field. On touch screens a
      // popped-up keyboard would hide the OK button, so leave focus alone.
      const finePointer = typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
      focusUrlNext.current = id !== 'none' && finePointer
    },
    [onChoose],
  )

  useEffect(() => {
    if (!askUrl || !focusUrlNext.current) return
    focusUrlNext.current = false
    focusSoon(urlRef.current)
  }, [askUrl, value])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!value) return
    const error = askUrl ? websiteUrlError(url) : ''
    setUrlError(error)
    if (error) {
      urlRef.current?.focus()
      return
    }
    onNext()
  }

  useEffect(() => {
    if (!isPresent) return
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      const target = event.target instanceof HTMLElement ? event.target : null

      if (event.key === 'Enter') {
        const option = target?.closest<HTMLElement>('[data-option-id]')
        // Enter on the already-selected option confirms it; on any other
        // button it falls through to the button's own click.
        if (option && option.dataset.optionId === value) {
          event.preventDefault()
          formRef.current?.requestSubmit()
          return
        }
        if (target?.closest('button, a')) return
        if (value) {
          event.preventDefault()
          formRef.current?.requestSubmit()
        }
        return
      }

      const optionIndex = keyToIndex(event.key)
      if (optionIndex >= 0 && optionIndex < WEBSITE_OPTIONS.length) {
        event.preventDefault()
        choose(WEBSITE_OPTIONS[optionIndex].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPresent, value, choose])

  return (
    <form ref={formRef} className="qf-question" onSubmit={handleSubmit} noValidate>
      <QuestionMeta index={index} />
      <h2 id={titleId} ref={titleRef} tabIndex={-1} className="qf-title">
        {title}
      </h2>

      <div className="qf-options" role="group" aria-labelledby={titleId}>
        {WEBSITE_OPTIONS.map((option, optionIndex) => {
          const isSelected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              className="qf-option"
              data-option-id={option.id}
              data-selected={isSelected ? 'true' : 'false'}
              aria-pressed={isSelected}
              aria-keyshortcuts={`${KEY_LETTERS[optionIndex]} ${optionIndex + 1}`}
              onClick={() => choose(option.id)}
            >
              <kbd className="qf-key" aria-hidden="true">{KEY_LETTERS[optionIndex]}</kbd>
              <span className="qf-option-label">{option.label}</span>
              <Check className="qf-option-check" size={18} />
            </button>
          )
        })}
      </div>

      <div className="qf-insight-slot" aria-live="polite">
        {selected && (
          // key remounts the line on every new answer so its entrance replays.
          <p key={value} className="qf-insight">
            {selected.insight}
            {pending && <span className="qf-insight-timer" style={{ animationDuration: `${INSIGHT_MS}ms` }} aria-hidden="true" />}
          </p>
        )}
      </div>

      {askUrl && (
        <div className="qf-field qf-url">
          <label htmlFor="qf-website-url">
            Website link <span className="qf-optional">Optional</span>
          </label>
          <input
            ref={urlRef}
            id="qf-website-url"
            type="url"
            inputMode="url"
            value={url}
            onChange={(event) => {
              onUrlChange(event.target.value)
              if (urlError) setUrlError('')
            }}
            placeholder="yourbusiness.com"
            autoComplete="url"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="next"
            maxLength={200}
            aria-invalid={urlError ? true : undefined}
            aria-describedby={urlError ? 'qf-website-url-error' : undefined}
          />
          {urlError && (
            <p className="qf-field-error" id="qf-website-url-error" role="alert">
              {urlError}
            </p>
          )}
        </div>
      )}

      <div className="qf-actions">
        <button type="submit" className="qf-primary" disabled={!value}>
          OK
          <Check size={18} />
        </button>
        <span className="qf-hint">
          press <kbd>A</kbd>–<kbd>{lastKey}</kbd> to pick, <kbd>Enter ↵</kbd> to continue
        </span>
      </div>
    </form>
  )
}

type ContactErrors = Partial<Record<'phone' | 'email', string>>

// Shown when /api/verify-email rejects the address (typo domain, no mail
// server, disposable inbox, impossible Gmail name...).
const EMAIL_UNDELIVERABLE = 'That email doesn’t look deliverable. Check it for typos, or use another address.'

function validateContact(contact: Contact): ContactErrors {
  const errors: ContactErrors = {}
  const phone = phoneError(contact.phone)
  if (phone) errors.phone = phone
  if (!contact.email.trim()) errors.email = 'Add your email so we can send the invite.'
  else if (!looksLikeEmail(contact.email)) errors.email = 'That email doesn’t look right. Check for typos.'
  return errors
}

function ContactScreen({
  name,
  contact,
  submitting,
  submitError,
  honeyRef,
  onChange,
  onSubmit,
}: {
  name: string
  contact: Contact
  submitting: boolean
  submitError: string
  honeyRef: RefObject<HTMLInputElement | null>
  onChange: (field: keyof Contact, value: string) => void
  /** Called once the email passed the deliverability check (or the check couldn't run). */
  onSubmit: (emailCheck: string) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<ContactErrors>({})
  const emailCheck = useEmailCheck(contact.email)
  const { precheck, verify } = emailCheck
  const checkingRef = useRef(false)
  const busy = submitting || emailCheck.checking
  // A restored address is checked as soon as the step opens.
  const [emailOnOpen] = useState(contact.email)

  useEffect(() => {
    precheck(emailOnOpen)
  }, [precheck, emailOnOpen])

  // Focus the first empty field once, when the step opens.
  const [focusOnOpen] = useState(() => (['phone', 'email'] as const).find((field) => !contact[field].trim()) ?? 'notes')
  useEffect(() => {
    focusSoon(formRef.current?.querySelector<HTMLElement>(`#qf-${focusOnOpen}`) ?? null)
  }, [focusOnOpen])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (checkingRef.current || submitting) return
    const nextErrors = validateContact(contact)
    setErrors(nextErrors)
    const firstInvalid = (['phone', 'email'] as const).find((field) => nextErrors[field])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#qf-${firstInvalid}`)?.focus()
      return
    }
    // Nothing is sent until the address passes (fails open if the check can't run).
    checkingRef.current = true
    const result = await verify(contact.email)
    checkingRef.current = false
    if (!result) {
      formRef.current?.querySelector<HTMLElement>('#qf-email')?.focus()
      return
    }
    onSubmit(emailCheckLabel(result))
  }

  function applySuggestion(email: string) {
    if (busy) return
    onChange('email', email)
    setErrors((current) => ({ ...current, email: undefined }))
    precheck(email)
    formRef.current?.querySelector<HTMLElement>('#qf-email')?.focus()
  }

  function handleNotesKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.altKey || event.nativeEvent.isComposing) return
    // Typeform-style: Enter sends, Shift+Enter adds a line. On touch
    // keyboards (no Shift habit) Enter stays a line break; the button sends.
    const finePointer = typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (event.metaKey || event.ctrlKey || finePointer) {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  const phoneErr = errors.phone
  const emailErr = errors.email || (emailCheck.rejected ? EMAIL_UNDELIVERABLE : '')

  return (
    <form ref={formRef} className="qf-question qf-contact" onSubmit={handleSubmit} noValidate aria-busy={busy}>
      <p className="qf-meta">
        <span className="qf-meta-num">
          <Check size={14} />
        </span>
        <span>Last step</span>
      </p>
      <h2 className="qf-title">Where can we reach you{name ? `, ${name}` : ''}?</h2>
      <p className="qf-helper">Only used for your call. Next, you pick a time.</p>

      <div className="qf-fields">
        <div className="qf-field">
          <label htmlFor="qf-phone">Best phone</label>
          <input
            id="qf-phone"
            type="tel"
            inputMode="tel"
            value={contact.phone}
            onChange={(event) => {
              onChange('phone', event.target.value)
              if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }))
            }}
            placeholder="609 555 0142"
            autoComplete="tel"
            maxLength={30}
            readOnly={busy}
            required
            aria-required="true"
            aria-invalid={phoneErr ? true : undefined}
            aria-describedby={phoneErr ? 'qf-phone-error' : undefined}
          />
          {phoneErr && (
            <p className="qf-field-error" id="qf-phone-error">
              {phoneErr}
            </p>
          )}
        </div>

        <div className="qf-field">
          <label htmlFor="qf-email">Email</label>
          <input
            id="qf-email"
            type="email"
            inputMode="email"
            value={contact.email}
            onChange={(event) => {
              onChange('email', event.target.value)
              if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
            }}
            onBlur={(event) => precheck(event.target.value)}
            placeholder="you@yourbusiness.com"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={160}
            // Frozen while the address is checked and sent: an edit made then
            // would skip the check and go to Calendly as typed.
            readOnly={busy}
            required
            aria-required="true"
            aria-invalid={emailErr ? true : undefined}
            aria-describedby={emailErr ? 'qf-email-error' : undefined}
          />
          {/* aria-live: the deliverability error can arrive after blur. */}
          <div aria-live="polite">
            {emailErr && (
              <p className="qf-field-error" id="qf-email-error">
                {emailErr}
              </p>
            )}
            {emailCheck.rejected && (
              <>
                <EmailSuggestion suggestion={emailCheck.suggestion} disabled={busy} onUse={applySuggestion} />
                {/* The check can be wrong about a real address; don't leave that person stuck. */}
                <p className="qf-email-help">
                  Sure it’s right? Call or text <a href={site.phoneHref}>{site.phoneDisplay}</a> and we’ll book it with you.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="qf-field qf-field-full qf-notes">
        <label htmlFor="qf-notes">
          Anything we should know? <span className="qf-optional">Optional</span>
        </label>
        <textarea
          id="qf-notes"
          rows={3}
          value={contact.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          onKeyDown={handleNotesKeyDown}
          maxLength={2000}
          readOnly={busy}
          placeholder="A deadline, what’s not working, pages you need…"
        />
      </div>

      <div className="qf-honey" aria-hidden="true">
        <label htmlFor="qf-honey">Leave this field empty</label>
        <input ref={honeyRef} id="qf-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      {submitError && (
        <div className="qf-submit-error" role="alert">
          <p>{submitError}</p>
          <p>
            If it keeps failing, call or text <a href={site.phoneHref}>{site.phoneDisplay}</a> and we’ll book it with you.
          </p>
        </div>
      )}

      <div className="qf-actions">
        <button type="submit" className="qf-primary" disabled={busy}>
          {busy ? <LoaderCircle className="qf-spin" size={18} /> : <CalendarClock size={18} />}
          {emailCheck.checking ? 'Checking email…' : submitting ? 'Sending…' : submitError ? 'Try again' : 'Pick a time'}
        </button>
        <span className="qf-hint">
          press <kbd>Enter ↵</kbd> to send, <kbd>Shift</kbd> + <kbd>Enter ↵</kbd> for a new line
        </span>
      </div>
    </form>
  )
}

function ResultScreen({ answers, contact }: { answers: Answers; contact: Contact }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const name = firstName(answers.name)
  const business = answers.business.trim()
  const service = answers.service.trim()
  const calendlyUrl = buildCalendlyUrl(BOOK_CALENDLY_URL, {
    name: answers.name,
    email: contact.email,
    a1: service ? `${business} (${service})` : business,
  })

  useEffect(() => {
    focusSoon(titleRef.current)
  }, [])

  return (
    <div className="qf-result">
      <p className="qf-kicker">
        <span aria-hidden="true" />
        {name ? `Thanks, ${name}` : 'Thanks'}
      </p>
      <h1 ref={titleRef} tabIndex={-1} className="qf-title-xl">
        Got it. <em>Now pick a time for your call.</em>
      </h1>

      {calendlyUrl ? (
        <>
          <p className="qf-result-copy">Calls are 30 minutes, weekdays 5 PM ET or later.</p>
          <CalendlyInline
            url={calendlyUrl}
            fallback={
              <>
                or call or text <a href={site.phoneHref}>{site.phoneDisplay}</a>.
              </>
            }
          />
        </>
      ) : (
        <div className="qf-fallback">
          <CalendarClock size={22} />
          <p>
            Call or text <a href={site.phoneHref}>{site.phoneDisplay}</a> with a weekday after 5 PM ET that works, and we’ll send the invite.
          </p>
        </div>
      )}

      <div className="qf-recap">
        <span>Your call is about</span>
        <strong>
          {business}
          {answers.city.trim() ? `, ${answers.city.trim()}` : ''}
        </strong>
      </div>
    </div>
  )
}
