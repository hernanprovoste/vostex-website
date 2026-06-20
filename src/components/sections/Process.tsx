"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const stepKeys = ["diagnose", "design", "build", "launch"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section className="section-deep px-4 sm:px-6 lg:px-8 py-[clamp(5rem,11vh,9rem)]">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          tone="dark"
          kicker={t("label")}
          title={t("title")}
          lead={t("subtitle")}
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.06}>
              <HairlineItem
                tone="dark"
                first={i === 0}
                index={String(i + 1).padStart(2, "0")}
                title={t(`steps.${key}.title`)}
                description={t(`steps.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
