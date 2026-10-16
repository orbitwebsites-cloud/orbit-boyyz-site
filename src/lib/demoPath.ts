/**
 * Lead demo previews live under /demo/<slug> (src/content/demos.ts) and must
 * carry no Orbit chrome. Client-safe: never import demos.ts into client code,
 * it would ship every lead's name and phone to the browser.
 */
export function isDemoPath(pathname: string | null) {
  return pathname === '/demo' || (pathname?.startsWith('/demo/') ?? false)
}

/**
 * Pages that render on their own, without Orbit's preloader, nav, footer,
 * dock, cursor or route-transition panel: the /demo/* lead previews, the
 * /qualify and /book booking flows and the /leads page served at
 * leads.orbitboyzz.com (they bring their own minimal header).
 * Client components should ask useIsStandalone() (src/lib/useStandalone.ts):
 * on leads.orbitboyzz.com the browser URL is "/" while the route is /leads.
 */
export function isStandalonePath(pathname: string | null) {
  return isDemoPath(pathname) || pathname === '/qualify' || pathname === '/book' || pathname === '/leads'
}
