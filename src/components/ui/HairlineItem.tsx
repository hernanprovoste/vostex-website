import { LucideIcon } from "lucide-react";

type Props = {
  tone?: "light" | "dark";
  /** Big index label like "01" — used by Process. Mutually exclusive with icon. */
  index?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  /** Optional small tag, e.g. "Core". */
  tag?: string;
  accentTitle?: boolean;
  className?: string;
};

export function HairlineItem({
  tone = "light",
  index,
  icon: Icon,
  title,
  description,
  tag,
  accentTitle = false,
  className = "",
}: Props) {
  const hairline = tone === "dark" ? "hairline-dark" : "hairline-light";
  const accent = tone === "dark" ? "#00C2FF" : "#0090C8";
  const titleColor = accentTitle
    ? ""
    : tone === "dark"
      ? "text-white"
      : "text-[#0D1F3C]";
  const descColor = tone === "dark" ? "text-[#94A3B8]" : "text-[#4A5568]";
  const indexColor = tone === "dark" ? "text-[#00C2FF]" : "text-[#0090C8]";

  return (
    <div className={`${hairline} pt-6 flex flex-col gap-3 h-full ${className}`}>
      {index && (
        <span
          className={`text-sm font-semibold tabular-nums ${indexColor}`}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {index}
        </span>
      )}
      {Icon && (
        <Icon
          size={24}
          strokeWidth={1.5}
          style={{ color: accent }}
        />
      )}
      <div className="flex items-center gap-2">
        <h3
          className={`text-lg font-bold ${titleColor}`}
          style={{
            fontFamily: "var(--font-space-grotesk)",
            ...(accentTitle ? { color: accent } : {}),
          }}
        >
          {title}
        </h3>
        {tag && (
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/25 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        )}
      </div>
      <p className={`text-sm leading-relaxed ${descColor}`}>{description}</p>
    </div>
  );
}
