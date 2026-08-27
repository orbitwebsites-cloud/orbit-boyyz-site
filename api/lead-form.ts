// POST /api/lead-form
// Public form handler for orbitboyzz.me/form — the "build me one of these
// agents" CTA on the YouTube agent series. On submit:
//   1. Upserts a HubSpot contact + note tagged so these leads are filterable
//      separately from website-design leads.
//   2. Triggers an instant confirmation email to the lead via formsubmit.co
//      (same service already used by /project-brief — no new account needed).
// SMS follow-up is handled out-of-band by a local watcher polling HubSpot for
// contacts with lead_source = agent_form (see /lead-watcher in the repo root).
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendJsonError } from './_lib/json-error.js'

const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN
const NOTIFY_EMAIL = 'orbitboyzz@gmail.com'
const LEAD_SOURCE = 'agent_form'

interface LeadBody {
  businessName?: unknown
  industry?: unknown
  contactName?: unknown
  phone?: unknown
  email?: unknown
  details?: unknown
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Vary', 'Accept, Accept-Encoding')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    sendJsonError(res, 405, 'method_not_allowed', `${req.method ?? 'This method'} is not supported on /api/lead-form.`)
    return
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as LeadBody
  const businessName = str(body.businessName)
  const industry = str(body.industry)
  const contactName = str(body.contactName)
  const phone = str(body.phone)
  const email = str(body.email)
  const details = str(body.details)

  if (!businessName || businessName.length > 120) {
    sendJsonError(res, 400, 'invalid_field', '"businessName" is required and must be under 120 characters.')
    return
  }
  if (!industry || industry.length > 120) {
    sendJsonError(res, 400, 'invalid_field', '"industry" is required and must be under 120 characters.')
    return
  }
  if (!contactName || contactName.length > 120) {
    sendJsonError(res, 400, 'invalid_field', '"contactName" is required and must be under 120 characters.')
    return
  }
  if (!phone || !PHONE_RE.test(phone)) {
    sendJsonError(res, 400, 'invalid_field', '"phone" must be a valid US phone number.')
    return
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    sendJsonError(res, 400, 'invalid_field', '"email" must be a valid email address.')
    return
  }
  if (details.length > 2000) {
    sendJsonError(res, 400, 'invalid_field', '"details" must be under 2000 characters.')
    return
  }

  let hubspotOk = true
  if (HUBSPOT_TOKEN) {
    try {
      await createOrUpdateHubspotLead({ businessName, industry, contactName, phone, email, details })
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
    await sendConfirmationEmail({ businessName, industry, contactName, phone, email, details })
  } catch (err) {
    emailOk = false
    console.error('confirmation email failed', err)
  }

  res
    .status(200)
    .setHeader('Content-Type', 'application/json; charset=utf-8')
    .json({ received: true, crmSynced: hubspotOk, emailSent: emailOk })
}

async function createOrUpdateHubspotLead(input: {
  businessName: string
  industry: string
  contactName: string
  phone: string
  email: string
  details: string
}) {
  const [firstName, ...rest] = input.contactName.split(' ')
  const lastName = rest.join(' ') || '-'

  const contactRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
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
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
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
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
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

async function sendConfirmationEmail(input: {
  businessName: string
  industry: string
  contactName: string
  phone: string
  email: string
  details: string
}) {
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
