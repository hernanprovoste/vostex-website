"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { GlowButton } from "@/components/ui/GlowButton";

// Anchors point at the home page ("/#id") so they work from any page.
// `section` is the element id used for scrollspy when already on the home page.
const navLinks = [
  {
    key: "capabilities",
    href: { pathname: "/", hash: "capabilities" },
    section: "capabilities",
  },
  { key: "work", href: { pathname: "/", hash: "work" }, section: "work" },
  {
    key: "philosophy",
    href: { pathname: "/", hash: "about" },
    section: "about",
  },
  { key: "contact", href: "/contact", section: null },
] as const;

type NavLink = (typeof navLinks)[number];

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname(); // locale prefix already stripped
  const onHome = pathname === "/";
  const onContact = pathname === "/contact";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  // Show the bottom hairline once the user scrolls off the top; clear the
  // scrollspy highlight when back at the very top (no section is "current").
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (onHome && window.scrollY < 120) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  // Scrollspy (home page only): highlight the section currently in view
  useEffect(() => {
    if (!onHome) return;
    const sections = navLinks
      .map((l) => (l.section ? document.getElementById(l.section) : null))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (link: NavLink) =>
    link.section ? onHome && active === link.section : onContact;

  // On the home page, anchor links scroll smoothly in place; from other pages
  // they navigate to "/#id" normally.
  const handleLinkClick = (e: React.MouseEvent, link: NavLink) => {
    setMobileOpen(false);
    if (onHome && link.section) {
      e.preventDefault();
      document
        .getElementById(link.section)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (onHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/85 backdrop-blur-md border-b transition-colors duration-150 ${
        scrolled ? "border-[#0D1F3C]/13" : "border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo — official color wordmark, preserved as-is */}
        <Link
          href="/"
          className="flex items-center"
          aria-label={t("home_aria")}
          onClick={handleLogoClick}
        >
          <Image
            src="/assets/logo-color.svg"
            alt="VOSTEX"
            width={120}
            height={30}
            priority
            className="h-7 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const current = isActive(link);
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                aria-current={
                  current ? (link.section ? "true" : "page") : undefined
                }
                className={`text-[0.8rem] uppercase tracking-[0.12em] pb-0.5 border-b transition-colors duration-150 cursor-pointer ${
                  current
                    ? "text-[#0D1F3C] border-[#0D1F3C]"
                    : "text-[#4A5568] border-transparent hover:text-[#0D1F3C] hover:border-[#0D1F3C]"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </div>

        {/* Right side: lang toggle + CTA (the CTA is redundant on /contact) */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle appearance="light" />
          {!onContact && (
            <GlowButton
              variant="cyan"
              href="/contact"
              className="px-5 py-2.5 text-[0.72rem]"
            >
              {t("cta")}
            </GlowButton>
          )}
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle appearance="light" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="p-2 text-[#4A5568] hover:text-[#0D1F3C] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? t("menu_close") : t("menu_open")}
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
                const current = isActive(link);
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    aria-current={
                      current ? (link.section ? "true" : "page") : undefined
                    }
                    className={`text-sm uppercase tracking-[0.12em] text-left py-3 border-t border-[#0D1F3C]/10 first:border-t-0 transition-colors cursor-pointer ${
                      current
                        ? "text-[#0D1F3C] font-bold"
                        : "text-[#4A5568] hover:text-[#0D1F3C]"
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
              {!onContact && (
                <GlowButton variant="cyan" href="/contact" className="w-full mt-4">
                  {t("cta")}
                </GlowButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
