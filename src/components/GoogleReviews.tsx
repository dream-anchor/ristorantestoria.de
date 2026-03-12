import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Sparkles, ExternalLink, PenLine, ChevronDown } from "lucide-react";

import reviewsDe from "@/data/google-reviews-de.json";
import reviewsEn from "@/data/google-reviews-en.json";
import reviewsIt from "@/data/google-reviews-it.json";
import reviewsFr from "@/data/google-reviews-fr.json";

type ReviewData = typeof reviewsDe;
const reviewsByLang: Record<string, ReviewData> = {
  de: reviewsDe, en: reviewsEn, it: reviewsIt, fr: reviewsFr,
};

interface Review {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  time: number;
}

// ── Stars ──
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`h-4 w-4 ${
          s <= rating
            ? "fill-amber-400 text-amber-400"
            : s - 0.5 <= rating
            ? "fill-amber-400/50 text-amber-400"
            : "fill-muted text-muted"
        }`}
      />
    ))}
  </div>
);

// ── Single Review Card ──
const ReviewCard = ({ review }: { review: Review }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  const maxLen = 200;
  const needsTrunc = review.text.length > maxLen;
  const displayText = expanded || !needsTrunc
    ? review.text
    : review.text.slice(0, maxLen) + "\u2026";

  return (
    <div className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm h-full">
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-xs text-muted-foreground">
          {review.relativeTimeDescription}
        </span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed flex-1 whitespace-pre-line">
        {displayText}
        {needsTrunc && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-primary hover:underline text-sm font-medium"
          >
            {expanded ? t.reviews.readLess : t.reviews.readMore}
          </button>
        )}
      </p>
      <p className="text-sm font-medium text-foreground">{review.authorName}</p>
    </div>
  );
};

// ── Google "G" icon ──
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// ── Translations for "show more" ──
const showMoreLabels: Record<string, string> = {
  de: "Weitere Bewertungen laden",
  en: "Load more reviews",
  it: "Carica altre recensioni",
  fr: "Charger plus d\u2019avis",
};

// ── Main Component ──
interface GoogleReviewsProps {
  compact?: boolean;
}

// ⚠️ REVIEW DISPLAY RULES — DO NOT CHANGE:
// - Initial: 6 reviews visible in grid (compact mode: 3, no Load More)
// - "Load more" button adds 3 more each click
// - NO consent gate, NO carousel, NO activation button
// - Reviews come from local JSON files — no third-party widget, no consent required
// - Grid: 1 col mobile, 2 col tablet, 3 col desktop
const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const GoogleReviews = ({ compact = false }: GoogleReviewsProps) => {
  const { t, language } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(compact ? 3 : INITIAL_COUNT);

  const data = reviewsByLang[language] || reviewsDe;
  const { rating, totalReviews, reviews, placeId, summary, summaryLabel } = data;
  const hasReviews = reviews.length > 0 && rating > 0;

  const writeReviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : "https://maps.google.com/?cid=3761590175870856939";
  const allReviewsUrl = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : "https://maps.google.com/?cid=3761590175870856939";

  if (!hasReviews) return null;

  // Neueste Reviews zuerst (nach timestamp absteigend), nur 4-5 Sterne
  const sortedReviews = [...(reviews as Review[])]
    .filter((r) => r.rating >= 4)
    .sort((a, b) => b.time - a.time);
  const displayReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < sortedReviews.length;

  const loadMore = () => setVisibleCount((prev) => prev + LOAD_MORE_COUNT);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header + Aggregate Rating */}
      <div className="text-center mb-8">
        <h2 className={`font-serif font-semibold mb-3 ${compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}`}>
          {t.reviews.title}
        </h2>
        <div className="flex items-center justify-center gap-3 mb-2">
          <StarRating rating={Math.round(rating)} />
          <span className="text-lg font-semibold">{rating}</span>
          <span className="text-muted-foreground">
            {t.reviews.outOf5} · {totalReviews.toLocaleString("de-DE")} {t.reviews.reviewCount}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">{t.reviews.subtitle}</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="max-w-4xl mx-auto mb-10 bg-secondary/30 border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground uppercase tracking-wide font-medium">
            <Sparkles className="h-4 w-4" />
            {summaryLabel}
          </div>
          <p className="text-base md:text-lg text-foreground/85 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Review Grid — local JSON data, no consent required */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayReviews.map((review, i) => (
          <ReviewCard key={`${review.authorName}-${review.time}-${i}`} review={review} />
        ))}
      </div>

      {/* Load More — only in non-compact mode, disappears when all loaded */}
      {hasMore && !compact && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-secondary transition-colors text-sm font-medium text-foreground/70 hover:text-foreground"
          >
            <ChevronDown className="h-4 w-4" />
            {showMoreLabels[language] || showMoreLabels.de}
          </button>
        </div>
      )}

      {/* CTA Buttons — external links to Google, always visible */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        <a
          href={allReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-accent transition-colors text-sm font-medium"
        >
          <GoogleIcon />
          <span>{t.reviews.viewAll}</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
        <a
          href={writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
        >
          <PenLine className="h-4 w-4" />
          <span>{t.reviews.writeReview}</span>
        </a>
      </div>
    </section>
  );
};

export default GoogleReviews;
