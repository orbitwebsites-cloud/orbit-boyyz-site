import { site } from '@/content/site'
import { Button } from './Button'
import { OrbitMark } from './Logo'

/** Closing call-to-action used on every inner page. */
export function CtaBand({ title = 'Ready when you are.', copy }: { title?: string; copy?: string }) {
  return (
    <section className="container-x py-16 md:py-24">
      <div
        data-reveal
        className="relative overflow-hidden rounded-[calc(var(--radius)+0.75rem)] border border-accent/30 bg-[radial-gradient(ellipse_at_top_right,rgba(214,179,106,0.18),transparent_55%),var(--panel)] px-6 py-12 md:px-14 md:py-16"
      >
        <OrbitMark className="absolute -right-10 -top-10 h-56 w-56 opacity-[0.07]" />
        <p className="label">
          <span className="text-accent">[</span> Next step <span className="text-accent">]</span>
        </p>
        <h2 className="display t-2 mt-5 max-w-[16ch]">{title}</h2>
        <p className="mt-5 max-w-xl text-muted">
          {copy ?? 'Book a free 30-minute call or just ring us. You talk directly with the people who build your site.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={site.booking} magnetic>
            Book a free call
          </Button>
          <Button href={site.phoneHref} variant="ghost" icon="phone">
            {site.phoneDisplay}
          </Button>
        </div>
      </div>
    </section>
  )
}
