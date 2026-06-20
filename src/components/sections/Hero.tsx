"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

const stats = [
  { key: "ownership" },
  { key: "response" },
  { key: "growth" },
] as const;

export function Hero() {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const ease = [0.2, 0, 0, 1] as const;
  // Full transform strings (not framer x/y shorthands) stay on the GPU.
  const rise = (delay: number) => ({
    initial: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, transform: "translateY(24px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.5, delay: prefersReduced ? 0 : delay, ease },
  });

  return (
    <section
      id="top"
      className="min-h-dvh flex flex-col justify-center bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 pt-28 pb-16 border-b border-[#0D1F3C]/13"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Descriptor line (no pill eyebrow) */}
        <motion.div
          {...rise(0)}
          className="flex items-center gap-3 mb-9 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#4A5568]"
        >
          <span className="inline-block w-[26px] h-0.5 bg-[#00C2FF]" aria-hidden />
          {t("tagline")}
        </motion.div>

        {/* Headline — serif, one italic accent word */}
        <motion.h1
          {...rise(0.08)}
          className="font-serif font-medium leading-[1.0] tracking-[-0.01em] max-w-[16ch] text-balance text-[#0D1F3C]"
          style={{ fontSize: "clamp(3rem, 9vw, 7.2rem)" }}
        >
          {t.rich("headline", {
            em: (chunks) => <em className="italic">{chunks}</em>,
          })}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...rise(0.16)}
          className="mt-8 max-w-[52ch] text-lg sm:text-xl text-[#4A5568] leading-relaxed"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs — single cyan accent + ghost */}
        <motion.div {...rise(0.24)} className="mt-11 flex flex-col sm:flex-row gap-3">
          <GlowButton variant="cyan" onClick={() => scrollTo("contact")}>
            {t("cta_primary")}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </GlowButton>
          <GlowButton variant="ghost" onClick={() => scrollTo("work")}>
            {t("cta_secondary")}
          </GlowButton>
        </motion.div>

        {/* Qualitative stats */}
        <motion.div
          {...rise(0.32)}
          className="mt-16 pt-7 border-t border-[#0D1F3C]/13 flex flex-wrap gap-x-14 gap-y-6"
        >
          {stats.map(({ key }) => (
            <div key={key}>
              <div className="font-serif text-3xl leading-none text-[#0D1F3C] tabular-nums">
                {t(`stats.${key}.num`)}
              </div>
              <div className="mt-2 text-[0.72rem] uppercase tracking-[0.12em] text-[#4A5568]">
                {t(`stats.${key}.label`)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
