// Writes site/src/proxy.ts from the old middleware.ts: the MARKDOWN_PAGES map
// and wantsMarkdown() negotiation are copied verbatim; only the Vercel Edge
// helpers are swapped for Next 16 proxy APIs.
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('D:/orbitboyzz-revamp/old-site-src/middleware.ts', 'utf8')
const start = src.indexOf("const ORIGIN = 'https://orbitboyzz.me'")
const end = src.indexOf('export default function middleware')
if (start < 0 || end < 0) throw new Error('markers not found')
const block = src.slice(start, end).trimEnd()

const out = `// Next 16 Proxy (formerly middleware) — port of the old Vercel Edge middleware.ts.
//
// 1. Adds \`Accept\` + \`Accept-Encoding\` to \`Vary\` on every page response so
//    caches (CDN, browser) never serve a markdown response to a client asking
//    for HTML, or vice versa — see https://acceptmarkdown.com.
// 2. When a request sends \`Accept: text/markdown\` with equal-or-higher
//    priority than \`text/html\`, serves a hand-maintained markdown variant of
//    the page instead of the HTML, for pages listed in MARKDOWN_PAGES.
// 3. growth.orbitboyzz.me/ is served the /growth page.
// MARKDOWN_PAGES and wantsMarkdown() are copied verbatim from the old file.
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!api/|_next/|_vercel/|favicon|orbit-|robots\\\\.txt|sitemap\\\\.xml|feed\\\\.xml|llms\\\\.txt|openapi\\\\.json|.*\\\\.md|.*\\\\.(?:png|svg|jpg|jpeg|webp|ico|txt|xml|json|js|css|map|woff2?)$).*)',
  ],
}

const VARY = 'Accept, Accept-Encoding'

/** Merge Accept + Accept-Encoding into an existing Vary header (keeps Next's RSC tokens). */
function withVary(existing: string | null) {
  const tokens = new Map<string, string>()
  for (const t of [...(existing ?? '').split(','), ...VARY.split(',')]) {
    const v = t.trim()
    if (v) tokens.set(v.toLowerCase(), v)
  }
  return [...tokens.values()].join(', ')
}

${block}

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const accept = request.headers.get('accept')

  if (url.hostname === 'growth.orbitboyzz.me' && url.pathname === '/') {
    const res = NextResponse.rewrite(new URL('/growth', request.url))
    res.headers.set('Vary', withVary(res.headers.get('Vary')))
    return res
  }

  const renderMarkdown = MARKDOWN_PAGES[url.pathname]
  if (renderMarkdown && wantsMarkdown(accept)) {
    return new NextResponse(renderMarkdown(), {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: VARY,
      },
    })
  }

  const response = NextResponse.next()
  response.headers.set('Vary', withVary(response.headers.get('Vary')))
  return response
}
`
writeFileSync('D:/orbitboyzz-revamp/site/src/proxy.ts', out)
console.log('ok')
