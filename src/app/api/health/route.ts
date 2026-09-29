// GET /api/health — port of the old api/health.ts (machine-readable liveness check).
import { json, methodNotAllowed } from '@/lib/api'

export const dynamic = 'force-dynamic'

export function GET() {
  return json({ status: 'ok', service: 'orbitboyzz-site', time: new Date().toISOString() })
}

export function HEAD() {
  return json({ status: 'ok', service: 'orbitboyzz-site', time: new Date().toISOString() })
}

const notAllowed = methodNotAllowed('/api/health', 'GET, HEAD')
export { notAllowed as POST, notAllowed as PUT, notAllowed as PATCH, notAllowed as DELETE, notAllowed as OPTIONS }
