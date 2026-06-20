"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

const valueKeys = ["response", "support", "ownership", "clarity"] as const;

export function About() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="section-dark px-4 sm:px-6 lg:px-8 py-[clamp(5rem,11vh,9rem)]"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          tone="dark"
          kicker={t("label")}
          title={t("title")}
          lead={
            <>
              {t("description")}{" "}
              <span className="text-[#E8ECF0]">{t("founder")}</span>
            </>
          }
          className="mb-12"
        />

        <div className="border-b border-[#E8ECF0]/14">
          {valueKeys.map((key, i) => (
            <AnimatedSection
              key={key}
              delay={i * 0.05}
              className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-2 md:gap-8 py-7 border-t border-[#E8ECF0]/14"
            >
              <h3 className="font-serif text-[1.3rem] text-[#E8ECF0]">
                {t(`commitments.${key}.title`)}
              </h3>
              <p className="text-[0.94rem] text-[#8A97A8] leading-relaxed max-w-[58ch]">
                {t(`commitments.${key}.description`)}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
