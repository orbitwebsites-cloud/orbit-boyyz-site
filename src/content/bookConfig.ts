// Settings for the /book flow (src/components/book/Book.tsx): the short
// questionnaire every "Book a call" button leads to before the scheduler.
import { site } from './site'

// Calendly event shown on the final screen, prefilled with name, email and
// a1 = "<business> (<service>)". Its availability is weekdays, 5 PM ET or later.
export const BOOK_CALENDLY_URL = site.calendly

// FormSubmit inbox for the answers (activated for orbitboyzz.com).
export const BOOK_FORM_ENDPOINT = 'https://formsubmit.co/ajax/alex@orbitboyzz.com'

// sessionStorage key for in-progress answers. Bump the suffix if the
// question set changes shape so stale drafts are ignored.
export const BOOK_STORAGE_KEY = 'orbit-book-v1'
