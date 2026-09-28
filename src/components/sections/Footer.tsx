import { footerPages, site } from '@/content/site'
import { OrbitMark } from '@/components/ui/Logo'
import { FooterWordmark } from '@/components/ui/FooterWordmark'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { Button } from '@/components/ui/Button'

// Routes that exist in this build. The others in footerPages (quote, blog,
// local landing pages…) are ported after the merge, so they are not linked yet.
const BUILT = new Set(['/', '/services', '/pricing', '/projects', '/about', '/faq', '/contact'])
const YEAR = new Date().getFullYear()

export function Footer() {
  const pages = footerPages.filter((p) => BUILT.has(p.href))

  return (
    <footer className="cv-auto relative border-t border-line bg-bg-2/60 pb-24 md:pb-0">
      <div className="container-x grid gap-12 pt-16 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-5">
          <OrbitMark className="h-10 w-10" />
          <p className="display t-3 mt-6 max-w-md">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={site.booking} size="sm">
              Book a free call
            </Button>
            <Button href={site.phoneHref} size="sm" variant="ghost" icon="phone">
              {site.phoneDisplay}
            </Button>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="label mb-5">Studio</p>
          <address className="not-italic leading-7 text-muted">
            <span className="block text-fg">{site.name}</span>
            {site.location}
            <br />
            Serving {site.serviceArea}
            <br />
            <a href={site.phoneHref} className="link-u text-fg">
              {site.phone}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="link-u text-fg">
              {site.email}
            </a>
          </address>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <p className="label mb-5">Pages</p>
          <ul className="space-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <TransitionLink href={p.href} className="link-u text-muted transition-colors hover:text-fg">
                  {p.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="label mb-5">Service area</p>
          <ul className="space-y-1 text-sm text-muted">
            {site.towns.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x mt-16 flex flex-col gap-3 border-t border-line py-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {YEAR} {site.name} · {site.handle}. Hand-coded in {site.location}.
        </p>
        <p className="font-mono tracking-[0.12em]">40.33°N · 74.58°W</p>
      </div>

      <FooterWordmark />
    </footer>
  )
}
