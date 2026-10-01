'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { briefQuestions as questions } from '@/content/brief'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { cn } from '@/lib/cn'

// Old src/ProjectBrief.tsx — same 21 questions, local draft autosave, copy /
// download, and the same formsubmit.co payload. Restyled for the new design.

type SavedBrief = { answers: string[]; respondentName: string; respondentEmail: string; savedAt: string }

const STORAGE_KEY = 'orbit-project-brief-v1'
const SUBMIT_URL = 'https://formsubmit.co/ajax/alex@orbitboyzz.me'

function answerLabel(index: number) {
  return `Q${String(index + 1).padStart(2, '0')}`
}

function buildSummary(name: string, email: string, answers: string[]) {
  const lines = ['ORBIT WEBSITES — CLIENT DISCOVERY BRIEF', '========================================', `Prepared by: ${name}`, `Email: ${email}`, `Submitted: ${new Date().toLocaleString()}`, '']
  questions.forEach((item, index) => {
    lines.push(`${answerLabel(index)} — ${item.category.toUpperCase()}`)
    lines.push(item.question)
    lines.push(answers[index]?.trim() || '[No answer provided]')
    lines.push('')
  })
  return lines.join('\n')
}

const enter = { '--delay': '-400ms' } as CSSProperties

function Arrow({ left = false }: { left?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={left ? 'rotate-180' : undefined}>
      <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PrimaryButton({ children, type = 'button', onClick, disabled, className }: { children: ReactNode; type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn('btn btn-primary disabled:opacity-60', className)}>
      <span>{children}</span>
      <span className="btn-arrow">
        <Arrow />
      </span>
    </button>
  )
}

export function ProjectBrief() {
  const [step, setStep] = useState(-1)
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

  const answeredCount = useMemo(() => answers.filter((a) => a.trim()).length, [answers])
  const isReview = step === questions.length
  const isQuestion = step >= 0 && step < questions.length
  const progress = isReview ? 100 : isQuestion ? ((step + 1) / questions.length) * 100 : 0

  // Restore a saved draft from this device.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as SavedBrief
        if (Array.isArray(saved.answers)) {
          /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage once on mount */
          setAnswers(questions.map((_, i) => saved.answers[i] ?? ''))
          setRespondentName(saved.respondentName ?? '')
          setRespondentEmail(saved.respondentEmail ?? '')
          setSavedAt(saved.savedAt ?? null)
          /* eslint-enable react-hooks/set-state-in-effect */
        }
      }
    } catch {
      // A damaged local draft should never stop someone from using the form.
    } finally {
      setLoaded(true)
    }
  }, [])

  // Autosave.
  useEffect(() => {
    if (!loaded || submitted) return
    const savedAtIso = new Date().toISOString()
    const draft: SavedBrief = { answers, respondentName, respondentEmail, savedAt: savedAtIso }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reflects the save that just happened
      setSavedAt(savedAtIso)
    } catch {
      // Storage can be unavailable (private mode) — the form still works.
    }
  }, [answers, loaded, respondentEmail, respondentName, submitted])

  useEffect(() => {
    if (!isQuestion) return
    const timer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 360)
    return () => window.clearTimeout(timer)
  }, [isQuestion, step])

  function goTo(nextStep: number) {
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateAnswer(value: string) {
    setAnswers((current) => current.map((a, i) => (i === step ? value : a)))
  }

  function next() {
    if (!isQuestion) return
    goTo(step === questions.length - 1 ? questions.length : step + 1)
  }

  function previous() {
    if (isReview) goTo(questions.length - 1)
    else if (isQuestion) goTo(step - 1)
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
    goTo(-1)
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

    // Same payload as the old form (formsubmit.co "table" template).
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
      const response = await fetch(SUBMIT_URL, { method: 'POST', headers: { Accept: 'application/json' }, body: payload })
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

  const inFlow = step >= 0 && step <= questions.length

  return (
    <div className="relative pb-24 pt-[calc(var(--nav-h)+2.5rem)] md:pt-[calc(var(--nav-h)+4.5rem)]">
      {inFlow && (
        <div className="sticky top-[var(--nav-h)] z-20 border-b border-line bg-bg/80 backdrop-blur-xl">
          <div className="container-x flex items-center justify-between gap-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-dim">
            <span>{isReview ? 'Review' : `${String(step + 1).padStart(2, '0')} / ${questions.length}`}</span>
            <span className="inline-flex items-center gap-2 text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {savedAt ? 'Draft saved' : 'Autosave on'}
            </span>
          </div>
          <div className="h-px w-full bg-line" role="progressbar" aria-label={`${Math.round(progress)}% complete`} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-px bg-accent shadow-[0_0_12px_var(--accent-glow)] transition-[width] duration-[var(--d-md)] ease-[var(--ease-out)]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="container-x">
        {step === -1 && (
          <section key="welcome" className="page-fade mx-auto max-w-4xl pt-6" style={enter}>
            <SectionLabel>[Client discovery brief]</SectionLabel>
            <h1 className="display t-1 mt-7 text-balance">
              Start with clarity. <span className="serif-accent text-accent">Build from there.</span>
            </h1>
            <p className="t-lead mt-8 max-w-[62ch] text-muted">
              Whether you represent a business, nonprofit, public initiative, personal brand, or new idea, this brief gives our team the context to do thoughtful work. If
              something does not apply, simply mark it N/A.
            </p>

            <form
              className="mt-10 rounded-[var(--radius)] border border-line bg-panel/70 p-6 md:p-8"
              onSubmit={(e) => {
                e.preventDefault()
                goTo(0)
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="label mb-2 block">Your name</span>
                  <input
                    required
                    autoComplete="name"
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-2xl border border-line-strong bg-bg/60 px-4 py-3.5 outline-none transition-colors placeholder:text-dim focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="label mb-2 block">Best email</span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={respondentEmail}
                    onChange={(e) => setRespondentEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-line-strong bg-bg/60 px-4 py-3.5 outline-none transition-colors placeholder:text-dim focus:border-accent"
                  />
                </label>
              </div>
              <PrimaryButton type="submit" className="mt-6">
                {answeredCount ? 'Continue your brief' : 'Start the brief'}
              </PrimaryButton>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6 text-sm text-muted">
                <div>
                  <dt className="display text-2xl text-fg">{questions.length}</dt>
                  <dd>focused questions</dd>
                </div>
                <div>
                  <dt className="display text-2xl text-fg">~15</dt>
                  <dd>minutes</dd>
                </div>
                <div>
                  <dt className="display text-2xl text-fg">100%</dt>
                  <dd>free</dd>
                </div>
              </dl>
            </form>
            <p className="mt-5 text-sm text-dim">Your progress is saved privately on this device until you submit.</p>
          </section>
        )}

        {isQuestion && (
          <section key={`question-${step}`} className="page-fade mx-auto max-w-4xl pt-10" style={enter} aria-labelledby="brief-question">
            <p className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
              <span className="text-accent">{answerLabel(step)}</span>
              <span className="text-muted">{questions[step].category}</span>
              <span className="text-dim">
                {step + 1} / {questions.length}
              </span>
            </p>
            <h2 id="brief-question" className="display t-2 mt-6 max-w-[24ch] text-balance">
              {questions[step].question}
            </h2>
            <p className="mt-5 max-w-[62ch] leading-relaxed text-muted">{questions[step].helper}</p>

            <label className="relative mt-8 block">
              <span className="sr-only">Your answer</span>
              <textarea
                ref={inputRef}
                value={answers[step]}
                onChange={(e) => updateAnswer(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={questions[step].placeholder}
                rows={7}
                className="w-full resize-y rounded-[var(--radius)] border border-line-strong bg-panel/70 px-5 py-4 text-[1.05rem] leading-relaxed outline-none transition-colors placeholder:text-dim focus:border-accent"
              />
              <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-dim">
                {answers[step].length.toLocaleString()} characters
              </span>
            </label>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={next}>{step === questions.length - 1 ? 'Review answers' : 'Next question'}</PrimaryButton>
              {!answers[step].trim() && (
                <button type="button" onClick={() => updateAnswer('Not applicable')} className="btn btn-ghost px-6!">
                  Not applicable
                </button>
              )}
              <span className="hidden text-sm text-dim sm:inline">
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs">Ctrl</kbd> + <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to continue
              </span>
            </div>
          </section>
        )}

        {isReview && (
          <section key="review" className="page-fade mx-auto max-w-5xl pt-10" style={enter}>
            <SectionLabel>[Final review]</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="display t-1 text-balance">
                  Your brief, <span className="serif-accent text-accent">clearly mapped.</span>
                </h1>
                <p className="mt-5 max-w-xl text-muted">
                  {answeredCount} of {questions.length} questions answered. You can edit, skip, or mark any question not applicable.
                </p>
              </div>
              <p className="display shrink-0 text-6xl" aria-label={`${answeredCount} of ${questions.length} answered`}>
                {answeredCount}
                <span className="text-2xl text-dim"> / {questions.length}</span>
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={copySummary} className="btn btn-ghost btn-sm px-5!">
                {copied ? 'Copied' : 'Copy all'}
              </button>
              <button type="button" onClick={downloadSummary} className="btn btn-ghost btn-sm px-5!">
                Download copy
              </button>
            </div>

            <ol className="mt-8 border-t border-line">
              {questions.map((item, index) => (
                <li key={item.question} className="border-b border-line">
                  <button type="button" onClick={() => goTo(index)} className="group grid w-full grid-cols-[3rem_1fr_auto] items-start gap-4 py-5 text-left">
                    <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">{answerLabel(index)}</span>
                    <span>
                      <strong className="block font-medium leading-snug">{item.question}</strong>
                      <span className={cn('mt-1.5 block whitespace-pre-line text-sm leading-relaxed', answers[index].trim() ? 'text-muted' : 'italic text-dim')}>
                        {answers[index].trim() || 'No answer yet — click to add one'}
                      </span>
                    </span>
                    <span className="mt-1 text-dim transition-colors group-hover:text-accent">
                      <Arrow />
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <form onSubmit={submitBrief} className="mt-10 flex flex-col justify-between gap-6 rounded-[var(--radius)] border border-accent/30 bg-panel/70 p-6 md:flex-row md:items-center md:p-8">
              <div>
                <p className="label text-accent">Ready to send?</p>
                <h3 className="display t-3 mt-3">Deliver this brief to Orbit Websites.</h3>
                <p className="mt-3 max-w-xl text-muted">You’ll keep a local copy, and our team will receive your answers at alex@orbitboyzz.me.</p>
              </div>
              <PrimaryButton type="submit" disabled={submitting} className="shrink-0">
                {submitting ? 'Sending…' : 'Send my brief'}
              </PrimaryButton>
            </form>
            {submitError && (
              <p className="mt-4 text-sm text-red-300" role="alert">
                {submitError}
              </p>
            )}
          </section>
        )}

        {step === questions.length + 1 && (
          <section key="success" className="page-fade mx-auto max-w-3xl pt-10 text-center" style={enter} role="status">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent text-accent-ink" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mt-8 flex justify-center">
              <SectionLabel>[Transmission complete]</SectionLabel>
            </div>
            <h1 className="display t-1 mt-6 text-balance">
              Brief received. <span className="serif-accent text-accent">We’re in orbit.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-muted">
              Thanks, {respondentName.split(' ')[0]}. Your discovery brief has been sent to Orbit Websites. Keep a copy for your records below.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <PrimaryButton onClick={downloadSummary}>Download my copy</PrimaryButton>
              <TransitionLink href="/" className="btn btn-ghost px-6!">
                Visit Orbit Websites
              </TransitionLink>
            </div>
          </section>
        )}

        {inFlow && (
          <nav aria-label="Form navigation" className="mx-auto mt-12 flex max-w-4xl items-center justify-between gap-4 border-t border-line pt-6">
            <button type="button" onClick={previous} aria-label="Previous question" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong transition-colors hover:border-accent hover:text-accent">
              <Arrow left />
            </button>
            <button type="button" onClick={resetBrief} className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-dim transition-colors hover:text-fg">
              ↺ Start over
            </button>
            <button
              type="button"
              onClick={() => (isReview ? goTo(0) : next())}
              aria-label={isReview ? 'Return to first question' : 'Next question'}
              className="grid h-11 w-11 place-items-center rounded-full border border-line-strong transition-colors hover:border-accent hover:text-accent"
            >
              <Arrow />
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
