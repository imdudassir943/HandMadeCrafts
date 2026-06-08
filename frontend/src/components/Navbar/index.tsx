"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, Globe, User as UserIcon, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import { API_BASE_URL } from "@/config";

export default function Navbar() {
  const { language, toggleLanguage, direction } = useLanguage();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard/settings/`)
      .then((res) => res.json())
      .then((data) => {
        setBrandName(language === "ur" ? data.siteNameUr : data.siteName);
        if (data.logo) {
          setLogoUrl(data.logo);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch settings in Navbar", err);
        setBrandName(language === "ur" ? "اورا کرافٹس" : "Aura Crafts");
      });
  }, [language]);


  const t = {
    en: {
      brand: "Aura Crafts",
      home: "Home",
      shop: "Shop",
      stories: "Stories",
      contact: "Contact",
      search: "Search crafts...",
      cartLabel: "Shopping Cart",
      menuLabel: "Toggle Menu",
      accountLabel: "Account Settings",
    },
    ur: {
      brand: "اورا کرافٹس",
      home: "ہوم",
      shop: "شاپ",
      stories: "کہانیاں",
      contact: "رابطہ",
      search: "تلاش کریں...",
      cartLabel: "شاپنگ بیگ",
      menuLabel: "مینیو تبدیل کریں",
      accountLabel: "سیشن اختیارات",
    },
  }[language];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    if (user) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById("auth-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        element.classList.add("ring-2", "ring-brand-gold", "ring-offset-4", "transition-all", "duration-500");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-brand-gold", "ring-offset-4");
        }, 2000);
      }
    }
  };

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/shop", label: t.shop },
    { href: "/stories", label: t.stories },
    { href: "/contact", label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-sienna/10 bg-white/80 backdrop-blur-md dark:bg-brand-espresso/80 shadow-warm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-button p-2 text-brand-espresso hover:bg-brand-cream/30 hover:text-brand-sienna dark:text-brand-cream lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t.menuLabel}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-8 w-auto object-contain" />
            ) : (
              <span className="font-serif text-2xl font-bold tracking-wide text-brand-crimson dark:text-brand-gold transition-colors duration-200">
                {brandName || t.brand}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-espresso hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-x-4 sm:gap-x-6">
          {/* Search bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block max-w-xs w-full">
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/10 py-1.5 pl-3 pr-10 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/50 dark:text-brand-cream"
              style={{
                paddingLeft: direction === "rtl" ? "2.5rem" : "0.75rem",
                paddingRight: direction === "rtl" ? "0.75rem" : "2.5rem",
              }}
            />
            <button
              type="submit"
              className="absolute top-1/2 -translate-y-1/2 text-brand-sienna dark:text-brand-gold hover:text-brand-crimson"
              style={{
                right: direction === "rtl" ? "auto" : "0.75rem",
                left: direction === "rtl" ? "0.75rem" : "auto",
              }}
              aria-label="Submit Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-medium text-brand-espresso hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold p-2 rounded-button transition-colors duration-200"
            aria-label="Change language / زبان تبدیل کریں"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">{language === "en" ? "اردو" : "English"}</span>
          </button>

          {/* Account / User profile */}
          <div 
            className="relative"
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            {user ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-espresso font-bold hover:bg-brand-gold/90 transition-colors shadow-sm"
                  aria-label="User profile options"
                  aria-expanded={isDropdownOpen}
                >
                  {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute mt-2 w-48 rounded-card border border-brand-sienna/10 bg-white p-3 shadow-lg dark:border-brand-gold/15 dark:bg-brand-espresso z-50 text-start"
                      style={{ right: direction === "rtl" ? "auto" : 0, left: direction === "rtl" ? 0 : "auto" }}
                    >
                      <div className="px-2 py-1.5 border-b border-brand-sienna/10 dark:border-brand-gold/10 pb-2">
                        <p className="text-xs font-semibold uppercase text-brand-gold">
                          {language === "en" ? "Aura Member" : "اورا رکن"}
                        </p>
                        <p className="text-sm font-bold text-brand-espresso dark:text-brand-cream truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-brand-espresso/60 dark:text-brand-cream/60 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-semibold text-brand-crimson hover:bg-brand-crimson/10 dark:hover:bg-brand-crimson/20 transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>{language === "en" ? "Sign Out" : "لاگ آؤٹ"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/#auth-section"
                onClick={handleAccountClick}
                className="flex items-center p-2 text-brand-espresso hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold transition-colors duration-200"
                aria-label={t.accountLabel}
              >
                <UserIcon className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Cart trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center p-2 text-brand-espresso hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold transition-colors duration-200"
            aria-label={t.cartLabel}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson text-xs font-bold text-brand-cream"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu and search */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-brand-sienna/10 bg-white dark:bg-brand-espresso lg:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {/* Search (Mobile) */}
              <form onSubmit={handleSearchSubmit} className="relative w-full pb-2">
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/10 py-2 pl-3 pr-10 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/50 dark:text-brand-cream"
                  style={{
                    paddingLeft: direction === "rtl" ? "2.5rem" : "0.75rem",
                    paddingRight: direction === "rtl" ? "0.75rem" : "2.5rem",
                  }}
                />
                <button
                  type="submit"
                  className="absolute top-1/2 -translate-y-[calc(50%+4px)] text-brand-sienna dark:text-brand-gold"
                  style={{
                    right: direction === "rtl" ? "auto" : "0.75rem",
                    left: direction === "rtl" ? "0.75rem" : "auto",
                  }}
                  aria-label="Submit Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-brand-espresso hover:bg-brand-cream/20 hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-brand-sienna/10 dark:border-brand-gold/10 pt-2 mt-2">
                {user ? (
                  <div className="px-3 py-2 text-start">
                    <p className="text-xs font-semibold uppercase text-brand-gold">
                      {language === "en" ? "Aura Member" : "اورا رکن"}
                    </p>
                    <p className="text-sm font-bold text-brand-espresso dark:text-brand-cream">
                      {user.name}
                    </p>
                    <p className="text-xs text-brand-espresso/60 dark:text-brand-cream/60">
                      {user.email}
                    </p>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-brand-crimson/10 px-3 py-2 text-sm font-semibold text-brand-crimson hover:bg-brand-crimson/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{language === "en" ? "Sign Out" : "لاگ آؤٹ"}</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/#auth-section"
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleAccountClick(e);
                    }}
                    className="block rounded-md px-3 py-2 text-base font-medium text-brand-espresso hover:bg-brand-cream/20 hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold"
                  >
                    {language === "en" ? "Sign In / Join Circle" : "سائن ان / سرکل میں شامل ہوں"}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
