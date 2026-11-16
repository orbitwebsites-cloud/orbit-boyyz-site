// Copy and settings for the two booking flows (src/components/book/BookFlow.tsx):
// three quick questions, contact details, then the calendar.
// - /book: the marketing call every "Book a free call" button on the site leads to.
// - /book-leads: the lead-list call for outbound agencies (leads.orbitboyzz.com
//   and the old /qualify and /sample links all end up here).
// The first call is where we get to know the business, so the form stays short.
//
// Facts only, same rules as the rest of the site:
// - Calls are 30 minutes, free, weekdays, 5 PM ET or later (the Calendly
//   event's availability, BOOK_CALENDLY_URL in bookConfig.ts).
// - Ads management is paid per booking, then a monthly retainer once that costs
//   the client less. Ads run in the client's own account; we never hold ad spend.
// - Cold leads are $0.20 each, plans from 10,000 a month. There is no free sample.
// - /book-leads follows the leads site's rules (top of content/leads.ts): no
//   prices, guarantees or results promises. The price is given on the call.
// - Never add testimonials, reviews, ratings, client logos, client counts or results.

export type BookAnswerKey = 'owner' | 'spending' | 'need'

export type BookQuestion = {
  key: BookAnswerKey
  label: string
  hint?: string
  options: string[]
}

export type BookFlowFaq = { q: string; a: string; link?: { href: string; label: string } }

export type BookTrustCopy = {
  agenda: { label: string; title: string; items: readonly (readonly [string, string])[] }
  terms: { label: string; title: string; items: readonly (readonly [string, string])[] }
  straight: { label: string; title: string; copy: readonly string[] }
  faqs: { label: string; title: string; items: BookFlowFaq[] }
}

export type BookFlowConfig = {
  /** Sent to analytics with the submit event. */
  id: 'marketing' | 'leads'
  /** The page's own path, for the CRM note. */
  path: string
  /** sessionStorage key for in-progress answers. Bump when the questions change shape. */
  storageKey: string
  /** CRM source slug (api/crm-lead). */
  crmSource: string
  /** Inbox subject, followed by the business name. */
  subject: string
  /** CRM category. Null uses the answer to the third question. */
  category: string | null
  /** The first two are yes/no on purpose: one tap gets a visitor started. */
  questions: BookQuestion[]
  /** Short names for each answer in the Calendly note, the CRM and the inbox email. */
  answerLabels: Record<BookAnswerKey, string>
  intro: { label: string; note: string; points: readonly string[] }
  /** Link under the first question that jumps to the trust section. */
  trustLink: string
  nextSteps: readonly string[]
  trust: BookTrustCopy
}

const straight = {
  label: 'Straight with you',
  title: 'No invented proof',
} as const

const sharedFaqs = {
  free: { q: 'Is the call really free?', a: 'Yes. It is a free 30-minute call, and you decide afterwards whether to go ahead.' },
  when: { q: 'When are calls?', a: 'Weekdays, 5 PM ET or later. You pick the time right after the questions.' },
  details: { q: 'What do you do with my details?', a: 'We use them to prepare for your call and to confirm the time.', link: { href: '/privacy', label: 'Privacy policy' } },
} satisfies Record<string, BookFlowFaq>

export const marketingBookFlow: BookFlowConfig = {
  id: 'marketing',
  path: '/book',
  storageKey: 'orbit-book-v2',
  crmSource: 'book',
  subject: 'Marketing call',
  category: null,
  questions: [
    { key: 'owner', label: 'Are you the owner, or the person who decides on marketing?', options: ['Yes', 'No'] },
    { key: 'spending', label: 'Are you spending money on ads or outreach right now?', options: ['Yes', 'No'] },
    {
      key: 'need',
      label: 'What do you need more of?',
      hint: 'Pick the closest. We will get into the details on the call.',
      options: ['Booked jobs from my ads', 'Leads for cold outreach', 'Both', 'Not sure yet'],
    },
  ],
  answerLabels: { owner: 'decides on marketing', spending: 'spending on ads or outreach now', need: 'needs more of' },
  intro: {
    label: 'Free 30-minute call',
    note: '3 quick questions, then pick a time.',
    points: ['Free, and you decide afterwards', 'You talk to the people who do the work', 'Weekdays, 5 PM ET or later'],
  },
  trustLink: 'What happens on the call, and how we get paid',
  nextSteps: ['Pick a time below.', 'Calendly emails you the invite.', 'We read your answers before the call.'],
  trust: {
    agenda: {
      label: 'On the call',
      title: 'What happens in those 30 minutes',
      items: [
        ['We ask about your business', 'Who your customers are, what one new job is worth, and how people find you today.'],
        ['We look at what you are running', 'If you have ads or outreach going, tell us what it costs and what it brings in.'],
        ['We tell you what fits', 'Ads management, cold leads, a website, or none of them. If we are not the right call, we say so.'],
        ['You leave with a plan and a price', 'Then you decide. Nothing is signed or paid on the call.'],
      ],
    },
    terms: {
      label: 'How we get paid',
      title: 'The risk sits with us',
      items: [
        ['Per booking', 'Ads management starts on pay per booking. No booked estimates, nothing owed to us.'],
        ['Your account', 'Ads run in your own ad account and you pay Meta directly. We never hold your ad budget.'],
        ['$0.20 a lead', 'Cold leads are $0.20 each, with plans from 10,000 new leads a month.'],
      ],
    },
    straight: {
      ...straight,
      copy: [
        'You will not find made-up reviews, client counts or case studies on this site. We do not publish what we cannot back up.',
        'Our proof is the offer itself: you pay when it books, your ad money stays in your account, and you can call the number below and reach the people doing the work.',
      ],
    },
    faqs: {
      label: 'Questions',
      title: 'Before you book',
      items: [
        sharedFaqs.free,
        sharedFaqs.when,
        {
          q: 'What does it cost if I go ahead?',
          a: 'Ads management is paid per booking to start, then a monthly retainer once that costs you less. Cold leads are $0.20 each, with plans from 10,000 a month.',
          link: { href: '/pricing', label: 'See our published prices' },
        },
        { q: 'Do you take my ad budget?', a: 'No. Ads run in your own account and you pay Meta directly.' },
        sharedFaqs.details,
      ],
    },
  },
}

export const leadsBookFlow: BookFlowConfig = {
  id: 'leads',
  path: '/book-leads',
  storageKey: 'orbit-book-leads-v1',
  crmSource: 'book-leads',
  subject: 'Lead list call',
  category: 'Lead lists',
  questions: [
    { key: 'owner', label: 'Are you the owner, or the person who decides on lead data?', options: ['Yes', 'No'] },
    { key: 'spending', label: 'Are you buying leads or lead data right now?', options: ['Yes', 'No'] },
    {
      key: 'need',
      label: 'How many new leads do you need a month?',
      hint: 'A rough number is fine. We will get into the niche and the area on the call.',
      options: ['Under 10,000', '10,000 to 25,000', '25,000 to 50,000', 'More than 50,000', 'Not sure yet'],
    },
  ],
  answerLabels: { owner: 'decides on lead data', spending: 'buying leads now', need: 'leads needed a month' },
  intro: {
    label: 'Free 30-minute call',
    note: '3 quick questions, then pick a time.',
    points: ['Free, and you decide afterwards', 'You talk to the people who build the lists', 'Weekdays, 5 PM ET or later'],
  },
  trustLink: 'What happens on the call, and how the lists are built',
  nextSteps: ['Pick a time below.', 'Calendly emails you the invite.', 'We read your answers before the call.'],
  trust: {
    agenda: {
      label: 'On the call',
      title: 'What happens in those 30 minutes',
      items: [
        ['We ask who you sell to', 'The niche, the area, and who you want to reach at each business.'],
        ['We ask about your volume', 'How many new leads you need a month, and whether you send email, make calls or both.'],
        ['We walk through a row', 'What is in every row, where each field comes from, and how every email is verified.'],
        ['You leave with a scope and a price', 'Then you decide. Nothing is signed or paid on the call.'],
      ],
    },
    terms: {
      label: 'How the lists are built',
      title: 'Built when you ask',
      items: [
        ['Your niche', 'Each list is built for one niche and area, from Google Maps listings and each business’s own website.'],
        ['Verified', 'Every email is checked with a verification service before the sheet ships. Only “valid” counts as verified.'],
        ['One sheet', 'Delivered as a sheet, one row per lead, with the business phone included and the owner’s name where public sources show it.'],
      ],
    },
    straight: {
      ...straight,
      copy: [
        'You will not find made-up reviews, client counts or case studies on this site. We do not publish what we cannot back up.',
        'Our proof is the data: the leads page shows a real row from a list we built, and you can call the number below and reach the people doing the work.',
      ],
    },
    faqs: {
      label: 'Questions',
      title: 'Before you book',
      items: [
        sharedFaqs.free,
        sharedFaqs.when,
        {
          q: 'What niches can you build?',
          a: 'Local service businesses with a Google Maps listing and their own website, such as roofers, HVAC, plumbers, landscapers, electricians, home cleaning and auto repair.',
        },
        { q: 'What does it cost?', a: 'It depends on the niche, the area and how many leads you need a month. You get the price on the call.' },
        sharedFaqs.details,
      ],
    },
  },
}
