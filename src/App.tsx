/* eslint-disable react-refresh/only-export-components */
import { ArrowRight, Check, ExternalLink, Menu, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import './App.css'

const CALENDAR_LINK = 'https://calendly.com/orbitwebsites/30min'
const EMAIL = 'orbitboyzz@gmail.com'

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>
  gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
}

function trackClick(label: string, href: string) {
  if (typeof window === 'undefined') return
  const analyticsWindow = window as AnalyticsWindow
  const payload = { event_category: 'lead', label, href, page_path: window.location.pathname }
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? []
  analyticsWindow.dataLayer.push({ event: 'cta_click', ...payload })
  analyticsWindow.gtag?.('event', 'cta_click', payload)
}

const projects = [
  {
    name: 'Weichert Princeton Pages',
    category: 'Real estate',
    description: 'A focused local property experience built to make listings and contact options easy to find.',
    url: 'https://weichert-princeton-pages.vercel.app/',
  },
  {
    name: 'Real Estate Website',
    category: 'Property services',
    description: 'A modern service website with clear navigation, trust signals, and direct lead paths.',
    url: 'https://real-estate1-tau.vercel.app/',
  },
  {
    name: 'Grand Treats by Tony',
    category: 'Specialty food',
    description: 'A warm, product-led website that helps customers understand the brand and get in touch.',
    url: 'https://grandtreatsbytony.com/',
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Book a call',
    copy: 'Choose a time that works. The first conversation is free and focused on what your business needs.',
  },
  {
    number: '02',
    title: 'Talk directly with us',
    copy: 'You speak personally with the people building your site—no sales handoff and no guessing.',
  },
  {
    number: '03',
    title: 'Choose the direction',
    copy: 'Show us websites you like, choose from our previous work, or let us create a direction for you.',
  },
  {
    number: '04',
    title: 'Pay 50% to begin',
    copy: 'Once the scope and direction are clear, the first half reserves your build and starts the seven-day sprint.',
  },
  {
    number: '05',
    title: 'Launch in 7 days',
    copy: 'Approve the finished site, pay the remaining 50%, and receive your website. Hosting with us is optional.',
  },
]

const plans = [
  {
    price: '$300',
    name: 'Site Care',
    copy: 'For businesses that want us to keep the website online, protected, and handled.',
    features: ['Managed hosting', 'Security and backups', 'Routine content updates'],
  },
  {
    price: '$500',
    name: 'Local Growth',
    copy: 'For businesses that also want steady improvements to local visibility and conversions.',
    features: ['Everything in Site Care', 'Local SEO maintenance', 'Monthly site improvements'],
    featured: true,
  },
  {
    price: '$700',
    name: 'Growth Partner',
    copy: 'For businesses that want active SEO, content support, and closer ongoing attention.',
    features: ['Everything in Local Growth', 'Ongoing SEO and content', 'Priority updates and support'],
  },
]

export const faqs = [
  ['How quickly can my website be ready?', 'Most focused business websites are ready for review within seven days after the first payment and receipt of the required content. Larger scopes may need a different timeline, which we confirm before work begins.'],
  ['How do payments work?', 'You pay 50% after approving the scope and design direction. The remaining 50% is due after you approve the completed website and before the final handoff or launch.'],
  ['Do I have to use your hosting?', 'No. After the final payment, we can hand off the completed website. If you want us to host, maintain, and grow it, optional care plans range from $300 to $700 per month.'],
  ['Can you copy a website I like?', 'We use inspiration to understand the style and experience you want, but we create an original website for your business rather than copying someone else’s work.'],
]

export const blogPosts: Array<{
  slug: string
  title: string
  description: string
  updated: string
  audience: string
  takeaways: string[]
  sections: Array<{ heading: string; body: string }>
}> = []

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Orbit Websites home">
      <img src="/orbit-logo.svg" alt="" width="38" height="38" />
      <span>ORBIT<em>WEBSITES</em></span>
    </a>
  )
}

function PrimaryLink({ href, children, label = 'Primary call to action' }: { href: string; children: React.ReactNode; label?: string }) {
  const external = href.startsWith('http')
  return (
    <a
      className="button button-primary"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      onClick={() => trackClick(label, href)}
    >
      {children}
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo />
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <Menu size={22} />
        </button>
        <nav className={open ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#work" onClick={close}>Our work</a>
          <a href="#process" onClick={close}>How it works</a>
          <a href="#care" onClick={close}>Hosting & SEO</a>
          <a className="nav-cta" href={CALENDAR_LINK} target="_blank" rel="noreferrer" onClick={() => { close(); trackClick('Header booking', CALENDAR_LINK) }}>
            Book a call
          </a>
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <div id="top" className="site-shell">
      <Header />

      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Custom websites for growing businesses</div>
            <h1>A website you’re proud to send people to. <strong>Ready in 7 days.</strong></h1>
            <p className="hero-lede">
              Meet directly with our team, choose a direction you love, and receive a polished website built around your business—without paying the full price upfront.
            </p>
            <div className="hero-actions">
              <PrimaryLink href={CALENDAR_LINK} label="Hero booking">Book your free call</PrimaryLink>
              <a className="button button-secondary" href="#work">See previous work</a>
            </div>
            <div className="hero-proof" aria-label="Service highlights">
              <span><Check size={16} /> 50% to start</span>
              <span><Check size={16} /> 7-day build</span>
              <span><Check size={16} /> You approve before final payment</span>
            </div>
          </div>

          <div className="hero-card" aria-label="The Orbit Websites promise">
            <div className="hero-card-top">
              <span>THE ORBIT PROCESS</span>
              <span className="status"><i /> Accepting projects</span>
            </div>
            <div className="browser-preview">
              <div className="browser-bar"><i /><i /><i /></div>
              <div className="preview-content">
                <span>YOUR BUSINESS</span>
                <h2>Clear. Credible.<br />Built to convert.</h2>
                <div className="preview-line preview-line-long" />
                <div className="preview-line" />
                <div className="preview-button">Get a quote</div>
              </div>
            </div>
            <p>Designed personally. Built quickly. Owned by you.</p>
          </div>
        </section>

        <section className="value-strip" aria-label="Project terms">
          <div><strong>7 days</strong><span>Typical build sprint</span></div>
          <div><strong>50 / 50</strong><span>Simple payment split</span></div>
          <div><strong>$300–$700</strong><span>Optional monthly care</span></div>
          <div><strong>1 team</strong><span>From first call to launch</span></div>
        </section>

        <section className="section section-wrap" id="savings">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow"><span /> The business case</div>
              <h2>A clearer website can pay for itself.</h2>
            </div>
            <p>Your website should make it easier for customers to trust you, understand your offer, and take the next step.</p>
          </div>
          <div className="savings-card">
            <div className="savings-example">
              <TrendingUp size={26} />
              <p>Simple example</p>
              <strong>2 extra customers × $500</strong>
              <span>= $1,000 in additional monthly revenue</span>
            </div>
            <div className="savings-copy">
              <h3>Stop losing good customers to a confusing first impression.</h3>
              <p>
                A professional site can save staff time, reduce repeated questions, and help more visitors contact you. The exact return depends on your traffic, service value, and sales process—we never promise results we cannot prove.
              </p>
              <ul>
                <li><Check size={17} /> Clear services and pricing direction</li>
                <li><Check size={17} /> Faster quote, call, or booking paths</li>
                <li><Check size={17} /> Less time explaining the basics manually</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section section-wrap" id="work">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow"><span /> Previous work</div>
              <h2>Find a direction that feels like you.</h2>
            </div>
            <p>Use our previous projects as inspiration, bring examples you already love, or let us create a fresh direction from scratch.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <a className="project-card" href={project.url} target="_blank" rel="noreferrer" key={project.name} onClick={() => trackClick(`Project: ${project.name}`, project.url)}>
                <div className={`project-visual project-visual-${index + 1}`}>
                  <div className="mini-browser">
                    <div className="mini-nav"><span>{project.name}</span><i /></div>
                    <div className="mini-hero"><small>{project.category}</small><b>{index === 0 ? 'Find your next home.' : index === 1 ? 'Move with confidence.' : 'Made for sweet moments.'}</b><i /></div>
                  </div>
                </div>
                <div className="project-meta">
                  <div><span>{project.category}</span><h3>{project.name}</h3></div>
                  <ExternalLink size={20} />
                </div>
                <p>{project.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="section-wrap">
            <div className="section-heading process-heading">
              <div className="eyebrow light"><span /> How it works</div>
              <h2>From first conversation to finished website.</h2>
              <p>No confusing agency process. You know what happens, when you pay, and what you receive.</p>
            </div>
            <div className="process-list">
              {processSteps.map((step) => (
                <article className="process-step" key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-wrap" id="care">
          <div className="section-heading centered-heading">
            <div className="eyebrow"><span /> After launch</div>
            <h2>Own the site—or let us keep growing it.</h2>
            <p>Hosting is optional. Choose ongoing support only if it makes sense for your business.</p>
          </div>
          <div className="plan-grid">
            {plans.map((plan) => (
              <article className={plan.featured ? 'plan-card plan-featured' : 'plan-card'} key={plan.name}>
                {plan.featured ? <span className="popular">Most popular</span> : null}
                <p className="plan-name">{plan.name}</p>
                <div className="plan-price"><strong>{plan.price}</strong><span>/month</span></div>
                <p>{plan.copy}</p>
                <ul>
                  {plan.features.map((feature) => <li key={feature}><Check size={17} /> {feature}</li>)}
                </ul>
                <a href={CALENDAR_LINK} target="_blank" rel="noreferrer" onClick={() => trackClick(`Plan: ${plan.name}`, CALENDAR_LINK)}>Discuss this plan <ArrowRight size={16} /></a>
              </article>
            ))}
          </div>
          <p className="pricing-note">Your website build is quoted separately after the call. Monthly plans begin only after launch and only if you choose one.</p>
        </section>

        <section className="section section-wrap faq-section">
          <div className="section-heading">
            <div className="eyebrow"><span /> Common questions</div>
            <h2>The important details, upfront.</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span>+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta section-wrap">
          <div>
            <div className="eyebrow light"><span /> Start your project</div>
            <h2>Let’s build a website your business deserves.</h2>
            <p>Book a free call, tell us what you need, and speak directly with the team that will build it.</p>
          </div>
          <PrimaryLink href={CALENDAR_LINK} label="Final booking">Book your free call</PrimaryLink>
        </section>
      </main>

      <footer>
        <div className="footer-inner section-wrap">
          <Logo />
          <p>Custom business websites, built personally and delivered clearly.</p>
          <a href={`mailto:${EMAIL}`} onClick={() => trackClick('Footer email', `mailto:${EMAIL}`)}>{EMAIL}</a>
          <span>© {new Date().getFullYear()} Orbit Websites</span>
        </div>
      </footer>
    </div>
  )
}

export default App
