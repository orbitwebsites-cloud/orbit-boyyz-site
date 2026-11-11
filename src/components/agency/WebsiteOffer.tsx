import { BookButton } from "./BookButton";

const STEPS = [
  ["Book a call", "Free, 30 minutes, focused on what your business needs."],
  ["Talk to the builders", "You speak with the people building your site. No sales handoff."],
  ["Choose the direction", "Show us sites you like, pick from our work, or let us propose one."],
  ["Pay 50% to begin", "Once scope and direction are clear, the first half starts the sprint."],
  ["Launch", "Approve the finished site, pay the rest, and it is yours."],
];

const TIERS = [
  {
    tag: "7-day sprint",
    name: "Launch build",
    price: "Quoted on the call",
    body: "A polished custom site for a business that needs to look credible and get calls, fast.",
    points: ["Custom design, hand-coded", "Mobile-first and fast", "Call, quote and booking paths", "Local SEO basics"],
    dark: false,
  },
  {
    tag: "Full build",
    name: "Premium build",
    price: "From $3,500",
    body: "A full website system for brands that need trust, clarity and a serious first impression.",
    points: ["Everything in Launch", "Deeper strategy and copy", "Service and area pages", "Booking and lead flows wired in"],
    dark: true,
  },
  {
    tag: "After launch · optional",
    name: "Care plans",
    price: "From $300/mo",
    body: "We keep it online, protected and improving. Month to month.",
    points: ["Site Care · $300/mo", "Website + Leads · $500/mo", "Growth Partner · $700/mo", "Text us what you need changed"],
    dark: false,
  },
];

/** The website offer in plain terms: how it goes, and what it costs. */
export function WebsiteOffer() {
  return (
    <section className="bg-paper px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="alabel text-accent">
          How it goes
        </p>
        <h2 data-reveal className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5.4vw,4.75rem)] font-medium leading-[1] tracking-[-0.04em]">
          First call to launch in <em className="font-serif tracking-[-0.02em]">five steps.</em>
        </h2>
        <ol className="mt-14 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(([title, body], i) => (
            <li key={title} data-reveal className="border-t border-ink/15 pt-5">
              <span className="alabel text-accent">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-medium tracking-tight">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{body}</p>
            </li>
          ))}
        </ol>

        <p data-reveal className="alabel mt-28 text-accent md:mt-40">
          Pricing
        </p>
        <h2 data-reveal className="mt-3 max-w-[18ch] text-[clamp(2.2rem,5.4vw,4.75rem)] font-medium leading-[1] tracking-[-0.04em]">
          You approve it <em className="font-serif tracking-[-0.02em]">before you pay the rest.</em>
        </h2>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t) => (
            <article
              key={t.name}
              data-reveal
              className={`group flex flex-col rounded-[2rem] p-7 transition-transform duration-500 ease-out hover:-translate-y-2 md:p-9 ${
                t.dark ? "bg-ink text-paper" : "bg-white shadow-[0_0_0_1px_rgba(14,14,14,0.08)]"
              }`}
            >
              <p className="alabel flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-[2.2]" />
                {t.tag}
              </p>
              <h3 className="mt-7 text-2xl font-medium tracking-tight">{t.name}</h3>
              <p className="mt-2 font-serif text-[clamp(2rem,3.2vw,2.75rem)] italic leading-none tracking-[-0.02em]">{t.price}</p>
              <p className={`mt-4 text-[15px] leading-relaxed ${t.dark ? "text-paper/60" : "text-ink/60"}`}>{t.body}</p>
              <ul className={`mt-7 flex-1 space-y-3 border-t pt-6 text-[15px] ${t.dark ? "border-paper/15" : "border-ink/10"}`}>
                {t.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                    {pt}
                  </li>
                ))}
              </ul>
              <BookButton variant={t.dark ? "accent" : "ink"} className="mt-9 self-start" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
