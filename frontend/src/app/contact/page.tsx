"use client";

import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  const { language } = useLanguage();

  const t = {
    en: {
      heading: "Contact Us",
      subheading: "Have questions about our shipping, custom requests, or wholesale collaborations? Get in touch.",
      officeTitle: "Aura Atelier",
      address: "128 Saffron Lane, Chelsea, London, SW3 5UR, UK",
      phone: "+44 20 7946 0958",
      email: "support@auracrafts.co",
      hoursTitle: "Atelier Hours",
      hoursWeek: "Monday - Friday: 9:00 AM - 6:00 PM",
      hoursSat: "Saturday: 10:00 AM - 4:00 PM",
      hoursSun: "Sunday: Closed",
      followTitle: "Follow Our Journey",
    },
    ur: {
      heading: "رابطہ کریں",
      subheading: "کیا آپ کو ہمارے ڈیزائنز، شپنگ یا ہول سیل کاموں کے بارے میں کوئی معلومات چاہییں؟ ہم سے رابطہ کریں۔",
      officeTitle: "اورا گیلری",
      address: "128 زعفران لین، چیلسی، لندن، برطانیہ",
      phone: "+44 20 7946 0958",
      email: "support@auracrafts.co",
      hoursTitle: "معرض کے اوقات",
      hoursWeek: "پیر - جمعہ: 9:00 صبح سے 6:00 شام",
      hoursSat: "ہفتہ: 10:00 صبح سے 4:00 شام",
      hoursSun: "اتوار: بند ہے",
      followTitle: "ہمیں فالو کریں",
    },
  }[language];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="border-b border-brand-sienna/10 pb-6 text-center sm:text-start">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso mb-2">
          {t.heading}
        </h1>
        <p className="text-sm sm:text-base text-brand-sienna max-w-2xl">
          {t.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch pb-12">
        {/* Info Column */}
        <aside className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-brand-espresso">
              {t.officeTitle}
            </h2>

            {/* Coordinates */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-gold mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-brand-espresso/50 uppercase tracking-wider block">
                    {language === "en" ? "Address" : "پتہ"}
                  </span>
                  <span className="text-sm text-brand-espresso font-medium block mt-0.5">
                    {t.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-gold mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-brand-espresso/50 uppercase tracking-wider block">
                    {language === "en" ? "Phone" : "فون"}
                  </span>
                  <a href={`tel:${t.phone}`} className="text-sm text-brand-espresso font-medium hover:text-brand-sienna block mt-0.5">
                    {t.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-gold mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-brand-espresso/50 uppercase tracking-wider block">
                    {language === "en" ? "Email" : "ای میل"}
                  </span>
                  <a href={`mailto:${t.email}`} className="text-sm text-brand-espresso font-medium hover:text-brand-sienna block mt-0.5">
                    {t.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-brand-cream/15 p-6 rounded-card border border-brand-sienna/5 space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-espresso flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-brand-gold" />
              <span>{t.hoursTitle}</span>
            </h3>
            <div className="space-y-2 text-sm text-brand-espresso/80">
              <p className="font-medium">{t.hoursWeek}</p>
              <p className="font-medium">{t.hoursSat}</p>
              <p className="font-medium text-brand-espresso/50 italic">{t.hoursSun}</p>
            </div>
          </div>

          {/* Social Follow */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-sienna">
              {t.followTitle}
            </h3>
            <div className="flex space-x-4 rtl:space-x-reverse text-brand-espresso/60">
              <a href="#" className="hover:text-brand-gold transition-colors">Instagram</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Facebook</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Pinterest</a>
            </div>
          </div>
        </aside>

        {/* Form Column */}
        <main className="lg:col-span-7 h-full">
          <ContactForm />
        </main>
      </div>
    </div>
  );
}
