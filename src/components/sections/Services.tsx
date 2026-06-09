"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code2, Brain, Zap, Globe } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const serviceIcons = {
  build: Code2,
  intel: Brain,
  flow: Zap,
  launch: Globe,
};

type ServiceKey = keyof typeof serviceIcons;

export function Services() {
  const t = useTranslations("services");

  const services: { key: ServiceKey; hasBadge: boolean }[] = [
    { key: "build", hasBadge: true },
    { key: "intel", hasBadge: false },
    { key: "flow", hasBadge: false },
    { key: "launch", hasBadge: false },
  ];

  return (
    <section id="services" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#060D1A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-4">
            {t("label")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t("title")}
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {services.map(({ key, hasBadge }, index) => {
            const Icon = serviceIcons[key];
            return (
              <AnimatedSection key={key} delay={index * 0.1}>
                <motion.div
                  whileHover={{ borderColor: "rgba(0,194,255,0.4)" }}
                  transition={{ duration: 0.2 }}
                  className="relative h-full group rounded-xl border border-[#1A2E4A] bg-[#0D1F3C] p-6 md:p-8 flex flex-col gap-4 overflow-hidden cursor-default"
                >
                  {/* Card glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                    style={{ background: "radial-gradient(ellipse at top left, rgba(0,194,255,0.04), transparent 60%)" }}
                  />

                  {/* Icon */}
                  <div className="relative w-12 h-12 rounded-lg bg-[#060D1A] border border-[#1A2E4A] flex items-center justify-center group-hover:border-[#00C2FF]/30 transition-colors duration-300">
                    <Icon size={24} className="text-[#00C2FF]" strokeWidth={1.5} />
                  </div>

                  {/* Badge */}
                  {hasBadge && (
                    <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-2 py-0.5 rounded-full">
                      {t(`items.${key}.badge`)}
                    </span>
                  )}

                  {/* Content */}
                  <div className="relative flex flex-col gap-2">
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {t(`items.${key}.name`)}
                    </h3>
                    <p className="text-sm font-medium text-[#00C2FF]">
                      {t(`items.${key}.tagline`)}
                    </p>
                    <p className="text-sm text-[#94A3B8] leading-relaxed mt-1">
                      {t(`items.${key}.description`)}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
