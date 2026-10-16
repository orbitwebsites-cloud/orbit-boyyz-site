// leads.orbitboyzz.com: the lead data offer for outbound agencies. Same app,
// own host: src/proxy.ts serves the host's "/" from the /leads route, passes
// /qualify through and sends every other path on it to orbitboyzz.com.

export const LEADS_HOST = 'leads.orbitboyzz.com'

/** Canonical URL of the leads landing page (also where /qualify's logo and links point). */
export const LEADS_URL = `https://${LEADS_HOST}/`

/**
 * Every primary CTA on the leads site. Absolute, so the questionnaire (session
 * draft, FormSubmit inbox, Calendly) always runs on the orbitboyzz.com origin;
 * ?src= makes Qualify.tsx record the visit's source as "leads-site".
 */
export const LEADS_QUALIFY_URL = 'https://orbitboyzz.com/qualify?src=leads-site'
