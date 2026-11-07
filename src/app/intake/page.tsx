// /intake: a short form for the prospect's own details. It posts straight to FormSubmit as a normal
// form submission (browsers block FormSubmit's AJAX endpoint from other sites). FormSubmit emails
// OrbitBoyzz@gmail.com and shows its own thanks page, which sends the visitor back here. Noindex, not linked.

const FIELDS: Array<{ name: string; label: string; type: string; required?: boolean }> = [
  { name: 'name', label: 'Your name', type: 'text', required: true },
  { name: 'company', label: 'Company', type: 'text' },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'website', label: 'Website', type: 'text' },
]

export default function IntakePage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Your details</h1>
      <p className="mt-3 text-neutral-300">Just the basics so we can reach you.</p>
      <form action="https://formsubmit.co/OrbitBoyzz@gmail.com" method="POST" className="mt-10 space-y-5">
        <input type="hidden" name="_subject" value="Details form submitted" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value="https://orbitboyzz.com/intake?sent=1" />
        {FIELDS.map((f) => (
          <label key={f.name} className="block">
            <span className="text-sm text-neutral-200">{f.label}{f.required ? ' *' : ''}</span>
            <input name={f.name} type={f.type} required={Boolean(f.required)} className="mt-2 w-full rounded-lg bg-neutral-900 p-3 text-white" />
          </label>
        ))}
        <button type="submit" className="rounded-full bg-amber-400 px-6 py-3 font-medium text-black">Send</button>
      </form>
    </main>
  )
}
