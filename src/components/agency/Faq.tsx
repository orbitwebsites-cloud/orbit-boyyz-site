export const HOME_QUESTIONS: [string, string][] = [
  ["Is the call really free?", "Yes. 30 minutes, free, weekdays 5 PM ET or later. You decide afterwards whether to go ahead."],
  ["Who am I talking to?", "The people who do the work. There is no sales handoff."],
  ["What do you actually do?", "Two things. We manage ads for home-service businesses, including the page and the text follow-up that books the estimate. And we generate cold leads for teams doing outreach. We also build websites."],
  ["How do you charge for booked estimates?", "Per booking to start. When the bookings add up to more than a flat fee would cost you, we move you to a monthly retainer."],
  ["How does cold lead generation pricing work?", "$0.20 per lead. Plans start at 10,000 new leads a month, so the smallest plan is $2,000 a month."],
  ["Do you take my ad budget?", "No. Ads run in your own account and you pay Meta directly. We never hold your ad spend."],
  ["How do leads agree to be texted?", "Your form has a consent box. Nobody gets a text unless they ticked it."],
];

export function Faq({ questions = HOME_QUESTIONS }: { questions?: [string, string][] }) {
  return (
    <section className="bg-paper px-6 pb-28 text-ink md:px-10 md:pb-40">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.6fr]">
        <h2 data-reveal className="text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1] tracking-[-0.04em]">
          Straight <em className="font-serif tracking-[-0.02em]">answers.</em>
        </h2>
        <div>
          {questions.map(([q, a]) => (
            <details key={q} data-reveal className="group border-t border-ink/15 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="relative block size-3.5 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-300 group-open:rotate-90" />
                </span>
              </summary>
              <p className="max-w-[58ch] pb-6 text-[15px] leading-relaxed text-ink/65">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
