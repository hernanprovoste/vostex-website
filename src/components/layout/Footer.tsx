import { useTranslations } from "next-intl";
import Image from "next/image";

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

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
              width={126}
              height={32}
              className="h-8 w-auto"
            />
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[260px]">
              Engineered systems for real-world operations. <br />
              Sistemas de software para operaciones reales.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-1">
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
            <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8] mb-1">
              Contact
            </p>
            <a
              href="#contact"
              className="text-sm text-[#94A3B8] hover:text-[#00C2FF] transition-colors duration-200 w-fit"
            >
              Get in touch →
            </a>
            <p className="text-sm text-[#94A3B8]">Valdivia, Chile</p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://linkedin.com/company/vostex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94A3B8] hover:text-[#00C2FF] transition-colors min-h-[44px] min-w-[44px] flex items-center gap-1.5 text-xs"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={16} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/vostex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94A3B8] hover:text-[#00C2FF] transition-colors min-h-[44px] min-w-[44px] flex items-center gap-1.5 text-xs"
                aria-label="GitHub"
              >
                <GitHubIcon size={16} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1A2E4A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#94A3B8]">
            {t("crafted")} · vostex.io
          </p>
          <p className="text-xs text-[#94A3B8]">
            © {year} VOSTEX. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
