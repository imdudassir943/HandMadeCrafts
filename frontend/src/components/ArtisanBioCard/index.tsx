"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MailOpen, MapPin, Send, X } from "lucide-react";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ArtisanBioCardProps {
  artisanName: string;
  artisanNameUr: string;
  artisanImage: string;
  location: string;
  locationUr: string;
  quote: string;
  quoteUr: string;
  bio: string;
  bioUr: string;
  products: Product[];
}

export default function ArtisanBioCard({
  artisanName,
  artisanNameUr,
  artisanImage,
  location,
  locationUr,
  quote,
  quoteUr,
  bio,
  bioUr,
  products,
}: ArtisanBioCardProps) {
  const { language, direction } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imgSrc, setImgSrc] = useState(artisanImage);

  useEffect(() => {
    setImgSrc(artisanImage);
  }, [artisanImage]);

  const name = language === "ur" ? artisanNameUr : artisanName;
  const loc = language === "ur" ? locationUr : location;
  const q = language === "ur" ? quoteUr : quote;
  const biography = language === "ur" ? bioUr : bio;

  const t = {
    en: {
      location: "Location",
      writeBtn: "Write a Letter of Appreciation",
      modalTitle: `Send a Note to ${name}`,
      modalSub: "Your words of support connect you directly with the maker. We print and deliver every message of encouragement to our artisan partners.",
      messageLabel: "Your Message",
      sendBtn: "Send Note",
      sending: "Sending...",
      success: `Sent! Your message will be printed and included in ${name}'s next package.`,
      close: "Close dialog",
      productsTitle: "Featured Work",
      viewProduct: "View product",
    },
    ur: {
      location: "مقام",
      writeBtn: "دستکار کے لیے تعریفی پیغام لکھیں",
      modalTitle: `${name} کے نام خط`,
      modalSub: "آپ کا تعریفی پیغام دستکار کو براہ راست حوصلہ افزائی کرے گا۔ ہم آپ کا ہر پیغام پرنٹ کر کے دستکاروں تک پہنچاتے ہیں۔",
      messageLabel: "آپ کا پیغام",
      sendBtn: "پیغام بھیجیں",
      sending: "جا رہا ہے...",
      success: `پیغام بھیج دیا گیا! آپ کا پیغام پرنٹ کر کے ${name} کے اگلے پیکیج میں شامل کر دیا جائے گا۔`,
      close: "بند کریں",
      productsTitle: "نمایاں کام",
      viewProduct: "تفصیل دیکھیں",
    },
  }[language];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setMessageText("");
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
      }, 4000);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-brand-espresso border border-brand-sienna/10 dark:border-brand-cream/10 rounded-card p-6 md:p-8 shadow-warm flex flex-col md:grid md:grid-cols-12 md:gap-8 items-start">
      {/* 1. Portrait Section */}
      <div className="col-span-12 md:col-span-4 flex flex-col items-center text-center space-y-4 w-full border-b border-brand-sienna/5 dark:border-brand-cream/5 pb-6 md:border-b-0 md:pb-0">
        <div className="relative h-44 w-44 rounded-full overflow-hidden border-8 border-brand-cream/20 shadow-md bg-brand-cream/10">
          <Image
            src={imgSrc || "/images/artisan_portrait.png"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 176px, 176px"
            onError={() => setImgSrc("/images/artisan_portrait.png")}
          />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-espresso dark:text-brand-cream">
            {name}
          </h2>
          <p className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5 text-brand-gold" />
            <span>{loc}</span>
          </p>
        </div>

        {/* Message Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full text-xs font-bold rounded-button border border-brand-crimson text-brand-crimson dark:border-brand-gold dark:text-brand-gold hover:bg-brand-crimson dark:hover:bg-brand-gold hover:text-brand-cream dark:hover:text-brand-espresso py-2.5 transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MailOpen className="h-4 w-4" />
          <span>{t.writeBtn}</span>
        </button>
      </div>

      {/* 2. Biography & Bio Quote */}
      <div className="col-span-12 md:col-span-8 space-y-6 mt-6 md:mt-0 w-full">
        <blockquote className="border-l-4 border-brand-gold pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pr-4">
          <p className="font-serif text-lg sm:text-xl italic text-brand-crimson dark:text-brand-gold leading-relaxed">
            {q}
          </p>
        </blockquote>

        <p className="text-sm text-brand-espresso/80 dark:text-brand-cream/80 leading-relaxed">
          {biography}
        </p>

        {/* Co-located products */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-sienna dark:text-brand-gold border-b border-brand-sienna/10 dark:border-brand-cream/10 pb-1">
            {t.productsTitle}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => {
              const productName = language === "ur" ? product.nameUr : product.name;
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 rounded bg-brand-cream/5 border border-brand-sienna/5 dark:border-brand-cream/5 group hover:border-brand-gold/30 transition-all"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-brand-cream/10">
                    <Image src={product.image} alt={productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-semibold text-brand-espresso dark:text-brand-cream truncate">
                      {productName}
                    </h4>
                    <span className="text-xs font-bold text-brand-crimson dark:text-brand-gold">${product.price}</span>
                  </div>
                  <Link
                    href={`/shop/${product.id}`}
                    className="text-xxs font-bold text-brand-gold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pl-1 rtl:pl-0 rtl:pr-1"
                  >
                    &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Message modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSending && !isSuccess) setIsModalOpen(false);
              }}
              className="fixed inset-0 z-50 bg-brand-espresso/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed top-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white p-6 shadow-2xl dark:bg-brand-espresso rounded-modal border border-brand-sienna/10 ${
                direction === "rtl" ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"
              }`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-sienna/10 mb-4">
                <h3 id="modal-title" className="font-serif text-lg font-bold text-brand-espresso dark:text-brand-cream">
                  {t.modalTitle}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSending || isSuccess}
                  className="rounded-button p-2 text-brand-espresso dark:text-brand-cream hover:bg-brand-cream/30 dark:hover:bg-brand-cream/10 hover:text-brand-sienna dark:hover:text-brand-gold disabled:opacity-50"
                  aria-label={t.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="message-form"
                    onSubmit={handleSendMessage}
                    className="space-y-4"
                  >
                    <p className="text-xs text-brand-espresso/70 dark:text-brand-cream/70 leading-relaxed">
                      {t.modalSub}
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                        {t.messageLabel}
                      </label>
                      <textarea
                        rows={4}
                        required
                        disabled={isSending}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={
                          language === "en"
                            ? "I love your work! The details on the piece are beautiful..."
                            : "مجھے آپ کا کام بہت پسند آیا! اس شاہکار کی تفصیلات بہت خوبصورت ہیں..."
                        }
                        className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 dark:text-brand-cream disabled:opacity-50"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSending || !messageText.trim()}
                        className="rounded-button bg-brand-crimson text-brand-cream px-6 py-2.5 text-sm font-semibold hover:bg-brand-crimson/95 disabled:opacity-50 flex items-center gap-2 shadow"
                      >
                        {isSending ? (
                          <>
                            <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                            <span>{t.sending}</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>{t.sendBtn}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="message-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="p-4 rounded-full bg-brand-gold/20"
                      >
                        <Send className="h-8 w-8 text-brand-gold" />
                      </motion.div>
                    </div>
                    <p className="text-sm font-semibold text-brand-espresso dark:text-brand-cream max-w-sm mx-auto leading-relaxed">
                      {t.success}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
