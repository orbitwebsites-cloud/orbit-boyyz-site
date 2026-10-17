// FormSubmit has to be called from the visitor's browser: its Cloudflare check answers server-side requests
// (our API routes on Vercel) with a 403 challenge page. So /api/lead-form and /api/website-check/lead validate,
// rate-limit and sanitize on the server, then return the finished email fields; the browser posts them here.
export type FormNotify = { endpoint: string; fields: Record<string, string> }

export async function sendFormNotify(notify: FormNotify | undefined) {
  if (!notify) return // e.g. the honeypot path: the route pretends success and sends nothing
  const response = await fetch(notify.endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(notify.fields),
  })
  if (!response.ok) throw new Error(`formsubmit.co failed: ${response.status}`)
}
