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
    question: 'What is the exact public name of your organization, brand, or project?',
    helper: 'Use the spelling, capitalization, and styling that should appear publicly. If the name is still being decided, share the working name.',
    placeholder: 'e.g. Northstar Studio, Community First, or Project Aurora',
  },
  {
    category: 'Purpose',
    question: 'What does your organization, brand, or project do?',
    helper: 'Explain its primary purpose plainly, as if you were introducing it to someone for the first time.',
    placeholder: 'We help, provide, create, or exist to...',
  },
  {
    category: 'Offer',
    question: 'What products, services, programs, or experiences do you offer?',
    helper: 'List what is available now and what will be available at launch. Include packages, formats, or capacity where useful.',
    placeholder: 'Currently available:\n\nPlanned for launch:',
  },
  {
    category: 'Legal',
    question: 'Is there a legal entity or formal structure we should reference?',
    helper: 'If applicable, include the registered name, entity type, jurisdiction, and registration status. Personal brands and early-stage projects can mark this N/A.',
    placeholder: 'Legal name / LLC, nonprofit, partnership, public body, or N/A',
  },
  {
    category: 'Credibility',
    question: 'What approvals, certifications, agreements, partnerships, awards, or recognitions have you received?',
    helper: 'Include anything that builds trust. Name the issuing organization, date, status, and scope when relevant, or mark this N/A.',
    placeholder: 'Recognition / organization / date / status / scope, or N/A',
  },
  {
    category: 'Clarity',
    question: 'What is confirmed today, and what is still proposed or planned?',
    helper: 'Separate live, signed, funded, approved, or operational facts from ideas and future intentions.',
    placeholder: 'Confirmed:\n\nProposed or planned:',
  },
  {
    category: 'Disclosure',
    question: 'What can we share publicly, and what must remain private or confidential?',
    helper: 'Flag sensitive people, processes, locations, designs, partners, client details, or technical information we must avoid.',
    placeholder: 'Safe to disclose:\n\nPrivate / confidential / do not disclose:',
  },
  {
    category: 'Status',
    question: 'What stage are you at right now?',
    helper: 'For example: idea, planning, pre-launch, active, growing, rebranding, fundraising, testing, construction, or fully operational.',
    placeholder: 'Right now, we are...',
  },
  {
    category: 'Infrastructure',
    question: 'What locations, facilities, platforms, or operational resources are involved?',
    helper: 'Include physical locations, service areas, digital platforms, equipment, or planned infrastructure. Mark N/A if none apply.',
    placeholder: 'Location / platform / resource / scale / status, or N/A',
  },
  {
    category: 'Outcomes',
    question: 'What outcomes are you trying to achieve?',
    helper: 'Define the commercial, creative, community, technical, social, or environmental result that matters most.',
    placeholder: 'The most important outcome is...',
  },
  {
    category: 'Partners',
    question: 'Who are your confirmed collaborators, vendors, suppliers, technology providers, or strategic partners?',
    helper: 'State each party\'s role and whether their name can be public. Solo operators or teams without partners can mark this N/A.',
    placeholder: 'Name / role / confirmed status / public or confidential, or N/A',
  },
  {
    category: 'Audience',
    question: 'Who do you most need to reach?',
    helper: 'Describe your primary customers, clients, users, supporters, members, donors, partners, communities, or stakeholders.',
    placeholder: 'Our primary audience is...',
  },
  {
    category: 'Opportunity',
    question: 'Are you seeking customers, funding, grants, sponsors, talent, collaborators, or partnerships?',
    helper: 'Describe the opportunity and the kind of support, capital, expertise, access, or relationship you want. Mark N/A if you are not seeking anything publicly.',
    placeholder: 'We are seeking... / We are not currently seeking...',
  },
  {
    category: 'Positioning',
    question: 'What makes your organization, offer, or approach meaningfully different?',
    helper: 'Consider your expertise, story, values, access, process, technology, pricing, community, intellectual property, or delivery model.',
    placeholder: 'People choose or support us because...',
  },
  {
    category: 'Brand',
    question: 'What existing brand materials do you have?',
    helper: 'List logos, guidelines, colors, fonts, photos, videos, decks, reports, websites, social accounts, and source files.',
    placeholder: 'We currently have... Include links where possible.',
  },
  {
    category: 'Roadmap',
    question: 'What are your major goals and milestones over the next 12 months, 1-3 years, and 3-5 years?',
    helper: 'Use the time horizons that fit your situation. Include measurable targets only when they are confirmed and approved.',
    placeholder: 'Next 12 months:\n\n1-3 years:\n\n3-5 years:',
  },
  {
    category: 'Claims',
    question: 'What claims, statistics, testimonials, results, partnerships, projections, or figures are approved for public use?',
    helper: 'Give the exact approved wording and a source for each claim when possible. Mark N/A if nothing has been formally approved yet.',
    placeholder: 'Approved claim / exact figure or quote / source / restrictions, or N/A',
  },
  {
    category: 'Approvals',
    question: 'Who provides information, feedback, and final approval?',
    helper: 'Include the main contacts, their roles, and the order of review. If you are the only decision-maker, say so.',
    placeholder: 'Main contact:\nContributors or reviewers:\nFinal approver:',
  },
  {
    category: 'Risk',
    question: 'What are the biggest challenges, risks, or limitations right now?',
    helper: 'Be candid. Consider time, budget, capacity, approvals, technology, supply, accessibility, staffing, reputation, or other constraints.',
    placeholder: 'The primary risks or limitations are...',
  },
  {
    category: 'Timeline',
    question: 'What is your expected timeline, including any target launch, campaign, event, or completion date?',
    helper: 'List key dates, dependencies, decision points, and whether each date is fixed, preferred, or estimated.',
    placeholder: 'Target date / milestone / dependency / fixed or flexible',
  },
  {
    category: 'Open Floor',
    question: 'Is there anything else you want us to know, and do you have any questions for us?',
    helper: 'Share anything the questions above did not cover, plus anything you want us to answer or clarify. We will respond to every question here directly.',
    placeholder: 'Anything else we should know:\n\nQuestions for Orbit:',
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
    'ORBIT WEBSITES — CLIENT DISCOVERY BRIEF',
    '========================================',
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
    anchor.download = `orbit-client-brief-${new Date().toISOString().slice(0, 10)}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function submitBrief(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')

    const payload = new FormData()
    payload.append('_subject', `New client discovery brief from ${respondentName}`)
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
            <div className="brief-kicker"><span /> Client discovery brief</div>
            <h1>Start with clarity.<br /><em>Build from there.</em></h1>
            <p className="brief-intro">
              Whether you represent a business, nonprofit, public initiative, personal brand, or new idea, this brief gives our team the context to do thoughtful work. If something does not apply, simply mark it N/A.
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
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <button className="brief-primary" type="submit">
                {answeredCount ? 'Continue your brief' : 'Start the brief'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <div className="brief-start-notes">
                <span><strong>{questions.length}</strong> focused questions</span>
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
              {!answers[step].trim() && (
                <button className="brief-na" type="button" onClick={() => updateAnswer('Not applicable')}>
                  Not applicable
                </button>
              )}
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
                <h1>Your brief,<br /><em>clearly mapped.</em></h1>
                <p>{answeredCount} of {questions.length} questions answered. You can edit, skip, or mark any question not applicable.</p>
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
                {submitting ? 'Sending…' : 'Send my brief'}
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
              Thanks, {respondentName.split(' ')[0]}. Your discovery brief has been sent to Orbit Websites. Keep a copy for your records below.
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
