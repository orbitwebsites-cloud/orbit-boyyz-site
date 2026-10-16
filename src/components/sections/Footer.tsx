import { footerPages, site } from '@/content/site'
import { townPages } from '@/content/landing'
import { NJ_PATH, keywordRouteByPath, keywordRoutes } from '@/content/keyword-pages'
import { OrbitMark } from '@/components/ui/Logo'
import { FooterWordmark } from '@/components/ui/FooterWordmark'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { Button } from '@/components/ui/Button'
import { LEADS_URL } from '@/lib/leadsSite'

const YEAR = new Date().getFullYear()

// Town → local landing page (every town in site.towns except Hopewell has one).
const townHref = new Map<string, string>([
  ...Object.values(townPages).map((p) => [p.town.replace(/,? NJ$/, '').replace(/ Township$/, ''), p.path] as const),
  ['Ewing', '/web-design-ewing-nj'],
])

// "Industries": the keyword pages (hub, trades, SEO; src/content/keyword-pages) in
// registry order, each trade followed by its older New Jersey page where one exists.
// The New Jersey page heads "Areas we serve" instead.
const INDUSTRY_ROUTES = keywordRoutes.filter((r) => r.path !== NJ_PATH)
const NJ_ROUTE = keywordRouteByPath.get(NJ_PATH)
const BUYER_ANSWERS: Array<[string, string]> = [
  ['Website cost guide', '/blog/how-much-does-a-website-cost-for-a-local-business'],
  ['Mercer County cost factors', '/blog/web-design-cost-factors-mercer-county-nj'],
  ['Custom vs Wix/Squarespace', '/blog/custom-web-design-vs-wix-squarespace'],
  ['Electrician AI chatbot', '/blog/ai-chatbot-electrician-central-nj'],
  ['HVAC after-hours calls', '/blog/hvac-missed-after-hours-calls'],
]

const linkCls = 'link-u text-muted transition-colors hover:text-fg'

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg-2/60 pb-24 md:pb-0">
      <div className="container-x grid gap-12 pt-16 sm:grid-cols-2 md:pt-20 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
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
          <address className="mt-10 not-italic leading-7 text-muted">
            <span className="block text-fg">{site.name}</span>
            {site.location} · Serving {site.serviceArea}
            <br />
            <a href={site.phoneHref} className="link-u text-fg">
              {site.phone}
            </a>
            {' · '}
            <a href={`mailto:${site.email}`} className="link-u text-fg">
              {site.email}
            </a>
          </address>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
          <p className="label mb-5">Pages</p>
          <ul className="space-y-2">
            {footerPages.map((p) => (
              <li key={p.href}>
                <TransitionLink href={p.href} className={linkCls}>
                  {p.label}
                </TransitionLink>
              </li>
            ))}
            {/* Other host (leads.orbitboyzz.com), so a plain <a>: TransitionLink is for internal paths. */}
            <li>
              <a href={LEADS_URL} className={linkCls}>
                Lead lists for agencies
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Areas we serve" className="lg:col-span-2">
          <p className="label mb-5">Areas we serve</p>
          <ul className="space-y-2 text-sm">
            {NJ_ROUTE && (
              <li>
                <TransitionLink href={NJ_ROUTE.path} className={linkCls}>
                  {NJ_ROUTE.footerLabel}
                </TransitionLink>
              </li>
            )}
            <li>
              <TransitionLink href="/web-design-central-nj" className={linkCls}>
                Central NJ
              </TransitionLink>
            </li>
            {site.towns.map((t) => {
              const href = townHref.get(t)
              return (
                <li key={t}>
                  {href ? (
                    <TransitionLink href={href} className={linkCls}>
                      {t}, NJ
                    </TransitionLink>
                  ) : (
                    <span className="text-dim">{t}, NJ</span>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <nav aria-label="Industries" className="lg:col-span-3">
          <p className="label mb-5">Industries</p>
          <ul className="space-y-2 text-sm">
            {INDUSTRY_ROUTES.map((r) => (
              <li key={r.path}>
                <TransitionLink href={r.path} className={linkCls}>
                  {r.footerLabel}
                </TransitionLink>
                {r.nj && (
                  <>
                    <span aria-hidden="true" className="text-dim">
                      {' · '}
                    </span>
                    <TransitionLink href={r.nj.path} className={linkCls} aria-label={r.nj.label}>
                      NJ
                    </TransitionLink>
                  </>
                )}
              </li>
            ))}
            <li>
              <TransitionLink href="/growth" className={linkCls}>
                HVAC Lead System
              </TransitionLink>
            </li>
          </ul>
          <p className="label mb-5 mt-10">Buyer answers</p>
          <ul className="space-y-2 text-sm">
            {BUYER_ANSWERS.map(([label, href]) => (
              <li key={href}>
                <TransitionLink href={href} className={linkCls}>
                  {label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
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
