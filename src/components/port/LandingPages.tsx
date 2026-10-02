import {
  aOrAn,
  industryLandingFaqs,
  inlineName,
  townLandingFaqs,
  websiteCostTiers,
  type IndustryPage,
  type IndustryRewrite,
  type TownPage,
} from '@/content/landing'
import { site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ArrowLink, DirectAnswer, LandingFaq, LocalPagesGrid, NumberedCards, Section, SectionTitle } from './Blocks'

export function HeroActions({ quoteHref }: { quoteHref: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button href={site.phoneHref} icon="phone">
        Call {site.phoneDisplay}
      </Button>
      <Button href={quoteHref} variant="ghost">
        Get a range
      </Button>
      <Button href="/pricing" variant="ghost">
        See pricing
      </Button>
    </div>
  )
}

export function TownLanding({ page }: { page: TownPage }) {
  const cards: Array<[string, string]> = [
    ...page.local,
    ['Service-area structure', `Clear service, town, and FAQ sections tell customers and search engines that you work in ${page.town}, ${page.county}, and nearby ${page.nearby}.`],
    ['Built around calls and quotes', 'Click-to-call, quote requests, and booking paths come first, with AI intake added only when lead value and response speed justify it.'],
  ]

  return (
    <>
      <PageHero
        label={page.label}
        title={
          <>
            Web design for <span className="serif-accent text-accent">{page.town}</span> home-service businesses.
          </>
        }
        lead={page.intro}
      >
        <HeroActions quoteHref={`/quote?source=${encodeURIComponent(page.path)}`} />
      </PageHero>

      <LocalPagesGrid current={page.path} />

      <Section label="What you get">
        <SectionTitle>Built for {page.audience} in {page.town}.</SectionTitle>
        <NumberedCards items={cards} />
      </Section>

      <DirectAnswer question={`How much does web design cost in ${page.town}?`}>
        A launch website for a {page.town} local business is quoted on a free call after a quick look at your needs: a 7-day sprint, 50% to start and 50% on approval.
        Premium builds start at $3,500. AI-powered lead intake, booking logic, routing, and proposal workflows run $5,000 to $15,000+, depending on integrations and
        workflow complexity, and optional monthly plans are $300–$700/mo.
      </DirectAnswer>

      <LandingFaq label="[LOCAL FAQ]" heading={`Questions ${page.town} businesses ask before hiring.`} items={townLandingFaqs(page)} />

      <CtaBand title={`Ready for a better ${page.town.replace(/, NJ$/, '')} website?`} />
    </>
  )
}

/** Trade cost question as an H2, a short direct answer, then the shared tier table. */
function CostTiers({ cost }: { cost: NonNullable<IndustryPage['cost']> }) {
  return (
    <Section label="Website cost">
      <div className="grid gap-10 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-5">
          <SectionLabel>[COST // BUILD TIERS]</SectionLabel>
          <h2 className="display t-3 mt-6 max-w-[22ch] text-balance">{cost.question}</h2>
          <p className="t-lead mt-6 text-muted">{cost.answer}</p>
          <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
            <ArrowLink href="/pricing">Full pricing →</ArrowLink>
          </p>
        </div>
        <div data-reveal className="lg:col-span-7">
          <div className="overflow-x-auto rounded-[var(--radius)] border border-line" data-lenis-prevent>
            <table className="w-full min-w-[34rem] border-collapse text-left text-[0.93rem]">
              <caption className="sr-only">Orbit Websites build tiers and prices</caption>
              <thead>
                <tr className="border-b border-line bg-panel/80">
                  <th scope="col" className="px-5 py-4 font-normal">
                    <span className="label">Tier</span>
                  </th>
                  <th scope="col" className="px-5 py-4 font-normal">
                    <span className="label">Price</span>
                  </th>
                  <th scope="col" className="px-5 py-4 font-normal">
                    <span className="label">What it covers</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {websiteCostTiers.map(([tier, price, covers]) => (
                  <tr key={tier} className="border-t border-line align-top">
                    <th scope="row" className="px-5 py-4 font-medium text-fg">
                      {tier}
                    </th>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-[0.85rem] text-accent">{price}</td>
                    <td className="px-5 py-4 leading-relaxed text-muted">{covers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  )
}

/** Prominent hand-off from a trade page to that trade's lead-response / AI intake offer. */
function LeadSystemLink({ link }: { link: NonNullable<IndustryPage['leadSystem']> }) {
  return (
    <Section label="Lead response">
      <div
        data-reveal
        className="grid gap-8 rounded-[calc(var(--radius)+0.5rem)] border border-accent/40 bg-[radial-gradient(ellipse_at_top_right,rgba(214,179,106,0.16),transparent_60%),var(--panel)] p-6 md:grid-cols-12 md:items-end md:p-12"
      >
        <div className="md:col-span-8">
          <SectionLabel>[AFTER THE CLICK // LEAD RESPONSE]</SectionLabel>
          <h2 className="display t-3 mt-6 max-w-[24ch] text-balance">{link.title}</h2>
          <p className="t-lead mt-5 max-w-[60ch] text-muted">{link.copy}</p>
        </div>
        <p className="md:col-span-4 md:text-right">
          <ArrowLink href={link.href}>See the {link.anchor} →</ArrowLink>
        </p>
      </div>
    </Section>
  )
}

/** Trade page written for that trade only (replaces the shared template body). */
function IndustryRewriteLanding({ page, rewrite }: { page: IndustryPage; rewrite: IndustryRewrite }) {
  const [before, accent, after] = rewrite.h1

  return (
    <>
      <PageHero
        label={page.label}
        title={
          <>
            {before}
            <span className="serif-accent text-accent">{accent}</span>
            {after}
          </>
        }
        lead={rewrite.lead}
      >
        <HeroActions quoteHref={`/quote?source=${encodeURIComponent(page.path)}`} />
      </PageHero>

      <Section label="Lead paths" className="pb-0 md:pb-0">
        <SectionLabel>[LEAD PATHS // ONE PER JOB]</SectionLabel>
        <p data-reveal className="t-lead mt-6 max-w-[64ch] text-muted">
          {rewrite.leadPathsIntro}
        </p>
      </Section>

      {rewrite.leadPaths.map((path, i) => (
        <Section key={path.id} id={path.id} label={path.title} className="scroll-mt-24">
          <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-12 md:pt-14">
            <div data-reveal className="md:col-span-7">
              <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="display t-3 mt-4 max-w-[24ch] text-balance">{path.title}</h2>
              <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-muted">{path.body}</p>
            </div>
            <div data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:col-span-5 md:p-7">
              <h3 className="label text-accent">What the form asks</h3>
              <ul className="mt-5 grid gap-3 text-[0.95rem] leading-snug">
                {path.intake.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      <Section label={rewrite.routing.title}>
        <SectionLabel>[ROUTING // HOME OR BUSINESS]</SectionLabel>
        <SectionTitle className="mt-6">{rewrite.routing.title}</SectionTitle>
        <p data-reveal className="mt-6 max-w-[64ch] text-[1.05rem] leading-relaxed text-muted">
          {rewrite.routing.body}
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {rewrite.routing.lanes.map((lane) => (
            <div key={lane.name} data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8">
              <h3 className="display text-2xl">{lane.name}</h3>
              <ul className="mt-5 grid gap-3 text-muted">
                {lane.items.map((item) => (
                  <li key={item} className="border-t border-line pt-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p data-reveal className="mt-4 rounded-[var(--radius)] border border-accent/30 px-6 py-5 text-sm text-fg/90 md:px-8">
          {rewrite.routing.note}
        </p>
      </Section>

      <Section label={rewrite.license.title}>
        <div className="grid gap-10 md:grid-cols-12">
          <div data-reveal className="md:col-span-7">
            <SectionLabel>[LICENSE // NEW JERSEY]</SectionLabel>
            <h2 className="display t-3 mt-6 max-w-[24ch] text-balance">{rewrite.license.title}</h2>
            <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-muted">{rewrite.license.body}</p>
          </div>
          <ol data-reveal className="grid content-start gap-3 md:col-span-5">
            {rewrite.license.placements.map((placement, i) => (
              <li key={placement} className="flex gap-4 rounded-2xl border border-line bg-panel/50 px-5 py-4">
                <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span>{placement}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {page.cost && <CostTiers cost={page.cost} />}

      {page.leadSystem && <LeadSystemLink link={page.leadSystem} />}

      <Section label="Service area">
        <div data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8">
          <SectionLabel>[SERVICE AREA // CENTRAL NJ]</SectionLabel>
          <p className="mt-5 max-w-[68ch] leading-relaxed text-muted">{rewrite.areas}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <ArrowLink href="/web-design-central-nj">Web design in Central NJ →</ArrowLink>
            <ArrowLink href="/web-design-plainsboro-nj" muted>
              Plainsboro web design →
            </ArrowLink>
          </div>
        </div>
      </Section>

      <LandingFaq label={`[${page.industryShort.toUpperCase()} FAQ]`} heading={rewrite.faqHeading} items={industryLandingFaqs(page)} />

      <CtaBand title={rewrite.cta.title} copy={rewrite.cta.copy} />
    </>
  )
}

export function IndustryLanding({ page }: { page: IndustryPage }) {
  if (page.rewrite) return <IndustryRewriteLanding page={page} rewrite={page.rewrite} />

  const name = inlineName(page.industryShort)
  const a = aOrAn(name)
  const cards: Array<[string, string]> = [
    ['Local search visibility', `The site is structured to rank for service-specific and town-specific searches — "${name} near me", "${name} ${page.towns.split(',')[0]}", and job-type variations.`],
    ['AI-powered intake', page.aiUseCase],
    ['Fast mobile performance', `Most local buyers compare options on mobile. Hand-coded React and prerendered pages stay lightweight so a buyer comparing ${name} companies doesn't bounce before calling.`],
    ['Built to convert', `Every page is structured around ${page.jobType} — quote requests, click-to-call, booking, and contact forms — not generic brochure copy.`],
  ]

  return (
    <>
      <PageHero
        label={page.label}
        title={
          <>
            Web design for <span className="serif-accent text-accent">{page.industry}</span> in NJ.
          </>
        }
        lead={`Orbit Websites builds hand-coded websites and AI intake systems for ${page.industry} in ${page.towns}. We build around ${page.jobType} — not vanity traffic. Launch builds are quoted on a free call, premium builds start at $3,500, and AI-powered lead intake runs $5,000–$15,000+ when faster response can pay for itself.`}
      >
        <HeroActions quoteHref={`/quote?source=${encodeURIComponent(page.path)}`} />
      </PageHero>

      <LocalPagesGrid />

      <Section label="What you get">
        <SectionTitle>Built for {page.industry} that need real leads.</SectionTitle>
        <NumberedCards items={cards} />
      </Section>

      {page.leadSystem && <LeadSystemLink link={page.leadSystem} />}

      <DirectAnswer
        question={`How much does a website cost for ${a} ${name} company in NJ?`}
        links={
          <>
            <ArrowLink href="/pricing">See pricing →</ArrowLink>
            <ArrowLink href="/services" muted>
              Our services →
            </ArrowLink>
            <ArrowLink href="/web-design-central-nj" muted>
              Web design in Central NJ →
            </ArrowLink>
          </>
        }
      >
        A launch site for {a} {name} company is quoted on a free call after a quick look at your needs, and premium builds start at $3,500. Projects with AI intake,
        job-type routing, emergency alert logic, or proposal automation run $5,000 to $15,000+ depending on workflow complexity, and optional care plans are $300–$700/mo. Average {page.jobType} run {page.avgJob}, so the site pays back in a handful of
        jobs.
      </DirectAnswer>

      {page.cost && <CostTiers cost={page.cost} />}

      <LandingFaq label="[INDUSTRY FAQ]" heading={`Questions ${name} businesses ask before hiring.`} items={industryLandingFaqs(page)} />

      <CtaBand title={`Let's build your ${name} website.`} />
    </>
  )
}
