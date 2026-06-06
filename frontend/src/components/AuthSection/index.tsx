"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Loader2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Gift
} from "lucide-react";

export default function AuthSection() {
  const { user, login, signup, logout, isLoaded } = useAuth();
  const { language, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sign In states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up states
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Clear errors when changing tabs
  useEffect(() => {
    setSignInError("");
    setSignUpError("");
  }, [activeTab]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setSignInError(language === "en" ? "Please fill in all fields" : "براہ کرم تمام خانے پُر کریں");
      return;
    }

    setSignInLoading(true);
    try {
      const result = await login(signInEmail, signInPassword);
      if (!result.success && result.error) {
        setSignInError(language === "en" ? result.error.en : result.error.ur);
      } else {
        // Clear fields
        setSignInEmail("");
        setSignInPassword("");
      }
    } catch (err) {
      setSignInError(language === "en" ? "An unexpected error occurred" : "کوئی غیر متوقع غلطی ہوئی ہے");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim() || !signUpConfirmPassword.trim()) {
      setSignUpError(language === "en" ? "Please fill in all fields" : "براہ کرم تمام خانے پُر کریں");
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError(language === "en" ? "Passwords do not match" : "پاس ورڈز مطابقت نہیں رکھتے");
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError(language === "en" ? "Password must be at least 6 characters" : "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے");
      return;
    }

    setSignUpLoading(true);
    try {
      const result = await signup(signUpName, signUpEmail, signUpPassword);
      if (!result.success && result.error) {
        setSignUpError(language === "en" ? result.error.en : result.error.ur);
      } else {
        setSignUpSuccess(true);
        // Clear fields
        setSignUpName("");
        setSignUpEmail("");
        setSignUpPassword("");
        setSignUpConfirmPassword("");
        // Auto transition after 3 seconds
        setTimeout(() => setSignUpSuccess(false), 4000);
      }
    } catch (err) {
      setSignUpError(language === "en" ? "An unexpected error occurred" : "کوئی غیر متوقع غلطی ہوئی ہے");
    } finally {
      setSignUpLoading(false);
    }
  };

  const t = {
    en: {
      sectionTitle: "The Aura Circle",
      sectionSub: "Step into our community of craft connoisseurs. Connect directly with artisans, access limited pre-sales, and enjoy heirloom-quality stories.",
      signInTab: "Sign In",
      signUpTab: "Join Aura Circle",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      nameLabel: "Full Name",
      signInBtn: "Authenticate Session",
      signUpBtn: "Register Membership",
      submitting: "Processing...",
      noAccount: "Don't have an account?",
      haveAccount: "Already a member?",
      forgotPass: "Recover credentials?",
      welcomeBack: "Welcome back, {name}!",
      memberSince: "Aura Membership Status: Active",
      memberDesc: "You are currently signed in as a certified supporter of sustainable global handiwork.",
      logoutBtn: "Terminate Session",
      benefitsTitle: "Your Circle Benefits:",
      benefit1: "Priority access to upcoming collections before general release.",
      benefit2: "15% welcome discount auto-applied to checkout.",
      benefit3: "Direct-to-artisan chat platform and custom request portal.",
      benefit4: "Detailed provenance and heritage reports for every purchase.",
      successReg: "Membership registration successful! Logging you in...",
      orContinue: "Or continue with authentication services",
    },
    ur: {
      sectionTitle: "اورا سرکل",
      sectionSub: "دستکاری کے قدردانوں کے ہمارے معاشرے کا حصہ بنیں۔ کاریگروں سے براہ راست رابطہ کریں، خصوصی پری سیلز حاصل کریں اور خاندانی کہانیاں دریافت کریں۔",
      signInTab: "سائن ان کریں",
      signUpTab: "سرکل میں شامل ہوں",
      emailLabel: "ای میل ایڈریس",
      passwordLabel: "پاس ورڈ",
      confirmPasswordLabel: "پاس ورڈ کی تصدیق",
      nameLabel: "مکمل نام",
      signInBtn: "سیشن تصدیق کریں",
      signUpBtn: "رکنیت رجسٹر کریں",
      submitting: "عمل ہو رہا ہے...",
      noAccount: "اکاؤنٹ نہیں ہے؟",
      haveAccount: "پہلے سے رکن ہیں؟",
      forgotPass: "پاس ورڈ بھول گئے؟",
      welcomeBack: "خوش آمدید، {name}!",
      memberSince: "اورا رکنیت کا درجہ: فعال",
      memberDesc: "آپ اس وقت پائیدار عالمی دستکاری کے ایک تصدیق شدہ حامی کے طور پر سائن ان ہیں۔",
      logoutBtn: "سیشن ختم کریں",
      benefitsTitle: "آپ کے خصوصی فوائد:",
      benefit1: "عام ریلیز سے پہلے آنے والی کلیکشنز تک ترجیحی رسائی۔",
      benefit2: "پہلی خریداری پر خودکار 15٪ ویلکم ڈسکاؤنٹ۔",
      benefit3: "دستکار کے ساتھ براہ راست گفتگو اور اپنی مرضی کی فرمائش۔",
      benefit4: "ہر خریداری کے ساتھ دستکاری کی اصل تاریخ اور رپورٹ۔",
      successReg: "رکنیت کی رجسٹریشن کامیاب! آپ کو لاگ ان کیا جا رہا ہے...",
      orContinue: "یا متبادل تصدیقی خدمات کے ساتھ آگے بڑھیں",
    }
  }[language];

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <section 
      id="auth-section"
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24"
    >
      <div className="overflow-hidden rounded-modal bg-brand-cream/10 border border-brand-sienna/10 dark:bg-brand-espresso/20 dark:border-brand-gold/15 shadow-warm transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Side: Atmosphere & Benefits (Desktop-Only primarily) */}
          <div className="lg:col-span-5 relative bg-brand-espresso p-8 sm:p-12 text-brand-cream flex flex-col justify-between overflow-hidden">
            {/* Soft decorative light layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-crimson/50 via-brand-espresso to-brand-sienna/20 z-0" />
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffe6a7_1.5px,transparent_1.5px)] [background-size:20px_20px] z-0" />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-wider border border-brand-gold/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{language === "en" ? "Craft Membership" : "دستکاری کی رکنیت"}</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {t.sectionTitle}
              </h2>
              
              <p className="text-sm sm:text-base text-brand-cream/80 leading-relaxed font-sans">
                {t.sectionSub}
              </p>

              <hr className="border-brand-cream/10 my-4" />

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-brand-gold font-semibold font-sans">
                  {t.benefitsTitle}
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-brand-cream/95">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                    <span>{t.benefit1}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Gift className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                    <span>{t.benefit2}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Compass className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                    <span>{t.benefit3}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                    <span>{t.benefit4}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative z-10 pt-10 text-xs text-brand-cream/50 flex justify-between items-center">
              <span>© {new Date().getFullYear()} Aura Crafts.</span>
              <span className="font-serif italic">{language === "en" ? "Authentic Provenance" : "اصل سند دستکاری"}</span>
            </div>
          </div>

          {/* Right Side: Interactive Forms or Success Card */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-brand-espresso/45">
            <AnimatePresence mode="wait">
              {user ? (
                // SUCCESS LOGGED IN DASHBOARD
                <motion.div
                  key="logged-in-state"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-center lg:text-start"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold dark:bg-brand-gold/20 mb-2">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream">
                    {t.welcomeBack.replace("{name}", user.name)}
                  </h3>
                  
                  <div className="p-4 rounded-card border border-brand-gold/20 bg-brand-gold/5 space-y-2 max-w-lg mx-auto lg:mx-0">
                    <p className="text-sm font-semibold text-brand-gold uppercase tracking-wider">
                      {t.memberSince}
                    </p>
                    <p className="text-xs sm:text-sm text-brand-sienna dark:text-brand-cream/80">
                      {t.memberDesc}
                    </p>
                    <p className="text-xs font-mono text-brand-espresso/60 dark:text-brand-cream/40">
                      {user.email}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
                    <button
                      onClick={logout}
                      id="logout-btn"
                      className="inline-flex items-center gap-2 rounded-button bg-brand-crimson px-5 py-2.5 text-sm font-semibold text-brand-cream hover:bg-brand-crimson/90 transition-colors shadow-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.logoutBtn}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                // SIGN IN / SIGN UP FORMS
                <motion.div
                  key="auth-forms-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Tab Selector */}
                  <div className="flex border-b border-brand-sienna/10 dark:border-brand-gold/10 pb-1">
                    <button
                      onClick={() => setActiveTab("signin")}
                      id="tab-signin"
                      className={`relative pb-3 text-base sm:text-lg font-serif font-bold transition-colors duration-200 px-4 focus:outline-none ${
                        activeTab === "signin" 
                          ? "text-brand-espresso dark:text-brand-cream" 
                          : "text-brand-espresso/45 dark:text-brand-cream/40 hover:text-brand-gold"
                      }`}
                    >
                      {t.signInTab}
                      {activeTab === "signin" && (
                        <motion.div 
                          layoutId="activeTabUnderline" 
                          className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-gold"
                        />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("signup")}
                      id="tab-signup"
                      className={`relative pb-3 text-base sm:text-lg font-serif font-bold transition-colors duration-200 px-4 focus:outline-none ${
                        activeTab === "signup" 
                          ? "text-brand-espresso dark:text-brand-cream" 
                          : "text-brand-espresso/45 dark:text-brand-cream/40 hover:text-brand-gold"
                      }`}
                    >
                      {t.signUpTab}
                      {activeTab === "signup" && (
                        <motion.div 
                          layoutId="activeTabUnderline" 
                          className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-gold"
                        />
                      )}
                    </button>
                  </div>

                  {/* SIGN IN FORM */}
                  {activeTab === "signin" && (
                    <motion.form
                      key="signin-form"
                      onSubmit={handleSignIn}
                      initial={{ opacity: 0, x: direction === "rtl" ? 15 : -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction === "rtl" ? -15 : 15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 font-sans"
                      noValidate
                    >
                      {signInError && (
                        <div className="flex items-center gap-2 p-3 rounded bg-brand-crimson/10 border border-brand-crimson/20 text-brand-crimson text-xs sm:text-sm">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{signInError}</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label htmlFor="signin-email" className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider block">
                          {t.emailLabel}
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-sienna/50 dark:text-brand-gold/40">
                            <Mail className="h-4 w-4" />
                          </span>
                          <input
                            type="email"
                            id="signin-email"
                            required
                            placeholder="yusuf@auracrafts.com"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 py-2.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/20 dark:bg-brand-espresso/20 dark:text-brand-cream"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label htmlFor="signin-password" className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider block">
                            {t.passwordLabel}
                          </label>
                          <a href="#" className="text-xs text-brand-gold hover:underline">
                            {t.forgotPass}
                          </a>
                        </div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-sienna/50 dark:text-brand-gold/40">
                            <Lock className="h-4 w-4" />
                          </span>
                          <input
                            type="password"
                            id="signin-password"
                            required
                            placeholder="••••••••"
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 py-2.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/20 dark:bg-brand-espresso/20 dark:text-brand-cream"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          id="signin-btn"
                          disabled={signInLoading}
                          className="w-full flex items-center justify-center gap-2 rounded-button bg-brand-espresso text-brand-cream py-3 text-sm font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors duration-200 dark:bg-brand-gold dark:text-brand-espresso dark:hover:bg-white dark:hover:text-brand-espresso"
                        >
                          {signInLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{t.submitting}</span>
                            </>
                          ) : (
                            <>
                              <span>{t.signInBtn}</span>
                              <ArrowRight className={`h-4 w-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Mock hint detail */}
                      <p className="text-[10px] text-brand-espresso/40 dark:text-brand-cream/35 text-center mt-2">
                        * demo account available: <b>admin@auracrafts.com</b> / <b>password123</b>
                      </p>

                      <div className="text-center pt-2">
                        <p className="text-xs text-brand-sienna/80 dark:text-brand-cream/60">
                          {t.noAccount}{" "}
                          <button
                            type="button"
                            onClick={() => setActiveTab("signup")}
                            className="font-semibold text-brand-gold hover:underline focus:outline-none"
                          >
                            {language === "en" ? "Create membership" : "رکنیت بنائیں"}
                          </button>
                        </p>
                      </div>
                    </motion.form>
                  )}

                  {/* SIGN UP FORM */}
                  {activeTab === "signup" && (
                    <motion.form
                      key="signup-form"
                      onSubmit={handleSignUp}
                      initial={{ opacity: 0, x: direction === "rtl" ? -15 : 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction === "rtl" ? 15 : -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 font-sans"
                      noValidate
                    >
                      {signUpSuccess ? (
                        <div className="flex items-center gap-3 p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                          <CheckCircle2 className="h-5 w-5 shrink-0" />
                          <span>{t.successReg}</span>
                        </div>
                      ) : (
                        <>
                          {signUpError && (
                            <div className="flex items-center gap-2 p-3 rounded bg-brand-crimson/10 border border-brand-crimson/20 text-brand-crimson text-xs sm:text-sm">
                              <AlertCircle className="h-4 w-4 shrink-0" />
                              <span>{signUpError}</span>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <label htmlFor="signup-name" className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider block">
                              {t.nameLabel}
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-sienna/50 dark:text-brand-gold/40">
                                <UserIcon className="h-4 w-4" />
                              </span>
                              <input
                                type="text"
                                id="signup-name"
                                required
                                placeholder="Yusuf Ahmed"
                                value={signUpName}
                                onChange={(e) => setSignUpName(e.target.value)}
                                className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 py-2.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/20 dark:bg-brand-espresso/20 dark:text-brand-cream"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="signup-email" className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider block">
                              {t.emailLabel}
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-sienna/50 dark:text-brand-gold/40">
                                <Mail className="h-4 w-4" />
                              </span>
                              <input
                                type="email"
                                id="signup-email"
                                required
                                placeholder="yusuf@auracrafts.com"
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)}
                                className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 py-2.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/20 dark:bg-brand-espresso/20 dark:text-brand-cream"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label htmlFor="signup-password" className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider block">
                                {t.passwordLabel}
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-sienna/50 dark:text-brand-gold/40">
                                  <Lock className="h-4 w-4" />
                                </span>
                                <input
                                  type="password"
                                  id="signup-password"
                                  required
                                  placeholder="••••••••"
                                  value={signUpPassword}
                                  onChange={(e) => setSignUpPassword(e.target.value)}
                                  className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 py-2.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/20 dark:bg-brand-espresso/20 dark:text-brand-cream"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label htmlFor="signup-confirm-password" className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider block">
                                {t.confirmPasswordLabel}
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-sienna/50 dark:text-brand-gold/40">
                                  <Lock className="h-4 w-4" />
                                </span>
                                <input
                                  type="password"
                                  id="signup-confirm-password"
                                  required
                                  placeholder="••••••••"
                                  value={signUpConfirmPassword}
                                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                                  className="w-full rounded-input border border-brand-sienna/20 bg-brand-cream/5 py-2.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/20 dark:bg-brand-espresso/20 dark:text-brand-cream"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              id="signup-btn"
                              disabled={signUpLoading}
                              className="w-full flex items-center justify-center gap-2 rounded-button bg-brand-espresso text-brand-cream py-3 text-sm font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors duration-200 dark:bg-brand-gold dark:text-brand-espresso dark:hover:bg-white dark:hover:text-brand-espresso"
                            >
                              {signUpLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>{t.submitting}</span>
                                </>
                              ) : (
                                <>
                                  <span>{t.signUpBtn}</span>
                                  <ArrowRight className={`h-4 w-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
                                </>
                              )}
                            </button>
                          </div>

                          <div className="text-center pt-2">
                            <p className="text-xs text-brand-sienna/80 dark:text-brand-cream/60">
                              {t.haveAccount}{" "}
                              <button
                                type="button"
                                onClick={() => setActiveTab("signin")}
                                className="font-semibold text-brand-gold hover:underline focus:outline-none"
                              >
                                {t.signInTab}
                              </button>
                            </p>
                          </div>
                        </>
                      )}
                    </motion.form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
