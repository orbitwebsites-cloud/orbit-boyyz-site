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

  if (done) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Last step</h1>
        <p className="mt-3 text-neutral-300">Check your answers, then send.</p>
        <form action="https://formsubmit.co/OrbitBoyzz@gmail.com" method="POST" className="mt-8">
          <input type="hidden" name="_subject" value={`Intake form: ${answers.company || answers.name || 'new answers'}`} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://orbitboyzz.com/intake?sent=1" />
          {answers.email && <input type="hidden" name="_replyto" value={answers.email} />}
          {QUESTIONS.map((item) => (
            <input key={item.key} type="hidden" name={item.label} value={answers[item.key] || ''} />
          ))}
          <ul className="space-y-3 text-sm text-neutral-300">
            {QUESTIONS.filter((item) => answers[item.key]).map((item) => (
              <li key={item.key}>
                <span className="block text-neutral-500">{item.label}</span>
                <span className="text-white">{answers[item.key]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setStep(step - 1)} className="rounded-full border border-neutral-600 px-5 py-3 text-neutral-200">Back</button>
            <button type="submit" className="rounded-full bg-amber-400 px-6 py-3 font-medium text-black">Send</button>
          </div>
        </form>
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
