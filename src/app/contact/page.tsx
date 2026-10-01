import type { ReactNode } from 'react'
import { process, site } from '@/content/site'
import { PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { jsonLd, pageMeta, pageSchema } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Contact — Book a free call with Orbit Websites',
  description: `Book a free 30-minute call, call ${site.phone} or email ${site.email}. Orbit Websites is based in Plainsboro, NJ and serves Central New Jersey.`,
  path: '/contact',
})

function Channel({ href, label, value, note, external, icon }: { href: string; label: string; value: string; note: string; external?: boolean; icon: ReactNode }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-reveal
      className="group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[calc(var(--radius)+0.25rem)] border border-line bg-panel/70 p-7 transition-colors duration-[var(--d-sm)] hover:border-accent/60"
    >
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-accent transition-colors duration-[var(--d-sm)] group-hover:bg-accent group-hover:text-accent-ink">
          {icon}
        </span>
      </div>
      <div>
        <p className={value.length > 18 ? 'display break-all text-[clamp(1.2rem,1.7vw,1.6rem)] leading-tight' : 'display text-[clamp(1.5rem,2.6vw,2.3rem)] leading-tight'}>{value}</p>
        <p className="mt-2 text-sm text-muted">{note}</p>
      </div>
    </a>
  )
}

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema('/contact'))} />
      <PageHero
        label="[CONTACT]"
        title={
          <>
            Let&rsquo;s talk about <span className="serif-accent text-accent">your site.</span>
          </>
        }
        lead="The first call is free and focused on what your business needs. You will speak with the people building your site — no sales handoff, no guessing."
      />

      <section aria-label="Ways to reach us" className="container-x grid gap-4 md:grid-cols-3">
        <Channel
          href={site.booking}
          external
          label="Book"
          value="Free 30-min call"
          note="Pick a time on Calendly"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
        />
        <Channel
          href={site.phoneHref}
          label="Call or text"
          value={site.phoneDisplay}
          note={`${site.location} · ${site.serviceArea}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.59a1 1 0 0 1-.25 1L6.6 10.8Z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <Channel
          href={`mailto:${site.email}`}
          label="Email"
          value={site.email}
          note="Send a link to your current site, if you have one"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </section>

      {/* Inline booking (ported from v-fable): themed Calendly embed so nobody has to leave the page. */}
      <section aria-labelledby="book-title" className="container-x pt-6">
        <div data-reveal className="overflow-hidden rounded-[calc(var(--radius)+0.25rem)] border border-line bg-panel/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
            <p id="book-title" className="label">
              Book a free 30-min call
            </p>
            <a href={site.booking} target="_blank" rel="noopener noreferrer" className="text-sm text-muted transition-colors hover:text-accent">
              Open in Calendly ↗
            </a>
          </div>
          <iframe
            title="Book a call with Orbit Websites"
            src={`${site.booking}?hide_gdpr_banner=1&background_color=100f0d&text_color=f4efe6&primary_color=d6b36a`}
            loading="lazy"
            className="h-[720px] w-full"
          />
        </div>
      </section>

      <section aria-labelledby="next-title" className="container-x grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <SectionLabel>[WHAT HAPPENS NEXT]</SectionLabel>
          <h2 id="next-title" data-split className="display t-2 mt-6">
            After you reach out.
          </h2>
        </div>
        <ol className="space-y-4 md:col-span-8">
          {process.slice(0, 3).map((p) => (
            <li key={p.number} data-reveal className="grid gap-4 rounded-[var(--radius)] border border-line bg-panel/60 p-6 sm:grid-cols-[6rem_1fr]">
              <span className="font-mono text-[0.75rem] tracking-[0.14em] text-accent">STEP {p.number}</span>
              <div>
                <h3 className="display text-xl">{p.title}</h3>
                <p className="mt-2 text-muted">{p.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="area-title" className="container-x pb-12">
        <div data-reveal className="rounded-[var(--radius)] border border-line px-6 py-8 md:px-10">
          <p id="area-title" className="label">
            Serving {site.serviceArea}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">{site.towns.join(' · ')}</p>
        </div>
      </section>
    </>
  )
}
