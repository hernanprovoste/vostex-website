"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Home, Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Image from "next/image";

export function Portfolio() {
  const t = useTranslations("portfolio");

  return (
    <section
      id="portfolio"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0D1F3C] relative overflow-hidden"
    >
      {/* Section texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-texture opacity-50"
      />

      <div className="relative max-w-7xl mx-auto">
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

        {/* Tognarelli featured case */}
        <AnimatedSection delay={0.1}>
          <motion.div
            whileHover={{ borderColor: "rgba(0,194,255,0.25)" }}
            transition={{ duration: 0.25 }}
            className="group rounded-2xl border border-[#1A2E4A] bg-[#060D1A] overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Logo / Visual side */}
              <div className="relative flex items-center justify-center p-10 md:p-14 bg-[#0A1520] border-b lg:border-b-0 lg:border-r border-[#1A2E4A] min-h-[260px]">
                {/* Subtle radial glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(178,139,59,0.04) 0%, transparent 65%)",
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full max-w-[320px]"
                >
                  <Image
                    src="/assets/tognarelli-logo.svg"
                    alt="Tognarelli Propiedades"
                    width={320}
                    height={112}
                    className="w-full h-auto"
                    priority
                  />
                </motion.div>

                {/* Industry tag */}
                <span className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-wider text-[#00C2FF] border border-[#00C2FF]/20 bg-[#00C2FF]/5 px-2 py-1 rounded-full">
                  {t("industry_realestate")}
                </span>
              </div>

              {/* Content side */}
              <div className="p-8 md:p-10 flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-4">
                  {/* Service badge */}
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00C2FF] border border-[#00C2FF]/20 bg-[#00C2FF]/5 px-2 py-1 rounded-full w-fit">
                    Vostex Launch
                  </span>

                  <div>
                    <h3
                      className="text-xl md:text-2xl font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Tognarelli Propiedades
                    </h3>
                    <p className="text-sm text-[#4A5568] font-medium">
                      tognarelli.cl · Valdivia, Chile
                    </p>
                  </div>

                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    {t("tognarelli_description")}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    {[
                      { icon: Home, text: t("tognarelli_feat1") },
                      { icon: Star, text: t("tognarelli_feat2") },
                    ].map(({ icon: Icon, text }, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-[#0D1F3C] border border-[#1A2E4A] p-3"
                      >
                        <Icon
                          size={14}
                          className="text-[#00C2FF] mt-0.5 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs text-[#94A3B8] leading-relaxed">
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://tognarelli.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-[#4A5568] hover:text-[#00C2FF] transition-colors mt-2 w-fit group/link"
                >
                  {t("view_project")}
                  <ArrowUpRight
                    size={14}
                    className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="text-center mt-10" delay={0.3}>
          <p className="text-sm text-[#4A5568] italic">{t("coming_soon")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
