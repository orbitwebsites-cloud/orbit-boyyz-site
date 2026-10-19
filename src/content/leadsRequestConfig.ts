// Settings for the 25-free-leads request form on leads.orbitboyzz.com
// (src/components/leads/LeadsRequestForm.tsx).

// FormSubmit inbox for requests: the same activated inbox as /sample and
// /book. Posted from the visitor's browser: FormSubmit answers server-side
// requests with a 403 (see src/lib/formNotify.ts).
export const LEADS_REQUEST_ENDPOINT = 'https://formsubmit.co/ajax/orbitboyzz@gmail.com'

// Source recorded when the URL has no ?src= / utm_source and no outside referrer.
export const LEADS_REQUEST_DEFAULT_SOURCE = 'direct'
