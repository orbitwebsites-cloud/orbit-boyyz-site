// Vercel Edge Middleware.
//
// 1. Adds `Vary: Accept, Accept-Encoding` to every page response so caches
//    (CDN, browser) never serve a markdown response to a client asking for
//    HTML, or vice versa — see https://acceptmarkdown.com.
// 2. When a request sends `Accept: text/markdown` with equal-or-higher
//    priority than `text/html`, serves a hand-maintained markdown variant of
//    the page instead of the HTML shell, for pages listed in MARKDOWN_PAGES.
import { next } from '@vercel/edge'

export const config = {
  matcher: [
    '/((?!api/|assets/|_vercel/|favicon|orbit-|vite\\.svg|robots\\.txt|sitemap\\.xml|feed\\.xml|llms\\.txt|openapi\\.json|.*\\.md|.*\\.(?:png|svg|jpg|jpeg|webp|ico|txt|xml|json|js|css|map)$).*)',
  ],
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
leads. Starter website builds usually range from $150-$400.

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

## Starter Website Range
$150-$400. Best for local businesses that need a clean mobile site, clear
service pages, and basic local SEO foundations.

## Premium Website System Build
Starts around $3,500. Custom design, conversion copy, and local SEO
foundations for businesses that need calls, quote requests, and bookings.

## AI Operations Website Build
Typically $5,000-$15,000+. For businesses with high-value or after-hours
leads that need AI intake, routing, and booking automation.

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

export default function middleware(request: Request) {
  const url = new URL(request.url)
  const accept = request.headers.get('accept')

  const renderMarkdown = MARKDOWN_PAGES[url.pathname]
  if (renderMarkdown && wantsMarkdown(accept)) {
    return new Response(renderMarkdown(), {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept, Accept-Encoding',
      },
    })
  }

  const response = next()
  response.headers.set('Vary', 'Accept, Accept-Encoding')
  return response
}
