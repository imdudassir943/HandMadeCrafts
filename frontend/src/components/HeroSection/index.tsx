"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

interface HeroSectionProps {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export default function HeroSection({
  imageSrc = "/images/hero_background.jpg",
  title = "Handcrafted Beauty For Modern Living",
  subtitle = "Discover unique furniture and decor created by master artisans using traditional, sustainable techniques.",
  primaryCtaText = "Explore Collection",
  primaryCtaLink = "/shop",
  secondaryCtaText = "Our Story",
  secondaryCtaLink = "/stories",
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook for tracking scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax translation for the background image
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  // Scale background slightly to avoid edge gaps during parallax and add depth
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  // Fade out scroll indicator and fade down text on scroll
  const opacityScroll = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const yContent = useTransform(scrollYProgress, [0, 0.6], [0, -50]);

  // Headline animation: Staggered word-by-word reveal
  const words = title.split(" ");
  const headlineStagger = 0.08;
  const subtitleDelay = (words.length * headlineStagger) + 0.4;
  const ctaDelay = subtitleDelay + 0.3;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: headlineStagger,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
      },
    },
  };

  // Subheadline animation: Fade in with delay
  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: subtitleDelay,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // CTAs animation: Spring up from bottom
  const ctaVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: ctaDelay,
        type: "spring",
        damping: 14,
        stiffness: 100,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#3B1F0E] text-[#FAF3E0]"
    >
      {/* Background Image Container with Parallax */}
      <motion.div
        style={{
          y: yBg,
          scale: scaleBg,
          backgroundImage: `url(${imageSrc})`,
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
      />

      {/* Dark overlay for readability (Deep Walnut Brown) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3B1F0E]/80 via-[#3B1F0E]/65 to-[#3B1F0E]/85 pointer-events-none" />

      {/* Hero Content Layer */}
      <motion.div
        style={{ opacity: opacityContent, y: yContent }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center select-none"
      >
        {/* Headline Word-by-Word Reveal */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 flex flex-wrap justify-center text-white"
        >
          {words.map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden mr-[0.22em] pb-1.5">
              <motion.span variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Subheadline Fade In */}
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-xl text-[#FAF3E0]/85 max-w-2xl mx-auto leading-relaxed font-light mb-10"
        >
          {subtitle}
        </motion.p>

        {/* Action Buttons with Spring Animation */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={primaryCtaLink}
              className="inline-flex justify-center items-center px-8 py-3.5 rounded-[4px] bg-[#C1440E] text-[#FAF3E0] font-semibold tracking-wide hover:bg-[#C1440E]/90 transition-colors duration-200 shadow-lg shadow-[#C1440E]/20 text-sm md:text-base min-w-[200px]"
            >
              {primaryCtaText}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={secondaryCtaLink}
              className="inline-flex justify-center items-center px-8 py-3.5 rounded-[4px] border-2 border-[#7D9B76] text-[#FAF3E0] font-semibold tracking-wide hover:bg-[#7D9B76]/10 transition-colors duration-200 text-sm md:text-base min-w-[200px]"
            >
              <span className="hover:text-[#D4A017] transition-colors duration-200">
                {secondaryCtaText}
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Bouncing Scroll Indicator (Fades out on scroll) */}
      <motion.div
        style={{ opacity: opacityScroll }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer pointer-events-none z-10"
      >
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#FAF3E0]/60">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
          }}
          className="text-[#D4A017]"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </div>
  );
}
