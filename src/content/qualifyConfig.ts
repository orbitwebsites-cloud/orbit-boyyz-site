// Settings shared by the /book flow (src/components/book/Book.tsx) and its
// Calendly step (src/components/qualify/calendly.tsx). /qualify no longer uses
// any of this: it is the 25-free-leads request page (src/app/qualify/page.tsx),
// with no questions, call or calendar.

export const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js'

// How long the one-line insight stays on screen after a choice
// before the next question slides in.
export const INSIGHT_MS = 1200
