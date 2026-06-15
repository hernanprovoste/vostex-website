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
    <section className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden bg-[#060D1A] bg-texture px-4 sm:px-6 lg:px-8 pt-16">
      {/* Subtle radial background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,194,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF]">
            VOSTEX
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: prefersReduced ? 0 : 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="font-display font-bold text-white leading-tight tracking-tight mb-6"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {i === words.length - 1 ? (
                <span className="text-[#00C2FF]">{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: prefersReduced ? 0 : 0.4 }}
          className="text-lg sm:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <GlowButton
            variant="primary"
            onClick={() => scrollTo("contact")}
          >
            {t("cta_primary")}
          </GlowButton>
          <GlowButton
            variant="secondary"
            onClick={() => scrollTo("portfolio")}
          >
            {t("cta_secondary")}
          </GlowButton>
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
