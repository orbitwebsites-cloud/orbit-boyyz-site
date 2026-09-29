// Shared helpers for the ported /api/* route handlers (old api/_lib/json-error.ts).
// Every response is JSON with the same envelope and `Vary: Accept, Accept-Encoding`.

export interface ApiErrorBody {
  error: { code: string; message: string; hint?: string }
}

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  Vary: 'Accept, Accept-Encoding',
} as const

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...BASE_HEADERS, ...headers } })
}

export function jsonError(status: number, code: string, message: string, hint?: string, headers: Record<string, string> = {}) {
  const body: ApiErrorBody = { error: { code, message, ...(hint ? { hint } : {}) } }
  return json(body, status, headers)
}

/**
 * Mirrors Vercel's Node helper body parsing (req.body): JSON and urlencoded
 * bodies become objects, anything else (or an empty body) is {}.
 * Returns null when a JSON body is malformed.
 */
export async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const type = request.headers.get('content-type') ?? ''
  const text = await request.text()
  if (!text) return {}
  if (type.includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(text))
  if (type.includes('application/json') || type === '') {
    try {
      const parsed: unknown = JSON.parse(text)
      return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {}
    } catch {
      return type.includes('application/json') ? null : {}
    }
  }
  return {}
}

/** Build 405 handlers for every method a route does not implement. */
export function methodNotAllowed(path: string, allow: string, hint?: string) {
  const handler = (request: Request) =>
    jsonError(405, 'method_not_allowed', `${request.method || 'This method'} is not supported on ${path}.`, hint, { Allow: allow })
  return handler
}
