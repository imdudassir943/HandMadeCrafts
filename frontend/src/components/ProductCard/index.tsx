"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 8px 32px rgba(111,29,27,0.12)" }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-card bg-white border border-brand-sienna/10 shadow-warm hover:border-brand-sienna/20"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-brand-cream/10">
        <Image
          src={product.image}
          alt={name}
          fill
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-brand-espresso/60 to-transparent flex justify-center">
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
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-sienna">
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

        <h3 className="font-serif text-lg font-bold text-brand-espresso leading-snug line-clamp-1 mb-1">
          <Link href={`/shop/${product.id}`} className="focus:outline-none hover:text-brand-sienna">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
          </Link>
        </h3>

        <p className="text-xs text-brand-espresso/60 mb-3">
          {t.by} <span className="font-medium text-brand-espresso/80">{artisan}</span>
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-brand-crimson">
            ${product.price}
          </span>
          {/* Visible Add to Cart button for touch devices */}
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
  );
}
