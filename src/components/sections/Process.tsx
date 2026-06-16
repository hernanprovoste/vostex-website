"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const stepKeys = ["diagnose", "design", "build", "launch"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#0D1F3C]/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          tone="light"
          eyebrow={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stepKeys.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.1}>
              <HairlineItem
                tone="light"
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
