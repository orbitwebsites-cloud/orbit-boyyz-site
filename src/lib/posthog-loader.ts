// Lazy PostHog loader shared by instrumentation-client.ts (idle-time init) and
// app/global-error.tsx (on-demand init + captureException). Only a type import
// and a dynamic import() reference posthog-js here, so importing this module
// does not pull posthog-js into a page's initial bundle.
import type { PostHog } from 'posthog-js'

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

let pending: Promise<PostHog | null> | undefined

/**
 * Imports posthog-js and initializes it once; every later call reuses the same
 * promise. Resolves null when the token or host is missing.
 */
export function loadPostHog(): Promise<PostHog | null> {
  if (!token || !host) return Promise.resolve(null)
  const t = token
  const h = host
  pending ??= import('posthog-js').then(({ default: posthog }) => {
    posthog.init(t, {
      // same-origin proxy (next.config.ts rewrites); ui_host keeps toolbar links on PostHog
      api_host: '/ingest',
      ui_host: h.replace('.i.posthog.com', '.posthog.com'),
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
    })
    return posthog
  })
  return pending
}
