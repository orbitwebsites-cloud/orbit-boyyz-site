import { LeadForm } from '@/components/port/LeadForm'
import { legacyMetadata } from '@/lib/legacy-meta'

// /form was a client-only route in the old SPA (not prerendered, not in the
// sitemap), so it inherited the default <head> from the old index.html.
export const metadata = legacyMetadata('/form', {
  title: 'Get an AI Lead Agent Built for Your Business | Orbit Websites',
  description:
    "Want an AI intake or follow-up agent built for your business? Tell Orbit Websites a bit about it and we'll reach out the same day.",
})

export default function FormPage() {
  return <LeadForm />
}
