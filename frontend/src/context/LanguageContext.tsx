"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ur";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("handmade_lang") as Language;
    if (savedLang === "en" || savedLang === "ur") {
      setLanguage(savedLang);
    }
  }, []);

  const direction: Direction = language === "ur" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ur" : "en";
    setLanguage(newLang);
    localStorage.setItem("handmade_lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
