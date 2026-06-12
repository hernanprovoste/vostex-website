"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const stepKeys = ["diagnose", "design", "build", "launch"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#0D1F3C]/10">
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

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stepKeys.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.1}>
              <div className="relative flex flex-col gap-3 h-full border-t border-[#0D1F3C]/10 pt-6">
                <span
                  className="text-sm font-semibold text-[#0090C8] tabular-nums"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="text-lg font-bold text-[#0D1F3C]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="text-sm text-[#4A5568] leading-relaxed">
                  {t(`steps.${key}.description`)}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
