import { LeadForm } from '@/components/port/LeadForm'
import { legacyMetadata } from '@/lib/legacy-meta'

// /form was a client-only route in the old SPA (not prerendered, not in the
// sitemap), so it inherited the default <head> from the old index.html.
export const metadata = legacyMetadata('/form', {
  title: 'OrbitBoyzz | Orbit Websites - Web Design & AI Systems in Central NJ',
  description:
    'OrbitBoyzz, also known as Orbit Websites, is a Plainsboro, NJ web design and AI operations studio for local business websites, booking, intake, and revenue systems.',
})

export default function FormPage() {
  return <LeadForm />
}
