"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import AnimatedText from "@/components/AnimatedText";

export default function ArtisanShowcase() {
  const { language, direction } = useLanguage();

  const t = {
    en: {
      heading: "Meet Our Artisans",
      subheading: "Every item tells a story of heritage, patience, and fine craftsmanship.",
      quote: "“My grandfather taught me how to read the soul of the clay. When I shape a vase, I am not just crafting decor; I am connecting my ancestry to your home.”",
      author: "Yusuf Ahmed, Master Ceramist",
      bio: "Yusuf has been molding clay in his family workshop for over 40 years. By partnering directly with artisans like Yusuf, we ensure fair-trade wages and support the preservation of centuries-old artistic traditions.",
      cta: "Discover Their Stories",
    },
    ur: {
      heading: "ہمارے ہنرمند",
      subheading: "ہر دستکاری ورثے، صبر اور عمدہ کاریگری کی داستان سناتی ہے۔",
      quote: "”میرے دادا نے مجھے مٹی کی روح کو پڑھنا سکھایا۔ جب میں گلدان بناتا ہوں، تو میں صرف ڈیکوریشن نہیں بنا رہا ہوتا، بلکہ میں اپنے اسلاف کو آپ کے گھر سے جوڑ رہا ہوتا ہوں۔“",
      author: "یوسف احمد، مٹی کے برتنوں کے ماہر",
      bio: "یوسف پچھلے 40 سالوں سے اپنے خاندانی کارخانے میں مٹی کے شاندار برتن بنا رہے ہیں۔ ان جیسے ہنرمندوں کے ساتھ کام کر کے، ہم منصفانہ اجرت اور صدیوں پرانے فن کے تحفظ کو یقینی بناتے ہیں۔",
      cta: "ان کی کہانیاں دیکھیں",
    },
  }[language];

  return (
    <section className="relative overflow-hidden bg-brand-cream/15 py-16 sm:py-24 border-y border-brand-sienna/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <AnimatedText
            text={t.heading}
            el="h2"
            className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso dark:text-brand-cream mb-4 justify-center"
            delay={0.05}
          />
          <AnimatedText
            text={t.subheading}
            el="p"
            className="text-base sm:text-lg text-brand-sienna dark:text-brand-gold justify-center"
            delay={0.15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
          {/* Quote & Biography */}
          <div className="lg:col-span-7 space-y-8">
            <blockquote className="relative">
              <AnimatedText
                text={t.quote}
                el="p"
                className="font-serif text-xl sm:text-2xl italic text-brand-crimson dark:text-brand-gold leading-relaxed"
                delay={0.1}
              />
              <motion.cite
                initial={{ opacity: 0, x: direction === "rtl" ? 15 : -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-4 block not-italic text-sm font-semibold text-brand-espresso/80 dark:text-brand-cream/80"
              >
                — {t.author}
              </motion.cite>
            </blockquote>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 60, delay: 0.35 }}
              className={`h-px w-24 bg-brand-gold/60 origin-${direction === "rtl" ? "right" : "left"}`}
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-base text-brand-espresso/70 dark:text-brand-cream/70 leading-relaxed max-w-xl"
            >
              {t.bio}
            </motion.p>

            <div className="overflow-hidden">
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.55 }}
                whileHover={{ scale: 1.04, y: -2, transition: { type: "spring", stiffness: 400, damping: 15, delay: 0 } }}
                whileTap={{ scale: 0.98 }}
                className="rounded-button bg-brand-espresso text-brand-cream px-6 py-3 font-semibold hover:bg-brand-espresso/90 dark:bg-brand-gold dark:text-brand-espresso dark:hover:bg-brand-gold/90 shadow-md transition-all duration-200"
              >
                {t.cta}
              </motion.button>
            </div>
          </div>

          {/* Artisan Image Showcase */}
          <div className="lg:col-span-5 relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-card border-8 border-white dark:border-brand-espresso shadow-warm bg-brand-cream/10">
            <Image
              src="/images/artisan_portrait.png"
              alt={t.author}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
