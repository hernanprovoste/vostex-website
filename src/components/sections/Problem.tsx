"use client";

import { useTranslations } from "next-intl";
import { FileSpreadsheet, EyeOff, UserX } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const painIcons = {
  spreadsheets: FileSpreadsheet,
  visibility: EyeOff,
  keypeople: UserX,
};

type PainKey = keyof typeof painIcons;

export function Problem() {
  const t = useTranslations("problem");
  const pains: PainKey[] = ["spreadsheets", "visibility", "keypeople"];

  return (
    <section className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <SectionHeading
          tone="light"
          eyebrow={t("label")}
          title={t("title")}
          subtitle={<span data-tone="light">{t("bridge")}</span>}
        />

        <div className="grid grid-cols-1 gap-8">
          {pains.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.1}>
              <HairlineItem
                tone="light"
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
