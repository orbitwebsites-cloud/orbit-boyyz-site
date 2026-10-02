import type { CSSProperties, ReactNode } from 'react'
import { Inter } from 'next/font/google'
import type { DemoBusiness, DemoTrade } from '@/content/demos'
import {
  cleanTown,
  demoCopy,
  nearbyTowns,
  phoneLink,
  restaurantCopy,
  serviceCopy,
  servicePromises,
  serviceSteps,
  type DemoCard,
  type DemoContext,
  type DemoFaq,
  type ServiceTradeCopy,
} from '@/content/demoCopy'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'

// The lead's preview site: a neutral light theme with their own brand color.
// Deliberately shares nothing visual with Orbit's dark theme (fonts, colors,
// motion) except the preview banner, which is Orbit talking.

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const YEAR = new Date().getFullYear()
const WRAP = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type Phone = ReturnType<typeof phoneLink>
type NavLink = [label: string, href: string]

const list = (items: string[]) => new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(items)

/* ---------- Brand color ---------- */

type Rgb = [number, number, number]
const INK = '#0f172a'

function rgb(hex: string): Rgb | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1]
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb
}

function luminance([r, g, b]: Rgb) {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const toHex = (c: Rgb) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`

/** Lead accent (or trade default) + readable text on it + a shade dark enough for text on white. */
function palette(accent: string | undefined, fallback: string) {
  const base = (accent && rgb(accent)) || (rgb(fallback) as Rgb)
  const L = luminance(base)
  const onAccent = contrast(L, 1) >= contrast(L, luminance(rgb(INK) as Rgb)) ? '#ffffff' : INK
  let text = base
  for (let i = 0; i < 12 && contrast(luminance(text), 1) < 4.5; i++) text = text.map((v) => v * 0.85) as Rgb
  return {
    '--demo-accent': toHex(base),
    '--demo-on-accent': onAccent,
    '--demo-accent-text': toHex(text),
  } as CSSProperties
}

/* ---------- Icons ---------- */

type IconName =
  | 'phone'
  | 'check'
  | 'pin'
  | 'star'
  | 'clock'
  | 'plus'
  | 'thermometer'
  | 'droplet'
  | 'bolt'
  | 'home'
  | 'leaf'
  | 'hammer'
  | 'utensils'
  | 'wrench'

const ICONS: Record<IconName, ReactNode> = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  thermometer: <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />,
  droplet: <path d="M12 2.7S6 9.3 6 13.7a6 6 0 0 0 12 0c0-4.4-6-11-6-11z" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  home: (
    <>
      <path d="m3 10.5 9-7.5 9 7.5" />
      <path d="M5 9v12h14V9" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  hammer: (
    <>
      <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" />
      <path d="m18 15 4-4" />
      <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-1.13a6 6 0 0 0-2.98-.87H9l.92.82A6.18 6.18 0 0 1 12 9.44V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
    </>
  ),
  utensils: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
}

const TRADE_ICON: Record<DemoTrade, IconName> = {
  hvac: 'thermometer',
  plumbing: 'droplet',
  electrical: 'bolt',
  roofing: 'home',
  landscaping: 'leaf',
  remodeling: 'hammer',
  restaurant: 'utensils',
  general: 'wrench',
}

function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {ICONS[name]}
    </svg>
  )
}

/* ---------- Building blocks ---------- */

function initials(name: string) {
  const words = name
    .replace(/['’]/g, '')
    .split(/[^A-Za-z0-9]+/)
    .filter((w) => w && !/^(the|and|of|llc|inc|co)$/i.test(w))
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? name).slice(0, 2)).toUpperCase()
}

function Brand({ name, sub }: { name: string; sub: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--demo-accent)] text-sm font-extrabold tracking-wide text-[var(--demo-on-accent)]"
      >
        {initials(name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-bold leading-tight text-slate-900">{name}</span>
        <span className="block truncate text-xs text-slate-500">{sub}</span>
      </span>
    </span>
  )
}

const BTN_SIZE = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-7 text-lg',
}

/** Click-to-call — always the LEAD's number. */
function CallButton({
  phone,
  size = 'md',
  label,
  className,
}: {
  phone: Phone
  size?: keyof typeof BTN_SIZE
  label?: ReactNode
  className?: string
}) {
  return (
    <a
      href={phone.href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--demo-accent)] font-semibold text-[var(--demo-on-accent)] shadow-sm transition hover:brightness-110',
        BTN_SIZE[size],
        className,
      )}
    >
      <Icon name="phone" className="h-[1.1em] w-[1.1em]" />
      {label ?? `Call ${phone.display}`}
    </a>
  )
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex h-14 items-center rounded-full border border-slate-300 bg-white px-7 text-lg font-semibold text-slate-900 transition hover:border-slate-400"
    >
      {children}
    </a>
  )
}

function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
}: {
  eyebrow: string
  title: string
  intro?: string
  center?: boolean
}) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--demo-accent-text)]">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-slate-600">{intro}</p>}
    </div>
  )
}

/** Dashed slot for facts only the owner can give us (reviews, hours, menu). Never filled with made-up content. */
function Slot({ label, lines = 3, children }: { label: string; lines?: number; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
      {children}
      <div className="space-y-2.5" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="h-2.5 rounded-full bg-slate-200" style={{ width: `${92 - i * 18}%` }} />
        ))}
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  )
}

function PreviewBanner({ name, slug }: { name: string; slug: string }) {
  const contact = `${site.url}/contact?demo=${encodeURIComponent(slug)}`
  return (
    <aside aria-label="Website preview notice" className="sticky top-0 z-50 bg-[#060606] text-[#f4efe6]">
      <p className={cn(WRAP, 'py-2.5 text-center text-[13px] leading-snug sm:text-sm')}>
        <a href={contact} className="underline-offset-4 hover:underline">
          Free preview built for <strong className="font-semibold">{name}</strong> by Orbit Websites — not live yet. Want it?
        </a>{' '}
        <a href={site.phoneHref} className="whitespace-nowrap font-semibold text-[#d6b36a] underline underline-offset-4">
          {`Call ${site.phone}`}
        </a>
      </p>
    </aside>
  )
}

function SiteHeader({ name, sub, phone, links }: { name: string; sub: string; phone: Phone; links: NavLink[] }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className={cn(WRAP, 'flex h-16 items-center justify-between gap-4 md:h-20')}>
        <a href="#top" className="min-w-0">
          <Brand name={name} sub={sub} />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-slate-600">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-slate-900">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <CallButton
          phone={phone}
          size="sm"
          className="shrink-0"
          label={
            <>
              <span className="sm:hidden">Call</span>
              <span className="hidden sm:inline">{phone.display}</span>
            </>
          }
        />
      </div>
    </header>
  )
}

function Hero({
  trade,
  eyebrow,
  headline,
  sub,
  actions,
  chips,
  aside,
}: {
  trade: DemoTrade
  eyebrow: string
  headline: string
  sub: string
  actions: ReactNode
  chips: string[]
  aside: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--demo-tint)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[var(--demo-accent)] opacity-[0.09] blur-3xl"
      />
      <div className={cn(WRAP, 'relative grid grid-cols-1 gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center')}>
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--demo-accent-text)] shadow-sm ring-1 ring-slate-200">
            <Icon name={TRADE_ICON[trade]} className="h-4 w-4" />
            {eyebrow}
          </p>
          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
            {headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{sub}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">{actions}</div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-700">
            {chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-[var(--demo-accent-text)]" />
                {chip}
              </li>
            ))}
          </ul>
        </div>
        {aside}
      </div>
    </section>
  )
}

function CtaBand({ id, eyebrow, title, copy, phone, label }: { id?: string; eyebrow: string; title: string; copy: string; phone: Phone; label: string }) {
  return (
    <section id={id} className="scroll-mt-16 bg-[var(--demo-accent)] text-[var(--demo-on-accent)]">
      <div className={cn(WRAP, 'flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16')}>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] opacity-80">{eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg opacity-90">{copy}</p>
        </div>
        <a
          href={phone.href}
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-lg font-bold text-slate-900 shadow-lg transition hover:bg-slate-100"
        >
          <Icon name="phone" />
          {label}
        </a>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-16 bg-white py-20 md:py-24">
      <div className={WRAP}>
        <SectionHeading
          eyebrow="Reviews"
          title="What our customers say"
          intro="Preview note: your real Google reviews go here. We never put made-up reviews on your site."
          center
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Slot key={i} label="Your Google reviews appear here">
              <div className="mb-5 flex gap-1 text-slate-300" aria-hidden="true">
                {Array.from({ length: 5 }, (_, s) => (
                  <Icon key={s} name="star" className="h-5 w-5" />
                ))}
              </div>
            </Slot>
          ))}
        </div>
      </div>
    </section>
  )
}

function TownChips({ town, areas }: { town: string; areas: string[] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      <li className="inline-flex items-center gap-2 rounded-full bg-[var(--demo-accent)] px-4 py-2 font-semibold text-[var(--demo-on-accent)]">
        <Icon name="pin" className="h-4 w-4" />
        {`${town}, NJ`}
      </li>
      {areas.map((area) => (
        <li key={area} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700">
          <Icon name="pin" className="h-4 w-4 text-[var(--demo-accent-text)]" />
          {area}
        </li>
      ))}
    </ul>
  )
}

function Faq({ items }: { items: DemoFaq[] }) {
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-20 md:py-24">
      <div className={WRAP}>
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions we hear a lot" center />
          <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {items.map(({ q, a }) => (
              <details key={q} className="group px-5 py-5 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-slate-900">
                  {q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--demo-tint-strong)] text-[var(--demo-accent-text)] transition-transform group-open:rotate-45">
                    <Icon name="plus" className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ClosingCta({ title, copy, phone, label }: { title: string; copy: string; phone: Phone; label?: string }) {
  return (
    <section className="bg-slate-900 py-20 text-white md:py-24">
      <div className={cn(WRAP, 'flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between')}>
        <div className="max-w-2xl">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-slate-300">{copy}</p>
        </div>
        <CallButton phone={phone} size="lg" label={label} className="shrink-0" />
      </div>
    </section>
  )
}

function SiteFooter({
  name,
  sub,
  town,
  areas,
  phone,
  links,
}: {
  name: string
  sub: string
  town: string
  areas: string[]
  phone: Phone
  links: NavLink[]
}) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className={cn(WRAP, 'grid grid-cols-1 gap-10 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]')}>
        <div>
          <Brand name={name} sub={sub} />
          <p className="mt-5 max-w-sm text-sm text-slate-600">{`Serving ${list([town, ...areas])}, NJ.`}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <a href={phone.href} className="font-semibold text-slate-900 hover:text-[var(--demo-accent-text)]">
                {phone.display}
              </a>
            </li>
            <li>{`${town}, New Jersey`}</li>
          </ul>
        </div>
        <nav aria-label="Site links">
          <p className="text-sm font-semibold text-slate-900">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="hover:text-slate-900">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-200">
        <p className={cn(WRAP, 'py-6 text-sm text-slate-500')}>{`© ${YEAR} ${name.replace(/\.$/, '')}. All rights reserved.`}</p>
      </div>
    </footer>
  )
}

/** Thumb-reach call bar on phones — the lead's number. */
function MobileCallBar({ phone }: { phone: Phone }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <CallButton phone={phone} className="w-full" />
    </div>
  )
}

/* ---------- Trade variants ---------- */

type VariantProps = { demo: DemoBusiness; ctx: DemoContext; phone: Phone; areas: string[] }

const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s)

/** The lead's own service names; reuse our copy when a name matches a default card. */
function servicesFor(titles: string[] | undefined, defaults: DemoCard[]): DemoCard[] {
  if (!titles?.length) return defaults
  return titles.map((raw) => {
    const title = raw.trim()
    const match = defaults.find((card) => card.title.toLowerCase() === title.toLowerCase())
    return match ?? { title, copy: `Need ${lowerFirst(title)}? We’ll walk you through the options and give you a clear price before any work starts.` }
  })
}

function ServiceSite({ demo, ctx, phone, areas, copy }: VariantProps & { copy: ServiceTradeCopy }) {
  const { name, town } = ctx
  const services = servicesFor(demo.services, copy.services)
  const areaLine = areas.length ? `Proudly serving ${town} and nearby ${list(areas)}.` : `Proudly serving ${town} and the surrounding area.`
  const faqs: DemoFaq[] = [
    ...copy.faqs(ctx),
    {
      q: 'What areas do you serve?',
      a: `${areas.length ? `We serve ${town}, ${list(areas)}.` : `We serve ${town} and the surrounding area.`} Not sure if you’re in our area? Just call and ask.`,
    },
  ]

  return (
    <>
      <Hero
        trade={demo.trade}
        eyebrow={`${copy.label} · ${town}, NJ`}
        headline={copy.headline(ctx)}
        sub={demo.tagline ?? copy.sub}
        actions={
          <>
            <CallButton phone={phone} size="lg" />
            <SecondaryLink href="#services">Our services</SecondaryLink>
          </>
        }
        chips={['Upfront pricing', 'Clean, respectful crews', `Serving ${town} & nearby`]}
        aside={
          <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">How it works</p>
            <ol className="mt-6 space-y-6">
              {serviceSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--demo-tint-strong)] font-bold text-[var(--demo-accent-text)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href={phone.href}
              className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 transition hover:ring-slate-300"
            >
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{`Call ${name}`}</span>
                <span className="block text-xl font-bold text-slate-900">{phone.display}</span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--demo-accent)] text-[var(--demo-on-accent)]">
                <Icon name="phone" />
              </span>
            </a>
          </div>
        }
      />

      <section id="services" className="scroll-mt-16 bg-white py-20 md:py-24">
        <div className={WRAP}>
          <SectionHeading
            eyebrow="Services"
            title="What we can do for you"
            intro={`Here’s what we handle for homeowners in ${town} and nearby towns. Don’t see your job listed? Just call.`}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--demo-tint-strong)] text-[var(--demo-accent-text)]">
                  <Icon name={TRADE_ICON[demo.trade]} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-slate-600">{service.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand eyebrow={copy.urgent.eyebrow} title={copy.urgent.title} copy={copy.urgent.copy(ctx)} phone={phone} label={`Call ${phone.display}`} />

      <section id="why-us" className="scroll-mt-16 bg-slate-50 py-20 md:py-24">
        <div className={WRAP}>
          <SectionHeading eyebrow={`Why ${name}`} title="Service the way it should be" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicePromises(ctx).map((promise) => (
              <div key={promise.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--demo-accent)] text-[var(--demo-on-accent)]">
                  <Icon name="check" />
                </span>
                <h3 className="mt-5 font-bold text-slate-900">{promise.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{promise.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      <section id="service-area" className="scroll-mt-16 bg-slate-50 py-20 md:py-24">
        <div className={cn(WRAP, 'grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center')}>
          <SectionHeading eyebrow="Service area" title={`Serving ${town} and nearby towns`} intro={areaLine} />
          <TownChips town={town} areas={areas} />
        </div>
      </section>

      <Faq items={faqs} />

      <ClosingCta title="Ready when you are." copy={`Call ${name} for a clear price and a time that works for you.`} phone={phone} />
    </>
  )
}

function RestaurantSite({ demo, ctx, phone, areas }: VariantProps) {
  const copy = restaurantCopy
  const { name, town } = ctx
  const favorites = (demo.services ?? []).map((s) => s.trim()).filter(Boolean)
  const nearby = areas.length ? `A short drive from ${list(areas)}.` : 'Right in the neighborhood.'

  return (
    <>
      <Hero
        trade={demo.trade}
        eyebrow={`${copy.label} · ${town}, NJ`}
        headline={copy.headline(ctx)}
        sub={demo.tagline ?? copy.sub}
        actions={
          <>
            <CallButton phone={phone} size="lg" label="Call to order" />
            <SecondaryLink href="#menu">See the menu</SecondaryLink>
          </>
        }
        chips={copy.promises.map((p) => p.title)}
        aside={
          <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Order ahead</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">Call, order, pick up.</p>
            <p className="mt-2 text-slate-600">{copy.order.copy(ctx)}</p>
            <CallButton phone={phone} className="mt-6 w-full" />
            <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 p-4">
              <Icon name="clock" className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-semibold text-slate-500">Today’s hours appear here</span>
            </div>
          </div>
        }
      />

      <section id="menu" className="scroll-mt-16 bg-white py-20 md:py-24">
        <div className={WRAP}>
          <SectionHeading eyebrow="Menu" title="From our kitchen" intro="Preview note: your full menu, prices and photos go here." />
          <div className={cn('mt-12 grid grid-cols-1 gap-5', favorites.length > 0 && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]')}>
            {favorites.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Icon name="utensils" className="h-5 w-5 text-[var(--demo-accent-text)]" />
                  House favorites
                </h3>
                <ul className="mt-5 divide-y divide-slate-100">
                  {favorites.map((dish) => (
                    <li key={dish} className="flex items-baseline gap-3 py-3">
                      <span className="font-semibold text-slate-900">{dish}</span>
                      <span aria-hidden="true" className="flex-1 border-b border-dotted border-slate-300" />
                      <span className="text-sm text-slate-400">$ —</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-slate-500">Descriptions and prices come from your real menu.</p>
              </div>
            )}
            <div className={cn('grid gap-5 sm:grid-cols-2', favorites.length === 0 && 'lg:grid-cols-4')}>
              {copy.menuSections.map((section) => (
                <Slot key={section} label="Your dishes & prices appear here">
                  <h3 className="mb-5 font-bold text-slate-900">{section}</h3>
                </Slot>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand id="order" eyebrow={copy.order.eyebrow} title={copy.order.title} copy={copy.order.copy(ctx)} phone={phone} label="Call to order" />

      <section id="hours" className="scroll-mt-16 bg-slate-50 py-20 md:py-24">
        <div className={WRAP}>
          <SectionHeading eyebrow="Visit us" title={`Your neighborhood spot in ${town}`} />
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Icon name="clock" className="h-5 w-5 text-[var(--demo-accent-text)]" />
                Hours
              </h3>
              <ul className="mt-5 space-y-3">
                {DAYS.map((day) => (
                  <li key={day} className="flex items-center justify-between gap-6 text-sm">
                    <span className="font-medium text-slate-700">{day}</span>
                    <span aria-hidden="true" className="h-2.5 w-28 rounded-full bg-slate-200" />
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-semibold text-slate-500">Your hours appear here</p>
            </div>
            <div className="flex flex-col rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Icon name="pin" className="h-5 w-5 text-[var(--demo-accent-text)]" />
                {`Find us in ${town}, NJ`}
              </h3>
              <p className="mt-3 text-slate-600">{nearby}</p>
              <div className="mt-6">
                <TownChips town={town} areas={areas} />
              </div>
              <div className="mt-auto pt-8">
                <CallButton phone={phone} label={`Call ${phone.display}`} />
              </div>
            </div>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {copy.promises.map((promise) => (
              <li key={promise.title} className="flex gap-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--demo-accent)] text-[var(--demo-on-accent)]">
                  <Icon name="check" />
                </span>
                <span>
                  <span className="block font-bold text-slate-900">{promise.title}</span>
                  <span className="mt-1 block text-sm text-slate-600">{promise.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Reviews />

      <Faq items={copy.faqs(ctx)} />

      <ClosingCta
        title="Hungry yet?"
        copy={`Call ${name} at ${phone.display} and your order will be ready when you get here.`}
        phone={phone}
        label="Call to order"
      />
    </>
  )
}

/* ---------- Page ---------- */

const SERVICE_LINKS: NavLink[] = [
  ['Services', '#services'],
  ['Why us', '#why-us'],
  ['Reviews', '#reviews'],
  ['Service area', '#service-area'],
  ['FAQ', '#faq'],
]

const RESTAURANT_LINKS: NavLink[] = [
  ['Menu', '#menu'],
  ['Order', '#order'],
  ['Hours', '#hours'],
  ['Reviews', '#reviews'],
  ['FAQ', '#faq'],
]

/** A lead's preview homepage. Their name, town and phone everywhere; Orbit only in the top banner. */
export function DemoSite({ demo }: { demo: DemoBusiness }) {
  const town = cleanTown(demo.town)
  const phone = phoneLink(demo.phone)
  const ctx: DemoContext = { name: demo.name, town, phone: phone.display }
  const copy = demoCopy(demo.trade)
  const areas = nearbyTowns(demo)
  const sub = `${copy.label} · ${town}, NJ`
  const links = demo.trade === 'restaurant' ? RESTAURANT_LINKS : SERVICE_LINKS
  const variant = { demo, ctx, phone, areas }

  return (
    <div
      id="top"
      className={cn(inter.className, 'demo-site min-h-svh bg-white pb-[4.75rem] text-slate-900 antialiased md:pb-0')}
      style={palette(demo.accent, copy.accent)}
    >
      <PreviewBanner name={demo.name} slug={demo.slug} />
      <SiteHeader name={demo.name} sub={sub} phone={phone} links={links} />
      {demo.trade === 'restaurant' ? <RestaurantSite {...variant} /> : <ServiceSite {...variant} copy={serviceCopy[demo.trade]} />}
      <SiteFooter name={demo.name} sub={sub} town={town} areas={areas} phone={phone} links={links} />
      <MobileCallBar phone={phone} />
    </div>
  )
}
