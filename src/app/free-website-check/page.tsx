import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { WebsiteCheck } from '@/components/port/WebsiteCheck'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'
import { CHECK_LABELS, CHECK_WEIGHTS, CHECK_WHY } from '@/lib/websiteCheck'

export const metadata = legacyMetadata('/free-website-check')

const CHECK_IDS = Object.keys(CHECK_WEIGHTS) as Array<keyof typeof CHECK_WEIGHTS>

export default function FreeWebsiteCheckPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd('/free-website-check')} />
      <PageHero
        label="[FREE TOOL // WEBSITE & GOOGLE CHECK]"
        title={
          <>
            Free website check for <span className="serif-accent text-accent">NJ small businesses.</span>
          </>
        }
        lead="Enter your business and town. In about 20 seconds you get a scored report on what decides whether local customers find you and call: mobile speed, Google basics, tap-to-call and quote forms. No website yet? We'll show you what that's costing you."
      />

      <WebsiteCheck />

      <section aria-labelledby="what-title" className="container-x py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel>[WHAT WE CHECK // 14 CHECKS]</SectionLabel>
            <h2 id="what-title" className="display t-2 mt-6 max-w-[20ch] text-balance">
              The basics that turn a search into a phone call.
            </h2>
          </div>
          <p className="max-w-xl leading-relaxed text-muted md:col-span-5">
            Each check is weighted by how much it affects calls and quote requests, for a score out of 100. If a check can&apos;t run (say Google PageSpeed is busy), it is
            marked &quot;Not checked&quot; and left out of the score. We never count it as a pass.
          </p>
        </div>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHECK_IDS.map((id) => (
            <li key={id} className="rounded-2xl border border-line bg-panel/60 px-5 py-4">
              <p className="flex items-baseline justify-between gap-3 text-fg">
                {CHECK_LABELS[id]}
                <span className="font-mono text-[0.68rem] tracking-[0.1em] text-dim">{CHECK_WEIGHTS[id]} PTS</span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{CHECK_WHY[id]}</p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Rather talk it through?"
        copy="Book a free 30-minute call and we'll go through your site (or your plan for one) together. You talk directly with the people who build it."
      />
    </>
  )
}
