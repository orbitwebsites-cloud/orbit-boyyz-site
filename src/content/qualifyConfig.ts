// Settings for the /qualify flow (src/components/qualify/Qualify.tsx).
// Edit values here; the page reads everything from this file.

// Calendly event link for the call, e.g.
// 'https://calendly.com/your-handle/15min'.
// Leave it empty and qualified agencies are asked to reply to the email
// with a weekday time after 5 PM ET instead of seeing the embed.
export const CALENDLY_URL = 'https://calendly.com/orbitwebsites/30min'

export const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js'

// Same FormSubmit inbox as the old site's project brief.
export const FORM_ENDPOINT = 'https://formsubmit.co/ajax/orbitboyzz@gmail.com'

// An agency qualifies for a call when ANY one of these is true.
// Each answer bucket is compared by its lower bound
// (for example "$2k–5k" counts as 2000).
export const QUALIFY_THRESHOLDS = {
  minMonthlySpendUsd: 2000,
  minMonthlyLeads: 2000,
  minClients: 4,
}

// How long the one-line insight stays on screen after a choice
// before the next question slides in.
export const INSIGHT_MS = 1200

// sessionStorage key for in-progress answers. Bump the suffix if the
// question set changes shape so stale drafts are ignored.
export const QUALIFY_STORAGE_KEY = 'orbit-qualify-v1'
