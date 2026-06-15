"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

type Props = {
  appearance?: "dark" | "light";
};

export function LanguageToggle({ appearance = "dark" }: Props) {
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

  const styles =
    appearance === "light"
      ? {
          base: "text-[#4A5568] hover:text-[#0077A8]",
          active: "text-[#0D1F3C] font-semibold",
          separator: "text-[#0D1F3C]/20",
        }
      : {
          base: "text-[#94A3B8] hover:text-[#00C2FF]",
          active: "text-white font-semibold",
          separator: "text-[#1A2E4A]",
        };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-1.5 text-sm font-medium ${styles.base} transition-colors duration-200 min-h-[44px] min-w-[44px] px-2 cursor-pointer`}
      aria-label={`Switch to ${locale === "en" ? "Spanish" : "English"}`}
    >
      <span className={locale === "en" ? styles.active : ""}>EN</span>
      <span className={styles.separator}>/</span>
      <span className={locale === "es" ? styles.active : ""}>ES</span>
    </motion.button>
  );
}
