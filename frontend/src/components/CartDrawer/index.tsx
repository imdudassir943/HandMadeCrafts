"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { language, direction } = useLanguage();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Trap focus within the drawer when open
  useEffect(() => {
    if (isCartOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
          if (e.key === "Tab") {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        };

        firstElement.focus();
        window.addEventListener("keydown", handleTab);
        return () => window.removeEventListener("keydown", handleTab);
      }
    }
  }, [isCartOpen]);

  const t = {
    en: {
      title: "Your Bag",
      empty: "Your bag is empty",
      emptySub: "Browse our shop to add beautiful treasures to your home.",
      startShopping: "Start Shopping",
      subtotal: "Subtotal",
      checkout: "Proceed to Checkout",
      remove: "Remove item",
      close: "Close cart",
    },
    ur: {
      title: "شاپنگ بیگ",
      empty: "آپ کا بیگ خالی ہے",
      emptySub: "خوبصورت دستکاریاں اپنے گھر لانے کے لیے متجر دیکھیں۔",
      startShopping: "خریداری شروع کریں",
      subtotal: "کل رقم",
      checkout: "ادائیگی کے لیے آگے بڑھیں",
      remove: "آئٹم نکالیں",
      close: "بیگ بند کریں",
    },
  }[language];

  // Dynamic animation offsets based on layout direction
  const slideVariants = {
    closed: {
      x: direction === "rtl" ? "-100%" : "100%",
    },
    open: {
      x: "0%",
    },
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-brand-espresso/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            variants={slideVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed top-0 bottom-0 z-50 w-full max-w-md bg-white p-6 shadow-2xl dark:bg-brand-espresso flex flex-col border-brand-sienna/10 ${
              direction === "rtl" ? "left-0 border-r" : "right-0 border-l"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-sienna/10">
              <h2 id="cart-title" className="font-serif text-2xl font-bold text-brand-espresso dark:text-brand-cream">
                {t.title}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-button p-2 text-brand-espresso hover:bg-brand-cream/30 hover:text-brand-sienna dark:text-brand-cream"
                aria-label={t.close}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <ShoppingBag className="h-16 w-16 text-brand-gold/60 mb-4 stroke-[1.5]" />
                  <p className="text-lg font-bold text-brand-espresso dark:text-brand-cream mb-2">
                    {t.empty}
                  </p>
                  <p className="text-sm text-brand-espresso/60 dark:text-brand-cream/60 mb-6">
                    {t.emptySub}
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      window.location.href = "/shop";
                    }}
                    className="rounded-button bg-brand-crimson text-brand-cream px-6 py-2.5 font-semibold hover:bg-brand-crimson/95 shadow-md"
                  >
                    {t.startShopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const itemName = language === "ur" ? item.product.nameUr : item.product.name;
                    return (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-3 rounded-card bg-brand-cream/5 border border-brand-sienna/10"
                      >
                        {/* Image */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-card bg-brand-cream/10 border border-brand-sienna/10">
                          <Image
                            src={item.product.image}
                            alt={itemName}
                            fill
                            className="object-cover object-center"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-serif text-sm font-bold text-brand-espresso dark:text-brand-cream leading-tight line-clamp-1">
                              {itemName}
                            </h3>
                            <p className="text-xs text-brand-espresso/60 mt-0.5">
                              {language === "ur" ? item.product.materialUr : item.product.material}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity controller */}
                            <div className="flex items-center border border-brand-sienna/20 rounded-button">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 hover:text-brand-crimson"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-brand-espresso dark:text-brand-cream min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 hover:text-brand-crimson"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="text-sm font-bold text-brand-crimson">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="self-start text-brand-espresso/40 hover:text-brand-crimson p-1"
                          aria-label={t.remove}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer summary */}
            {cart.length > 0 && (
              <div className="border-t border-brand-sienna/10 pt-4 space-y-4">
                <div className="flex justify-between items-center text-base font-bold text-brand-espresso dark:text-brand-cream">
                  <span>{t.subtotal}</span>
                  <span className="text-xl text-brand-crimson">${cartTotal}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex w-full items-center justify-center rounded-button bg-brand-crimson py-3 text-base font-semibold text-brand-cream hover:bg-brand-crimson/95 shadow-md transition-colors"
                >
                  {t.checkout}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
