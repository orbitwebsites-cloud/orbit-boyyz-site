// Catch-all for any /api/* path that isn't a real endpoint. Returns a
// structured JSON 404 instead of an HTML error page, so agents parsing API
// responses always get JSON — see /openapi.json for the real endpoint list.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendJsonError } from './_lib/json-error.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Vary', 'Accept, Accept-Encoding')
  sendJsonError(
    res,
    404,
    'not_found',
    `No API endpoint exists at ${req.url ?? 'this path'}.`,
    'See /openapi.json for the list of available endpoints, or /developers for docs.',
  )
}
