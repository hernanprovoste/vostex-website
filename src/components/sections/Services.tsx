"use client";

import { useTranslations } from "next-intl";
import { Boxes, BrainCircuit, Workflow, Globe, LucideIcon } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Row = { key: string; idx: string; icon: LucideIcon; badge?: boolean };

const rows: Row[] = [
  { key: "build", idx: "01", icon: Boxes, badge: true },
  { key: "intel", idx: "02", icon: BrainCircuit },
  { key: "flow", idx: "03", icon: Workflow },
  { key: "launch", idx: "04", icon: Globe },
];

export function Services() {
  const t = useTranslations("services");

  return (
    <section
      id="capabilities"
      className="section-dark px-4 sm:px-6 lg:px-8 py-[clamp(5rem,11vh,9rem)]"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          tone="dark"
          kicker={t("label")}
          title={t("title")}
          lead={t("subtitle")}
          className="mb-12"
        />

        <div>
          {rows.map(({ key, idx, icon: Icon, badge }, i) => (
            <AnimatedSection
              key={key}
              delay={i * 0.06}
              className={`grid grid-cols-1 md:grid-cols-[56px_220px_1.6fr_150px] gap-3 md:gap-8 items-start py-9 border-t border-[#E8ECF0]/14 ${
                i === rows.length - 1 ? "border-b border-[#E8ECF0]/14" : ""
              } transition-colors duration-150 hover:bg-white/[0.03]`}
            >
              <div className="font-sans text-sm text-[#8A97A8] tabular-nums md:pt-1.5">
                {idx}
              </div>

              <div className="flex items-start gap-3.5">
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  className="text-[#00C2FF] shrink-0 mt-1.5"
                  aria-hidden
                />
                <div>
                  <h3 className="font-serif font-semibold text-[1.5rem] text-[#E8ECF0] leading-tight">
                    {t(`items.${key}.name`)}
                  </h3>
                  {badge && (
                    <span className="inline-block mt-2 text-[0.66rem] uppercase tracking-[0.14em] text-[#00C2FF] border border-[#00C2FF]/45 px-2 py-0.5">
                      {t(`items.${key}.badge`)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="font-serif italic text-[1.05rem] text-[#E8ECF0] mb-2">
                  {t(`items.${key}.tagline`)}
                </div>
                <p className="text-[0.94rem] text-[#8A97A8] leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>
              </div>

              <div className="text-[0.7rem] uppercase tracking-[0.12em] text-[#8A97A8] md:text-right leading-[1.7] md:pt-1.5">
                {t(`items.${key}.meta`)}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
