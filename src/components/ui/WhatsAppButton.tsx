"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const PHONE = "56992576688";

export function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const prefersReduced = useReducedMotion();

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(t("message"))}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("aria_label")}
      whileTap={prefersReduced ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] transition-colors duration-150"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.003 2C6.478 2 2 6.477 2 12c0 1.85.507 3.632 1.463 5.191L2 22l4.955-1.436A9.945 9.945 0 0 0 12.003 22C17.526 22 22 17.523 22 12S17.526 2 12.003 2zm0 18.161a8.13 8.13 0 0 1-4.144-1.132l-.297-.176-3.075.892.907-3.03-.194-.31A8.116 8.116 0 0 1 3.844 12c0-4.501 3.658-8.159 8.16-8.159 4.501 0 8.158 3.658 8.158 8.159 0 4.502-3.657 8.161-8.159 8.161z" />
      </svg>
    </motion.a>
  );
}
