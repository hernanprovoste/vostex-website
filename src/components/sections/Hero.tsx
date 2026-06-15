"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export function Hero() {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();

  const headline = t("headline");
  const words = headline.split(" ");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-tone="dark"
      className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-[#060D1A] bg-texture px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(0,194,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF]">
            VOSTEX
          </span>
        </motion.div>

        {/* Headline — stacked, last word accented */}
        <motion.h1
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: prefersReduced ? 0 : 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="display-stack text-white max-w-5xl"
          style={{ fontSize: "clamp(2.75rem, 8vw, 6rem)" }}
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {i === words.length - 1 ? <span className="accent">{word}</span> : word}
            </span>
          ))}
        </motion.h1>

        {/* Bottom row: subheadline (left) + CTAs (right) */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: prefersReduced ? 0 : 0.4 }}
          className="mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <p
            className="text-lg sm:text-xl text-[#94A3B8] max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t("subheadline")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <GlowButton variant="primary" onClick={() => scrollTo("contact")}>
              {t("cta_primary")}
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => scrollTo("portfolio")}>
              {t("cta_secondary")}
            </GlowButton>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("services")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94A3B8] hover:text-[#00C2FF] transition-colors cursor-pointer min-h-[44px]"
        aria-label={t("scroll")}
      >
        <span className="text-xs tracking-widest uppercase">{t("scroll")}</span>
        <ArrowDown size={16} />
      </motion.button>
    </section>
  );
}
