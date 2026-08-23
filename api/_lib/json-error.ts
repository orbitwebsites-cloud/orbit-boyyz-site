// Shared JSON error envelope for every /api/* endpoint. Agents parsing API
// responses need a structured, predictable error shape — never an HTML page.
import type { VercelResponse } from '@vercel/node'

export interface ApiErrorBody {
  error: {
    code: string
    message: string
    hint?: string
  }
}

export function sendJsonError(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
  hint?: string,
) {
  const body: ApiErrorBody = { error: { code, message, ...(hint ? { hint } : {}) } }
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').json(body)
}
