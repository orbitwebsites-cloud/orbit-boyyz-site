import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { QuoteEstimator } from '@/components/port/QuoteEstimator'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

export const metadata = legacyMetadata('/quote')

export default function QuotePage() {
  return (
    <>
      <JsonLd data={legacyJsonLd('/quote')} />
      <PageHero
        label="[QUOTE // PROJECT RANGE]"
        title={
          <>
            Get a rough range before the first <span className="serif-accent text-accent">sales call.</span>
          </>
        }
      />
      <QuoteEstimator />
      <CtaBand title="Prefer to talk it through?" />
    </>
  )
}
