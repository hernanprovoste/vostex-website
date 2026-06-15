"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { GlowButton } from "@/components/ui/GlowButton";

const navLinks = [
  { key: "services", href: "#services" },
  { key: "portfolio", href: "#portfolio" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false); // past 20px → show a bar background
  const [light, setLight] = useState(false); // past the dark hero → light theme
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  // Bar background + light/dark theme keyed off the actual hero height
  useEffect(() => {
    const hero = document.querySelector("main > section");
    const onScroll = () => {
      const y = window.scrollY;
      const heroH = hero
        ? (hero as HTMLElement).offsetHeight
        : window.innerHeight;
      setScrolled(y > 20);
      setLight(y > heroH - 64);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: highlight the section currently in view
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        light
          ? "bg-white/95 backdrop-blur-md border-b border-[#0D1F3C]/10"
          : scrolled
            ? "bg-[#060D1A]/80 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center"
          aria-label="VOSTEX - Home"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image
            src={light ? "/assets/logo-color.svg" : "/assets/logo-white.svg"}
            alt="VOSTEX"
            width={120}
            height={30}
            priority
            className="h-7 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  light
                    ? isActive
                      ? "text-[#0D1F3C]"
                      : "text-[#4A5568] hover:text-[#0D1F3C]"
                    : isActive
                      ? "text-white"
                      : "text-[#94A3B8] hover:text-white"
                }`}
              >
                {t(link.key)}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-[#00C2FF]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: lang toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle appearance={light ? "light" : "dark"} />
          <GlowButton
            variant="primary"
            onClick={() => handleNavClick("#contact")}
            className="text-xs px-4 py-2"
          >
            {t("cta")}
          </GlowButton>
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle appearance={light ? "light" : "dark"} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={`p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              light
                ? "text-[#4A5568] hover:text-[#0D1F3C]"
                : "text-[#94A3B8] hover:text-white"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer — always light */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-white/98 backdrop-blur-md border-b border-[#0D1F3C]/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => {
                const isActive = active === link.href;
                return (
                  <motion.button
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`text-base text-left py-2 transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#0D1F3C] font-semibold"
                        : "text-[#4A5568] font-medium hover:text-[#0D1F3C]"
                    }`}
                  >
                    {t(link.key)}
                  </motion.button>
                );
              })}
              <GlowButton
                variant="primary"
                onClick={() => handleNavClick("#contact")}
                className="w-full mt-2"
              >
                {t("cta")}
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
