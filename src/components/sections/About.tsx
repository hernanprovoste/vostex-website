"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { ShieldCheck, Layers, TrendingUp, Users } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Image from "next/image";

const valueIcons = {
  reliability: ShieldCheck,
  versatility: Layers,
  scalability: TrendingUp,
  accessibility: Users,
};

type ValueKey = keyof typeof valueIcons;

function Counter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setCount(target);
      return;
    }
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, prefersReduced]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function About() {
  const t = useTranslations("about");
  const values: ValueKey[] = ["reliability", "versatility", "scalability", "accessibility"];

  const stats = [
    { value: 20, suffix: "+", key: "projects" },
    { value: 8, suffix: "+", key: "industries" },
    { value: 3, suffix: "", key: "countries" },
    { value: 100, suffix: "%", key: "satisfaction" },
  ];

  return (
    <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#060D1A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-4">
            {t("label")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t("title")}
          </h2>
        </AnimatedSection>

        {/* Brand story */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="flex flex-col gap-5">
            <p className="text-[#94A3B8] text-lg leading-relaxed">
              {t("description")}
            </p>
            <div className="border-l-2 border-[#00C2FF]/30 pl-4">
              <p className="text-sm text-[#4A5568] leading-relaxed italic">
                {t("origin")}
              </p>
            </div>
            <p className="text-xs text-[#4A5568] font-medium">
              {t("founder")}
            </p>
          </div>

          {/* Logo display */}
          <div className="flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl border border-[#1A2E4A] bg-[#0D1F3C] p-12 flex items-center justify-center overflow-hidden"
              style={{ boxShadow: "0 0 60px rgba(0,194,255,0.05)" }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(0,194,255,0.03), transparent 70%)" }}
              />
              <Image
                src="/assets/logo-white.svg"
                alt="VOSTEX"
                width={200}
                height={50}
                className="relative h-12 w-auto"
              />
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.key} delay={i * 0.1}>
              <div className="rounded-xl border border-[#1A2E4A] bg-[#0D1F3C] p-6 text-center">
                <p
                  className="text-3xl md:text-4xl font-extrabold text-[#00C2FF] mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-[#4A5568] font-medium uppercase tracking-wider">
                  {t(`stats.${stat.key}`)}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Values */}
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-8 text-center">
            Our values
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((key, i) => {
              const Icon = valueIcons[key];
              return (
                <AnimatedSection key={key} delay={i * 0.08} direction="up">
                  <div className="rounded-xl border border-[#1A2E4A] bg-[#0D1F3C] p-5 flex flex-col gap-3 h-full">
                    <Icon size={20} className="text-[#00C2FF]" strokeWidth={1.5} />
                    <h3
                      className="text-sm font-semibold text-white"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {t(`values.${key}.title`)}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {t(`values.${key}.description`)}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
