"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Home, Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Image from "next/image";

const projects = [
  {
    id: "tognarelli",
    logo: "/assets/tognarelli-logo.svg",
    logoAlt: "Tognarelli Propiedades",
    company: "Tognarelli Propiedades",
    url: "https://tognarelli.cl",
    urlLabel: "tognarelli.cl",
    location: "Valdivia, Chile",
    service: "Vostex Launch",
    industryKey: "industry_realestate" as const,
    descriptionKey: "tognarelli_description" as const,
    features: [
      { icon: Home, key: "tognarelli_feat1" as const },
      { icon: Star, key: "tognarelli_feat2" as const },
    ],
  },
];

export function Portfolio() {
  const t = useTranslations("portfolio");

  return (
    <section
      id="portfolio"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0D1F3C] relative overflow-hidden"
    >
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

        {/* Grid — 3 cols desktop / 2 tablet / 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(0,194,255,0.3)" }}
                transition={{ duration: 0.2 }}
                className="group h-full rounded-xl border border-[#1A2E4A] bg-[#060D1A] overflow-hidden flex flex-col"
              >
                {/* Logo area — top */}
                <div className="relative flex items-center justify-center bg-[#0A1520] px-8 py-8 min-h-[160px]">
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(178,139,59,0.05) 0%, transparent 70%)",
                    }}
                  />
                  <Image
                    src={project.logo}
                    alt={project.logoAlt}
                    width={220}
                    height={80}
                    className="relative w-full max-w-[200px] h-auto object-contain"
                  />
                </div>

                {/* Content — below logo */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  {/* Industry badge — directly below logo */}
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00C2FF] border border-[#00C2FF]/20 bg-[#00C2FF]/5 px-2 py-0.5 rounded-full w-fit">
                    {t(project.industryKey)}
                  </span>

                  {/* Service */}
                  <span className="text-[10px] font-medium text-[#4A5568] uppercase tracking-wider">
                    {project.service}
                  </span>

                  {/* Company name + location */}
                  <div>
                    <h3
                      className="text-base font-bold text-white"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {project.company}
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-0.5">
                      {project.urlLabel} · {project.location}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {t(project.descriptionKey)}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-col gap-2 mt-1">
                    {project.features.map(({ icon: Icon, key }) => (
                      <div
                        key={key}
                        className="flex items-start gap-2 rounded-lg bg-[#0D1F3C] border border-[#1A2E4A] px-3 py-2"
                      >
                        <Icon
                          size={12}
                          className="text-[#00C2FF] mt-0.5 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs text-[#94A3B8]">{t(key)}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-[#4A5568] group-hover:text-[#00C2FF] transition-colors mt-auto pt-3 w-fit"
                  >
                    {t("view_project")}
                    <ArrowUpRight
                      size={12}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </a>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-10" delay={0.2}>
          <p className="text-sm text-[#4A5568] italic">{t("coming_soon")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
