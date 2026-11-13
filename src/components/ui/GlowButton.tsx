"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "cyan" | "ghost";

/** An internal page known to src/i18n/routing.ts (typed, translated per locale). */
type InternalHref = ComponentProps<typeof Link>["href"];

type Props = {
  children: ReactNode;
  onClick?: () => void;
  /** An internal page ("/contact") or an external / hash URL string. */
  href?: string | InternalHref;
  variant?: Variant;
  tone?: "light" | "dark"; // affects the ghost variant only
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
};

/**
 * Editorial button — sharp 2px edges, uppercase Lato, snappy color transition.
 * No glow, no glassmorphism. Subtle tap feedback only (no hover bounce).
 *  - primary: ink/navy fill (default CTA on light)
 *  - cyan:    electric cyan fill (the single accent CTA)
 *  - ghost:   transparent with a hairline border (tone-aware)
 */
export function GlowButton({
  children,
  onClick,
  href,
  variant = "primary",
  tone = "light",
  className = "",
  type = "button",
  disabled = false,
  target,
  rel,
}: Props) {
  const prefersReduced = useReducedMotion();

  const base =
    "relative inline-flex items-center justify-center gap-2.5 font-sans font-bold text-[0.82rem] uppercase tracking-[0.1em] px-7 py-3.5 rounded-[2px] min-h-[44px] transition-colors duration-150 cursor-pointer select-none";

  const variants: Record<Variant, string> = {
    primary:
      "bg-[#0D1F3C] text-white hover:bg-[#060D1A] disabled:opacity-50 disabled:cursor-not-allowed",
    cyan:
      "bg-[#00C2FF] text-[#060D1A] hover:bg-[#0090C8] disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      tone === "dark"
        ? "bg-transparent text-[#E8ECF0] border border-white/15 hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
        : "bg-transparent text-[#0D1F3C] border border-[#0D1F3C]/15 hover:border-[#0D1F3C] disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const content = (
    <motion.span
      whileTap={prefersReduced || disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
      className={classes}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    // Internal pages go through the locale-aware Link so "/contact" becomes
    // "/contacto" under /es for Spanish visitors; hash and external links
    // (anything that is not an app path) stay plain anchors.
    const external =
      typeof href === "string" && (!href.startsWith("/") || href.startsWith("//"));
    if (external) {
      return (
        <a href={href as string} target={target} rel={rel} className="inline-flex">
          {content}
        </a>
      );
    }
    return (
      <Link href={href as InternalHref} className="inline-flex">
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-flex">
      {content}
    </button>
  );
}
