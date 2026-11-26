"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
}

/**
 * Top progress bar minimalista para transiciones de página.
 * - Barra de 2px alineada al borde superior del viewport
 * - Crece de 0% a ~85% de forma exponencial mientras dura la navegación
 * - Al completar (isLoading -> false) salta a 100% y se desvanece
 * - No bloquea la UI ni muestra texto
 * - Inspiración: NProgress, GitHub, YouTube
 */
export function LoadingScreen({ isLoading }: LoadingScreenProps): ReactNode {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="top-progress-bar"
          className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px] origin-left bg-gradient-to-r from-primary via-primary to-primary/60"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{
            scaleX: 0.85,
            transition: { duration: 4, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            scaleX: 1,
            opacity: 0,
            transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{
            boxShadow: "0 0 8px rgb(from var(--primary) r g b / 0.6)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
