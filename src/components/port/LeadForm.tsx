'use client'

import { useState, type FormEvent } from 'react'
import { site } from '@/content/site'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { cn } from '@/lib/cn'
import { hasLeadFormErrors, validateLeadForm, type LeadFormErrors, type LeadFormInput } from '@/lib/leadForm'

// Old src/LeadForm.tsx — same fields, validation (lib/leadForm.ts), endpoint and copy.
const phone = '609 662 8052'
const email = site.email

const emptyInput: LeadFormInput = { businessName: '', industry: '', contactName: '', phone: '', email: '', details: '' }

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  textarea = false,
  autoComplete,
}: {
  label: string
  name: keyof LeadFormInput
  value: string
  onChange: (name: keyof LeadFormInput, value: string) => void
  error?: string
  placeholder?: string
  type?: string
  textarea?: boolean
  autoComplete?: string
}) {
  const id = `lead-${name}`
  const shared = cn(
    'w-full rounded-2xl border bg-bg/60 px-4 py-3.5 text-fg outline-none transition-colors duration-[var(--d-sm)] placeholder:text-dim focus:border-accent',
    error ? 'border-red-400/80' : 'border-line-strong',
  )
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={4}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(shared, 'resize-none')}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className={shared}
        />
      )}
      {error ? (
        <span id={`${id}-err`} className="mt-1.5 block text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  )
}

export function LeadForm() {
  const [input, setInput] = useState<LeadFormInput>(emptyInput)
  const [errors, setErrors] = useState<LeadFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update(name: keyof LeadFormInput, value: string) {
    setInput((prev) => ({ ...prev, [name]: value }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validateLeadForm(input)
    setErrors(nextErrors)
    if (hasLeadFormErrors(nextErrors)) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/lead-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setSubmitted(true)
    } catch {
      setSubmitError(`Something didn't go through. Text or call ${phone}, or email ${email} directly and we'll get it from there.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="container-x pb-24 pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
        <div role="status" className="mx-auto max-w-3xl rounded-[var(--radius)] border border-accent/30 bg-accent/10 p-8 text-center md:p-12">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="display t-3 mt-6">Got it — we&apos;ll text you shortly.</h1>
          <p className="mt-4 leading-relaxed text-muted">
            Check your email for a quick confirmation, and expect a text at the number you gave us. If you don&apos;t hear anything within a few hours, call or email us
            directly — {phone} / {email}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="container-x pb-10 pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>[AGENT BUILD // TELL US ABOUT YOUR BUSINESS]</SectionLabel>
          <h1 className="display t-1 mt-7 text-balance">
            <span className="mask">
              <span className="page-rise">
                Want this agent built for <span className="serif-accent text-accent">your business?</span>
              </span>
            </span>
          </h1>
          <p className="page-fade t-lead mt-7 max-w-2xl text-muted">Tell us a bit about your business and we&apos;ll reach out — usually within minutes, always same day.</p>
        </div>
      </section>

      <section className="container-x pb-24">
        <form onSubmit={submit} noValidate className="page-fade mx-auto grid max-w-3xl gap-5 rounded-[var(--radius)] border border-line bg-panel/70 p-6 md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name" name="businessName" value={input.businessName} onChange={update} error={errors.businessName} placeholder="e.g. Princeton Family Dental" autoComplete="organization" />
            <Field label="What kind of business" name="industry" value={input.industry} onChange={update} error={errors.industry} placeholder="e.g. HVAC, salon, dental, contractor" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" name="contactName" value={input.contactName} onChange={update} error={errors.contactName} placeholder="Your full name" autoComplete="name" />
            <Field label="Phone (we'll text this number)" name="phone" value={input.phone} onChange={update} error={errors.phone} placeholder="609 662 8052" type="tel" autoComplete="tel" />
          </div>
          <Field label="Email" name="email" value={input.email} onChange={update} error={errors.email} placeholder="you@business.com" type="email" autoComplete="email" />
          <Field
            label="What should the agent do? (optional)"
            name="details"
            value={input.details}
            onChange={update}
            error={errors.details}
            placeholder="e.g. answer missed calls and book jobs, follow up on quotes, respond to reviews..."
            textarea
          />

          {submitError ? (
            <p role="alert" className="text-sm text-red-300">
              {submitError}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="btn btn-primary mt-2 w-full justify-between disabled:opacity-60 sm:w-auto sm:justify-self-start">
            <span>{submitting ? 'Sending...' : 'Send it over'}</span>
            <span className="btn-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={submitting ? 'animate-spin' : undefined}>
                {submitting ? (
                  <path d="M21 12a9 9 0 1 1-6.2-8.56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                ) : (
                  <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                )}
              </svg>
            </span>
          </button>
        </form>
      </section>
    </>
  )
}
