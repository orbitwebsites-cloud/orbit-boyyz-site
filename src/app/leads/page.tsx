import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { leadFields, leadsContact, leadsFaqs, leadsFieldsSection, leadsHero, leadsNoRisk, leadsOutreach } from '@/content/leads'
import { LeadRecord } from '@/components/leads/LeadRecord'
import { LeadsFaq } from '@/components/leads/LeadsFaq'
import { LeadsFooter } from '@/components/leads/LeadsFooter'
import { LeadsHeader } from '@/components/leads/LeadsHeader'
import { LeadsRequest } from '@/components/leads/LeadsRequest'
import { LeadsSteps } from '@/components/leads/LeadsSteps'
import { RequestCta } from '@/components/leads/RequestCta'
import { ArrowIcon } from '@/components/ui/Button'
import { Cursor } from '@/components/ui/Cursor'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { LEADS_URL } from '@/lib/leadsSite'
import { jsonLd } from '@/lib/seo'
import '@/components/leads/leads.css'

// /leads — the lead data offer for outbound agencies, served at
// https://leads.orbitboyzz.com/ (src/proxy.ts rewrites that host's "/" here
// and 308s orbitboyzz.com/leads to it). Standalone: outside the (site) route
// group, so the website business's preloader, nav, footer, dock, prices and
// booking links are neither rendered nor shipped in this page's JavaScript.
// Every primary CTA jumps to the 25-free-leads request form (#request,
// components/leads/LeadsRequest.tsx): no call or calendar step on this host.
// Order: a real masked row up top, how every email is verified, what's in each
// row, four straight answers, then the form with what happens after it.
// Motion stays quiet here: short fades only (data-reveal), no text effects.
// Copy rules live at the top of src/content/leads.ts.
// Listed in orbitboyzz.com/sitemap.xml as a cross-host entry (the leads host robots.txt points to that sitemap).

const TITLE = 'Verified lead lists for outbound agencies | Orbit Boyzz'
const DESCRIPTION =
  'Get 25 free leads in one niche, built from Google Maps listings and each business’s own website. Every email verified, business phone included, delivered within a few business days.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: LEADS_URL },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  openGraph: { type: 'website', siteName: 'Orbit Boyzz', locale: 'en_US', url: LEADS_URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${LEADS_URL}#service`,
      name: 'Verified lead lists for outbound agencies',
      description: DESCRIPTION,
      url: LEADS_URL,
      serviceType: 'B2B lead data',
      audience: { '@type': 'BusinessAudience', audienceType: 'Outbound and lead-gen agencies' },
      areaServed: { '@type': 'Country', name: 'United States' },
      provider: {
        '@type': 'Organization',
        '@id': 'https://orbitboyzz.com/#organization',
        name: 'Orbit Websites',
        alternateName: ['Orbit Boyzz', 'OrbitBoyzz'],
        url: 'https://orbitboyzz.com/',
        email: leadsContact.email,
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${LEADS_URL}#faq`,
      mainEntity: leadsFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

function DownArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1v11M2.5 7.5 7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Tick({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path d="m2 6.2 2.6 2.6L10 3.4" stroke="#D6B36A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Hero() {
  return (
    <section className="ld-hero relative isolate overflow-hidden pb-16 pt-[calc(var(--nav-h)+3rem)] md:pb-24 md:pt-[calc(var(--nav-h)+5rem)] lg:flex lg:min-h-[100svh] lg:items-center">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,106,0.16),transparent_65%)]" />
      <div className="container-x grid w-full gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="page-fade label flex items-center gap-2.5" style={{ '--delay': '-300ms' } as CSSProperties}>
            <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {leadsHero.eyebrow}
          </p>
          <h1 className="display mt-7 text-[clamp(3.1rem,7.2vw,7rem)]">
            <span className="sr-only">{leadsHero.srHeadline}</span>
            <span aria-hidden="true">
              <span className="mask">
                <span className="page-rise">{leadsHero.line1}</span>
              </span>{' '}
              <span className="mask">
                <span className="page-rise serif-accent pr-[0.08em] text-accent" style={{ '--delay': '90ms' } as CSSProperties}>
                  {leadsHero.line2}
                </span>
              </span>
            </span>
          </h1>
          <p className="page-fade t-lead mt-8 max-w-[36rem] text-muted" style={{ '--delay': '0ms' } as CSSProperties}>
            {leadsHero.sub}
          </p>
          <div className="page-fade mt-10" style={{ '--delay': '120ms' } as CSSProperties}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <RequestCta magnetic block>
                {leadsHero.cta}
              </RequestCta>
              <a href="#how" className="btn btn-ghost w-full sm:w-auto">
                <span>{leadsHero.secondary}</span>
                <span className="btn-arrow">
                  <DownArrow />
                </span>
              </a>
            </div>
            {/* The no-risk line sits right under the buttons, where the decision happens. */}
            <p className="mt-4 flex items-center gap-2 text-[0.95rem] font-medium text-fg/90">
              <Tick className="shrink-0" />
              {leadsNoRisk}
            </p>
          </div>
          <ul className="page-fade mt-9 flex flex-wrap gap-2" style={{ '--delay': '200ms' } as CSSProperties}>
            {leadsHero.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3.5 py-2 text-[0.82rem] text-muted backdrop-blur-sm">
                <Tick />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <div className="page-fade relative lg:col-span-5" style={{ '--delay': '160ms' } as CSSProperties}>
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-50 lg:block">
            <OrbitSystem tilt={70} coreClassName="inset-[44%] opacity-50" />
          </div>
          <LeadRecord />
        </div>
      </div>
    </section>
  )
}

function Fields() {
  return (
    <section id="fields" aria-labelledby="fields-title" className="container-x py-16 md:py-32">
      {/* grid-cols-1 + min-w-0: the sheet's two-column grid would otherwise size this column
          from its content (wider than a 320–375px phone) and scroll the page sideways. */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <div className="min-w-0 lg:col-span-5">
          <SectionLabel decode={false}>{leadsFieldsSection.label}</SectionLabel>
          <h2 id="fields-title" data-reveal className="display t-2 mt-6">
            {leadsFieldsSection.title} <span className="serif-accent text-accent">{leadsFieldsSection.titleAccent}</span>
          </h2>
          <p data-reveal className="mt-6 max-w-md leading-relaxed text-muted">
            {leadsFieldsSection.note}
          </p>
        </div>

        <div data-reveal className="min-w-0 lg:col-span-7">
          <div className="overflow-hidden rounded-[calc(var(--radius)+0.25rem)] border border-line-strong bg-panel/80">
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
              </span>
              <span className="truncate font-mono text-[0.68rem] uppercase tracking-[0.14em] text-dim">Your sheet · one row per lead</span>
            </div>
            <ol className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
              {leadFields.map((field, i) => (
                <li
                  key={field.key}
                  // Two columns on phones: an odd last cell spans both, so no empty gap-coloured slot shows.
                  className="flex flex-col items-start gap-3 bg-panel px-4 py-5 max-sm:odd:last:col-span-2 sm:flex-row sm:items-start sm:px-5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-accent/40 font-mono text-[0.72rem] text-accent" aria-hidden="true">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-medium leading-tight sm:text-base">{field.label}</span>
                    <span className="mt-1.5 block text-[0.8rem] leading-snug text-dim">{field.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function Outreach() {
  return (
    <section aria-label="Outreach" className="container-x pb-16 md:pb-32">
      <div className="flex flex-col gap-6 rounded-[calc(var(--radius)+0.5rem)] border border-line bg-panel bg-[radial-gradient(ellipse_at_top_right,rgba(214,179,106,0.14),transparent_55%)] px-6 py-9 md:flex-row md:items-center md:justify-between md:px-12 md:py-12">
        <div data-reveal>
          <p className="display text-balance text-[clamp(1.6rem,3vw,2.4rem)]">{leadsOutreach.title}</p>
          <p className="mt-3 text-muted">{leadsOutreach.copy}</p>
        </div>
        <a href={`mailto:${leadsContact.email}?subject=Running%20our%20outreach`} className="btn btn-ghost w-full sm:w-auto sm:self-start md:self-auto">
          <span>{leadsContact.email}</span>
          <span className="btn-arrow">
            <ArrowIcon />
          </span>
        </a>
      </div>
    </section>
  )
}

export default function LeadsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <LeadsHeader />
      {/* The skip link's target (app/layout.tsx). tabIndex -1 so "Skip to content" moves focus here, not just the scroll.
          ld-main: leads.css drops the sections' scroll-margin while Lenis runs (it already offsets anchor jumps).
          ld-type: no one-word last lines (text-wrap pretty on copy, balance on headings). */}
      <main id="main" tabIndex={-1} className="ld-main ld-type outline-none">
        <Hero />
        <LeadsSteps />
        <Fields />
        <LeadsFaq />
        <LeadsRequest />
        <Outreach />
      </main>
      <LeadsFooter />
      <Cursor />
    </>
  )
}
