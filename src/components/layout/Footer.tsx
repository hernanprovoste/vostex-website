import { useTranslations } from "next-intl";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const links = [
    { key: "services", href: "#services" },
    { key: "portfolio", href: "#portfolio" },
    { key: "about", href: "#about" },
    { key: "contact", href: "#contact" },
  ] as const;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#060D1A] border-t border-[#1A2E4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/assets/logo-white.svg"
              alt="VOSTEX"
              width={110}
              height={28}
              className="h-7 w-auto"
            />
            <p className="text-sm text-[#4A5568] leading-relaxed max-w-[260px]">
              Engineered systems for real-world operations. <br />
              Sistemas de software para operaciones reales.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A5568] mb-1">
              Navigation
            </p>
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm text-[#94A3B8] hover:text-[#00C2FF] transition-colors duration-200 w-fit"
              >
                {tNav(link.key)}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A5568] mb-1">
              Contact
            </p>
            <a
              href="#contact"
              className="text-sm text-[#94A3B8] hover:text-[#00C2FF] transition-colors duration-200 w-fit"
            >
              Get in touch →
            </a>
            <p className="text-sm text-[#4A5568]">Valdivia, Chile</p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://linkedin.com/company/vostex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A5568] hover:text-[#00C2FF] transition-colors min-h-[44px] min-w-[44px] flex items-center gap-1 text-xs"
                aria-label="LinkedIn"
              >
                <ExternalLink size={14} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/vostex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A5568] hover:text-[#00C2FF] transition-colors min-h-[44px] min-w-[44px] flex items-center gap-1 text-xs"
                aria-label="GitHub"
              >
                <ExternalLink size={14} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1A2E4A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#4A5568]">
            {t("crafted")} · vostex.io
          </p>
          <p className="text-xs text-[#4A5568]">
            © {year} VOSTEX. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
