"use client";

import { useTranslations } from "next-intl";
import { Code2, Brain, Zap, Globe } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const serviceIcons = { build: Code2, intel: Brain, flow: Zap, launch: Globe };
type ServiceKey = keyof typeof serviceIcons;

export function Services() {
  const t = useTranslations("services");
  const services: { key: ServiceKey; featured: boolean }[] = [
    { key: "build", featured: true },
    { key: "flow", featured: false },
    { key: "intel", featured: false },
    { key: "launch", featured: false },
  ];

  return (
    <section
      id="services"
      data-tone="dark"
      className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-[#060D1A]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 items-end">
          <SectionHeading
            tone="dark"
            eyebrow={t("label")}
            title={t("title")}
          />
          <AnimatedSection delay={0.1}>
            <p className="text-[#94A3B8] text-lg leading-relaxed">{t("subtitle")}</p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(({ key, featured }, index) => (
            <AnimatedSection key={key} delay={index * 0.1}>
              <HairlineItem
                tone="dark"
                icon={serviceIcons[key]}
                title={t(`items.${key}.name`)}
                description={`${t(`items.${key}.tagline`)} — ${t(`items.${key}.description`)}`}
                tag={featured ? t(`items.${key}.badge`) : undefined}
                accentTitle={featured}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
