'use client'

import { useState, type FormEvent } from 'react'

// /discovery: the questions we ask before the first call. Answers go to the Orbit CRM
// (/api/crm-lead, source "discovery"), and the watch emails them to both team inboxes.
// Not linked from the nav; noindex.

const QUESTIONS: Array<{ key: string; label: string; type?: 'text' | 'textarea' | 'select'; options?: string[]; required?: boolean }> = [
  { key: 'name', label: 'Your name', required: true },
  { key: 'email', label: 'Work email', required: true },
  { key: 'phone', label: 'Best phone number' },
  { key: 'role', label: 'Your role' },
  { key: 'agency', label: 'Agency name and website' },
  { key: 'team_size', label: 'How many people work at the agency', type: 'select', options: ['Just me', '2–5', '6–10', '11–25', '25+'] },
  { key: 'clients', label: 'Who are your clients, and which niches do you run outbound for?', type: 'textarea', required: true },
  { key: 'services', label: 'What do you sell to those clients? (cold email, calling, LinkedIn, booking, other)', type: 'textarea' },
  { key: 'volume', label: 'How many outbound emails or calls do you send in a typical month?', type: 'select', options: ['Under 5,000', '5,000–20,000', '20,000–50,000', '50,000+', 'Not sure'] },
  { key: 'lead_sources', label: 'Where do your lead lists come from today? (Apollo, ZoomInfo, scraped, Clay, manual, other)', type: 'textarea' },
  { key: 'spend', label: 'Roughly how much do you spend a month on lead data and tools?', type: 'select', options: ['Under $250', '$250–1,000', '$1,000–5,000', '$5,000+', 'Prefer not to say'] },
  { key: 'biggest_problem', label: 'What is the biggest problem with your lists right now? (bounces, info@ addresses, no owner names, wrong niche, other)', type: 'textarea' },
  { key: 'domains', label: 'How many sending domains and inboxes do you run?', type: 'text' },
  { key: 'bounce_rate', label: 'Roughly what is your bounce rate on new lists?', type: 'select', options: ['Under 2%', '2–5%', '5%+', 'I don’t track it'] },
  { key: 'target_geo', label: 'Which areas or states do your clients target?' },
  { key: 'goal', label: 'What would a good result look like for you in the next 90 days?', type: 'textarea' },
  { key: 'timing', label: 'When would you want to start?', type: 'select', options: ['This month', 'Next month', 'Within 3 months', 'Just exploring'] },
  { key: 'notes', label: 'Anything else we should know before the call?', type: 'textarea' },
]

export default function DiscoveryPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const missing = QUESTIONS.filter((q) => q.required && !(values[q.key] || '').trim())
    if (missing.length) { setError(`Please answer: ${missing.map((q) => q.label).join(', ')}`); return }
    setBusy(true)
    try {
      const res = await fetch('/api/crm-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'discovery', fields: values }),
      })
      if (!res.ok) throw new Error('save failed')
      setSent(true)
    } catch {
      setError('That didn’t go through. Your answers are still here. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Thanks, that’s everything we need.</h1>
        <p className="mt-4 text-neutral-300">We’ll review your answers before the call. If anything changes, reply to the email you got our booking link in.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Before our call</h1>
      <p className="mt-3 text-neutral-300">
        Answer what you can. Your answers help us see whether we fit your agency before we talk. Nothing here is shared outside Orbit Websites.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        {QUESTIONS.map((q) => (
          <label key={q.key} className="block">
            <span className="text-sm text-neutral-200">{q.label}{q.required ? ' *' : ''}</span>
            {q.type === 'textarea' ? (
              <textarea className="mt-2 w-full rounded-lg bg-neutral-900 p-3 text-white" rows={3} value={values[q.key] || ''} onChange={(e) => setValues({ ...values, [q.key]: e.target.value })} />
            ) : q.type === 'select' ? (
              <select className="mt-2 w-full rounded-lg bg-neutral-900 p-3 text-white" value={values[q.key] || ''} onChange={(e) => setValues({ ...values, [q.key]: e.target.value })}>
                <option value="">Choose one</option>
                {q.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input className="mt-2 w-full rounded-lg bg-neutral-900 p-3 text-white" value={values[q.key] || ''} onChange={(e) => setValues({ ...values, [q.key]: e.target.value })} />
            )}
          </label>
        ))}
        {error && <p className="text-red-400">{error}</p>}
        <button type="submit" disabled={busy} className="rounded-full bg-amber-400 px-6 py-3 font-medium text-black disabled:opacity-60">
          {busy ? 'Sending…' : 'Send my answers'}
        </button>
      </form>
    </main>
  )
}
