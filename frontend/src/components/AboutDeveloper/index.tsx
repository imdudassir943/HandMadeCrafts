"use client";

import React, { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Calendar, Sparkles, Code2, ArrowRight } from "lucide-react";

/**
 * ABOUT THE DEVELOPER CONFIGURATION
 * 
 * Replace these placeholders with your actual URLs and image path.
 */
const DEVELOPER_CONFIG = {
  // Social Media Links (Replace with your own URLs)
  socialLinks: {
    whatsapp: "YOUR_WHATSAPP_LINK",   // e.g. "https://wa.me/923000000000"
    linkedin: "YOUR_LINKEDIN_LINK",   // e.g. "https://linkedin.com/in/mudassir-sharif"
    instagram: "YOUR_INSTAGRAM_LINK", // e.g. "https://instagram.com/mudassir_sharif"
    github: "YOUR_GITHUB_LINK",       // e.g. "https://github.com/mudassir-sharif"
  },
  
  // Profile Image Path (Uncomment Image component below to use)
  profileImage: "/images/developer_profile.png",
};

export default function AboutDeveloper() {
  const { language, direction } = useLanguage();

  // Motion values for cursor position (relative to card center)
  const xVal = useMotionValue(0);
  const yVal = useMotionValue(0);

  // Smooth springs for interactive 3D tilt
  const springConfig = { damping: 25, stiffness: 120, mass: 0.6 };
  const rotateX = useSpring(useTransform(yVal, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(xVal, [-0.5, 0.5], [-10, 10]), springConfig);

  // Elastic translation pull
  const translateX = useSpring(useTransform(xVal, [-0.5, 0.5], [-8, 8]), springConfig);
  const translateY = useSpring(useTransform(yVal, [-0.5, 0.5], [-8, 8]), springConfig);

  // Spotlight position relative coordinates
  const shineX = useSpring(useTransform(xVal, [-0.5, 0.5], ["0%", "100%"]), springConfig);
  const shineY = useSpring(useTransform(yVal, [-0.5, 0.5], ["0%", "100%"]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    xVal.set((e.clientX - rect.left) / rect.width - 0.5);
    yVal.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    xVal.set(0);
    yVal.set(0);
  };

  const starsCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = starsCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle canvas resizing dynamically
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Star representations
    interface TwinkleStar {
      x: number;
      y: number;
      size: number;
      phase: number;
      twinkleSpeed: number;
      isCrossStar: boolean;
      color: string;
    }

    interface CursorSparkle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      angle: number;
      spinSpeed: number;
      opacity: number;
      decay: number;
      color: string;
    }

    const brandColors = ["#bb9457", "#ffe6a7", "#ffe6a7", "#99582a"];

    // Initialize 60 continuously twinkling background stars
    const backgroundStars: TwinkleStar[] = [];
    for (let i = 0; i < 60; i++) {
      backgroundStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.8, // 0.8px to 2.3px
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        isCrossStar: Math.random() < 0.25, // 25% are 4-pointed stars
        color: brandColors[Math.floor(Math.random() * brandColors.length)],
      });
    }

    // Keep track of cursor sparkles locally
    let cursorSparkles: CursorSparkle[] = [];
    let activePointer = false;
    let lastX = 0;
    let lastY = 0;

    const spawnSparkle = (x: number, y: number) => {
      const color = brandColors[Math.floor(Math.random() * brandColors.length)];
      cursorSparkles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.3, // upward bias
        size: Math.random() * 3.5 + 1.5, // 1.5px to 5px
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.1,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.015,
        color,
      });
    };

    // Track cursor move relative to canvas element
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn only if the pointer is within bounds of the developer section
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        if (!activePointer) {
          lastX = x;
          lastY = y;
          activePointer = true;
          return;
        }

        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 4) {
          const spawnCount = Math.min(Math.floor(dist / 6), 3);
          for (let i = 0; i < spawnCount; i++) {
            const t = i / spawnCount;
            spawnSparkle(lastX + dx * t, lastY + dy * t);
          }
          lastX = x;
          lastY = y;
        }
      } else {
        activePointer = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMoveGlobal);

    // Star draw helpers
    const drawCrossStar = (c: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
      c.beginPath();
      c.moveTo(cx, cy - size);
      c.lineTo(cx + size * 0.25, cy - size * 0.25);
      c.lineTo(cx + size, cy);
      c.lineTo(cx + size * 0.25, cy + size * 0.25);
      c.lineTo(cx, cy + size);
      c.lineTo(cx - size * 0.25, cy + size * 0.25);
      c.lineTo(cx - size, cy);
      c.lineTo(cx - size * 0.25, cy - size * 0.25);
      c.closePath();
      c.fill();
    };

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Render background twinkling stars
      backgroundStars.forEach((star) => {
        // Regenerate positions if canvas resized
        if (star.x > width) star.x = Math.random() * width;
        if (star.y > height) star.y = Math.random() * height;

        star.phase += star.twinkleSpeed;
        const opacity = 0.25 + ((Math.sin(star.phase) + 1) / 2) * 0.75; // twinkle between 0.25 and 1

        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;

        if (star.isCrossStar) {
          drawCrossStar(ctx, star.x, star.y, star.size * 2);
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Update and render cursor sparkles
      const nextSparkles: CursorSparkle[] = [];
      cursorSparkles.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.01; // soft gravity gravity
        s.angle += s.spinSpeed;
        s.opacity -= s.decay;
        s.size = Math.max(0, s.size - 0.05);

        if (s.opacity > 0 && s.size > 0) {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.opacity;

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.angle);
          drawCrossStar(ctx, 0, 0, s.size);
          ctx.restore();

          nextSparkles.push(s);
        }
      });
      cursorSparkles = nextSparkles;

      // Reset alpha for safety
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const t = {
    en: {
      heading: "About the Developer",
      subheading: "The Mind & Code Behind Aura Crafts",
      creatorBadge: "Creator of Aura Crafts",
      devName: "Mudassir Sharif",
      devRole: "Python Developer | Django Backend Developer | MERN Stack Learner | Data Science Enthusiast",
      
      introText: "I am a passionate software developer focused on building modern web applications and continuously improving my skills in backend development, full-stack engineering, and data science. Aura Crafts is one of my projects created to provide artisans and handmade craft businesses with a modern digital presence and seamless online experience.",
      
      cardTitle: "Developer Profile",
      locationLabel: "Location",
      locationVal: "Lahore, Pakistan",
      experienceLabel: "Experience",
      experienceVal: "2+ Years in Learning & Development",
      
      socialHeading: "Connect With Me",
      ctaHeading: "Let's Build Something Amazing Together",
      ctaButton: "Contact Me",
      
      skillsLabel: "Tech Stack & Focus Areas",
    },
    ur: {
      heading: "ڈویلپر کے بارے میں",
      subheading: "اورا کرافٹس کے پیچھے کام کرنے والا ذہن اور کوڈ",
      creatorBadge: "اورا کرافٹس کا خالق",
      devName: "مدثر شریف",
      devRole: "پائتھن ڈویلپر | جینگو بیک اینڈ ڈویلپر | مرن اسٹیک لرنر | ڈیٹا سائنس کے شوقین",
      
      introText: "میں ایک پرجوش سافٹ ویئر ڈویلپر ہوں جو جدید ویب ایپلیکیشنز بنانے اور بیک اینڈ ڈویلپمنٹ، فل اسٹیک انجینئرنگ، اور ڈیٹا سائنس میں اپنی مہارتوں کو مسلسل بہتر بنانے پر توجہ مرکوز کیے ہوئے ہوں۔ اورا کرافٹس میرے پروجیکٹس میں سے ایک ہے جسے ہنرمندوں اور ہاتھ سے بنی اشیاء کے کاروبار کو ایک جدید ڈیجیٹل موجودگی اور بغیر کسی رکاوٹ کے آن لائن تجربہ فراہم کرنے کے لیے بنایا گیا ہے۔",
      
      cardTitle: "ڈویلپر پروفائل",
      locationLabel: "مقام",
      locationVal: "لاہور، پاکستان",
      experienceLabel: "تجربہ",
      experienceVal: "2+ سال سیکھنے اور ڈویلپمنٹ کا",
      
      socialHeading: "مجھ سے جڑیں",
      ctaHeading: "آئیں مل کر کچھ شاندار بناتے ہیں",
      ctaButton: "مجھ سے رابطہ کریں",
      
      skillsLabel: "ٹیکنالوجیز اور ترجیحات",
    }
  }[language];

  const skills = [
    "Python", "Django", "React.js", "Next.js", "MERN Stack", "Data Science", "PostgreSQL", "Tailwind CSS"
  ];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  const socialIcons = [
    {
      name: "WhatsApp",
      link: DEVELOPER_CONFIG.socialLinks.whatsapp,
      color: "hover:bg-[#25D366] hover:text-white border-[#25D366]/30 text-[#25D366] dark:border-[#25D366]/40",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.908-6.993-1.879-1.878-4.361-2.908-6.998-2.909-5.443 0-9.866 4.42-9.871 9.865-.001 1.748.457 3.453 1.328 4.96L1.87 22.13l4.777-1.976zm11.756-3.85c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      link: DEVELOPER_CONFIG.socialLinks.linkedin,
      color: "hover:bg-[#0077B5] hover:text-white border-[#0077B5]/30 text-[#0077B5] dark:border-[#0077B5]/40",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      link: DEVELOPER_CONFIG.socialLinks.instagram,
      color: "hover:bg-[#E1306C] hover:text-white border-[#E1306C]/30 text-[#E1306C] dark:border-[#E1306C]/40",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: "GitHub",
      link: DEVELOPER_CONFIG.socialLinks.github,
      color: "hover:bg-[#333] hover:text-white border-[#333]/30 text-[#333] dark:hover:bg-white dark:hover:text-brand-espresso dark:border-white/30 dark:text-white",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-brand-cream/5 dark:bg-transparent">
      {/* Twinkling background stars and cursor sparkles canvas */}
      <canvas
        ref={starsCanvasRef}
        className="absolute inset-0 pointer-events-none z-0 w-full h-full"
      />
      {/* Decorative craft elements / background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial glow - slow pulsing */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 rounded-full bg-brand-gold/10 dark:bg-brand-gold/5 blur-[100px]" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-1/4 -right-1/4 w-96 h-96 rounded-full bg-brand-crimson/10 dark:bg-brand-crimson/5 blur-[100px]" 
        />
        
        {/* Craft line path motif - slow rotation */}
        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-48 h-48 text-brand-sienna/5 dark:text-brand-gold/5" 
          fill="none" 
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
        </motion.svg>
        <motion.svg 
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-36 h-36 text-brand-sienna/5 dark:text-brand-gold/5" 
          fill="none" 
          viewBox="0 0 100 100"
        >
          <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="50,15 85,85 15,85" stroke="currentColor" strokeWidth="0.5" />
        </motion.svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold dark:text-brand-gold/90 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3" />
            <span>{t.creatorBadge}</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-espresso dark:text-brand-cream mb-4">
            {t.heading}
          </h1>
          <p className="text-base sm:text-lg text-brand-sienna dark:text-brand-gold max-w-xl mx-auto">
            {t.subheading}
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center"
        >
          {/* Left Column: Introduction & Details */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 space-y-8 text-start"
          >
            <div className="space-y-4">
              <h2 className="font-serif text-3xl font-bold text-brand-espresso dark:text-brand-cream">
                {t.devName}
              </h2>
              <h3 className="text-sm sm:text-base font-semibold text-brand-sienna dark:text-brand-gold tracking-wide leading-relaxed">
                {t.devRole}
              </h3>
              <div className="h-[2px] w-20 bg-brand-gold/60" />
            </div>

            <p className="text-base text-brand-espresso/85 dark:text-brand-cream/80 leading-relaxed font-medium">
              {t.introText}
            </p>

            {/* Tech Stack Pills Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso/60 dark:text-brand-cream/60 flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-brand-gold" />
                <span>{t.skillsLabel}</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: "rgba(187, 148, 87, 0.25)",
                      borderColor: "rgba(187, 148, 87, 0.6)",
                      boxShadow: "0 4px 12px rgba(187, 148, 87, 0.15)"
                    }}
                    className="cursor-default rounded-full bg-brand-cream/35 dark:bg-brand-gold/10 border border-brand-sienna/10 dark:border-brand-gold/20 px-3.5 py-1 text-xs font-semibold text-brand-espresso dark:text-brand-cream transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-brand-cream/20 dark:bg-brand-espresso/30 p-6 rounded-card border border-brand-sienna/10 dark:border-brand-gold/15 space-y-4 shadow-sm">
              <h4 className="font-serif text-lg sm:text-xl font-bold text-brand-espresso dark:text-brand-cream">
                {t.ctaHeading}
              </h4>
                <motion.a
                  href={DEVELOPER_CONFIG.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover="hover"
                  whileTap="tap"
                  className="relative overflow-hidden inline-flex items-center gap-3 rounded-button bg-brand-crimson px-8 py-3.5 font-semibold text-brand-cream shadow-lg hover:shadow-xl hover:shadow-brand-crimson/20 dark:hover:shadow-brand-gold/10 transition-all duration-300 group cursor-pointer border border-brand-crimson/10 dark:border-brand-gold/20"
                >
                  {/* Glossy sweep overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none -skew-x-12"
                    variants={{
                      hover: {
                        x: ["-100%", "200%"],
                        transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }
                      }
                    }}
                    initial={{ x: "-100%" }}
                  />

                  <span className="relative z-10 tracking-wide text-sm sm:text-base">{t.ctaButton}</span>
                  
                  <motion.span
                    className="relative z-10 flex items-center justify-center"
                    variants={{
                      initial: { x: 0 },
                      hover: { x: direction === "rtl" ? -5 : 5 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  >
                    <ArrowRight className={`h-4 w-4 sm:h-5 sm:w-5 ${direction === "rtl" ? "rotate-180" : ""}`} />
                  </motion.span>

                  {/* Glowing background bloom on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-crimson via-brand-sienna to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </motion.a>
            </div>

          </motion.div>

          {/* Right Column: Premium Developer Info Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 relative"
            style={{ perspective: "1000px" }}
          >
            {/* Animated Gradient Border Outer Wrapper with 3D Tilt */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
                transformStyle: "preserve-3d",
              }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative p-[3px] rounded-card overflow-hidden bg-gradient-to-r from-brand-crimson via-brand-gold to-brand-sienna bg-[length:200%_200%] shadow-xl group cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
            >
              
              {/* Glassmorphism Inner Card */}
              <div className="relative rounded-[6px] bg-white/95 dark:bg-brand-espresso/95 backdrop-blur-md p-6 sm:p-8 space-y-6">
                
                {/* Cursor-following spotlight reflection */}
                <motion.div
                  style={{
                    background: `radial-gradient(circle 150px at ${shineX} ${shineY}, rgba(187, 148, 87, 0.15), transparent)`,
                    transform: "translateZ(10px)",
                  }}
                  className="absolute inset-0 pointer-events-none rounded-[6px] z-20"
                />
                
                <h3 
                  className="font-serif text-xl font-bold text-brand-espresso dark:text-brand-cream text-center border-b border-brand-sienna/10 dark:border-brand-gold/10 pb-4"
                  style={{ transform: "translateZ(15px)" }}
                >
                  {t.cardTitle}
                </h3>

                {/* Profile Avatar Placeholder with hover scale */}
                <div 
                  className="relative group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-brand-gold/50 shadow-inner bg-gradient-to-br from-brand-espresso to-brand-crimson flex items-center justify-center">
                    <span className="text-4xl font-serif font-bold text-brand-cream tracking-widest select-none">
                      MS
                    </span>
                    
                    {/* Uncomment and place your image in public/images/developer_profile.png to activate */}
                    {/* 
                    <Image
                      src={DEVELOPER_CONFIG.profileImage}
                      alt={t.devName}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                    */}
                  </div>
                  
                  {/* Subtle pulsing badge */}
                  <span className="absolute bottom-1 right-[calc(50%-60px)] flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-gold"></span>
                  </span>
                </div>

                <div 
                  className="text-center space-y-1"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <h4 className="font-serif text-lg font-bold text-brand-espresso dark:text-brand-cream">
                    {t.devName}
                  </h4>
                  <p className="text-xs font-semibold text-brand-sienna dark:text-brand-gold uppercase tracking-wider">
                    {language === "en" ? "Full-Stack Builder" : "فل اسٹیک بلڈر"}
                  </p>
                </div>

                {/* Details Section */}
                <div 
                  className="space-y-4 border-t border-brand-sienna/10 dark:border-brand-gold/10 pt-4"
                  style={{ transform: "translateZ(15px)" }}
                >
                  <div className="flex items-center gap-3 text-brand-espresso/90 dark:text-brand-cream/90 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-cream/30 dark:bg-brand-gold/10">
                      <MapPin className="h-4.5 w-4.5 text-brand-sienna dark:text-brand-gold" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-espresso/50 dark:text-brand-cream/50 uppercase tracking-wider block">
                        {t.locationLabel}
                      </span>
                      <span className="font-semibold">{t.locationVal}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-brand-espresso/90 dark:text-brand-cream/90 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-cream/30 dark:bg-brand-gold/10">
                      <Calendar className="h-4.5 w-4.5 text-brand-sienna dark:text-brand-gold" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-espresso/50 dark:text-brand-cream/50 uppercase tracking-wider block">
                        {t.experienceLabel}
                      </span>
                      <span className="font-semibold">{t.experienceVal}</span>
                    </div>
                  </div>
                </div>

                {/* Social Links Section */}
                <div 
                  className="border-t border-brand-sienna/10 dark:border-brand-gold/10 pt-5 space-y-3 text-center"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso/60 dark:text-brand-cream/60">
                    {t.socialHeading}
                  </h4>
                  
                  {/* Floating Social Icons Grid */}
                  <div className="flex justify-center gap-4">
                    {socialIcons.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Developer's ${social.name}`}
                        animate={{ 
                          y: [0, -3, 0] 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 4, 
                          delay: index * 0.4, 
                          ease: "easeInOut" 
                        }}
                        whileHover={{ 
                          scale: 1.15, 
                          y: -6, 
                          transition: { duration: 0.2 } 
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border bg-white/50 backdrop-blur-sm dark:bg-brand-espresso/40 transition-colors shadow-sm ${social.color}`}
                      >
                        {social.svg}
                      </motion.a>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
