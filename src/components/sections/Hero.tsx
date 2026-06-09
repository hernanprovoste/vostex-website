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
      {/* Radial glow background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,194,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle corner glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,194,255,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Label */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF]">
            vostex.ai
          </span>
        </motion.div>

        {/* Headline — animated word by word */}
        <h1
          className="font-display font-bold text-white leading-tight tracking-tight mb-6"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: prefersReduced ? 0 : 0.3 + i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="inline-block mr-[0.25em]"
            >
              {word === "gap." ? (
                <span className="text-[#00C2FF] text-glow-cyan">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: prefersReduced ? 0 : 0.8 }}
          className="text-lg sm:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <GlowButton
            variant="primary"
            onClick={() => scrollTo("portfolio")}
          >
            {t("cta_primary")}
          </GlowButton>
          <GlowButton
            variant="secondary"
            onClick={() => scrollTo("about")}
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
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4A5568] hover:text-[#00C2FF] transition-colors cursor-pointer min-h-[44px]"
        aria-label={t("scroll")}
      >
        <span className="text-xs tracking-widest uppercase">{t("scroll")}</span>
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
