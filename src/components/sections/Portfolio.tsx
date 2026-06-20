"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

const project = {
  screenshot: "/assets/screenshot_tognarelli.png",
  url: "https://tognarelli.cl",
  urlLabel: "tognarelli.cl",
};

export function Portfolio() {
  const t = useTranslations("portfolio");

  const narrative = ["context", "built", "outcome"] as const;

  return (
    <section
      id="work"
      className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-[clamp(5rem,11vh,9rem)]"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          tone="light"
          kicker={t("label")}
          title={t("title")}
          lead={t("subtitle")}
          className="mb-14"
        />

        <AnimatedSection className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] border border-[#0D1F3C]/13">
          {/* Visual — browser frame with the real shipped portal */}
          <div className="bg-[#060D1A] p-6 sm:p-10 flex items-center">
            <div className="w-full overflow-hidden border border-white/10 rounded-[2px]">
              <div className="flex items-center gap-2 bg-[#0D1F3C] px-4 py-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A97A8]/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A97A8]/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A97A8]/50" />
                <span className="ml-3 text-[11px] text-[#8A97A8] bg-[#060D1A] px-3 py-0.5 rounded-[2px]">
                  {project.urlLabel}
                </span>
              </div>
              <Image
                src={project.screenshot}
                alt={t("screenshot_alt")}
                width={2876}
                height={1498}
                className="w-full h-auto"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col p-6 sm:p-10">
            {/* Key/value meta row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.7rem] uppercase tracking-[0.12em] text-[#4A5568] border-b border-[#0D1F3C]/13 pb-4 mb-6">
              <span>
                {t("industry_label")} —{" "}
                <b className="text-[#0D1F3C] font-bold">{t("industry_realestate")}</b>
              </span>
              <span>
                {t("service_label")} —{" "}
                <b className="text-[#0D1F3C] font-bold">{t("service")}</b>
              </span>
              <span>{t("location")}</span>
            </div>

            <h3 className="font-serif text-[1.9rem] text-[#0D1F3C] mb-4">
              {t("company")}
            </h3>

            <div className="flex flex-col gap-3">
              {narrative.map((k) => (
                <p key={k} className="text-[0.97rem] text-[#4A5568] leading-relaxed">
                  <b className="text-[#0D1F3C] font-bold">{t(`${k}_label`)}</b>{" "}
                  {t(k)}
                </p>
              ))}
            </div>

            {/* Testimonial */}
            <blockquote className="border-l-2 border-[#00C2FF] pl-5 my-6">
              <p className="font-serif italic text-[1.05rem] text-[#0D1F3C] leading-snug">
                {t("testimonial")}
              </p>
              <footer className="mt-3 text-[0.7rem] uppercase tracking-[0.12em] text-[#4A5568]">
                {t("testimonial_author")} · {t("testimonial_role")}
              </footer>
            </blockquote>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow text-[#0D1F3C] mt-auto pt-2 w-fit"
            >
              {t("view_project")} <span className="ar">→</span>
            </a>
          </div>
        </AnimatedSection>

        <p className="mt-6 text-sm text-[#4A5568]">{t("coming_soon")}</p>
      </div>
    </section>
  );
}
