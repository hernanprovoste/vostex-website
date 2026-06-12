"use client";

import { useTranslations } from "next-intl";
import { FileSpreadsheet, EyeOff, UserX } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

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
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Editorial header — left column */}
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0090C8] mb-4">
            {t("label")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0D1F3C] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t("title")}
          </h2>
          <p className="text-lg text-[#4A5568] leading-relaxed max-w-xl border-l-2 border-[#0D1F3C] pl-4">
            {t("bridge")}
          </p>
        </AnimatedSection>

        {/* Pain points — right column */}
        <div className="flex flex-col gap-4">
          {pains.map((key, i) => {
            const Icon = painIcons[key];
            return (
              <AnimatedSection key={key} delay={i * 0.1}>
                <div className="flex items-start gap-4 rounded-xl bg-[#E8ECF0]/40 border border-[#0D1F3C]/10 p-6">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#0D1F3C]/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[#0D1F3C]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3
                      className="text-base font-semibold text-[#0D1F3C] mb-1"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {t(`pains.${key}.title`)}
                    </h3>
                    <p className="text-sm text-[#4A5568] leading-relaxed">
                      {t(`pains.${key}.description`)}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
