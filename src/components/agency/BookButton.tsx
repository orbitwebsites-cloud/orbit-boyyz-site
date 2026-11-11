import { site as SITE } from "@/content/siteInfo";
import { TransitionLink } from "@/components/ui/TransitionLink";

type Props = {
  variant?: "accent" | "ink";
  label?: string;
  className?: string;
};

/** The one action the whole page exists for: start the /book questions. */
export function BookButton({ variant = "accent", label = "Book a free call", className = "" }: Props) {
  return (
    <TransitionLink href={SITE.booking} className={`abtn ${variant === "accent" ? "abtn-accent" : "abtn-ink"} ${className}`}>
      {label}
      <span aria-hidden className="abtn-arrow">
        →
      </span>
    </TransitionLink>
  );
}

export function BookNote({ className = "" }: { className?: string }) {
  return (
    <p className={`alabel opacity-70 ${className}`}>5 quick questions · about a minute · then pick a time</p>
  );
}
