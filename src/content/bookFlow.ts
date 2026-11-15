// Copy and settings for the /book flow (src/components/book/BookFlow.tsx):
// three quick marketing questions, contact details, then the calendar.
// The first call is where we get to know the business, so the form stays short.
//
// Facts only, same rules as the rest of the site:
// - Calls are 30 minutes, free, weekdays, 5 PM ET or later (the Calendly
//   event's availability, BOOK_CALENDLY_URL in bookConfig.ts).
// - Ads management is paid per booking, then a monthly retainer once that costs
//   the client less. Ads run in the client's own account; we never hold ad spend.
// - Cold leads are $0.20 each, plans from 10,000 a month, 25 free to try.
// - Never add testimonials, reviews, ratings, client logos, client counts or results.

/** sessionStorage key for in-progress answers. Bump when the questions change shape. */
export const BOOK_FLOW_STORAGE_KEY = 'orbit-book-v2'

export type BookAnswerKey = 'owner' | 'spending' | 'need'

export type BookQuestion = {
  key: BookAnswerKey
  label: string
  hint?: string
  options: string[]
}

/** The first two are yes/no on purpose: one tap gets a visitor started. */
export const BOOK_QUESTIONS: BookQuestion[] = [
  { key: 'owner', label: 'Are you the owner, or the person who decides on marketing?', options: ['Yes', 'No'] },
  { key: 'spending', label: 'Are you spending money on ads or outreach right now?', options: ['Yes', 'No'] },
  {
    key: 'need',
    label: 'What do you need more of?',
    hint: 'Pick the closest. We will get into the details on the call.',
    options: ['Booked jobs from my ads', 'Leads for cold outreach', 'Both', 'Not sure yet'],
  },
]

export const bookIntro = {
  label: 'Free 30-minute call',
  note: '3 quick questions, then pick a time.',
  points: ['Free, and you decide afterwards', 'You talk to the people who do the work', 'Weekdays, 5 PM ET or later'],
} as const

export const bookCallAgenda = {
  label: 'On the call',
  title: 'What happens in those 30 minutes',
  items: [
    ['We ask about your business', 'Who your customers are, what one new job is worth, and how people find you today.'],
    ['We look at what you are running', 'If you have ads or outreach going, tell us what it costs and what it brings in.'],
    ['We tell you what fits', 'Ads management, cold leads, a website, or none of them. If we are not the right call, we say so.'],
    ['You leave with a plan and a price', 'Then you decide. Nothing is signed or paid on the call.'],
  ],
} as const

export const bookTerms = {
  label: 'How we get paid',
  title: 'The risk sits with us',
  items: [
    ['Per booking', 'Ads management starts on pay per booking. No booked estimates, nothing owed to us.'],
    ['Your account', 'Ads run in your own ad account and you pay Meta directly. We never hold your ad budget.'],
    ['25 free', 'Cold leads are $0.20 each, and you can try 25 for your niche before paying for a plan.'],
  ],
} as const

export const bookStraight = {
  label: 'Straight with you',
  title: 'No invented proof',
  copy: [
    'You will not find made-up reviews, client counts or case studies on this site. We do not publish what we cannot back up.',
    'Our proof is the offer itself: you pay when it books, your ad money stays in your account, and you can call the number below and reach the people doing the work.',
  ],
} as const

export type BookFlowFaq = { q: string; a: string; link?: { href: string; label: string } }

export const bookFlowFaqs: { label: string; title: string; items: BookFlowFaq[] } = {
  label: 'Questions',
  title: 'Before you book',
  items: [
    { q: 'Is the call really free?', a: 'Yes. It is a free 30-minute call, and you decide afterwards whether to go ahead.' },
    { q: 'When are calls?', a: 'Weekdays, 5 PM ET or later. You pick the time right after the questions.' },
    {
      q: 'What does it cost if I go ahead?',
      a: 'Ads management is paid per booking to start, then a monthly retainer once that costs you less. Cold leads are $0.20 each, with plans from 10,000 a month.',
      link: { href: '/pricing', label: 'See our published prices' },
    },
    { q: 'Do you take my ad budget?', a: 'No. Ads run in your own account and you pay Meta directly.' },
    { q: 'What do you do with my details?', a: 'We use them to prepare for your call and to confirm the time.', link: { href: '/privacy', label: 'Privacy policy' } },
  ],
}

export const bookNextSteps = ['Pick a time below.', 'Calendly emails you the invite.', 'We read your answers before the call.'] as const
