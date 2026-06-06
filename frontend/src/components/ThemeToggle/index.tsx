"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const ariaLabel = {
    en: theme === "light" ? "Switch to night mode" : "Switch to day mode",
    ur: theme === "light" ? "رات کے موڈ پر جائیں" : "دن کے موڈ پر جائیں",
  }[language];

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/30 bg-white/80 dark:bg-brand-espresso/90 text-brand-espresso dark:text-brand-cream shadow-2xl backdrop-blur-md transition-colors hover:border-brand-gold hover:text-brand-gold focus:outline-none"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-6 w-6" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-6 w-6" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
