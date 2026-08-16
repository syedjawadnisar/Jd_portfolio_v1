"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollHint } from "@/components/ui/ScrollHint";

export function ScrollCue() {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      className="mt-10 flex flex-col items-center sm:absolute sm:bottom-8 sm:mt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.9 }}
    >
      <ScrollHint
        reduce={reduce}
        label={
          <>
            or keep scrolling —{" "}
            <span className="text-[--color-accent-soft]">
              the whole story is below
            </span>
          </>
        }
      />
    </motion.div>
  );
}
