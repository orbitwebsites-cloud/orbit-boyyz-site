import type { ReactNode } from 'react'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Section } from '@/components/port/Blocks'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'
import { calculateQuoteEstimate, type QuoteEstimateInput } from '@/lib/quoteEstimate'

export const metadata = legacyMetadata('/developers')

// Old Developers component (App.tsx) — copy verbatim.
const curlExample = `curl -X POST https://orbitboyzz.me/api/quote-estimate \\
  -H "Content-Type: application/json" \\
  -d '{"need":"ai","complexity":"complex","urgency":"urgent","employee":"dispatcher","automation":true}'`

// Computed with the same function the API uses, so the example can never drift from it.
const exampleInput: QuoteEstimateInput = { need: 'ai', complexity: 'complex', urgency: 'urgent', employee: 'dispatcher', automation: true }
const responseExample = JSON.stringify({ input: exampleInput, estimate: calculateQuoteEstimate(exampleInput) }, null, 2)

const errorExample = `{
  "error": {
    "code": "invalid_field",
    "message": "\\"need\\" must be one of: site, refresh, forms, ai.",
    "hint": "Retry with a valid \\"need\\" value."
  }
}`

const endpoints: Array<[string, string, string]> = [
  ['POST', '/api/quote-estimate', 'Compute a project price range from need, complexity, urgency, and AI employee selections.'],
  ['GET', '/api/health', 'Lightweight liveness check for the site API.'],
]

const files: Array<[string, string]> = [
  ['/openapi.json', 'Full OpenAPI 3.1 specification for this API.'],
  ['/llms.txt', 'LLM-oriented index of the site, pricing, and content.'],
  ['/sitemap.xml', 'Full sitemap of every page on the site.'],
  ['/feed.xml', 'RSS feed of the Orbit Websites blog.'],
  ['/pricing.md', 'Plain-markdown pricing reference.'],
]

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md border border-line bg-panel-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-hi">{children}</code>
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-line bg-[#0a0908] p-6 font-mono text-[0.86rem] leading-relaxed text-fg/90 md:p-8">
      <code>{children}</code>
    </pre>
  )
}

export default function DevelopersPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd('/developers')} />
      <PageHero
        label="[DEVELOPERS // API DOCS]"
        title={
          <>
            A small, public API for the project <span className="serif-accent text-accent">range estimator.</span>
          </>
        }
      >
        <p className="t-lead max-w-[62ch] text-muted">
          OrbitBoyzz / Orbit Websites publishes a small, unauthenticated JSON API alongside this marketing site. The full machine-readable definition is an{' '}
          <a href="/openapi.json" className="link-u text-accent hover:text-accent-hi">
            OpenAPI 3.1 spec at /openapi.json
          </a>{' '}
          — every operation below has a stable <Code>operationId</Code>, typed request/response schemas, and a description, so it works directly with LLM function-calling /
          tool-use.
        </p>
      </PageHero>

      <Section label="Authentication" className="pt-0 md:pt-0">
        <div data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8">
          <SectionLabel>[AUTHENTICATION]</SectionLabel>
          <p className="mt-4 max-w-[72ch] leading-relaxed text-muted">
            No API key or authentication is required. All endpoints are public, read-only or stateless-compute, and rate limits are enforced at the platform (Vercel) level.
            Every response — success or error — is JSON with a <Code>Content-Type: application/json</Code> header.
          </p>
        </div>
      </Section>

      <Section label="Endpoints">
        <SectionLabel>[ENDPOINTS]</SectionLabel>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {endpoints.map(([method, path, desc]) => (
            <li key={path} data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-7">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">{method}</p>
              <p className="display mt-3 text-2xl">{path}</p>
              <p className="mt-3 leading-relaxed text-muted">{desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Example request">
        <SectionLabel>[EXAMPLE REQUEST]</SectionLabel>
        <Pre>{curlExample}</Pre>
      </Section>

      <Section label="Example response">
        <SectionLabel>[EXAMPLE RESPONSE]</SectionLabel>
        <p className="mt-4 max-w-[72ch] leading-relaxed text-muted">
          Figures are a rough range, not a quote. For a simple website with no AI selections, <Code>upfront</Code> is <Code>&quot;Quoted on a free call&quot;</Code> and{' '}
          <Code>upfrontLow</Code> / <Code>upfrontHigh</Code> are <Code>null</Code>; moderate or complex websites return <Code>&quot;From $3,500&quot;</Code>. The monthly
          figure is an optional care plan ($300–$700/mo) or, for AI builds, an optional retainer ($750–$2,500/mo).
        </p>
        <Pre>{responseExample}</Pre>
      </Section>

      <Section label="Error format">
        <SectionLabel>[ERROR FORMAT]</SectionLabel>
        <p className="mt-4 max-w-[72ch] leading-relaxed text-muted">
          Every error response uses the same JSON envelope, with an HTTP status code that matches the failure (400 for invalid input, 405 for a wrong method, 404 for an
          unknown route):
        </p>
        <Pre>{errorExample}</Pre>
      </Section>

      <Section label="More machine-readable files">
        <SectionLabel>[MORE MACHINE-READABLE FILES]</SectionLabel>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map(([path, desc]) => (
            <li key={path} data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6">
              <a href={path} className="link-u font-mono text-[0.95rem] text-accent hover:text-accent-hi">
                {path}
              </a>
              <p className="mt-2 leading-relaxed text-muted">{desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="Building an integration?" copy="Call or book a call and we'll walk through the API, or scope a custom system for your business." />
    </>
  )
}
