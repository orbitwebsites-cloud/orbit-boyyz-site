import { TransitionLink } from "@/components/ui/TransitionLink";
import { BookButton } from "./BookButton";

const PATHS = [
  {
    tag: "Ads management",
    quote: "“I’m paying for ads and the phone isn’t ringing.”",
    points: [
      "A landing page built for your ad",
      "Ads run in your own account",
      "Every lead texted, qualified and booked",
      "For kitchen, bath, basement and window remodelers",
    ],
    price: "Pay per booking",
    priceNote: "You pay for each estimate we book. When that adds up to more than a flat fee would, we move you to a monthly retainer.",
    cta: "Book a call about your ads",
    more: { href: "/ads-management", label: "How it works" },
    dark: true,
  },
  {
    tag: "Cold lead generation",
    quote: "“My outreach keeps running out of people to contact.”",
    points: [
      "New leads delivered every month",
      "Built around who you sell to",
      "Ready for cold email, calls or texts",
      "For teams doing cold outreach at volume",
    ],
    price: "$0.20 per lead",
    priceNote: "Plans start at 10,000 new leads a month, which is $2,000 a month.",
    cta: "Book a call about leads",
    more: { href: "/cold-leads", label: "How it works" },
    dark: false,
  },
];

/** The fork: two offers, side by side, each ending in the same booking action. */
export function Paths() {
  return (
    <section id="paths" className="bg-paper px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="alabel text-accent">
          Two offers
        </p>
        <h2 data-reveal className="mt-3 max-w-[14ch] text-[clamp(2.2rem,5.4vw,4.75rem)] font-medium leading-[1] tracking-[-0.04em]">
          Which one <em className="font-serif tracking-[-0.02em]">sounds like you?</em>
        </h2>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PATHS.map((p) => (
            <article
              key={p.tag}
              data-reveal
              className={`group flex flex-col rounded-[2rem] p-7 transition-transform duration-500 ease-out hover:-translate-y-2 md:p-10 ${
                p.dark ? "bg-ink text-paper" : "bg-white shadow-[0_0_0_1px_rgba(14,14,14,0.08)]"
              }`}
            >
              <p className="alabel flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-[2.2]" />
                {p.tag}
              </p>
              <h3 className="mt-8 font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] italic leading-[1.05] tracking-[-0.02em]">{p.quote}</h3>
              <ul className={`mt-8 space-y-3 border-t pt-7 text-[15px] ${p.dark ? "border-paper/15" : "border-ink/10"}`}>
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex-1">
                <p className="text-[clamp(1.7rem,2.8vw,2.4rem)] font-medium leading-none tracking-[-0.04em]">{p.price}</p>
                <p className={`mt-2.5 max-w-[40ch] text-sm leading-relaxed ${p.dark ? "text-paper/65" : "text-ink/65"}`}>{p.priceNote}</p>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <BookButton label={p.cta} variant={p.dark ? "accent" : "ink"} />
                <TransitionLink href={p.more.href} className="text-[15px] underline decoration-1 underline-offset-[6px]">
                  {p.more.label} →
                </TransitionLink>
              </div>
            </article>
          ))}
        </div>
        <p data-reveal className="mt-10 text-[15px] text-ink/60">
          Just need a website?{" "}
          <TransitionLink href="/website" className="text-ink underline decoration-1 underline-offset-[6px]">
            See how we build them →
          </TransitionLink>
        </p>
      </div>
    </section>
  );
}
