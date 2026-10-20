// Proof under the /book intro (src/components/book/BookProof.tsx), for local
// businesses deciding whether to book the free website call. Facts only:
// - Speed: orbitboyzz.com's September 2026 rebuild scored 95 or higher in all
//   four Lighthouse categories on mobile. Say it about orbitboyzz.com only,
//   never about a client or concept site.
// - Work: Grand Treats by Tony is a real client (2025). Every other site shown
//   is a concept and says "Concept". Screenshots live in public/work/ (copied
//   from D:/ritvik-site/public/work).
// - Process, call and FAQ answers repeat what site.ts (process, faqs) and the
//   /pricing page already say. No prices or money figures here: /pricing is
//   the one place for those.
// - Calls are 30 minutes, weekdays, 5 PM ET or later (the Calendly event's
//   availability, BOOK_CALENDLY_URL in bookConfig.ts). Never claim other hours.
// Never add testimonials, reviews, ratings, client logos, client counts or results.

export type BookWorkItem = {
  name: string
  kind: 'Client' | 'Concept'
  year: string
  copy: string
  /** 1440×900 desktop screenshot in public/work/. */
  image: string
  /** Shown in the screenshot's browser bar. */
  domain: string
}

export const bookWork: { kicker: string; title: string; copy: string; items: BookWorkItem[] } = {
  kicker: 'The work',
  title: 'Sites we’ve built',
  copy: 'One client site, and concept sites we designed for local businesses.',
  items: [
    {
      name: 'Grand Treats by Tony',
      kind: 'Client',
      year: '2025',
      copy: 'The website for a family-owned restaurant, built around its full menu.',
      image: '/work/grand-treats-by-tony-desktop.jpg',
      domain: 'grandtreatsbytony.com',
    },
    {
      name: 'Bella Design Landscapes',
      kind: 'Concept',
      year: '2026',
      copy: 'A homepage for a landscaping company, with a quote form above the fold and a click-to-call header.',
      image: '/work/bella-design-landscapes-desktop.jpg',
      domain: 'bella-design-landscapes.vercel.app',
    },
    {
      name: 'Weichert Princeton Pages',
      kind: 'Concept',
      year: '2026',
      copy: 'A site for a real estate office, built around listings, FAQs and one-tap calling.',
      image: '/work/weichert-princeton-pages-desktop.jpg',
      domain: 'weichert-princeton-pages.vercel.app',
    },
  ],
}

export const bookSpeed = {
  kicker: 'Speed',
  figure: '95',
  title: 'Fast on phones.',
  fact: 'orbitboyzz.com’s September 2026 rebuild scored 95 or higher in all four Lighthouse categories on mobile.',
  categories: ['Performance', 'Accessibility', 'Best practices', 'SEO'],
  note: 'Lighthouse is Google’s free tool for grading a web page on those four things.',
} as const

export const bookProcess = {
  kicker: 'How it works',
  title: 'Three steps to a new site',
  steps: [
    {
      number: '01',
      title: 'Free call',
      copy: '30 minutes, weekdays 5 PM ET or later, with the people who build your site. No sales handoff.',
    },
    {
      number: '02',
      title: 'Build',
      copy: 'Once scope and direction are clear, 50% starts the build. A launch build runs on a seven-day sprint.',
    },
    {
      number: '03',
      title: 'Launch',
      copy: 'You approve the finished site before paying the other 50%. Then it’s yours. Hosting with us is optional.',
    },
  ],
} as const

export const bookCall = {
  kicker: 'On the call',
  title: 'What happens on the call',
  items: [
    'If you shared your current site, we look at it before the call.',
    'We talk through your business, your customers and what the site needs to do: calls, quotes or bookings.',
    'Show us sites you like, or let us suggest a direction.',
    'You get a clear scope, a timeline and a quote.',
    'It’s free, and you decide afterwards.',
  ],
} as const

export type BookFaq = { q: string; a: string; link?: { href: string; label: string } }

export const bookFaqs: { kicker: string; title: string; items: BookFaq[] } = {
  kicker: 'Questions',
  title: 'Before you book',
  items: [
    { q: 'Is the call really free?', a: 'Yes. It’s a free 30-minute call, and you decide afterwards whether to go ahead.' },
    { q: 'When are calls?', a: 'Weekdays, 5 PM ET or later. You pick the time right after the questions.' },
    {
      q: 'How long does a build take?',
      a: 'A launch build runs on a seven-day sprint once scope and direction are clear. Bigger projects get a timeline you agree to before paying anything.',
    },
    {
      q: 'How much will it cost?',
      a: 'It depends on what you need. Launch builds are quoted after the call.',
      link: { href: '/pricing', label: 'See our published prices' },
    },
    { q: 'Do I own the site?', a: 'Yes. You approve the finished site before the final payment, and it’s yours. Hosting with us is optional.' },
  ],
}

export const bookFinal = {
  title: 'Ready when you are.',
  /** {n} is replaced with the number of questions. */
  copy: '{n} quick questions, about a minute. Then pick a weekday time, 5 PM ET or later.',
  cta: 'Start',
} as const
