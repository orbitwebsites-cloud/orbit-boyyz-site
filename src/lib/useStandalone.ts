'use client'

import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { isStandalonePath } from './demoPath'

/**
 * Whether the current route renders without Orbit's chrome. Call from a client
 * component rendered by the root layout.
 *
 * usePathname() is the browser URL, which differs from the rendered route
 * under a proxy rewrite: leads.orbitboyzz.com/ renders /leads, so on the
 * client usePathname() says "/" while the server rendered "/leads". The
 * selected layout segments come from the route tree instead (["leads"] on
 * both sides), so checking either keeps the server HTML and the hydrated
 * client in agreement. (Main-site routes start with the "(site)" route group
 * segment, which never matches a standalone path.)
 */
export function useIsStandalone() {
  const pathname = usePathname()
  const segments = useSelectedLayoutSegments()
  return isStandalonePath(pathname) || isStandalonePath(`/${segments.join('/')}`)
}
