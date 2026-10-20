import { leadsSteps } from '@/content/leads'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { EmailCheckLegend } from './LeadRecord'

/**
 * How every email is verified, as three cards in a row: the compact version
 * of the leads page's timeline (LeadsSteps), for /qualify, where the form
 * comes first and this is supporting detail.
 */
export function VerifySteps({ label = leadsSteps.label }: { label?: string }) {
  return (
    <section id="how" aria-labelledby="verify-title" className="container-x border-t border-line pt-16 md:pt-28">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <SectionLabel decode={false}>{label}</SectionLabel>
          <h2 id="verify-title" data-reveal className="display t-2 mt-6 max-w-[14ch]">
            {leadsSteps.title} <span className="serif-accent text-accent">{leadsSteps.titleAccent}</span>
          </h2>
        </div>
        <p data-reveal className="max-w-md leading-relaxed text-muted lg:col-span-5">
          {leadsSteps.intro}
        </p>
      </div>
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {leadsSteps.steps.map((step, i) => (
          <li key={step.number} data-reveal className="flex flex-col rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-7">
            <span className="font-mono text-[0.75rem] tracking-[0.14em] text-accent">STEP {step.number}</span>
            <h3 className="display mt-3 text-[clamp(1.3rem,1.8vw,1.6rem)] leading-[1.1]">{step.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{step.copy}</p>
            {i === leadsSteps.steps.length - 1 && (
              <div className="mt-5">
                <EmailCheckLegend />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
