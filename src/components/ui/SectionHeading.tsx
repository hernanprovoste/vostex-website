import { ReactNode } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type Props = {
  kicker: string;
  title: ReactNode; // may include <em> for an italic accent word
  lead?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Editorial section head — document/consultancy style.
 * Kicker sits in the left column beside the serif H2 (not a floating pill).
 * Stacks on mobile. Tone controls the top hairline and lead color.
 */
export function SectionHeading({
  kicker,
  title,
  lead,
  tone = "light",
  className = "",
}: Props) {
  const hairline = tone === "dark" ? "border-[#E8ECF0]/14" : "border-[#0D1F3C]/13";
  const leadColor = tone === "dark" ? "text-[#8A97A8]" : "text-[#4A5568]";

  return (
    <AnimatedSection
      className={`grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-10 items-start pt-9 border-t ${hairline} ${className}`}
    >
      <span className="kicker">{kicker}</span>
      <div>
        <h2
          className="font-serif font-medium leading-[1.07] max-w-[18ch] text-balance"
          style={{ fontSize: "clamp(2.1rem, 4.4vw, 3.6rem)" }}
        >
          {title}
        </h2>
        {lead && (
          <p className={`mt-4 max-w-[58ch] text-[1.06rem] leading-relaxed ${leadColor}`}>
            {lead}
          </p>
        )}
      </div>
    </AnimatedSection>
  );
}
