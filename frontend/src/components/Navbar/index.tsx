"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, Globe, User as UserIcon, LogOut } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-40 w-full border-b transition-all duration-300 backdrop-blur-md ${
      isScrolled
        ? "bg-white/95 dark:bg-brand-espresso/95 shadow-md border-brand-sienna/15"
        : "bg-white/80 dark:bg-brand-espresso/80 shadow-warm border-brand-sienna/10"
    }`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? "h-14" : "h-16"
      }`}>
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-button p-2 text-brand-espresso hover:bg-brand-cream/30 hover:text-brand-sienna dark:text-brand-cream lg:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t.menuLabel}
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24">
            <motion.path
              variants={{
                closed: { d: "M 4 6 L 20 6" },
                open: { d: "M 6 18 L 18 6" }
              }}
              animate={isMobileMenuOpen ? "open" : "closed"}
              transition={{ duration: 0.3 }}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <motion.path
              variants={{
                closed: { opacity: 1, d: "M 4 12 L 20 12" },
                open: { opacity: 0 }
              }}
              animate={isMobileMenuOpen ? "open" : "closed"}
              transition={{ duration: 0.2 }}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <motion.path
              variants={{
                closed: { d: "M 4 18 L 20 18" },
                open: { d: "M 6 6 L 18 18" }
              }}
              animate={isMobileMenuOpen ? "open" : "closed"}
              transition={{ duration: 0.3 }}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            {logoUrl && (
              <motion.img
                src={logoUrl}
                alt={brandName || t.brand}
                whileHover={{ scale: 1.08, rotate: 8 }}
                className="hidden min-[540px]:block h-9 w-9 rounded-full object-cover border border-brand-sienna/10 transition-transform duration-300"
              />
            )}
            <span className="font-serif text-2xl font-bold tracking-wide text-brand-crimson dark:text-brand-gold group-hover:text-brand-gold dark:group-hover:text-brand-cream transition-colors duration-300">
              {brandName || t.brand}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav 
          onMouseLeave={() => setHoveredLink(null)}
          className="hidden lg:flex lg:gap-x-2 relative items-center"
        >
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-full ${
                  isActive
                    ? "text-brand-crimson dark:text-brand-gold"
                    : "text-brand-espresso hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Sliding hover pill */}
                {hoveredLink === link.href && (
                  <motion.span
                    layoutId="hover-pill"
                    className="absolute inset-0 rounded-full bg-brand-cream/65 dark:bg-brand-gold/15 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                )}
                {/* Active link underline/glow */}
                {isActive && (
                  <motion.span
                    layoutId="desktop-active-underline"
                    className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-brand-crimson dark:bg-brand-gold"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-x-4 sm:gap-x-6">
          {/* Search bar (Desktop) */}
          <motion.form
            onSubmit={handleSearchSubmit}
            animate={{
              width: isSearchFocused ? 240 : 160,
              borderColor: isSearchFocused ? "#bb9457" : "rgba(153, 88, 42, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative hidden sm:block h-9 bg-brand-cream/10 dark:bg-brand-espresso/50 border rounded-input overflow-hidden"
          >
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-full bg-transparent px-3 py-1.5 pl-3 pr-10 text-sm focus:outline-none text-brand-espresso dark:text-brand-cream"
              style={{
                paddingLeft: direction === "rtl" ? "2.5rem" : "0.75rem",
                paddingRight: direction === "rtl" ? "0.75rem" : "2.5rem",
              }}
            />
            <motion.button
              type="submit"
              animate={{
                scale: isSearchFocused ? 1.15 : 1.0,
              }}
              className="absolute top-1/2 -translate-y-1/2 text-brand-sienna dark:text-brand-gold hover:text-brand-crimson"
              style={{
                right: direction === "rtl" ? "auto" : "0.75rem",
                left: direction === "rtl" ? "0.75rem" : "auto",
              }}
              aria-label="Submit Search"
            >
              <Search className="h-4 w-4" />
            </motion.button>
          </motion.form>

          {/* Language Toggle */}
          <motion.button
            onClick={toggleLanguage}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-1 text-sm font-medium text-brand-espresso hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold p-2 rounded-button transition-colors duration-200"
            aria-label="Change language / زبان تبدیل کریں"
          >
            <motion.span
              variants={{
                hover: { rotate: 360, transition: { duration: 0.8, ease: "easeInOut" } }
              }}
            >
              <Globe className="h-4 w-4" />
            </motion.span>
            <span className="hidden md:inline">{language === "en" ? "اردو" : "English"}</span>
          </motion.button>

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
                <motion.div
                  whileHover={{ scale: 1.15, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <UserIcon className="h-6 w-6" />
                </motion.div>
              </Link>
            )}
          </div>

          {/* Cart trigger */}
          <motion.button
            onClick={() => setIsCartOpen(true)}
            whileHover="hover"
            whileTap="tap"
            className="relative flex items-center p-2 text-brand-espresso hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold transition-colors duration-200"
            aria-label={t.cartLabel}
          >
            <motion.div
              variants={{
                hover: {
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: 1.1,
                  transition: { duration: 0.5 }
                }
              }}
            >
              <ShoppingBag className="h-6 w-6" />
            </motion.div>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson text-[10px] font-bold text-brand-cream shadow-sm"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu and search */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.2 },
                  staggerChildren: 0.08,
                  delayChildren: 0.05
                }
              },
              closed: {
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.25, ease: "easeIn" },
                  opacity: { duration: 0.15 },
                  staggerChildren: 0.05,
                  staggerDirection: -1
                }
              }
            }}
            className="border-t border-brand-sienna/10 bg-white dark:bg-brand-espresso lg:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {/* Search (Mobile) */}
              <motion.form 
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: -10, opacity: 0 }
                }}
                onSubmit={handleSearchSubmit} 
                className="relative w-full pb-2"
              >
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
              </motion.form>

              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      open: { x: 0, opacity: 1 },
                      closed: { x: direction === "rtl" ? 20 : -20, opacity: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block rounded-md px-3 py-2 text-base font-medium transition-colors border-l-2 ${
                        isActive
                          ? "bg-brand-cream/20 text-brand-crimson border-brand-crimson dark:text-brand-gold dark:border-brand-gold"
                          : "border-transparent text-brand-espresso hover:bg-brand-cream/10 hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold"
                      }`}
                      style={{
                        borderLeftWidth: direction === "rtl" ? 0 : "2px",
                        borderRightWidth: direction === "rtl" ? "2px" : 0,
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div 
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: 10, opacity: 0 }
                }}
                className="border-t border-brand-sienna/10 dark:border-brand-gold/10 pt-2 mt-2"
              >
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
