// leads.orbitboyzz.com: the lead data offer for outbound agencies. Same app,
// own host: src/proxy.ts serves the host's "/" from the /leads route, passes
// /book-leads (the lead-list booking flow) through, sends /qualify, /sample,
// /book and /contact to /book-leads and every other path on it to
// orbitboyzz.com.

export const LEADS_HOST = 'leads.orbitboyzz.com'

/** Canonical URL of the leads landing page (also where /qualify's logo and links point). */
export const LEADS_URL = `https://${LEADS_HOST}/`

/** Id of the closing "Book a call" section on the leads page (old #request links still land on it). */
export const LEADS_REQUEST_ID = 'request'

/** The lead-list booking flow (src/app/book-leads/page.tsx). Same path on every host. */
export const LEADS_BOOK_PATH = '/book-leads'
