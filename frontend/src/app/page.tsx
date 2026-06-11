"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard";
import ArtisanShowcase from "@/components/ArtisanShowcase";
import AuthSection from "@/components/AuthSection";
import ReviewSection from "@/components/ReviewSection";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { API_BASE_URL } from "@/config";
import { Product } from "@/types";

export default function Home() {
  const { language, direction } = useLanguage();
  const [heroTitle, setHeroTitle] = React.useState("");
  const [heroSub, setHeroSub] = React.useState("");
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);

  // Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring configuration to prevent jitter
  const springConfig = { damping: 50, stiffness: 300, mass: 0.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Background dots move slightly in the opposite direction (subtle, low intensity)
  const bgX = useTransform(mouseXSpring, [-400, 400], [12, -12]);
  const bgY = useTransform(mouseYSpring, [-400, 400], [12, -12]);

  // Hero image moves in the same direction (slightly more pronounced)
  const imageX = useTransform(mouseXSpring, [-400, 400], [-25, 25]);
  const imageY = useTransform(mouseYSpring, [-400, 400], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Relative coordinates from the center of the container
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Return smoothly to the center
    mouseX.set(0);
    mouseY.set(0);
  };

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard/settings/`)
      .then((res) => res.json())
      .then((data) => {
        setHeroTitle(language === "ur" ? data.heroTitleUr : data.heroTitle);
        setHeroSub(language === "ur" ? data.heroSubUr : data.heroSub);
      })
      .catch((err) => {
        console.error("Failed to load settings in Home", err);
        setHeroTitle(
          language === "ur"
            ? "ہاتھ سے بنے شاہکار آپ کے خوبصورت گھر کے لیے"
            : "Handcrafted Treasures for Your Sanctuary"
        );
        setHeroSub(
          language === "ur"
            ? "اپنے گھر کو دنیا بھر کے ماہر دستکاروں کی کہانیوں سے سجائیں۔ منتخب، پائیدار اور شاندار ہوم ڈیکور۔"
            : "Immerse your space in the stories of global master craftsmen. Curated, sustainable, and heirloom-quality home decor."
        );
      });

    fetch(`${API_BASE_URL}/products/?featured=true`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(data.slice(0, 3));
      })
      .catch((err) => {
        console.error("Failed to load products in Home", err);
      });
  }, [language]);

  const t = {
    en: {
      cta: "Shop the Collection",
      catTitle: "Browse by Category",
      catSub: "Explore items crafted by hand over weeks of focused artistry.",
      featuredTitle: "The Artisan Edit",
      featuredSub: "Handpicked signature pieces from our workshops.",
      ceramics: "Ceramics",
      textiles: "Textiles",
      woodwork: "Woodwork",
      lighting: "Lighting",
    },
    ur: {
      cta: "کلیکشن خریدیں",
      catTitle: "زمرے کے لحاظ سے دیکھیں",
      catSub: "ہفتوں کی مہارت اور توجہ سے تیار کردہ ہاتھ سے بنی اشیاء دیکھیں۔",
      featuredTitle: "خاص دستکاری",
      featuredSub: "ہمارے کارخانوں سے منتخب کردہ دستکاری کے بہترین نمونے۔",
      ceramics: "مٹی کے برتن",
      textiles: "منسوجات",
      woodwork: "لکڑی کا کام",
      lighting: "لائٹس اور فانوس",
    },
  }[language];

  const categories = [
    { name: t.ceramics, image: "/images/ceramic_vase.png", href: "/shop?category=Ceramics" },
    { name: t.textiles, image: "/images/wall_hanging.png", href: "/shop?category=Textiles" },
    { name: t.woodwork, image: "/images/wood_bowl.png", href: "/shop?category=Woodwork" },
    { name: t.lighting, image: "/images/brass_lantern.png", href: "/shop?category=Lighting" },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. Hero Section */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden bg-brand-espresso text-brand-cream py-20 lg:py-32"
      >
        {/* Decorative background vectors (moves opposite) */}
        <motion.div
          style={{ x: bgX, y: bgY, scale: 1.05 }}
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffe6a7_1px,transparent_1px)] [background-size:24px_24px]"
        />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{language === "en" ? "100% Authentic Handiwork" : "100% خالص دستکاری"}</span>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white"
              >
                {heroTitle}
              </motion.h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-brand-cream/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {heroSub}
              </p>

              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-button bg-brand-gold px-6 py-3 font-semibold text-brand-espresso hover:bg-brand-gold/90 transition-colors shadow-lg shadow-brand-crimson/20"
                >
                  <span>{t.cta}</span>
                  <ArrowRight className={`h-4 w-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>

            {/* Hero Interactive Collage (moves with cursor) */}
            <div className="lg:col-span-5 relative hidden lg:flex justify-center">
              <motion.div
                style={{ x: imageX, y: imageY }}
                className="relative w-80 h-96"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-card overflow-hidden border-4 border-brand-cream/30 shadow-2xl bg-brand-cream/15"
                >
                  <Image
                    src="/images/ceramic_vase.png"
                    alt="Aura Crafts Hero Art"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
                
                {/* Floating card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-10 bg-white dark:bg-brand-espresso text-brand-espresso dark:text-brand-cream p-4 rounded-card shadow-xl border border-brand-sienna/10 flex items-center gap-3"
                >
                  <div className="relative h-12 w-12 rounded-card overflow-hidden">
                    <Image src="/images/artisan_portrait.png" alt="Artisan" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-brand-gold">
                      {language === "en" ? "Featured Artist" : "نمایاں دستکار"}
                    </p>
                    <p className="font-serif text-sm font-bold">
                      {language === "en" ? "Yusuf Ahmed" : "یوسف احمد"}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-serif font-bold text-brand-espresso mb-3">
            {t.catTitle}
          </h2>
          <p className="text-sm sm:text-base text-brand-sienna">
            {t.catSub}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-card border border-brand-sienna/5 bg-brand-cream/5 shadow-warm"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/80 via-brand-espresso/35 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 flex flex-col justify-end text-center">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-2">
                  {cat.name}
                </h3>
                <Link
                  href={cat.href}
                  className="text-xs font-semibold text-brand-gold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-white"
                >
                  {language === "en" ? "Explore" : "تفصیل دیکھیں"} &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-serif font-bold text-brand-espresso mb-3">
            {t.featuredTitle}
          </h2>
          <p className="text-sm sm:text-base text-brand-sienna">
            {t.featuredSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Storytelling Artisan Showcase */}
      <ArtisanShowcase />

      {/* 5. Member Authentication & Sign Up (The Aura Circle) */}
      <AuthSection />

      {/* 6. Review Section */}
      <ReviewSection />
    </div>
  );
}
