// Catch-all for any /api/* path that isn't a real endpoint (port of the old
// api/[...notfound].ts). Returns a structured JSON 404 instead of an HTML
// error page, so agents parsing API responses always get JSON.
import { jsonError } from '@/lib/api'

function notFound(request: Request) {
  const url = new URL(request.url)
  return jsonError(
    404,
    'not_found',
    `No API endpoint exists at ${url.pathname}${url.search}.`,
    'See /openapi.json for the list of available endpoints, or /developers for docs.',
  )
}

export { notFound as GET, notFound as HEAD, notFound as POST, notFound as PUT, notFound as PATCH, notFound as DELETE, notFound as OPTIONS }
