import { Button } from '@/components/ui/Button'
import { OrbitSystem } from '@/components/ui/OrbitSystem'

export default function NotFound() {
  return (
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
        <Button href="/contact" variant="ghost">
          Contact
        </Button>
      </div>
    </section>
  )
}
