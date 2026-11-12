"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  ReactNode,
  ElementType,
} from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number; // seconds, for stagger
  direction?: "up" | "down" | "left" | "right" | "none";
  as?: ElementType;
  id?: string;
};

/**
 * Editorial scroll-reveal — CSS transition on transform/opacity only, so it
 * runs on the GPU off the main thread (framer x/y shorthands stutter under
 * load). Short ease-out enter using the brand curve. Honors reduced-motion.
 */
export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as = "div",
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );
  const visible = reducedMotion || inView;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const offset =
    direction === "up"
      ? "translateY(24px)"
      : direction === "down"
        ? "translateY(-24px)"
        : direction === "left"
          ? "translateX(24px)"
          : direction === "right"
            ? "translateX(-24px)"
            : "none";

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : offset,
        transition: `opacity 450ms cubic-bezier(0.2,0,0,1) ${delay}s, transform 450ms cubic-bezier(0.2,0,0,1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}
