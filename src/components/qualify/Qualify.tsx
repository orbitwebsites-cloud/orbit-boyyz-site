'use client'

import Image from 'next/image'
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
import { CALENDLY_URL, FORM_ENDPOINT, INSIGHT_MS, QUALIFY_STORAGE_KEY, QUALIFY_THRESHOLDS } from '@/content/qualifyConfig'
import { emailCheckLabel } from '@/lib/emailCheck'
import { LEADS_URL } from '@/lib/leadsSite'
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  EmailSuggestion,
  KEY_LETTERS,
  LoaderCircle,
  Send,
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
} from './shared'
import { CalendlyInline, buildCalendlyUrl } from './calendly'

// Ported from the old Vite site's src/Qualify.tsx. Same questions, copy,
// scoring, prefill, payload and Calendly logic. framer-motion and
// lucide-react are replaced by CSS animations (./qualify.css) and inline SVG
// icons (./shared.tsx), so the Next app gains no dependencies.

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

type ChoiceId = 'spend' | 'leads' | 'bounce' | 'sameness' | 'hours' | 'clients'
type QuestionId = ChoiceId | 'niche'

type ChoiceOption = {
  id: string
  label: string
  /** Lower bound of the bucket, used for the qualification thresholds. */
  value: number
  /** Contribution to the 0-100 lead score in the notification email. */
  points: number
  /** Overrides the question insight for this one answer. */
  insight?: string
}

type ChoiceQuestion = {
  kind: 'choice'
  id: ChoiceId
  field: string
  title: string
  insight: string
  options: ChoiceOption[]
}

type TextQuestion = {
  kind: 'text'
  id: 'niche'
  field: string
  title: string
  helper: string
  placeholder: string
}

type Question = ChoiceQuestion | TextQuestion

const QUESTIONS: Question[] = [
  {
    kind: 'choice',
    id: 'spend',
    field: 'Monthly spend on Clay, Apollo and data tools',
    title: 'Roughly what do you spend on Clay, Apollo and other data tools each month?',
    insight: "Whatever it is, we come in at least 30% under it, or you don't pay.",
    options: [
      { id: 'under-2k', label: 'Under $2k', value: 0, points: 0 },
      { id: '2k-5k', label: '$2k–5k', value: 2000, points: 12 },
      { id: '5k-10k', label: '$5k–10k', value: 5000, points: 20 },
      { id: '10k-20k', label: '$10k–20k', value: 10000, points: 26 },
      { id: '20k-plus', label: '$20k+', value: 20000, points: 30 },
    ],
  },
  {
    kind: 'choice',
    id: 'leads',
    field: 'Leads used per month',
    title: 'How many leads do your campaigns burn through each month?',
    insight: "That's a lot of records shared with every other agency on the same tools.",
    options: [
      {
        id: 'under-2k',
        label: 'Under 2k',
        value: 0,
        points: 0,
        insight: 'Even at that volume, those records are shared with every other agency on the same tools.',
      },
      { id: '2k-10k', label: '2k–10k', value: 2000, points: 10 },
      { id: '10k-50k', label: '10k–50k', value: 10000, points: 20 },
      { id: '50k-plus', label: '50k+', value: 50000, points: 25 },
    ],
  },
  {
    kind: 'choice',
    id: 'bounce',
    field: 'Bounce or catch-all rate',
    title: 'What share of those emails bounce or come back catch-all?',
    insight: 'Every lead we send is verified first. Our own outreach runs under 3% bounces.',
    options: [
      { id: 'under-3', label: 'Under 3%', value: 0, points: 0 },
      { id: '3-8', label: '3–8%', value: 3, points: 4 },
      { id: '8-15', label: '8–15%', value: 8, points: 7 },
      { id: 'over-15', label: 'Over 15%', value: 15, points: 10 },
      { id: 'not-sure', label: 'Not sure', value: -1, points: 5 },
    ],
  },
  {
    kind: 'choice',
    id: 'sameness',
    field: 'Prospects already getting the same pitch',
    title: 'How often do your prospects say they’re already getting the same pitch?',
    insight: 'Clay and Apollo sell the same records to everyone. We work with 10 agencies max, one per niche.',
    options: [
      { id: 'rarely', label: 'Rarely', value: 0, points: 0 },
      { id: 'sometimes', label: 'Sometimes', value: 1, points: 4 },
      { id: 'all-the-time', label: 'All the time', value: 2, points: 8 },
    ],
  },
  {
    kind: 'choice',
    id: 'hours',
    field: 'Hours per week building and cleaning lists',
    title: 'How many hours a week does your team spend building and cleaning lists?',
    insight: 'Our lists arrive verified and ready to load.',
    options: [
      { id: 'under-5', label: 'Under 5', value: 0, points: 0 },
      { id: '5-15', label: '5–15', value: 5, points: 3 },
      { id: '15-30', label: '15–30', value: 15, points: 5 },
      { id: '30-plus', label: '30+', value: 30, points: 7 },
    ],
  },
  {
    kind: 'text',
    id: 'niche',
    field: 'Niche for the free 300',
    title: 'Which client niche should we build your free 300 in first?',
    helper: '300 exclusive, verified leads in one niche, free. Be as specific as you like.',
    placeholder: 'e.g. dental practices in Texas',
  },
  {
    kind: 'choice',
    id: 'clients',
    field: 'Clients running outbound',
    title: 'How many clients are you running outbound for right now?',
    insight: 'Month-to-month, no long contract. One agency per niche.',
    options: [
      { id: '1-3', label: '1–3', value: 1, points: 0 },
      { id: '4-10', label: '4–10', value: 4, points: 10 },
      { id: '11-25', label: '11–25', value: 11, points: 15 },
      { id: '25-plus', label: '25+', value: 25, points: 20 },
    ],
  },
]

const INTRO_STEP = -1
const CONTACT_STEP = QUESTIONS.length
const RESULT_STEP = QUESTIONS.length + 1
// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

type ContactField = 'name' | 'agency' | 'email'

type Contact = Record<ContactField, string> & { notes: string }

type Evaluation = {
  qualified: boolean
  score: number
  reasons: string[]
}

type QualifyState = {
  step: number
  answers: Partial<Record<QuestionId, string>>
  contact: Contact
  domain: string
  prefilled: ContactField[]
  result: Evaluation | null
  /** The n/a/e/d values of the link this draft started from. */
  link: string
  /** Channel the visitor came from: ?src=, else utm_source, else referrer host, else 'direct'. */
  source: string
}

function emptyState(): QualifyState {
  return {
    step: INTRO_STEP,
    answers: {},
    contact: { name: '', agency: '', email: '', notes: '' },
    domain: '',
    prefilled: [],
    result: null,
    link: '',
    source: '',
  }
}

/** Index of the first question without a usable answer, or -1 when all are answered. */
function firstUnanswered(answers: QualifyState['answers']) {
  return QUESTIONS.findIndex((question) => !(answers[question.id] ?? '').trim())
}

function asText(value: unknown, max: number) {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

function cleanParam(value: string | null, max: number) {
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
}

/** Rebuilds a saved draft defensively so a stale or tampered value can't break the page. */
function restoreState(raw: unknown): QualifyState {
  const base = emptyState()
  if (!raw || typeof raw !== 'object') return base
  const saved = raw as Partial<QualifyState>

  const answers: QualifyState['answers'] = {}
  for (const question of QUESTIONS) {
    const value = saved.answers?.[question.id]
    if (typeof value !== 'string') continue
    if (question.kind === 'text') answers[question.id] = value.slice(0, 200)
    else if (question.options.some((option) => option.id === value)) answers[question.id] = value
  }

  const contact: Contact = {
    name: asText(saved.contact?.name, 80),
    agency: asText(saved.contact?.agency, 120),
    email: asText(saved.contact?.email, 160),
    notes: asText(saved.contact?.notes, 2000),
  }

  const result =
    saved.result && typeof saved.result.qualified === 'boolean' && typeof saved.result.score === 'number'
      ? {
          qualified: saved.result.qualified,
          score: saved.result.score,
          reasons: Array.isArray(saved.result.reasons) ? saved.result.reasons.filter((r) => typeof r === 'string') : [],
        }
      : null

  let step = typeof saved.step === 'number' && Number.isInteger(saved.step) ? saved.step : INTRO_STEP
  step = Math.min(Math.max(step, INTRO_STEP), RESULT_STEP)
  if (step === RESULT_STEP && !result) step = CONTACT_STEP
  // Never resume past a question that has no answer (stale or edited draft).
  const missing = firstUnanswered(answers)
  if (step !== RESULT_STEP && missing >= 0 && step > missing) step = missing

  const prefilled = Array.isArray(saved.prefilled)
    ? saved.prefilled.filter((field): field is ContactField => field === 'name' || field === 'agency' || field === 'email')
    : []

  return { step, answers, contact, domain: asText(saved.domain, 160), prefilled, result, link: asText(saved.link, 600), source: asText(saved.source, 80) }
}

/** Identifies which personalised link the page was opened from ('' when it has no prefill params). */
function linkSignature(search: string) {
  const params = new URLSearchParams(search)
  const parts = ['n', 'a', 'e', 'd'].map((key) => cleanParam(params.get(key), 160).toLowerCase())
  return parts.some(Boolean) ? parts.join('|') : ''
}

/** Fills empty contact fields from ?n= &a= &e= &d= without overwriting edits saved this session. */
function applyPrefill(state: QualifyState, search: string): QualifyState {
  const params = new URLSearchParams(search)
  const incoming: Record<ContactField, string> = {
    name: cleanParam(params.get('n'), 80),
    agency: cleanParam(params.get('a'), 120),
    // URLSearchParams turns an unencoded '+' (chris+outbound@...) into a
    // space. Emails can't contain spaces, so put the '+' back.
    email: cleanParam(params.get('e'), 160).replace(/ /g, '+'),
  }
  const contact = { ...state.contact }
  const prefilled = new Set(state.prefilled)
  for (const field of ['name', 'agency', 'email'] as const) {
    if (incoming[field] && !contact[field].trim()) {
      contact[field] = incoming[field]
      prefilled.add(field)
    }
  }
  const domain =
    state.domain ||
    cleanParam(params.get('d'), 160)
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/.*$/, '')
  return { ...state, contact, domain, prefilled: [...prefilled], link: linkSignature(search) || state.link }
}

/** First-touch source for this tab: ?src=, then utm_source, then the referring site, else 'direct'. */
function detectSource(search: string) {
  const params = new URLSearchParams(search)
  const tagged = cleanParam(params.get('src'), 60) || cleanParam(params.get('utm_source'), 60)
  if (tagged) return tagged.toLowerCase()
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./i, '')
      if (host && host !== window.location.hostname.replace(/^www\./i, '')) return `referrer:${host}`.slice(0, 80)
    }
  } catch {
    // Malformed referrer: fall through.
  }
  return 'direct'
}

/** Loads this tab's draft. A different personalised link starts a fresh draft
 *  instead of mixing two people's answers (or reopening someone else's result). */
function loadInitialState(search: string): QualifyState {
  const saved = readSaved()
  const link = linkSignature(search)
  const base = link && saved.link && saved.link !== link ? emptyState() : saved
  const state = applyPrefill(base, search)
  // Keep the first-touch source for this tab unless a new tagged link was opened.
  const detected = detectSource(search)
  const tagged = detected !== 'direct' && !detected.startsWith('referrer:')
  return { ...state, source: tagged || !state.source ? detected : state.source }
}

function readSaved(): QualifyState {
  try {
    const raw = window.sessionStorage.getItem(QUALIFY_STORAGE_KEY)
    return raw ? restoreState(JSON.parse(raw)) : emptyState()
  } catch {
    return emptyState()
  }
}

function writeSaved(state: QualifyState) {
  try {
    window.sessionStorage.setItem(QUALIFY_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode or blocked storage: the flow still works, it just won't survive a reload.
  }
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function choiceQuestion(id: ChoiceId) {
  return QUESTIONS.find((question): question is ChoiceQuestion => question.kind === 'choice' && question.id === id)
}

function selectedOption(id: ChoiceId, answers: QualifyState['answers']) {
  return choiceQuestion(id)?.options.find((option) => option.id === answers[id])
}

function answerLabel(id: ChoiceId, answers: QualifyState['answers']) {
  return selectedOption(id, answers)?.label ?? 'not answered'
}

function shortUsd(amount: number) {
  return amount >= 1000 ? `$${amount / 1000}k` : `$${amount}`
}

function shortCount(amount: number) {
  return amount >= 1000 ? `${amount / 1000}k` : String(amount)
}

function evaluate(answers: QualifyState['answers']): Evaluation {
  const spend = selectedOption('spend', answers)
  const leads = selectedOption('leads', answers)
  const clients = selectedOption('clients', answers)
  const reasons: string[] = []

  if (spend && spend.value >= QUALIFY_THRESHOLDS.minMonthlySpendUsd) {
    reasons.push(`spend ${spend.label}/mo (threshold ${shortUsd(QUALIFY_THRESHOLDS.minMonthlySpendUsd)})`)
  }
  if (leads && leads.value >= QUALIFY_THRESHOLDS.minMonthlyLeads) {
    reasons.push(`${leads.label} leads/mo (threshold ${shortCount(QUALIFY_THRESHOLDS.minMonthlyLeads)})`)
  }
  if (clients && clients.value >= QUALIFY_THRESHOLDS.minClients) {
    reasons.push(`${clients.label} clients (threshold ${QUALIFY_THRESHOLDS.minClients})`)
  }

  const score = QUESTIONS.reduce((total, question) => {
    if (question.kind !== 'choice') return total
    return total + (selectedOption(question.id, answers)?.points ?? 0)
  }, 0)

  return { qualified: reasons.length > 0, score: Math.min(score, 100), reasons }
}

function buildPayload(state: QualifyState, evaluation: Evaluation, honey: string, emailCheck: string) {
  const { contact, answers } = state
  const agency = contact.agency.trim() || 'Unknown agency'
  const fields: Record<string, string> = {
    _subject: `Qualify: ${agency} (${answerLabel('spend', answers)}, ${answerLabel('leads', answers)}/mo) [src: ${state.source || 'direct'}]`,
    _template: 'table',
    _captcha: 'false',
    qualified: evaluation.qualified ? 'yes' : 'no',
    score: `${evaluation.score}/100`,
    'qualified because': evaluation.reasons.length
      ? evaluation.reasons.join('; ')
      : `Below every threshold (spend under ${shortUsd(QUALIFY_THRESHOLDS.minMonthlySpendUsd)}, leads under ${shortCount(QUALIFY_THRESHOLDS.minMonthlyLeads)}, fewer than ${QUALIFY_THRESHOLDS.minClients} clients)`,
    name: contact.name.trim(),
    agency,
    email: contact.email.trim(),
    // Lets you hit Reply in the notification and land in their inbox.
    _replyto: contact.email.trim(),
    // ok, ok (<note>) or unverified (the check timed out or failed).
    email_check: emailCheck,
    domain: state.domain || '(not in link)',
    source: state.source || 'direct',
  }

  QUESTIONS.forEach((question, index) => {
    const value =
      question.kind === 'choice' ? answerLabel(question.id, answers) : (answers[question.id] ?? '').trim() || 'not answered'
    fields[`Q${index + 1} ${question.field}`] = value
  })

  fields['What their current data gets wrong'] = contact.notes.trim() || '(left blank)'
  fields['Prefilled from link'] = state.prefilled.length ? state.prefilled.join(', ') : 'none'
  if (honey) fields._honey = honey
  return fields
}

/** Everything a screen renders from. Frozen for the outgoing screen while it
 *  animates away, the way AnimatePresence kept the last element it saw. */
type View = {
  state: QualifyState
  pending: boolean
  submitting: boolean
  submitError: string
}

const viewStep = (view: View) => view.state.step

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Qualify() {
  const [state, setState] = useState<QualifyState>(emptyState)
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

  // Restore the session draft and URL prefill after hydration, so the
  // prerendered HTML and the first client render stay identical.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate from sessionStorage + URL once on mount */
    setState(loadInitialState(window.location.search))
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

  const choose = useCallback(
    (id: ChoiceId, optionId: string) => {
      cancelAdvance()
      setState((current) => ({ ...current, answers: { ...current.answers, [id]: optionId } }))
      setPending(true)
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null
        next()
      }, INSIGHT_MS)
    },
    [cancelAdvance, next],
  )

  const setAnswer = useCallback((id: QuestionId, value: string) => {
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
    const evaluation = evaluate(state.answers)
    submittingRef.current = true
    setSubmitting(true)
    setSubmitError('')
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload(state, evaluation, honeyRef.current?.value ?? '', emailCheck)),
      })
      const data: unknown = await response.json().catch(() => null)
      const rejected =
        data !== null && typeof data === 'object' && 'success' in data && String((data as { success: unknown }).success) === 'false'
      if (!response.ok || rejected) throw new Error('Submission rejected')
      posthog.capture('qualification_submitted', {
        qualified: evaluation.qualified,
        qualification_score: evaluation.score,
      })
      setDirection(1)
      setState((current) => ({ ...current, result: evaluation, step: RESULT_STEP }))
      scrollToTop()
    } catch {
      setSubmitError('That didn’t go through. Your answers are still saved on this page, so check your connection and try again.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  // --- Stage: mode="wait" transitions (shared.tsx useScreenStage) ---------
  const view = useMemo<View>(() => ({ state, pending, submitting, submitError }), [state, pending, submitting, submitError])
  const { stageView, stage } = useScreenStage(view, viewStep, direction)

  function renderScreen({ state: screenState, pending: screenPending, submitting: screenSubmitting, submitError: screenError }: View) {
    const { step: screenStep } = screenState
    const screenQuestion = screenStep >= 0 && screenStep < QUESTIONS.length ? QUESTIONS[screenStep] : null

    if (screenStep === INTRO_STEP) {
      return (
        <IntroScreen
          name={firstName(screenState.contact.name)}
          resuming={Object.keys(screenState.answers).length > 0}
          onStart={() => goTo(0, 1)}
        />
      )
    }
    if (screenQuestion?.kind === 'choice') {
      return (
        <ChoiceScreen
          question={screenQuestion}
          index={screenStep}
          value={screenState.answers[screenQuestion.id] ?? ''}
          pending={screenPending}
          onChoose={choose}
          onNext={next}
        />
      )
    }
    if (screenQuestion?.kind === 'text') {
      return (
        <TextScreen
          question={screenQuestion}
          index={screenStep}
          value={screenState.answers[screenQuestion.id] ?? ''}
          onChange={(value) => setAnswer(screenQuestion.id, value)}
          onNext={next}
        />
      )
    }
    if (screenStep === CONTACT_STEP) {
      return (
        <ContactScreen
          contact={screenState.contact}
          prefilled={screenState.prefilled}
          submitting={screenSubmitting}
          submitError={screenError}
          honeyRef={honeyRef}
          onChange={setContact}
          onSubmit={submit}
        />
      )
    }
    if (screenState.result) {
      return <ResultScreen result={screenState.result} contact={screenState.contact} answers={screenState.answers} />
    }
    return null
  }

  const { step } = state
  const inFlow = step >= 0 && step <= CONTACT_STEP
  const progress = step === RESULT_STEP ? 100 : inFlow ? Math.round(((step + 1) / (CONTACT_STEP + 2)) * 100) : 0

  return (
    // data-lenis-prevent: the site's Lenis smooth scroll leaves this page (and
    // its textarea) on native scrolling, like the original standalone page.
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
        {/* The page's links all lead to the lead data site, leads.orbitboyzz.com. */}
        <a href={LEADS_URL} className="qf-brand">
          <Image src="/orbit-icon.svg" alt="" width={30} height={30} unoptimized loading="eager" />
          <span>Orbit Boyzz</span>
        </a>
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

function IntroScreen({ name, resuming, onStart }: { name: string; resuming: boolean; onStart: () => void }) {
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
        {name ? `Hi ${name}` : 'Orbit Boyzz'}
      </p>
      <h1>Before we book your call</h1>
      <p className="qf-lede">{QUESTIONS.length} quick questions, about 60 seconds.</p>
      <ul className="qf-offer" aria-label="The offer">
        <li><Check size={15} /> 300 exclusive, verified leads in one niche, free</li>
        <li><Check size={15} /> Then at least 30% under your Clay + Apollo spend, or you don’t pay</li>
        <li><Check size={15} /> Month-to-month. 10 agencies max, one per niche</li>
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

function ChoiceScreen({
  question,
  index,
  value,
  pending,
  onChoose,
  onNext,
}: {
  question: ChoiceQuestion
  index: number
  value: string
  pending: boolean
  onChoose: (id: ChoiceId, optionId: string) => void
  onNext: () => void
}) {
  const isPresent = useIsPresent()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = `qf-title-${question.id}`
  const selected = question.options.find((option) => option.id === value)
  const lastKey = KEY_LETTERS[question.options.length - 1]

  useEffect(() => {
    focusSoon(titleRef.current)
  }, [])

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
          onNext()
          return
        }
        if (target?.closest('button, a')) return
        if (value) {
          event.preventDefault()
          onNext()
        }
        return
      }

      const optionIndex = keyToIndex(event.key)
      if (optionIndex >= 0 && optionIndex < question.options.length) {
        event.preventDefault()
        onChoose(question.id, question.options[optionIndex].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPresent, question, value, onChoose, onNext])

  const insight = selected ? selected.insight ?? question.insight : ''

  return (
    <div className="qf-question">
      <QuestionMeta index={index} />
      <h2 id={titleId} ref={titleRef} tabIndex={-1} className="qf-title">
        {question.title}
      </h2>

      <div className="qf-options" role="group" aria-labelledby={titleId}>
        {question.options.map((option, optionIndex) => {
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
              onClick={() => onChoose(question.id, option.id)}
            >
              <kbd className="qf-key" aria-hidden="true">{KEY_LETTERS[optionIndex]}</kbd>
              <span className="qf-option-label">{option.label}</span>
              <Check className="qf-option-check" size={18} />
            </button>
          )
        })}
      </div>

      <div className="qf-insight-slot" aria-live="polite">
        {insight && (
          // key remounts the line on every new answer so its entrance replays.
          <p key={value} className="qf-insight">
            {insight}
            {pending && <span className="qf-insight-timer" style={{ animationDuration: `${INSIGHT_MS}ms` }} aria-hidden="true" />}
          </p>
        )}
      </div>

      <div className="qf-actions">
        <button type="button" className="qf-primary" onClick={onNext} disabled={!value}>
          OK
          <Check size={18} />
        </button>
        <span className="qf-hint">
          press <kbd>A</kbd>–<kbd>{lastKey}</kbd> to pick, <kbd>Enter ↵</kbd> to continue
        </span>
      </div>
    </div>
  )
}

function TextScreen({
  question,
  index,
  value,
  onChange,
  onNext,
}: {
  question: TextQuestion
  index: number
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
      setError('Add one niche so we know where to start.')
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
        <label htmlFor={inputId}>{question.title}</label>
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
        autoComplete="off"
        enterKeyHint="next"
        maxLength={200}
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

const CONTACT_FIELDS: Array<{
  field: ContactField
  label: string
  type: string
  autoComplete: string
  placeholder: string
  inputMode?: 'email' | 'text'
}> = [
  { field: 'name', label: 'First name', type: 'text', autoComplete: 'given-name', placeholder: 'Chris' },
  { field: 'agency', label: 'Agency', type: 'text', autoComplete: 'organization', placeholder: 'Agency name' },
  { field: 'email', label: 'Work email', type: 'email', autoComplete: 'email', placeholder: 'you@agency.com', inputMode: 'email' },
]

function validateContact(contact: Contact) {
  const errors: Partial<Record<ContactField, string>> = {}
  if (!contact.name.trim()) errors.name = 'Add your first name.'
  if (!contact.agency.trim()) errors.agency = 'Add your agency’s name.'
  if (!contact.email.trim()) errors.email = 'Add your work email.'
  else if (!looksLikeEmail(contact.email)) errors.email = 'That email doesn’t look right. Check for typos.'
  return errors
}

// Shown when /api/verify-email rejects the address (typo domain, no mail
// server, disposable inbox, impossible Gmail name...).
const EMAIL_UNDELIVERABLE = 'That email doesn’t look deliverable — use your work email.'

function ContactScreen({
  contact,
  prefilled,
  submitting,
  submitError,
  honeyRef,
  onChange,
  onSubmit,
}: {
  contact: Contact
  prefilled: ContactField[]
  submitting: boolean
  submitError: string
  honeyRef: RefObject<HTMLInputElement | null>
  onChange: (field: keyof Contact, value: string) => void
  /** Called once the email passed the deliverability check (or the check couldn't run). */
  onSubmit: (emailCheck: string) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({})
  const emailCheck = useEmailCheck(contact.email)
  const { precheck, verify } = emailCheck
  const checkingRef = useRef(false)
  // Fields are read-only while the address is checked and sent: an edit made
  // then would skip the check and go to Calendly as typed.
  const busy = submitting || emailCheck.checking
  // A prefilled (or restored) address is checked as soon as the step opens.
  const [emailOnOpen] = useState(contact.email)
  useEffect(() => {
    precheck(emailOnOpen)
  }, [precheck, emailOnOpen])
  // Decide the layout once, from what was already known when the step opened,
  // so the screen doesn't rearrange itself while someone is typing.
  const [missingOnOpen] = useState(() => CONTACT_FIELDS.filter(({ field }) => !contact[field].trim()).map(({ field }) => field))
  const allKnown = missingOnOpen.length === 0

  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const target = allKnown
      ? form.querySelector<HTMLElement>('#qf-notes')
      : form.querySelector<HTMLElement>(`#qf-${missingOnOpen[0]}`)
    focusSoon(target)
  }, [allKnown, missingOnOpen])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (checkingRef.current || submitting) return
    const nextErrors = validateContact(contact)
    setErrors(nextErrors)
    const firstInvalid = CONTACT_FIELDS.find(({ field }) => nextErrors[field])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#qf-${firstInvalid.field}`)?.focus()
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

  const detailFields = (
    <div className="qf-fields">
      {CONTACT_FIELDS.map(({ field, label, type, autoComplete, placeholder, inputMode }) => {
        const error = errors[field] || (field === 'email' && emailCheck.rejected ? EMAIL_UNDELIVERABLE : '')
        const fromLink = prefilled.includes(field) && contact[field].trim()
        return (
          <div key={field} className={`qf-field${field === 'email' ? ' qf-field-full' : ''}`}>
            <label htmlFor={`qf-${field}`}>
              {label}
              {fromLink && <span className="qf-from-link">from your email</span>}
            </label>
            <input
              id={`qf-${field}`}
              type={type}
              inputMode={inputMode}
              value={contact[field]}
              onChange={(event) => {
                onChange(field, event.target.value)
                if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
              }}
              onBlur={field === 'email' ? (event) => precheck(event.target.value) : undefined}
              placeholder={placeholder}
              autoComplete={autoComplete}
              autoCapitalize={field === 'email' ? 'off' : 'words'}
              spellCheck={field === 'email' ? false : undefined}
              maxLength={field === 'agency' ? 120 : field === 'email' ? 160 : 80}
              readOnly={busy}
              required
              aria-required="true"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `qf-${field}-error` : undefined}
            />
            {/* aria-live: the deliverability error can arrive after blur. */}
            <div aria-live={field === 'email' ? 'polite' : undefined}>
              {error && (
                <p className="qf-field-error" id={`qf-${field}-error`}>
                  {error}
                </p>
              )}
              {field === 'email' && emailCheck.rejected && <EmailSuggestion suggestion={emailCheck.suggestion} disabled={busy} onUse={applySuggestion} />}
            </div>
          </div>
        )
      })}
    </div>
  )

  const notesField = (
    <div className="qf-field qf-field-full qf-notes">
      {/* When every detail is prefilled the heading already asks this question. */}
      <label htmlFor="qf-notes" className={allKnown ? 'qf-sr-only' : undefined}>
        Anything your current data gets wrong? <span className="qf-optional">Optional</span>
      </label>
      <textarea
        id="qf-notes"
        rows={allKnown ? 4 : 3}
        value={contact.notes}
        onChange={(event) => onChange('notes', event.target.value)}
        onKeyDown={handleNotesKeyDown}
        maxLength={2000}
        readOnly={busy}
        placeholder="Wrong titles, dead emails, the same lists every competitor has…"
      />
    </div>
  )

  return (
    <form ref={formRef} className="qf-question qf-contact" onSubmit={handleSubmit} noValidate aria-busy={submitting || emailCheck.checking}>
      <p className="qf-meta">
        <span className="qf-meta-num">
          <Check size={14} />
        </span>
        <span>Last step</span>
      </p>
      <h2 className="qf-title">{allKnown ? 'Last one. Anything your current data gets wrong?' : 'Where should we send your free 300?'}</h2>
      <p className="qf-helper">
        {allKnown
          ? 'Optional, but it helps. Then check your details and send.'
          : 'Only used to follow up with you about this.'}
      </p>

      {allKnown ? (
        <>
          {notesField}
          <fieldset className="qf-details">
            <legend>Your details, edit if needed</legend>
            {detailFields}
          </fieldset>
        </>
      ) : (
        <>
          {detailFields}
          {notesField}
        </>
      )}

      <div className="qf-honey" aria-hidden="true">
        <label htmlFor="qf-honey">Leave this field empty</label>
        <input ref={honeyRef} id="qf-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      {submitError && (
        <div className="qf-submit-error" role="alert">
          <p>{submitError}</p>
          <p>If it keeps failing, reply to my email with your niche and I’ll take it from there.</p>
        </div>
      )}

      <div className="qf-actions">
        <button type="submit" className="qf-primary" disabled={submitting || emailCheck.checking}>
          {submitting || emailCheck.checking ? <LoaderCircle className="qf-spin" size={18} /> : <Send size={17} />}
          {emailCheck.checking ? 'Checking email…' : submitting ? 'Sending…' : submitError ? 'Try again' : 'Submit'}
        </button>
        <span className="qf-hint">
          press <kbd>Enter ↵</kbd> to send, <kbd>Shift</kbd> + <kbd>Enter ↵</kbd> for a new line
        </span>
      </div>
    </form>
  )
}

function ResultScreen({
  result,
  contact,
  answers,
}: {
  result: Evaluation
  contact: Contact
  answers: QualifyState['answers']
}) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const name = firstName(contact.name)
  const niche = (answers.niche ?? '').trim()
  const calendlyUrl = result.qualified ? buildCalendlyUrl(CALENDLY_URL, { name: contact.name, email: contact.email, a1: niche }) : ''

  useEffect(() => {
    focusSoon(titleRef.current)
  }, [])

  if (!result.qualified) {
    return (
      <div className="qf-result">
        <p className="qf-kicker">
          <span aria-hidden="true" />
          Got it
        </p>
        <h1 ref={titleRef} tabIndex={-1} className="qf-title-xl">
          Thanks{name ? ` ${name}` : ''}.
        </h1>
        <p className="qf-result-copy">
          Based on your volume, the free 300 is the best place to start. I’ll email you next steps within 2 business days.
        </p>
        {niche && (
          <div className="qf-recap">
            <span>Your free 300</span>
            <strong>{niche}</strong>
          </div>
        )}
        <p className="qf-site-link">
          <a href={LEADS_URL}>
            How we build your leads
            <ArrowRight size={15} />
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="qf-result">
      <p className="qf-kicker">
        <span aria-hidden="true" />
        {name ? `Nice, ${name}` : 'Nice'}
      </p>
      <h1 ref={titleRef} tabIndex={-1} className="qf-title-xl">
        You’re a fit. <em>Pick a time for your call.</em>
      </h1>

      {calendlyUrl ? (
        <>
          <p className="qf-result-copy">Calls are weekdays, 5 PM ET or later.</p>
          <CalendlyInline url={calendlyUrl} fallback="or reply to my email with a weekday after 5 PM ET that works." />
        </>
      ) : (
        <div className="qf-fallback">
          <CalendarClock size={22} />
          <p>Reply to my email with a weekday after 5 PM ET that works, and I’ll send the invite.</p>
        </div>
      )}

      <ul className="qf-offer qf-offer-recap" aria-label="What we’ll cover">
        <li>
          <Check size={15} /> 300 exclusive, verified leads{niche ? ` in ${niche}` : ''}, free
        </li>
        <li>
          <Check size={15} /> Then we replace your Clay + Apollo data spend (you said{' '}
          {answerLabel('spend', answers).replace(/^Under/, 'under')}/mo) for at least 30% less, or you don’t pay
        </li>
        <li>
          <Check size={15} /> Month-to-month. 10 agencies max, one per niche
        </li>
      </ul>
    </div>
  )
}
