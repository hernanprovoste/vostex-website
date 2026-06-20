"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { GlowButton } from "@/components/ui/GlowButton";

const navLinks = [
  { key: "capabilities", href: "#capabilities" },
  { key: "work", href: "#work" },
  { key: "philosophy", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  // Show the bottom hairline once the user scrolls off the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      className={`fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/85 backdrop-blur-md border-b transition-colors duration-150 ${
        scrolled ? "border-[#0D1F3C]/13" : "border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo — official color wordmark, preserved as-is */}
        <a
          href="#top"
          className="flex items-center"
          aria-label="VOSTEX — Home"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image
            src="/assets/logo-color.svg"
            alt="VOSTEX"
            width={120}
            height={30}
            priority
            className="h-7 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`text-[0.8rem] uppercase tracking-[0.12em] pb-0.5 border-b transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? "text-[#0D1F3C] border-[#0D1F3C]"
                    : "text-[#4A5568] border-transparent hover:text-[#0D1F3C] hover:border-[#0D1F3C]"
                }`}
              >
                {t(link.key)}
              </button>
            );
          })}
        </div>

        {/* Right side: lang toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle appearance="light" />
          <GlowButton
            variant="cyan"
            onClick={() => handleNavClick("#contact")}
            className="px-5 py-2.5 text-[0.72rem]"
          >
            {t("cta")}
          </GlowButton>
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle appearance="light" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="p-2 text-[#4A5568] hover:text-[#0D1F3C] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="md:hidden bg-[#FAFAFA] border-b border-[#0D1F3C]/13 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = active === link.href;
                return (
                  <button
                    key={link.key}
                    onClick={() => handleNavClick(link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`text-sm uppercase tracking-[0.12em] text-left py-3 border-t border-[#0D1F3C]/10 first:border-t-0 transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#0D1F3C] font-bold"
                        : "text-[#4A5568] hover:text-[#0D1F3C]"
                    }`}
                  >
                    {t(link.key)}
                  </button>
                );
              })}
              <GlowButton
                variant="cyan"
                onClick={() => handleNavClick("#contact")}
                className="w-full mt-4"
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
