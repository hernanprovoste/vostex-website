"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  TrendingUp,
  Users,
  RefreshCw,
  Clock,
  LifeBuoy,
  KeyRound,
  MessageSquare,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Image from "next/image";

const valueIcons = {
  reliability: ShieldCheck,
  versatility: Layers,
  scalability: TrendingUp,
  accessibility: Users,
  transformation: RefreshCw,
};

type ValueKey = keyof typeof valueIcons;

const commitmentIcons = {
  response: Clock,
  support: LifeBuoy,
  ownership: KeyRound,
  clarity: MessageSquare,
};

type CommitmentKey = keyof typeof commitmentIcons;

export function About() {
  const t = useTranslations("about");
  const values: ValueKey[] = [
    "reliability",
    "versatility",
    "scalability",
    "accessibility",
    "transformation",
  ];
  const commitments: CommitmentKey[] = [
    "response",
    "support",
    "ownership",
    "clarity",
  ];

  return (
    <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#0D1F3C]/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0090C8] mb-4">
            {t("label")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0D1F3C] mb-6"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t("title")}
          </h2>
        </AnimatedSection>

        {/* Brand story */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="flex flex-col gap-5">
            <p className="text-[#4A5568] text-lg leading-relaxed">
              {t("description")}
            </p>
            <p className="text-xs text-[#4A5568] font-medium">
              {t("founder")}
            </p>
          </div>

          {/* Logo display — navy accent card on light section */}
          <div className="flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl bg-[#0D1F3C] p-12 flex items-center justify-center overflow-hidden"
            >
              <Image
                src="/assets/logo-white.svg"
                alt="VOSTEX"
                width={200}
                height={50}
                className="relative h-12 w-auto"
              />
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Commitments — honest signals instead of vanity stats */}
        <div className="mb-20">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0090C8] mb-8 text-center">
              {t("commitments_label")}
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {commitments.map((key, i) => {
              const Icon = commitmentIcons[key];
              return (
                <AnimatedSection key={key} delay={i * 0.08}>
                  <div className="rounded-xl border border-[#0D1F3C]/10 bg-[#E8ECF0]/40 p-6 flex flex-col gap-3 h-full">
                    <Icon size={20} className="text-[#0090C8]" strokeWidth={1.5} />
                    <h3
                      className="text-sm font-semibold text-[#0D1F3C]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {t(`commitments.${key}.title`)}
                    </h3>
                    <p className="text-xs text-[#4A5568] leading-relaxed">
                      {t(`commitments.${key}.description`)}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0090C8] mb-8 text-center">
            {t("values_label")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((key, i) => {
              const Icon = valueIcons[key];
              return (
                <AnimatedSection key={key} delay={i * 0.08} direction="up">
                  <div className="rounded-xl border border-[#0D1F3C]/10 bg-[#E8ECF0]/40 p-5 flex flex-col gap-3 h-full">
                    <Icon size={20} className="text-[#0090C8]" strokeWidth={1.5} />
                    <h3
                      className="text-sm font-semibold text-[#0D1F3C]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {t(`values.${key}.title`)}
                    </h3>
                    <p className="text-xs text-[#4A5568] leading-relaxed">
                      {t(`values.${key}.description`)}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
