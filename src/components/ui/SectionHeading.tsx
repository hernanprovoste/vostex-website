import { ReactNode } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type Props = {
  eyebrow: string;
  title: ReactNode; // wrap accent words in <span className="accent">
  subtitle?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "left",
  className = "",
}: Props) {
  const titleColor = tone === "dark" ? "text-white" : "text-[#0D1F3C]";
  const eyebrowColor = tone === "dark" ? "text-[#00C2FF]" : "text-[#0077A8]";
  const subColor = tone === "dark" ? "text-[#94A3B8]" : "text-[#4A5568]";
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "";

  return (
    <AnimatedSection
      data-tone={tone}
      className={`flex flex-col gap-5 ${alignCls} ${className}`}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}>
        {eyebrow}
      </p>
      <h2
        className={`display-stack ${titleColor}`}
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg leading-relaxed max-w-2xl ${subColor}`}>{subtitle}</p>
      )}
    </AnimatedSection>
  );
}
