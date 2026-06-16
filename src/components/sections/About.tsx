"use client";

import { useTranslations } from "next-intl";
import {
  ShieldCheck, Layers, TrendingUp, Users, RefreshCw,
  Clock, LifeBuoy, KeyRound, MessageSquare,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const valueIcons = {
  reliability: ShieldCheck, versatility: Layers, scalability: TrendingUp,
  accessibility: Users, transformation: RefreshCw,
};
type ValueKey = keyof typeof valueIcons;

const commitmentIcons = {
  response: Clock, support: LifeBuoy, ownership: KeyRound, clarity: MessageSquare,
};
type CommitmentKey = keyof typeof commitmentIcons;

export function About() {
  const t = useTranslations("about");
  const values: ValueKey[] = ["reliability", "versatility", "scalability", "accessibility", "transformation"];
  const commitments: CommitmentKey[] = ["response", "support", "ownership", "clarity"];

  return (
    <section
      id="about"
      data-tone="dark"
      className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-[#060D1A]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 items-start">
          <SectionHeading tone="dark" eyebrow={t("label")} title={t("title")} />
          <AnimatedSection delay={0.1} className="flex flex-col gap-5">
            <p className="text-[#94A3B8] text-lg leading-relaxed">{t("description")}</p>
            <p className="text-xs text-[#94A3B8] font-medium">{t("founder")}</p>
          </AnimatedSection>
        </div>

        {/* Commitments — the qualitative "stat row" */}
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-8">
            {t("commitments_label")}
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {commitments.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.08}>
              <HairlineItem
                tone="dark"
                icon={commitmentIcons[key]}
                title={t(`commitments.${key}.title`)}
                description={t(`commitments.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>

        {/* Values */}
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-8">
            {t("values_label")}
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.08}>
              <HairlineItem
                tone="dark"
                icon={valueIcons[key]}
                title={t(`values.${key}.title`)}
                description={t(`values.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
