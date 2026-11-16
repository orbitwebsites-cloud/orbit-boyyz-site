import { leadsContact, leadsNoRisk, leadsRequest } from '@/content/leads'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { LEADS_REQUEST_ID } from '@/lib/leadsSite'
import { NextSteps } from './NextSteps'
import { RequestCta } from './RequestCta'

/**
 * [04 // BOOK A CALL] The page's closing move: the headline, the booking
 * button (the /book-leads flow) and what happens after you book. Keeps the old
 * #request id, so links to the former request form still land here. Calm on
 * purpose: the headline doesn't animate, so the button is the only thing
 * asking for attention.
 */
export function LeadsRequest() {
  return (
    <section
      id={LEADS_REQUEST_ID}
      aria-labelledby="request-title"
      className="ld-request relative isolate scroll-mt-20 overflow-hidden pb-16 pt-8 md:pb-32 md:pt-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[150vw] max-w-[78rem] -translate-x-1/2 -translate-y-1/2 opacity-60 md:w-[92vw]">
        <OrbitSystem tilt={72} coreClassName="inset-[42%] opacity-70" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_72%)]" />

      {/* Phones and tablets: headline and button, then what happens next. Desktop: side by side.
          grid-cols-1 + min-w-0: a long word (the email address) wraps instead of widening the column past the screen. */}
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-12">
        <div className="mx-auto w-full min-w-0 max-w-2xl lg:col-span-6 lg:mx-0 lg:max-w-none">
          <SectionLabel decode={false}>{leadsRequest.label}</SectionLabel>
          <h2 id="request-title" className="display mt-7 text-balance text-[clamp(3rem,8.5vw,5.75rem)] leading-[0.92] tracking-[-0.05em] lg:text-[clamp(3.5rem,5.6vw,5.75rem)]">
            {leadsRequest.title}
          </h2>
          <p className="t-lead mt-6 max-w-xl text-muted lg:max-w-md">{leadsRequest.copy}</p>
          <div className="mt-9">
            <RequestCta magnetic block>
              {leadsRequest.cta}
            </RequestCta>
          </div>
          <p className="mt-4 text-[0.95rem] font-medium text-fg/90">{leadsNoRisk}</p>
          <p className="mt-6 text-[0.95rem] text-muted">
            {leadsRequest.foot}{' '}
            <a href={`mailto:${leadsContact.email}`} className="link-u text-fg wrap-anywhere">
              {leadsContact.email}
            </a>
          </p>
        </div>

        <NextSteps className="ld-next mx-auto w-full max-w-2xl lg:col-span-5 lg:col-start-8 lg:mx-0 lg:max-w-none" />
      </div>
    </section>
  )
}
