"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";

interface ProductImageFlipProps {
  product: Product;
  language: string;
}

export default function ProductImageFlip({ product, language }: ProductImageFlipProps) {
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const isUr = language === "ur";
  const name = isUr ? product.nameUr : product.name;

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Main Image Viewport */}
      <div className="relative aspect-square w-full rounded-card overflow-hidden bg-brand-cream/10 border border-brand-sienna/10 dark:border-brand-cream/10 shadow-warm group">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={selectedIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={productImages[selectedIdx]}
              alt={`${name} - View ${selectedIdx + 1}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Only show if multiple images exist) */}
        {productImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-brand-espresso/70 text-brand-cream border border-brand-cream/10 shadow-md hover:bg-brand-gold hover:text-brand-espresso opacity-100 transition-all duration-300 pointer-events-auto [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-brand-espresso/70 text-brand-cream border border-brand-cream/10 shadow-md hover:bg-brand-gold hover:text-brand-espresso opacity-100 transition-all duration-300 pointer-events-auto [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row (Only show if multiple images exist) */}
      {productImages.length > 1 && (
        <div className="flex gap-3 justify-center overflow-x-auto py-1.5 scrollbar-thin">
          {productImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-card overflow-hidden border-2 bg-brand-cream/5 transition-all duration-300 outline-none flex-shrink-0 ${
                selectedIdx === idx
                  ? "border-brand-gold scale-105 shadow-md"
                  : "border-brand-sienna/10 hover:border-brand-sienna/30 dark:border-brand-cream/10 dark:hover:border-brand-cream/30 hover:scale-102"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 80px, 100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
