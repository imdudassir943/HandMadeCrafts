"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { mockProducts } from "@/data/products";
import ArtisanBioCard from "@/components/ArtisanBioCard";

import { API_BASE_URL } from "@/config";

export default function Stories() {
  const { language } = useLanguage();
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/products/`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products in Stories", err));
  }, []);

  const t = {
    en: {
      heading: "Artisan Stories",
      subheading: "Meet the masters preserving cultural heritage through slow, ethical handiwork.",
    },
    ur: {
      heading: "دستکاروں کی کہانیاں",
      subheading: "ثقافتی ورثے کو برقرار رکھنے والے ہمارے ماہر دستکاروں سے ملیں۔",
    },
  }[language];

  const artisans = [
    {
      artisanName: "Yusuf Ahmed",
      artisanNameUr: "یوسف احمد",
      artisanImage: "/images/artisan_portrait.png",
      location: "Fayoum Oasis, Egypt",
      locationUr: "واحة الفيوم، مصر",
      quote: "“My grandfather taught me how to read the soul of the clay. When I shape a vase, I am not just crafting decor; I am connecting my ancestry to your home.”",
      quoteUr: "”میرے دادا نے مجھے مٹی کی روح کو پڑھنا سکھایا۔ جب میں کوئی گلدان بناتا ہوں، تو میں صرف ڈیکوریشن نہیں بنا رہا ہوتا، بلکہ میں اپنے اسلاف کو آپ کے گھر سے جوڑ رہا ہوتا ہوں۔“",
      bio: "Yusuf has been molding clay in his family workshop for over 40 years. Using hand-dug clay and home-made mineral glazes, his work preserves the classic Egyptian pottery tradition. Each terracotta piece undergoes a multi-day wood firing process that leaves unique organic marks.",
      bioUr: "یوسف پچھلے 40 سالوں سے اپنے خاندانی کارخانے میں مٹی کے شاندار برتن بنا رہے ہیں۔ ان کا کام قدیم روایتی مصری فن کا مظہر ہے۔ ان کے ہاتھ سے بنے برتن لکڑی کی بھٹی میں پکائے جاتے ہیں جس سے ہر ٹکڑے پر منفرد قدرتی نشانات ابھرتے ہیں۔",
      productFilter: "Yusuf Ahmed",
    },
    {
      artisanName: "Sarah Weaver",
      artisanNameUr: "سارہ ویور",
      artisanImage: "/images/wall_hanging.png",
      location: "Portland, Oregon",
      locationUr: "بورتلاند، أوريغون",
      quote: "“Weaving is a rhythm of meditation. Every thread is selected to bring physical warmth and quiet reflection into modern spaces.”",
      quoteUr: "”بنائی ایک طرح کا مراقبہ اور توجہ کا عمل ہے۔ اس کا ہر دھاگہ آپ کے گھر کو ایک گرمجوشی اور پرسکون خوبصورتی کا احساس دینے کے لیے چنا جاتا ہے۔“",
      bio: "Sarah is a textile designer focused on reviving traditional weaving methodologies. She uses organic wool dyed with local plants like walnut shells and indigo. Her handwoven tapestries combine modern mid-century structures with bohemian textures.",
      bioUr: "سارہ منسوجات کی نامور ڈیزائنر ہیں جو کھڈی کی روایتی بنائی کے فن کو زندہ کر رہی ہیں۔ وہ اخروٹ کے چھلکے اور نیل جیسے قدرتی رنگوں سے رنگی نامیاتی اون استعمال کرتی ہیں۔ ان کے ہاتھ سے بنے جدارتی قالین بوهو طرز کا بہترین نمونہ ہیں۔",
      productFilter: "Sarah Weaver",
    },
    {
      artisanName: "Mario C.",
      artisanNameUr: "ماریو سی",
      artisanImage: "/images/wood_bowl.png",
      location: "Tuscany, Italy",
      locationUr: "توسكانا، إيطاليا",
      quote: "“Olive wood grain is like a fingerprint of time. I do not design the bowl; I simply uncover the beauty that grew over three hundred years.”",
      quoteUr: "”زیتون کی لکڑی کا ریشہ وقت کے فنگر پرنٹ کی طرح ہے۔ میں پیالے کو ڈیزائن نہیں کرتا، میں صرف اس خوبصورتی کو سامنے لاتا ہوں جو تین سو سال میں پروان چڑھی ہے۔“",
      bio: "Mario is a third-generation sculptor working in the Tuscan hills. He sources wood exclusively from ancient olive trees that have ceased bearing fruit. His signature styling leaves raw bark edges, highlighting the contrast between the polished interior and wild exterior.",
      bioUr: "ماریو توسکانہ کی پہاڑیوں میں کام کرنے والے تیسری نسل کے مجسمہ ساز ہیں۔ وہ اپنی اشیاء کے لیے زیتون کی ایسی پرانی لکڑی استعمال کرتے ہیں جو پھل دینا بند کر چکی ہو۔ ان کے فن پارے زیتون کی لکڑی کی قدرتی خوبصورتی کو ظاہر کرتے ہیں۔",
      productFilter: "Mario C.",
    },
    {
      artisanName: "Karim Al-Mansoor",
      artisanNameUr: "کریم المنصور",
      artisanImage: "/images/brass_lantern.png",
      location: "Fez Medina, Morocco",
      locationUr: "مدينة فاس، المغرب",
      quote: "“Every hammer blow on brass is a pulse of intent. The pattern of light our lanterns cast is meant to invite peace and gathering.”",
      quoteUr: "”پیتل پر پڑنے والی ہتھوڑے کی ہر چوٹ ایک خاص مقصد رکھتی ہے۔ ہمارے فانوسوں سے بکھرنے والے روشنی کے پیٹرنز کا مقصد امن اور اپنائیت کی دعوت دینا ہے۔“",
      bio: "Karim operates a historic brass workshop in the Fez medina. He practices the age-old art of metal chiseling and piercing. Working without modern machines, Karim spends up to three weeks hand-hammering and perforating each brass lantern.",
      bioUr: "کریم مراکش کے شہر فاس میں پیتل کا ایک تاریخی کارخانہ چلاتے ہیں۔ وہ دھات کو تراشنے اور سوراخ کرنے کے قدیم فن کے ماہر ہیں۔ وہ جدید مشینوں کے بغیر کام کرتے ہیں اور ہر فانوس کو ہاتھ سے تیار کرنے میں تین ہفتے لگاتے ہیں۔",
      productFilter: "Karim Al-Mansoor",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Title Header */}
      <div className="border-b border-brand-sienna/10 pb-6 text-center sm:text-start">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso mb-2">
          {t.heading}
        </h1>
        <p className="text-sm sm:text-base text-brand-sienna max-w-2xl">
          {t.subheading}
        </p>
      </div>

      {/* Artisan List */}
      <main className="space-y-12 pb-12">
        {artisans.map((artisan, index) => {
          // Filter products made by this artisan
          const artisanProducts = products.filter(
            (p) => p.artisan === artisan.productFilter
          );

          return (
            <ArtisanBioCard
              key={index}
              artisanName={artisan.artisanName}
              artisanNameUr={artisan.artisanNameUr}
              artisanImage={artisan.artisanImage}
              location={artisan.location}
              locationUr={artisan.locationUr}
              quote={artisan.quote}
              quoteUr={artisan.quoteUr}
              bio={artisan.bio}
              bioUr={artisan.bioUr}
              products={artisanProducts}
            />
          );
        })}
      </main>
    </div>
  );
}
