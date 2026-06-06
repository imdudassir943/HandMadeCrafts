"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const t = {
    en: {
      title: "Send a Message",
      sub: "Have questions about our custom works or shipping? Reach out directly.",
      nameLabel: "Your Name",
      emailLabel: "Email Address",
      subjectLabel: "Subject / Category",
      subjectGeneral: "General Inquiry",
      subjectCustom: "Custom Order Request",
      subjectShipping: "Shipping & Orders",
      subjectCollab: "Artisan Collaborations",
      messageLabel: "Message",
      messagePlaceholder: "Write your message here...",
      sendBtn: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successSub: "Thank you for reaching out to Aura Crafts. Our customer support and artisan liaisons will respond to you within 24 hours.",
      backBtn: "Send Another Message",
    },
    ur: {
      title: "پیغام بھیجیں",
      sub: "کیا آپ ہمارے ڈیزائنز یا شپنگ کے بارے میں پوچھنا چاہتے ہیں؟ براہ راست رابطہ کریں۔",
      nameLabel: "آپ کا نام",
      emailLabel: "ای میل ایڈریس",
      subjectLabel: "موضوع / زمرہ",
      subjectGeneral: "عام سوال",
      subjectCustom: "خصوصی آرڈر کی درخواست",
      subjectShipping: "شپنگ اور آرڈرز",
      subjectCollab: "ہنرمندوں کا اشتراک",
      messageLabel: "پیغام",
      messagePlaceholder: "اپنا پیغام یہاں لکھیں...",
      sendBtn: "پیغام بھیجیں",
      sending: "جا رہا ہے...",
      successTitle: "پیغام بھیج دیا گیا!",
      successSub: "اورا کرافٹس سے رابطہ کرنے کا شکریہ۔ کسٹمر سپورٹ کی ٹیم 24 گھنٹوں کے اندر آپ سے رابطہ کرے گی۔",
      backBtn: "ایک اور پیغام بھیجیں",
    },
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setName("");
      setEmail("");
      setSubject("general");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-brand-espresso border border-brand-sienna/10 rounded-card p-6 sm:p-8 shadow-warm h-full flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="contact-form-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-espresso mb-2 flex items-center gap-2">
                <MessageSquare className="h-5.5 w-5.5 text-brand-gold" />
                <span>{t.title}</span>
              </h2>
              <p className="text-sm text-brand-espresso/60 leading-relaxed">
                {t.sub}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-brand-espresso/70 mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 disabled:opacity-50"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-brand-espresso/70 mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Subject Category Select */}
              <div>
                <label className="block text-xs font-semibold text-brand-espresso/70 mb-1">
                  {t.subjectLabel}
                </label>
                <select
                  value={subject}
                  disabled={isSubmitting}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso"
                >
                  <option value="general">{t.subjectGeneral}</option>
                  <option value="custom">{t.subjectCustom}</option>
                  <option value="shipping">{t.subjectShipping}</option>
                  <option value="collab">{t.subjectCollab}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-brand-espresso/70 mb-1">
                  {t.messageLabel}
                </label>
                <textarea
                  rows={5}
                  required
                  disabled={isSubmitting}
                  placeholder={t.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-button bg-brand-crimson text-brand-cream py-2.5 text-sm font-semibold hover:bg-brand-crimson/95 disabled:opacity-50 flex items-center justify-center gap-2 shadow"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>{t.sending}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{t.sendBtn}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="contact-form-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 space-y-6"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-brand-gold animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-brand-espresso">
                {t.successTitle}
              </h3>
              <p className="text-sm text-brand-espresso/75 max-w-sm mx-auto leading-relaxed">
                {t.successSub}
              </p>
            </div>

            <div>
              <button
                onClick={() => setShowSuccess(false)}
                className="rounded-button border border-brand-sienna/30 text-brand-espresso px-5 py-2.5 text-xs font-semibold hover:bg-brand-cream/10"
              >
                {t.backBtn}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
