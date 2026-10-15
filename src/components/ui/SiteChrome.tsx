'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { isStandalonePath } from '@/lib/demoPath'

/**
 * Orbit's own chrome (preloader, nav, footer, dock, cursor). Rendered on every
 * page except standalone ones: /demo/* lead previews, which must look like the
 * lead's own website, and the /qualify and /book booking flows.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return isStandalonePath(usePathname()) ? null : children
}
