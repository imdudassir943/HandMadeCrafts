"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ArrowLeft, CreditCard, Truck, Receipt } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config";

export default function Checkout() {
  const { language, direction } = useLanguage();
  const { cart, cartTotal, clearCart } = useCart();

  // Checkout Step: 'shipping' | 'payment' | 'success'
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");

  // Shipping Form States
  const [shippingName, setShippingName] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");

  // Payment Form States
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    en: {
      heading: "Checkout",
      cartSummary: "Order Summary",
      shippingTitle: "Shipping Details",
      paymentTitle: "Payment Method",
      shippingCost: "Shipping",
      free: "Free",
      total: "Total",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      addressLabel: "Street Address",
      cityLabel: "City",
      countryLabel: "Country",
      cardLabel: "Card Number",
      expiryLabel: "Expiry Date (MM/YY)",
      cvvLabel: "CVV",
      nextBtn: "Continue to Payment",
      submitBtn: "Place Order",
      backBtn: "Back",
      successTitle: "Order Confirmed!",
      successSub: "Thank you for your order. We have notified our artisan workshops to begin packing your treasures.",
      orderNumber: "Order Number",
      trackSub: "You will receive shipping tracking updates via email.",
      homeBtn: "Return Home",
      emptyCart: "Your cart is empty",
      emptySub: "Please add products to your cart before checking out.",
    },
    ur: {
      heading: "چیک آؤٹ",
      cartSummary: "آرڈر کی تفصیلات",
      shippingTitle: "شپنگ کی تفصیلات",
      paymentTitle: "ادائیگی کا طریقہ",
      shippingCost: "شپنگ",
      free: "مفت",
      total: "کل رقم",
      nameLabel: "پورا نام",
      emailLabel: "ای میل ایڈریس",
      addressLabel: "گھر کا پتہ",
      cityLabel: "شہر",
      countryLabel: "ملک",
      cardLabel: "کارڈ نمبر",
      expiryLabel: "میعاد ختم ہونے کی تاریخ",
      cvvLabel: "سی وی وی",
      nextBtn: "ادائیگی پر جائیں",
      submitBtn: "آرڈر دیں",
      backBtn: "واپس",
      successTitle: "آرڈر کی تصدیق ہو گئی!",
      successSub: "آپ کے آرڈر کا شکریہ۔ ہم نے اپنے دستکاروں کو آپ کے آرڈر کی پیکنگ شروع کرنے کی اطلاع دے دی ہے۔",
      orderNumber: "آرڈر نمبر",
      trackSub: "آپ کو ای میل کے ذریعے شپنگ ٹریکنگ کی معلومات موصول ہوں گی۔",
      homeBtn: "ہوم پیج پر جائیں",
      emptyCart: "آپ کی کارٹ خالی ہے",
      emptySub: "چیک آؤٹ کرنے سے پہلے کارٹ میں مصنوعات شامل کریں۔",
    },
  }[language];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingName && shippingEmail && shippingAddress && shippingCity && shippingCountry) {
      setStep("payment");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber && cardExpiry && cardCvv) {
      setIsSubmitting(true);
      try {
        // Prepare items list
        const items = cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }));

        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };
        const token = localStorage.getItem("handmade_access_token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // 1. Create Order
        const orderRes = await fetch(`${API_BASE_URL}/orders/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: shippingName,
            email: shippingEmail,
            address: shippingAddress,
            city: shippingCity,
            country: shippingCountry,
            items
          })
        });

        if (!orderRes.ok) {
          throw new Error("Failed to create order");
        }

        const orderData = await orderRes.json();

        // 2. Process Payment
        const paymentRes = await fetch(`${API_BASE_URL}/payments/process/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: orderData.order_number,
            payment_method: "Card"
          })
        });

        if (!paymentRes.ok) {
          throw new Error("Payment processing failed");
        }

        setOrderId(orderData.order_number);
        setStep("success");
        clearCart();
      } catch (err) {
        console.error(err);
        alert("Checkout failed. Please check backend server status.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-espresso mb-4">{t.emptyCart}</h1>
        <p className="text-brand-sienna mb-8">{t.emptySub}</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-button bg-brand-crimson text-brand-cream px-6 py-2.5 font-semibold hover:bg-brand-crimson/95 shadow-md"
        >
          {language === "en" ? "Browse Products" : "تصفح المنتجات"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {step !== "success" && (
        <h1 className="text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream mb-8 border-b border-brand-sienna/10 pb-4">
          {t.heading}
        </h1>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Checkout Forms */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === "shipping" && (
              <motion.div
                key="shipping-step"
                initial={{ opacity: 0, x: direction === "rtl" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
                className="bg-white dark:bg-brand-espresso p-6 rounded-card border border-brand-sienna/10 shadow-warm"
              >
                <h2 className="font-serif text-xl font-bold text-brand-espresso dark:text-brand-cream mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-brand-gold" />
                  <span>{t.shippingTitle}</span>
                </h2>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                        {t.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingEmail}
                        onChange={(e) => setShippingEmail(e.target.value)}
                        className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                      {t.addressLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                        {t.cityLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                        {t.countryLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingCountry}
                        onChange={(e) => setShippingCountry(e.target.value)}
                        className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-button bg-brand-crimson text-brand-cream px-6 py-2.5 font-semibold hover:bg-brand-crimson/95 shadow-md flex items-center gap-2"
                    >
                      <span>{t.nextBtn}</span>
                      <ArrowRight className={`h-4 w-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                key="payment-step"
                initial={{ opacity: 0, x: direction === "rtl" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
                className="bg-white dark:bg-brand-espresso p-6 rounded-card border border-brand-sienna/10 shadow-warm"
              >
                <h2 className="font-serif text-xl font-bold text-brand-espresso dark:text-brand-cream mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-gold" />
                  <span>{t.paymentTitle}</span>
                </h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                      {t.cardLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                        {t.expiryLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                        {t.cvvLabel}
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="rounded-button border border-brand-sienna/30 dark:border-brand-gold/30 text-brand-espresso dark:text-brand-cream px-5 py-2.5 font-semibold hover:bg-brand-cream/10 flex items-center gap-2"
                    >
                      <ArrowLeft className={`h-4 w-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
                      <span>{t.backBtn}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-button bg-brand-crimson text-brand-cream px-6 py-2.5 font-semibold hover:bg-brand-crimson/95 shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? (language === "ur" ? "پروسیس ہو رہا ہے..." : "Processing...") : t.submitBtn}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-brand-espresso p-8 rounded-card border border-brand-sienna/20 shadow-warm text-center max-w-xl mx-auto space-y-6"
              >
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-brand-gold animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-3xl font-bold text-brand-espresso dark:text-brand-cream">
                    {t.successTitle}
                  </h2>
                  <p className="text-sm text-brand-espresso/70 dark:text-brand-cream/70 leading-relaxed">
                    {t.successSub}
                  </p>
                </div>

                <div className="bg-brand-cream/15 p-4 rounded-card border border-brand-sienna/10 inline-block">
                  <span className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider block">
                    {t.orderNumber}
                  </span>
                  <span className="text-xl font-bold font-serif text-brand-crimson dark:text-brand-gold mt-1 block">
                    {orderId}
                  </span>
                </div>

                <p className="text-xs text-brand-espresso/60 dark:text-brand-cream/60 font-medium">
                  {t.trackSub}
                </p>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-flex rounded-button bg-brand-espresso dark:bg-brand-gold text-brand-cream dark:text-brand-espresso px-6 py-2.5 font-semibold hover:bg-brand-espresso/90 dark:hover:bg-brand-gold/90 shadow-md"
                  >
                    {t.homeBtn}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Sticky Checkout Order Summary Panel */}
        {step !== "success" && (
          <div className="lg:col-span-4 bg-white dark:bg-brand-espresso border border-brand-sienna/10 rounded-card p-6 shadow-warm lg:sticky lg:top-24">
            <h2 className="font-serif text-lg font-bold text-brand-espresso dark:text-brand-cream pb-3 border-b border-brand-sienna/10 dark:border-brand-gold/15 flex items-center gap-2 mb-4">
              <Receipt className="h-4.5 w-4.5 text-brand-gold" />
              <span>{t.cartSummary}</span>
            </h2>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
              {cart.map((item) => {
                const itemName = language === "ur" ? item.product.nameUr : item.product.name;
                return (
                  <div key={item.product.id} className="flex justify-between text-sm items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-espresso/60 dark:text-brand-cream/60 font-bold border border-brand-sienna/10 dark:border-brand-gold/20 rounded px-1.5 py-0.5 bg-brand-cream/5">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-brand-espresso/80 dark:text-brand-cream/80 line-clamp-1">{itemName}</span>
                    </div>
                    <span className="font-bold text-brand-crimson dark:text-brand-gold">${item.product.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="border-t border-brand-sienna/10 dark:border-brand-gold/15 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-espresso/70 dark:text-brand-cream/70 font-medium">Subtotal:</span>
                <span className="font-bold text-brand-espresso dark:text-brand-cream">${cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-espresso/70 dark:text-brand-cream/70 font-medium">{t.shippingCost}:</span>
                <span className="font-bold text-brand-gold uppercase">{t.free}</span>
              </div>
              <div className="border-t border-brand-sienna/10 dark:border-brand-gold/15 pt-3 flex justify-between items-center text-base font-bold text-brand-espresso dark:text-brand-cream">
                <span>{t.total}:</span>
                <span className="text-xl text-brand-crimson dark:text-brand-gold">${cartTotal}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
