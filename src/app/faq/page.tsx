import { faqs, site } from '@/content/site'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { faqSchema, jsonLd, pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'FAQ — Websites, pricing, timelines & AI operations',
  description:
    'Answers about hand-coded Next.js websites, launch timelines, 50/50 payment, care plans, SEO and the AI operations tier from Orbit Websites in Plainsboro, NJ.',
  path: '/faq',
})

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema())} />
      <PageHero
        label="[FAQ]"
        title={
          <>
            Questions, <span className="serif-accent text-accent">answered straight.</span>
          </>
        }
        lead="Everything business owners usually ask us before a first call. If yours is not here, just call."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={site.phoneHref} icon="phone">
            Call {site.phoneDisplay}
          </Button>
          <Button href={site.booking} variant="ghost">
            Book a free call
          </Button>
        </div>
      </PageHero>

      <section aria-label="Frequently asked questions" className="container-x">
        <div className="mx-auto max-w-4xl">
          <Accordion items={faqs} defaultOpen={0} />
        </div>
      </section>

      <CtaBand title="Still have a question?" copy="Call, text or book a call — you will get a straight answer from the person who would build your site." />
    </>
  )
}
