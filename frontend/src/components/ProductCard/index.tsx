"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { language } = useLanguage();
  const { addToCart } = useCart();

  const name = language === "ur" ? product.nameUr : product.name;
  const category = language === "ur" ? product.categoryUr : product.category;
  const artisan = language === "ur" ? product.artisanUr : product.artisan;

  const t = {
    en: {
      quickAdd: "Add to Cart",
      by: "by",
    },
    ur: {
      quickAdd: "تھیلے میں ڈالیں",
      by: "خالق",
    },
  }[language];

  // Motion values for cursor position (relative to card center)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for interactive 3D tilt
  const springConfig = { damping: 20, stiffness: 150, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  // Spotlight position relative coordinates
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), springConfig);
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates in range [-0.5, 0.5]
    x.set((e.clientX - rect.left) / width - 0.5);
    y.set((e.clientY - rect.top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Staggered entry animation variants for scroll reveal
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
        delay: index !== undefined ? index * 0.12 : 0,
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
      className="w-full h-full flex flex-col"
    >
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
        className="group relative flex flex-col flex-1 overflow-hidden rounded-card bg-white dark:bg-brand-espresso border border-brand-sienna/10 dark:border-brand-cream/10 shadow-warm hover:shadow-warm-hover hover:border-brand-sienna/20 dark:hover:border-brand-gold/30 transition-all duration-300 ease-out"
      >
        {/* Product Image Panel */}
        <div 
          className="relative aspect-square w-full overflow-hidden bg-brand-cream/10"
          style={{ transform: "translateZ(-10px)" }}
        >
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Quick Add Overlay - Slides and Fades in on Hover */}
          <motion.div 
            variants={{
              initial: { y: 60, opacity: 0 },
              hover: { y: 0, opacity: 1 }
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-brand-espresso/70 to-transparent flex justify-center z-10"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="flex items-center gap-2 rounded-button bg-brand-crimson px-4 py-2 text-sm font-semibold text-brand-cream hover:bg-brand-crimson/90 shadow-md transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              {t.quickAdd}
            </motion.button>
          </motion.div>
        </div>

        {/* Cursor-following spotlight reflection */}
        <motion.div
          style={{
            background: `radial-gradient(circle 120px at ${shineX} ${shineY}, rgba(187, 148, 87, 0.1), transparent)`,
            transform: "translateZ(5px)",
          }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Sheen sweep animation sweep on hover */}
        <motion.div
          style={{ transform: "translateZ(10px)" }}
          className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.15)_60%,transparent_70%)] pointer-events-none"
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

        {/* Product Info Panel */}
        <div 
          className="flex flex-1 flex-col p-4 z-10 bg-white dark:bg-brand-espresso transition-colors"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex justify-between items-start gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-sienna dark:text-brand-gold">
              {category}
            </span>
            {/* Star rating */}
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
              <span className="text-xs font-semibold text-brand-espresso/80 dark:text-brand-cream/80">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-brand-espresso dark:text-brand-cream leading-snug line-clamp-1 mb-1 transition-colors group-hover:text-brand-sienna dark:group-hover:text-brand-gold">
            <Link href={`/shop/${product.id}`} className="focus:outline-none">
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </Link>
          </h3>

          <p className="text-xs text-brand-espresso/60 dark:text-brand-cream/60 mb-3">
            {t.by} <span className="font-medium text-brand-espresso/80 dark:text-brand-cream/80">{artisan}</span>
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-brand-crimson dark:text-brand-gold">
              ${product.price}
            </span>
            {/* Visible Add to Cart button for touch devices/mobile layout */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="sm:hidden flex items-center justify-center p-2 rounded-button bg-brand-crimson text-brand-cream hover:bg-brand-crimson/90 focus:outline-none"
              aria-label={`${t.quickAdd} ${name}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
