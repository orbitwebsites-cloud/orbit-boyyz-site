'use client'

import type { ReactNode } from 'react'
import { useIsStandalone } from '@/lib/useStandalone'

/**
 * Orbit's own chrome (preloader, nav, footer, dock, cursor). Rendered on every
 * page except standalone ones: /demo/* lead previews, which must look like the
 * lead's own website, the /qualify and /book booking flows and /leads
 * (leads.orbitboyzz.com).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return useIsStandalone() ? null : children
}
