import type { ReactNode } from 'react'
import { Footer } from '@/components/sections/Footer'
import { Cursor } from '@/components/ui/Cursor'
import { MobileDock } from '@/components/ui/MobileDock'
import { Nav } from '@/components/ui/Nav'

/**
 * Orbit's own page frame on orbitboyzz.com: nav, <main id="main">, footer,
 * mobile dock and cursor. Rendered by app/(site)/layout.tsx (as a server
 * component) and, loaded on demand, by the 404 page (NotFoundFrame). The
 * standalone routes (/leads on leads.orbitboyzz.com, /sample, /qualify, /book,
 * /demo/*) never render or download it.
 */
export default function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <MobileDock />
      <Cursor />
    </>
  )
}
