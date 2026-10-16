import posthog from 'posthog-js'

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (!token) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    )
  }
} else if (!host) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    )
  }
} else {
  posthog.init(token, {
    // same-origin proxy (next.config.ts rewrites); ui_host keeps toolbar links on PostHog
    api_host: '/ingest',
    ui_host: host.replace('.i.posthog.com', '.posthog.com'),
    defaults: '2025-05-24',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  })
}
