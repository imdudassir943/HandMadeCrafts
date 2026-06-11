"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  language: string;
  index: number;
}

export default function CategoryCard({ name, image, href, language, index }: CategoryCardProps) {
  const isUr = language === "ur";
  
  // Motion values for cursor position (relative to card center)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt to make interaction feel fluid
  const springConfig = { damping: 20, stiffness: 150, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  // Dynamic positional coordinates for the cursor-following radial highlight
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), springConfig);
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    // Normalize to range [-0.5, 0.5]
    x.set(clientX / width - 0.5);
    y.set(clientY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Staggered fade and slide up variants for page entry
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
        delay: index * 0.15,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ perspective: "1000px" }}
      className="w-full"
    >
      <Link href={href} className="block w-full h-full">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover="hover"
          initial="initial"
          className="group relative aspect-[3/4] w-full overflow-hidden rounded-card border border-brand-sienna/10 dark:border-brand-cream/10 bg-brand-cream/5 shadow-warm hover:shadow-warm-hover transition-all duration-300 ease-out cursor-pointer"
        >
          {/* Inner parallax background image */}
          <div 
            className="absolute inset-0 select-none pointer-events-none scale-105" 
            style={{ transform: "translateZ(-15px)" }}
          >
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={index < 2}
            />
          </div>

          {/* Color overlays */}
          {/* Base darkening gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/95 via-brand-espresso/45 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
          
          {/* Cursor-tracking golden accent radial highlight */}
          <motion.div
            style={{
              background: `radial-gradient(circle 140px at ${shineX} ${shineY}, rgba(187, 148, 87, 0.15), transparent)`,
              transform: "translateZ(5px)",
            }}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Diagonal sheen light sweep effect triggered on hover */}
          <motion.div
            style={{ transform: "translateZ(10px)" }}
            className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.18)_40%,rgba(255,255,255,0.22)_50%,rgba(255,255,255,0.18)_60%,transparent_70%)] pointer-events-none"
            variants={{
              initial: { x: "-100%", opacity: 0 },
              hover: { 
                x: "100%", 
                opacity: [0, 1, 1, 0],
                transition: { 
                  x: { duration: 0.9, ease: "easeInOut" },
                  opacity: { duration: 0.9, times: [0, 0.2, 0.8, 1] }
                }
              }
            }}
          />

          {/* Floating Card Text & Action Content */}
          <div
            className="absolute inset-x-4 bottom-6 flex flex-col justify-end text-center z-10"
            style={{ transform: "translateZ(30px)" }}
          >
            {/* Title floating interaction */}
            <motion.h3 
              variants={{
                initial: { y: 10 },
                hover: { y: 0 }
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="font-serif text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide drop-shadow-md"
            >
              {name}
            </motion.h3>
            
            {/* Sliding & Fading CTA */}
            <div className="overflow-hidden h-6">
              <motion.div
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-gold uppercase tracking-wider transition-colors duration-300 group-hover:text-white"
                variants={{
                  initial: { y: 24, opacity: 0 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span>{isUr ? "تفصیل دیکھیں" : "Explore"}</span>
                <span className={`inline-block transition-transform duration-300 group-hover:translate-x-1 ${isUr ? "rotate-180 group-hover:-translate-x-1" : ""}`}>
                  &rarr;
                </span>
              </motion.div>
            </div>
          </div>
          
          {/* Thin border glow on hover */}
          <div className="absolute inset-0 border border-transparent group-hover:border-brand-gold/30 rounded-card transition-colors duration-300 pointer-events-none" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
