/**
 * Lead demo previews live under /demo/<slug> (src/content/demos.ts) and must
 * carry no Orbit chrome. Client-safe: never import demos.ts into client code,
 * it would ship every lead's name and phone to the browser.
 */
export function isDemoPath(pathname: string | null) {
  return pathname === '/demo' || (pathname?.startsWith('/demo/') ?? false)
}
