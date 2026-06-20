"use client";

import { useTranslations } from "next-intl";
import { Table2, EyeOff, Users } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const painIcons = {
  spreadsheets: Table2,
  visibility: EyeOff,
  keypeople: Users,
};
type PainKey = keyof typeof painIcons;

export function Problem() {
  const t = useTranslations("problem");
  const pains: PainKey[] = ["spreadsheets", "visibility", "keypeople"];

  return (
    <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-[clamp(5rem,11vh,9rem)]">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          tone="light"
          kicker={t("label")}
          title={t("title")}
          lead={t("bridge")}
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3">
          {pains.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.08}>
              <HairlineItem
                tone="light"
                first={i === 0}
                icon={painIcons[key]}
                title={t(`pains.${key}.title`)}
                description={t(`pains.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
