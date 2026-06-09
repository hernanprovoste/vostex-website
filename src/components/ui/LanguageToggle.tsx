"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "en" ? "es" : "en";
    const segments = pathname.split("/");
    segments[1] = next;
    const newPath = segments.join("/") || "/";

    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.push(newPath);
  };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 text-sm font-medium text-[#94A3B8] hover:text-[#00C2FF] transition-colors duration-200 min-h-[44px] min-w-[44px] px-2 cursor-pointer"
      aria-label={`Switch to ${locale === "en" ? "Spanish" : "English"}`}
    >
      <span className={locale === "en" ? "text-white font-semibold" : ""}>EN</span>
      <span className="text-[#1A2E4A]">/</span>
      <span className={locale === "es" ? "text-white font-semibold" : ""}>ES</span>
    </motion.button>
  );
}
