"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Review } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

import { API_BASE_URL } from "@/config";

export default function ReviewSection() {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/reviews/`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to load reviews in ReviewSection", err));
  }, []);

  const t = {
    en: {
      heading: "Testimonials",
      subheading: "Hear from those who have invited our artisan treasures into their homes.",
      writeTitle: "Share Your Experience",
      nameLabel: "Your Name",
      commentLabel: "Your Review",
      ratingLabel: "Rating",
      submitBtn: "Submit Review",
      successMsg: "Thank you! Your review has been published.",
      emptyWarning: "Please enter your name and comment.",
    },
    ur: {
      heading: "صارفین کی رائے",
      subheading: "ان لوگوں سے سنیے جنہوں نے ہمارے ہنرمندوں کے شاہکاروں کو اپنے گھروں کا حصہ بنایا۔",
      writeTitle: "اپنا تجربہ شیئر کریں",
      nameLabel: "آپ کا نام",
      commentLabel: "تبصرہ",
      ratingLabel: "درجہ بندی",
      submitBtn: "تبصرہ بھیجیں",
      successMsg: "شکریہ! آپ کا تبصرہ شائع کر دیا گیا ہے۔",
      emptyWarning: "براہ کرم اپنا نام اور تبصرہ درج کریں۔",
    },
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      alert(t.emptyWarning);
      return;
    }

    fetch(`${API_BASE_URL}/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: newAuthor,
        authorUr: newAuthor,
        rating: newRating,
        comment: newComment,
        commentUr: newComment,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit review");
        return res.json();
      })
      .then((data) => {
        setReviews([data, ...reviews]);
        setNewAuthor("");
        setNewComment("");
        setNewRating(5);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit review. Please try again.");
      });
  };

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-brand-espresso">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso dark:text-brand-cream mb-4">
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-brand-sienna">
            {t.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews Grid */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence initial={false}>
              {reviews.map((review) => {
                const author = language === "ur" ? review.authorUr : review.author;
                const comment = language === "ur" ? review.commentUr : review.comment;

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-card border border-brand-sienna/10 bg-brand-cream/5 shadow-warm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-brand-espresso dark:text-brand-cream">
                          {author}
                        </h4>
                        <span className="text-xs text-brand-espresso/60 dark:text-brand-cream/60">{review.date}</span>
                      </div>
                      {/* Stars */}
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-brand-gold text-brand-gold"
                                : "text-brand-sienna/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-brand-espresso/80 dark:text-brand-cream/80 leading-relaxed italic">
                      {comment}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Submission Form */}
          <div className="p-6 rounded-card border border-brand-sienna/20 bg-brand-cream/10 h-fit shadow-warm">
            <h3 className="font-serif text-xl font-bold text-brand-espresso dark:text-brand-cream mb-4">
              {t.writeTitle}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name input */}
              <div>
                <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full rounded-input border border-brand-sienna/20 bg-white/70 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                />
              </div>

              {/* Rating select */}
              <div>
                <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                  {t.ratingLabel}
                </label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewRating(starVal)}
                        className="p-1 hover:scale-110 transition-transform"
                        aria-label={`Rate ${starVal} stars`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            starVal <= newRating
                              ? "fill-brand-gold text-brand-gold"
                              : "text-brand-sienna/30"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text area */}
              <div>
                <label className="block text-xs font-semibold text-brand-espresso/70 dark:text-brand-cream/70 mb-1">
                  {t.commentLabel}
                </label>
                <textarea
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-input border border-brand-sienna/20 bg-white/70 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none dark:border-brand-gold/30 dark:bg-brand-espresso/30 text-brand-espresso dark:text-brand-cream"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full rounded-button bg-brand-crimson text-brand-cream py-2.5 text-sm font-semibold hover:bg-brand-crimson/95 shadow-md"
              >
                {t.submitBtn}
              </motion.button>
            </form>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-brand-gold/20 border border-brand-gold/40 rounded-card text-xs text-brand-espresso dark:text-brand-cream text-center font-semibold"
                >
                  {t.successMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
