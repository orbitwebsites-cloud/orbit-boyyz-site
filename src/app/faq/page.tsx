import { faqs, site } from '@/content/site'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { faqSchema, jsonLd, pageMeta, pageSchema } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Web Design FAQ: Pricing, Timelines, SEO',
  description:
    'Straight answers on hand-coded websites, 7-day launch builds, 50/50 payment, care plans, SEO and AI operations from Orbit Websites in Plainsboro, NJ.',
  path: '/faq',
})

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema('/faq'))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs, '/faq'))} />
      <PageHero
        label="[FAQ]"
        title={
          <>
            Web design questions, <span className="serif-accent text-accent">answered straight.</span>
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
