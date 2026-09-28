import Image from 'next/image'
import { projects } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { cn } from '@/lib/cn'

const mobileShot = (src: string) => src.replace('.png', '-mobile.png')

/**
 * [03 // SELECTED WORK] Three real client builds. Media wipes open with a
 * clip-path as it enters (data-clip); on hover the desktop shot eases in and
 * the phone view swings up; the cursor becomes "View case".
 */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="cv-auto relative py-24 md:pb-36 md:pt-20">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>[03 // SELECTED WORK]</SectionLabel>
            <h2 id="work-title" data-split className="display t-1 mt-6 max-w-[14ch]">
              Real sites for real local businesses.
            </h2>
          </div>
          <div data-reveal className="max-w-sm">
            <p className="text-muted">No stock mockups, no invented case studies. These are live builds — click through and use them on your phone.</p>
            <div className="mt-6">
              <Button href="/projects" variant="ghost" size="sm">
                All projects
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-32">
          {projects.map((p, i) => (
            <article key={p.slug} className="work-card group relative grid items-center gap-8 md:grid-cols-12 md:gap-10">
              <div className={cn('relative md:col-span-8', i % 2 === 1 && 'md:order-2')}>
                <div data-clip data-cursor="view" data-cursor-label="View case" className="work-media relative aspect-[16/10] overflow-hidden rounded-[var(--radius)] border border-line bg-panel">
                  <Image
                    src={p.image}
                    alt={`${p.name} website — desktop view`}
                    fill
                    sizes="(min-width: 1480px) 920px, (min-width: 768px) 64vw, 100vw"
                    className="object-cover object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                  <span className="label absolute left-5 top-5 rounded-full border border-line bg-bg/70 px-3 py-1.5 backdrop-blur-md">
                    {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </span>
                  <TransitionLink href={`/projects#${p.slug}`} className="absolute inset-0 z-10" aria-label={`View ${p.name}`} />
                </div>
                <div
                  className={cn(
                    'work-phone pointer-events-none absolute -bottom-8 hidden w-[22%] overflow-hidden rounded-[1.4rem] border-[5px] border-panel-2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:block',
                    i % 2 === 1 ? '-left-4 md:-left-8' : '-right-4 md:-right-8',
                  )}
                >
                  <div className="relative aspect-[390/844]">
                    <Image src={mobileShot(p.image)} alt="" fill sizes="(min-width: 768px) 14vw, 22vw" className="object-cover object-top" />
                  </div>
                </div>
              </div>

              <div data-reveal className={cn('md:col-span-4', i % 2 === 1 && 'md:order-1')}>
                <p className="label text-accent">{p.category}</p>
                <h3 className="display t-3 mt-4">{p.name}</h3>
                <p className="serif-accent mt-3 text-[1.6rem] leading-tight text-fg/90">{p.headline}</p>
                <p className="mt-4 max-w-sm text-muted">{p.description}</p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <TransitionLink href={`/projects#${p.slug}`} className="label inline-flex items-center gap-2 text-fg hover:text-accent">
                    Project details <span aria-hidden="true">→</span>
                  </TransitionLink>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="label inline-flex items-center gap-2 text-muted hover:text-accent">
                    Live site <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
