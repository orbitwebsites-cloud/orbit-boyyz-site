import type { Metadata } from 'next'
import { leadsNoRisk, leadsQualify } from '@/content/leads'
import { LeadRecord } from '@/components/leads/LeadRecord'
import { LeadsFaq } from '@/components/leads/LeadsFaq'
import { LeadsFooter } from '@/components/leads/LeadsFooter'
import { LeadsHeader } from '@/components/leads/LeadsHeader'
import { LeadsRequestForm } from '@/components/leads/LeadsRequestForm'
import { NextSteps } from '@/components/leads/NextSteps'
import { VerifySteps } from '@/components/leads/VerifySteps'
import { Cursor } from '@/components/ui/Cursor'
import { LEADS_REQUEST_ID } from '@/lib/leadsSite'
import '@/components/leads/leads.css'

// /qualify on orbitboyzz.com — linked from agency outreach replies. The same
// 25-free-leads request as leads.orbitboyzz.com's #request form (one shared
// <LeadsRequestForm>, src="qualify" unless the link carries ?src=), with no
// call or calendar step. On leads.orbitboyzz.com, /qualify 308s to /#request
// (src/proxy.ts). Copy rules: the top of src/content/leads.ts.
// Form first: the visitor already knows the offer from the email. Below it,
// what happens after the request, a real masked row, how every email is
// verified and the four questions agencies ask first.
// Standalone: outside the (site) route group, so the website business's
// preloader, nav, footer, dock, prices and booking links are neither rendered
// nor shipped here; it wears the leads site's own header and footer.
// SEO: noindex,nofollow with no canonical (leads.orbitboyzz.com is the indexed
// page); excluded from sitemap.xml (and so from IndexNow) in app/sitemap.ts,
// and not listed in feed.xml or llms.txt.

const PAGE_URL = 'https://orbitboyzz.com/qualify'
const TITLE = '25 free leads for outbound agencies | Orbit Boyzz'
const DESCRIPTION =
  'Get 25 free leads in one niche, built from Google Maps listings and each business’s own website. Every email verified, business phone included, owner’s name where public sources show it, delivered within a few business days.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: 'website', siteName: 'Orbit Boyzz', locale: 'en_US', url: PAGE_URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

function Tick() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
      <path d="m2 6.2 2.6 2.6L10 3.4" stroke="#D6B36A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function QualifyPage() {
  return (
    <>
      <LeadsHeader />
      {/* The skip link's target (app/layout.tsx). ld-type: leads.css line-break rules. */}
      <main id="main" tabIndex={-1} className="ld-main ld-type outline-none">
        <section
          aria-labelledby="qualify-title"
          className="ld-request relative isolate overflow-hidden pb-16 pt-[calc(var(--nav-h)+2.5rem)] md:pb-28 md:pt-[calc(var(--nav-h)+4.5rem)]"
        >
          <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,106,0.16),transparent_65%)]" />

          {/* Phones: headline, form, what happens next, then the real row. Desktop: headline and the
              real row left; form and what happens next right.
              grid-cols-1 + min-w-0: a long word (e.g. the email on the thank-you card) wraps instead of widening the page. */}
          <div className="container-x grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-12">
            <div className="min-w-0 lg:col-span-5 lg:row-start-1">
              <p className="label flex items-center gap-2.5">
                <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {leadsQualify.eyebrow}
              </p>
              <h1 id="qualify-title" className="display mt-6 text-[clamp(3rem,8.5vw,5.75rem)] lg:text-[clamp(3.5rem,5.6vw,5.75rem)]">
                {leadsQualify.title} <span className="serif-accent pr-[0.08em] text-accent">{leadsQualify.titleAccent}</span>
              </h1>
              <p className="t-lead mt-6 max-w-xl text-muted">{leadsQualify.explainer}</p>
              {/* Phones: above the form, in view on arrival. Desktop: the form's own line under the button is beside it already. */}
              <p className="mt-5 flex items-center gap-2 text-[0.95rem] font-medium text-fg/90 lg:hidden">
                <Tick />
                {leadsNoRisk}
              </p>
            </div>

            {/* id="request": the header's "Get 25 free leads" jumps here (ld-anchor: no extra scroll-margin under Lenis). */}
            <div className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-start">
              <div id={LEADS_REQUEST_ID} className="ld-anchor scroll-mt-24">
                <LeadsRequestForm defaultSource="qualify" />
              </div>
              <NextSteps heading="h2" className="ld-next mt-10" />
            </div>

            <div className="min-w-0 lg:col-span-5 lg:row-start-2 lg:self-start">
              <LeadRecord className="mt-3 lg:mt-1" />
            </div>
          </div>
        </section>

        <VerifySteps label="[01 // VERIFICATION]" />
        <LeadsFaq label="[02 // QUESTIONS]" />
      </main>
      <LeadsFooter />
      <Cursor />
    </>
  )
}
