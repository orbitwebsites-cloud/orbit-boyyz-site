import Link from 'next/link'
import { bookCallAgenda, bookFlowFaqs, bookStraight, bookTerms } from '@/content/bookFlow'
import { site } from '@/content/siteInfo'

/**
 * Shown under the first question on /book: what the call is, how we get paid,
 * who we are and how to reach us. Copy and its rules live in content/bookFlow.ts.
 */
export function BookTrust({ onStart }: { onStart: () => void }) {
  return (
    <section id="about-the-call" aria-label="About the call" className="relative z-10 rounded-t-[2.5rem] bg-paper text-ink">
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
        {/* The call */}
        <p className="alabel text-accent">{bookCallAgenda.label}</p>
        <h2 className="display mt-3 max-w-[18ch] text-[clamp(2rem,5vw,3.75rem)]">{bookCallAgenda.title}</h2>
        <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {bookCallAgenda.items.map(([title, body], i) => (
            <li key={title} className="border-t border-ink/15 pt-5">
              <span className="alabel text-accent">0{i + 1}</span>
              <h3 className="mt-2 text-xl font-medium tracking-tight">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{body}</p>
            </li>
          ))}
        </ol>

        {/* The terms */}
        <p className="alabel mt-24 text-accent md:mt-32">{bookTerms.label}</p>
        <h2 className="display mt-3 max-w-[18ch] text-[clamp(2rem,5vw,3.75rem)]">{bookTerms.title}</h2>
        <dl className="mt-10">
          {bookTerms.items.map(([term, body]) => (
            <div key={term} className="grid gap-x-10 gap-y-2 border-t border-ink/15 py-6 last:border-b sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-baseline">
              <dt className="font-serif text-[clamp(2rem,4vw,3rem)] italic leading-none tracking-[-0.02em]">{term}</dt>
              <dd className="max-w-[52ch] text-lg leading-relaxed text-ink/70">{body}</dd>
            </div>
          ))}
        </dl>

        {/* Who we are */}
        <div className="mt-24 rounded-[2rem] bg-ink p-7 text-paper md:mt-32 md:p-12">
          <p className="alabel text-accent">{bookStraight.label}</p>
          <h2 className="display mt-3 text-[clamp(2rem,5vw,3.75rem)]">{bookStraight.title}</h2>
          <div className="mt-6 max-w-[60ch] space-y-4 text-lg leading-relaxed text-paper/70">
            {bookStraight.copy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <address className="mt-10 grid gap-6 border-t border-paper/15 pt-8 text-[15px] not-italic sm:grid-cols-3">
            <p>
              <span className="alabel block text-paper/60">Who</span>
              <span className="mt-1 block">{site.name}</span>
              <span className="block text-paper/60">
                {site.location} · serving {site.serviceArea}
              </span>
            </p>
            <p>
              <span className="alabel block text-paper/60">Call or text</span>
              <a href={site.phoneHref} className="mt-1 block underline decoration-1 underline-offset-4">
                {site.phoneDisplay}
              </a>
            </p>
            <p>
              <span className="alabel block text-paper/60">Email</span>
              <a href={`mailto:${site.email}`} className="mt-1 block break-all underline decoration-1 underline-offset-4">
                {site.email}
              </a>
            </p>
          </address>
        </div>

        {/* Questions */}
        <div className="mt-24 grid gap-10 md:mt-32 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="alabel text-accent">{bookFlowFaqs.label}</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3.25rem)]">{bookFlowFaqs.title}</h2>
          </div>
          <div>
            {bookFlowFaqs.items.map((item) => (
              <details key={item.q} className="group border-t border-ink/15 last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="relative block size-3.5 shrink-0">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-300 group-open:rotate-90" />
                  </span>
                </summary>
                <p className="max-w-[58ch] pb-6 text-[15px] leading-relaxed text-ink/70">
                  {item.a}
                  {item.link && (
                    <>
                      {' '}
                      <Link href={item.link.href} className="text-ink underline decoration-1 underline-offset-4">
                        {item.link.label}
                      </Link>
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button type="button" onClick={onStart} className="abtn abtn-ink h-14 px-8">
            Answer the first question
          </button>
          <p className="text-[15px] text-ink/65">3 quick questions, then pick a time.</p>
        </div>
      </div>
    </section>
  )
}
