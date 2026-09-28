import { about, site } from '@/content/site'
import { CtaBand } from '@/components/ui/CtaBand'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'About — A Plainsboro, NJ web design & AI operations studio',
  description:
    'Orbit Websites (OrbitBoyzz) is a small Plainsboro, NJ studio that hand-codes fast, conversion-first websites on Next.js, Tailwind and Vercel for Central New Jersey businesses.',
  path: '/about',
})

// Principles are restatements of facts in site.ts — no invented claims.
const PRINCIPLES = [
  { k: '01', t: 'You talk to the builder', d: 'No sales floor and no handoff. The person on your call is the person writing your site.' },
  { k: '02', t: 'Hand-coded, not templated', d: 'Next.js, Tailwind and Vercel. Lean code, fast on every phone, no plugin sprawl.' },
  { k: '03', t: 'Built around the job', d: 'Every page is organised around how you take on work: calls, quotes and bookings.' },
  { k: '04', t: 'Owned by you', d: 'You approve before final payment and the site is yours. Hosting with us is optional.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero label={about.label} title={about.title} lead={site.tagline} />

      <section aria-label="Our story" className="container-x grid gap-12 pb-16 md:grid-cols-12 md:pb-24">
        <div className="space-y-6 md:col-span-7">
          {about.copy.map((p, i) => (
            <p key={i} data-reveal className={i === 0 ? 'display t-3 font-medium leading-snug' : 't-lead text-muted'}>
              {p}
            </p>
          ))}
        </div>
        <div className="relative md:col-span-4 md:col-start-9">
          <div data-reveal className="sticky top-28 overflow-hidden rounded-[var(--radius)] border border-line bg-panel/70 p-7">
            <OrbitSystem className="mx-auto w-full max-w-[16rem]" />
            <dl className="mt-6 space-y-4 border-t border-line pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="label">Studio</dt>
                <dd>
                  {site.name} · {site.handle}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="label">Based in</dt>
                <dd>{site.location}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="label">Serving</dt>
                <dd>{site.serviceArea}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="label">Phone</dt>
                <dd>
                  <a href={site.phoneHref} className="link-u">
                    {site.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="container-x py-16 md:py-24">
        <SectionLabel>[HOW WE WORK]</SectionLabel>
        <h2 id="principles-title" data-split className="display t-2 mt-6 max-w-[14ch]">
          Premium standards, small-studio honesty.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p) => (
            <div key={p.k} data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-7">
              <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">{p.k}</span>
              <h3 className="display mt-8 text-2xl">{p.t}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="area-title" className="container-x py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel>[SERVICE AREA]</SectionLabel>
            <h2 id="area-title" data-split className="display t-2 mt-6">
              Local to Central Jersey.
            </h2>
            <p data-reveal className="mt-6 max-w-sm text-muted">
              Based in {site.location} and building for local service businesses across the region that need more calls and bookings from mobile search.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-3 md:col-span-7">
            {site.towns.map((t) => (
              <li key={t} className="bg-bg px-5 py-4 text-[0.95rem]">
                <span className="mr-2 text-accent">◦</span>
                {t}
              </li>
            ))}
            {site.towns.length % 2 === 1 && site.towns.length % 3 !== 0 && (
              <li className="bg-bg px-5 py-4 text-[0.95rem] text-muted">+ across {site.serviceArea}</li>
            )}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
