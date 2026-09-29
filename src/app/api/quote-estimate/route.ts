// POST /api/quote-estimate — port of the old api/quote-estimate.ts.
// Public, unauthenticated project-range estimator. Mirrors the calculation
// used on /quote so agents and integrations can get the same number
// programmatically. Documented in /openapi.json.
import { calculateQuoteEstimate, isAiEmployee, isQuoteComplexity, isQuoteNeed, isQuoteUrgency } from '@/lib/quoteEstimate'
import { json, jsonError, methodNotAllowed, readBody } from '@/lib/api'

export async function POST(request: Request) {
  const body = await readBody(request)
  if (body === null) {
    return jsonError(400, 'invalid_json', 'The request body is not valid JSON.', 'Send a JSON object. See /openapi.json for the request schema.')
  }

  const need = body.need ?? 'site'
  const complexity = body.complexity ?? 'simple'
  const urgency = body.urgency ?? 'normal'
  const employee = body.employee ?? 'none'
  const automation = body.automation === true

  if (!isQuoteNeed(need)) {
    return jsonError(400, 'invalid_field', `"need" must be one of: site, refresh, forms, ai.`, 'Retry with a valid "need" value.')
  }
  if (!isQuoteComplexity(complexity)) {
    return jsonError(400, 'invalid_field', `"complexity" must be one of: simple, medium, complex.`, 'Retry with a valid "complexity" value.')
  }
  if (!isQuoteUrgency(urgency)) {
    return jsonError(400, 'invalid_field', `"urgency" must be one of: normal, fast, urgent.`, 'Retry with a valid "urgency" value.')
  }
  if (!isAiEmployee(employee)) {
    return jsonError(
      400,
      'invalid_field',
      `"employee" must be one of: none, receptionist, dispatcher, sales, proposal, support.`,
      'Retry with a valid "employee" value.',
    )
  }

  const estimate = calculateQuoteEstimate({ need, complexity, urgency, employee, automation })
  return json({ input: { need, complexity, urgency, employee, automation }, estimate })
}

const notAllowed = methodNotAllowed(
  '/api/quote-estimate',
  'POST',
  'Send a POST request with a JSON body. See /openapi.json for the request schema.',
)
export { notAllowed as GET, notAllowed as HEAD, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as OPTIONS }
