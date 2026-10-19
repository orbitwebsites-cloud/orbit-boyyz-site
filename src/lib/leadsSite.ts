// leads.orbitboyzz.com: the lead data offer for outbound agencies. Same app,
// own host: src/proxy.ts serves the host's "/" from the /leads route, passes
// /sample through, sends /qualify, /book and /contact to "/#request" (the
// request form; no call or calendar step on this host) and every other path
// on it to orbitboyzz.com.

export const LEADS_HOST = 'leads.orbitboyzz.com'

/** Canonical URL of the leads landing page (also where /qualify's logo and links point). */
export const LEADS_URL = `https://${LEADS_HOST}/`

/** Id of the 25-free-leads request form section on the leads page. */
export const LEADS_REQUEST_ID = 'request'

/** Every primary CTA on the leads site: an in-page jump to the request form. */
export const LEADS_REQUEST_HREF = `#${LEADS_REQUEST_ID}`
