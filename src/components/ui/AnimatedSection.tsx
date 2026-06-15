"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  "data-tone"?: "light" | "dark";
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  ...props
}: Props) {
  const prefersReduced = useReducedMotion();

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 },
  };

  const initial = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, ...directionMap[direction] };

  const animate = { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      className={className}
      data-tone={props["data-tone"]}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: prefersReduced ? 0.1 : 0.6,
        delay: prefersReduced ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
