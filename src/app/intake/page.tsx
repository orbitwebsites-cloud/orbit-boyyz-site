'use client'

import { useState, type FormEvent } from 'react'

// /intake: a short form for the prospect's own details. Submitted from the browser to FormSubmit
// (FormSubmit blocks server-side requests), which emails OrbitBoyzz@gmail.com. Noindex, not linked.

const FORMSUBMIT = 'https://formsubmit.co/ajax/OrbitBoyzz@gmail.com'

export default function InfoPage() {
  const [values, setValues] = useState({ name: '', company: '', email: '', phone: '', website: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!values.name.trim() || !values.email.trim()) {
      setError('Please add your name and email.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch(FORMSUBMIT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({
          _subject: `Info form: ${values.company || values.name}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: values.email.trim(),
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          website: values.website.trim(),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || (data && String(data.success) === 'false')) throw new Error('rejected')
      setSent(true)
    } catch {
      setError('That didn’t go through. Your answers are still here. Try again.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Got it, thanks.</h1>
        <p className="mt-4 text-neutral-300">We’ll be in touch before the call.</p>
      </main>
    )
  }

  const fields: Array<{ key: keyof typeof values; label: string; type?: string; required?: boolean }> = [
    { key: 'name', label: 'Your name', required: true },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'website', label: 'Website' },
  ]

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Your details</h1>
      <p className="mt-3 text-neutral-300">Just the basics so we can reach you.</p>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm text-neutral-200">{f.label}{f.required ? ' *' : ''}</span>
            <input
              type={f.type || 'text'}
              className="mt-2 w-full rounded-lg bg-neutral-900 p-3 text-white"
              value={values[f.key]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          </label>
        ))}
        {error && <p className="text-red-400">{error}</p>}
        <button type="submit" disabled={busy} className="rounded-full bg-amber-400 px-6 py-3 font-medium text-black disabled:opacity-60">
          {busy ? 'Sending…' : 'Send'}
        </button>
      </form>
    </main>
  )
}
