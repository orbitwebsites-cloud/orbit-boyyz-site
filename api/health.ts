// GET /api/health — simple machine-readable liveness check.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendJsonError } from './_lib/json-error.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Vary', 'Accept, Accept-Encoding')

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    sendJsonError(res, 405, 'method_not_allowed', `${req.method ?? 'This method'} is not supported on /api/health.`)
    return
  }

  res
    .status(200)
    .setHeader('Content-Type', 'application/json; charset=utf-8')
    .json({ status: 'ok', service: 'orbitboyzz-site', time: new Date().toISOString() })
}
