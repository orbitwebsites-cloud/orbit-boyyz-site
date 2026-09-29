// POST /api/lead-form — port of the old api/lead-form.ts.
// Public form handler for /form — the "build me one of these agents" CTA. On submit:
//   1. Upserts a HubSpot contact tagged lead_source=agent_form (only when
//      HUBSPOT_PRIVATE_APP_TOKEN is set; otherwise CRM sync is skipped and
//      logged, exactly like the old handler).
//   2. Triggers an instant confirmation email to the lead via formsubmit.co.
// Always answers 200 { received, crmSynced, emailSent } once validation passes.
import { json, jsonError, methodNotAllowed, readBody } from '@/lib/api'

const NOTIFY_EMAIL = 'orbitboyzz@gmail.com'
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
  // Read at request time (never hardcoded) — add it in the Vercel project env vars.
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN

  let hubspotOk = true
  if (token) {
    try {
      await createOrUpdateHubspotLead(token, input)
    } catch (err) {
      hubspotOk = false
      console.error('hubspot lead sync failed', err)
    }
  } else {
    hubspotOk = false
    console.error('HUBSPOT_PRIVATE_APP_TOKEN is not set — skipping CRM sync')
  }

  let emailOk = true
  try {
    await sendConfirmationEmail(input)
  } catch (err) {
    emailOk = false
    console.error('confirmation email failed', err)
  }

  return json({ received: true, crmSynced: hubspotOk, emailSent: emailOk })
}

const notAllowed = methodNotAllowed('/api/lead-form', 'POST')
export { notAllowed as GET, notAllowed as HEAD, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as OPTIONS }

async function createOrUpdateHubspotLead(token: string, input: LeadInput) {
  const [firstName, ...rest] = input.contactName.split(' ')
  const lastName = rest.join(' ') || '-'
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const contactRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      properties: {
        email: input.email,
        firstname: firstName,
        lastname: lastName,
        phone: input.phone,
        company: input.businessName,
        industry: input.industry,
        lead_source: LEAD_SOURCE,
        message: input.details,
      },
    }),
  })

  if (contactRes.ok) return

  // 409 = contact already exists by email — fall back to a search + PATCH.
  if (contactRes.status === 409) {
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: input.email }] }],
        limit: 1,
      }),
    })
    const searchJson = (await searchRes.json()) as { results?: Array<{ id: string }> }
    const existingId = searchJson.results?.[0]?.id
    if (!existingId) throw new Error('HubSpot 409 but no matching contact found via search')

    const patchRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        properties: {
          phone: input.phone,
          company: input.businessName,
          industry: input.industry,
          lead_source: LEAD_SOURCE,
          message: input.details,
        },
      }),
    })
    if (!patchRes.ok) throw new Error(`HubSpot PATCH failed: ${patchRes.status} ${await patchRes.text()}`)
    return
  }

  throw new Error(`HubSpot create failed: ${contactRes.status} ${await contactRes.text()}`)
}

async function sendConfirmationEmail(input: LeadInput) {
  const payload = new URLSearchParams()
  payload.append('_subject', `New agent-build lead: ${input.businessName}`)
  payload.append('_template', 'table')
  payload.append('_captcha', 'false')
  payload.append(
    '_autoresponse',
    `Hey ${input.contactName.split(' ')[0] || 'there'} — got your request for ${input.businessName}. ` +
      `We'll text you at ${input.phone} shortly to talk through what the agent would do for your business.`,
  )
  payload.append('name', input.contactName)
  payload.append('email', input.email)
  payload.append('business', input.businessName)
  payload.append('industry', input.industry)
  payload.append('phone', input.phone)
  payload.append('details', input.details || '[none given]')

  const response = await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString(),
  })
  if (!response.ok) throw new Error(`formsubmit.co failed: ${response.status} ${await response.text()}`)
}
