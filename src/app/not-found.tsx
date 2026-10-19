import { Button } from '@/components/ui/Button'
import { NotFoundFrame } from '@/components/ui/NotFoundFrame'
import { OrbitSystem } from '@/components/ui/OrbitSystem'

// The 404 page, rendered in the root layout (outside the (site) route group).
// Next.js puts this component in the RSC payload of EVERY page, so it only
// links home: the nav, footer and their links come from NotFoundFrame, which
// loads them on demand when a 404 renders. leads.orbitboyzz.com never shows
// it: src/proxy.ts sends that host's unknown paths to orbitboyzz.com.
export default function NotFound() {
  return (
    <NotFoundFrame>
      <section className="container-x relative flex min-h-[90svh] flex-col items-center justify-center pt-[var(--nav-h)] text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(90vw,44rem)] -translate-x-1/2 -translate-y-1/2 opacity-60">
          <OrbitSystem tilt={74} />
        </div>
        <p className="label">
          <span className="text-accent">[</span> 404 // SIGNAL LOST <span className="text-accent">]</span>
        </p>
        <h1 className="display t-1 mt-6">Lost in orbit.</h1>
        <p className="mt-6 max-w-md text-muted">This page drifted out of range. Let&rsquo;s get you back to mission control.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/">Back home</Button>
        </div>
      </section>
    </NotFoundFrame>
  )
}
