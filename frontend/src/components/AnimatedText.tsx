"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  el?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  once?: boolean;
  animateOnMount?: boolean;
}

const containerVariants = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  },
});

const wordVariants = {
  hidden: { opacity: 0, y: "115%", skewY: 6 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 14,
    },
  },
};

export default function AnimatedText({
  text,
  el: Tag = "p",
  className = "",
  delay = 0,
  once = true,
  animateOnMount = false,
}: AnimatedTextProps) {
  if (!text) return null;

  // Split by space, filter out any empty entries
  const words = text.split(/\s+/).filter(Boolean);

  const MotionTag = motion[Tag];

  const triggerProps = animateOnMount
    ? {
        animate: "visible",
      }
    : {
        whileInView: "visible",
        viewport: { once, margin: "-80px" },
      };

  return (
    <MotionTag
      variants={containerVariants(delay)}
      initial="hidden"
      {...triggerProps}
      className={`${className} flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] overflow-hidden`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-[0.1em]">
          <motion.span
            variants={wordVariants}
            className="inline-block origin-left"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
