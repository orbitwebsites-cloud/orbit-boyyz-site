import { motion } from 'framer-motion'
import { Check, LoaderCircle, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { hasLeadFormErrors, validateLeadForm, type LeadFormErrors, type LeadFormInput } from './lib/leadForm'

const spring = { type: 'spring' as const, stiffness: 150, damping: 20 }
const phone = '609 662 8052'
const email = 'orbitboyzz@gmail.com'

const emptyInput: LeadFormInput = {
  businessName: '',
  industry: '',
  contactName: '',
  phone: '',
  email: '',
  details: '',
}

function Label({ children }: { children: string }) {
  return <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#166534]">{children}</p>
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  textarea = false,
}: {
  label: string
  name: keyof LeadFormInput
  value: string
  onChange: (name: keyof LeadFormInput, value: string) => void
  error?: string
  placeholder?: string
  type?: string
  textarea?: boolean
}) {
  const shared =
    'w-full rounded-xl border bg-white px-4 py-3 font-light text-[#111b17] outline-none transition-colors placeholder:text-[#a4aca6] focus:border-[#166534]/60'
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-[#66716c]">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${shared} resize-none ${error ? 'border-red-400' : 'border-[#dce2dd]'}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          placeholder={placeholder}
          className={`${shared} ${error ? 'border-red-400' : 'border-[#dce2dd]'}`}
        />
      )}
      {error ? <span className="mt-1.5 block text-xs text-red-500">{error}</span> : null}
    </label>
  )
}

export default function LeadForm() {
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
      setSubmitError(
        `Something didn't go through. Text or call ${phone}, or email ${email} directly and we'll get it from there.`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="pt-36 md:pt-44">
        <section className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#166534]/20 bg-[#166534]/10 p-8 text-center md:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#166534] text-white">
              <Check size={26} />
            </div>
            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-[#111b17] md:text-4xl">
              Got it — we'll text you shortly.
            </h1>
            <p className="mt-4 font-light leading-relaxed text-[#66716c]">
              Check your email for a quick confirmation, and expect a text at the number you gave us.
              If you don't hear anything within a few hours, call or email us directly — {phone} / {email}.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Label>[AGENT BUILD // TELL US ABOUT YOUR BUSINESS]</Label>
          <h1 className="mt-6 font-display text-[clamp(40px,7vw,72px)] font-extrabold leading-[0.9] tracking-tight text-[#111b17]">
            Want this agent built for your business?
          </h1>
          <p className="mt-6 max-w-2xl font-light leading-relaxed text-[#66716c]">
            Tell us a bit about your business and we'll reach out — usually within minutes, always same day.
          </p>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="mx-auto grid max-w-3xl gap-5 rounded-2xl border border-[#dce2dd] bg-white p-6 md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Business name"
              name="businessName"
              value={input.businessName}
              onChange={update}
              error={errors.businessName}
              placeholder="e.g. Princeton Family Dental"
            />
            <Field
              label="What kind of business"
              name="industry"
              value={input.industry}
              onChange={update}
              error={errors.industry}
              placeholder="e.g. HVAC, salon, dental, contractor"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Your name"
              name="contactName"
              value={input.contactName}
              onChange={update}
              error={errors.contactName}
              placeholder="Your full name"
            />
            <Field
              label="Phone (we'll text this number)"
              name="phone"
              value={input.phone}
              onChange={update}
              error={errors.phone}
              placeholder="609 662 8052"
              type="tel"
            />
          </div>
          <Field
            label="Email"
            name="email"
            value={input.email}
            onChange={update}
            error={errors.email}
            placeholder="you@business.com"
            type="email"
          />
          <Field
            label="What should the agent do? (optional)"
            name="details"
            value={input.details}
            onChange={update}
            error={errors.details}
            placeholder="e.g. answer missed calls and book jobs, follow up on quotes, respond to reviews..."
            textarea
          />

          {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -2 }}
            transition={spring}
            className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#dce2dd] bg-[#111b17] px-6 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-[#166534] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle size={16} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send size={16} /> Send it over
              </>
            )}
          </motion.button>
        </motion.form>
      </section>
    </main>
  )
}
