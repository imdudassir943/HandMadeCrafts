"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, ShieldCheck, Heart, Award, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

import { API_BASE_URL } from "@/config";
import { Product } from "@/types";

interface ProductDetailProps {
  params: {
    id: string;
  };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const { language, direction } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/products/${params.id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
        // Fetch related products dynamically by category
        fetch(`${API_BASE_URL}/products/?category=${encodeURIComponent(data.category)}`)
          .then((r) => r.json())
          .then((relatedList) => {
            setRelatedProducts(
              relatedList.filter((p: Product) => String(p.id) !== String(data.id)).slice(0, 3)
            );
          })
          .catch((err) => console.error("Failed to load related products", err));
      })
      .catch((err) => {
        console.error("Failed to load product", err);
        setProduct(null);
        setError("not_found");
        setIsLoading(false);
      });
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 max-w-7xl mx-auto px-4">
        <div className="relative flex items-center justify-center h-12 w-12">
          <div className="absolute h-12 w-12 animate-ping rounded-full bg-brand-gold/20" />
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-brand-crimson" />
        </div>
        <p className="font-serif text-sm font-medium text-brand-espresso/80 dark:text-brand-cream/80 animate-pulse">
          {language === "en" ? "Fetching artisan details..." : "تحفہ کی تفصیلات لوڈ ہو رہی ہیں..."}
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-espresso mb-4">
          {language === "en" ? "Product Not Found" : "التحفة غير موجودة"}
        </h1>
        <p className="text-brand-sienna mb-8">
          {language === "en"
            ? "The item you are looking for might have been sold or no longer exists."
            : "ربما تكون هذه التحفة قد بيعت بالفعل أو لم تعد متوفرة في ورشنا."}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-button bg-brand-crimson text-brand-cream px-6 py-2.5 font-semibold hover:bg-brand-crimson/95"
        >
          {language === "en" ? "Back to Shop" : "العودة للمتجر"}
        </Link>
      </div>
    );
  }

  const name = language === "ur" ? product.nameUr : product.name;
  const category = language === "ur" ? product.categoryUr : product.category;
  const artisan = language === "ur" ? product.artisanUr : product.artisan;
  const material = language === "ur" ? product.materialUr : product.material;
  const dimensions = language === "ur" ? product.dimensionsUr : product.dimensions;
  const description = language === "ur" ? product.descriptionUr : product.description;

  const t = {
    en: {
      back: "Back to Marketplace",
      artisanTitle: "Meet the Maker",
      artisanSub: "Handcrafted in their family workshop",
      materials: "Materials & Composition",
      dimensions: "Dimensions",
      quantity: "Quantity",
      addBtn: "Add to Bag",
      guarantees: "Artisan Guarantees",
      fairTrade: "Fair Trade Certified",
      handmades: "100% Handcrafted",
      ecofriendly: "Sustainably Sourced Materials",
      relatedTitle: "You May Also Love",
      relatedSub: "More unique pieces handpicked from similar workshops.",
    },
    ur: {
      back: "بازار کی طرف واپس",
      artisanTitle: "دستکار سے ملیں",
      artisanSub: "ان کے خاندانی کارخانے کی ہاتھ سے بنی اشیاء",
      materials: "مواد اور ترکیب",
      dimensions: "پیمائش",
      quantity: "مقدار",
      addBtn: "تھیلے میں شامل کریں",
      guarantees: "ہمارے دستکاروں کے وعدے",
      fairTrade: "منصفانہ تجارت کا سرٹیفکیٹ",
      handmades: "100% ہاتھ سے تیار کردہ",
      ecofriendly: "پائیدار ذرائع سے حاصل کردہ مواد",
      relatedTitle: "آپ کو یہ بھی پسند آ سکتا ہے",
      relatedSub: "اسی طرح کے کارخانوں سے منتخب کردہ مزید منفرد شاہکار۔",
    },
  }[language];

  // Related products loaded from state

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-espresso hover:text-brand-sienna"
        >
          <ArrowLeft className={`h-4 w-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
          <span>{t.back}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
        {/* Product Image Panel */}
        <div className="lg:col-span-6 relative aspect-square w-full overflow-hidden rounded-card bg-brand-cream/10 border border-brand-sienna/10 shadow-warm">
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Details Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-sienna">
              {category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mt-1 mb-2">
              {name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-brand-crimson">${product.price}</span>
              <div className="flex items-center gap-1 border-l border-brand-sienna/20 pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
                <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                <span className="text-sm font-bold text-brand-espresso">{product.rating}</span>
                <span className="text-xs text-brand-espresso/60">({product.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-base text-brand-espresso/80 leading-relaxed">
            {description}
          </p>

          {/* Specs List */}
          <div className="border-y border-brand-sienna/10 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-brand-espresso/70">{t.materials}:</span>
              <span className="text-brand-espresso font-medium">{material}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-brand-espresso/70">{t.dimensions}:</span>
              <span className="text-brand-espresso font-medium">{dimensions}</span>
            </div>
          </div>

          {/* Quantity selector and Add Button */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-brand-espresso/70">
                {t.quantity}
              </label>
              <div className="flex items-center border border-brand-sienna/20 rounded-button bg-white">
                <button
                  type="button"
                  onClick={decrementQty}
                  className="p-2.5 hover:text-brand-crimson"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQty}
                  className="p-2.5 hover:text-brand-crimson"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-button bg-brand-crimson py-3 font-semibold text-brand-cream hover:bg-brand-crimson/95 shadow-lg shadow-brand-crimson/10 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{t.addBtn}</span>
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="bg-brand-cream/15 p-4 rounded-card border border-brand-sienna/5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-sienna">
              {t.guarantees}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Award, text: t.fairTrade },
                { icon: Heart, text: t.handmades },
                { icon: ShieldCheck, text: t.ecofriendly },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-brand-gold flex-shrink-0" />
                    <span className="text-xs text-brand-espresso/80 font-medium leading-tight">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Meet The Maker Subsection */}
      <section className="border-t border-brand-sienna/10 pt-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-brand-cream/5 rounded-card p-6 border border-brand-sienna/10">
          <div className="md:col-span-3 flex justify-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow bg-brand-cream/10">
              <Image
                src={product.artisanImage}
                alt={artisan}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-9 space-y-3 text-center md:text-start">
            <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
              {t.artisanTitle}
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-espresso">
              {artisan}
            </h3>
            <p className="text-sm text-brand-espresso/60 italic">
              {t.artisanSub}
            </p>
            <p className="text-sm text-brand-espresso/80 leading-relaxed">
              {language === "ur"
                ? `${artisan} کو ان روایتی طریقوں کا استعمال کرتے ہوئے اس خوبصورت فن پارے کو تیار کرنے پر فخر ہے جو نسل در نسل ان کے خاندان میں منتقل ہوتے آ رہے ہیں۔ ہر خریداری براہ راست ہمارے ہنرمندوں کے خاندانوں کی کفالت کرتی ہے۔`
                : `${artisan} takes immense pride in creating this work of art using heritage techniques preserved and passed down through generations. Every purchase directly sustains our workshop families and keeps centuries-old heritage crafts alive.`}
            </p>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-brand-sienna/10 pt-12">
          <div className="text-center sm:text-start mb-8">
            <h2 className="text-2xl font-serif font-bold text-brand-espresso mb-2">
              {t.relatedTitle}
            </h2>
            <p className="text-sm text-brand-sienna">
              {t.relatedSub}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
