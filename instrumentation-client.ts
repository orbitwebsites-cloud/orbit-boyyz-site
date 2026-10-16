// PostHog starts once the browser is idle (or after 3s where requestIdleCallback
// is missing). posthog-js is fetched through a dynamic import in
// src/lib/posthog-loader.ts, so it is not part of the bundle every page loads
// up front; global-error.tsx uses the same loader and initializes PostHog on the
// spot if an error renders before the idle callback fires.
// Pages that import posthog-js statically for submit events (/book, /qualify,
// /form, /free-website-check) ship it in their own chunk and share the same
// singleton; their captures run on user submit, normally after init.
// Tradeoff: pageviews and auto-captured exceptions from visits that leave
// within about 3-4s, before init, are not recorded.
import { loadPostHog } from '@/lib/posthog-loader'

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
  const start = () => void loadPostHog()
  if ('requestIdleCallback' in window) {
    requestIdleCallback(start, { timeout: 4000 })
  } else {
    setTimeout(start, 3000)
  }
}
