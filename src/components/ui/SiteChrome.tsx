'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { isDemoPath } from '@/lib/demoPath'

/**
 * Orbit's own chrome (preloader, nav, footer, dock, cursor). Rendered on every
 * page except /demo/* lead previews, which must look like the lead's own website.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return isDemoPath(usePathname()) ? null : children
}
