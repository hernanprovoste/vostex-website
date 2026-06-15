"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight, Home, Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";

const project = {
  id: "tognarelli",
  screenshot: "/assets/screenshot_tognarelli.png",
  screenshotAlt: "Portal de propiedades de Tognarelli Propiedades",
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
};

export function Portfolio() {
  const t = useTranslations("portfolio");

  return (
    <section
      id="portfolio"
      className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#0D1F3C]/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <SectionHeading
          tone="light"
          eyebrow={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-16"
        />

        {/* Featured case */}
        <AnimatedSection>
          <div className="rounded-2xl bg-white border border-[#0D1F3C]/10 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Visual — browser frame with portal screenshot */}
            <div className="bg-[#0A1520] p-6 sm:p-10 flex items-center">
              <div className="w-full rounded-lg overflow-hidden border border-[#1A2E4A] shadow-2xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 bg-[#132743] px-4 py-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A5568]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A5568]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A5568]/60" />
                  <span className="ml-3 text-[11px] text-[#94A3B8] bg-[#0A1520] rounded px-3 py-0.5">
                    {project.urlLabel}
                  </span>
                </div>
                {/* Page area — real screenshot of the shipped portal */}
                <Image
                  src={project.screenshot}
                  alt={project.screenshotAlt}
                  width={2876}
                  height={1498}
                  className="w-full h-auto"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-5 p-6 sm:p-10">
              {/* Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0077A8] border border-[#0077A8]/25 bg-[#0077A8]/5 px-2.5 py-1 rounded-full">
                  {t(project.industryKey)}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4A5568] border border-[#4A5568]/20 px-2.5 py-1 rounded-full">
                  {project.service}
                </span>
              </div>

              {/* Company name + location */}
              <div>
                <h3
                  className="text-2xl font-bold text-[#0D1F3C]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {project.company}
                </h3>
                <p className="text-sm text-[#4A5568] mt-1">
                  {project.urlLabel} · {project.location}
                </p>
              </div>

              {/* Description */}
              <p className="text-base text-[#4A5568] leading-relaxed">
                {t(project.descriptionKey)}
              </p>

              {/* Features */}
              <div className="flex flex-col gap-2">
                {project.features.map(({ icon: Icon, key }) => (
                  <div
                    key={key}
                    className="flex items-start gap-2.5 rounded-lg bg-[#E8ECF0]/60 px-4 py-3"
                  >
                    <Icon
                      size={14}
                      className="text-[#0077A8] mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm text-[#0D1F3C]">{t(key)}</span>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <blockquote className="border-l-2 border-[#00C2FF] pl-4 mt-1">
                <p className="text-sm text-[#0D1F3C] leading-relaxed italic">
                  &ldquo;{t("testimonial")}&rdquo;
                </p>
                <footer className="mt-2 text-xs text-[#4A5568]">
                  <span className="font-semibold text-[#0D1F3C]">
                    {t("testimonial_author")}
                  </span>{" "}
                  · {t("testimonial_role")}
                </footer>
              </blockquote>

              {/* CTA */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 text-sm font-semibold text-[#0077A8] hover:text-[#0D1F3C] transition-colors mt-auto pt-2 w-fit"
              >
                {t("view_project")}
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-10" delay={0.2}>
          <p className="text-sm text-[#4A5568] italic">{t("coming_soon")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
