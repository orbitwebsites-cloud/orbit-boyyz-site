import { useState } from 'react'
import './GrowthPage.css'

const CALENDLY_URL = 'https://calendly.com/orbitwebsites/30min'

// TODO: replace with real India division contact details once confirmed.
const INDIA_PHONE_DISPLAY = 'Phone: TBD'
const INDIA_PHONE_TEL = ''
const INDIA_EMAIL = 'india@orbitboyzz.me'
const INDIA_CITY = 'India (city TBD)'

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12 4 4L19 6" />
  </svg>
)

const Logo = () => (
  <a className="brand" href="#top" aria-label="Orbit Websites India home">
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <ellipse className="logo-orbit orbit-a" cx="24" cy="24" rx="20" ry="8.75" />
        <ellipse className="logo-orbit orbit-b" cx="24" cy="24" rx="20" ry="8.75" />
        <circle className="logo-core" cx="24" cy="24" r="5.25" />
        <circle className="logo-node node-a" cx="42.25" cy="31.9" r="2.7" />
        <circle className="logo-node node-b" cx="6.2" cy="16.2" r="2.15" />
      </svg>
    </span>
    <span className="brand-copy">
      <strong>ORBIT</strong>
      <small>WEBSITES INDIA</small>
    </span>
  </a>
)

const Nav = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Logo />
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Toggle navigation</span>
        </button>
        <nav id="primary-navigation" className={open ? 'nav-links is-open' : 'nav-links'}>
          <div className="nav-cluster nav-left">
            <a href="#services" onClick={() => setOpen(false)}>Services</a>
            <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
          </div>
          <div className="nav-cluster nav-right">
            <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
            <a className="nav-cta" href={CALENDLY_URL} target="_blank" rel="noreferrer">
              Book a free call <ArrowUpRight />
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

const services = [
  {
    number: '01',
    title: 'Custom-coded business websites',
    body: 'Hand-built, mobile-first websites for Indian businesses — no page-builder templates, tuned for speed and local search.',
    stat: 'Fast turnaround',
    label: 'design to launch',
  },
  {
    number: '02',
    title: 'AI-powered lead intake',
    body: 'Automated WhatsApp, chat and form follow-up so inbound enquiries get an instant, helpful response around the clock.',
    stat: '24 / 7',
    label: 'enquiry coverage',
  },
  {
    number: '03',
    title: 'Booking and CRM automation',
    body: 'Qualification, scheduling and follow-up wired directly into the tools your team already uses.',
    stat: '1 dashboard',
    label: 'for every lead',
  },
  {
    number: '04',
    title: 'Ongoing monitoring',
    body: 'Every site and workflow we ship is monitored and maintained by our team after launch.',
    stat: 'Always on',
    label: 'support',
  },
]

const tiers = [
  {
    name: 'Starter',
    price: '₹25,000',
    description: 'A focused, custom-coded website for a small or growing business.',
    features: [
      'Custom-coded, mobile-first site',
      'Local SEO foundations',
      'Contact / enquiry form',
      'Launch support',
    ],
  },
  {
    name: 'Growth',
    price: '₹75,000',
    description: 'For businesses that need automated lead capture and follow-up.',
    featured: true,
    features: [
      'Everything in Starter',
      'AI-powered enquiry intake',
      'WhatsApp / chat automation',
      'Booking and CRM connection',
      'Monthly performance report',
    ],
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For established businesses with multiple locations or teams.',
    features: [
      'Everything in Growth',
      'Multi-location routing',
      'Custom workflow integrations',
      'Priority support',
    ],
  },
]

const faqs: [string, string][] = [
  ['Is this the same team as Orbit Websites in the US?', 'Yes. Orbit Websites India is our division serving businesses in India, built on the same hand-coded, AI-automation approach as our US work.'],
  ['What currency are prices in?', 'Pricing shown here is in Indian Rupees (₹). Final scope and pricing are confirmed on a free call.'],
  ['How long does a project take?', 'Most starter sites launch within a couple of weeks; automation-heavy builds depend on the integrations required.'],
  ['Do you work with businesses outside major cities?', 'Yes — we work remotely with businesses anywhere in India.'],
]

export default function IndiaPage() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="growth-site">
      <Nav />
      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy reveal reveal-one">
            <div className="availability"><span /> Orbit Websites India — now onboarding</div>
            <h1>Custom websites and AI operations, <em>built for India.</em></h1>
            <p>
              Orbit Websites India brings our hand-coded website builds and AI-driven lead automation to businesses across India — the same premium approach as our original studio, priced and localized for the Indian market.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={CALENDLY_URL} target="_blank" rel="noreferrer">
                Book a free call <ArrowUpRight />
              </a>
              <a className="text-link" href="#services">See what we build <span>↓</span></a>
            </div>
            <div className="hero-proof">
              <div className="proof-faces" aria-hidden="true">
                <span>OR</span><span>BI</span><span>IN</span>
              </div>
              <p><strong>Hand-coded, not templated.</strong><br />Monitored by real developers.</p>
            </div>
          </div>
        </section>

        <section className="credibility-bar">
          <div className="section-shell credibility-inner">
            <span>From the team behind</span>
            <strong>ORBIT WEBSITES</strong>
            <i />
            <span>Serving {INDIA_CITY}</span>
          </div>
        </section>

        <section id="services" className="system-section">
          <div className="section-shell">
            <div className="section-intro light">
              <span className="eyebrow">What we build</span>
              <h2>Websites and automation<br />that do the follow-up for you.</h2>
              <p>The same system behind our US clients, adapted for businesses in India.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <span className="service-number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                  <div className="service-stat">
                    <strong>{service.stat}</strong>
                    <span>{service.label}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="section-shell">
            <div className="section-intro pricing-heading">
              <span className="eyebrow">Simple pricing</span>
              <h2>Pricing built for the<br /><em>Indian market.</em></h2>
              <p>Final scope confirmed on a free call. Prices shown in Indian Rupees.</p>
            </div>
            <div className="pricing-grid">
              {tiers.map((tier) => (
                <article className={tier.featured ? 'price-card is-featured' : 'price-card'} key={tier.name}>
                  {tier.featured && <span className="popular">Most popular</span>}
                  <h3>{tier.name}</h3>
                  <p>{tier.description}</p>
                  <div className="price"><strong>{tier.price}</strong></div>
                  <ul>
                    {tier.features.map((feature) => <li key={feature}><Check /> {feature}</li>)}
                  </ul>
                  <a className={tier.featured ? 'button button-primary' : 'button button-outline'} href={CALENDLY_URL} target="_blank" rel="noreferrer">
                    Book a free call <ArrowUpRight />
                  </a>
                </article>
              ))}
            </div>
            <p className="pricing-note">Pricing is indicative and subject to confirmation based on project scope.</p>
          </div>
        </section>

        <section id="faq" className="faq-section section-shell">
          <div className="faq-heading">
            <span className="eyebrow">Questions, answered</span>
            <h2>The important details—before the call.</h2>
            <p>
              Have a question we missed? Email <a href={`mailto:${INDIA_EMAIL}`}>{INDIA_EMAIL}</a>.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index
              return (
                <article className={isOpen ? 'faq-item is-open' : 'faq-item'} key={question}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                    <span>{question}</span><i>{isOpen ? '−' : '+'}</i>
                  </button>
                  <div className="faq-answer"><p>{answer}</p></div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="final-cta">
          <div className="section-shell final-cta-inner">
            <div>
              <span className="eyebrow light-text">Let&apos;s talk about your business</span>
              <h2>Get a website that works for you.</h2>
            </div>
            <div>
              <p>Book a free 15-minute call. We&apos;ll walk through what you need and what it would cost.</p>
              <a className="button button-white" href={CALENDLY_URL} target="_blank" rel="noreferrer">Book your free call <ArrowUpRight /></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="section-shell footer-grid">
          <div>
            <Logo />
            <p>Custom-coded websites and AI automation for businesses in India. A division of Orbit Websites.</p>
          </div>
          <div>
            <span>Contact</span>
            {INDIA_PHONE_TEL ? <a href={`tel:${INDIA_PHONE_TEL}`}>{INDIA_PHONE_DISPLAY}</a> : <span>{INDIA_PHONE_DISPLAY}</span>}
            <a href={`mailto:${INDIA_EMAIL}`}>{INDIA_EMAIL}</a>
          </div>
          <div>
            <span>Explore</span>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer">Book a call</a>
          </div>
        </div>
        <div className="section-shell footer-bottom">
          <span>© {new Date().getFullYear()} Orbit Websites India</span>
          <span>A division of Orbit Websites</span>
        </div>
      </footer>
    </div>
  )
}
