import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  ExternalLink,
  LoaderCircle,
  RotateCcw,
  Send,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import './ProjectBrief.css'

type BriefQuestion = {
  category: string
  question: string
  helper: string
  placeholder: string
}

const questions: BriefQuestion[] = [
  {
    category: 'Identity',
    question: 'What is the exact public company/project name?',
    helper: 'Use the spelling, capitalization, and styling that should appear publicly.',
    placeholder: 'e.g. Northstar Energy Project',
  },
  {
    category: 'Business',
    question: 'What exactly is the company’s primary business?',
    helper: 'Explain it plainly—as if you were introducing the company to someone for the first time.',
    placeholder: 'The company exists to…',
  },
  {
    category: 'Launch',
    question: 'What products or services will you provide at launch?',
    helper: 'List only what will be available on day one. Add details, packages, or capacity where useful.',
    placeholder: 'At launch, we will provide…',
  },
  {
    category: 'Legal',
    question: 'What is the exact legal entity name and business structure?',
    helper: 'Include the registered name, entity type, jurisdiction, and registration status.',
    placeholder: 'Legal name, LLC/corporation/partnership, jurisdiction…',
  },
  {
    category: 'Validation',
    question: 'What government approvals, MoUs, partnerships, or official recognitions have already been received?',
    helper: 'Name the issuing organization, date, status, and what the approval or agreement actually covers.',
    placeholder: 'Approval / organization / date / scope…',
  },
  {
    category: 'Certainty',
    question: 'What aspects of the project are confirmed versus proposed/planned?',
    helper: 'Clearly separate signed, funded, approved, or operational facts from future intentions.',
    placeholder: 'Confirmed:\n\nProposed or planned:',
  },
  {
    category: 'Disclosure',
    question: 'What things can be disclosed in the making of the product and what cannot be disclosed?',
    helper: 'Flag confidential processes, locations, designs, partners, or technical details we must avoid.',
    placeholder: 'Safe to disclose:\n\nConfidential / do not disclose:',
  },
  {
    category: 'Status',
    question: 'What is the current status of the project?',
    helper: 'Describe the stage today: concept, feasibility, approvals, fundraising, construction, testing, or operations.',
    placeholder: 'Right now, the project is…',
  },
  {
    category: 'Infrastructure',
    question: 'What facilities are planned?',
    helper: 'Include facility types, proposed locations, scale, capacity, and whether sites are confirmed.',
    placeholder: 'Facility / location / scale / status…',
  },
  {
    category: 'Mission',
    question: 'What is the target of this project?',
    helper: 'Define the concrete commercial, technical, social, or environmental outcome.',
    placeholder: 'The project is targeting…',
  },
  {
    category: 'Partners',
    question: 'Who are the confirmed technology, manufacturing, EPC, supplier, or strategic partners?',
    helper: 'Include only confirmed parties and state each partner’s role. Note any names that cannot be public yet.',
    placeholder: 'Partner / role / confirmed status / disclosure status…',
  },
  {
    category: 'Audience',
    question: 'Who is the primary target audience?',
    helper: 'Describe the main buyers, stakeholders, investors, communities, or institutions we need to reach.',
    placeholder: 'Our primary audience is…',
  },
  {
    category: 'Opportunity',
    question: 'Is the company currently seeking investment or partnerships? If yes, what opportunities are available?',
    helper: 'Describe the kind of capital, expertise, access, supply, or strategic relationship being sought.',
    placeholder: 'We are seeking… / We are not currently seeking…',
  },
  {
    category: 'Positioning',
    question: 'What makes the company/project different from competitors?',
    helper: 'Focus on defensible differences: technology, economics, access, speed, expertise, IP, or delivery model.',
    placeholder: 'Unlike alternatives, this project…',
  },
  {
    category: 'Brand',
    question: 'What existing brand materials do you have?',
    helper: 'List logos, brand guidelines, photos, videos, decks, renders, reports, websites, and source files.',
    placeholder: 'We currently have… Include links where possible.',
  },
  {
    category: 'Roadmap',
    question: 'What are the major goals and milestones for 2026–2030, 2030–2035, and 2035–2040?',
    helper: 'Break the roadmap into the three time periods and include measurable targets where approved.',
    placeholder: '2026–2030:\n\n2030–2035:\n\n2035–2040:',
  },
  {
    category: 'Claims',
    question: 'What claims, statistics, partnerships, projections, and financial/investment figures are officially approved for public use?',
    helper: 'Give exact approved wording and cite the internal or public source for each claim when possible.',
    placeholder: 'Approved claim / exact figure / source / restrictions…',
  },
  {
    category: 'Governance',
    question: 'Who is responsible for providing information and who gives final approval before anything is published?',
    helper: 'Include names, roles, contact details, and the order of the review process.',
    placeholder: 'Information owner:\nFinal approver:\nReview process:',
  },
  {
    category: 'Risk',
    question: 'What are the biggest challenges, risks, or limitations facing the project right now?',
    helper: 'Be candid. Include regulatory, technical, funding, supply, timeline, land, talent, or reputation risks.',
    placeholder: 'The primary risks or limitations are…',
  },
  {
    category: 'Timeline',
    question: 'What is the expected timeline for the project, including the target launch/operational date?',
    helper: 'List key dates, dependencies, decision points, and whether each date is committed or estimated.',
    placeholder: 'Target date / milestone / dependency / confidence level…',
  },
]

type SavedBrief = {
  answers: string[]
  respondentName: string
  respondentEmail: string
  savedAt: string
}

const STORAGE_KEY = 'orbit-project-brief-v1'

function answerLabel(index: number) {
  return `Q${String(index + 1).padStart(2, '0')}`
}

function buildSummary(name: string, email: string, answers: string[]) {
  const lines = [
    'ORBIT WEBSITES — PROJECT INFORMATION BRIEF',
    '===========================================',
    `Prepared by: ${name}`,
    `Email: ${email}`,
    `Submitted: ${new Date().toLocaleString()}`,
    '',
  ]

  questions.forEach((item, index) => {
    lines.push(`${answerLabel(index)} — ${item.category.toUpperCase()}`)
    lines.push(item.question)
    lines.push(answers[index]?.trim() || '[No answer provided]')
    lines.push('')
  })

  return lines.join('\n')
}

export default function ProjectBrief() {
  const [step, setStep] = useState(-1)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ''))
  const [respondentName, setRespondentName] = useState('')
  const [respondentEmail, setRespondentEmail] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const answeredCount = useMemo(() => answers.filter((answer) => answer.trim()).length, [answers])
  const isReview = step === questions.length
  const isQuestion = step >= 0 && step < questions.length
  const progress = isReview ? 100 : isQuestion ? ((step + 1) / questions.length) * 100 : 0

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as SavedBrief
        if (Array.isArray(saved.answers)) {
          setAnswers(questions.map((_, index) => saved.answers[index] ?? ''))
          setRespondentName(saved.respondentName ?? '')
          setRespondentEmail(saved.respondentEmail ?? '')
          setSavedAt(saved.savedAt ?? null)
        }
      }
    } catch {
      // A damaged local draft should never stop someone from using the form.
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!loaded || submitted) return
    const savedAtIso = new Date().toISOString()
    const draft: SavedBrief = {
      answers,
      respondentName,
      respondentEmail,
      savedAt: savedAtIso,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    setSavedAt(savedAtIso)
  }, [answers, loaded, respondentEmail, respondentName, submitted])

  useEffect(() => {
    if (!isQuestion) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 360)
    return () => window.clearTimeout(timer)
  }, [isQuestion, step])

  function goTo(nextStep: number, nextDirection: number) {
    setDirection(nextDirection)
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateAnswer(value: string) {
    setAnswers((current) => current.map((answer, index) => (index === step ? value : answer)))
  }

  function next() {
    if (!isQuestion) return
    goTo(step === questions.length - 1 ? questions.length : step + 1, 1)
  }

  function previous() {
    if (isReview) goTo(questions.length - 1, -1)
    else if (isQuestion) goTo(step - 1, -1)
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      next()
    }
  }

  function resetBrief() {
    if (!window.confirm('Start a fresh brief? This will erase the saved draft on this device.')) return
    window.localStorage.removeItem(STORAGE_KEY)
    setAnswers(questions.map(() => ''))
    setRespondentName('')
    setRespondentEmail('')
    setSavedAt(null)
    setSubmitted(false)
    setSubmitError('')
    goTo(-1, -1)
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildSummary(respondentName, respondentEmail, answers))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setSubmitError('Copying was blocked by your browser. Download the brief instead.')
    }
  }

  function downloadSummary() {
    const blob = new Blob([buildSummary(respondentName, respondentEmail, answers)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `orbit-project-brief-${new Date().toISOString().slice(0, 10)}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function submitBrief(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')

    const payload = new FormData()
    payload.append('_subject', `New project brief from ${respondentName}`)
    payload.append('_template', 'table')
    payload.append('_captcha', 'false')
    payload.append('name', respondentName)
    payload.append('email', respondentEmail)
    payload.append('answered', `${answeredCount} of ${questions.length}`)
    questions.forEach((item, index) => {
      payload.append(`${answerLabel(index)} — ${item.category}`, answers[index]?.trim() || '[Skipped]')
    })

    try {
      const response = await fetch('https://formsubmit.co/ajax/orbitboyzz@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload,
      })
      if (!response.ok) throw new Error('Submission service unavailable')
      setSubmitted(true)
      setStep(questions.length + 1)
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      setSubmitError('The email service did not respond. Your answers are still saved—download a copy and email it to us, or try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="brief-shell">
      <div className="brief-atmosphere" aria-hidden="true">
        <span className="brief-orbit brief-orbit-one" />
        <span className="brief-orbit brief-orbit-two" />
        <span className="brief-spark brief-spark-one" />
        <span className="brief-spark brief-spark-two" />
      </div>

      <header className="brief-header">
        <a className="brief-brand" href="https://orbitboyzz.me" aria-label="Orbit Websites home">
          <img src="/orbit-logo.svg" alt="" width="38" height="38" />
          <span>ORBIT<em>WEBSITES</em></span>
        </a>
        <div className="brief-header-meta">
          {step >= 0 && step <= questions.length && (
            <span className="brief-save-state">
              <Check size={13} aria-hidden="true" />
              {savedAt ? 'Draft saved' : 'Autosave on'}
            </span>
          )}
          <a href="https://orbitboyzz.me" target="_blank" rel="noreferrer">
            orbitboyzz.me <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </header>

      {step >= 0 && step <= questions.length && (
        <div className="brief-progress" aria-label={`${Math.round(progress)}% complete`}>
          <motion.span animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 100, damping: 22 }} />
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {step === -1 && (
          <motion.section
            key="welcome"
            className="brief-welcome brief-stage"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="brief-kicker"><span /> Project information brief</div>
            <h1>Build the truth.<br /><em>Then tell the story.</em></h1>
            <p className="brief-intro">
              This focused brief gives our team the facts, boundaries, and ambition behind your project—before anything is designed or published.
            </p>

            <form
              className="brief-start-card"
              onSubmit={(event) => {
                event.preventDefault()
                goTo(0, 1)
              }}
            >
              <div className="brief-field-row">
                <label>
                  <span>Your name</span>
                  <input
                    required
                    autoComplete="name"
                    value={respondentName}
                    onChange={(event) => setRespondentName(event.target.value)}
                    placeholder="Full name"
                  />
                </label>
                <label>
                  <span>Best email</span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={respondentEmail}
                    onChange={(event) => setRespondentEmail(event.target.value)}
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <button className="brief-primary" type="submit">
                {answeredCount ? 'Continue your brief' : 'Start the brief'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <div className="brief-start-notes">
                <span><strong>20</strong> focused questions</span>
                <span><strong>~15</strong> minutes</span>
                <span><strong>100%</strong> free</span>
              </div>
            </form>
            <p className="brief-confidential">Your progress is saved privately on this device until you submit.</p>
          </motion.section>
        )}

        {isQuestion && (
          <motion.section
            key={`question-${step}`}
            className="brief-question brief-stage"
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 46 : -46 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -46 : 46 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="brief-question-meta">
              <span>{answerLabel(step)}</span>
              <span>{questions[step].category}</span>
              <span>{step + 1} / {questions.length}</span>
            </div>
            <h2>{questions[step].question}</h2>
            <p>{questions[step].helper}</p>

            <label className="brief-answer-wrap">
              <span className="sr-only">Your answer</span>
              <textarea
                ref={inputRef}
                value={answers[step]}
                onChange={(event) => updateAnswer(event.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={questions[step].placeholder}
                rows={6}
              />
              <span className="brief-character-count">{answers[step].length.toLocaleString()} characters</span>
            </label>

            <div className="brief-question-actions">
              <button className="brief-primary" type="button" onClick={next}>
                {step === questions.length - 1 ? 'Review answers' : 'Next question'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <span><kbd>Ctrl</kbd> + <kbd>Enter</kbd> to continue</span>
            </div>
          </motion.section>
        )}

        {isReview && (
          <motion.section
            key="review"
            className="brief-review brief-stage"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -26 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="brief-kicker"><span /> Final review</div>
            <div className="brief-review-heading">
              <div>
                <h1>Your project,<br /><em>clearly mapped.</em></h1>
                <p>{answeredCount} of {questions.length} questions answered. Skipped questions can still be submitted.</p>
              </div>
              <div className="brief-score" aria-label={`${answeredCount} of ${questions.length} answered`}>
                <strong>{answeredCount}</strong><span>/ {questions.length}</span>
              </div>
            </div>

            <div className="brief-review-tools">
              <button type="button" onClick={copySummary}>
                {copied ? <CheckCircle2 size={17} /> : <Clipboard size={17} />}
                {copied ? 'Copied' : 'Copy all'}
              </button>
              <button type="button" onClick={downloadSummary}><Download size={17} /> Download copy</button>
            </div>

            <div className="brief-review-list">
              {questions.map((item, index) => (
                <button key={item.question} type="button" onClick={() => goTo(index, -1)}>
                  <span>{answerLabel(index)}</span>
                  <div>
                    <strong>{item.question}</strong>
                    <p className={answers[index].trim() ? '' : 'brief-unanswered'}>
                      {answers[index].trim() || 'No answer yet — click to add one'}
                    </p>
                  </div>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              ))}
            </div>

            <form className="brief-submit-block" onSubmit={submitBrief}>
              <div>
                <span className="brief-submit-label">Ready to send?</span>
                <h3>Deliver this brief to Orbit Websites.</h3>
                <p>You’ll keep a local copy, and our team will receive your answers at orbitboyzz@gmail.com.</p>
              </div>
              <button className="brief-primary brief-submit-button" type="submit" disabled={submitting}>
                {submitting ? <LoaderCircle className="brief-spinner" size={18} /> : <Send size={18} />}
                {submitting ? 'Sending…' : 'Submit brief'}
              </button>
            </form>
            {submitError && <p className="brief-error" role="alert">{submitError}</p>}
          </motion.section>
        )}

        {step === questions.length + 1 && (
          <motion.section
            key="success"
            className="brief-success brief-stage"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="brief-success-mark"
              initial={{ scale: 0, rotate: -18 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 15, delay: 0.16 }}
            >
              <Check size={42} strokeWidth={2.4} />
            </motion.div>
            <div className="brief-kicker"><span /> Transmission complete</div>
            <h1>Brief received.<br /><em>We’re in orbit.</em></h1>
            <p>
              Thanks, {respondentName.split(' ')[0]}. Your project information has been sent to Orbit Websites. Keep a copy for your records below.
            </p>
            <div className="brief-success-actions">
              <button className="brief-primary" type="button" onClick={downloadSummary}><Download size={18} /> Download my copy</button>
              <a href="https://orbitboyzz.me" className="brief-secondary">Visit Orbit Websites <ExternalLink size={16} /></a>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {step >= 0 && step <= questions.length && (
        <nav className="brief-bottom-nav" aria-label="Form navigation">
          <button type="button" onClick={previous} aria-label="Previous question">
            <ArrowLeft size={19} />
          </button>
          <div>
            <span>{isReview ? 'Review' : `${String(step + 1).padStart(2, '0')} / ${questions.length}`}</span>
            <button type="button" onClick={resetBrief}><RotateCcw size={13} /> Start over</button>
          </div>
          <button type="button" onClick={() => (isReview ? goTo(0, -1) : next())} aria-label={isReview ? 'Return to first question' : 'Next question'}>
            <ArrowRight size={19} />
          </button>
        </nav>
      )}
    </main>
  )
}
