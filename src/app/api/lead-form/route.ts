// POST /api/lead-form — port of the old api/lead-form.ts.
// Public form handler for /form — the "build me one of these agents" CTA. On submit:
//   1. Upserts a HubSpot contact tagged lead_source=agent_form (only when
//      HUBSPOT_PRIVATE_APP_TOKEN is set; otherwise CRM sync is skipped and
//      logged, exactly like the old handler).
//   2. Triggers an instant confirmation email to the lead via formsubmit.co.
// Always answers 200 { received, crmSynced, emailSent } once validation passes.
import { json, jsonError, methodNotAllowed, readBody } from '@/lib/api'
import { syncLeadToCrm } from '@/lib/crmSync'

const NOTIFY_EMAIL = 'orbitboyzz@gmail.com' // the FormSubmit-activated inbox (alex@ never was)
const LEAD_SOURCE = 'agent_form'

type LeadInput = { businessName: string; industry: string; contactName: string; phone: string; email: string; details: string }

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

export async function POST(request: Request) {
  const body = (await readBody(request)) ?? {}
  const businessName = str(body.businessName)
  const industry = str(body.industry)
  const contactName = str(body.contactName)
  const phone = str(body.phone)
  const email = str(body.email)
  const details = str(body.details)

  if (!businessName || businessName.length > 120) return jsonError(400, 'invalid_field', '"businessName" is required and must be under 120 characters.')
  if (!industry || industry.length > 120) return jsonError(400, 'invalid_field', '"industry" is required and must be under 120 characters.')
  if (!contactName || contactName.length > 120) return jsonError(400, 'invalid_field', '"contactName" is required and must be under 120 characters.')
  if (!phone || !PHONE_RE.test(phone)) return jsonError(400, 'invalid_field', '"phone" must be a valid US phone number.')
  if (!email || !EMAIL_RE.test(email) || email.length > 200) return jsonError(400, 'invalid_field', '"email" must be a valid email address.')
  if (details.length > 2000) return jsonError(400, 'invalid_field', '"details" must be under 2000 characters.')

  const input: LeadInput = { businessName, industry, contactName, phone, email, details }
  // Leads go to the Orbit CRM (src/lib/crmSync.ts), not HubSpot.
  let crmSynced = true
  try {
    await syncLeadToCrm(input, LEAD_SOURCE)
  } catch (err) {
    crmSynced = false
    console.error("crm lead sync failed", err)
  }

  // The browser sends the email (src/lib/formNotify.ts): FormSubmit blocks server-side requests.
  return json({ received: true, crmSynced, notify: { endpoint: `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, fields: confirmationFields(input) } })
}

const notAllowed = methodNotAllowed('/api/lead-form', 'POST')
export { notAllowed as GET, notAllowed as HEAD, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as OPTIONS }


function confirmationFields(input: LeadInput): Record<string, string> {
  return {
    _subject: `New agent-build lead: ${input.businessName}`,
    _template: 'table',
    _captcha: 'false',
    _autoresponse:
      `Hey ${input.contactName.split(' ')[0] || 'there'} — got your request for ${input.businessName}. ` +
      `We'll text you at ${input.phone} shortly to talk through what the agent would do for your business.`,
    name: input.contactName,
    email: input.email,
    business: input.businessName,
    industry: input.industry,
    phone: input.phone,
    details: input.details || '[none given]',
  }
}
