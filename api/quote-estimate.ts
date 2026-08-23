// POST /api/quote-estimate
// Public, unauthenticated project-range estimator. Mirrors the calculation
// used on https://orbitboyzz.me/quote so agents and integrations can get the
// same number programmatically. Documented in /openapi.json.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  calculateQuoteEstimate,
  isAiEmployee,
  isQuoteComplexity,
  isQuoteNeed,
  isQuoteUrgency,
} from '../src/lib/quoteEstimate.js'
import { sendJsonError } from './_lib/json-error.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Vary', 'Accept, Accept-Encoding')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    sendJsonError(
      res,
      405,
      'method_not_allowed',
      `${req.method ?? 'This method'} is not supported on /api/quote-estimate.`,
      'Send a POST request with a JSON body. See /openapi.json for the request schema.',
    )
    return
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {}
  const need = body.need ?? 'site'
  const complexity = body.complexity ?? 'simple'
  const urgency = body.urgency ?? 'normal'
  const employee = body.employee ?? 'none'
  const automation = body.automation === true

  if (!isQuoteNeed(need)) {
    sendJsonError(
      res,
      400,
      'invalid_field',
      `"need" must be one of: site, refresh, forms, ai.`,
      'Retry with a valid "need" value.',
    )
    return
  }
  if (!isQuoteComplexity(complexity)) {
    sendJsonError(
      res,
      400,
      'invalid_field',
      `"complexity" must be one of: simple, medium, complex.`,
      'Retry with a valid "complexity" value.',
    )
    return
  }
  if (!isQuoteUrgency(urgency)) {
    sendJsonError(
      res,
      400,
      'invalid_field',
      `"urgency" must be one of: normal, fast, urgent.`,
      'Retry with a valid "urgency" value.',
    )
    return
  }
  if (!isAiEmployee(employee)) {
    sendJsonError(
      res,
      400,
      'invalid_field',
      `"employee" must be one of: none, receptionist, dispatcher, sales, proposal, support.`,
      'Retry with a valid "employee" value.',
    )
    return
  }

  const estimate = calculateQuoteEstimate({ need, complexity, urgency, employee, automation })
  res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8').json({ input: { need, complexity, urgency, employee, automation }, estimate })
}
