"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const projects = [
  {
    id: 1,
    title: "ERP for SME Retail",
    industry: "Retail",
    service: "Vostex Build",
    description:
      "End-to-end inventory and sales management system replacing spreadsheets for a 20-person retail chain.",
    tags: ["Next.js", "PostgreSQL", "Docker"],
  },
  {
    id: 2,
    title: "AI Demand Forecasting",
    industry: "Logistics",
    service: "Vostex Intel",
    description:
      "Machine learning model that predicts weekly demand with 94% accuracy, reducing overstock by 30%.",
    tags: ["Python", "FastAPI", "ML"],
  },
  {
    id: 3,
    title: "Invoice Automation",
    industry: "Services",
    service: "Vostex Flow",
    description:
      "Automated billing and reconciliation pipeline that saves 12+ hours per week of manual work.",
    tags: ["n8n", "APIs", "PDF"],
  },
];

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

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(0,194,255,0.35)" }}
                transition={{ duration: 0.2 }}
                className="group h-full rounded-xl border border-[#1A2E4A] bg-[#060D1A] p-6 flex flex-col gap-4"
              >
                {/* Service badge */}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00C2FF] border border-[#00C2FF]/20 bg-[#00C2FF]/5 px-2 py-1 rounded-full w-fit">
                  {project.service}
                </span>

                <div className="flex flex-col gap-2 flex-1">
                  <h3
                    className="text-base font-bold text-white"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] font-medium uppercase tracking-wider">
                    {project.industry}
                  </p>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-[#4A5568] bg-[#0D1F3C] border border-[#1A2E4A] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-1 text-xs font-medium text-[#4A5568] group-hover:text-[#00C2FF] transition-colors mt-auto pt-2 w-fit cursor-pointer">
                  {t("view_project")}
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-12" delay={0.3}>
          <p className="text-sm text-[#4A5568] italic">{t("coming_soon")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
