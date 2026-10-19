"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Overlay tiers, highest last:
 *   z-[100] — full-screen curtains (IntroOverlay)
 *   z-[200] — the cursor, which must never be painted over while the
 *             native one is hidden.
 */
const CURSOR_LAYER = "z-[200]";

/**
 * Bespoke cursor — dot (precise pointer) + ring (spring-tracked).
 * Ring grows + softens on hoverable targets ([data-cursor="hover"]).
 * Native cursor is hidden on fine pointers via globals.css.
 * Touch / coarse-pointer devices skip the cursor entirely.
 */
export function Cursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { damping: 25, stiffness: 350, mass: 0.45 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 350, mass: 0.45 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('[data-cursor="hover"]') ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('[data-cursor="hover"]') ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(false);
      }
    };

    const onDown = () => setIsPressed(true);
    const onUp = () => setIsPressed(false);
    const onLeaveDoc = () => {
      mouseX.set(-100);
      mouseY.set(-100);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const ringSize = isHovering ? 56 : 30;
  const ringOpacity = isHovering ? 0.75 : 0.4;
  const dotScale = isPressed ? 0.6 : isHovering ? 0.4 : 1;

  return (
    <>
      {/* Outer ring — spring-tracked, lags slightly */}
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 ${CURSOR_LAYER} mix-blend-screen`}
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full border border-(--color-accent)"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: ringOpacity,
            x: -ringSize / 2,
            y: -ringSize / 2,
          }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
        />
      </motion.div>

      {/* Inner dot — exact mouse position, no lag */}
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 ${CURSOR_LAYER} h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-accent) mix-blend-screen`}
        style={{ x: mouseX, y: mouseY }}
        animate={{ scale: dotScale }}
        transition={{ type: "spring", damping: 24, stiffness: 380 }}
      />
    </>
  );
}
