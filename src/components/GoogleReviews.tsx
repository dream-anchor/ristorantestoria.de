import { useState } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import reviewsData from "@/data/google-reviews.json";

interface Review {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  time: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  const maxLength = 200;
  const needsTruncation = review.text.length > maxLength;
  const displayText = expanded || !needsTruncation
    ? review.text
    : review.text.slice(0, maxLength) + "…";

  return (
    <div className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-xs text-muted-foreground">
          {review.relativeTimeDescription}
        </span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed flex-1">
        {displayText}
        {needsTruncation && (
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

const GoogleReviews = () => {
  const { hasConsent, openSettings, savePreferences, consent } = useCookieConsent();
  const { t } = useLanguage();

  const handleEnableExternal = () => {
    savePreferences({
      statistics: consent?.statistics ?? false,
      marketing: consent?.marketing ?? false,
      external: true,
    });
  };

  const { rating, totalReviews, reviews, placeId } = reviewsData as {
    rating: number;
    totalReviews: number;
    reviews: Review[];
    placeId: string;
  };

  const hasReviews = reviews.length > 0 && rating > 0;
  const reviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : "https://maps.google.com/?cid=3761590175870856939";

  // No reviews loaded yet — show nothing
  if (!hasReviews) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header with aggregate rating — always visible */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">
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

      {/* Reviews — consent-gated */}
      {hasConsent("external") ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.slice(0, 6).map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-accent transition-colors text-sm font-medium"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.reviews.writeReview}
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

export default GoogleReviews;
