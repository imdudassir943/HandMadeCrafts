"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Footer() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const t = {
    en: {
      tagline: "Sourcing exquisite handmade home treasures crafted by global artisans.",
      categories: "Categories",
      support: "Customer Care",
      newsletter: "Newsletter",
      newsletterPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      subscribeSuccess: "Thank you for subscribing!",
      copyright: "© 2026 Aura Crafts. All rights reserved.",
      ceramics: "Ceramics",
      textiles: "Textiles",
      woodwork: "Woodwork",
      lighting: "Lighting",
      faq: "FAQs & Help",
      shipping: "Shipping & Returns",
      contact: "Get in Touch",
      developer: "About the Developer",
    },
    ur: {
      tagline: "دنیا بھر کے دستکاروں کی تیار کردہ نفیس اور ہاتھ سے بنی آرائشی اشیاء۔",
      categories: "زمرہ جات",
      support: "کسٹمر کیئر",
      newsletter: "خبرنامہ",
      newsletterPlaceholder: "اپنا ای میل درج کریں",
      subscribe: "شامل ہوں",
      subscribeSuccess: "خبرنامے میں شامل ہونے کا شکریہ!",
      copyright: "© 2026 اورا کرافٹس۔ تمام حقوق محفوظ ہیں۔",
      ceramics: "مٹی کے برتن",
      textiles: "منسوجات",
      woodwork: "لکڑی کا کام",
      lighting: "لائٹس اور فانوس",
      faq: "سوالات اور مدد",
      shipping: "شپنگ اور واپسی",
      contact: "رابطہ کریں",
      developer: "ڈویلپر کے بارے میں",
    },
  }[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-brand-espresso text-brand-cream border-t border-brand-sienna/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand & Tagline */}
          <div className="space-y-6">
            <span className="font-serif text-3xl font-bold tracking-wide text-brand-gold">
              {language === "en" ? "Aura Crafts" : "اورا کرافٹس"}
            </span>
            <p className="text-base text-brand-cream/80 max-w-md">
              {t.tagline}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="hover:text-brand-gold transition-colors duration-200" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.139.052 1.9.232 2.508.468.641.25 1.188.582 1.728 1.122.54.54.872 1.087 1.122 1.728.236.607.416 1.369.468 2.507.044.925.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.052 1.139-.232 1.9-.468 2.508-.25.641-.582 1.188-1.122 1.728-.54.54-1.087.872-1.728 1.122-.607.236-1.369.416-2.507.468-.925.044-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.139-.052-1.9-.232-2.508-.468a4.907 4.907 0 01-1.728-1.122 4.907 4.907 0 01-1.122-1.728c-.236-.607-.416-1.369-.468-2.507C2.01 14.816 2 14.462 2 12s.01-2.784.054-3.71c.052-1.139.232-1.9.468-2.508a4.908 4.908 0 011.122-1.728 4.908 4.908 0 011.728-1.122c.607-.236 1.369-.416 2.507-.468.925-.044 1.28-.054 3.71-.054zM12 9a3 3 0 100 6 3 3 0 000-6zm7.843-1.082a1.18 1.18 0 100-2.36 1.18 1.18 0 000 2.36z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-brand-gold transition-colors duration-200" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-brand-gold transition-colors duration-200" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>

            {/* About the Developer Button */}
            <div className="pt-2">
              <Link href="/about-developer" passHref legacyBehavior>
                <motion.a
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center rounded-button bg-brand-crimson text-brand-cream px-4 py-2 text-xs font-semibold hover:bg-brand-crimson/90 shadow-md hover:shadow-lg hover:shadow-brand-crimson/20 dark:hover:shadow-brand-crimson/30 transition-all duration-300 ease-out cursor-pointer"
                >
                  {t.developer}
                </motion.a>
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Category Links */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
                  {t.categories}
                </h3>
                <ul className="mt-4 space-y-2">
                  {[
                    { name: t.ceramics, href: "/shop?category=Ceramics" },
                    { name: t.textiles, href: "/shop?category=Textiles" },
                    { name: t.woodwork, href: "/shop?category=Woodwork" },
                    { name: t.lighting, href: "/shop?category=Lighting" },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-brand-cream/75 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
                  {t.support}
                </h3>
                <ul className="mt-4 space-y-2">
                  {["faq", "shipping", "contact"].map((key) => (
                    <li key={key}>
                      {key === "contact" ? (
                        <Link href="/contact" className="text-base text-brand-cream/75 hover:text-white transition-colors">
                          {t[key as keyof typeof t]}
                        </Link>
                      ) : (
                        <a href="#" className="text-base text-brand-cream/75 hover:text-white transition-colors">
                          {t[key as keyof typeof t]}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter subscription */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
                {t.newsletter}
              </h3>
              <form onSubmit={handleSubscribe} className="mt-4 sm:flex sm:max-w-md gap-2">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  id="email-address"
                  placeholder={t.newsletterPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-input border-0 bg-white/10 px-4 py-2 text-base text-white placeholder-brand-cream/50 focus:ring-2 focus:ring-brand-gold focus:outline-none focus:ring-offset-2 focus:ring-offset-brand-espresso"
                />
                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center rounded-button bg-brand-gold px-4 py-2 text-base font-semibold text-brand-espresso hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 sm:mt-0 sm:w-auto"
                >
                  {t.subscribe}
                </button>
              </form>
              {isSubscribed && (
                <p className="text-sm text-brand-gold animate-pulse mt-2">{t.subscribeSuccess}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-sienna/20 pt-8 flex items-center justify-between">
          <p className="text-sm text-brand-cream/60">{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
