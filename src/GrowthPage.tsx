import { useEffect, useState } from 'react'
import './GrowthPage.css'

const CALENDLY_URL = "https://calendly.com/orbitwebsites/30min";

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const Phone = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const Logo = () => (
  <a className="brand" href="#top" aria-label="Orbit Growth Systems home">
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
      <small>GROWTH SYSTEMS</small>
    </span>
  </a>
);

const Nav = () => {
  const [open, setOpen] = useState(false);

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
        <nav id="primary-navigation" className={open ? "nav-links is-open" : "nav-links"}>
          <div className="nav-cluster nav-left">
            <a href="#system" onClick={() => setOpen(false)}>The system</a>
            <a href="#demo" onClick={() => setOpen(false)}>Live demo</a>
          </div>
          <div className="nav-cluster nav-right">
            <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
            <a className="nav-cta" href={CALENDLY_URL} target="_blank" rel="noreferrer">
              Book a free audit <ArrowUpRight />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

const FlowDemo = () => {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    if (step >= 4) {
      const resetTimer = window.setTimeout(() => setRunning(false), 900);
      return () => window.clearTimeout(resetTimer);
    }

    const timer = window.setTimeout(() => setStep((current) => current + 1), 700);
    return () => window.clearTimeout(timer);
  }, [running, step]);

  const start = () => {
    setStep(0);
    setRunning(true);
  };

  const stages = [
    ["01", "New lead", "AC stopped cooling · Princeton, NJ"],
    ["02", "Instant reply", "Text sent in 42 seconds"],
    ["03", "AI qualification", "Issue, location and urgency captured"],
    ["04", "Job booked", "Tomorrow · 9:30 AM"],
  ];

  return (
    <div className="flow-demo">
      <div className="demo-topline">
        <div>
          <span className="eyebrow muted">Interactive workflow</span>
          <h3>Turn a web inquiry into a booked visit.</h3>
        </div>
        <button className="demo-trigger" type="button" onClick={start} disabled={running}>
          <span className={running ? "pulse-dot active" : "pulse-dot"} />
          {running ? "System running" : "Run the demo"}
        </button>
      </div>
      <div className="flow-line" aria-live="polite">
        {stages.map(([number, title, detail], index) => {
          const active = step >= index + 1;
          return (
            <div className={active ? "flow-step is-active" : "flow-step"} key={title}>
              <div className="flow-node">
                {active ? <Check /> : number}
              </div>
              <div>
                <strong>{title}</strong>
                <span>{detail}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="demo-footnote">
        <span>Demo data</span>
        Your actual workflow is connected to your website, phone, calendar and CRM.
      </div>
    </div>
  );
};

const MetricCard = () => (
  <div className="metric-card" aria-label="Sample lead response dashboard">
    <div className="metric-header">
      <div>
        <span className="mini-label">Lead response dashboard</span>
        <strong>This month</strong>
      </div>
      <span className="status-pill"><i /> Live</span>
    </div>
    <div className="hero-metric">
      <span>Median response time</span>
      <strong>0:42</strong>
      <small>minutes</small>
    </div>
    <div className="metric-grid">
      <div>
        <span>Leads answered</span>
        <strong>48</strong>
        <small>100%</small>
      </div>
      <div>
        <span>Visits booked</span>
        <strong>18</strong>
        <small>+7 this month</small>
      </div>
    </div>
    <div className="activity-row">
      <span className="activity-avatar">JS</span>
      <div>
        <strong>Emergency cooling request</strong>
        <span>Qualified and booked automatically</span>
      </div>
      <small>Now</small>
    </div>
    <span className="demo-label">SAMPLE DATA</span>
  </div>
);

const services = [
  {
    number: "01",
    title: "Respond before another company does",
    body: "Every website form, ad lead and missed call gets an immediate, helpful response—even while your crew is on a job.",
    stat: "Under 60 sec",
    label: "target response time",
  },
  {
    number: "02",
    title: "Qualify and book the right jobs",
    body: "The system asks the important questions, routes emergencies and places qualified appointments directly on your calendar.",
    stat: "24 / 7",
    label: "lead coverage",
  },
  {
    number: "03",
    title: "Follow up without chasing",
    body: "SMS, email and voice follow-ups keep working until the prospect responds, books or asks to stop.",
    stat: "1 dashboard",
    label: "for every conversation",
  },
  {
    number: "04",
    title: "Earn more real reviews",
    body: "After a completed job, customers receive a simple review request at the right moment—with clear tracking for your team.",
    stat: "Always on",
    label: "reputation follow-up",
  },
];

const tiers = [
  {
    name: "Launch",
    price: "$1,500",
    description: "For smaller HVAC teams that need every new lead handled consistently.",
    features: [
      "Instant lead response",
      "SMS and email follow-up",
      "Calendar booking",
      "CRM connection",
      "Live performance dashboard",
      "Monitoring and bug fixes",
    ],
  },
  {
    name: "Growth",
    price: "$2,500",
    description: "For busy teams losing calls and opportunities after hours.",
    featured: true,
    features: [
      "Everything in Launch",
      "AI phone receptionist",
      "Missed-call recovery",
      "Lead qualification and routing",
      "Review-request campaigns",
      "Monthly performance report",
    ],
  },
  {
    name: "Scale",
    price: "$5,000",
    description: "For established operators with multiple teams, campaigns or locations.",
    features: [
      "Everything in Growth",
      "Multi-location routing",
      "Custom workflow integrations",
      "Lead reactivation campaigns",
      "Advanced reporting",
      "Priority support",
    ],
  },
];

const faqs = [
  ["Is there a setup fee?", "No. Your build is included with a three-month minimum engagement. Monthly service is paid at the beginning of each billing period."],
  ["How quickly can we go live?", "Most systems are designed, connected and tested within 15 days after we receive the required business information and account access."],
  ["Does this replace our staff?", "No. It handles repetitive first-response and follow-up work so your team can focus on customers, estimates and completed jobs."],
  ["Can it work with our existing website and CRM?", "Usually, yes. We connect to your current lead sources, calendar and CRM where supported. We confirm compatibility during the free audit."],
  ["Are calls and messages unlimited?", "Plans include fair-use allowances. If your volume is unusually high, we show the usage clearly and agree on any additional costs before they apply."],
  ["What happens if we cancel?", "Your business data and website remain yours. Orbit retains its reusable automation templates and internal tooling."],
  ["Can we request additional automations?", "Small fixes and improvements are included. Entirely new systems are scoped and quoted separately so your core service stays reliable."],
];

export default function GrowthPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="growth-site">
      <Nav />
      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy reveal reveal-one">
            <div className="availability"><span /> Now accepting 3 founding HVAC partners</div>
            <h1>Every lead answered. <em>Every follow-up handled.</em></h1>
            <p>
              Orbit builds and manages the lead-response system behind your HVAC business—so more inquiries become booked jobs without adding more office work.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={CALENDLY_URL} target="_blank" rel="noreferrer">
                Book your free lead audit <ArrowUpRight />
              </a>
              <a className="text-link" href="#demo">See how it works <span>↓</span></a>
            </div>
            <div className="hero-proof">
              <div className="proof-faces" aria-hidden="true">
                <span>HV</span><span>AC</span><span>+3</span>
              </div>
              <p><strong>Built in 15 days.</strong><br />Monitored by real developers.</p>
            </div>
          </div>
          <div className="hero-visual reveal reveal-two">
            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <span className="floating-chip chip-one">Website lead</span>
            <span className="floating-chip chip-two">AI call</span>
            <span className="floating-chip chip-three">Booked ✓</span>
            <MetricCard />
          </div>
        </section>

        <section className="credibility-bar">
          <div className="section-shell credibility-inner">
            <span>From the team behind</span>
            <strong>ORBIT WEBSITES</strong>
            <i />
            <span>Custom-coded in New Jersey</span>
            <i />
            <span>Built for independent HVAC companies</span>
          </div>
        </section>

        <section className="problem-section section-shell">
          <div className="section-intro">
            <span className="eyebrow">The expensive gap</span>
            <h2>Your marketing worked.<br /><em>Then nobody answered.</em></h2>
          </div>
          <div className="problem-layout">
            <p className="problem-lede">
              Homeowners rarely wait. When your team is driving, diagnosing or installing, a good lead can quietly become somebody else&apos;s job.
            </p>
            <div className="problem-list">
              <div><span>01</span><p>New web leads sit untouched until the office catches up.</p></div>
              <div><span>02</span><p>Missed calls disappear without a text or callback.</p></div>
              <div><span>03</span><p>Estimates and old leads never receive consistent follow-up.</p></div>
            </div>
          </div>
        </section>

        <section id="system" className="system-section">
          <div className="section-shell">
            <div className="section-intro light">
              <span className="eyebrow">The Orbit system</span>
              <h2>One reliable system between<br />a new inquiry and a booked job.</h2>
              <p>Installed around the tools you already use. Managed by us every month.</p>
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

        <section id="demo" className="demo-section section-shell">
          <div className="section-intro compact">
            <span className="eyebrow">See the handoff</span>
            <h2>A lead comes in.<br />Orbit gets to work.</h2>
          </div>
          <FlowDemo />
        </section>

        <section className="process-section section-shell">
          <div className="process-copy">
            <span className="eyebrow">Live in 15 days</span>
            <h2>You run the company.<br />We handle the system.</h2>
            <p>No software maze and no six-week discovery phase. You give us the facts about your business; we build, test and monitor the workflow.</p>
            <a className="text-link dark" href={CALENDLY_URL} target="_blank" rel="noreferrer">Talk through your workflow <ArrowUpRight /></a>
          </div>
          <ol className="process-list">
            <li>
              <span>Day 01</span>
              <div><strong>Map the gaps</strong><p>We review where leads arrive, how your team responds and where opportunities are getting lost.</p></div>
            </li>
            <li>
              <span>Days 02–10</span>
              <div><strong>Build and connect</strong><p>We create the messaging, voice logic, booking rules, dashboard and integrations.</p></div>
            </li>
            <li>
              <span>Days 11–15</span>
              <div><strong>Test and launch</strong><p>Every route is tested before your system goes live. Then we keep watching it.</p></div>
            </li>
          </ol>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="section-shell">
            <div className="section-intro pricing-heading">
              <span className="eyebrow">Simple monthly partnership</span>
              <h2>No setup fee.<br /><em>One system that keeps working.</em></h2>
              <p>Choose a starting point after your free lead-response audit. Every plan has a three-month minimum and fair-use limits.</p>
            </div>
            <div className="pricing-grid">
              {tiers.map((tier) => (
                <article className={tier.featured ? "price-card is-featured" : "price-card"} key={tier.name}>
                  {tier.featured && <span className="popular">Best fit for growing teams</span>}
                  <h3>{tier.name}</h3>
                  <p>{tier.description}</p>
                  <div className="price"><strong>{tier.price}</strong><span>/ month</span></div>
                  <ul>
                    {tier.features.map((feature) => <li key={feature}><Check /> {feature}</li>)}
                  </ul>
                  <a className={tier.featured ? "button button-primary" : "button button-outline"} href={CALENDLY_URL} target="_blank" rel="noreferrer">
                    Book a free audit <ArrowUpRight />
                  </a>
                </article>
              ))}
            </div>
            <p className="pricing-note">Advertising spend and unusually high phone or messaging usage are not included. We confirm your expected usage before launch.</p>
          </div>
        </section>

        <section className="founding-section section-shell">
          <div className="founding-card">
            <span className="eyebrow light-text">Founding partner offer</span>
            <h2>Help shape the system.<br />Keep founding pricing.</h2>
            <p>We&apos;re accepting three independent HVAC companies at $1,500 per month in exchange for direct feedback and permission to document the results. No inflated promises—just a system we can measure together.</p>
            <a className="button button-white" href={CALENDLY_URL} target="_blank" rel="noreferrer">See if your company qualifies <ArrowUpRight /></a>
            <div className="founding-count"><strong>03</strong><span>partner spots</span></div>
          </div>
        </section>

        <section id="faq" className="faq-section section-shell">
          <div className="faq-heading">
            <span className="eyebrow">Questions, answered</span>
            <h2>The important details—before the call.</h2>
            <p>Have a question we missed? Call <a href="tel:+16096628052">609 662 8052</a> or email <a href="mailto:orbitboyzz@gmail.com">orbitboyzz@gmail.com</a>.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <article className={isOpen ? "faq-item is-open" : "faq-item"} key={question}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                    <span>{question}</span><i>{isOpen ? "−" : "+"}</i>
                  </button>
                  <div className="faq-answer"><p>{answer}</p></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="final-cta">
          <div className="section-shell final-cta-inner">
            <div>
              <span className="eyebrow light-text">Your next lead could arrive tonight</span>
              <h2>Make sure somebody answers.</h2>
            </div>
            <div>
              <p>Book a free 15-minute audit. We&apos;ll map your current lead flow and show you exactly where automation could help.</p>
              <a className="button button-white" href={CALENDLY_URL} target="_blank" rel="noreferrer">Book your free audit <ArrowUpRight /></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="section-shell footer-grid">
          <div>
            <Logo />
            <p>Lead-response systems for independent HVAC companies. Designed, built and monitored in New Jersey.</p>
          </div>
          <div>
            <span>Contact</span>
            <a href="tel:+16096628052">609 662 8052</a>
            <a href="mailto:orbitboyzz@gmail.com">orbitboyzz@gmail.com</a>
          </div>
          <div>
            <span>Explore</span>
            <a href="#system">The system</a>
            <a href="#pricing">Pricing</a>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer">Book an audit</a>
          </div>
        </div>
        <div className="section-shell footer-bottom">
          <span>© {new Date().getFullYear()} Orbit Growth Systems</span>
          <span>A service from Orbit Websites</span>
        </div>
      </footer>

      <a className="mobile-call" href="tel:+16096628052" aria-label="Call Orbit Growth Systems">
        <Phone /> <span>Call Orbit</span>
      </a>
    </div>
  )
}

