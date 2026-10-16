'use client'

import { useEffect } from 'react'
import { loadPostHog } from '@/lib/posthog-loader'

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  useEffect(() => {
    // Loads posthog-js on demand (initializing it if the idle-time init hasn't
    // run yet), so it stays out of every page's initial bundle and early errors
    // are still reported.
    void loadPostHog().then((posthog) => posthog?.captureException(error))
  }, [error])

  return (
    <html lang="en">
      <body>
        <main>
          <h1>Something went wrong</h1>
          <p>We were unable to load this page. Please try again.</p>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
