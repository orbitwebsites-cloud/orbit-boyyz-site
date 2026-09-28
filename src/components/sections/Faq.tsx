import { faqs, site } from '@/content/site'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'

/** [08 // FAQ] Top six questions in a Motion height accordion. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 md:py-32">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionLabel>[08 // FAQ]</SectionLabel>
          <h2 id="faq-title" data-split className="display t-2 mt-6 max-w-[10ch]">
            Straight answers.
          </h2>
          <p data-reveal className="mt-6 max-w-xs text-muted">
            Still unsure? Call{' '}
            <a href={site.phoneHref} className="text-fg underline decoration-accent/60 underline-offset-4 hover:text-accent">
              {site.phoneDisplay}
            </a>{' '}
            — you will talk to the builder.
          </p>
          <div data-reveal className="mt-8">
            <Button href="/faq" variant="ghost" size="sm">
              All questions
            </Button>
          </div>
        </div>
        <div data-reveal className="md:col-span-8">
          <Accordion items={faqs.slice(0, 6)} />
        </div>
      </div>
    </section>
  )
}
