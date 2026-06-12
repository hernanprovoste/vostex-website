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

  const services: { key: ServiceKey; featured: boolean }[] = [
    { key: "build", featured: true },
    { key: "flow", featured: false },
    { key: "intel", featured: false },
    { key: "launch", featured: false },
  ];

  return (
    <section id="services" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0090C8] mb-4">
            {t("label")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0D1F3C] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t("title")}
          </h2>
          <p className="text-[#4A5568] text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Grid — Build featured full-width, rest in 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map(({ key, featured }, index) => {
            const Icon = serviceIcons[key];
            return (
              <AnimatedSection
                key={key}
                delay={index * 0.1}
                className={featured ? "sm:col-span-2 lg:col-span-3" : ""}
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className={
                    featured
                      ? "relative h-full rounded-xl bg-[#0D1F3C] p-6 md:p-10 flex flex-col gap-4 cursor-default"
                      : "relative h-full group rounded-xl border border-[#0D1F3C]/10 bg-[#E8ECF0]/40 p-6 md:p-8 flex flex-col gap-4 cursor-default hover:border-[#0D1F3C]/25 transition-colors duration-200"
                  }
                >
                  {/* Badge — featured card only */}
                  {featured && (
                    <span className="absolute top-5 right-5 text-[10px] font-semibold uppercase tracking-wider bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/25 px-2 py-0.5 rounded-full">
                      {t(`items.${key}.badge`)}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className={
                      featured
                        ? "w-12 h-12 rounded-lg bg-[#060D1A] border border-[#1A2E4A] flex items-center justify-center"
                        : "w-12 h-12 rounded-lg bg-white border border-[#0D1F3C]/10 flex items-center justify-center"
                    }
                  >
                    <Icon
                      size={24}
                      className={featured ? "text-[#00C2FF]" : "text-[#0D1F3C]"}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Content */}
                  <div className={featured ? "flex flex-col gap-2 max-w-2xl" : "flex flex-col gap-2"}>
                    <h3
                      className={`text-lg font-bold ${featured ? "text-white" : "text-[#0D1F3C]"}`}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {t(`items.${key}.name`)}
                    </h3>
                    <p className={`text-sm font-medium ${featured ? "text-[#00C2FF]" : "text-[#0090C8]"}`}>
                      {t(`items.${key}.tagline`)}
                    </p>
                    <p className={`text-sm leading-relaxed mt-1 ${featured ? "text-[#94A3B8]" : "text-[#4A5568]"}`}>
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
