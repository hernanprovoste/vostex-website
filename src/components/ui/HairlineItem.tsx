import { LucideIcon } from "lucide-react";

type Props = {
  tone?: "light" | "dark";
  /** Big index label like "01" — used by Process. Mutually exclusive with icon. */
  index?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  /** First item in its grid drops the divider (set from the map index). */
  first?: boolean;
  className?: string;
};

/**
 * Editorial column item. In a grid it shows a left hairline divider on desktop
 * (top hairline when stacked on mobile). Pass `first` for the first item so it
 * drops its divider — needed because each item is wrapped for scroll-reveal,
 * which would otherwise defeat CSS `:first-child`.
 * Marker is either a Lucide icon (1.5px outline) or a tabular index number.
 */
export function HairlineItem({
  tone = "light",
  index,
  icon: Icon,
  title,
  description,
  first = false,
  className = "",
}: Props) {
  const rule = tone === "dark" ? "border-[#E8ECF0]/14" : "border-[#0D1F3C]/13";
  const titleColor = tone === "dark" ? "text-[#E8ECF0]" : "text-[#0D1F3C]";
  const descColor = tone === "dark" ? "text-[#8A97A8]" : "text-[#4A5568]";
  // deep cyan on light keeps small marks accessible; electric cyan on dark
  const accent = tone === "dark" ? "#00C2FF" : "#0090C8";

  const divider = first
    ? ""
    : `border-t md:border-t-0 md:border-l ${rule} pt-7 md:pt-0 md:pl-7`;

  return (
    <div className={`${divider} flex flex-col gap-3 h-full ${className}`}>
      {index && (
        <span
          className="font-sans text-sm font-bold tabular-nums tracking-[0.1em]"
          style={{ color: accent }}
        >
          {index}
        </span>
      )}
      {Icon && <Icon size={26} strokeWidth={1.5} style={{ color: accent }} aria-hidden />}
      <h3 className={`font-serif text-[1.3rem] leading-tight ${titleColor}`}>{title}</h3>
      <p className={`text-[0.94rem] leading-relaxed ${descColor}`}>{description}</p>
    </div>
  );
}
