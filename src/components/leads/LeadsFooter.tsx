import { leadsContact } from '@/content/leads'
import { FooterWordmark } from '@/components/ui/FooterWordmark'
import { OrbitMark } from '@/components/ui/Logo'
import { LEADS_URL } from '@/lib/leadsSite'

const YEAR = new Date().getFullYear()

/** Minimal footer for leads.orbitboyzz.com: who we are and how to reach us. */
export function LeadsFooter() {
  return (
    <footer className="relative border-t border-line bg-bg-2/60">
      <div className="container-x flex flex-col gap-8 pb-10 pt-14 md:flex-row md:items-end md:justify-between md:pt-16">
        <div>
          <a href={LEADS_URL} className="inline-flex items-center gap-3">
            <OrbitMark className="h-10 w-10 shrink-0" />
            <span className="display text-2xl font-bold tracking-[-0.03em]">{leadsContact.brand}</span>
          </a>
          <address className="mt-6 not-italic leading-7 text-muted">
            {leadsContact.address}
            <span className="hidden sm:inline" aria-hidden="true">
              {' · '}
            </span>
            <br className="sm:hidden" />
            <a href={`mailto:${leadsContact.email}`} className="link-u text-fg">
              {leadsContact.email}
            </a>
          </address>
        </div>
        <p className="font-mono text-xs tracking-[0.12em] text-dim">
          © {YEAR} {leadsContact.brand}
        </p>
      </div>
      <FooterWordmark />
    </footer>
  )
}
