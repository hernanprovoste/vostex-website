"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function GlowButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: Props) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer select-none min-h-[44px] min-w-[44px]";

  const variants = {
    primary:
      "bg-[#00C2FF] text-[#060D1A] hover:bg-[#0090C8] shadow-[0_0_20px_rgba(0,194,255,0.3)] hover:shadow-[0_0_30px_rgba(0,194,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-transparent text-white border border-[#1A2E4A] hover:border-[#00C2FF] hover:text-[#00C2FF] disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "bg-transparent text-[#00C2FF] border border-[#00C2FF] hover:bg-[#00C2FF] hover:text-[#060D1A] disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const content = (
    <motion.span
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={classes}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} className="inline-flex">
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-flex">
      {content}
    </button>
  );
}
