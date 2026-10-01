import Image from 'next/image'
import { projects } from '@/content/site'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { jsonLd, pageMeta, pageSchema } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Projects — Real websites for local businesses',
  description:
    'Live website builds by Orbit Websites: Weichert Princeton Pages (real estate), a property services website and Grand Treats by Tony (specialty food).',
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema('/projects'))} />
      <PageHero
        label="[SELECTED WORK]"
        title={
          <>
            Real builds, <span className="serif-accent text-accent">live right now.</span>
          </>
        }
        lead="Every project here is a live site you can open on your phone. We do not publish invented metrics — full case studies go up only with real, measured numbers."
      />

      <div className="container-x flex flex-col gap-24 md:gap-36">
        {projects.map((p, i) => (
          <article key={p.slug} id={p.slug} aria-labelledby={`${p.slug}-title`} className="scroll-mt-28">
            <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-baseline md:justify-between">
              <p className="label">
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span> / {p.category}
              </p>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="label link-u w-fit text-fg hover:text-accent">
                {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
              </a>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <h2 id={`${p.slug}-title`} data-split className="display t-2">
                  {p.name}
                </h2>
                <p className="serif-accent mt-4 text-[1.8rem] leading-tight text-fg/90">{p.headline}</p>
                <p data-reveal className="t-lead mt-6 text-muted">
                  {p.description}
                </p>
                <dl data-reveal className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
                  <div>
                    <dt className="label">Category</dt>
                    <dd className="mt-2">{p.category}</dd>
                  </div>
                  <div>
                    <dt className="label">Status</dt>
                    <dd className="mt-2 flex items-center gap-2">
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Live
                    </dd>
                  </div>
                </dl>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm mt-8"
                >
                  <span>Open the live site</span>
                  <span className="btn-arrow">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </div>

              <div className="relative md:col-span-7">
                <div data-clip className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)] border border-line bg-panel">
                  <Image
                    src={p.image}
                    alt={`${p.name} — desktop homepage`}
                    fill
                    sizes="(min-width: 1480px) 800px, (min-width: 768px) 56vw, 100vw"
                    className="object-cover object-top"
                    preload={i === 0}
                  />
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4 md:absolute md:-bottom-10 md:-left-10 md:mt-0 md:block md:w-[26%]">
                  <p className="label md:hidden">Mobile view</p>
                  <div data-reveal className="w-32 overflow-hidden rounded-[1.4rem] border-[5px] border-panel-2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] md:w-full">
                    <div className="relative aspect-[390/844]">
                      <Image
                        src={p.image.replace('.png', '-mobile.png')}
                        alt={`${p.name} — mobile view`}
                        fill
                        sizes="(min-width: 768px) 16vw, 128px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-24">
        <CtaBand title="Your business could be next." />
      </div>
    </>
  )
}
