import { blogPosts, type BlogPost } from '@/content/blog'
import { demoCopy } from '@/content/demoCopy'
import { getDemo, type DemoBusiness } from '@/content/demos'
import { HUB_PATH, NJ_PATH, type KeywordRoute } from '@/content/keyword-pages'
import { PRICING_SENTENCE, type KeywordSection } from '@/content/keyword-pages/types'
import { process } from '@/content/site'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero, type Crumb } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { BlogCards } from './BlogCards'
import { ArrowLink, DirectAnswer, LandingFaq, LocalPagesGrid, NumberedCards, Section, SectionTitle } from './Blocks'
import { CostTiers, HeroActions } from './LandingPages'
import { TradeLinksGrid } from './TradeLinks'

/**
 * Shared renderer for the keyword landing pages (src/content/keyword-pages).
 * Every page has the same order; `kind` only decides where the link grids go:
 *   hub      → trade grid right after the direct answer
 *   location → town grid after the direct answer, trade grid near the end
 *   trade / topic → trade grid near the end (it carries the hub, NJ and sibling links)
 * Server component.
 */
export function KeywordLanding({ route }: { route: KeywordRoute }) {
  const { page, kind, nj } = route
  const [before, accent, after] = page.hero.h1
  const crumbs: Crumb[] = [{ name: 'Home', href: '/' }, ...page.breadcrumbs.map(([name, href]) => ({ name, href })), { name: page.name }]
  const posts = page.related.posts.map((slug) => blogPosts.find((p) => p.slug === slug)).filter((p): p is BlogPost => Boolean(p))
  const examples = (page.examples?.demos ?? []).map((slug) => getDemo(slug)).filter((d): d is DemoBusiness => Boolean(d))

  return (
    <>
      <PageHero
        breadcrumbs={crumbs}
        label={page.hero.label}
        title={
          <>
            {before}
            <span className="serif-accent text-accent">{accent}</span>
            {after}
          </>
        }
        lead={page.hero.intro}
      >
        <HeroActions quoteHref={`/quote?source=${encodeURIComponent(page.path)}`} />
      </PageHero>

      <DirectAnswer
        question={page.directAnswer.question}
        links={
          <>
            {nj && <ArrowLink href={nj.path}>{nj.label} →</ArrowLink>}
            {kind !== 'hub' && (
              <ArrowLink href={HUB_PATH} muted={Boolean(nj)}>
                All home-service trades →
              </ArrowLink>
            )}
            {kind !== 'location' && (
              <ArrowLink href={NJ_PATH} muted>
                Web design in New Jersey →
              </ArrowLink>
            )}
            <ArrowLink href="/pricing" muted>
              Full pricing →
            </ArrowLink>
          </>
        }
      >
        {page.directAnswer.answer}
      </DirectAnswer>

      {kind === 'hub' && <TradeLinksGrid current={page.path} heading="Pick your trade." />}
      {kind === 'location' && <LocalPagesGrid current={page.path} />}

      {page.sections.map((section, i) => (
        <KeywordSectionBlock key={section.id} section={section} index={i} />
      ))}

      <Section label={page.includes.heading}>
        <SectionLabel>[WHAT THE SITE INCLUDES]</SectionLabel>
        <SectionTitle className="mt-6">{page.includes.heading}</SectionTitle>
        {page.includes.intro && (
          <p data-reveal className="t-lead mt-6 max-w-[64ch] text-muted">
            {page.includes.intro}
          </p>
        )}
        <NumberedCards items={page.includes.items} />
      </Section>

      {page.examples && examples.length > 0 && <Examples heading={page.examples.heading} intro={page.examples.intro} demos={examples} />}

      <Process heading={page.process.heading} intro={page.process.intro} />

      <CostTiers cost={{ question: page.pricing.question, answer: `${page.pricing.lead} ${PRICING_SENTENCE}` }} />

      {kind !== 'hub' && (
        <TradeLinksGrid
          current={page.path}
          heading={kind === 'trade' ? 'Website design for other home-service trades.' : 'Websites for every home-service trade.'}
        />
      )}

      {(posts.length > 0 || Boolean(page.related.links?.length)) && (
        <Section label="Related answers">
          <SectionLabel>[RELATED // KEEP READING]</SectionLabel>
          <h2 className="display t-3 mt-6 max-w-[24ch] text-balance">Related answers.</h2>
          {page.related.links && page.related.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {page.related.links.map(([label, href]) => (
                <ArrowLink key={href} href={href}>
                  {label} →
                </ArrowLink>
              ))}
            </div>
          )}
          {posts.length > 0 && <BlogCards posts={posts} className="mt-10" />}
        </Section>
      )}

      <LandingFaq label="[FAQ]" heading={page.faqHeading} items={page.faqs} />

      <CtaBand title={page.cta.title} copy={page.cta.copy} />
    </>
  )
}

/** One body section: number + H2 + paragraphs, with an optional side panel (same layout as the electrician lead paths). */
function KeywordSectionBlock({ section, index }: { section: KeywordSection; index: number }) {
  return (
    <Section id={section.id} label={section.heading} className="scroll-mt-24">
      <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-12 md:pt-14">
        <div data-reveal className={section.bullets ? 'md:col-span-7' : 'md:col-span-9'}>
          <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">{String(index + 1).padStart(2, '0')}</span>
          <h2 className="display t-3 mt-4 max-w-[24ch] text-balance">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p} className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
        {section.bullets && (
          <div data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:col-span-5 md:p-7">
            <h3 className="label text-accent">{section.bullets.title}</h3>
            {section.bullets.ordered ? (
              <ol className="mt-5 grid gap-3 text-[0.95rem] leading-snug">
                {section.bullets.items.map((item, i) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="w-5 shrink-0 font-mono text-[0.8rem] leading-[1.45] text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="mt-5 grid gap-3 text-[0.95rem] leading-snug">
                {section.bullets.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}

/**
 * Fictional sample demos (/demo/sample-*). Always labeled as made-up businesses:
 * they show a layout, they are not clients. The demo pages are noindex and carry
 * no Orbit chrome, so they open in a new tab with rel="nofollow".
 */
function Examples({ heading, intro, demos }: { heading: string; intro: string; demos: DemoBusiness[] }) {
  return (
    <Section label="Sample demos">
      <SectionLabel>[EXAMPLES // SAMPLE DEMOS]</SectionLabel>
      <SectionTitle className="mt-6">{heading}</SectionTitle>
      <p data-reveal className="t-lead mt-6 max-w-[64ch] text-muted">
        {intro}
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <li key={demo.slug} data-reveal>
            <a
              href={`/demo/${demo.slug}`}
              target="_blank"
              rel="nofollow noopener"
              className="group flex h-full flex-col justify-between gap-8 rounded-[var(--radius)] border border-line bg-panel/60 p-6 transition-colors duration-[var(--d-sm)] hover:border-accent/50 md:p-7"
            >
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-dim">
                  <span className="text-accent">[</span> Sample demo <span className="text-accent">{'//'}</span> {demoCopy(demo.trade).label} <span className="text-accent">]</span>
                </p>
                <h3 className="display mt-6 text-[1.55rem] leading-[1.08] text-balance transition-colors group-hover:text-accent-hi">{demo.name}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">Fictional business in {demo.town}, NJ, with a made-up 555 number.</p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">
                Open the demo <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-dim">Sample demos are examples of a layout, not client websites.</p>
    </Section>
  )
}

/** The five steps from site.ts `process`, under a page-specific heading. */
function Process({ heading, intro }: { heading: string; intro: string }) {
  return (
    <Section label="How it works">
      <SectionLabel>[HOW IT WORKS]</SectionLabel>
      <SectionTitle className="mt-6">{heading}</SectionTitle>
      <p data-reveal className="t-lead mt-6 max-w-[64ch] text-muted">
        {intro}
      </p>
      <ol className="mt-10 grid gap-4 md:grid-cols-5">
        {process.map((step) => (
          <li key={step.number} data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6">
            <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">STEP {step.number}</span>
            <h3 className="display mt-6 text-xl">{step.title}</h3>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">{step.copy}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
