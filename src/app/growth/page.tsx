import type { CSSProperties } from 'react'
import Link from 'next/link'
import { growthEntryOffer, growthFaqs, growthServices, growthTiers } from '@/content/growth'
import { carePlans, site } from '@/content/site'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { FlowDemo } from '@/components/port/FlowDemo'
import { Section } from '@/components/port/Blocks'
import { cn } from '@/lib/cn'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

export const metadata = legacyMetadata('/growth')

// Orbit Growth Systems (old src/GrowthPage.tsx) — copy verbatim, restyled.
function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-1 shrink-0 text-accent">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MetricCard() {
  return (
    <div aria-label="Sample lead response dashboard" className="relative rounded-[calc(var(--radius)+0.5rem)] border border-line-strong bg-panel/90 p-6 shadow-[0_40px_120px_-40px_rgba(214,179,106,0.35)] backdrop-blur md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Lead response dashboard</p>
          <p className="mt-1 font-semibold">This month</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" /> Live
        </span>
      </div>
      <div className="mt-8">
        <p className="text-sm text-muted">Median response time</p>
        <p className="display mt-1 text-7xl leading-none">
          0:42 <small className="font-sans text-base font-normal text-muted">minutes</small>
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line p-4">
          <p className="text-sm text-muted">Leads answered</p>
          <p className="display mt-1 text-3xl">48</p>
          <p className="text-xs text-accent">100%</p>
        </div>
        <div className="rounded-2xl border border-line p-4">
          <p className="text-sm text-muted">Visits booked</p>
          <p className="display mt-1 text-3xl">18</p>
          <p className="text-xs text-accent">+7 this month</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-xs text-accent">JS</span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Emergency cooling request</p>
          <p className="text-sm text-muted">Qualified and booked automatically</p>
        </div>
        <span className="text-xs text-dim">Now</span>
      </div>
      <span className="absolute -top-3 left-6 rounded-full border border-line bg-bg px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-dim">SAMPLE DATA</span>
    </div>
  )
}

const leadsPlan = carePlans.find((plan) => plan.name === 'Website + Leads Plan') ?? carePlans[1]

export default function GrowthPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd('/growth')} />

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+4rem)] md:pb-24 md:pt-[calc(var(--nav-h)+6rem)]">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,106,0.16),transparent_65%)]" />
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="page-fade inline-flex items-center gap-3 rounded-full border border-accent/30 px-4 py-2 text-sm text-accent" style={{ '--delay': '-300ms' } as CSSProperties}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" /> Now accepting 3 founding HVAC partners
            </p>
            <h1 className="display t-1 mt-7 max-w-[14ch] text-balance">
              <span className="mask">
                <span className="page-rise">
                  Every lead answered. <span className="serif-accent text-accent">Every follow-up handled.</span>
                </span>
              </span>
            </h1>
            <p className="page-fade t-lead mt-8 max-w-[56ch] text-muted" style={{ '--delay': '0ms' } as CSSProperties}>
              Orbit builds and manages the lead-response system behind your HVAC business—so more inquiries become booked jobs without adding more office work.
            </p>
            <div className="page-fade mt-10 flex flex-wrap items-center gap-4" style={{ '--delay': '120ms' } as CSSProperties}>
              <Button href={site.booking}>Book your free lead audit</Button>
              <a href="#demo" className="link-u text-muted hover:text-fg">
                See how it works ↓
              </a>
            </div>
            <div className="page-fade mt-10 flex items-center gap-4" style={{ '--delay': '200ms' } as CSSProperties}>
              <div className="flex -space-x-2" aria-hidden="true">
                {['HV', 'AC', '+3'].map((t) => (
                  <span key={t} className="grid h-10 w-10 place-items-center rounded-full border-2 border-bg bg-panel-2 font-mono text-[0.66rem] text-accent">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-snug text-muted">
                <strong className="text-fg">Built in 15 days.</strong>
                <br />
                Monitored by real developers.
              </p>
            </div>
          </div>
          <div className="page-fade relative lg:col-span-5" style={{ '--delay': '160ms' } as CSSProperties}>
            <div className="mb-4 flex flex-wrap gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted" aria-hidden="true">
              <span className="rounded-full border border-line px-3 py-1">Website lead</span>
              <span className="rounded-full border border-line px-3 py-1">AI call</span>
              <span className="rounded-full border border-accent/40 px-3 py-1 text-accent">Booked ✓</span>
            </div>
            <MetricCard />
          </div>
        </div>
      </section>

      {/* Credibility bar */}
      <div className="border-y border-line bg-bg-2/60">
        <p className="container-x flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-5 text-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-dim">
          <span>From the team behind</span>
          <strong className="text-fg">ORBIT WEBSITES</strong>
          <span className="text-accent" aria-hidden="true">
            ·
          </span>
          <span>Custom-coded in New Jersey</span>
          <span className="text-accent" aria-hidden="true">
            ·
          </span>
          <span>Built for independent HVAC companies</span>
        </p>
      </div>

      {/* Problem */}
      <Section label="The expensive gap" className="md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel>[The expensive gap]</SectionLabel>
            <h2 data-split className="display t-2 mt-6">
              Your marketing worked. <span className="serif-accent text-accent">Then nobody answered.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p data-reveal className="t-lead text-muted">
              Homeowners rarely wait. When your team is driving, diagnosing or installing, a good lead can quietly become somebody else&apos;s job.
            </p>
            <ol className="mt-8 border-t border-line">
              {['New web leads sit untouched until the office catches up.', 'Missed calls disappear without a text or callback.', 'Estimates and old leads never receive consistent follow-up.'].map((t, i) => (
                <li key={t} data-reveal className="flex gap-5 border-b border-line py-5">
                  <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <p>{t}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* System */}
      <Section id="system" label="The Orbit system" className="scroll-mt-24">
        <SectionLabel>[The Orbit system]</SectionLabel>
        <h2 data-split className="display t-2 mt-6 max-w-[22ch]">
          One reliable system between a new inquiry and a booked job.
        </h2>
        <p data-reveal className="mt-5 max-w-xl text-muted">
          Installed around the tools you already use. Managed by us every month.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {growthServices.map((s) => (
            <article key={s.number} data-reveal className="flex flex-col justify-between gap-8 rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-7">
              <div>
                <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">{s.number}</span>
                <h3 className="display mt-6 text-2xl leading-tight">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.body}</p>
              </div>
              <div className="border-t border-line pt-5">
                <p className="display text-2xl text-accent">{s.stat}</p>
                <p className="text-sm text-dim">{s.label}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Demo */}
      <Section id="demo" label="See the handoff" className="scroll-mt-24">
        <SectionLabel>[See the handoff]</SectionLabel>
        <h2 data-split className="display t-2 mt-6 mb-10">
          A lead comes in. <span className="serif-accent text-accent">Orbit gets to work.</span>
        </h2>
        <FlowDemo />
      </Section>

      {/* Process */}
      <Section label="Live in 15 days">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel>[Live in 15 days]</SectionLabel>
            <h2 data-split className="display t-2 mt-6">
              You run the company. We handle the system.
            </h2>
            <p data-reveal className="mt-6 max-w-md text-muted">
              No software maze and no six-week discovery phase. You give us the facts about your business; we build, test and monitor the workflow.
            </p>
            <a href={site.booking} target="_blank" rel="noopener noreferrer" className="link-u mt-6 inline-block text-accent hover:text-accent-hi">
              Talk through your workflow ↗
            </a>
          </div>
          <ol className="grid gap-4 md:col-span-6 md:col-start-7">
            {[
              ['Day 01', 'Map the gaps', 'We review where leads arrive, how your team responds and where opportunities are getting lost.'],
              ['Days 02–10', 'Build and connect', 'We create the messaging, voice logic, booking rules, dashboard and integrations.'],
              ['Days 11–15', 'Test and launch', 'Every route is tested before your system goes live. Then we keep watching it.'],
            ].map(([when, title, copy]) => (
              <li key={when} data-reveal className="grid gap-3 rounded-[var(--radius)] border border-line bg-panel/60 p-6 sm:grid-cols-[7rem_1fr]">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">{when}</span>
                <div>
                  <strong className="display text-xl font-semibold">{title}</strong>
                  <p className="mt-2 text-muted">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing" label="Simple build, optional retainer" className="scroll-mt-24">
        <SectionLabel>[Simple build, optional retainer]</SectionLabel>
        <h2 data-split className="display t-2 mt-6 max-w-[18ch]">
          One build. <span className="serif-accent text-accent">One system that keeps working.</span>
        </h2>
        <p data-reveal className="mt-5 max-w-2xl text-muted">
          Choose a starting point after your free lead-response audit. Every plan is an AI operations build scoped on that audit, with an optional monthly retainer for
          monitoring, fixes and improvements. Retainers have a three-month minimum and fair-use limits.
        </p>
        <dl data-reveal className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius)] border border-accent/40 bg-panel/60 p-6 md:p-7">
            <dt className="label text-accent">One-time build</dt>
            <dd className="display mt-3 text-[clamp(2.2rem,5vw,3rem)] leading-none">$5,000–$15,000+</dd>
            <dd className="mt-3 text-sm text-muted">Depends on scope, integrations and how many workflows you automate.</dd>
          </div>
          <div className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-7">
            <dt className="label text-accent">Optional retainer</dt>
            <dd className="display mt-3 text-[clamp(2.2rem,5vw,3rem)] leading-none">
              $750–$2,500<span className="text-muted text-[0.5em]"> / month</span>
            </dd>
            <dd className="mt-3 text-sm text-muted">Only when it replaces measurable admin labor or recovers high-intent leads.</dd>
          </div>
        </dl>
        <p data-reveal className="mt-4 rounded-[var(--radius)] border border-line px-6 py-5 text-sm text-muted md:px-7">
          <span className="text-fg">
            Not ready for a full AI build? The {leadsPlan.name} is {leadsPlan.price}/mo
          </span>{' '}
          — for established home-service shops that want steady local SEO and site improvements aimed at more calls and quote requests.{' '}
          <Link href="/pricing" className="link-u text-fg">
            See all pricing
          </Link>
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {growthTiers.map((tier) => (
            <article
              key={tier.name}
              data-reveal
              className={cn(
                'relative flex flex-col rounded-[var(--radius)] border p-7 md:p-8',
                tier.featured ? 'border-accent/60 bg-[radial-gradient(ellipse_at_top,rgba(214,179,106,0.16),transparent_60%),var(--panel)]' : 'border-line bg-panel/60',
              )}
            >
              {tier.featured && <span className="label mb-4 text-accent">Best fit for growing teams</span>}
              <h3 className="display text-3xl">{tier.name}</h3>
              <p className="mt-3 text-muted">{tier.description}</p>
              <ul className="mt-8 grid flex-1 gap-3 text-[0.95rem]">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href={site.booking} variant={tier.featured ? 'primary' : 'ghost'} size="sm">
                  Book a free audit
                </Button>
              </div>
            </article>
          ))}
        </div>

        <article data-reveal className="mt-4 grid gap-8 rounded-[var(--radius)] border border-line bg-panel/60 p-7 md:grid-cols-12 md:p-8">
          <div className="md:col-span-5">
            <span className="label text-accent">Start with one workflow</span>
            <h3 className="display mt-4 text-3xl">{growthEntryOffer.name}</h3>
            <p className="mt-3 text-muted">{growthEntryOffer.description}</p>
            <p className="mt-6">
              <strong className="display block text-[clamp(2rem,4.6vw,2.8rem)] leading-[1.05]">{growthEntryOffer.price}</strong>
              <span className="mt-2 block text-muted">One-time build</span>
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ul className="grid gap-3 text-[0.95rem]">
              {growthEntryOffer.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button href={site.booking} size="sm">
                Discuss the setup
              </Button>
            </div>
            <p className="mt-5 text-sm text-dim">50% to begin; 50% after approval. Managed monthly plans are separate and optional.</p>
          </div>
        </article>
        <p className="mt-6 text-sm text-dim">Advertising spend and unusually high phone or messaging usage are not included. We confirm your expected usage before launch.</p>
      </Section>

      {/* Founding partner */}
      <Section label="Founding partner offer">
        <div
          data-reveal
          className="relative grid gap-10 overflow-hidden rounded-[calc(var(--radius)+0.75rem)] border border-accent/30 bg-[radial-gradient(ellipse_at_top_right,rgba(214,179,106,0.2),transparent_55%),var(--panel)] px-6 py-12 md:grid-cols-12 md:px-14 md:py-16"
        >
          <div className="md:col-span-8">
            <SectionLabel>[Founding partner offer]</SectionLabel>
            <h2 className="display t-2 mt-5">Help shape the system. Keep founding pricing.</h2>
            <p className="mt-5 max-w-2xl text-muted">
              We&apos;re accepting three independent HVAC companies at founding-partner pricing in exchange for direct feedback and permission to document the results. No inflated
              promises—just a system we can measure together.
            </p>
            <div className="mt-8">
              <Button href={site.booking}>See if your company qualifies</Button>
            </div>
          </div>
          <div className="self-end md:col-span-3 md:col-start-10 md:text-right">
            <p className="display text-[clamp(4rem,9vw,7rem)] leading-none text-accent">03</p>
            <p className="label">partner spots</p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" label="Questions, answered" className="scroll-mt-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel>[Questions, answered]</SectionLabel>
            <h2 data-split className="display t-3 mt-6">
              The important details—before the call.
            </h2>
            <p className="mt-5 text-muted">
              Have a question we missed? Call{' '}
              <a href={site.phoneHref} className="link-u text-fg">
                609 662 8052
              </a>{' '}
              or email{' '}
              <a href={`mailto:${site.email}`} className="link-u text-fg">
                alex@orbitboyzz.com
              </a>
              .
            </p>
          </div>
          <div className="md:col-span-8">
            <Accordion items={growthFaqs.map(([q, a]) => ({ q, a }))} defaultOpen={0} />
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section label="Book an audit">
        <div data-reveal className="grid gap-8 rounded-[calc(var(--radius)+0.75rem)] border border-line bg-panel/70 px-6 py-12 md:grid-cols-2 md:items-end md:px-14 md:py-16">
          <div>
            <p className="label">
              <span className="text-accent">[</span> Your next lead could arrive tonight <span className="text-accent">]</span>
            </p>
            <h2 className="display t-2 mt-5">Make sure somebody answers.</h2>
          </div>
          <div>
            <p className="text-muted">Book a free 15-minute audit. We&apos;ll map your current lead flow and show you exactly where automation could help.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={site.booking}>Book your free audit</Button>
              <Button href={site.phoneHref} variant="ghost" icon="phone">
                Call Orbit
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-dim">Lead-response systems for independent HVAC companies. Designed, built and monitored in New Jersey. · Orbit Growth Systems — a service from Orbit Websites</p>
      </Section>
    </>
  )
}
