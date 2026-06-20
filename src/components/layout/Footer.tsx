import { useTranslations } from "next-intl";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const links = [
    { key: "capabilities", href: "#capabilities" },
    { key: "work", href: "#work" },
    { key: "philosophy", href: "#about" },
    { key: "contact", href: "#contact" },
  ] as const;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#060D1A] text-[#E8ECF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Giant serif wordmark with logo-white */}
        <div className="flex items-baseline gap-3">
          <Image
            src="/assets/logo-white.svg"
            alt=""
            width={64}
            height={68}
            aria-hidden
            className="w-auto self-center"
            style={{ height: "clamp(2.2rem, 7vw, 4.8rem)" }}
          />
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-6 border-t border-[#E8ECF0]/14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-[0.78rem] uppercase tracking-[0.1em] text-[#8A97A8] hover:text-[#E8ECF0] transition-colors duration-150"
              >
                {tNav(link.key)}
              </a>
            ))}
          </div>

          <p className="text-[0.72rem] uppercase tracking-[0.1em] text-[#8A97A8]">
            {t("crafted")} · © {year} VOSTEX
          </p>
        </div>
      </div>
    </footer>
  );
}
