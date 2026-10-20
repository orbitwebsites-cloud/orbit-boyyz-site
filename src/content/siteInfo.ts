// The business's identity and contact details: name, phone, email, booking
// path, location. Its own module so a page that only needs these (the /book
// flow) doesn't bundle the rest of site.ts, which carries the prices and FAQs.
// site.ts re-exports it, so `import { site } from '@/content/site'` still works.

export const site = {
  name: 'Orbit Websites',
  handle: 'OrbitBoyzz',
  tagline: 'Designed personally. Built quickly. Owned by you.',
  url: 'https://orbitboyzz.com',
  phone: '609-662-8052',
  phoneDisplay: '609 662 8052',
  phoneHref: 'tel:+16096628052',
  email: 'alex@orbitboyzz.com',
  // Every "Book a call" button goes to the /book questionnaire first; it shows
  // the scheduler (BOOK_CALENDLY_URL in bookConfig.ts) once the answers are in.
  booking: '/book',
  location: 'Plainsboro, NJ',
  serviceArea: 'Central New Jersey',
  towns: [
    'Plainsboro',
    'Princeton',
    'West Windsor',
    'Ewing',
    'Hamilton',
    'Lawrence',
    'Hopewell',
    'Trenton',
    'Robbinsville',
    'East Windsor',
    'Bordentown',
  ],
} as const
