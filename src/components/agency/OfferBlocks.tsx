import { leadFields } from "@/content/leads";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LEADS_URL } from "@/lib/leadsSite";
import { BookButton } from "./BookButton";

const ADS_STEPS = [
  {
    tag: "To start",
    price: "Pay per booking",
    body: "You pay for each estimate we put on your calendar. No bookings, nothing owed to us.",
    points: ["Landing page built for your ad", "Ads run in your own account", "Every lead texted, qualified and booked"],
    dark: true,
  },
  {
    tag: "Once it is working",
    price: "Monthly retainer",
    body: "When paying per booking adds up to more than a flat fee would, we move you to a retainer so it costs you less.",
    points: ["Same system, flat monthly price", "Quoted from your real booking numbers", "You choose when to switch"],
    dark: false,
  },
];

const LEAD_TERMS = [
  ["$0.20", "per lead"],
  ["10,000+", "new leads every month, minimum plan"],
  ["$2,000", "a month to start (10,000 × $0.20)"],
] as const;

/** Ads management pricing: per booking first, retainer later. */
export function AdsPricing() {
  return (
    <section className="bg-paper px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="alabel text-accent">
          Pricing
        </p>
        <h2 data-reveal className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5.4vw,4.75rem)] font-medium leading-[1] tracking-[-0.04em]">
          You pay when it <em className="font-serif tracking-[-0.02em]">books.</em>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {ADS_STEPS.map((step) => (
            <article
              key={step.price}
              data-reveal
              className={`group flex flex-col rounded-[2rem] p-7 transition-transform duration-500 ease-out hover:-translate-y-2 md:p-10 ${
                step.dark ? "bg-ink text-paper" : "bg-white shadow-[0_0_0_1px_rgba(14,14,14,0.08)]"
              }`}
            >
              <p className="alabel flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-[2.2]" />
                {step.tag}
              </p>
              <h3 className="mt-8 font-serif text-[clamp(2.2rem,4vw,3.4rem)] italic leading-none tracking-[-0.02em]">{step.price}</h3>
              <p className={`mt-4 max-w-[40ch] text-[15px] leading-relaxed ${step.dark ? "text-paper/60" : "text-ink/60"}`}>{step.body}</p>
              <ul className={`mt-8 flex-1 space-y-3 border-t pt-7 text-[15px] ${step.dark ? "border-paper/15" : "border-ink/10"}`}>
                {step.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              <BookButton label="Book a call about your ads" variant={step.dark ? "accent" : "ink"} className="mt-9 self-start" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Cold lead generation: what is in each row, and what it costs. */
export function LeadsOffer() {
  return (
    <section className="bg-paper px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="alabel text-accent">
          In every row
        </p>
        <h2 data-reveal className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5.4vw,4.75rem)] font-medium leading-[1] tracking-[-0.04em]">
          One lead, <em className="font-serif tracking-[-0.02em]">one row.</em>
        </h2>
        <p data-reveal className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink/65">
          Each list is built when you ask for it, from Google Maps listings and each business’s own website. Every email is checked with a
          verification service before the sheet ships.
        </p>
        <dl className="mt-12 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadFields.map((field, i) => (
            <div key={field.key} data-reveal className="flex items-baseline gap-4 border-t border-ink/15 py-4">
              <span className="alabel w-6 shrink-0 text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <dt className="text-lg font-medium tracking-tight">{field.label}</dt>
                <dd className="text-sm text-ink/65">{field.note}</dd>
              </div>
            </div>
          ))}
        </dl>

        <p data-reveal className="alabel mt-28 text-accent md:mt-40">
          Pricing
        </p>
        <h2 data-reveal className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5.4vw,4.75rem)] font-medium leading-[1] tracking-[-0.04em]">
          Twenty cents <em className="font-serif tracking-[-0.02em]">a lead.</em>
        </h2>
        <div data-reveal className="mt-12 rounded-[2rem] bg-ink p-7 text-paper md:p-12">
          <dl className="grid gap-8 md:grid-cols-3">
            {LEAD_TERMS.map(([value, label]) => (
              <div key={label}>
                <dt className="font-serif text-[clamp(2.6rem,5vw,4.25rem)] italic leading-none text-accent">{value}</dt>
                <dd className="mt-3 text-[15px] text-paper/65">{label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-paper/15 pt-8">
            <BookButton label="Book a call about leads" />
            <a href={LEADS_URL} className="text-[15px] underline decoration-1 underline-offset-[6px]">
              Or start with 25 free leads →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Marketing prices for the top of /pricing. */
export function MarketingPricing() {
  return (
    <section aria-label="Marketing pricing" className="container-x pb-16 md:pb-24">
      <div className="grid gap-5 md:grid-cols-2">
        <article data-reveal className="flex flex-col rounded-[2rem] bg-paper p-7 text-ink md:p-10">
          <p className="alabel text-accent">Ads management</p>
          <h2 className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.4rem)] italic leading-none tracking-[-0.02em]">Pay per booking</h2>
          <p className="mt-4 max-w-[42ch] flex-1 text-[15px] leading-relaxed text-ink/65">
            You pay for each estimate we book. When that adds up to more than a flat fee would, we move you to a monthly retainer.
          </p>
          <TransitionLink href="/ads-management" className="mt-8 self-start text-[15px] underline decoration-1 underline-offset-[6px]">
            How ads management works →
          </TransitionLink>
        </article>
        <article data-reveal className="flex flex-col rounded-[2rem] border border-line-strong p-7 md:p-10">
          <p className="alabel text-accent">Cold lead generation</p>
          <h2 className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.4rem)] italic leading-none tracking-[-0.02em]">$0.20 per lead</h2>
          <p className="mt-4 max-w-[42ch] flex-1 text-[15px] leading-relaxed text-muted">
            Plans start at 10,000 new leads a month, which is $2,000 a month.
          </p>
          <TransitionLink href="/cold-leads" className="mt-8 self-start text-[15px] underline decoration-1 underline-offset-[6px]">
            How cold lead generation works →
          </TransitionLink>
        </article>
      </div>
    </section>
  );
}
