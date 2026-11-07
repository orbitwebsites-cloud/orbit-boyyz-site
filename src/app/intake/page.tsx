'use client'

// /intake: one question per screen, like a typeform. The answers are posted as a normal form to
// FormSubmit (browsers block its AJAX endpoint), which emails OrbitBoyzz@gmail.com and sends the
// visitor back here. Noindex, not linked.

import { useState } from 'react'

type Q = { key: string; label: string; kind: 'yesno' | 'text' | 'long' | 'email' | 'tel' | 'choice'; options?: string[]; required?: boolean; hint?: string }

const QUESTIONS: Q[] = [
  { key: 'is_owner', label: 'Are you a business owner or the person who makes the decisions?', kind: 'yesno', required: true },
  { key: 'name', label: 'What’s your name?', kind: 'text', required: true },
  { key: 'company', label: 'What’s the name of your company?', kind: 'text', required: true },
  { key: 'email', label: 'What’s your work email?', kind: 'email', required: true },
  { key: 'phone', label: 'What’s the best phone number to reach you?', kind: 'tel' },
  { key: 'website', label: 'What’s your website?', kind: 'text' },
  { key: 'role', label: 'What’s your role?', kind: 'choice', options: ['Owner / founder', 'Partner', 'Sales lead', 'Marketing lead', 'Other'], required: true },
  { key: 'team_size', label: 'How many people work at your company?', kind: 'choice', options: ['Just me', '2–5', '6–10', '11–25', '25+'], required: true },
  { key: 'what_you_sell', label: 'What exactly do you sell, and to whom?', kind: 'long', hint: 'Describe the service in your own words.', required: true },
  { key: 'icp', label: 'Who is your ideal client? Think industry, company size, and where they are.', kind: 'long', required: true },
  { key: 'deal_size', label: 'What does one typical job or deal bring in?', kind: 'choice', options: ['Under $1,000', '$1,000–5,000', '$5,000–20,000', '$20,000+', 'Not sure'] },
  { key: 'how_you_get_clients', label: 'How do you get new clients today?', kind: 'long', hint: 'Referrals, ads, cold outreach, events, search, other.' },
  { key: 'clients_per_month', label: 'How many new clients and contacts per month do you want?', kind: 'text', hint: 'For example: 10 clients and 1,000 contacts a month.' },
  { key: 'tried', label: 'What have you already tried to get leads, and what happened?', kind: 'long' },
  { key: 'bottleneck', label: 'What’s the biggest thing slowing your growth right now?', kind: 'long', required: true },
  { key: 'tools', label: 'Which tools do you use? (CRM, outreach, lead data, scheduling, other)', kind: 'long' },
  { key: 'area', label: 'Which cities, states or regions do you serve?', kind: 'text' },
  { key: 'timing', label: 'When would you want to start?', kind: 'choice', options: ['This month', 'Next month', 'Within 3 months', 'Just exploring'] },
  { key: 'notes', label: 'Anything else we should know before the call?', kind: 'long' },
]

export default function IntakePage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function send() {
    setError('')
    setSending(true)
    const fields: Record<string, string> = { ...answers, business: answers.company || '', contact_name: answers.name || '' }
    try {
      const res = await fetch('/api/crm-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'intake', fields }) })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) throw new Error('not saved')
      setSent(true)
    } catch {
      setError('That didn’t go through. Your answers are still here. Try again.')
    } finally {
      setSending(false)
    }
  }

  const done = step >= QUESTIONS.length
  const q = QUESTIONS[step]
  const value = q ? answers[q.key] || '' : ''

  function set(v: string) {
    setAnswers({ ...answers, [q.key]: v })
  }

  function next() {
    setError('')
    if (q.required && !value.trim()) {
      setError('This one’s needed to continue.')
      return
    }
    if (q.kind === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setError('That email doesn’t look right.')
      return
    }
    setStep(step + 1)
  }

  if (sent) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-semibold">Thanks, that’s everything.</h1>
        <p className="mt-3 text-neutral-300">We’ll review your answers before the call and reach out to confirm the time.</p>
      </main>
    )
  }

  if (done) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Last step</h1>
        <p className="mt-3 text-neutral-300">Check your answers, then send.</p>
        <div className="mt-8">
          <ul className="space-y-3 text-sm text-neutral-300">
            {QUESTIONS.filter((item) => answers[item.key]).map((item) => (
              <li key={item.key}>
                <span className="block text-neutral-500">{item.label}</span>
                <span className="text-white">{answers[item.key]}</span>
              </li>
            ))}
          </ul>
          {error && <p className="mt-4 text-red-400">{error}</p>}
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setStep(step - 1)} disabled={sending} className="rounded-full border border-neutral-600 px-5 py-3 text-neutral-200 disabled:opacity-50">Back</button>
            <button type="button" onClick={send} disabled={sending} className="rounded-full bg-amber-400 px-6 py-3 font-medium text-black disabled:opacity-60">
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <p className="text-sm text-neutral-500">{step + 1} of {QUESTIONS.length}</p>
      <h1 className="mt-3 text-2xl font-semibold">{q.label}</h1>
      {q.hint && <p className="mt-2 text-sm text-neutral-400">{q.hint}</p>}

      <div className="mt-8">
        {q.kind === 'yesno' ? (
          <div className="flex gap-3">
            {['Yes', 'No'].map((opt) => (
              <button key={opt} type="button" onClick={() => { set(opt); setStep(step + 1) }} className={`rounded-full border px-6 py-3 ${value === opt ? 'border-amber-400 text-amber-300' : 'border-neutral-600 text-neutral-200'}`}>
                {opt}
              </button>
            ))}
          </div>
        ) : q.kind === 'choice' ? (
          <div className="flex flex-wrap gap-3">
            {q.options?.map((opt) => (
              <button key={opt} type="button" onClick={() => { set(opt); setStep(step + 1) }} className={`rounded-full border px-5 py-3 ${value === opt ? 'border-amber-400 text-amber-300' : 'border-neutral-600 text-neutral-200'}`}>
                {opt}
              </button>
            ))}
          </div>
        ) : q.kind === 'long' ? (
          <textarea autoFocus rows={4} value={value} onChange={(e) => set(e.target.value)} className="w-full rounded-lg bg-neutral-900 p-3 text-white" />
        ) : (
          <input
            autoFocus
            type={q.kind === 'email' ? 'email' : q.kind === 'tel' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => set(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); next() } }}
            className="w-full rounded-lg bg-neutral-900 p-3 text-white"
          />
        )}
      </div>

      {error && <p className="mt-3 text-red-400">{error}</p>}

      <div className="mt-8 flex gap-3">
        {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="rounded-full border border-neutral-600 px-5 py-3 text-neutral-200">Back</button>}
        {q.kind !== 'yesno' && q.kind !== 'choice' && (
          <button type="button" onClick={next} className="rounded-full bg-amber-400 px-6 py-3 font-medium text-black">
            {step === QUESTIONS.length - 1 ? 'Review' : 'OK'}
          </button>
        )}
      </div>
    </main>
  )
}
