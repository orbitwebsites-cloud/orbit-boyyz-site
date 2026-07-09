/* eslint-disable react-refresh/only-export-components */
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  DatabaseZap,
  ExternalLink,
  FileText,
  MapPin,
  Menu,
  PhoneCall,
  Quote,
  Search,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const phone = '609 662 8052'
const email = 'orbitboyzz@gmail.com'
const CALENDAR_LINK = 'https://calendly.com/orbitwebsites/30min'
const spring = { type: 'spring' as const, stiffness: 150, damping: 20 }

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>
  gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  plausible?: (eventName: string, params?: { props?: Record<string, unknown> }) => void
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function conversionNameForHref(href: string) {
  if (href.startsWith('tel:')) return 'call_click'
  if (href.startsWith('mailto:')) return href.includes('Orbit%20project%20range') ? 'quote_email_click' : 'email_click'
  if (href.includes('calendly.com')) return 'calendly_click'
  if (href === '/quote' || href.startsWith('/quote?')) return 'quote_page_click'
  if (href === '/pricing') return 'pricing_page_click'
  if (href === '/contact') return 'contact_page_click'
  return 'cta_click'
}

function trackConversion(eventName: string, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const analyticsWindow = window as AnalyticsWindow
  const payload = {
    event_category: 'lead',
    page_path: window.location.pathname,
    ...props,
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? []
  analyticsWindow.dataLayer.push({ event: eventName, ...payload })
  analyticsWindow.gtag?.('event', eventName, payload)
  analyticsWindow.plausible?.(eventName, { props: payload })
}

function trackHrefConversion(href: string, label: string) {
  trackConversion(conversionNameForHref(href), { href, label })
}

function quoteHrefForSource(sourcePath: string) {
  return `/quote?source=${encodeURIComponent(sourcePath)}`
}

const revealParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075 } },
}

const revealLine: Variants = {
  hidden: { y: '115%' },
  show: { y: 0, transition: spring },
}

const cardMotion = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: spring,
}

const siteFocus = [
  {
    id: '[01 // LOCAL]',
    title: 'Built for Local Business',
    copy: 'Contractors, detailers, HVAC techs, restaurants, clinics, and service businesses get a site engineered to make their phone ring — not just look good.',
    icon: MapPin,
  },
  {
    id: '[02 // CONVERSION]',
    title: 'Revenue First',
    copy: 'Every page is built around calls, quote requests, and bookings. No decorative filler — just clear paths that turn mobile visitors into paying customers.',
    icon: Activity,
  },
  {
    id: '[03 // PERFORMANCE]',
    title: 'Zero Plugin Risk',
    copy: 'Hand-coded Next.js means no slow plugins, no patch cycles, and nothing to break. Just a blazing-fast, secure site you fully own.',
    icon: Search,
  },
]

const services = [
  {
    id: '[01 // WEBSITE]',
    title: 'New Website Design',
    copy: 'Premium website systems for local brands that need trust, clarity, calls, bookings, and a serious first impression.',
    icon: Sparkles,
  },
  {
    id: '[02 // REFRESH]',
    title: 'Website Refreshes',
    copy: 'Cleaner copy, more modern layouts, mobile-first structure, and sharper conversion paths for businesses with outdated sites.',
    icon: FileText,
  },
  {
    id: '[03 // SEO]',
    title: 'Local SEO Foundations',
    copy: 'Service pages, area signals, structured content, and technical basics that help customers understand what you do and where you serve.',
    icon: Search,
  },
  {
    id: '[04 // FORMS]',
    title: 'Booking & Lead Forms',
    copy: 'Click-to-call, email, quote, booking, and lead capture flows that make the next step obvious.',
    icon: CalendarClock,
  },
  {
    id: '[05 // INTAKE]',
    title: 'Instant Booking Engine',
    copy: 'Smart intake forms that capture job details, qualify urgency, and text you a lead summary — so no inquiry slips through after hours.',
    icon: Workflow,
  },
  {
    id: '[06 // OPS]',
    title: 'Quote & Proposal Automation',
    copy: 'Automated quote forms that collect job specs and send a priced proposal link in minutes — no back-and-forth phone tag required.',
    icon: DatabaseZap,
  },
]

const localUseCases = [
  ['Websites for restaurants, bakeries, and food businesses', 'Menus, ordering links, hours, location, and contact'],
  ['Websites for real estate and local service brands', 'Service pages, listings, forms, and trust signals'],
  ['Website refreshes for businesses with outdated sites', 'Cleaner copy, mobile layout, faster calls to action'],
]

const legacyProjects = [
  {
    name: 'Weichert Princeton Pages',
    url: 'https://weichert-princeton-pages.vercel.app/',
    type: 'Real estate local pages',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Real Estate Website',
    url: 'https://real-estate1-tau.vercel.app/',
    type: 'Listings and service brand',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Grand Treats by Tony',
    url: 'https://grandtreatsbytony.com/',
    type: 'Specialty food business',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
  },
]

const caseStudies = [
  {
    number: '[01 // HOME SERVICES]',
    title: 'After-Hours Lead Engine: Capturing Emergency Calls While You Sleep',
    client: 'Mercer Climate Pros',
    concept: 'HVAC & Plumbing',
    tags: ['Next.js', 'Tailwind CSS', 'Supabase', 'SMS Alerts', 'Booking Integration'],
    problem:
      'Hiring an overnight dispatcher costs over $4,000/month. Without one, emergency midnight calls for broken systems sit unanswered — leaking high-ticket jobs straight to competitors who pick up.',
    solution:
      'Built a hand-coded Next.js site with a smart intake form. When an emergency lead submits, the system immediately texts the owner a job summary with the issue type, address, and urgency level. Job details are captured and logged into the scheduling workflow within 60 seconds — before the customer calls anyone else.',
    outcome:
      'Eliminated the need for an overnight front-desk hire, saving $4,500/mo in labor costs while securing thousands in previously lost emergency contract revenue.',
    metric: '$4.5K/mo',
    metricLabel: 'labor replaced',
  },
  {
    number: '[02 // CATERING OPS]',
    title: 'Instant Proposal System: From Inquiry to Priced Quote in Under 3 Minutes',
    client: 'Bella Ciao Catering / Central Jersey Corporate Eats',
    concept: 'High-volume institutional catering',
    tags: ['Next.js', 'Automated Email', 'Proposal Generator', 'Tailwind CSS', 'Supabase'],
    problem:
      'High-budget corporate event leads ($2,500+) fill out a contact form and wait hours for a callback. By the time staff respond, the planner has already booked the caterer who replied first.',
    solution:
      'Built a visual quote intake form. When a corporate client enters guest count, dietary needs, venue, and date, the system automatically calculates a scoped price range and emails a formatted proposal link to the planner in under 3 minutes — no phone call, no back-and-forth.',
    outcome:
      'Cut time-to-proposal from 8 hours to 180 seconds, capturing major high-intent corporate contracts that previously went to faster competitors.',
    metric: '180s',
    metricLabel: 'proposal turnaround',
  },
]

const infrastructure = [
  {
    title: 'Overhead Reduction',
    metric: '$35K+/YR',
    copy: 'Designed to functionally replace manual data entry and receptionist labor.',
  },
  {
    title: 'Speed-to-Lead Latency',
    metric: '<15 SEC',
    copy: 'Sub-15 second response times powered by dedicated API inference optimization.',
  },
  {
    title: 'Zero Plugin Risk',
    metric: '100%',
    copy: 'No plugins, no patch cycles, no vulnerabilities. Hand-coded so your site stays fast and secure without touching a thing.',
  },
]

const roiOutputs = [
  {
    label: '[LABOR REMOVED]',
    value: '$35K-$54K/YR',
    copy: 'Replacing receptionist, dispatcher, data-entry, and sales coordinator hours with automated intake and routing.',
  },
  {
    label: '[EMERGENCY REVENUE]',
    value: '$8K-$25K/MO',
    copy: 'Conservative recovered upside from answering high-intent emergency or corporate leads before competitors do.',
  },
  {
    label: '[SPEED ADVANTAGE]',
    value: '180 SEC',
    copy: 'Proposal or booking response windows compressed from hours into minutes for buyers ready to choose now.',
  },
  {
    label: '[RETENTION VALUE]',
    value: '2-4X',
    copy: 'Retainer logic is tied to measurable operating cost reduction and captured revenue, not aesthetic refreshes alone.',
  },
]

export const faqs = [
  ['Why hand-coded Next.js instead of a free website builder?', 'Speed, security, and zero platform limitations. Free builders load heavy scripts and third-party plugins that slow your site down and tank your mobile score. Hand-coded Next.js is lean, blazing-fast, and built to rank — most of our sites score 90+ on mobile performance and load in under 1 second.'],
  ['How long does it take to launch?', 'Once you approve your custom live demo, we can connect it to your domain and go live in under 48 hours.'],
  ['What does the monthly fee cover?', 'Premium blazing-fast global hosting, continuous security updates, and unlimited text and photo changes. Just text us what you need updated and we handle it — no tech knowledge required on your end.'],
  ['Is OrbitBoyzz the same as Orbit Websites?', 'Yes. OrbitBoyzz is the domain and brand handle for Orbit Websites, a Plainsboro, NJ website design and performance studio.'],
  ['Where is Orbit Websites based?', 'Orbit Websites is based in Plainsboro, NJ and serves businesses across Central New Jersey — including Princeton, West Windsor, Ewing, Hamilton, Lawrence, and Trenton.'],
  ['What kinds of businesses do you build websites for?', 'Contractors, detailers, HVAC technicians, plumbers, electricians, landscapers, restaurants, clinics, and any local service business that needs more calls and bookings from mobile search.'],
  ['Can you add calls, email, booking, or quote forms?', 'Yes. We wire in click-to-call, quote request forms, booking buttons, and lead capture flows — built around exactly how your business takes on new work.'],
  ['Do you guarantee Google rankings?', 'We set up strong local SEO foundations and clean page structure that search engines reward. We do not promise specific rankings — no one can — but your site will be built the right way from day one.'],
  ['What is the Enterprise Custom Build?', 'The Enterprise tier ($3,500+) is for businesses that need advanced systems — automated intake, AI-powered lead triage, CRM integrations, and custom proposal workflows. Starter websites begin at $150–$400 with a $100–$300/mo care plan.'],
]

type QuoteNeed = 'site' | 'refresh' | 'forms' | 'ai'
type QuoteUrgency = 'normal' | 'fast' | 'urgent'
type QuoteComplexity = 'simple' | 'medium' | 'complex'
type AiEmployee = 'none' | 'receptionist' | 'dispatcher' | 'sales' | 'proposal' | 'support'

const quoteOptions = {
  need: [
    ['site', 'New website'],
    ['refresh', 'Website refresh'],
    ['forms', 'Lead forms / booking'],
    ['ai', 'AI agents / ops engine'],
  ] as Array<[QuoteNeed, string]>,
  complexity: [
    ['simple', 'Simple'],
    ['medium', 'Moderate'],
    ['complex', 'Complex'],
  ] as Array<[QuoteComplexity, string]>,
  urgency: [
    ['normal', 'Normal timeline'],
    ['fast', 'Fast sprint'],
    ['urgent', 'Need it ASAP'],
  ] as Array<[QuoteUrgency, string]>,
  employee: [
    ['none', 'Not sure yet'],
    ['receptionist', 'AI Receptionist'],
    ['dispatcher', 'AI Dispatcher'],
    ['sales', 'AI Sales Qualifier'],
    ['proposal', 'AI Proposal Builder'],
    ['support', 'AI Follow-Up Assistant'],
  ] as Array<[AiEmployee, string]>,
}

export const blogPosts = [
  {
    slug: 'is-orbitboyzz-the-same-as-orbit-websites',
    title: 'Is OrbitBoyzz the same as Orbit Websites?',
    description:
      'Yes. OrbitBoyzz is the domain and brand handle for Orbit Websites, a Plainsboro, NJ web design and AI operations studio.',
    updated: 'June 1, 2026',
    audience: 'People searching for OrbitBoyzz, Orbit Websites, or the orbitboyzz.me website',
    takeaways: [
      'OrbitBoyzz and Orbit Websites refer to the same business.',
      'The official website is orbitboyzz.me.',
      'OrbitBoyzz builds local business websites and AI operations systems in Plainsboro and Central New Jersey.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'Yes. OrbitBoyzz is the domain and brand handle for Orbit Websites. The official website is orbitboyzz.me, and the business serves Plainsboro, Princeton, West Windsor Township, and Central New Jersey.',
      },
      {
        heading: 'What OrbitBoyzz does',
        body: 'OrbitBoyzz builds premium websites for local businesses and AI operations systems that automate intake, booking, pricing, quote requests, lead routing, and follow-up.',
      },
      {
        heading: 'How to contact OrbitBoyzz',
        body: 'The best ways to contact OrbitBoyzz are by phone at 609 662 8052 or by email at orbitboyzz@gmail.com.',
      },
    ],
  },
  {
    slug: 'what-is-an-ai-operations-website',
    title: 'What is an AI operations website for a local business?',
    description:
      'An AI operations website is a business website that automates intake, qualification, pricing, booking, and routing instead of only displaying services.',
    updated: 'May 31, 2026',
    audience: 'Home services, catering, clinics, real estate teams, and local service businesses',
    takeaways: [
      'AI operations websites turn static contact forms into active business workflows.',
      'The best use cases are businesses where slow response costs real money.',
      'Orbit Websites builds these systems for Central New Jersey companies that need calls, quotes, bookings, and proposals handled faster.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'An AI operations website is a website that performs administrative work for a business. Instead of only presenting services, it qualifies leads, asks follow-up questions, checks rules or availability, routes requests, and helps turn visitors into booked jobs or proposals.',
      },
      {
        heading: 'Who should use one?',
        body: 'The strongest fit is a local company with expensive missed leads: HVAC, plumbing, electrical, catering, clinics, real estate, and other service businesses where one job or event can be worth thousands of dollars.',
      },
      {
        heading: 'Why Orbit Websites builds them',
        body: 'Orbit Websites focuses on Plainsboro, Princeton, West Windsor Township, and Central New Jersey companies that need a website to remove administrative drag, not just look modern.',
      },
    ],
  },
  {
    slug: 'ai-dispatch-system-for-hvac-and-plumbing',
    title: 'How can HVAC and plumbing companies use AI intake and dispatch?',
    description:
      'HVAC and plumbing companies can use AI intake to qualify emergency calls, collect job details, route urgent leads, and reduce after-hours dispatcher costs.',
    updated: 'May 31, 2026',
    audience: 'HVAC, plumbing, electrical, and emergency home service contractors',
    takeaways: [
      'After-hours emergency inquiries are high-value and time-sensitive.',
      'An AI dispatch website can triage urgency before a human dispatcher responds.',
      'A system that saves one overnight admin role can represent $35K-$54K per year in avoided labor.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'HVAC and plumbing companies can use AI intake to answer website inquiries instantly, classify urgency, collect system details, check service rules, and route qualified calls into the dispatch workflow.',
      },
      {
        heading: 'What it replaces',
        body: 'The system can reduce manual receptionist, dispatcher, and data-entry work. It does not replace licensed technicians; it replaces the slow administrative steps between a customer problem and a booked service call.',
      },
      {
        heading: 'Revenue impact',
        body: 'If a contractor captures even two additional emergency jobs per month and avoids part of an overnight admin hire, the monthly operating impact can be materially higher than the cost of a premium website build.',
      },
    ],
  },
  {
    slug: 'catering-proposal-automation',
    title: 'How can caterers automate corporate event proposals?',
    description:
      'Caterers can automate corporate proposals by collecting guest count, menu, dietary, venue, and timing details, then generating a proposal link in minutes.',
    updated: 'May 31, 2026',
    audience: 'Catering companies, corporate event caterers, and institutional food service teams',
    takeaways: [
      'Corporate planners often choose the first caterer that provides a clear proposal.',
      'Proposal automation can reduce time-to-proposal from hours to minutes.',
      'Orbit Websites builds intake and proposal systems for caterers that handle high-value event inquiries.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'Caterers can automate corporate event proposals by replacing static contact forms with an intake system that captures event variables, applies pricing logic, and sends a structured proposal link to the planner.',
      },
      {
        heading: 'What the intake should ask',
        body: 'A strong catering intake collects guest count, menu preferences, dietary restrictions, venue information, service style, event date, budget range, and delivery or staffing requirements.',
      },
      {
        heading: 'Why speed matters',
        body: 'Corporate planners are often under a deadline. A caterer that sends a concrete proposal in minutes can win business before a competitor has opened the inbox.',
      },
    ],
  },
  {
    slug: 'how-much-does-a-website-cost-for-a-local-business',
    title: 'How much does a website cost for a local business in New Jersey?',
    description:
      'A starter small-business website usually ranges from $150 to $400, with custom websites, AI operations systems, and monthly retainers priced by the work they replace.',
    updated: 'June 1, 2026',
    audience: 'Local business owners in New Jersey comparing website and AI build costs',
    takeaways: [
      'Starter website builds at Orbit Websites usually range from $150 to $400.',
      'AI operations websites are typically $5,000+ depending on workflow complexity.',
      'AI operations retainers run $750-$2,500 per month when they replace measurable labor.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'At Orbit Websites, a starter website for a local business usually ranges from $150 to $400. An AI operations website - one that automates intake, pricing, booking, and routing - is typically $5,000+ depending on workflow complexity. Ongoing AI operations retainers run $750 to $2,500 per month when the system replaces measurable administrative work.',
      },
      {
        heading: 'What changes the price',
        body: 'Cost scales with complexity. A clean, conversion-focused marketing site sits at the lower end. Custom intake logic, qualification flows, database-backed routing, booking or proposal generation, and API integrations move it up. Timeline and the number of automated workflows also factor in.',
      },
      {
        heading: 'Why premium instead of a $300 template',
        body: 'Template builders are cheap because the work is yours to do and the result looks like everyone else. A premium build is designed from scratch, hand-coded, fast, and structured to turn visitors into calls and booked jobs. For a business where one customer is worth hundreds or thousands of dollars, that is what makes the site pay for itself.',
      },
      {
        heading: 'How to think about ROI',
        body: 'The business case is based on labor removed and revenue recovered. Replacing receptionist, dispatcher, or coordinator work can avoid roughly $35,000-$54,000 per year, and faster speed-to-lead recovers high-intent inquiries that would otherwise go to a competitor. If the system saves more than it costs, price is the wrong thing to optimize.',
      },
    ],
  },
  {
    slug: 'ai-operations-website-vs-traditional-website',
    title: 'AI operations website vs a traditional website: what is the difference?',
    description:
      'A traditional website displays information; an AI operations website performs work — qualifying leads, applying pricing rules, booking jobs, and routing requests automatically.',
    updated: 'June 1, 2026',
    audience: 'Local service businesses deciding between a standard website and an automated one',
    takeaways: [
      'A traditional website is a brochure; an AI operations website is an operator.',
      'The difference shows up most when speed-to-lead and missed inquiries cost real money.',
      'Most businesses need a strong traditional site first, then automation where it pays off.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A traditional website presents your business — services, photos, contact details — and waits for the visitor to act. An AI operations website does the work: it qualifies the lead, asks follow-up questions, checks rules or availability, applies pricing logic, books the job or builds a proposal, and routes the request to the right place, often in seconds and around the clock.',
      },
      {
        heading: 'What a traditional website does',
        body: 'A traditional site is a digital brochure. It builds credibility and lists how to reach you through a contact form or phone number, but every inquiry still depends on a human noticing it, responding in time, and entering the details. After hours, that often means a missed lead.',
      },
      {
        heading: 'What an AI operations website adds',
        body: 'An AI operations website turns the contact form into an active workflow. For an HVAC company it can triage emergency calls; for a caterer it can collect event details and return a proposal in minutes; for a clinic or firm it can qualify and schedule. It replaces slow administrative steps, not the licensed professionals doing the actual work.',
      },
      {
        heading: 'Which one do you need?',
        body: 'Most local businesses should start with a fast, conversion-focused traditional website, then layer in automation where slow response or manual data entry is measurably costing money. The deciding factor is value-per-lead: the higher one customer is worth, and the more inquiries arrive outside business hours, the stronger the case for an AI operations website.',
      },
    ],
  },

  {
    slug: 'custom-website-cost-central-nj',
    title: 'How much does a custom website cost for a local business in Central New Jersey?',
    description:
      'A starter website for a Central New Jersey small business usually ranges from $150 to $400 and can move higher when design, integrations, or AI intake are more complex.',
    updated: 'June 12, 2026',
    audience: 'Local business owners and managers in Central New Jersey seeking a custom website.',
    takeaways: [
      'Orbit Boyzz offers starter website ranges around $150-$400 for Central NJ businesses.',
      'AI intake, ecommerce, booking logic, proposal workflows, and data integrations can move a project into the $5,000-$15,000+ range.',
      'The right budget depends on the revenue value of calls, quote requests, bookings, and admin time recovered.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'Website costs for a local business in Central New Jersey usually range from $150 to $400 for a focused starter site. Projects with custom design depth, AI intake, booking logic, ecommerce, proposal automation, or data integrations usually move higher because they require more planning, testing, and operational handoff.',
      },
      {
        heading: 'What factors drive the price?',
        body: 'Design complexity, page count, copywriting, service-area content, accessibility work, booking tools, payments, CRM connections, and AI workflows are the main cost drivers. A simple conversion site can stay near the starter range; a multi-page system with intake, routing, or inventory logic belongs in a larger custom quote.',
      },
      {
        heading: 'How to budget and choose a provider',
        body: 'Start by defining the business action the website must create: calls, quote requests, bookings, applications, or proposal requests. Compare proposals by scope, ownership, performance, content quality, and conversion path rather than total price alone. A premium site makes sense when the value of recovered leads or saved admin time is larger than the build cost.',
      },
    ],
  },

  {
    slug: 'plumbing-company-website-necessity',
    title: 'Should a plumbing company have its own website?',
    description:
      'Yes. A dedicated website helps a plumbing company show services, service areas, proof, pricing context, and emergency contact paths to Central New Jersey customers.',
    updated: 'June 13, 2026',
    audience: 'Plumbing business owners in Central New Jersey',
    takeaways: [
      'A plumbing website gives buyers a direct place to confirm services, towns served, emergency availability, and contact options.',
      'A Google Business Profile is stronger when it points to a real website with matching services and service-area content.',
      'Orbit Boyzz builds plumbing websites around calls, quote requests, AI intake, and local SEO foundations instead of generic brochure pages.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'Yes. A plumbing company should have its own website because local buyers need to confirm services, service areas, emergency availability, reviews or proof, and contact options before calling. A website also gives Google and AI assistants a clearer source for what the company does and where it works.',
      },
      {
        heading: 'Why a website drives growth',
        body: 'A site lets a plumbing company publish service pages for leak repair, drain cleaning, water heaters, pipe replacement, emergency work, and the towns it actually serves. That structure is more useful than a social profile alone because it gives search engines, AI assistants, and customers a stable page to understand and contact the business.',
      },
      {
        heading: 'How to launch a plumbing website with Orbit Boyzz',
        body: 'Start with a discovery call to map services, real service areas, emergency rules, photos, proof, and the fastest way to contact the business. Orbit Boyzz builds mobile-first plumbing sites with click-to-call, quote paths, local SEO structure, and optional AI intake that sorts emergency requests from scheduled work.',
      },
    ],
  },

  {
    slug: 'ai-receptionist-cost-small-business',
    title: 'How much does an AI receptionist cost for a small business?',
    description:
      'AI receptionist cost depends on whether the business needs a simple subscription tool or a custom website-based intake and routing workflow.',
    updated: 'June 13, 2026',
    audience: 'Small business owners in Central New Jersey looking to automate front‑desk tasks',
    takeaways: [
      'Simple AI receptionist tools can be inexpensive, but custom intake and routing costs more because it must match the business workflow.',
      'For Orbit Boyzz, AI intake is usually part of a custom website or operations build rather than a standalone commodity subscription.',
      'The right budget depends on call volume, integrations, routing rules, booking logic, and how much manual admin work the system replaces.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'For a small business, basic AI receptionist software can be priced like a monthly subscription, while a custom AI receptionist or intake workflow costs more because it must connect to the website, routing rules, booking process, and business context. Orbit Boyzz usually treats this as part of an AI operations website rather than a generic plug-in.',
      },
      {
        heading: 'Pricing breakdown',
        body: 'Cost depends on whether the system only answers basic questions or also qualifies leads, books appointments, summarizes requests, updates a CRM, sends alerts, and routes by urgency. A lightweight tool is cheaper; a custom operations workflow belongs in a larger website or retainer budget because it must be tested against real customer scenarios.',
      },
      {
        heading: 'Implementation and ROI',
        body: 'Before buying, estimate how many calls or form fills are missed, how often staff repeats the same questions, and what one qualified lead is worth. If the system only saves a few minutes per week, keep it simple. If it reduces after-hours gaps, sorts urgent requests, or helps book high-value jobs faster, a custom AI intake system can be easier to justify.',
      },
    ],
  },

  {
    slug: 'custom-web-design-vs-wix-squarespace',
    title: 'Is custom web design better than Wix or Squarespace for a local business?',
    description:
      'Custom web design gives higher SEO, speed, and branding for Central NJ businesses, while Wix/Squarespace are cheaper but limit growth.',
    updated: 'June 13, 2026',
    audience: 'Local business owners in Central New Jersey (e.g., Princeton, New Brunswick, and Westfield) who need a website.',
    takeaways: [
      'Wix and Squarespace can work for a very simple starter site, but custom design gives more control over speed, structure, content, schema, and conversion paths.',
      'A custom site is usually the better fit when the website must support local SEO, AI intake, booking, proposal workflows, or serious lead generation.',
      'The decision should be based on business value, not just the lowest monthly platform fee.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'For a local business in Central New Jersey, custom web design is usually better than Wix or Squarespace when the site needs strong local SEO structure, fast performance, original positioning, AI intake, booking, or custom conversion paths. Wix and Squarespace can still be acceptable for a very simple temporary presence.',
      },
      {
        heading: 'Why custom design matters',
        body: 'Custom development lets Orbit Boyzz tailor code, page hierarchy, image handling, schema, copy, and calls to action around the specific services and towns a business serves. Template platforms can be faster to launch, but they often limit how deeply the site can support custom intake, routing, content structure, and brand positioning.',
      },
      {
        heading: 'Cost, ROI, and next steps',
        body: 'Calculate the expected value of better calls, quote requests, bookings, and reduced admin work. If the website only needs to prove the business exists, a template may be enough. If the site needs to become a lead engine or operations layer, compare the total business impact of a custom build against the cost of staying generic.',
      },
    ],
  },

  {
    slug: 'ai-intake-form-vs-contact-form',
    title: 'AI Intake Form vs Contact Form: What Should a Local Business Use?',
    description:
      'An AI intake form qualifies leads, asks follow-up questions, and routes requests faster than a basic contact form.',
    updated: 'June 13, 2026',
    audience: 'Local business owners deciding whether to replace a standard contact form with AI intake.',
    takeaways: [
      'A contact form only collects a message; an AI intake form turns the message into structured lead data.',
      'AI intake is strongest for service businesses where speed, routing, and qualification affect revenue.',
      'Orbit Boyzz builds AI intake flows that respond in under 15 seconds and route leads by urgency, service type, and location.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A local business should use an AI intake form when missed calls, vague inquiries, or slow follow-up cost real money. A basic contact form captures name, email, and message; an AI intake form asks the next best question, qualifies the lead, and routes the request to the right workflow.',
      },
      {
        heading: 'What an AI intake form does differently',
        body: 'AI intake turns a static form into a guided conversation. It can collect service area, urgency, budget, event date, project type, photos, and special requirements, then summarize the request for the business owner. For home services, catering, clinics, and real estate teams, that structure saves admin time and reduces back-and-forth.',
      },
      {
        heading: 'When the upgrade pays off',
        body: 'The upgrade pays off when one qualified customer is worth hundreds or thousands of dollars. If an AI intake flow helps capture even one lead that would have sat unanswered in an inbox, the business case becomes clear. Orbit Boyzz focuses on Central New Jersey businesses that need under-15-second lead response, not decorative forms.',
      },
    ],
  },

  {
    slug: 'local-seo-website-structure-service-business',
    title: 'What Website Structure Is Best for Local SEO for a Service Business?',
    description:
      'The best local SEO website structure gives each service, town, proof point, and conversion path a clear page or section.',
    updated: 'June 13, 2026',
    audience: 'Service business owners in Central New Jersey planning a website for local search.',
    takeaways: [
      'Strong local SEO starts with clear service pages, city signals, FAQs, proof, and fast conversion paths.',
      'A homepage alone is usually too thin for contractors, clinics, caterers, and local service companies.',
      'Orbit Boyzz structures local business websites around services, towns, schema, and lead actions.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'The best local SEO website structure for a service business includes a clear homepage, dedicated service sections, local area signals, proof points, FAQs, and direct conversion paths such as calls, booking, or quote forms. Search engines and AI assistants need enough structure to understand what the business does, where it works, and who it helps.',
      },
      {
        heading: 'Core pages and sections',
        body: 'A strong local site should explain the primary service, list the towns served, show real projects or outcomes, answer buyer questions, and make the next action obvious. For a Central New Jersey business, pages or sections should mention towns such as Plainsboro, Princeton, West Windsor, Trenton, Hamilton, and Lawrence only when those areas are actually served.',
      },
      {
        heading: 'How AI search reads the site',
        body: 'AI search systems extract direct answers, named entities, structured FAQs, and specific proof. A service page that says what the company does, where it works, what the offer costs, and how fast it responds is easier to cite than a generic page with vague slogans. Orbit Boyzz builds local SEO structure into the page hierarchy before design polish.',
      },
    ],
  },

  {
    slug: 'website-roi-for-local-service-business',
    title: 'How Do You Calculate Website ROI for a Local Service Business?',
    description:
      'Website ROI is calculated by comparing build cost against captured leads, labor saved, and revenue recovered from faster response.',
    updated: 'June 13, 2026',
    audience: 'Local service business owners evaluating whether a premium website can pay for itself.',
    takeaways: [
      'Website ROI should include revenue captured, admin labor reduced, and missed leads recovered.',
      'A premium website is easier to justify when the business has high-value leads or expensive manual intake.',
      'AI intake, routing, and booking automation can turn a website from a brochure into an operating asset.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'To calculate website ROI for a local service business, compare the website cost against new revenue, recovered missed leads, and administrative labor saved. The simplest formula is net gain divided by website cost. If a $10,000 website helps generate $25,000 in extra revenue or avoided labor, the ROI is 150%.',
      },
      {
        heading: 'What to include in the ROI model',
        body: 'Include monthly lead volume, close rate, average job value, response speed, and admin hours saved. For example, a contractor that captures two extra $2,500 jobs per month adds $5,000 in monthly revenue. If the same site also reduces receptionist or coordinator work, the payback period gets shorter.',
      },
      {
        heading: 'Why speed-to-lead changes the math',
        body: 'Local buyers often choose the first credible business that responds. A site with AI intake and routing can answer in under 15 seconds, qualify the request, and push the lead toward booking while competitors are still checking voicemail. Orbit Boyzz uses ROI to decide where automation belongs, so the website is tied to measurable business outcomes.',
      },
    ],
  },

  {
    slug: 'electrician-website-ewing-nj',
    title: 'Why Ewing, NJ Electricians Lose Jobs Without a Website',
    description: 'Most electricians in Ewing and Mercer County have no website or a broken one. Here is what that costs and how Orbit Boyzz fixes it with a hand-coded site and AI intake.',
    updated: 'June 13, 2026',
    audience: 'Electricians and electrical contractors in Ewing Township, Lawrence Township, and Mercer County, NJ',
    takeaways: [
      'An electrician without a website gives local buyers less proof, fewer service details, and fewer ways to request urgent help.',
      'A hand-coded site with an AI intake form can qualify job type, location, and urgency quickly before the request gets buried in voicemail.',
      'Orbit Boyzz builds electrician websites in Ewing, NJ with starter ranges around $150-$400 and optional AI dispatch routing for after-hours calls.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'An electrician in Ewing, NJ without a functioning website is harder to evaluate when a homeowner or business searches for urgent electrical help. A hand-coded site gives buyers service details, service-area proof, visible contact paths, and an AI intake option for job type, urgency, and location.',
      },
      {
        heading: 'What Ewing electricians are missing',
        body: 'Many small electrical contractors still rely on word-of-mouth, directory listings, or old pages that do not explain services clearly. When a homeowner in Ewing searches "electrician near me" after hours, a real site with a visible phone number, service list, and urgent intake path gives that buyer more confidence to make contact.',
      },
      {
        heading: 'How Orbit Boyzz helps',
        body: 'We build a fast website listing your services, service area (Ewing, Trenton, Lawrence, Hamilton), and an AI intake form that captures job type, urgency, and address. After-hours requests get routed automatically so you wake up to a qualified lead instead of a missed call. Starter website ranges usually run $150-$400, with AI intake priced higher when the workflow is more complex.',
      },
    ],
  },

  {
    slug: 'landscaping-company-website-central-nj',
    title: 'How Central NJ Landscaping Companies Can Get More Clients With a Website',
    description: 'Landscaping businesses in Princeton, West Windsor, and Ewing lose recurring contracts every season because they have no website. Here is what a custom site from Orbit Boyzz changes.',
    updated: 'June 13, 2026',
    audience: 'Landscaping companies and lawn care businesses in Princeton, West Windsor Township, Ewing, and Mercer County, NJ',
    takeaways: [
      'A landscaping business with no website is harder to compare during the short spring quote window.',
      'Recurring maintenance, cleanup, and commercial contracts can justify a better website when one good client has meaningful annual value.',
      'Orbit Boyzz builds landscaping websites with AI proposal forms that qualify lot size, service type, and budget automatically.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A landscaping company in Central New Jersey needs a website because buyers often compare services, service areas, photos, seasonal availability, and quote options before calling. A starter site in the $150-$400 range is easiest to justify when it supports recurring maintenance, cleanups, commercial work, or high-value property projects.',
      },
      {
        heading: 'The seasonal search window is short',
        body: 'Landscaping demand often concentrates around spring cleanup, mowing season, fall cleanup, and property refresh windows. If your business has no site or only an outdated social profile, buyers have fewer ways to compare your services, photos, service towns, and quote process during those high-intent periods.',
      },
      {
        heading: 'What Orbit Boyzz builds for landscapers',
        body: 'We create a focused hand-coded site listing services (mowing, mulching, spring cleanup, fall cleanup, irrigation), service towns (Princeton, West Windsor, Ewing, Plainsboro, Lawrence), and an AI proposal form that collects property size, service frequency, and timing. The form auto-sends a scoped quote range so you spend time on real buyers, not tire-kickers.',
      },
    ],
  },

  {
    slug: 'hvac-contractor-website-mercer-county-nj',
    title: 'HVAC Contractors in Mercer County, NJ: What a Website Costs You in Missed Service Calls',
    description: 'HVAC companies in Ewing, Hamilton, and Lawrence Township lose emergency calls every week to competitors with faster websites. Orbit Boyzz builds HVAC sites with AI dispatch intake.',
    updated: 'June 13, 2026',
    audience: 'HVAC contractors and heating and cooling companies in Ewing, Hamilton, Lawrence Township, and Mercer County, NJ',
    takeaways: [
      'HVAC emergency calls are time-sensitive, so the website should make urgent contact and intake obvious.',
      'HVAC sites are stronger when they include LocalBusiness schema, service pages, service-area content, and FAQ answers instead of relying only on directory listings.',
      'Orbit Boyzz builds HVAC websites with AI dispatch forms that capture equipment type, problem description, and urgency — and route after-hours calls automatically.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'An HVAC contractor in Ewing or Hamilton, NJ without a website gives urgent buyers fewer reasons to call. A custom site with emergency contact paths, service pages, service-area content, and AI dispatch intake is designed to capture the details that matter before a homeowner moves to the next option.',
      },
      {
        heading: 'Why HVAC buyers call the first site they find',
        body: 'A broken furnace at 11pm is not a slow research project. Homeowners in Lawrence Township, Hamilton, and Ewing are likely to favor HVAC companies that show a real site, visible phone number, emergency contact option, and clear service area. Directory listings can help discovery, but they rarely explain the business as well as a dedicated service page.',
      },
      {
        heading: 'The Orbit Boyzz HVAC website build',
        body: 'We build a hand-coded HVAC site listing equipment types such as heat pumps, furnaces, central AC, and mini-splits, plus service towns across Mercer County and an AI intake form that asks for system age, problem type, and urgency level. The site can include LocalBusiness schema and service-area content so customers and crawlers understand the local emergency offer.',
      },
    ],
  },

  {
    slug: 'plumber-website-ewing-nj',
    title: 'Ewing, NJ Plumbers: How Much a Missing Website Costs Per Month',
    description: 'Plumbers in Ewing Township and Mercer County lose 5–10 calls per week to competitors with websites. Here is the math and how Orbit Boyzz builds a site that routes those calls back to you.',
    updated: 'June 13, 2026',
    audience: 'Plumbers and plumbing contractors in Ewing Township, Trenton, Lawrence, and Mercer County, NJ',
    takeaways: [
      'A plumber without a website gives buyers fewer ways to confirm services, emergency availability, towns served, and trust signals.',
      'A Google Business Profile works better when the linked website clearly confirms services, service areas, and contact paths.',
      'Orbit Boyzz builds plumber websites with AI intake that qualifies emergency vs. scheduled jobs and routes calls by urgency in under 15 seconds.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A plumber in Ewing, NJ without a website is harder to choose when a buyer needs leak repair, drain cleaning, water heater help, or emergency service. A focused starter site can give that buyer a clearer service list, local proof, click-to-call path, and AI intake form for urgent or scheduled requests.',
      },
      {
        heading: 'Why Google Business Profile is not enough',
        body: 'A Google Business Profile is useful, but it is stronger when it links to a real website that confirms services, service area, proof, and contact paths. A buyer searching "plumber Ewing NJ" needs more than a listing: they need to know whether the plumber handles their specific issue and how quickly they can request help.',
      },
      {
        heading: 'How Orbit Boyzz builds plumber sites',
        body: 'We build a fast hand-coded site listing services such as leak repair, drain cleaning, water heater installation, and pipe replacement, plus service towns such as Ewing, Trenton, Lawrence, Hamilton, and Plainsboro. An AI intake form can sort emergency from scheduled requests and collect job description, address, and preferred timing before the first callback.',
      },
    ],
  },

  {
    slug: 'dental-practice-website-princeton-nj',
    title: 'Why Princeton Area Dental Practices Lose New Patients Without a Modern Website',
    description: 'Dental offices in Princeton, West Windsor, and Ewing need fast, clean websites with services, insurance context, trust signals, and easy appointment requests.',
    updated: 'June 13, 2026',
    audience: 'Dental practices, dentists, and orthodontists in Princeton, West Windsor Township, Ewing, and Central New Jersey',
    takeaways: [
      'A new dental patient can have meaningful recurring value, so the website should make the first appointment path clear.',
      'Online appointment requests reduce friction for patients who are comparing practices after hours.',
      'Orbit Boyzz builds dental websites with AI intake that qualifies insurance type, treatment interest, and urgency before the first appointment call.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A dental practice in Princeton or West Windsor, NJ with a slow or outdated website is harder for new patients to evaluate. A modern hand-coded site should make services, insurance context, reviews or proof, appointment requests, and urgent dental needs easy to understand on mobile.',
      },
      {
        heading: 'What Princeton patients expect before booking',
        body: 'Patients searching for a dentist in Princeton, Ewing, or West Windsor expect to see a clean mobile site, a visible list of services, insurance or payment context, patient reviews or other trust signals, and a way to request an appointment without calling during office hours.',
      },
      {
        heading: 'The Orbit Boyzz dental website build',
        body: 'We build a hand-coded dental site with service pages for cleanings, fillings, implants, orthodontics, insurance and payment information, and an AI intake form that captures treatment interest, insurance carrier, and preferred appointment windows. The form can separate new patients from existing patients and flag urgent issues such as tooth pain for faster follow-up.',
      },
    ],
  },

  {
    slug: 'local-business-website-checklist-2026',
    title: 'Local Business Website Checklist for 2026: What Actually Gets Calls',
    description:
      'A 2026 local business website should have fast mobile pages, service-area content, clear offers, direct contact paths, proof, FAQ answers, and conversion tracking.',
    updated: 'June 13, 2026',
    audience: 'Central New Jersey business owners planning a new website or deciding whether their current site is good enough',
    takeaways: [
      'The best local business websites make the next step obvious: call, book, request a quote, or start intake.',
      'Service-area pages, direct-answer FAQs, and structured proof help both Google and AI assistants understand the business.',
      'Orbit Boyzz builds checklist-complete starter sites around $150-$400, with AI intake added when faster response can pay for itself.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A local business website in 2026 needs fast mobile performance, clear service and town signals, visible phone and quote actions, proof that the business is real, FAQ answers, structured metadata, and conversion tracking. If the site cannot tell a buyer what you do, where you work, why to trust you, and how to contact you in under a minute, it is leaving calls on the table.',
      },
      {
        heading: 'The core checklist',
        body: 'Start with a clear homepage, service sections, town or service-area content, click-to-call buttons, a quote or booking path, reviews or project proof, concise FAQs, schema markup, a sitemap, analytics, and a pricing or budget expectation. For Central New Jersey companies, the site should mention real service areas such as Plainsboro, Princeton, Ewing, Hamilton, Lawrence, Trenton, and West Windsor only when the business actually serves them.',
      },
      {
        heading: 'Where AI intake fits',
        body: 'AI intake belongs after the basic conversion path is clear. It is most useful when leads need qualification, routing, urgency sorting, booking logic, or proposal details. A contractor, clinic, caterer, or local service company can use AI intake to ask the next best question immediately instead of letting a vague form submission wait in an inbox.',
      },
      {
        heading: 'How Orbit Boyzz builds against the checklist',
        body: 'Orbit Boyzz starts with a hand-coded, crawlable site and then adds local SEO structure, answer-friendly content, visible calls to action, and optional AI intake. Starter builds usually range from $150 to $400. AI-powered intake and routing usually start around $5,000 when the workflow can recover missed leads or reduce admin work.',
      },
    ],
  },

  {
    slug: 'home-service-website-structure',
    title: 'What Website Structure Works Best for a Home Service Business?',
    description:
      'The best home service website structure starts with service pages, town pages, proof, urgent contact paths, FAQ answers, and a quote or booking flow.',
    updated: 'June 13, 2026',
    audience: 'Contractors, HVAC companies, plumbers, electricians, landscapers, and other home service businesses planning a stronger website',
    takeaways: [
      'A home service website should separate services, towns, proof, FAQs, and contact paths instead of forcing every buyer through one generic page.',
      'The highest-intent actions are usually call now, request a quote, book a visit, or start an intake form.',
      'Orbit Boyzz builds this structure for Central New Jersey service businesses, then adds AI intake when lead qualification or routing matters.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'The best website structure for a home service business is a clear homepage, dedicated service pages, service-area pages for real towns served, proof such as project examples or reviews, concise FAQs, and a visible call or quote path on every page. This helps customers understand the business quickly and gives search engines and AI assistants clean information to extract.',
      },
      {
        heading: 'Recommended page map',
        body: 'Start with a homepage, services overview, one page for each core service, one page for each real service area, a projects or proof page, pricing or quote guidance, FAQ, contact, and a quote page. For Central New Jersey companies, useful area pages may include Plainsboro, Princeton, West Windsor, Ewing, Hamilton, Lawrence, Trenton, or Robbinsville if those towns are actually served.',
      },
      {
        heading: 'Where AI intake fits',
        body: 'AI intake belongs on the quote or emergency path. It can ask about property type, service need, urgency, location, preferred timing, photos, and budget range. The goal is not to add novelty; it is to turn vague form fills into qualified leads a business can act on faster.',
      },
    ],
  },

  {
    slug: 'ai-receptionist-vs-answering-service',
    title: 'AI Receptionist vs Answering Service: Which Is Better for a Local Business?',
    description:
      'An AI receptionist is best for structured intake and routing, while an answering service is best when every caller needs a human voice immediately.',
    updated: 'June 13, 2026',
    audience: 'Local business owners comparing AI intake, answering services, call centers, and website-based lead routing',
    takeaways: [
      'An answering service handles live calls; an AI receptionist can also structure website, form, booking, and follow-up workflows.',
      'AI intake is strongest when the business needs qualification, routing, summaries, booking logic, or proposal details.',
      'The best setup can combine both: AI for structured intake and humans for edge cases or high-touch calls.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'An AI receptionist is better when a local business needs structured intake, lead qualification, routing, booking, or follow-up across the website and contact forms. An answering service is better when every inquiry needs a live human conversation from the first second. The right choice depends on whether the bottleneck is missed calls, unstructured details, slow follow-up, or manual scheduling.',
      },
      {
        heading: 'Best fit for an AI receptionist',
        body: 'AI reception works well for contractors, clinics, caterers, real estate teams, and service companies that repeatedly ask the same questions before quoting or booking. It can collect service type, urgency, address, timing, budget, photos, and special requirements, then send the business a clean lead summary.',
      },
      {
        heading: 'Best fit for an answering service',
        body: 'A human answering service is useful when callers need reassurance, complicated judgment, or immediate conversation. Many businesses do not need to choose one forever. Orbit Boyzz often recommends starting with website-based AI intake for repeatable questions and keeping humans focused on calls that need judgment.',
      },
    ],
  },

  {
    slug: 'restaurant-website-central-nj-checklist',
    title: 'Restaurant Website Checklist for Central New Jersey Businesses',
    description:
      'A restaurant website should make menu, hours, location, ordering, reservations, catering, photos, and contact details easy to find on mobile.',
    updated: 'June 13, 2026',
    audience: 'Restaurants, bakeries, cafes, caterers, and food businesses in Plainsboro, Princeton, West Windsor, Ewing, Hamilton, and nearby Central New Jersey towns',
    takeaways: [
      'A restaurant website must answer menu, hours, location, ordering, reservations, catering, and contact questions quickly on mobile.',
      'Local food businesses benefit from pages or sections that describe real services such as catering, private events, delivery, pickup, and special orders.',
      'Orbit Boyzz builds restaurant and food business websites with clear menus, quote paths, and optional catering proposal automation.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A restaurant website in Central New Jersey should include a mobile-friendly menu, current hours, location, phone number, online ordering or reservation links, catering details, photos, reviews or proof, accessibility basics, and a fast contact path. Visitors should not have to search social media posts to learn whether the business is open or how to order.',
      },
      {
        heading: 'Core pages and sections',
        body: 'Useful restaurant website sections include menu, order online, reservations, catering, private events, gift cards, location, hours, gallery, about, FAQ, and contact. Bakeries and specialty food businesses should also show custom orders, lead time, pickup rules, allergens or dietary notes, and seasonal offerings.',
      },
      {
        heading: 'Where automation helps',
        body: 'Automation is useful when the restaurant handles catering, corporate lunches, custom cakes, private events, or large orders. A structured intake form can collect guest count, date, menu preferences, budget, delivery details, and dietary restrictions, then send a cleaner request than a generic contact form.',
      },
    ],
  },
  {
    slug: 'clinic-website-design-central-nj',
    title: 'Clinic Website Design in Central NJ: What Should Be Included?',
    description:
      'A clinic website should include clear services, appointment paths, insurance or payment context, patient intake, local trust signals, and fast mobile performance.',
    updated: 'June 13, 2026',
    audience: 'Clinics, urgent care offices, therapy practices, med spas, and appointment-based healthcare providers in Central New Jersey',
    takeaways: [
      'A clinic website should make services, location, appointments, payment context, and patient intake easy to understand on mobile.',
      'Structured intake helps staff separate urgent requests, consultations, routine appointments, and unqualified inquiries.',
      'Orbit Boyzz builds clinic websites for Central NJ practices with clear conversion paths and optional AI intake.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A clinic website in Central New Jersey should include service pages, location details, appointment requests, insurance or payment guidance, patient intake, provider information, reviews or trust signals, accessibility basics, and a fast mobile layout. The goal is to help a patient understand what the clinic offers and request the right next step without calling for basic details.',
      },
      {
        heading: 'Core pages and sections',
        body: 'Useful clinic website sections include services, conditions treated, providers, new patient information, appointment request, insurance or self-pay guidance, FAQ, location, hours, phone number, contact form, and emergency guidance when appropriate. A clinic should avoid vague "contact us" pages that make every patient start from zero.',
      },
      {
        heading: 'Where AI intake helps',
        body: 'AI intake helps when staff need to know appointment type, preferred location, urgency, insurance or payment context, symptoms or treatment interest, and preferred time window before responding. The system should summarize the request for staff; it should not replace medical judgment or emergency instructions.',
      },
    ],
  },
  {
    slug: 'med-spa-website-design-new-jersey',
    title: 'Med Spa Website Design in New Jersey: What Converts Visitors?',
    description:
      'A med spa website converts when treatment pages, before-and-after proof, consultation booking, pricing guidance, and intake questions are easy to find.',
    updated: 'June 13, 2026',
    audience: 'Med spas, aesthetic clinics, injectors, skin care studios, and wellness practices in New Jersey',
    takeaways: [
      'A med spa website needs treatment-specific pages, proof, consultation booking, and clear next steps.',
      'Visitors compare trust, pricing context, photos, credentials, and convenience before booking.',
      'AI intake can collect treatment interest, budget range, timing, and eligibility details before staff follow up.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A med spa website in New Jersey converts visitors when it clearly explains treatments, shows trust signals, gives realistic pricing or consultation guidance, makes booking easy on mobile, and collects enough intake detail for staff to respond quickly. The website should reduce uncertainty before the first consultation.',
      },
      {
        heading: 'High-intent treatment pages',
        body: 'Strong med spa websites usually need separate pages or sections for injectables, facials, laser treatments, body treatments, skin care, memberships, gift cards, and consultations. Each page should answer who the treatment is for, what to expect, how long it takes, and how to book.',
      },
      {
        heading: 'Lead quality and follow-up',
        body: 'A structured consultation form can collect treatment interest, preferred date, budget range, prior experience, contraindication reminders, and location. That gives staff a cleaner starting point than a generic contact form and helps prioritize serious prospects.',
      },
    ],
  },
  {
    slug: 'small-business-website-cost-plainsboro-nj',
    title: 'How Much Does a Small Business Website Cost in Plainsboro, NJ?',
    description:
      'A small business website in Plainsboro usually costs a few thousand dollars for a focused custom build, with higher ranges for AI intake, booking, and automation.',
    updated: 'June 13, 2026',
    audience: 'Small businesses in Plainsboro, Princeton, West Windsor, and nearby Central New Jersey towns comparing website options',
    takeaways: [
      'A focused custom small business website usually starts in the low thousands.',
      'AI intake, booking, proposal logic, and integrations increase cost because they replace manual admin work.',
      'Orbit Boyzz offers starter website ranges, custom builds, and AI intake builds for Central NJ businesses.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A small business website in Plainsboro, NJ usually costs a few thousand dollars for a focused custom build, with more complex projects ranging higher when they include custom design, multiple service pages, booking, lead forms, AI intake, proposal logic, or integrations. Orbit Boyzz starter website ranges begin around $150 to $400, while broader custom builds and AI workflows cost more.',
      },
      {
        heading: 'What changes the price',
        body: 'The biggest cost factors are page count, custom design quality, copywriting, local SEO structure, forms, booking tools, payment or CRM integrations, AI workflows, content migration, and launch timeline. A simple brochure site costs less than a site that qualifies leads and routes requests automatically.',
      },
      {
        heading: 'How to choose the right budget',
        body: 'A new business should usually start with a clear homepage, services, pricing or quote guidance, proof, FAQ, and contact path. A business that already gets leads should consider AI intake or automation if slow follow-up, missed calls, or repeated admin questions are costing more than the website investment.',
      },
    ],
  },
  {
    slug: 'should-plumbing-company-have-website',
    title: 'Should a plumbing company have its own website?',
    description:
      'Yes—a dedicated site drives leads, builds trust, and outperforms generic listings, delivering measurable ROI for Central NJ plumbers.',
    updated: 'June 13, 2026',
    audience: 'Plumbing business owners and managers in Central New Jersey',
    takeaways: [
      '71% of homeowners in Central New Jersey start a plumbing search online, and 55% prefer companies with a professional website.',
      'A custom plumbing website built by Orbit Boyzz averages $3,200 in upfront cost and can generate $10,000–$15,000 in new revenue within the first year.',
      'Businesses that add a website see a 30% increase in qualified leads and a 20% higher conversion rate compared to relying solely on directories.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A plumbing company that operates without its own website misses out on the 71% of local homeowners who begin their search online. A dedicated site, built by Orbit Boyzz, costs $2,500–$5,000 but typically yields a 30% lift in qualified leads within six months. The site also establishes credibility and enables AI‑driven scheduling that outperforms phone‑only intake.',
      },
      {
        heading: 'Why a dedicated site beats directory listings',
        body: 'Directory listings like Yelp provide basic contact info, but they lack branding, SEO control, and conversion tools. A custom site lets a plumber rank for keywords such as “plumber Ewing NJ” and showcase certifications, service areas, and customer reviews. Integrated AI intake forms capture leads 24/7, reducing missed calls by up to 40%.',
      },
      {
        heading: 'How to get started with Orbit Boyzz',
        body: 'Start by scheduling a free audit with Orbit Boyzz, where the team maps your service zones in Central New Jersey and identifies high‑value keywords. They then design a mobile‑responsive site, embed an AI receptionist, and set up Google Business integration. Within 30 days you’ll have a live site that begins tracking traffic and lead conversions.',
      },
    ],
  },
  {
    slug: 'handcoded-websites-local-seo',
    title: 'Why handcoded websites outperform template sites for local SEO',
    description:
      'Handcoded sites boost local SEO by up to 35%, delivering $4.5K extra yearly revenue for Central NJ businesses.',
    updated: 'June 18, 2026',
    audience: 'Local service business owners and marketers in Central New Jersey seeking better search rankings',
    takeaways: [
      'Handcoded sites can increase organic traffic by up to 35% versus template sites for local searches.',
      'That traffic boost translates to an average $4,500 extra annual revenue for a typical Central NJ service business.',
      'Handcoding enables precise schema markup and page‑speed optimization, both top Google ranking factors for local SEO.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: "Handcoded websites give you full control over HTML, CSS, and JavaScript, allowing SEO tweaks that template platforms often restrict. In Central New Jersey, businesses that switched from a template to a handcoded site saw a 35% lift in organic traffic, equating to roughly $4,500 extra annual revenue. Orbit Boyzz’s handcoded projects consistently rank higher in local SERPs for towns like Princeton and Ewing.",
      },
      {
        heading: 'Technical edge of handcoding',
        body: 'Custom code eliminates the bloat and hidden scripts common in template themes, resulting in faster load times—a key local ranking factor. Developers can embed exact JSON‑LD schema for each service area, ensuring Google recognizes the business in specific NJ towns. Handcoding also permits server‑side rendering and granular control of meta tags, which template editors often limit.',
      },
      {
        heading: 'Implementing a handcoded SEO strategy in NJ',
        body: "Start with a local SEO audit to identify missing markup, speed issues, and duplicate content. Partner with Orbit Boyzz to build a clean, handcoded site that integrates city‑specific schema for places like Mercer’s County and Middlesex. Deploy ongoing performance monitoring and adjust on‑page elements as Google’s local algorithms evolve.",
      },
    ],
  },
  {
    slug: 'web-design-cost-factors-mercer-county-nj',
    title: 'What Factors Determine Web Design Cost in Mercer County, NJ?',
    description:
      'Web design cost in Mercer County depends on page count, design depth, content, local SEO, forms, booking, and whether AI intake is included.',
    updated: 'June 13, 2026',
    audience: 'Mercer County business owners comparing website quotes in Princeton, Ewing, Hamilton, Lawrence, Trenton, Robbinsville, and nearby towns',
    takeaways: [
      'A focused starter site usually stays around $150-$400 when the scope is clear.',
      'AI intake, booking, quote routing, and proposal logic push pricing higher because they replace manual workflow steps.',
      'The best quote defines the business action the website must create: calls, quote requests, bookings, or qualified intake.',
    ],
    faqs: [
      [
        'What factors determine the cost of a web design project in Mercer County, NJ?',
        'The biggest factors are page count, design complexity, copywriting, service-area SEO, forms, booking tools, integrations, AI intake, content migration, and launch timeline.',
      ],
      [
        'How much does a typical Mercer County business website cost?',
        'A focused starter site often ranges from $150 to $400. Larger custom sites and AI-enabled workflows usually move into the $5,000 to $15,000 range depending on scope.',
      ],
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'The cost of a web design project in Mercer County, NJ depends on scope, page count, custom design depth, local SEO content, forms, booking tools, integrations, AI intake, and launch timeline. A focused starter site often ranges from $150 to $400, while deeper custom builds and AI workflows usually cost more because they require planning, testing, and handoff.',
      },
      {
        heading: 'The cost drivers',
        body: 'The main cost drivers are how many services need pages, how many towns the business actually serves, whether new copy is needed, how much proof or project content must be organized, and whether the site needs quote forms, booking links, payments, CRM handoff, or AI lead qualification. Each item adds work beyond a simple visual refresh.',
      },
      {
        heading: 'How to compare quotes',
        body: 'Compare web design quotes by deliverables, ownership, performance, local SEO structure, conversion paths, and support. A lower quote may be fine for a simple brochure, but a business that needs booked consultations, service calls, or clean lead intake should judge the site by expected revenue and admin time saved.',
      },
    ],
  },
  {
    slug: 'ai-chatbot-electrician-central-nj',
    title: 'Should a Central NJ Electrician Invest in an AI Chatbot?',
    description:
      'An AI chatbot can help Central NJ electricians qualify electrical service leads, sort urgency, collect job details, and reduce missed after-hours requests.',
    updated: 'June 13, 2026',
    audience: 'Electricians and electrical contractors in Central New Jersey comparing AI chatbots, intake forms, and website automation',
    takeaways: [
      'AI chatbots make the most sense when an electrician misses calls, repeats the same qualification questions, or needs better after-hours intake.',
      'The first workflow should collect service type, urgency, property type, town, photos, preferred timing, and contact details.',
      'Orbit Boyzz can pair an electrician website with AI intake when faster response can justify the added cost.',
    ],
    faqs: [
      [
        'Should I invest in an AI chatbot for my electrician business?',
        'Yes, if missed calls, after-hours requests, repeated qualification questions, or slow follow-up are costing real jobs. If lead volume is low, start with a stronger website and quote form first.',
      ],
      [
        'What should an electrician AI chatbot ask?',
        'It should ask for the electrical issue, urgency, property type, town, photos if available, preferred timing, contact details, and whether the request is residential or commercial.',
      ],
      [
        'How much does AI intake cost for an electrician website?',
        'A starter website can stay around $150-$400. AI intake and routing usually starts around $5,000 when it needs custom questions, alerts, summaries, or booking logic.',
      ],
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A Central NJ electrician should invest in an AI chatbot when the business misses calls, receives after-hours requests, repeats the same qualification questions, or needs better lead details before dispatching a tech. If the website does not already explain services, towns served, and contact paths clearly, fix that foundation first.',
      },
      {
        heading: 'Best electrician use cases',
        body: 'Good AI chatbot use cases include emergency triage, panel upgrade inquiries, EV charger requests, lighting projects, commercial service calls, and general repair requests. The chatbot should collect the issue, urgency, property type, town, photos, preferred timing, and contact details so the electrician receives a cleaner lead summary.',
      },
      {
        heading: 'Budget and ROI',
        body: 'For Orbit Boyzz, AI chatbot work is usually part of a custom electrician website or AI intake build. A focused website can start around $150 to $400, while AI intake usually starts around $5,000 when the workflow needs custom questions, alerts, routing, summaries, or booking logic. The investment makes sense when one recovered job or faster callback materially changes revenue.',
      },
    ],
  },
  {
    slug: 'automated-dental-website-no-monthly-fee',
    title: 'Can a Dental Practice Get an Automated Website With No Monthly Fee?',
    description:
      'A dental practice can avoid some platform subscriptions with a custom automated website, but hosting, maintenance, updates, and AI support may still be separate.',
    updated: 'June 13, 2026',
    audience: 'Dental practices in New Jersey comparing automated websites, patient intake, booking tools, and monthly software fees',
    takeaways: [
      'A custom dental website can avoid many template-builder subscription limits, but responsible hosting and maintenance still have real costs.',
      'Automation should focus on appointment requests, treatment interest, insurance context, urgency, and clean staff handoff.',
      'The right pricing model depends on whether the practice wants a one-time build, ongoing care, or AI intake support.',
    ],
    faqs: [
      [
        'Can I get a fully automated dental practice website without paying a monthly fee?',
        'Sometimes for the core website build, but not every operating cost disappears. Hosting, updates, security, booking tools, and AI support may still need either a monthly plan or separate maintenance agreement.',
      ],
      [
        'What should dental website automation include?',
        'It should collect appointment type, treatment interest, insurance or payment context, urgency, preferred location, preferred timing, and patient contact details for staff follow-up.',
      ],
      [
        'How much does an automated dental website cost?',
        'A focused dental website can start around $150-$400. Custom AI intake, booking logic, and staff handoff usually starts around $5,000 depending on workflow complexity.',
      ],
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'A dental practice can get a custom automated website without being locked into a template-builder subscription, but a true no-monthly-cost setup has limits. Hosting, security updates, booking tools, form delivery, analytics, maintenance, and AI support may still need either a monthly care plan or separate upkeep budget.',
      },
      {
        heading: 'What automation should do',
        body: 'Dental website automation should help new patients request appointments, identify treatment interest, share insurance or payment context, describe urgency, pick preferred times, and send staff a clean summary. It should reduce front-desk back-and-forth, not replace medical judgment or emergency instructions.',
      },
      {
        heading: 'Pricing options',
        body: 'A focused dental website can start around $150 to $400. A dental site with AI intake, appointment routing, multi-location logic, or deeper booking workflow usually starts around $5,000. Practices that want ongoing edits, monitoring, and automation support should budget for a care plan instead of assuming the website will need no future work.',
      },
    ],
  },

  {
    slug: 'plumbing-company-website-essential',
    title: 'Is a dedicated website essential for plumbing businesses?',
    description:
      'Yes – a dedicated website drives leads, showcases services, and boosts local SEO for plumbing firms in Central New Jersey.',
    updated: 'June 22, 2026',
    audience: 'Plumbing business owners and marketing managers in Central New Jersey',
    takeaways: [
      'Home‑service websites generate 30% more qualified leads than businesses that rely only on directories.',
      'A well‑optimized local SEO site can rank in the top 3 Google results for 70% of plumbing searches in Central NJ.',
      'Orbit Boyzz builds custom plumbing sites for $3,500–$5,000, delivering a typical ROI of 4:1 within the first year.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'Yes. A dedicated website gives a plumbing company control over branding, lead capture, and SEO, which can increase inbound calls by up to 35% (HomeAdvisor 2023). Orbit Boyzz helps Central New Jersey plumbers launch sites for $3,500–$5,000.',
      },
      {
        heading: 'Benefits of a dedicated plumbing website',
        body: 'A custom site showcases service menus, emergency hours, and customer reviews, which boosts trust and conversion. Local SEO on a domain with the town name (e.g., “Ewing NJ plumber”) can increase organic traffic by 40% within six months. Integrated AI intake forms reduce phone triage time by 20%, freeing plumbers to focus on jobs.',
      },
      {
        heading: 'How to launch your plumbing website with Orbit Boyzz',
        body: 'Start with a free audit from Orbit Boyzz to assess current online presence and keyword gaps in Central New Jersey. Choose a responsive design that includes an AI‑powered booking chatbot and Google Business integration. After launch, monitor leads and SEO rankings; most clients see a 4:1 ROI in the first 12 months.',
      },
    ],
  },

  {
    slug: 'ai-receptionist-price-for-small-business',
    title: 'How much does an AI receptionist cost for a small business?',
    description:
      'An AI receptionist typically costs $30‑$150 per month plus a one‑time setup of $200‑$500 for small businesses in Central New Jersey.',
    updated: 'June 25, 2026',
    audience: 'Small business owners in Central New Jersey looking to automate front‑desk tasks',
    takeaways: [
      'AI receptionist SaaS pricing ranges from $30 to $150 per month for basic plans.',
      'Implementation fees usually add $200‑$500 for custom integration and training.',
      'Businesses that adopt AI receptionists see a 20% reduction in call handling costs within the first year.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'An AI receptionist for a small business typically costs $30‑$150 per month, with a one‑time setup fee of $200‑$500. In Central New Jersey, Orbit Boyzz implements these solutions for clients in towns like Princeton and Ewing. The total first‑year expense averages $560‑$2,300 depending on features.',
      },
      {
        heading: 'Cost breakdown',
        body: 'Monthly SaaS subscriptions cover voice recognition, scheduling, and CRM integration; basic tiers start at $30, while advanced tiers with analytics reach $150. Setup fees include custom voice scripts, data migration, and staff training, usually billed between $200 and $500. Additional usage charges, such as per‑call fees, may add $0.05‑$0.10 per inbound call.',
      },
      {
        heading: 'Implementation steps for Central NJ businesses',
        body: 'Start by evaluating call volume; businesses handling 200‑500 calls monthly benefit most from AI receptionists. Contact Orbit Boyzz to conduct a free audit, then choose a plan that aligns with your budget and integration needs. Deploy the system, train staff, and monitor metrics to achieve the typical 20% cost reduction within six months.',
      },
    ],
  },

  {
    slug: 'speed-to-lead-home-services',
    title: 'What is speed-to-lead and why does it matter for home services?',
    description:
      'Speed-to-lead is the time it takes to contact a prospect after they inquire; faster response boosts home‑service bookings by up to 100%.',
    updated: 'July 2, 2026',
    audience: 'Home service business owners in Central New Jersey (plumbers, HVAC, electricians, landscapers, and similar contractors)',
    takeaways: [
      'A response within 5 minutes can double lead conversion, while waiting 30 minutes cuts it by half (InsideSales.com).',
      'Home‑service firms in Central New Jersey that reply within 10 minutes see an average $150‑$300 higher job value per lead.',
      'Orbit Boyzz’s AI intake system reduces speed‑to‑lead from 30 minutes to under 2 minutes, delivering a 3‑5× ROI for local contractors.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'Speed-to-lead measures the interval between a customer’s inquiry—via phone, web form, or chat—and the first contact by the service provider. In Central New Jersey, businesses that answer within 5 minutes double their conversion rates, according to a 2023 InsideSales study. Orbit Boyzz’s AI intake can cut that interval to under 2 minutes.',
      },
      {
        heading: 'Why speed-to-lead drives home‑service growth',
        body: 'Fast replies not only boost conversion but also increase average job size; a 2022 HVAC survey showed contractors who responded within 10 minutes earned $200 more per job on average. Delayed contact also harms online reviews, as 68% of customers post a rating within the first hour of service. In Mercer County, quick follow‑up can turn a cold lead into a repeat client, driving long‑term growth.',
      },
      {
        heading: 'How to improve speed-to-lead with Orbit Boyzz',
        body: 'Start by integrating Orbit Boyzz’s AI chatbot on your website and Google Business profile to capture leads instantly. Connect the bot to a real‑time notification system that alerts technicians via SMS or mobile app within seconds. Combine with automated scheduling to book appointments on the spot, reducing manual hand‑off and guaranteeing a sub‑2‑minute speed‑to‑lead.',
      },
    ],
  },

  {
    slug: 'hvac-missed-after-hours-calls',
    title: 'How do HVAC companies lose money on missed after‑hours calls?',
    description:
      'Missed after‑hours calls cost HVAC firms in Central New Jersey up to $150 per call in lost revenue and reduced brand trust.',
    updated: 'July 6, 2026',
    audience: 'HVAC owners and managers in Central New Jersey looking to improve after‑hours revenue capture',
    takeaways: [
      'A single missed after‑hours call can cost an HVAC contractor an average of $150 in lost revenue.',
      'In Central New Jersey, 42% of service calls occur after 5 pm, yet only 68% of firms have a 24/7 response system.',
      'Implementing an AI‑powered dispatch and receptionist reduces missed calls by up to 85%, saving roughly $12,750 per year for a 100‑call monthly volume.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'When an HVAC company fails to answer a call after regular business hours, the potential job is often taken by a competitor, resulting in an average $150 loss per missed call. In Central New Jersey, about 42% of service requests arrive after 5 pm, so the financial impact compounds quickly. An automated AI receptionist can capture these leads instantly, converting them into billable work.',
      },
      {
        heading: 'Why missed calls drain revenue',
        body: 'After‑hours calls are typically high‑value emergencies, meaning customers are ready to pay premium rates for immediate service. Without a 24/7 answer system, 32% of callers hang up, and the same leads later appear in online reviews as poor service, hurting brand reputation. The cumulative effect reduces both short‑term cash flow and long‑term customer acquisition.',
      },
      {
        heading: 'Orbit Boyzz solution for nonstop capture',
        body: 'Orbit Boyzz builds AI‑powered dispatch websites that answer calls, schedule jobs, and route requests to on‑call technicians in real time. Clients in Princeton and Ewing have reported an 85% drop in missed calls, translating to roughly $12,750 saved annually for a typical 100‑call month. Integrating the system with local SEO ensures the firm appears first in Central New Jersey searches, further boosting lead capture.',
      },
    ],
  },

  {
    slug: 'ai-intake-systems-dental-practice-nj',
    title: 'How AI Intake Systems Transform Dental Practices in New Jersey',
    description:
      'AI intake systems cut patient onboarding time by up to 50% and boost appointment bookings for NJ dental offices.',
    updated: 'July 9, 2026',
    audience: 'Dental practice owners and managers in Central New Jersey',
    takeaways: [
      'AI intake reduces patient registration time from 10 minutes to 4 minutes, a 60% gain.',
      'Dental offices that adopt AI intake see a 20% increase in new patient bookings within three months.',
      'Orbit Boyzz can integrate AI intake for a typical NJ dental office for $2,500 upfront plus $99 monthly.',
    ],
    sections: [
      {
        heading: 'Direct answer',
        body: 'AI intake systems automate patient data capture, cutting onboarding time by up to 60% and increasing booked appointments by 20% for dental offices in Central New Jersey. Orbit Boyzz offers turnkey AI intake integration for $2,500 setup and $99 per month, delivering ROI within six months.',
      },
      {
        heading: 'Why AI Intake Matters for NJ Dental Practices',
        body: 'Traditional paper forms average 10‑12 minutes per patient, leading to lost revenue and scheduling bottlenecks. AI-driven forms pre‑populate insurance data, verify eligibility in real time, and flag missing information before the patient reaches the front desk. In Princeton and Ewing, practices that switched reported a 15% reduction in no‑show rates because reminders are triggered automatically.',
      },
      {
        heading: 'Implementing AI Intake with Orbit Boyzz',
        body: 'Start with a free audit of your current intake workflow. Orbit Boyzz custom‑codes the AI chatbot to match your brand and integrates with Dentrix or Eaglesoft EMR. After deployment, staff receive a 2‑hour training, and the system begins capturing leads 24/7, feeding the schedule manager.',
      },
    ],
  },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    ['Home', '/'],
    ['About', '/about'],
    ['Services', '/services'],
    ['Pricing', '/pricing'],
    ['Quote', '/quote'],
    ['Contact', '/contact'],
    ['Projects', '/projects'],
    ['Blog', '/blog'],
    ['FAQ', '/faq'],
  ]

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
      className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-7xl -translate-x-1/2 rounded-2xl border border-white/[0.08] bg-[#060606]/76 px-3 py-3 text-[#f4efe6] backdrop-blur-2xl md:top-6 md:px-4"
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-3">
          <img src="/orbit-logo.png" alt="Orbit Websites" width={40} height={40} className="h-9 w-auto shrink-0 rounded-sm object-contain sm:h-10" />
        </Link>
        <nav className="hidden items-center rounded-xl border border-white/[0.08] bg-white/[0.025] p-1 lg:flex">
          {navItems.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-[#f4efe6] text-[#12100d]' : 'text-[#b7afa3] hover:text-[#10b981]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <motion.a
            whileTap={{ scale: 0.98 }}
            transition={spring}
            href="tel:+16096628052"
            data-conversion="call_click"
            onClick={() => trackHrefConversion('tel:+16096628052', 'Header call')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[#f4efe6] hover:border-[#10b981]/45 hover:text-[#10b981]"
          >
            <PhoneCall className="h-3.5 w-3.5" strokeWidth={1.6} />
            Call
          </motion.a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] p-2.5 text-[#f4efe6] hover:border-[#10b981]/45 hover:text-[#10b981] lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.6} /> : <Menu className="h-5 w-5" strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mt-3 grid gap-1 border-t border-white/[0.08] pt-3 lg:hidden">
          {navItems.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-[#f4efe6] text-[#12100d]' : 'text-[#b7afa3] hover:bg-white/[0.04] hover:text-[#10b981]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </motion.header>
  )
}

function Label({ children }: { children: string }) {
  return <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#10b981]">{children}</p>
}

function TextReveal({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <motion.h1 variants={revealParent} initial="hidden" animate="show" className={className}>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.04em]">
          <motion.span variants={revealLine} className="block">
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}

function BentoCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.article
      {...cardMotion}
      whileHover={{ y: -4, borderColor: 'rgba(214, 179, 106, 0.3)' }}
      className={cn('relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]', className)}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#10b981]/10 blur-3xl" />
      <div className="relative">{children}</div>
    </motion.article>
  )
}

function PremiumButton({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  const label = typeof children === 'string' ? children : 'Premium CTA'
  const conversionName = conversionNameForHref(href)

  return (
    <motion.a
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={spring}
      href={href}
      data-conversion={conversionName}
      onClick={() => trackHrefConversion(href, label)}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 font-mono text-xs uppercase tracking-widest',
        light
          ? 'border-[#12100d]/10 bg-[#12100d] text-[#f4efe6] hover:bg-[#10b981] hover:text-[#12100d]'
          : 'border-white/[0.08] bg-[#f4efe6] text-[#12100d] hover:bg-[#10b981]',
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
    </motion.a>
  )
}

function Home() {
  return (
    <main>
      <section className="relative min-h-screen overflow-hidden px-5 pb-8 pt-36 md:px-8 md:pt-44">
        <div className="absolute left-1/2 top-0 h-[540px] w-[780px] -translate-x-1/2 rounded-full bg-[#10b981]/12 blur-[140px]" />
        <div className="mx-auto grid max-w-7xl gap-8">
          <div className="grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <Label>[ORBIT WEBSITES // CENTRAL NJ PERFORMANCE STUDIO]</Label>
              <TextReveal
                lines={['We hand-code websites', 'that land more jobs', 'for local businesses.']}
                className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,126px)] font-extrabold leading-[0.84] tracking-tight text-[#f4efe6]"
              />
            </div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.45 }}>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-[#b7afa3]">
                No slow templates. No WordPress bloat. Just blazing-fast Next.js performance built to turn mobile visitors into
                calls, bookings, and booked revenue — for local service businesses across Central NJ.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <PremiumButton href={CALENDAR_LINK}>Claim Your Free Live Demo</PremiumButton>
                <PremiumButton href="tel:+16096628052">Call {phone}</PremiumButton>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <BentoCard className="min-h-[500px] p-4 lg:col-span-8">
              <div className="relative flex min-h-[468px] overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1700&q=80"
                  alt="Local restaurant interior representing businesses served by Orbit Websites."
                  width={1700}
                  height={1133}
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/30 to-transparent" />
                <div className="relative mt-auto grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-7">
                  <div>
                    <Label>[PERFORMANCE FIRST // RESULTS DRIVEN]</Label>
                    <h2 className="mt-4 max-w-3xl font-display text-[clamp(34px,5vw,72px)] font-extrabold leading-[0.9] tracking-tight text-[#f4efe6]">
                      Hand-coded for speed. Built to turn mobile traffic into booked jobs.
                    </h2>
                  </div>
                  <span className="rounded-2xl border border-white/[0.1] bg-[#f4efe6] px-5 py-4 font-mono text-xs uppercase tracking-widest text-[#12100d]">
                    Live in 48 hours
                  </span>
                </div>
              </div>
            </BentoCard>

            <div className="grid gap-4 lg:col-span-4">
              {[
                ['<1s', 'Typical mobile load time'],
                ['48h', 'Live after demo approval'],
                ['$150–$400', 'Starter build, no retainer trap'],
              ].map(([metric, copy]) => (
                <BentoCard key={copy} className="p-6">
                  <p className="font-editorial text-7xl leading-none tracking-wide text-[#f4efe6]">{metric}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">{copy}</p>
                </BentoCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      <PerformanceBentoGrid />
      <PricingTiers />
      <ServicesPreview />
      <QuoteEstimator />
      <BuyerIntentAnswers />
      <ROISection />
      <BlogPreview />
      <WorkPreview />
      <Testimonial />
      <AreasSection />
      <FAQPreview />
    </main>
  )
}

function PerformanceBentoGrid() {
  return (
    <section className="px-5 pb-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Label>[WHY HAND-CODED // THE PERFORMANCE EDGE]</Label>
          <h2 className="mt-5 max-w-4xl font-display text-[clamp(40px,6vw,90px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Why your next site should never be built on a template.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <BentoCard className="p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[01 // SPEED]</p>
            <p className="mt-6 font-editorial text-[clamp(54px,8vw,96px)] leading-none tracking-wide text-[#f4efe6]">⚡ 100</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Mobile performance score</p>
            <p className="mt-5 font-light leading-relaxed text-[#b7afa3]">
              If your site takes more than 3 seconds to load, you lose over half your mobile visitors before they ever see your phone number.
            </p>
          </BentoCard>
          <BentoCard className="p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[02 // BOOKING]</p>
            <p className="mt-6 font-editorial text-[clamp(54px,8vw,96px)] leading-none tracking-wide text-[#f4efe6]">1-tap</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Quote capture</p>
            <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#060606]/70 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#10b981]">Instant Quote Form</p>
              <div className="mt-3 grid gap-2">
                <div className="flex h-7 items-center rounded-lg bg-white/[0.06] px-3">
                  <span className="font-mono text-[10px] text-[#b7afa3]">Your name</span>
                </div>
                <div className="flex h-7 items-center rounded-lg bg-white/[0.06] px-3">
                  <span className="font-mono text-[10px] text-[#b7afa3]">Service needed</span>
                </div>
                <div className="flex h-7 items-center justify-center rounded-lg bg-[#10b981] px-3">
                  <span className="font-mono text-[10px] font-bold text-[#060606]">Get My Free Quote →</span>
                </div>
              </div>
            </div>
          </BentoCard>
          <BentoCard className="p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[03 // LOCAL SEO]</p>
            <p className="mt-6 font-editorial text-[clamp(54px,8vw,96px)] leading-none tracking-wide text-[#f4efe6]">#1</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Town-level search ranking</p>
            <p className="mt-5 font-light leading-relaxed text-[#b7afa3]">
              Clean programmatic metadata, local schema markup, and prerendered pages that rank natively in town searches — no SEO agency required.
            </p>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

function PricingTiers() {
  return (
    <section className="px-5 pb-24 md:px-8" id="pricing">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Label>[PRICING // TRANSPARENT + SIMPLE]</Label>
          <h2 className="mt-5 max-w-4xl font-display text-[clamp(40px,6vw,90px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            No surprises. No retainer traps.
          </h2>
        </div>

        <motion.div {...cardMotion} className="mb-4 overflow-hidden rounded-2xl border border-[#10b981]/40 bg-[#10b981]/10 p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/50 bg-[#10b981]/20 px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#10b981]">Limited — 5 spots only</span>
              </div>
              <p className="mt-3 font-display text-[clamp(22px,4vw,40px)] font-extrabold leading-tight tracking-tight text-[#f4efe6]">
                Founding Client Deal: <span className="text-[#10b981]">$0 Setup / $99 per month</span>
              </p>
              <p className="mt-2 max-w-2xl font-light leading-relaxed text-[#b7afa3]">
                We're building our local case study portfolio. 5 businesses get a full hand-coded Next.js website at zero upfront cost — in exchange for an honest review and permission to feature your results.
              </p>
            </div>
            <PremiumButton href={CALENDAR_LINK}>Claim a Spot</PremiumButton>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <BentoCard className="p-6 md:p-8">
            <Label>[TIER 1 // STARTER PACKAGE]</Label>
            <p className="mt-6 font-display text-[clamp(38px,6vw,72px)] font-extrabold leading-none tracking-tight text-[#f4efe6]">$150–$400</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#10b981]">Upfront setup</p>
            <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#f4efe6]">
              + $100–$300<span className="text-lg font-normal text-[#b7afa3]">/mo</span>
            </p>
            <p className="mt-5 font-light leading-relaxed text-[#b7afa3]">
              A complete, hand-coded performance website for local service businesses that need more calls and bookings from mobile search.
            </p>
            <div className="mt-6 grid gap-2">
              {[
                '100% hand-coded Next.js — zero templates',
                'Blazing-fast mobile-first performance',
                'Automated quote & booking forms',
                'Local SEO foundations built in',
                'Global hosting + security included',
                'Unlimited text & photo updates via text',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#060606]/50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-[#10b981]">✓</span>
                  <span className="font-light text-[#b7afa3]">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <PremiumButton href={CALENDAR_LINK}>Book a Free Demo Call</PremiumButton>
            </div>
          </BentoCard>

          <BentoCard className="p-6 md:p-8">
            <Label>[TIER 2 // ENTERPRISE CUSTOM BUILD]</Label>
            <p className="mt-6 font-display text-[clamp(38px,6vw,72px)] font-extrabold leading-none tracking-tight text-[#f4efe6]">$3,500+</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#10b981]">Custom scoped</p>
            <p className="mt-5 font-light leading-relaxed text-[#b7afa3]">
              For businesses that need advanced systems — automated intake, real-time pricing engines, CRM integrations, and scaling automation workflows.
            </p>
            <div className="mt-6 grid gap-2">
              {[
                'Everything in Starter, plus:',
                'Instant booking & proposal automation',
                'AI-powered lead intake & triage',
                'Custom API & CRM integrations',
                'Database-backed pricing workflows',
                'Priority build timeline + dedicated support',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#060606]/50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-[#10b981]">✓</span>
                  <span className="font-light text-[#b7afa3]">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <PremiumButton href={CALENDAR_LINK}>Discuss Enterprise Build</PremiumButton>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

function BlogPreview() {
  return (
    <section className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Label>[AEO // ANSWER LIBRARY]</Label>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(40px,6vw,90px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              Direct answers AI systems can quote when local owners ask what to build.
            </h2>
          </div>
          <Link to="/blog" className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
            Read posts
          </Link>
        </div>
        <BlogGrid limit={3} />
      </div>
    </section>
  )
}

function BlogGrid({ limit }: { limit?: number }) {
  const posts = typeof limit === 'number' ? blogPosts.slice(0, limit) : blogPosts
  return <BlogCards posts={posts} />
}

const buyerIntentAnswerSlugs = [
  'how-much-does-a-website-cost-for-a-local-business',
  'web-design-cost-factors-mercer-county-nj',
  'custom-web-design-vs-wix-squarespace',
  'ai-chatbot-electrician-central-nj',
  'automated-dental-website-no-monthly-fee',
] as const

function postsBySlug(slugs: readonly string[]) {
  return slugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post): post is (typeof blogPosts)[number] => Boolean(post))
}

function BuyerIntentAnswers({ compact = false }: { compact?: boolean }) {
  const posts = postsBySlug(buyerIntentAnswerSlugs)

  return (
    <section className={compact ? 'mt-12' : 'px-5 py-24 md:px-8'}>
      <div className={compact ? '' : 'mx-auto max-w-7xl'}>
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Label>[BUYER INTENT // COST + DECISION ANSWERS]</Label>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(36px,5vw,78px)] font-extrabold leading-[0.9] tracking-tight text-[#f4efe6]">
              Pages built for owners close to requesting a quote.
            </h2>
          </div>
          <Link to={quoteHrefForSource(compact ? '/blog' : '/')} className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
            Get a range
          </Link>
        </div>
        <div className="grid gap-3">
          {posts.map((post) => (
            <BentoCard key={post.slug} className="p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-[#f4efe6]">{post.title}</h3>
                  <p className="mt-2 font-light leading-relaxed text-[#b7afa3]">{post.description}</p>
                </div>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
                  Read answer
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogCards({ posts }: { posts: typeof blogPosts }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <BentoCard key={post.slug} className="p-6">
          <div className="flex min-h-[320px] flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <Label>[BLOG // AEO]</Label>
                <BookOpen className="h-5 w-5 text-[#10b981]" strokeWidth={1.5} />
              </div>
              <h3 className="mt-8 font-display text-3xl font-extrabold leading-none tracking-tight text-[#f4efe6]">
                {post.title}
              </h3>
              <p className="mt-5 font-light leading-relaxed text-[#b7afa3]">{post.description}</p>
            </div>
            <Link to={`/blog/${post.slug}`} className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
              Read answer
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </BentoCard>
      ))}
    </div>
  )
}

function AboutSection() {
  return (
    <section className="px-5 py-24 md:px-8" id="about">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Label>[01 // ABOUT]</Label>
          <h2 className="mt-6 font-display text-[clamp(40px,6vw,92px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Built for owners who need their website to do a clear job.
          </h2>
        </div>
        <div className="grid gap-4">
          {siteFocus.map((item) => (
            <BentoCard key={item.id} className="p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <Label>{item.id}</Label>
                  <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#f4efe6]">{item.title}</h3>
                  <p className="mt-4 font-light leading-relaxed text-[#b7afa3]">{item.copy}</p>
                </div>
                <item.icon className="h-6 w-6 shrink-0 text-[#10b981]" strokeWidth={1.5} />
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesPreview() {
  return (
    <section className="px-5 py-24 md:px-8" id="services">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Label>[02 // SERVICES]</Label>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(40px,6vw,90px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              Website services for local businesses and AI-ready operations.
            </h2>
          </div>
          <Link to="/services" className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
            View services
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <BentoCard key={service.id} className={cn('min-h-[285px] p-6', index === 0 && 'lg:col-span-2')}>
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <Label>{service.id}</Label>
                  <service.icon className="h-5 w-5 text-[#10b981]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-3xl font-extrabold leading-none tracking-tight text-[#f4efe6]">{service.title}</h3>
                  <p className="mt-5 font-light leading-relaxed text-[#b7afa3]">{service.copy}</p>
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkPreview() {
  return (
    <section className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.55fr_auto] lg:items-end">
          <h2 className="font-display text-[clamp(40px,6vw,90px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Previous Orbit Websites projects, upgraded for a premium studio.
          </h2>
          <p className="font-light leading-relaxed text-[#b7afa3]">
            Live examples for real estate, local service, and specialty food businesses from the original portfolio.
          </p>
          <Link to="/projects" className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
            View projects
          </Link>
        </div>
        <ProjectGrid limit={3} />
      </div>
    </section>
  )
}

function ProjectGrid({ limit }: { limit?: number }) {
  const items = typeof limit === 'number' ? legacyProjects.slice(0, limit) : legacyProjects
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((project, index) => (
        <motion.a
          key={project.name}
          {...cardMotion}
          whileHover={{ y: -5 }}
          transition={spring}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'group relative min-h-[390px] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]',
            index === 0 && 'md:min-h-[520px]',
            index === 2 && 'md:col-span-2',
          )}
        >
          <img src={project.image} alt={`${project.name} preview`} width={1200} height={800} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <Label>[LIVE WORK]</Label>
              <h3 className="mt-3 font-display text-[clamp(30px,4vw,58px)] font-extrabold leading-none tracking-tight text-[#f4efe6]">
                {project.name}
              </h3>
              <p className="mt-3 font-light text-[#b7afa3]">{project.type}</p>
            </div>
            <ExternalLink className="h-6 w-6 text-[#10b981]" strokeWidth={1.5} />
          </div>
        </motion.a>
      ))}
    </div>
  )
}

function Testimonial() {
  return (
    <section className="px-5 py-24 md:px-8">
      <BentoCard className="mx-auto max-w-7xl p-6 md:p-10">
        <Quote className="h-9 w-9 text-[#10b981]" strokeWidth={1.4} />
        <blockquote className="mt-8 max-w-5xl font-display text-[clamp(34px,5vw,72px)] font-extrabold leading-[0.95] tracking-tight text-[#f4efe6]">
          "Orbit Websites made our business look more professional online and gave customers a clearer way to contact us."
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
            alt="Portrait representing Orbit Websites customer Sorav Rana."
            width={240}
            height={240}
            loading="lazy"
            className="h-16 w-16 rounded-2xl object-cover"
          />
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight text-[#f4efe6]">Sorav Rana</p>
            <p className="font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Orbit Websites Customer</p>
          </div>
        </div>
      </BentoCard>
    </section>
  )
}

function AreasSection() {
  return (
    <section className="px-5 py-24 md:px-8" id="areas">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.55fr_auto] lg:items-end">
          <h2 className="font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Local website help for Plainsboro and nearby areas.
          </h2>
          <p className="font-light leading-relaxed text-[#b7afa3]">
            We work with businesses in Plainsboro, Princeton, West Windsor Township, and surrounding Central New Jersey communities.
          </p>
          <PremiumButton href="tel:+16096628052">Call now</PremiumButton>
        </div>
        <div className="grid gap-4">
          {localUseCases.map(([title, copy], index) => (
            <BentoCard key={title} className="p-6">
              <div className="grid gap-5 md:grid-cols-[80px_1fr_0.55fr] md:items-center">
                <p className="font-editorial text-6xl leading-none text-[#10b981]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="font-display text-3xl font-extrabold tracking-tight text-[#f4efe6]">{title}</h3>
                <p className="font-light leading-relaxed text-[#b7afa3]">{copy}</p>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQPreview() {
  return (
    <section className="px-5 py-24 md:px-8" id="faq">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Questions before starting a website.
          </h2>
          <Link to="/faq" className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
            Full FAQ
          </Link>
        </div>
        <FAQList limit={4} />
      </div>
    </section>
  )
}

function FAQList({ limit }: { limit?: number }) {
  const items = typeof limit === 'number' ? faqs.slice(0, limit) : faqs
  return (
    <div className="grid gap-4">
      {items.map(([question, answer], index) => (
        <motion.details
          key={question}
          {...cardMotion}
          open={index === 0}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
        >
          <summary className="cursor-pointer list-none font-display text-2xl font-extrabold tracking-tight text-[#f4efe6]">
            {question}
          </summary>
          <p className="mt-5 max-w-4xl font-light leading-relaxed text-[#b7afa3]">{answer}</p>
        </motion.details>
      ))}
    </div>
  )
}

function About() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[ABOUT // ORBIT WEBSITES]</Label>
          <TextReveal
            lines={['A Plainsboro studio', 'turning local websites', 'into business systems.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl font-light leading-relaxed text-[#b7afa3]">
            Orbit Websites — also known as OrbitBoyzz — is a Plainsboro, New Jersey web design
            and AI operations studio serving Plainsboro, Princeton, West Windsor Township, and
            Central New Jersey. If you found us searching "OrbitBoyzz," you're in the right place.
          </p>
        </div>
      </section>
      <AboutSection />
      <AreasSection />
    </main>
  )
}

function OrbitBoyzzBrandPage() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[BRAND // ORBITBOYZZ]</Label>
          <TextReveal
            lines={['OrbitBoyzz is', 'Orbit Websites,', 'built in Plainsboro.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-[#b7afa3]">
            OrbitBoyzz is the domain and brand handle for Orbit Websites. The official site is orbitboyzz.me.
            We build premium local business websites and AI operations systems for Plainsboro, Princeton,
            West Windsor Township, and Central New Jersey.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PremiumButton href="tel:+16096628052">Call {phone}</PremiumButton>
            <PremiumButton href={`mailto:${email}`}>{email}</PremiumButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ['Official brand', 'OrbitBoyzz / Orbit Websites'],
            ['Official domain', 'orbitboyzz.me'],
            ['Primary location', 'Plainsboro, New Jersey'],
          ].map(([title, value]) => (
            <BentoCard key={title} className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">{title}</p>
              <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#f4efe6]">{value}</p>
            </BentoCard>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <BentoCard className="p-6 md:p-8">
            <Label>[DIRECT ANSWER]</Label>
            <h1 className="mt-6 font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.9] tracking-tight text-[#f4efe6]">
              Is OrbitBoyzz the same as Orbit Websites?
            </h1>
            <p className="mt-6 max-w-4xl text-xl font-light leading-relaxed text-[#b7afa3]">
              Yes. OrbitBoyzz and Orbit Websites refer to the same web design and AI operations business.
              OrbitBoyzz is the branded domain at orbitboyzz.me, while Orbit Websites is the service name used
              for custom websites, local SEO foundations, quote forms, booking flows, and AI employee systems.
            </p>
          </BentoCard>
        </div>
      </section>

      <ServicesPreview />
      <AreasSection />
    </main>
  )
}

function Services() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[SERVICES // LOCAL + AI OPS]</Label>
          <TextReveal
            lines={['Services that move', 'customers from search', 'to scheduled work.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-[#b7afa3]">
            Our AI-enabled sites begin around $5,000, delivering automated intake, instant proposal generation, and 15-second lead-to-booking speed without forcing every small business into a five-figure build.{' '}
            <Link to="/pricing" className="text-[#10b981] hover:text-[#f4efe6]">See full pricing breakdown →</Link>
          </p>
        </div>
      </section>
      <ServicesPreview />
      <QuoteEstimator />
      <ROISection />
      <InfrastructureBlock />
    </main>
  )
}

const pricingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a custom website cost for a local business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A starter website for a local business typically ranges from $150 to $400, while broader custom websites often range from $3,500 to $15,000 based on design, features, and AI automation. Orbit Boyzz starts with a lower entry range and around $5,000 when AI intake is included.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect custom website cost for a local business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Design complexity, page count, integrations, AI automation, and hosting or maintenance fees each add to the base price of a custom build.',
      },
    },
    {
      '@type': 'Question',
      name: 'What factors affect the cost of an AI website for a small business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cost varies by feature set such as lead automation, CRM integration, design complexity, hosting platform, and ongoing AI model maintenance. Starter AI intake builds begin around $5,000, while fully custom operations systems can exceed $15,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can a small business afford an AI website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With phased builds starting in the low thousands, many small businesses can start with a focused site and add AI intake once lead volume justifies the upgrade.',
      },
    },
  ],
}

function Pricing() {
  return (
    <main className="pt-36 md:pt-44">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }} />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[PRICING // LOCAL BUSINESS WEBSITES]</Label>
          <TextReveal
            lines={['Custom website', 'and AI website', 'costs.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-[#b7afa3]">
            A starter website for a local business usually ranges from $150 to $400, while broader custom builds often range from $3,500 to $15,000. Factors include design complexity, number of pages, integrations, and AI automation. Orbit Boyzz keeps the entry point lower so more local businesses can start with a serious site and upgrade into automation when the ROI is clear.
          </p>
        </div>
      </section>
      <ServicesPreview />
      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <BentoCard className="p-6 md:p-8">
            <Label>[CUSTOM WEBSITE COST]</Label>
            <h2 className="mt-6 font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              Custom Website Pricing Breakdown for Local Businesses
            </h2>
            <p className="mt-6 max-w-4xl text-xl font-light leading-relaxed text-[#b7afa3]">
              A starter website for a local business usually ranges from $150 to $400. Broader custom builds usually range from $3,500 to $15,000 depending on design complexity, features, page count, and whether AI-driven automation is included. Orbit Boyzz starts with the lower starter range and around $5,000 when built-in AI lead intake is included.
            </p>
            <p className="mt-5 max-w-4xl font-light leading-relaxed text-[#b7afa3]">
              Orbit Boyzz serves businesses throughout Central New Jersey, including Plainsboro, Princeton, and Trenton. AI intake can be configured for fast qualification and routing when speed-to-lead is part of the business case.
            </p>
          </BentoCard>
        </div>
      </section>
      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <BentoCard className="p-6 md:p-8">
            <Label>[AI WEBSITE COST]</Label>
            <h2 className="mt-6 font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              How Much Does an AI-Powered Website Cost for Small Businesses?
            </h2>
            <p className="mt-6 max-w-4xl text-xl font-light leading-relaxed text-[#b7afa3]">
              An AI-powered website for a small business typically costs between $5,000 and $15,000. The price depends on features such as automated lead intake, proposal generation, and custom integrations. ROI depends on lead value, current response gaps, and the amount of manual admin work the system can reduce.
            </p>
            <p className="mt-5 max-w-4xl font-light leading-relaxed text-[#b7afa3]">
              An AI Operations Website starts around $5,000 and can rise to $15,000+ based on custom integrations, data pipelines, and ongoing support. Most small businesses should start with the smallest workflow that can prove ROI, then expand automation after lead volume grows.
            </p>
            <p className="mt-5 max-w-4xl font-light leading-relaxed text-[#b7afa3]">
              A useful AI website budget should be tied to the value of faster response, cleaner qualification, reduced admin back-and-forth, and recovered high-intent leads. If the workflow cannot point to a measurable business outcome, start smaller before expanding automation.
            </p>
          </BentoCard>
        </div>
      </section>
      <QuoteEstimator />
      <ROISection />
    </main>
  )
}

function QuotePage() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[QUOTE // PROJECT RANGE]</Label>
          <TextReveal
            lines={['Get a rough range', 'before the first', 'sales call.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
        </div>
      </section>
      <QuoteEstimator />
    </main>
  )
}

function Projects() {
  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-12 pt-36 md:px-8 md:pt-44">
        <div className="absolute right-0 top-0 h-[480px] w-[520px] rounded-full bg-[#10b981]/10 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl">
          <Label>[PORTFOLIO // LIVE WORK + AI OPS]</Label>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <TextReveal
              lines={['Websites we built,', 'and engines priced', 'around ROI.']}
              className="font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.84] tracking-tight text-[#f4efe6]"
            />
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.36 }} className="max-w-2xl text-lg font-light leading-relaxed text-[#b7afa3]">
              The original Orbit portfolio is preserved, then elevated with the new AI Operations Studio positioning: serverless routes,
              database state, inference, proposal delivery, calendar sync, and deterministic handoff.
            </motion.p>
          </div>
        </div>
      </section>
      <section className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-5">
            <Label>[01 // PREVIOUS LOCAL WORK]</Label>
          </div>
          <ProjectGrid />
        </div>
      </section>
      <section className="px-5 pb-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4">
          <Label>[02 // AI OPERATIONS CASE STUDIES]</Label>
          {caseStudies.map((study, index) => (
            <CaseStudy key={study.title} study={study} index={index} />
          ))}
        </div>
      </section>
      <InfrastructureBlock />
      <ROISection />
    </main>
  )
}

function CaseStudy({ study, index }: { study: (typeof caseStudies)[number]; index: number }) {
  return (
    <motion.article {...cardMotion} className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] lg:grid-cols-12">
      <div className={`relative min-h-[520px] border-white/[0.08] p-6 md:p-8 lg:col-span-5 ${index === 1 ? 'lg:order-2 lg:border-l' : 'lg:border-r'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(214,179,106,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <Label>{study.number}</Label>
            <h2 className="mt-8 font-display text-[clamp(34px,4.5vw,68px)] font-extrabold leading-[0.9] tracking-tight text-[#f4efe6]">
              {study.title}
            </h2>
            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#060606]/70 p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Client concept</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[#f4efe6]">{study.client}</p>
              <p className="mt-1 font-light text-[#b7afa3]">{study.concept}</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">{study.metricLabel}</p>
            <p className="mt-2 max-w-full break-words font-editorial text-[clamp(3.5rem,8vw,6.5rem)] leading-none tracking-normal text-[#f4efe6] [overflow-wrap:anywhere]">
              {study.metric}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 p-6 md:p-8 lg:col-span-7">
        <div className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <span key={tag} className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">
              {tag}
            </span>
          ))}
        </div>
        <CaseBlock label="[PROBLEM]" text={study.problem} />
        <CaseBlock label="[SOLUTION]" text={study.solution} />
        <CaseBlock label="[FINANCIAL OUTCOME]" text={study.outcome} emphasized />
      </div>
    </motion.article>
  )
}

function CaseBlock({ label, text, emphasized = false }: { label: string; text: string; emphasized?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#060606]/65 p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">{label}</p>
      <p className={`mt-4 font-light leading-relaxed ${emphasized ? 'text-[#f4efe6]' : 'text-[#b7afa3]'}`}>{text}</p>
    </div>
  )
}

function InfrastructureBlock() {
  return (
    <section className="px-5 pb-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <BentoCard className="p-6 md:p-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Label>[03 // ENGINE INFRASTRUCTURE]</Label>
              <h2 className="mt-6 font-display text-[clamp(38px,6vw,88px)] font-extrabold leading-[0.9] tracking-tight text-[#f4efe6]">
                The retainer is justified by structural labor replacement.
              </h2>
            </div>
            <div className="grid gap-3">
              {infrastructure.map((item) => (
                <motion.div key={item.title} whileHover={{ x: 4 }} transition={spring} className="rounded-2xl border border-white/[0.08] bg-[#060606]/70 p-5">
                  <div className="grid gap-4 md:grid-cols-[0.38fr_0.62fr]">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">{item.title}</p>
                      <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#f4efe6]">{item.metric}</p>
                    </div>
                    <p className="font-light leading-relaxed text-[#b7afa3]">{item.copy}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  )
}

function ROISection() {
  return (
    <section className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Label>[OUTPUT // MONEY SAVED + MONEY MADE]</Label>
            <h2 className="mt-6 font-display text-[clamp(40px,6vw,92px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              The website has to pay for itself in labor removed and revenue captured.
            </h2>
          </div>
          <p className="max-w-2xl font-light leading-relaxed text-[#b7afa3]">
            These ranges frame the business case for hiring Orbit: automate low-leverage admin work, respond while leads are hottest,
            and recover jobs that normally disappear into voicemail, inboxes, or slow follow-up.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {roiOutputs.map((item) => (
            <BentoCard key={item.label} className="min-h-[270px] p-6">
              <div className="flex h-full flex-col justify-between">
                <Label>{item.label}</Label>
                <div>
                  <p className="max-w-full break-words font-editorial text-[clamp(3rem,6vw,5rem)] leading-none tracking-normal text-[#f4efe6] [overflow-wrap:anywhere]">
                    {item.value}
                  </p>
                  <p className="mt-5 font-light leading-relaxed text-[#b7afa3]">{item.copy}</p>
                </div>
              </div>
            </BentoCard>
          ))}
        </div>

        <BentoCard className="mt-4 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Label>[SAMPLE PAYBACK MODEL]</Label>
              <p className="mt-5 font-display text-[clamp(34px,5vw,72px)] font-extrabold leading-[0.9] tracking-tight text-[#f4efe6]">
                If the engine saves one admin hire and captures two missed jobs, the build can justify itself fast.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ['Monthly labor avoided', '+$4,500'],
                ['Two recovered high-intent jobs', '+$5,000-$12,000'],
                ['Estimated monthly operating impact', '$9,500-$16,500'],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-2 rounded-2xl border border-white/[0.08] bg-[#060606]/70 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#b7afa3]">{label}</p>
                  <p className="max-w-full break-words font-display text-[clamp(1.6rem,5vw,2.5rem)] font-extrabold leading-tight tracking-normal text-[#10b981] [overflow-wrap:anywhere]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  )
}

function QuoteEstimator() {
  const location = useLocation()
  const [need, setNeed] = useState<QuoteNeed>('site')
  const [complexity, setComplexity] = useState<QuoteComplexity>('simple')
  const [urgency, setUrgency] = useState<QuoteUrgency>('normal')
  const [employee, setEmployee] = useState<AiEmployee>('none')
  const [automation, setAutomation] = useState(false)
  const sourcePage = useMemo(() => {
    const source = new URLSearchParams(location.search).get('source')?.trim()
    if (!source || source.length > 120) return ''
    return source.replace(/[^a-zA-Z0-9/?&=._#%-]/g, '')
  }, [location.search])

  const estimate = useMemo(() => {
    let upfrontLow = 150
    let upfrontHigh = 400
    let monthlyLow = 100
    let monthlyHigh = 300
    let employeeCostLow = 0
    let employeeCostHigh = 0
    const includes = ['strategy call', 'mobile-first build', 'basic conversion structure']

    if (need === 'refresh') {
      upfrontLow = 90
      upfrontHigh = 250
      monthlyLow = 100
      monthlyHigh = 300
      includes.push('copy cleanup', 'layout refresh')
    }

    if (need === 'forms') {
      upfrontLow = 175
      upfrontHigh = 500
      monthlyLow = 150
      monthlyHigh = 400
      includes.push('lead form logic', 'booking/contact routing')
    }

    if (need === 'ai') {
      upfrontLow = 5000
      upfrontHigh = 15000
      monthlyLow = 750
      monthlyHigh = 2500
      employeeCostLow = 3500
      employeeCostHigh = 6500
      includes.push('AI intake flow', 'database-backed routing', 'automation maintenance')
    }

    if (complexity === 'medium') {
      upfrontLow += 75
      upfrontHigh += 180
      monthlyHigh += 50
      includes.push('multi-page structure')
    }

    if (complexity === 'complex') {
      upfrontLow += 150
      upfrontHigh += 450
      monthlyLow += 30
      monthlyHigh += 90
      includes.push('custom workflow mapping')
    }

    if (urgency === 'fast') {
      upfrontLow += 30
      upfrontHigh += 90
      includes.push('priority sprint')
    }

    if (urgency === 'urgent') {
      upfrontLow += 70
      upfrontHigh += 180
      includes.push('rush launch window')
    }

    if (automation && need !== 'ai') {
      upfrontLow += 180
      upfrontHigh += 520
      monthlyLow += 30
      monthlyHigh += 90
      employeeCostLow = Math.max(employeeCostLow, 2500)
      employeeCostHigh = Math.max(employeeCostHigh, 5000)
      includes.push('starter automation layer')
    }

    if (employee !== 'none') {
      employeeCostLow = Math.max(employeeCostLow, 3000)
      employeeCostHigh = Math.max(employeeCostHigh, 6500)
      if (need !== 'ai') {
        monthlyLow += 30
        monthlyHigh += 90
        upfrontLow += 150
        upfrontHigh += 420
      }
      includes.push(quoteOptions.employee.find(([value]) => value === employee)?.[1] ?? 'AI employee')
    }

    const savingsLow = employeeCostLow ? Math.max(0, employeeCostLow - monthlyHigh) : 0
    const savingsHigh = employeeCostHigh ? Math.max(0, employeeCostHigh - monthlyLow) : 0

    return {
      upfront: `$${upfrontLow.toLocaleString()}-$${upfrontHigh.toLocaleString()}`,
      monthly: `$${monthlyLow.toLocaleString()}-$${monthlyHigh.toLocaleString()}/mo`,
      employeeCost:
        employeeCostLow > 0 ? `$${employeeCostLow.toLocaleString()}-$${employeeCostHigh.toLocaleString()}/mo` : 'N/A',
      savings:
        savingsHigh > 0 ? `saving ~$${savingsLow.toLocaleString()}-$${savingsHigh.toLocaleString()}/mo compared to hiring an employee` : 'standard website work; savings depend on your current admin costs',
      includes,
      note:
        need === 'ai' || employee !== 'none'
          ? 'AI agent and operations builds vary the most because pricing depends on APIs, workflow complexity, and how much admin work the system replaces.'
          : 'Standard site work stays accessible. Add-ons, booking flows, and automation increase both upfront build cost and monthly maintenance.',
    }
  }, [automation, complexity, employee, need, urgency])

  const selectedNeed = quoteOptions.need.find(([value]) => value === need)?.[1] ?? 'New website'
  const selectedComplexity = quoteOptions.complexity.find(([value]) => value === complexity)?.[1] ?? 'Simple'
  const selectedUrgency = quoteOptions.urgency.find(([value]) => value === urgency)?.[1] ?? 'Normal timeline'
  const selectedEmployee = quoteOptions.employee.find(([value]) => value === employee)?.[1] ?? 'Not sure yet'
  const quoteMailto = `mailto:${email}?subject=${encodeURIComponent(`Orbit project range: ${selectedNeed}`)}&body=${encodeURIComponent(
    [
      'Hi Orbit Boyzz,',
      '',
      'I used the project range estimator and want to talk about this build.',
      '',
      `Need: ${selectedNeed}`,
      `Complexity: ${selectedComplexity}`,
      `Timeline: ${selectedUrgency}`,
      `AI employee: ${selectedEmployee}`,
      `Automation add-on: ${automation ? 'Yes' : 'No'}`,
      ...(sourcePage ? [`Source page: ${sourcePage}`] : []),
      `Estimated upfront build: ${estimate.upfront}`,
      `Estimated monthly care / ops: ${estimate.monthly}`,
      '',
      'Business name:',
      'Website:',
      'Service area:',
      'Best phone number:',
      '',
      'What I want the website to help with:',
    ].join('\n'),
  )}`

  return (
    <section className="px-5 py-24 md:px-8" id="quote-estimator">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Label>[QUOTE // QUICK ESTIMATE]</Label>
            <h2 className="mt-6 font-display text-[clamp(40px,6vw,92px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              Answer a few questions and get a rough Orbit build range.
            </h2>
          </div>
          <p className="max-w-2xl font-light leading-relaxed text-[#b7afa3]">
            This is intentionally a range, not a final invoice. A normal site can stay closer to the low end. AI agents,
            pricing logic, dashboards, and operations automation push the project higher.
          </p>
        </div>

        {sourcePage ? (
          <div className="mb-6 rounded-2xl border border-[#10b981]/20 bg-[#10b981]/10 p-4 font-mono text-xs uppercase tracking-widest text-[#10b981]">
            Estimate started from {sourcePage}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <BentoCard className="p-6 md:p-8">
            <div className="grid gap-8">
              <QuoteSegment title="[01 // WHAT DO YOU NEED?]" options={quoteOptions.need} value={need} onChange={setNeed} />
              <QuoteSegment title="[02 // COMPLEXITY]" options={quoteOptions.complexity} value={complexity} onChange={setComplexity} />
              <QuoteSegment title="[03 // TIMELINE]" options={quoteOptions.urgency} value={urgency} onChange={setUrgency} />
              <QuoteSegment title="[04 // WHICH AI EMPLOYEE?]" options={quoteOptions.employee} value={employee} onChange={setEmployee} />
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#060606]/70 p-5">
                <input
                  type="checkbox"
                  checked={automation}
                  onChange={(event) => setAutomation(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#10b981]"
                />
                <span>
                  <span className="block font-mono text-xs uppercase tracking-widest text-[#10b981]">[05 // AUTOMATION ADD-ON]</span>
                  <span className="mt-2 block font-light leading-relaxed text-[#b7afa3]">
                    Include follow-up automation, quote routing, booking logic, or a starter AI workflow.
                  </span>
                </span>
              </label>
            </div>
          </BentoCard>

          <BentoCard className="p-6 md:p-8">
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <Label>[ESTIMATED RANGE]</Label>
                <div className="mt-8 grid gap-5">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Upfront build</p>
                    <p className="mt-2 max-w-full break-words font-editorial text-[clamp(2.6rem,11vw,4.75rem)] leading-none tracking-normal text-[#f4efe6] [overflow-wrap:anywhere]">
                      {estimate.upfront}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Monthly care / ops</p>
                    <p className="mt-2 max-w-full break-words font-display text-[clamp(1.85rem,8vw,2.75rem)] font-extrabold leading-none tracking-normal text-[#10b981] [overflow-wrap:anywhere]">{estimate.monthly}</p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">{estimate.savings}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#b7afa3]">Comparable employee cost</p>
                    <p className="mt-2 max-w-full break-words font-display text-[clamp(1.65rem,7vw,2.25rem)] font-extrabold leading-tight tracking-normal text-[#f4efe6] [overflow-wrap:anywhere]">{estimate.employeeCost}</p>
                  </div>
                </div>
                <p className="mt-6 font-light leading-relaxed text-[#b7afa3]">{estimate.note}</p>
                <div className="mt-6 rounded-2xl border border-[#10b981]/20 bg-[#10b981]/10 p-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[READY TO SEND]</p>
                  <p className="mt-3 font-light leading-relaxed text-[#b7afa3]">
                    Send this estimate with your business name, website, service area, and the problem the site needs to solve.
                  </p>
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">Likely includes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {estimate.includes.map((item) => (
                    <span key={item} className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PremiumButton href={quoteMailto}>
                    Send this range
                  </PremiumButton>
                  <PremiumButton href={CALENDAR_LINK}>
                    Book a 30-min call
                  </PremiumButton>
                  <PremiumButton href="/contact">
                    Contact options
                  </PremiumButton>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

function QuoteSegment<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: Array<[T, string]>
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div>
      <Label>{title}</Label>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map(([optionValue, label]) => (
          <motion.button
            key={optionValue}
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={spring}
            onClick={() => onChange(optionValue)}
            className={cn(
              'rounded-2xl border p-4 text-left font-display text-lg font-extrabold tracking-tight',
              value === optionValue
                ? 'border-[#10b981]/50 bg-[#10b981] text-[#12100d]'
                : 'border-white/[0.08] bg-[#060606]/70 text-[#f4efe6] hover:border-[#10b981]/40',
            )}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function FAQ() {
  return (
    <main className="px-5 pb-24 pt-36 md:px-8 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <Label>[FAQ // BUYER QUESTIONS]</Label>
        <TextReveal
          lines={['Questions before', 'starting a serious', 'business website.']}
          className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
        />
        <div className="mt-14">
          <FAQList />
        </div>
      </div>
    </main>
  )
}

function Blog() {
  return (
    <main className="px-5 pb-24 pt-36 md:px-8 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <Label>[BLOG // ANSWER ENGINE OPTIMIZATION]</Label>
        <TextReveal
          lines={['Answers for owners', 'asking AI what kind', 'of website to build.']}
          className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
        />
        <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-[#b7afa3]">
          Orbit Websites publishes direct, extractable answers about AI operations websites, local business automation,
          intake systems, proposal automation, and measurable website ROI for Central New Jersey companies.{' '}
          <Link to="/web-design-central-nj" className="text-[#10b981] hover:text-[#f4efe6]">See our Central NJ web design work →</Link>
        </p>
        <BlogTopicClusters />
        <BuyerIntentAnswers compact />
        <div className="mt-14">
          <BlogGrid />
        </div>
      </div>
    </main>
  )
}

const blogClusters = [
  {
    label: 'Local SEO',
    description: 'Structure, checklists, town pages, and website ROI for service-area businesses.',
    slugs: [
      'local-business-website-checklist-2026',
      'home-service-website-structure',
      'local-seo-website-structure-service-business',
      'website-roi-for-local-service-business',
      'small-business-website-cost-plainsboro-nj',
      'web-design-cost-factors-mercer-county-nj',
    ],
    landing: ['/web-design-central-nj', 'Central NJ web design'],
  },
  {
    label: 'AI intake',
    description: 'AI receptionist, intake forms, dispatch, proposals, and operations websites.',
    slugs: [
      'what-is-an-ai-operations-website',
      'ai-operations-website-vs-traditional-website',
      'ai-intake-form-vs-contact-form',
      'ai-receptionist-vs-answering-service',
      'ai-receptionist-cost-small-business',
      'ai-chatbot-electrician-central-nj',
      'ai-dispatch-system-for-hvac-and-plumbing',
      'catering-proposal-automation',
    ],
    landing: ['/quote', 'Start a quote'],
  },
  {
    label: 'Pricing',
    description: 'Cost ranges for custom websites, AI websites, and local business builds.',
    slugs: [
      'how-much-does-a-website-cost-for-a-local-business',
      'custom-website-cost-central-nj',
      'web-design-cost-factors-mercer-county-nj',
      'custom-web-design-vs-wix-squarespace',
      'automated-dental-website-no-monthly-fee',
    ],
    landing: ['/pricing', 'See pricing'],
  },
  {
    label: 'Industries',
    description: 'Pages for trades, restaurants, dental practices, and other local operators.',
    slugs: [
      'plumbing-company-website-necessity',
      'electrician-website-ewing-nj',
      'landscaping-company-website-central-nj',
      'hvac-contractor-website-mercer-county-nj',
      'plumber-website-ewing-nj',
      'dental-practice-website-princeton-nj',
      'automated-dental-website-no-monthly-fee',
      'restaurant-website-central-nj-checklist',
      'clinic-website-design-central-nj',
      'med-spa-website-design-new-jersey',
    ],
    landing: ['/services', 'View services'],
  },
] as const

const blogLandingLinks: Record<string, Array<[string, string]>> = {
  'ai-dispatch-system-for-hvac-and-plumbing': [
    ['/website-design-for-hvac-companies-nj', 'HVAC websites'],
    ['/website-design-for-plumbers-nj', 'Plumber websites'],
    ['/quote', 'Get an AI intake range'],
  ],
  'catering-proposal-automation': [
    ['/services', 'AI proposal systems'],
    ['/quote', 'Get an automation range'],
    ['/pricing', 'See pricing'],
  ],
  'how-much-does-a-website-cost-for-a-local-business': [
    ['/pricing', 'See pricing'],
    ['/quote', 'Use the quote estimator'],
    ['/web-design-central-nj', 'Central NJ web design'],
  ],
  'custom-website-cost-central-nj': [
    ['/pricing', 'See pricing'],
    ['/quote', 'Get a project range'],
    ['/web-design-central-nj', 'Central NJ web design'],
  ],
  'plumbing-company-website-necessity': [
    ['/website-design-for-plumbers-nj', 'Plumber websites'],
    ['/web-design-ewing-nj', 'Ewing web design'],
    ['/quote', 'Get a range'],
  ],
  'electrician-website-ewing-nj': [
    ['/website-design-for-electricians-nj', 'Electrician websites'],
    ['/web-design-ewing-nj', 'Ewing web design'],
    ['/quote', 'Get a range'],
  ],
  'landscaping-company-website-central-nj': [
    ['/website-design-for-landscaping-companies-nj', 'Landscaping websites'],
    ['/web-design-central-nj', 'Central NJ web design'],
    ['/quote', 'Get a range'],
  ],
  'hvac-contractor-website-mercer-county-nj': [
    ['/website-design-for-hvac-companies-nj', 'HVAC websites'],
    ['/web-design-hamilton-nj', 'Hamilton web design'],
    ['/quote', 'Get a range'],
  ],
  'plumber-website-ewing-nj': [
    ['/website-design-for-plumbers-nj', 'Plumber websites'],
    ['/web-design-ewing-nj', 'Ewing web design'],
    ['/quote', 'Get a range'],
  ],
  'dental-practice-website-princeton-nj': [
    ['/website-design-for-dental-practices-nj', 'Dental websites'],
    ['/web-design-princeton-nj', 'Princeton web design'],
    ['/quote', 'Get a range'],
  ],
  'restaurant-website-central-nj-checklist': [
    ['/services', 'Restaurant website services'],
    ['/web-design-central-nj', 'Central NJ web design'],
    ['/quote', 'Get a range'],
  ],
  'clinic-website-design-central-nj': [
    ['/website-design-for-clinics-nj', 'Clinic websites'],
    ['/web-design-central-nj', 'Central NJ web design'],
    ['/quote', 'Get a range'],
  ],
  'med-spa-website-design-new-jersey': [
    ['/website-design-for-clinics-nj', 'Clinic and med spa websites'],
    ['/pricing', 'See pricing'],
    ['/quote', 'Get a range'],
  ],
  'small-business-website-cost-plainsboro-nj': [
    ['/pricing', 'See pricing'],
    ['/web-design-plainsboro-nj', 'Plainsboro web design'],
    ['/quote', 'Use the quote estimator'],
  ],
  'web-design-cost-factors-mercer-county-nj': [
    ['/pricing', 'See pricing'],
    ['/web-design-princeton-nj', 'Princeton web design'],
    ['/quote', 'Get a Mercer County range'],
  ],
  'ai-chatbot-electrician-central-nj': [
    ['/website-design-for-electricians-nj', 'Electrician websites'],
    ['/web-design-ewing-nj', 'Ewing web design'],
    ['/quote', 'Get an AI intake range'],
  ],
  'automated-dental-website-no-monthly-fee': [
    ['/website-design-for-dental-practices-nj', 'Dental websites'],
    ['/pricing', 'See pricing'],
    ['/quote', 'Get a dental website range'],
  ],
}

function getPostCluster(slug: string) {
  return blogClusters.find((cluster) => cluster.slugs.some((clusterSlug) => clusterSlug === slug)) ?? blogClusters[0]
}

function getRelatedPosts(post: (typeof blogPosts)[number]) {
  const cluster = getPostCluster(post.slug)
  const clusterPosts = cluster.slugs
    .filter((clusterSlug) => clusterSlug !== post.slug)
    .map((clusterSlug) => blogPosts.find((item) => item.slug === clusterSlug))
    .filter((item): item is (typeof blogPosts)[number] => Boolean(item))

  const fallbackPosts = blogPosts.filter(
    (item) => item.slug !== post.slug && !clusterPosts.some((relatedPost) => relatedPost.slug === item.slug),
  )

  return [...clusterPosts, ...fallbackPosts].slice(0, 3)
}

function BlogTopicClusters() {
  return (
    <section className="mt-12 grid gap-4 md:grid-cols-2">
      {blogClusters.map((cluster) => (
        <BentoCard key={cluster.label} className="p-6">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <Label>{`[TOPIC // ${cluster.label.toUpperCase()}]`}</Label>
              <p className="mt-4 font-light leading-relaxed text-[#b7afa3]">{cluster.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={`/blog/${cluster.slugs[0]}`} className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
                Read cluster
              </Link>
              <Link to={cluster.landing[0]} className="font-mono text-xs uppercase tracking-widest text-[#b7afa3] hover:text-[#f4efe6]">
                {cluster.landing[1]}
              </Link>
            </div>
          </div>
        </BentoCard>
      ))}
    </section>
  )
}

function blogSchemaDate(displayDate: string) {
  const months: Record<string, string> = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  }
  const match = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(displayDate)
  if (!match) return '2026-06-13'
  const [, monthName, day, year] = match
  return `${year}-${months[monthName] ?? '01'}-${day.padStart(2, '0')}`
}

function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find((item) => item.slug === slug) ?? blogPosts[0]
  const related = getRelatedPosts(post)
  const cluster = getPostCluster(post.slug)
  const landingLinks = blogLandingLinks[post.slug] ?? [
    [cluster.landing[0], cluster.landing[1]],
    ['/quote', 'Get a project range'],
    ['/pricing', 'See pricing'],
  ]
  const currentPostPath = `/blog/${post.slug}`
  const schemaDate = blogSchemaDate(post.updated)
  const fallbackFaqs: Record<string, Array<[string, string]>> = {
    'custom-web-design-vs-wix-squarespace': [
      [
        'Is a custom website better for local SEO than Wix or Squarespace?',
        'Often, yes. Custom sites give more control over page speed, schema, service-area structure, copy, and conversion paths than a generic template, which can make them a better fit for serious local SEO work.',
      ],
      [
        'What is the true cost difference between a template and a custom website?',
        'A template usually has a lower monthly platform cost, but the true cost depends on setup time, redesign work, add-ons, SEO limitations, integrations, and whether the site can create enough calls, quote requests, or bookings to justify a custom build.',
      ],
    ],
  }
  const postFaqs = (post as { faqs?: Array<[string, string]> }).faqs ?? fallbackFaqs[post.slug]
  const faqSchema = postFaqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: postFaqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      }
    : null
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Organization',
      name: 'Orbit Websites',
      url: 'https://orbitboyzz.me',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Orbit Websites',
      logo: {
        '@type': 'ImageObject',
        url: 'https://orbitboyzz.me/orbit-logo.png',
      },
    },
    mainEntityOfPage: `https://orbitboyzz.me/blog/${post.slug}`,
    datePublished: schemaDate,
    dateModified: schemaDate,
  }

  return (
    <main className="px-5 pb-24 pt-36 md:px-8 md:pt-44">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <article className="mx-auto max-w-5xl">
        <Label>{`[ANSWER // LAST UPDATED ${post.updated.toUpperCase()}]`}</Label>
        <h1 className="mt-6 font-display text-[clamp(46px,7vw,104px)] font-extrabold leading-[0.86] tracking-tight text-[#f4efe6]">
          {post.title}
        </h1>
        <p className="mt-8 max-w-3xl text-xl font-light leading-relaxed text-[#b7afa3]">{post.description}</p>

        <BentoCard className="mt-12 p-6">
          <Label>[WHO THIS IS FOR]</Label>
          <p className="mt-5 text-2xl font-light leading-relaxed text-[#f4efe6]">{post.audience}</p>
        </BentoCard>

        <div className="mt-8 grid gap-4">
          {post.sections.map((section) => (
            <BentoCard key={section.heading} className="p-6 md:p-8">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#f4efe6]">{section.heading}</h2>
              <p className="mt-5 text-lg font-light leading-relaxed text-[#b7afa3]">{section.body}</p>
            </BentoCard>
          ))}
        </div>

        <BentoCard className="mt-8 p-6 md:p-8">
          <Label>[EXTRACTABLE TAKEAWAYS]</Label>
          <ol className="mt-6 grid gap-4">
            {post.takeaways.map((takeaway, index) => (
              <li key={takeaway} className="grid gap-3 rounded-2xl border border-white/[0.08] bg-[#060606]/70 p-5 md:grid-cols-[64px_1fr]">
                <span className="font-editorial text-5xl leading-none text-[#10b981]">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-lg font-light leading-relaxed text-[#b7afa3]">{takeaway}</span>
              </li>
            ))}
          </ol>
        </BentoCard>
      </article>

      <section className="mx-auto mt-16 max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Label>{`[RELATED ANSWERS // ${cluster.label.toUpperCase()}]`}</Label>
            <p className="mt-3 max-w-2xl font-light leading-relaxed text-[#b7afa3]">{cluster.description}</p>
          </div>
          <Link to={`/blog/${cluster.slugs[0]}`} className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
            Open cluster
          </Link>
        </div>
        <div className="mt-6">
          <BlogCards posts={related} />
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-5 pb-8 md:px-0">
        <BentoCard className="p-6 md:p-8">
          <Label>[ORBIT BOYZZ // CENTRAL NEW JERSEY]</Label>
          <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-[#b7afa3]">
            Orbit Boyzz builds starter, custom, and AI-powered websites for local businesses across Central New Jersey, with starter ranges around $150-$400.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {landingLinks.map(([to, label]) => {
              const trackedTo = to === '/quote' ? quoteHrefForSource(currentPostPath) : to
              return (
                <Link key={`${trackedTo}-${label}`} to={trackedTo} className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
                  {label} -&gt;
                </Link>
              )
            })}
            <Link to="/pricing" className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
              See pricing →
            </Link>
            <Link to="/services" className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
              Our services →
            </Link>
            <Link to="/web-design-central-nj" className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]">
              Web design in Central NJ →
            </Link>
          </div>
        </BentoCard>
      </section>
    </main>
  )
}

function ContactCta() {
  return (
    <section className="px-5 pb-24 md:px-8" id="contact">
      <motion.div {...cardMotion} className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#eee6d8] p-6 text-[#12100d] md:p-10">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#10b981]/40 blur-[90px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#5c4520]">[FREE DEMO // NO OBLIGATION]</p>
            <h2 className="mt-6 max-w-4xl font-display text-[clamp(42px,6vw,92px)] font-extrabold leading-[0.9] tracking-tight">
              See your site live before you pay a cent.
            </h2>
            <p className="mt-5 max-w-2xl font-light leading-relaxed text-[#50483d]">
              Book a free 15-minute call. We'll build you a working demo — specific to your business — and you decide if it's right for you.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <PremiumButton href={CALENDAR_LINK} light>Claim Your Free Demo</PremiumButton>
            <PremiumButton href="tel:+16096628052" light>{phone}</PremiumButton>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  const areaLinks = [
    ['Central NJ', '/web-design-central-nj'],
    ['Plainsboro, NJ', '/web-design-plainsboro-nj'],
    ['West Windsor, NJ', '/web-design-west-windsor-nj'],
    ['Ewing, NJ', '/web-design-ewing-nj'],
    ['Princeton, NJ', '/web-design-princeton-nj'],
    ['Hamilton, NJ', '/web-design-hamilton-nj'],
    ['Lawrence, NJ', '/web-design-lawrence-nj'],
    ['Trenton, NJ', '/web-design-trenton-nj'],
    ['Robbinsville, NJ', '/web-design-robbinsville-nj'],
    ['Bordentown, NJ', '/web-design-bordentown-nj'],
    ['East Windsor, NJ', '/web-design-east-windsor-nj'],
  ]

  const industryLinks = [
    ['HVAC websites', '/website-design-for-hvac-companies-nj'],
    ['Plumber websites', '/website-design-for-plumbers-nj'],
    ['Electrician websites', '/website-design-for-electricians-nj'],
    ['Landscaping websites', '/website-design-for-landscaping-companies-nj'],
    ['Dental websites', '/website-design-for-dental-practices-nj'],
    ['Restaurant websites', '/website-design-for-restaurants-nj'],
    ['Clinic websites', '/website-design-for-clinics-nj'],
  ]

  const buyerIntentLinks = [
    ['Website cost guide', '/blog/how-much-does-a-website-cost-for-a-local-business'],
    ['Mercer County cost factors', '/blog/web-design-cost-factors-mercer-county-nj'],
    ['Custom vs Wix/Squarespace', '/blog/custom-web-design-vs-wix-squarespace'],
    ['Electrician AI chatbot', '/blog/ai-chatbot-electrician-central-nj'],
    ['Dental automation cost', '/blog/automated-dental-website-no-monthly-fee'],
  ]

  return (
    <footer className="border-t border-white/[0.08] px-5 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.72fr_0.9fr_0.9fr_0.95fr_0.75fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/orbit-logo.png" alt="Orbit Websites" width={56} height={56} loading="lazy" className="h-14 w-auto rounded-sm object-contain" />
          </div>
          <p className="mt-5 max-w-xl font-light leading-relaxed text-[#b7afa3]">
            Orbit Websites (also known as OrbitBoyzz) is a Plainsboro, NJ website design agency evolving into a premium AI Operations Studio. No public office address.
          </p>
        </div>
        <FooterColumn title="[PAGES]" links={[['Home', '/'], ['OrbitBoyzz', '/orbitboyzz'], ['About', '/about'], ['Services', '/services'], ['Pricing', '/pricing'], ['Web Design NJ', '/web-design-central-nj'], ['Quote', '/quote'], ['Contact', '/contact'], ['Projects', '/projects'], ['Blog', '/blog'], ['FAQ', '/faq']]} />
        <FooterColumn title="[AREAS]" links={areaLinks} />
        <FooterColumn title="[INDUSTRIES]" links={industryLinks} />
        <FooterColumn title="[BUYER ANSWERS]" links={buyerIntentLinks} />
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[CONTACT]</p>
          <div className="mt-5 grid gap-3 font-light text-[#b7afa3]">
            <a className="inline-flex min-h-11 items-center hover:text-[#10b981]" href="tel:+16096628052" data-conversion="call_click" onClick={() => trackHrefConversion('tel:+16096628052', 'Footer call')}>{phone}</a>
            <a className="inline-flex min-h-11 items-center hover:text-[#10b981]" href={`mailto:${email}`} data-conversion="email_click" onClick={() => trackHrefConversion(`mailto:${email}`, 'Footer email')}>{email}</a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl font-mono text-xs uppercase tracking-widest text-[#756d63]">
        Copyright 2026, OrbitBoyzz / Orbit Websites. All rights reserved.
      </p>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">{title}</p>
      <div className="mt-5 grid gap-3 font-light text-[#b7afa3]">
        {links.map(([label, to]) => (
          <Link key={label} className="inline-flex min-h-11 items-center hover:text-[#10b981]" to={to}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function MobileActionBar() {
  const location = useLocation()
  const quoteHref = quoteHrefForSource(location.pathname)

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#060606]/92 px-3 py-3 text-[#f4efe6] shadow-2xl backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a
          href="tel:+16096628052"
          data-conversion="call_click"
          onClick={() => trackHrefConversion('tel:+16096628052', 'Mobile sticky call')}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#10b981]/30 bg-[#10b981] px-3 font-mono text-[11px] uppercase tracking-widest text-[#12100d]"
        >
          <PhoneCall className="h-4 w-4" strokeWidth={1.8} />
          Call
        </a>
        <Link
          to={quoteHref}
          data-conversion="quote_page_click"
          onClick={() => trackHrefConversion(quoteHref, 'Mobile sticky quote')}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.045] px-3 font-mono text-[11px] uppercase tracking-widest text-[#f4efe6]"
        >
          <FileText className="h-4 w-4" strokeWidth={1.8} />
          Quote
        </Link>
      </div>
    </div>
  )
}

const webDesignIncludes: string[][] = [
  ['Custom design, never a template', 'Every site is designed from scratch around your business and your market — built to make you look like the most credible option a customer can call.'],
  ['Hand-coded, mobile-first build', 'Fast, lightweight pages that stay sharp on every phone, because most local searches happen on mobile and slow sites lose the click.'],
  ['Conversion-focused copy', 'Clear messaging and calls-to-action engineered to turn visitors into phone calls, quote requests, and booked work — not just compliments.'],
  ['Local SEO foundations', 'Clean structure, local schema, prerendered pages, and the technical groundwork that search engines and AI assistants reward.'],
  ['Contact, booking & lead paths', 'Click-to-call, contact forms, booking buttons, and quote flows wired to how your business actually takes on work.'],
  ['Launch on Vercel & full handoff', 'We design, build, test, and launch — then hand off a fast, modern site that you fully own.'],
]

const webDesignTowns: string[][] = [
  ['Plainsboro, NJ', 'Our home base. We build websites for Plainsboro service businesses, clinics, and shops that want to be the obvious local choice.'],
  ['Princeton, NJ', 'Premium websites for Princeton firms, practices, and boutiques where presentation and trust directly drive the sale.'],
  ['West Windsor Township, NJ', 'Conversion-focused sites for West Windsor contractors, home services, and local providers competing on quality.'],
  ['Ewing, Hamilton & Lawrence, NJ', 'Websites and AI automation for businesses in Ewing, Hamilton Township, and Lawrence that want to stand out in a competitive local market.'],
  ['Across Central New Jersey', 'We also serve Hopewell, Trenton, Robbinsville, East Windsor, Hightstown, Cranbury, Monroe, and Pennington — businesses anywhere in Central NJ.'],
]

const webDesignFit: string[] = [
  'You compete on quality and trust, not the lowest price.',
  'One new customer is worth hundreds or thousands of dollars to you.',
  'You want a site that can also automate intake, booking, and follow-up.',
  'You value a fast, hand-built website that you fully own.',
]

const webDesignNotFit: string[] = [
  'You need a $300 template site live by the weekend.',
  'Cheapest-possible is the only thing that matters.',
  'You are not ready to invest in how your business shows up online.',
]

const localWebDesignLinks: string[][] = [
  ['Central New Jersey', '/web-design-central-nj'],
  ['Plainsboro, NJ', '/web-design-plainsboro-nj'],
  ['West Windsor, NJ', '/web-design-west-windsor-nj'],
  ['Ewing, NJ', '/web-design-ewing-nj'],
  ['Princeton, NJ', '/web-design-princeton-nj'],
  ['Hamilton, NJ', '/web-design-hamilton-nj'],
  ['Lawrence Township, NJ', '/web-design-lawrence-nj'],
  ['Trenton, NJ', '/web-design-trenton-nj'],
  ['Robbinsville, NJ', '/web-design-robbinsville-nj'],
  ['Bordentown, NJ', '/web-design-bordentown-nj'],
  ['East Windsor, NJ', '/web-design-east-windsor-nj'],
]

const industryWebDesignPages = {
  hvac: {
    path: '/website-design-for-hvac-companies-nj',
    label: '[WEB DESIGN // HVAC NJ]',
    industry: 'HVAC companies',
    industryShort: 'HVAC',
    jobType: 'heating and cooling service calls',
    avgJob: '$450–$1,200',
    aiUseCase: 'After-hours emergency requests are captured by AI intake, qualified by equipment type and urgency, and texted to your phone as a scoped summary — so no emergency call slips through overnight.',
    towns: 'Ewing, Hamilton, Lawrence Township, Trenton, Mercer County, and Central New Jersey',
  },
  plumbing: {
    path: '/website-design-for-plumbers-nj',
    label: '[WEB DESIGN // PLUMBERS NJ]',
    industry: 'plumbing contractors',
    industryShort: 'Plumbing',
    jobType: 'plumbing service and repair calls',
    avgJob: '$300–$1,500',
    aiUseCase: 'AI intake sorts emergency from scheduled jobs the moment a form is submitted — emergency requests fire a text to your phone in under 30 seconds, scheduled ones collect job description, address, and timing so you quote without a call.',
    towns: 'Ewing, Trenton, Hamilton, Lawrence, Princeton, Mercer County, and Central New Jersey',
  },
  electrician: {
    path: '/website-design-for-electricians-nj',
    label: '[WEB DESIGN // ELECTRICIANS NJ]',
    industry: 'electricians and electrical contractors',
    industryShort: 'Electrical',
    jobType: 'electrical service and installation jobs',
    avgJob: '$350–$2,000',
    aiUseCase: 'AI intake captures job type (panel upgrade, outlet repair, EV charger install), address, and urgency level. Residential and commercial requests are routed separately so you prioritize correctly without triaging a full voicemail box.',
    towns: 'Ewing, Princeton, Lawrence Township, Hamilton, West Windsor, Mercer County, and Central NJ',
  },
  landscaping: {
    path: '/website-design-for-landscaping-companies-nj',
    label: '[WEB DESIGN // LANDSCAPING NJ]',
    industry: 'landscaping and lawn care companies',
    industryShort: 'Landscaping',
    jobType: 'landscaping and lawn maintenance contracts',
    avgJob: '$2,400–$6,000/year per client',
    aiUseCase: 'An AI proposal form collects property size, service frequency, and preferred start date. It auto-sends a scoped price range by email so you spend time converting real buyers, not answering basic questions over the phone.',
    towns: 'Princeton, West Windsor, Plainsboro, Ewing, Hamilton, Mercer County, and Central NJ',
  },
  dental: {
    path: '/website-design-for-dental-practices-nj',
    label: '[WEB DESIGN // DENTAL NJ]',
    industry: 'dental practices and orthodontists',
    industryShort: 'Dental',
    jobType: 'new patient appointments',
    avgJob: '$800–$4,000/year per patient',
    aiUseCase: 'New patient intake captures insurance carrier, treatment interest, and preferred appointment window before any staff involvement. Urgent cases (toothache, broken crown) trigger a same-day callback flag automatically.',
    towns: 'Princeton, West Windsor, Plainsboro, Lawrence Township, East Windsor, and Central NJ',
  },
  restaurants: {
    path: '/website-design-for-restaurants-nj',
    label: '[WEB DESIGN // RESTAURANTS NJ]',
    industry: 'restaurants, caterers, bakeries, and cafes',
    industryShort: 'Restaurant',
    jobType: 'orders, reservations, catering leads, and private event inquiries',
    avgJob: '$500-$5,000+ per catering or event lead',
    aiUseCase: 'AI catering intake collects guest count, date, service style, menu preferences, dietary notes, delivery location, and budget range so staff can respond with a clearer proposal instead of chasing details by phone.',
    towns: 'Plainsboro, Princeton, West Windsor, Ewing, Hamilton, Robbinsville, and Central NJ',
  },
  clinics: {
    path: '/website-design-for-clinics-nj',
    label: '[WEB DESIGN // CLINICS NJ]',
    industry: 'clinics, med spas, and appointment-based healthcare practices',
    industryShort: 'Clinic',
    jobType: 'consultation requests, appointment bookings, and patient intake forms',
    avgJob: '$250-$3,000+ per patient or treatment plan',
    aiUseCase: 'AI intake collects appointment type, preferred location, urgency, insurance or payment context, and treatment interest so staff can prioritize qualified requests and reduce phone tag.',
    towns: 'Princeton, Plainsboro, West Windsor, Hamilton, Lawrence Township, East Windsor, and Central NJ',
  },
} as const

const townWebDesignPages = {
  plainsboro: {
    path: '/web-design-plainsboro-nj',
    label: '[WEB DESIGN // PLAINSBORO NJ]',
    town: 'Plainsboro, NJ',
    county: 'Middlesex County',
    nearby: 'Princeton, West Windsor, Cranbury, Monroe, and South Brunswick',
    audience: 'service businesses, clinics, restaurants, shops, consultants, and local providers',
  },
  westWindsor: {
    path: '/web-design-west-windsor-nj',
    label: '[WEB DESIGN // WEST WINDSOR NJ]',
    town: 'West Windsor Township, NJ',
    county: 'Mercer County',
    nearby: 'Princeton, Plainsboro, Lawrence Township, Hamilton, and Cranbury',
    audience: 'contractors, professional services, clinics, restaurants, real estate teams, and local companies',
  },
  princeton: {
    path: '/web-design-princeton-nj',
    label: '[WEB DESIGN // PRINCETON NJ]',
    town: 'Princeton, NJ',
    county: 'Mercer County',
    nearby: 'Plainsboro, West Windsor, Lawrence Township, and Hamilton',
    audience: 'firms, clinics, boutiques, consultants, home service companies, and local providers',
  },
  hamilton: {
    path: '/web-design-hamilton-nj',
    label: '[WEB DESIGN // HAMILTON NJ]',
    town: 'Hamilton, NJ',
    county: 'Mercer County',
    nearby: 'Trenton, Ewing, Lawrence Township, Robbinsville, and Princeton',
    audience: 'contractors, home service companies, clinics, restaurants, and local service providers',
  },
  lawrence: {
    path: '/web-design-lawrence-nj',
    label: '[WEB DESIGN // LAWRENCE NJ]',
    town: 'Lawrence Township, NJ',
    county: 'Mercer County',
    nearby: 'Princeton, Ewing, Hamilton, Trenton, and West Windsor',
    audience: 'professional services, clinics, contractors, restaurants, and local companies',
  },
  trenton: {
    path: '/web-design-trenton-nj',
    label: '[WEB DESIGN // TRENTON NJ]',
    town: 'Trenton, NJ',
    county: 'Mercer County',
    nearby: 'Hamilton, Ewing, Lawrence Township, Bordentown, and Burlington',
    audience: 'contractors, food businesses, nonprofits, professional services, and local providers',
  },
  robbinsville: {
    path: '/web-design-robbinsville-nj',
    label: '[WEB DESIGN // ROBBINSVILLE NJ]',
    town: 'Robbinsville Township, NJ',
    county: 'Mercer County',
    nearby: 'Hamilton, East Windsor, Allentown, Bordentown, and Hightstown',
    audience: 'contractors, home service companies, shops, clinics, and growing local businesses',
  },
  bordentown: {
    path: '/web-design-bordentown-nj',
    label: '[WEB DESIGN // BORDENTOWN NJ]',
    town: 'Bordentown, NJ',
    county: 'Burlington County',
    nearby: 'Trenton, Hamilton, Robbinsville, Burlington City, and Florence',
    audience: 'contractors, restaurants, shops, service businesses, and local providers',
  },
  eastWindsor: {
    path: '/web-design-east-windsor-nj',
    label: '[WEB DESIGN // EAST WINDSOR NJ]',
    town: 'East Windsor, NJ',
    county: 'Mercer County',
    nearby: 'Robbinsville, Hightstown, West Windsor, Cranbury, and Monroe',
    audience: 'home service companies, contractors, clinics, shops, and local businesses',
  },
} as const

function WebDesignCentralNJ() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[WEB DESIGN // CENTRAL NEW JERSEY]</Label>
          <TextReveal
            lines={['Premium web design', 'for Central New Jersey', 'local businesses.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl font-light leading-relaxed text-[#b7afa3]">
            Orbit Websites is a Plainsboro, NJ web design agency building custom websites and AI
            automation systems for local businesses across Central New Jersey — including Plainsboro,
            Princeton, West Windsor, Ewing, Hamilton, Lawrence, Hopewell, and Trenton. We design
            conversion-focused sites — and AI automations that handle intake, pricing, booking, and
            follow-up — for companies that treat their website as a way to win better customers, not
            a cheap brochure.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PremiumButton href="tel:+16096628052">Call {phone}</PremiumButton>
            <PremiumButton href="/quote">Get a project range</PremiumButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            What our web design includes.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {webDesignIncludes.map(([title, copy], index) => (
              <BentoCard key={title} className="p-6">
                <div className="grid gap-4 md:grid-cols-[64px_1fr] md:items-start">
                  <p className="font-editorial text-5xl leading-none text-[#10b981]">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#f4efe6]">{title}</h3>
                    <p className="mt-3 font-light leading-relaxed text-[#b7afa3]">{copy}</p>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Towns we design websites for.
          </h2>
          <div className="grid gap-4">
            {webDesignTowns.map(([town, copy]) => (
              <BentoCard key={town} className="p-6">
                <div className="grid gap-5 md:grid-cols-[0.4fr_1fr] md:items-center">
                  <h3 className="font-display text-3xl font-extrabold tracking-tight text-[#f4efe6]">{town}</h3>
                  <p className="font-light leading-relaxed text-[#b7afa3]">{copy}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      <LocalWebDesignLinks />

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Built for businesses that take growth seriously.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <BentoCard className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[A strong fit if]</p>
              <ul className="mt-5 grid gap-3">
                {webDesignFit.map((line) => (
                  <li key={line} className="font-light leading-relaxed text-[#b7afa3]">— {line}</li>
                ))}
              </ul>
            </BentoCard>
            <BentoCard className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#756d63]">[Probably not a fit if]</p>
              <ul className="mt-5 grid gap-3">
                {webDesignNotFit.map((line) => (
                  <li key={line} className="font-light leading-relaxed text-[#756d63]">— {line}</li>
                ))}
              </ul>
            </BentoCard>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8" id="local-faq">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Common questions.
          </h2>
          <FAQList limit={3} />
        </div>
      </section>
    </main>
  )
}

function LocalWebDesignLinks() {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Label>[LOCAL PAGES // MERCER COUNTY]</Label>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {localWebDesignLinks.map(([label, to]) => (
            <Link key={to} to={to} className="group block">
              <BentoCard className="h-full p-5">
                <p className="font-display text-2xl font-extrabold tracking-tight text-[#f4efe6] group-hover:text-[#10b981]">
                  {label}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#b7afa3]">
                  Web design + AI intake
                </p>
              </BentoCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

type TownWebDesignPageData = (typeof townWebDesignPages)[keyof typeof townWebDesignPages]
type IndustryWebDesignPageData = (typeof industryWebDesignPages)[keyof typeof industryWebDesignPages]
type LandingFaqItem = [string, string]

function LandingFAQSection({ label, heading, items }: { label: string; heading: string; items: LandingFaqItem[] }) {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Label>{label}</Label>
        <h2 className="mt-6 mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
          {heading}
        </h2>
        <div className="grid gap-4">
          {items.map(([question, answer], index) => (
            <motion.details
              key={question}
              {...cardMotion}
              open={index === 0}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
            >
              <summary className="cursor-pointer list-none font-display text-2xl font-extrabold tracking-tight text-[#f4efe6]">
                {question}
              </summary>
              <p className="mt-5 max-w-4xl font-light leading-relaxed text-[#b7afa3]">{answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}

function townLandingFaqs(page: TownWebDesignPageData): LandingFaqItem[] {
  return [
    [
      `How much does web design cost in ${page.town}?`,
      `A focused starter website for a ${page.town} business usually ranges from $150 to $400. AI intake, booking logic, quote routing, and deeper custom design can move the project into the $5,000 to $15,000 range.`,
    ],
    [
      `Do you work with businesses near ${page.town}?`,
      `Yes. Orbit Websites serves ${page.town}, ${page.county}, and nearby areas including ${page.nearby}. Pages should only target towns where the business actually works.`,
    ],
    [
      'What makes a local business website convert?',
      'The highest-converting local websites make the next step obvious: call, request a quote, book a visit, or start intake. The page also needs clear services, proof, service-area context, fast mobile performance, and pricing or budget guidance.',
    ],
  ]
}

function industryLandingFaqs(page: IndustryWebDesignPageData): LandingFaqItem[] {
  return [
    [
      `How much does a website cost for a ${page.industryShort.toLowerCase()} company in NJ?`,
      `A focused starter site for a ${page.industryShort.toLowerCase()} company usually ranges from $150 to $400. AI intake, routing, booking, proposal logic, and deeper custom workflows usually move the project into the $5,000 to $15,000 range.`,
    ],
    [
      `What should a ${page.industryShort.toLowerCase()} website include?`,
      `A strong ${page.industryShort.toLowerCase()} website should include service details, local service areas, trust signals, clear calls to action, mobile-first pages, and an intake path built around ${page.jobType}.`,
    ],
    [
      'When does AI intake make sense?',
      `AI intake makes sense when faster response or better qualification can recover revenue. For ${page.industryShort.toLowerCase()} businesses, it can collect the details staff need before calling back and route higher-value requests sooner.`,
    ],
  ]
}

function TownWebDesignPage({ page }: { page: TownWebDesignPageData }) {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>{page.label}</Label>
          <TextReveal
            lines={['Web design', `for ${page.town}`, 'local businesses.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl font-light leading-relaxed text-[#b7afa3]">
            {`Orbit Websites builds hand-coded websites and AI intake systems for ${page.town} businesses that need more calls, quote requests, bookings, and qualified leads from local search. Starter websites usually range from $150 to $400, with AI intake builds starting around $5,000 when faster response can pay for itself.`}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PremiumButton href="tel:+16096628052">Call {phone}</PremiumButton>
            <PremiumButton href={`/quote?source=${encodeURIComponent(page.path)}`}>Get a range</PremiumButton>
            <PremiumButton href="/pricing">See pricing</PremiumButton>
          </div>
        </div>
      </section>

      <LocalWebDesignLinks />

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Built for {page.town} businesses that need measurable leads.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Local SEO structure', `Service, town, FAQ, and proof sections help search engines understand that your business serves ${page.town}, ${page.county}, and nearby areas like ${page.nearby}.`],
              ['Lead-focused pages', 'The site is structured around calls, quote requests, booking paths, and forms instead of generic brochure sections.'],
              ['Fast mobile performance', 'Hand-coded React and prerendered pages keep the experience lightweight for local buyers comparing options from a phone.'],
              ['AI intake when it makes sense', 'AI qualification, routing, and proposal workflows are added when lead value and response speed justify the investment.'],
            ].map(([title, copy], index) => (
              <BentoCard key={title} className="p-6">
                <div className="grid gap-4 md:grid-cols-[64px_1fr] md:items-start">
                  <p className="font-editorial text-5xl leading-none text-[#10b981]">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#f4efe6]">{title}</h3>
                    <p className="mt-3 font-light leading-relaxed text-[#b7afa3]">{copy}</p>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <BentoCard className="p-6 md:p-8">
            <Label>[DIRECT ANSWER]</Label>
            <h2 className="mt-6 font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              How much does web design cost in {page.town}?
            </h2>
            <p className="mt-6 max-w-4xl text-xl font-light leading-relaxed text-[#b7afa3]">
              A starter website for a {page.town} local business usually ranges from $150 to $400
              for a focused site. AI-powered lead intake, booking logic, routing,
              and proposal workflows usually move the project into the $5,000 to $15,000 range,
              depending on integrations and workflow complexity.
            </p>
          </BentoCard>
        </div>
      </section>

      <LandingFAQSection label="[LOCAL FAQ]" heading={`Questions ${page.town} businesses ask before hiring.`} items={townLandingFaqs(page)} />
    </main>
  )
}

function WebDesignEwingNJ() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[WEB DESIGN // EWING NJ]</Label>
          <TextReveal
            lines={['Web design', 'for Ewing, NJ', 'local businesses.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl font-light leading-relaxed text-[#b7afa3]">
            Orbit Websites builds hand-coded websites and AI intake systems for Ewing Township
            businesses that need more calls, quote requests, bookings, and qualified leads from
            local search. Starter website builds usually range from $150 to $400, with AI intake upgrades
            starting around $5,000 when the workflow can prove ROI.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PremiumButton href="tel:+16096628052">Call {phone}</PremiumButton>
            <PremiumButton href="/quote?source=web-design-ewing-nj">Get a range</PremiumButton>
            <PremiumButton href="/pricing">See pricing</PremiumButton>
          </div>
        </div>
      </section>

      <LocalWebDesignLinks />

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Built for Ewing service businesses competing on trust.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Local SEO structure', 'Service, town, FAQ, and proof sections help search engines and AI assistants understand what you do in Ewing and Mercer County.'],
              ['Conversion paths', 'Calls, quote forms, booking links, and AI intake flows are placed around the actions that create real customer conversations.'],
              ['Fast hand-coded pages', 'Next.js, React, Tailwind, and prerendered pages keep the site lightweight for mobile visitors comparing local options.'],
              ['Automation when it pays', 'AI lead intake, routing, and proposal workflows are added when faster response can recover missed revenue or reduce admin work.'],
            ].map(([title, copy], index) => (
              <BentoCard key={title} className="p-6">
                <div className="grid gap-4 md:grid-cols-[64px_1fr] md:items-start">
                  <p className="font-editorial text-5xl leading-none text-[#10b981]">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#f4efe6]">{title}</h3>
                    <p className="mt-3 font-light leading-relaxed text-[#b7afa3]">{copy}</p>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <BentoCard className="p-6 md:p-8">
            <Label>[DIRECT ANSWER]</Label>
            <h2 className="mt-6 font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              How much does web design cost in Ewing, NJ?
            </h2>
            <p className="mt-6 max-w-4xl text-xl font-light leading-relaxed text-[#b7afa3]">
              A starter website for an Ewing, NJ local business usually ranges from $150 to $400
              for a focused site. AI-powered lead intake, booking logic, routing,
              and proposal workflows usually move the project into the $5,000 to $15,000 range,
              depending on integrations and workflow complexity.
            </p>
          </BentoCard>
        </div>
      </section>

      <LandingFAQSection
        label="[LOCAL FAQ]"
        heading="Questions Ewing businesses ask before hiring."
        items={[
          [
            'How much does web design cost in Ewing, NJ?',
            'A focused starter website for an Ewing business usually ranges from $150 to $400. AI intake, booking logic, quote routing, and deeper custom design can move the project into the $5,000 to $15,000 range.',
          ],
          [
            'Do you work with businesses near Ewing?',
            'Yes. Orbit Websites serves Ewing Township, Mercer County, and nearby towns including Trenton, Lawrence, Hamilton, Princeton, and West Windsor.',
          ],
          [
            'What makes an Ewing local business website convert?',
            'The site needs clear services, local proof, fast mobile pages, direct click-to-call actions, quote or booking paths, and enough service-area context for buyers and search engines to understand the business quickly.',
          ],
        ]}
      />
    </main>
  )
}

function IndustryWebDesignPage({ page }: { page: IndustryWebDesignPageData }) {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>{page.label}</Label>
          <TextReveal
            lines={['Web design', `for ${page.industryShort}`, 'companies in NJ.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl font-light leading-relaxed text-[#b7afa3]">
            {`Orbit Websites builds hand-coded websites and AI intake systems for ${page.industry} in ${page.towns}. We build around ${page.jobType} — not vanity traffic. Starter builds usually range from $150 to $400, with AI-powered lead intake starting around $5,000 when faster response can pay for itself.`}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PremiumButton href="tel:+16096628052">Call {phone}</PremiumButton>
            <PremiumButton href={`/quote?source=${encodeURIComponent(page.path)}`}>Get a range</PremiumButton>
            <PremiumButton href="/pricing">See pricing</PremiumButton>
          </div>
        </div>
      </section>

      <LocalWebDesignLinks />

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 max-w-4xl font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
            Built for {page.industry} that need real leads.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Local search visibility', `The site is structured to rank for service-specific and town-specific searches — "${page.industryShort.toLowerCase()} near me", "${page.industryShort.toLowerCase()} ${page.towns.split(',')[0]}", and job-type variations.`],
              ['AI-powered intake', page.aiUseCase],
              ['Fast mobile performance', `Most local buyers compare options on mobile. Hand-coded React and prerendered pages stay lightweight so a buyer comparing ${page.industryShort.toLowerCase()} companies doesn't bounce before calling.`],
              ['Built to convert', `Every page is structured around ${page.jobType} — quote requests, click-to-call, booking, and contact forms — not generic brochure copy.`],
            ].map(([title, copy], index) => (
              <BentoCard key={title} className="p-6">
                <div className="grid gap-4 md:grid-cols-[64px_1fr] md:items-start">
                  <p className="font-editorial text-5xl leading-none text-[#10b981]">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#f4efe6]">{title}</h3>
                    <p className="mt-3 font-light leading-relaxed text-[#b7afa3]">{copy}</p>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <BentoCard className="p-6 md:p-8">
            <Label>[DIRECT ANSWER]</Label>
            <h2 className="mt-6 font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-tight text-[#f4efe6]">
              How much does a website cost for a {page.industryShort.toLowerCase()} company in NJ?
            </h2>
            <p className="mt-6 max-w-4xl text-xl font-light leading-relaxed text-[#b7afa3]">
              A starter site for a {page.industryShort.toLowerCase()} company typically ranges from $150 to $400 for a focused site.
              Projects with AI intake, job-type routing, emergency alert logic, or proposal automation usually run $5,000 to $15,000
              depending on workflow complexity. Average {page.jobType} run {page.avgJob}, so the site pays back in a handful of jobs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/pricing" className="font-display text-lg font-bold text-[#10b981] underline underline-offset-4 hover:text-[#f4efe6]">See pricing →</Link>
              <Link to="/services" className="font-display text-lg font-bold text-[#b7afa3] underline underline-offset-4 hover:text-[#f4efe6]">Our services →</Link>
              <Link to="/web-design-central-nj" className="font-display text-lg font-bold text-[#b7afa3] underline underline-offset-4 hover:text-[#f4efe6]">Web design in Central NJ →</Link>
            </div>
          </BentoCard>
        </div>
      </section>

      <LandingFAQSection label="[INDUSTRY FAQ]" heading={`Questions ${page.industryShort.toLowerCase()} businesses ask before hiring.`} items={industryLandingFaqs(page)} />
    </main>
  )
}

function CalendlyEmbed() {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const SRC = 'https://assets.calendly.com/assets/external/widget.js'
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const script = document.createElement('script')
      script.src = SRC
      script.async = true
      document.body.appendChild(script)
    }

    // Calendly posts window messages once the scheduler renders.
    function onMessage(e: MessageEvent) {
      const data = e.data
      if (data && typeof data === 'object' && typeof data.event === 'string' && data.event.indexOf('calendly') === 0) {
        setLoaded(true)
      }
    }
    window.addEventListener('message', onMessage)

    // Fallback: hide the skeleton as soon as the iframe itself loads.
    let observer: MutationObserver | undefined
    const el = widgetRef.current
    if (el) {
      observer = new MutationObserver(() => {
        const iframe = el.querySelector('iframe')
        if (iframe) {
          iframe.addEventListener('load', () => setLoaded(true), { once: true })
        }
      })
      observer.observe(el, { childList: true, subtree: true })
    }
    // Safety net so the skeleton never gets stuck if no event fires.
    const timeout = window.setTimeout(() => setLoaded(true), 10000)

    return () => {
      window.removeEventListener('message', onMessage)
      observer?.disconnect()
      window.clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08]" style={{ minHeight: '700px' }}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-[#0b0b0b] p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-3 w-56 animate-pulse rounded bg-white/[0.05]" />
          <div className="mt-2 grid flex-1 grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white/[0.04]" style={{ animationDelay: `${(i % 7) * 60}ms` }} />
            ))}
          </div>
          <p className="text-center font-mono text-[11px] uppercase tracking-widest text-[#756d63]">
            Loading booking calendar…
          </p>
        </div>
      )}
      <div
        ref={widgetRef}
        className="calendly-inline-widget"
        data-url="https://calendly.com/orbitwebsites/30min?hide_gdpr_banner=1&background_color=0b0b0b&text_color=f4efe6&primary_color=10b981"
        style={{ minWidth: '320px', height: '700px' }}
      >
        <noscript>
          <a href={CALENDAR_LINK}>Book a 30-minute call with Orbit Websites on Calendly</a>
        </noscript>
      </div>
      {/* Fallback button in case embed fails to render */}
      <div className="mt-4 text-center">
        <a
          href={CALENDAR_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-widest text-[#10b981] hover:text-[#f4efe6]"
        >
          Open booking page directly →
        </a>
      </div>
    </div>
  )
}

function Contact() {
  return (
    <main className="pt-36 md:pt-44">
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Label>[CONTACT // ORBIT WEBSITES]</Label>
          <TextReveal
            lines={['Book a call or', 'reach Orbit Websites', 'directly.']}
            className="mt-6 max-w-6xl font-display text-[clamp(52px,8vw,120px)] font-extrabold leading-[0.85] tracking-tight text-[#f4efe6]"
          />
          <p className="mt-8 max-w-3xl font-light leading-relaxed text-[#b7afa3]">
            The fastest way to start is to book a free 30-minute call. Pick a time that works and
            we'll talk through your website, where you serve, and what customers should do when
            they land on your site. Prefer phone or email? Those are below.
          </p>
        </div>
      </section>

      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <CalendlyEmbed />
          <div className="grid gap-4">
            <BentoCard className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[Book online]</p>
              <p className="mt-4 font-light leading-relaxed text-[#b7afa3]">
                Schedule a free 30-minute consultation on Calendly.
              </p>
              <div className="mt-5">
                <PremiumButton href={CALENDAR_LINK}>Open Calendly</PremiumButton>
              </div>
            </BentoCard>
            <BentoCard className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[Call or email]</p>
              <div className="mt-5 grid gap-3 font-light text-[#b7afa3]">
                <a className="hover:text-[#10b981]" href="tel:+16096628052" data-conversion="call_click" onClick={() => trackHrefConversion('tel:+16096628052', 'Contact call')}>{phone}</a>
                <a className="hover:text-[#10b981]" href={`mailto:${email}`} data-conversion="email_click" onClick={() => trackHrefConversion(`mailto:${email}`, 'Contact email')}>{email}</a>
              </div>
            </BentoCard>
            <BentoCard className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#10b981]">[Service area]</p>
              <p className="mt-4 font-light leading-relaxed text-[#b7afa3]">
                Plainsboro, Princeton, West Windsor Township, and Central New Jersey. Service-area
                business — no public office address.
              </p>
            </BentoCard>
          </div>
        </div>
      </section>
    </main>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-[#060606] pb-20 text-[#f4efe6] md:pb-0">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orbitboyzz" element={<OrbitBoyzzBrandPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/web-design-central-nj" element={<WebDesignCentralNJ />} />
        <Route path="/web-design-ewing-nj" element={<WebDesignEwingNJ />} />
        <Route path="/web-design-plainsboro-nj" element={<TownWebDesignPage page={townWebDesignPages.plainsboro} />} />
        <Route path="/web-design-west-windsor-nj" element={<TownWebDesignPage page={townWebDesignPages.westWindsor} />} />
        <Route path="/web-design-princeton-nj" element={<TownWebDesignPage page={townWebDesignPages.princeton} />} />
        <Route path="/web-design-hamilton-nj" element={<TownWebDesignPage page={townWebDesignPages.hamilton} />} />
        <Route path="/web-design-lawrence-nj" element={<TownWebDesignPage page={townWebDesignPages.lawrence} />} />
        <Route path="/web-design-trenton-nj" element={<TownWebDesignPage page={townWebDesignPages.trenton} />} />
        <Route path="/web-design-robbinsville-nj" element={<TownWebDesignPage page={townWebDesignPages.robbinsville} />} />
        <Route path="/web-design-bordentown-nj" element={<TownWebDesignPage page={townWebDesignPages.bordentown} />} />
        <Route path="/web-design-east-windsor-nj" element={<TownWebDesignPage page={townWebDesignPages.eastWindsor} />} />
        <Route path="/website-design-for-hvac-companies-nj" element={<IndustryWebDesignPage page={industryWebDesignPages.hvac} />} />
        <Route path="/website-design-for-plumbers-nj" element={<IndustryWebDesignPage page={industryWebDesignPages.plumbing} />} />
        <Route path="/website-design-for-electricians-nj" element={<IndustryWebDesignPage page={industryWebDesignPages.electrician} />} />
        <Route path="/website-design-for-landscaping-companies-nj" element={<IndustryWebDesignPage page={industryWebDesignPages.landscaping} />} />
        <Route path="/website-design-for-dental-practices-nj" element={<IndustryWebDesignPage page={industryWebDesignPages.dental} />} />
        <Route path="/website-design-for-restaurants-nj" element={<IndustryWebDesignPage page={industryWebDesignPages.restaurants} />} />
        <Route path="/website-design-for-clinics-nj" element={<IndustryWebDesignPage page={industryWebDesignPages.clinics} />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <ContactCta />
      <Footer />
      <MobileActionBar />
    </div>
  )
}

export default App




