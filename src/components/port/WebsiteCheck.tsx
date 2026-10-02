'use client'

import { useRef, useState, type FormEvent } from 'react'
import { site } from '@/content/site'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { cn } from '@/lib/cn'
import {
  hasErrors,
  validateCheckInput,
  validateCheckLead,
  type CheckInput,
  type CheckInputErrors,
  type CheckLeadErrors,
  type CheckLeadInput,
  type CheckStatus,
  type WebsiteCheckReport,
} from '@/lib/websiteCheck'

// Free website & Google check — calls POST /api/website-check, then offers the
// "full report + free homepage mockup" lead form (POST /api/website-check/lead).
// Validation is shared with both routes via lib/websiteCheck.ts.

const STATUS_STYLE: Record<CheckStatus, { label: string; cls: string }> = {
  pass: { label: 'Pass', cls: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' },
  warn: { label: 'Needs work', cls: 'border-amber-400/40 bg-amber-400/10 text-amber-200' },
  fail: { label: 'Fail', cls: 'border-red-400/40 bg-red-400/10 text-red-300' },
  unavailable: { label: 'Not checked', cls: 'border-line-strong bg-bg/40 text-dim' },
}

function scoreTone(score: number) {
  if (score >= 85) return 'text-emerald-300'
  if (score >= 65) return 'text-accent'
  if (score >= 40) return 'text-amber-200'
  return 'text-red-300'
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  autoComplete,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  type?: string
  autoComplete?: string
  hint?: string
}) {
  const described = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={described}
        className={cn(
          'w-full rounded-2xl border bg-bg/60 px-4 py-3.5 text-fg outline-none transition-colors duration-[var(--d-sm)] placeholder:text-dim focus:border-accent',
          error ? 'border-red-400/80' : 'border-line-strong',
        )}
      />
      {hint && !error ? (
        <span id={`${id}-hint`} className="mt-1.5 block text-xs text-dim">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${id}-err`} className="mt-1.5 block text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  )
}

function SubmitButton({ busy, idle, busyText }: { busy: boolean; idle: string; busyText: string }) {
  return (
    <button type="submit" disabled={busy} className="btn btn-primary w-full justify-between disabled:opacity-60 sm:w-auto">
      <span>{busy ? busyText : idle}</span>
      <span className="btn-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={busy ? 'animate-spin' : undefined}>
          {busy ? (
            <path d="M21 12a9 9 0 1 1-6.2-8.56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          ) : (
            <path d="M1 12h19M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </span>
    </button>
  )
}

export function WebsiteCheck() {
  const [input, setInput] = useState<CheckInput>({ name: '', town: '', url: '' })
  const [errors, setErrors] = useState<CheckInputErrors>({})
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState('')
  const [report, setReport] = useState<WebsiteCheckReport | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  async function runCheck(event: FormEvent) {
    event.preventDefault()
    if (running) return
    const nextErrors = validateCheckInput(input)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setRunning(true)
    setRunError('')
    setReport(null)
    try {
      const response = await fetch('/api/website-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = (await response.json().catch(() => null)) as (WebsiteCheckReport & { error?: { message?: string } }) | null
      if (!response.ok || !data || data.error) {
        throw new Error(data?.error?.message ?? `Request failed: ${response.status}`)
      }
      setReport(data)
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } catch (err) {
      setRunError(err instanceof Error && err.message && !err.message.startsWith('Request failed') ? err.message : 'The check didn’t go through. Please try again in a moment.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <>
      <section id="check" aria-labelledby="check-title" className="container-x scroll-mt-28 pb-12">
        <form onSubmit={runCheck} noValidate className="page-fade grid gap-5 rounded-[var(--radius)] border border-line bg-panel/70 p-6 md:p-8">
          <div>
            <SectionLabel>[RUN THE CHECK // ABOUT 20 SECONDS]</SectionLabel>
            <h2 id="check-title" className="display t-3 mt-4">
              Tell us who you are and where you work.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Field
              id="wc-name"
              label="Business name"
              value={input.name}
              onChange={(v) => setInput((p) => ({ ...p, name: v }))}
              error={errors.name}
              placeholder="e.g. Princeton Heating & Cooling"
              autoComplete="organization"
            />
            <Field
              id="wc-town"
              label="Town"
              value={input.town}
              onChange={(v) => setInput((p) => ({ ...p, town: v }))}
              error={errors.town}
              placeholder="e.g. Plainsboro"
              autoComplete="address-level2"
            />
            <Field
              id="wc-url"
              label="Website (optional)"
              value={input.url}
              onChange={(v) => setInput((p) => ({ ...p, url: v }))}
              error={errors.url}
              placeholder="yourbusiness.com"
              type="text"
              autoComplete="url"
              hint="No website? Leave it blank."
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SubmitButton busy={running} idle="Check my website" busyText="Checking…" />
            <p className="text-sm text-dim">Free, no sign-up. We read your homepage and ask Google PageSpeed for a mobile score.</p>
          </div>
          {running ? (
            <p role="status" className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">
              Loading your homepage, checking Google basics and running a mobile speed test. This can take up to 20 seconds.
            </p>
          ) : null}
          {runError ? (
            <p role="alert" className="text-sm text-red-300">
              {runError}
            </p>
          ) : null}
        </form>
      </section>

      <div ref={resultsRef} aria-live="polite" className="scroll-mt-28">
        {report ? (
          <>
            <ReportCard report={report} />
            <LeadCapture report={report} />
          </>
        ) : null}
      </div>
    </>
  )
}

function ReportCard({ report }: { report: WebsiteCheckReport }) {
  if (!report.hasWebsite && report.noWebsite) {
    const nw = report.noWebsite
    return (
      <section aria-labelledby="report-title" className="container-x pb-10">
        <div className="rounded-[var(--radius)] border border-red-400/40 bg-[radial-gradient(ellipse_at_top_right,rgba(248,113,113,0.12),transparent_60%),var(--panel)] p-6 md:p-10">
          <SectionLabel>[YOUR REPORT // NO WEBSITE]</SectionLabel>
          <h2 id="report-title" className="display t-2 mt-5 max-w-[22ch] text-balance text-red-300">
            {nw.headline}
          </h2>
          <p className="t-lead mt-5 max-w-3xl text-muted">{report.summary}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <p className="label text-accent">What it&apos;s costing you</p>
              <ul className="mt-4 grid gap-3">
                {nw.costs.map((cost) => (
                  <li key={cost} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-300" aria-hidden="true" />
                    {cost}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-accent">Next steps</p>
              <ol className="mt-4 grid gap-3">
                {nw.nextSteps.map((step, i) => (
                  <li key={step} className="flex gap-3 leading-relaxed text-muted">
                    <span className="font-mono text-[0.75rem] text-accent">0{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { metrics } = report
  const stats: Array<[string, string]> = []
  if (metrics.pageSpeed) stats.push(['Mobile speed score', `${metrics.pageSpeed.performance}/100`])
  if (metrics.pageSpeed?.lcpDisplay) stats.push(['Main content loads in', metrics.pageSpeed.lcpDisplay])
  if (metrics.responseTimeMs !== null) stats.push(['Server response', `${metrics.responseTimeMs} ms`])
  if (metrics.htmlBytes !== null) stats.push(['HTML size', `${Math.max(1, Math.round(metrics.htmlBytes / 1000))} KB`])

  return (
    <section aria-labelledby="report-title" className="container-x pb-10">
      <div className="rounded-[var(--radius)] border border-accent/30 bg-[radial-gradient(ellipse_at_top_right,rgba(214,179,106,0.14),transparent_60%),var(--panel)] p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <SectionLabel>[YOUR REPORT]</SectionLabel>
            <p className={cn('display mt-4 text-[clamp(4rem,12vw,7rem)] leading-none', scoreTone(report.score))}>
              {report.score}
              <span className="text-[0.35em] text-dim">/100</span>
            </p>
            <h2 id="report-title" className="display mt-3 text-2xl">
              {report.grade}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="t-lead text-muted">{report.summary}</p>
            {report.url?.final ? <p className="mt-3 break-all font-mono text-[0.72rem] uppercase tracking-[0.1em] text-dim">Checked: {report.url.final}</p> : null}
            {stats.length ? (
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-line bg-bg/40 px-4 py-3">
                    <dt className="text-xs text-dim">{label}</dt>
                    <dd className="display mt-1 text-lg">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {metrics.pageSpeedNote ? <p className="mt-4 text-sm text-dim">{metrics.pageSpeedNote}</p> : null}
          </div>
        </div>

        {report.fixes.length ? (
          <div className="mt-10 rounded-2xl border border-accent/25 bg-accent/5 p-5 md:p-6">
            <p className="label text-accent">Fix these first</p>
            <ol className="mt-4 grid gap-3">
              {report.fixes.slice(0, 5).map((fix, i) => (
                <li key={fix} className="flex gap-3 leading-relaxed">
                  <span className="font-mono text-[0.75rem] text-accent">0{i + 1}</span>
                  {fix}
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {report.checks.map((c) => (
            <li key={c.id} className="grid gap-2 py-4 sm:grid-cols-12 sm:gap-4">
              <div className="sm:col-span-3">
                <span className={cn('inline-block rounded-full border px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.1em]', STATUS_STYLE[c.status].cls)}>
                  {STATUS_STYLE[c.status].label}
                </span>
              </div>
              <div className="sm:col-span-9">
                <p className="text-fg">{c.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">{c.detail}</p>
                {c.fix ? <p className="mt-1 text-sm leading-relaxed text-accent-hi">Fix: {c.fix}</p> : null}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-dim">
          Score covers {report.checksRun} of {report.checksTotal} checks. Anything marked &quot;Not checked&quot; couldn&apos;t run and doesn&apos;t count for or against you. We
          only look at your homepage.
        </p>
      </div>
    </section>
  )
}

function LeadCapture({ report }: { report: WebsiteCheckReport }) {
  const [lead, setLead] = useState<CheckLeadInput>({ contactName: '', phone: '', email: '' })
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<CheckLeadErrors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (sending) return
    const nextErrors = validateCheckLead(lead)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setSending(true)
    setSendError('')
    try {
      const response = await fetch('/api/website-check/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          company_website: honeypot,
          businessName: report.business.name,
          town: report.business.town,
          url: report.url?.final ?? report.url?.input ?? '',
          report: {
            score: report.score,
            grade: report.grade,
            hasWebsite: report.hasWebsite,
            summary: report.summary,
            issues: report.checks.filter((c) => c.status === 'fail' || c.status === 'warn').map((c) => `${c.label}: ${c.status === 'fail' ? 'fail' : 'needs work'}`),
            fixes: report.fixes,
          },
        }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setSent(true)
    } catch {
      setSendError(`Something didn't go through. Text or call ${site.phoneDisplay}, or email ${site.email}, and we'll take it from there.`)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <section className="container-x pb-16">
        <div role="status" className="rounded-[var(--radius)] border border-accent/30 bg-accent/10 p-6 md:p-10">
          <p className="display t-3">Got it. Your full report and homepage mockup are on the way.</p>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            We&apos;ll reach out at the {lead.phone && lead.email ? 'number or email' : lead.phone ? 'number' : 'email'} you gave us. If you don&apos;t hear from us within a
            business day, call or text {site.phoneDisplay}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="lead-title" className="container-x pb-16">
      <form onSubmit={submit} noValidate className="grid gap-5 rounded-[var(--radius)] border border-line bg-panel/70 p-6 md:p-8">
        <div>
          <SectionLabel>[FREE // NO OBLIGATION]</SectionLabel>
          <h2 id="lead-title" className="display t-3 mt-4 max-w-[26ch]">
            Send me the full report + a free homepage mockup
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            A real person at {site.name} reviews your results, writes up the fixes in order, and mocks up what a better homepage for {report.business.name} could look like.
            Phone or email, whichever you prefer.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Field id="wcl-name" label="Your name" value={lead.contactName} onChange={(v) => setLead((p) => ({ ...p, contactName: v }))} error={errors.contactName} autoComplete="name" placeholder="Your full name" />
          <Field id="wcl-phone" label="Phone" value={lead.phone} onChange={(v) => setLead((p) => ({ ...p, phone: v }))} error={errors.phone} type="tel" autoComplete="tel" placeholder="609 662 8052" />
          <Field id="wcl-email" label="Email" value={lead.email} onChange={(v) => setLead((p) => ({ ...p, email: v }))} error={errors.email} type="email" autoComplete="email" placeholder="you@business.com" />
        </div>
        {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="wcl-company-website">Company website</label>
          <input id="wcl-company-website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>
        {sendError ? (
          <p role="alert" className="text-sm text-red-300">
            {sendError}
          </p>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SubmitButton busy={sending} idle="Send me the full report" busyText="Sending…" />
          <p className="text-sm text-dim">Goes straight to us. No spam, no mailing list.</p>
        </div>
      </form>
    </section>
  )
}
