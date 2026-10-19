import type { ReactNode } from 'react'
import { Preloader } from '@/components/sections/Preloader'
import SiteFrame from '@/components/ui/SiteFrame'

// Orbit's own chrome for every orbitboyzz.com page in this route group: the
// first-visit preloader, then the nav, footer, mobile dock and cursor
// (SiteFrame). The route group leaves the URLs unchanged. The standalone routes
// stay outside it (/leads, served at leads.orbitboyzz.com, /sample, /qualify,
// /book and /demo/*), so their HTML, RSC payload and JavaScript never carry
// this chrome, and with it the site's prices and call-booking links
// (src/content/site.ts). The 404 page (app/not-found.tsx) loads SiteFrame on demand.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Preloader />
      <SiteFrame>{children}</SiteFrame>
    </>
  )
}
