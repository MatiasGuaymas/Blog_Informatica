"use client";

import { motion } from "framer-motion";
import { Children, type ReactNode } from "react";

interface StaggerListProps {
  /** Each top-level child is rendered as a separately-animated <li>. */
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  /** Delay between siblings, in milliseconds. */
  staggerMs?: number;
  /** Initial delay before the first child appears, in seconds. */
  delay?: number;
  /** Whether to animate on mount or wait until scrolled into view. */
  trigger?: "mount" | "view";
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function StaggerList({
  children,
  className,
  itemClassName,
  staggerMs = 70,
  delay = 0,
  trigger = "mount",
}: StaggerListProps) {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerMs / 1000,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE },
    },
  };

  const triggerProps =
    trigger === "view"
      ? {
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, margin: "-60px" },
        }
      : {
          initial: "hidden" as const,
          animate: "show" as const,
        };

  return (
    <motion.ul
      className={className}
      variants={containerVariants}
      {...triggerProps}
    >
      {Children.map(children, (child, i) => (
        <motion.li
          // biome-ignore lint/suspicious/noArrayIndexKey: stagger order is intentional
          key={i}
          className={itemClassName}
          variants={itemVariants}
        >
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}
