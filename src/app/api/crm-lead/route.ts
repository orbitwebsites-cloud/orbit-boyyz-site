// Receives form submissions from the site and saves them to the Orbit CRM (lead_form segment).
import { syncFormToCrm } from '@/lib/crmSync'

const SOURCES = new Set(['qualify', 'discovery'])
const MAX_FIELD = 2000

export async function POST(request: Request) {
  let body: { source?: unknown; fields?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }
  const source = typeof body.source === 'string' && SOURCES.has(body.source) ? body.source : null
  if (!source || !body.fields || typeof body.fields !== 'object') {
    return Response.json({ ok: false, error: 'invalid_request' }, { status: 400 })
  }
  const fields: Record<string, string> = {}
  for (const [key, value] of Object.entries(body.fields as Record<string, unknown>)) {
    if (typeof value === 'string' && key.length < 80) fields[key] = value.trim().slice(0, MAX_FIELD)
  }
  const email = fields.email || ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }
  try {
    const id = await syncFormToCrm(source, email, fields)
    return Response.json({ ok: true, id })
  } catch (err) {
    console.error('crm-lead sync failed', err)
    return Response.json({ ok: false, error: 'crm_unavailable' }, { status: 502 })
  }
}
