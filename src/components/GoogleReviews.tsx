import { useState, useRef, useEffect, useCallback } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Sparkles, ExternalLink, PenLine } from "lucide-react";

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
      <p className="text-sm text-foreground/80 leading-relaxed flex-1">
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

// ── Main Component ──
interface GoogleReviewsProps {
  compact?: boolean;
}

const GoogleReviews = ({ compact = false }: GoogleReviewsProps) => {
  const { hasConsent, openSettings, savePreferences, consent } = useCookieConsent();
  const { t, language } = useLanguage();

  const data = reviewsByLang[language] || reviewsDe;
  const { rating, totalReviews, reviews, placeId, summary, summaryLabel } = data;
  const hasReviews = reviews.length > 0 && rating > 0;

  const writeReviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : "https://maps.google.com/?cid=3761590175870856939";
  const allReviewsUrl = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : "https://maps.google.com/?cid=3761590175870856939";

  const handleEnableExternal = () => {
    savePreferences({
      statistics: consent?.statistics ?? false,
      marketing: consent?.marketing ?? false,
      external: true,
    });
  };

  if (!hasReviews) return null;

  // Neueste Reviews zuerst (nach timestamp absteigend)
  const sortedReviews = [...(reviews as Review[])].sort((a, b) => b.time - a.time);
  const displayReviews = compact ? sortedReviews.slice(0, 3) : sortedReviews;

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header + Aggregate Rating */}
      <div className="text-center mb-6">
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

      {/* AI Summary — always visible */}
      {summary && (
        <div className="max-w-3xl mx-auto mb-8 bg-secondary/30 border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground uppercase tracking-wide font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            {summaryLabel}
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed italic">{summary}</p>
        </div>
      )}

      {/* Reviews — consent-gated */}
      {hasConsent("external") ? (
        <>
          <ReviewCarousel reviews={displayReviews} />
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
        </>
      ) : (
        <div className="bg-secondary/50 border border-border rounded-lg flex flex-col items-center justify-center p-8">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">{t.cookies.reviewsBlocked}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
            {t.cookies.reviewsBlockedDesc}
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button onClick={handleEnableExternal} variant="default">
              {t.cookies.enableReviews}
            </Button>
            <Button onClick={openSettings} variant="outline">
              {t.cookies.settings}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

// ── Carousel ──
const ReviewCarousel = ({ reviews }: { reviews: Review[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    updateScroll();
    window.addEventListener("resize", updateScroll);
    return () => window.removeEventListener("resize", updateScroll);
  }, [updateScroll]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-review-card]");
    const w = (card?.offsetWidth || 340) + 24; // card width + gap-6
    scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" });
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Zurück"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={updateScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <style>{`.review-scroll::-webkit-scrollbar { display: none; }`}</style>
        {reviews.map((review, i) => (
          <div
            key={i}
            data-review-card
            className="flex-none w-[calc(100vw-4rem)] sm:w-[calc(50vw-3rem)] lg:w-[calc(33.333%-1rem)] snap-start"
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Weiter"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default GoogleReviews;
