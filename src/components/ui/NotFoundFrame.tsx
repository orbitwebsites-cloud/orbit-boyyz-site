'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

// Next.js puts app/not-found.tsx into the RSC payload of every page, the
// leads.orbitboyzz.com page included. Importing the site frame directly there
// would ship the main site's nav, footer, prices and call-booking links with
// every page. Loaded on demand instead, the frame's code is only fetched when
// a 404 actually renders. (The 404 is prerendered once and served for every
// missing URL, so the frame can't depend on the path: a bad /demo/* slug gets
// it too, as on every other orbitboyzz.com 404.)
const SiteFrame = dynamic(() => import('./SiteFrame'))

/** The 404 page's frame: Orbit's nav, footer, mobile dock and cursor. */
export function NotFoundFrame({ children }: { children: ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>
}
