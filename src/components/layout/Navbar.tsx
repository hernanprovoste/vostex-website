"use client";

import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Light navbar once scrolled (body sections are light); transparent over the dark hero at top
  const light = scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#0D1F3C]/10"
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
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNavClick(link.href)}
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                light
                  ? "text-[#4A5568] hover:text-[#0D1F3C]"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              {t(link.key)}
            </button>
          ))}
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-white/98 backdrop-blur-md border-b border-[#0D1F3C]/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-base font-medium text-[#4A5568] hover:text-[#0D1F3C] text-left py-2 transition-colors cursor-pointer"
                >
                  {t(link.key)}
                </motion.button>
              ))}
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
