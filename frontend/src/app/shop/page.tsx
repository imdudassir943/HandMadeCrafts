"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, RotateCcw, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { mockProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function ShopContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceLimit, setPriceLimit] = useState(200);
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync search query from URL on mount/change
  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) {
      setSearchTerm(urlQuery);
    }
    const urlCat = searchParams.get("category");
    if (urlCat) {
      setSelectedCategory(urlCat);
    }
  }, [searchParams]);

  const t = {
    en: {
      heading: "Artisan Marketplace",
      subheading: "Discover ethically made home decor carrying the heritage of global workshops.",
      filters: "Filters",
      searchLabel: "Search",
      searchPlaceholder: "Type keywords...",
      categoryLabel: "Category",
      all: "All Categories",
      priceLabel: "Max Price",
      sortLabel: "Sort By",
      sortDefault: "Featured",
      sortLowHigh: "Price: Low to High",
      sortHighLow: "Price: High to Low",
      reset: "Clear All",
      resultsCount: "Showing {count} items",
      noResults: "No items match your criteria. Try adjusting your filters.",
      ceramics: "Ceramics",
      textiles: "Textiles",
      woodwork: "Woodwork",
      lighting: "Lighting",
      toggleFilters: "Toggle Filters",
    },
    ur: {
      heading: "دستکاریوں کا بازار",
      subheading: "دنیا بھر کے دستکاروں کے ہاتھوں سے بنے خوبصورت اور روایتی شاہکار دریافت کریں۔",
      filters: "فلٹرز",
      searchLabel: "تلاش",
      searchPlaceholder: "تلاش کریں...",
      categoryLabel: "زمرہ",
      all: "تمام زمرے",
      priceLabel: "زیادہ سے زیادہ قیمت",
      sortLabel: "ترتیب دیں",
      sortDefault: "نمایاں",
      sortLowHigh: "قیمت: کم سے زیادہ",
      sortHighLow: "قیمت: زیادہ سے کم",
      reset: "صاف کریں",
      resultsCount: "{count} اشیاء دکھائی جا رہی ہیں",
      noResults: "آپ کی تلاش کے مطابق کوئی دستکاری نہیں ملی۔ فلٹر تبدیل کر کے دیکھیں۔",
      ceramics: "مٹی کے برتن",
      textiles: "منسوجات",
      woodwork: "لکڑی کا کام",
      lighting: "لائٹس اور فانوس",
      toggleFilters: "فلٹرز تبدیل کریں",
    },
  }[language];

  const categories = [
    { label: t.all, value: "All" },
    { label: t.ceramics, value: "Ceramics" },
    { label: t.textiles, value: "Textiles" },
    { label: t.woodwork, value: "Woodwork" },
    { label: t.lighting, value: "Lighting" },
  ];

  // Perform filtration
  const filteredProducts = mockProducts
    .filter((product) => {
      // 1. Search term match (English or Arabic fields)
      const query = searchTerm.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(query) || product.nameUr.includes(query);
      const descMatch = product.description.toLowerCase().includes(query) || product.descriptionUr.includes(query);
      const artisanMatch = product.artisan.toLowerCase().includes(query) || product.artisanUr.includes(query);
      
      const matchesSearch = searchTerm ? (nameMatch || descMatch || artisanMatch) : true;

      // 2. Category match
      const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory;

      // 3. Price limit match
      const matchesPrice = product.price <= priceLimit;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // Default featured sort order
    });

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceLimit(200);
    setSortBy("default");
    router.push("/shop");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="border-b border-brand-sienna/10 pb-6 mb-8 text-center sm:text-start">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso mb-2">
          {t.heading}
        </h1>
        <p className="text-sm sm:text-base text-brand-sienna max-w-2xl">
          {t.subheading}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 rounded-button bg-brand-espresso px-4 py-2 text-sm font-semibold text-brand-cream hover:bg-brand-espresso/90 shadow"
          >
            <Filter className="h-4 w-4" />
            <span>{t.toggleFilters}</span>
          </button>
          <span className="text-xs font-semibold text-brand-espresso/60">
            {t.resultsCount.replace("{count}", filteredProducts.length.toString())}
          </span>
        </div>

        {/* Sidebar Filters (Desktop & Mobile responsive) */}
        <aside
          className={`lg:col-span-1 space-y-6 bg-brand-cream/10 border border-brand-sienna/10 rounded-card p-6 shadow-warm lg:block ${
            isMobileFilterOpen ? "block mb-6" : "hidden"
          }`}
        >
          <div className="flex justify-between items-center pb-2 border-b border-brand-sienna/10">
            <h2 className="font-serif text-lg font-bold text-brand-espresso flex items-center gap-2">
              <Filter className="h-4 w-4 text-brand-gold" />
              <span>{t.filters}</span>
            </h2>
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-brand-crimson hover:text-brand-sienna flex items-center gap-1"
              aria-label="Clear all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t.reset}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso/80">
              {t.searchLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-input border border-brand-sienna/20 bg-white px-3 py-2 pl-9 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-sienna/50" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso/80">
              {t.categoryLabel}
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`w-full text-start px-2 py-1.5 rounded-button text-sm transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-brand-gold text-brand-espresso font-semibold"
                      : "hover:bg-brand-cream/30 text-brand-espresso/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-espresso/80">
                {t.priceLabel}
              </label>
              <span className="text-sm font-bold text-brand-crimson">${priceLimit}</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              value={priceLimit}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              className="w-full accent-brand-crimson bg-brand-sienna/20 h-1 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sort By Select */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso/80">
              {t.sortLabel}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-input border border-brand-sienna/20 bg-white px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso"
            >
              <option value="default">{t.sortDefault}</option>
              <option value="price-asc">{t.sortLowHigh}</option>
              <option value="price-desc">{t.sortHighLow}</option>
            </select>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="hidden lg:flex items-center justify-between border-b border-brand-sienna/5 pb-2">
            <span className="text-sm text-brand-espresso/60 font-medium">
              {t.resultsCount.replace("{count}", filteredProducts.length.toString())}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-brand-cream/5 border border-brand-sienna/10 rounded-card shadow-inner">
              <p className="text-lg font-bold text-brand-espresso mb-2">{t.noResults}</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 rounded-button bg-brand-crimson text-brand-cream px-6 py-2 font-semibold hover:bg-brand-crimson/95 shadow-md"
              >
                {t.reset}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-32 text-center text-brand-espresso font-serif">
        <div className="animate-pulse">Loading marketplace treasures...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
