import { leadsContact, leadsFaqSection, leadsFaqs } from '@/content/leads'
import { SectionLabel } from '@/components/ui/SectionLabel'

/**
 * [03 // QUESTIONS] The four questions agencies ask first, answers always
 * visible (four short answers read faster than an accordion). Shared by
 * leads.orbitboyzz.com and /qualify; the leads page also lists them as
 * FAQPage structured data.
 */
export function LeadsFaq({ label = leadsFaqSection.label }: { label?: string }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="container-x scroll-mt-20 py-16 md:py-32">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionLabel decode={false}>{label}</SectionLabel>
          <h2 id="faq-title" data-reveal className="display t-3 mt-6 max-w-[16ch]">
            {leadsFaqSection.title}
          </h2>
          {/* No data-reveal here: a block hidden until scrolled to can't take keyboard focus (the link). */}
          <p className="mt-5 text-muted">
            Anything else? Email{' '}
            <a href={`mailto:${leadsContact.email}`} className="link-u text-fg">
              {leadsContact.email}
            </a>
            .
          </p>
        </div>
        <dl className="border-t border-line md:col-span-8">
          {leadsFaqs.map((item, i) => (
            <div key={item.q} data-reveal className="border-b border-line py-6 md:py-7">
              {/* Fixed-width number (w-6) + gap-5 = 2.75rem: the answer's pl-11 starts exactly under the question text. */}
              <dt className="flex gap-5">
                <span className="mt-1.5 w-6 shrink-0 font-mono text-[0.72rem] tracking-[0.14em] text-dim" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-snug">{item.q}</span>
              </dt>
              <dd className="mt-3 max-w-2xl pl-11 leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
