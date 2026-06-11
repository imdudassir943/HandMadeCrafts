"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Award, Compass } from "lucide-react";

interface ProductImageFlipProps {
  product: Product;
  language: string;
}

export default function ProductImageFlip({ product, language }: ProductImageFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isUr = language === "ur";
  
  const name = isUr ? product.nameUr : product.name;
  const artisan = isUr ? product.artisanUr : product.artisan;
  const material = isUr ? product.materialUr : product.material;
  const dimensions = isUr ? product.dimensionsUr : product.dimensions;

  const t = {
    en: {
      flipHint: "Hover / Click to Flip",
      makerTitle: "Meet the Maker",
      certTitle: "Artisan Certification",
      certSub: "100% Handcrafted Heritage",
      materials: "Materials",
      dimensions: "Dimensions",
      supportNote: `${artisan} takes immense pride in creating this work of art using heritage techniques preserved and passed down through generations. Every purchase directly sustains our family workshops.`,
    },
    ur: {
      flipHint: "معلومات کے لیے کلک کریں",
      makerTitle: "دستکار کا تعارف",
      certTitle: "خالص دستکاری کی تصدیق",
      certSub: "100٪ روایتی اور پائیدار کام",
      materials: "مواد",
      dimensions: "پیمائش",
      supportNote: `${artisan} کو ان روایتی طریقوں کا استعمال کرتے ہوئے اس خوبصورت فن پارے کو تیار کرنے پر فخر ہے جو نسل در نسل ان کے خاندان میں منتقل ہوتے آ رہے ہیں۔ ہر خریداری براہ راست ہمارے ہنرمندوں کی کفالت کرتی ہے۔`,
    },
  }[language === "ur" ? "ur" : "en"];

  // Rotate transition spring/ease setup
  const flipTransition = { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      className="relative aspect-square w-full cursor-pointer select-none rounded-card"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={flipTransition}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-card overflow-hidden bg-brand-cream/10 border border-brand-sienna/10 dark:border-brand-cream/10 shadow-warm"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

          {/* Interactive Flip Badge Hint */}
          <div className="absolute top-4 right-4 bg-brand-espresso/80 dark:bg-brand-cream/90 text-brand-cream dark:text-brand-espresso text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
            <span>{t.flipHint}</span>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-card overflow-hidden bg-brand-espresso border border-brand-gold/30 shadow-2xl flex flex-col p-6 justify-between select-none"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Stylized background lines */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffe6a7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Header */}
          <div className="space-y-4 text-center z-10">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                {t.makerTitle}
              </span>
              <h4 className="font-serif text-2xl font-bold text-white mt-0.5">
                {artisan}
              </h4>
            </div>

            {/* Circular Artisan Image */}
            <div className="relative h-24 w-24 mx-auto rounded-full border-2 border-brand-gold p-1 bg-brand-cream/10 shadow-lg">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-brand-cream/5">
                <Image
                  src={product.artisanImage}
                  alt={artisan}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-espresso p-1.5 rounded-full shadow-md">
                <Award className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Body Narrative */}
          <div className="text-center z-10 px-2">
            <p className="text-xs text-brand-cream/80 leading-relaxed italic line-clamp-4">
              &ldquo;{t.supportNote}&rdquo;
            </p>
          </div>

          {/* Specs Details */}
          <div className="grid grid-cols-2 gap-3 z-10 border-t border-brand-cream/10 pt-4">
            <div className="bg-brand-cream/5 rounded p-2 text-center border border-brand-cream/10">
              <span className="block text-[9px] uppercase tracking-wider text-brand-gold font-semibold mb-0.5">
                {t.materials}
              </span>
              <span className="text-xs font-medium text-white truncate block">
                {material}
              </span>
            </div>
            
            <div className="bg-brand-cream/5 rounded p-2 text-center border border-brand-cream/10">
              <span className="block text-[9px] uppercase tracking-wider text-brand-gold font-semibold mb-0.5">
                {t.dimensions}
              </span>
              <span className="text-xs font-medium text-white truncate block">
                {dimensions}
              </span>
            </div>
          </div>

          {/* Compass layout background */}
          <div className="absolute bottom-16 right-4 opacity-5 pointer-events-none">
            <Compass className="h-24 w-24 text-brand-gold" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
