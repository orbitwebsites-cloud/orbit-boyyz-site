import { leadsRequest } from '@/content/leads'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { LEADS_REQUEST_ID } from '@/lib/leadsSite'
import { LeadsRequestForm } from './LeadsRequestForm'
import { NextSteps } from './NextSteps'

/**
 * [04 // START FREE] The page's closing move and the target of every CTA
 * (#request): the headline, the 25-free-leads request form and what happens
 * after you send it. Calm on purpose: the headline doesn't animate, so the
 * form is the only thing asking for attention.
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

      {/* Phones and tablets: headline, form, then what happens next. Desktop: headline and next steps
          left, form right, so the whole form is in view after a CTA jump.
          grid-cols-1 + min-w-0: a long word (e.g. the email on the thank-you card) wraps instead of widening the column past the screen. */}
      <div className="container-x grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        {/* Below lg all three blocks share one centred max-w-2xl column, so their left edges line up on tablets. */}
        <div className="mx-auto w-full min-w-0 max-w-2xl lg:col-span-5 lg:row-start-1 lg:mx-0 lg:max-w-none">
          <SectionLabel decode={false}>{leadsRequest.label}</SectionLabel>
          <h2 id="request-title" className="display mt-7 text-balance text-[clamp(3rem,8.5vw,5.75rem)] leading-[0.92] tracking-[-0.05em] lg:text-[clamp(3.5rem,5.6vw,5.75rem)]">
            {leadsRequest.title}
          </h2>
          <p className="t-lead mt-6 max-w-xl text-muted lg:max-w-md">{leadsRequest.copy}</p>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-2xl lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-start">
          {/* Renders its own "Prefer email?" line under the form, and drops it on the thank-you card (which already gives the email). */}
          <LeadsRequestForm />
        </div>

        <NextSteps className="ld-next mx-auto w-full max-w-2xl lg:col-span-5 lg:row-start-2 lg:mx-0 lg:max-w-md" />
      </div>
    </section>
  )
}
