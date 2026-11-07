// Sends form submissions to the Orbit CRM (orbit-crm-pink.vercel.app) through its MCP
// upsert_contact tool. Server-side only. Needs CRM_URL and CRM_TOKEN in the environment.
import { createHash } from 'node:crypto'

export type CrmLead = { businessName: string; industry: string; contactName: string; phone: string; email: string; details: string }

export async function syncLeadToCrm(lead: CrmLead, source: string) {
  const url = process.env.CRM_URL
  const token = process.env.CRM_TOKEN
  if (!url || !token) throw new Error('CRM_URL or CRM_TOKEN is not set')

  const id = `lead-${createHash('sha1').update(lead.email.toLowerCase()).digest('hex').slice(0, 12)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'upsert_contact',
        arguments: {
          id,
          fields: {
            segment: 'lead_form',
            business: lead.businessName,
            contact_name: lead.contactName,
            phone: lead.phone,
            email: lead.email,
            category: lead.industry,
            status: 'new',
            source,
            details: lead.details,
          },
        },
      },
    }),
  })
  if (!res.ok) throw new Error(`CRM responded ${res.status}`)
  const body = await res.json()
  if (body.result?.isError) throw new Error(body.result.content?.[0]?.text || 'CRM error')
  return id
}

/** Saves any form submission to the Orbit CRM under segment lead_form (the watch emails those). */
export async function syncFormToCrm(source: string, email: string, fields: Record<string, string>) {
  const url = process.env.CRM_URL
  const token = process.env.CRM_TOKEN
  if (!url || !token) throw new Error('CRM_URL or CRM_TOKEN is not set')
  const id = `${source}-${createHash('sha1').update(email.toLowerCase()).digest('hex').slice(0, 12)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'upsert_contact', arguments: { id, fields: { ...fields, email, segment: 'lead_form', status: 'new', source } } },
    }),
  })
  if (!res.ok) throw new Error(`CRM responded ${res.status}`)
  const body = await res.json()
  if (body.result?.isError) throw new Error(body.result.content?.[0]?.text || 'CRM error')
  return id
}
