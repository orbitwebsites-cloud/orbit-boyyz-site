// Next 16 Proxy (formerly middleware) — port of the old Vercel Edge middleware.ts.
//
// 1. Adds `Accept` + `Accept-Encoding` to `Vary` on every page response so
//    caches (CDN, browser) never serve a markdown response to a client asking
//    for HTML, or vice versa — see https://acceptmarkdown.com.
// 2. When a request sends `Accept: text/markdown` with equal-or-higher
//    priority than `text/html`, serves a hand-maintained markdown variant of
//    the page instead of the HTML, for pages listed in MARKDOWN_PAGES.
// 3. growth.orbitboyzz.me/ is served the /growth page.
// MARKDOWN_PAGES and wantsMarkdown() are copied verbatim from the old file.
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!api/|_next/|_vercel/|favicon|orbit-|robots\\.txt|sitemap\\.xml|feed\\.xml|llms\\.txt|openapi\\.json|.*\\.md|.*\\.(?:png|svg|jpg|jpeg|webp|ico|txt|xml|json|js|css|map|woff2?)$).*)',
  ],
}

const VARY = 'Accept, Accept-Encoding'

// Next's app router sets its own Vary (RSC tokens) on page responses; keep those
// alongside Accept so whichever layer writes the header last, the value is a superset.
const NEXT_VARY = 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch'

/** Merge Next's tokens + Accept + Accept-Encoding into an existing Vary header. */
function withVary(existing: string | null) {
  const tokens = new Map<string, string>()
  for (const t of [...(existing ?? '').split(','), ...NEXT_VARY.split(','), ...VARY.split(',')]) {
    const v = t.trim()
    if (v) tokens.set(v.toLowerCase(), v)
  }
  return [...tokens.values()].join(', ')
}

const ORIGIN = 'https://orbitboyzz.me'

const MARKDOWN_PAGES: Record<string, () => string> = {
  '/': () => `# OrbitBoyzz / Orbit Websites

Plainsboro, NJ web design and AI operations studio building custom local
business websites, lead intake systems, booking flows, and proposal
automation for Central New Jersey service businesses.

## Direct answer

Orbit Websites builds custom websites and AI operations systems for local
businesses that need more calls, quote requests, bookings, and qualified
leads. Launch builds are quoted on a free call, premium builds start at
$3,500, and AI operations systems run $5,000-$15,000+.

## Learn more

- [About](${ORIGIN}/about)
- [Services](${ORIGIN}/services)
- [Pricing](${ORIGIN}/pricing)
- [Developer / API docs](${ORIGIN}/developers)
- [Contact](${ORIGIN}/contact)
- [Full LLM index](${ORIGIN}/llms.txt)
`,
  '/about': () => `# About Orbit Websites

Orbit Websites — also known as OrbitBoyzz — is a Plainsboro, New Jersey web
design and AI operations studio serving Plainsboro, Princeton, West Windsor
Township, and Central New Jersey.

We hand-code every site (no templates, no plugins) so it stays fast, secure,
and built to rank locally. We also build AI intake, booking, and proposal
automation for local service businesses.

- [Homepage](${ORIGIN}/)
- [Services](${ORIGIN}/services)
- [Contact](${ORIGIN}/contact)
`,
  '/contact': () => `# Contact Orbit Websites

Book a free 15-minute call, or reach us directly:

- Phone: 609 662 8052 (tel:+16096628052)
- Email: orbitboyzz@gmail.com
- Book a call: https://calendly.com/orbitwebsites/30min

We'll build a live demo of your site and show you before you pay a cent.

- [Homepage](${ORIGIN}/)
- [Get a quote](${ORIGIN}/quote)
`,
  '/privacy': () => `# Privacy Policy

Last updated: June 13, 2026

Orbit Websites (OrbitBoyzz) operates orbitboyzz.me. We collect information
you voluntarily submit through our forms (quote estimator, contact, project
brief) — such as name, business name, email, phone, and project details —
and use privacy-respecting aggregate analytics (Vercel Analytics). We do not
sell your personal information to third parties.

Booking a call uses Calendly, which has its own privacy policy. You can
request deletion or correction of your data, or ask what we hold, by
emailing orbitboyzz@gmail.com.

Full policy: ${ORIGIN}/privacy
`,
  '/pricing': () => `# Pricing — Orbit Websites

## Launch Build
Quoted on a free call after a quick look at your needs. 7-day sprint, 50% to
start and 50% on approval. Best for local businesses that need a clean mobile
site, clear service pages, and basic local SEO foundations.

## Premium Website System Build
From $3,500. Custom design, conversion copy, and local SEO foundations for
businesses that need calls, quote requests, and bookings.

## AI Operations Website Build
Typically $5,000-$15,000+. For businesses with high-value or after-hours
leads that need AI intake, routing, and booking automation. Optional
retainer: $750-$2,500/mo, only when it replaces measurable admin labor or
recovers high-intent leads.

## Care Plans (optional)
Month to month, only after launch: $300 Site Care, $500 Local Growth,
$700 Growth Partner per month.

Full pricing reference: ${ORIGIN}/pricing.md
Estimate your own project: ${ORIGIN}/quote (or POST ${ORIGIN}/api/quote-estimate)
`,
  '/services': () => `# Services — Orbit Websites

- New website design — custom, hand-coded, mobile-first.
- Website refreshes — cleaner copy, modern layout, faster load.
- Local SEO foundations — service pages, area signals, structured content.
- Booking & lead forms — click-to-call, quote, and booking flows.
- Instant booking engine — AI intake that qualifies and routes leads.
- Quote & proposal automation — priced proposals in minutes, not hours.

- [Pricing](${ORIGIN}/pricing)
- [Get a quote](${ORIGIN}/quote)
`,
  '/faq': () => `# Frequently Asked Questions — Orbit Websites

Common questions about pricing, timelines, and what's included. Full
answers: ${ORIGIN}/faq

- [Pricing](${ORIGIN}/pricing)
- [Contact](${ORIGIN}/contact)
`,
  '/developers': () => `# Developer & API Docs — Orbit Websites

OrbitBoyzz / Orbit Websites publishes a small, unauthenticated JSON API.
Full machine-readable definition: ${ORIGIN}/openapi.json

## Endpoints

- POST /api/quote-estimate — compute a project price range
- GET /api/health — liveness check

## Example

    curl -X POST ${ORIGIN}/api/quote-estimate \\
      -H "Content-Type: application/json" \\
      -d '{"need":"ai","complexity":"complex","urgency":"urgent"}'

## Error format

All errors are JSON: { "error": { "code", "message", "hint" } }

- [OpenAPI spec](${ORIGIN}/openapi.json)
- [llms.txt](${ORIGIN}/llms.txt)
`,
}

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false
  // Parse Accept header entries and compare the effective quality of
  // text/markdown against text/html and */*.
  const entries = accept.split(',').map((part) => {
    const [type, ...params] = part.trim().split(';')
    const qParam = params.find((p) => p.trim().startsWith('q='))
    const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1
    return { type: type.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 }
  })

  const markdown = entries.find((e) => e.type === 'text/markdown')
  if (!markdown) return false

  const html = entries.find((e) => e.type === 'text/html' || e.type === '*/*')
  if (!html) return true
  return markdown.q >= html.q
}

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
