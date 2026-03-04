import { memo } from "react";

const MAX_STARS = 5;

export const RatingStars = memo(function RatingStars({
  rating,
  max = MAX_STARS,
  size = "sm",
  showValue = false,
  reviewCount,
  className = "",
}) {
  const value = Math.min(max, Math.max(0, Number(rating) || 0));
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = max - full - half;

  const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`Rating: ${value} out of ${max}`}>
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`full-${i}`} filled className={sizeClass} />
        ))}
        {half ? <Star key="half" half className={sizeClass} /> : null}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} className={sizeClass} />
        ))}
      </div>
      {showValue && (
        <span className="text-amber-600 dark:text-amber-400 font-medium">
          {value % 1 === 0 ? value : value.toFixed(1)}
        </span>
      )}
      {reviewCount != null && (
        <span className="text-gray-500 dark:text-gray-400 text-sm">({reviewCount})</span>
      )}
    </div>
  );
});

function Star({ filled, half, className = "" }) {
  if (half) {
    return (
      <span className={`inline-block text-amber-500 dark:text-amber-400 ${className}`} style={{ opacity: 0.6 }} role="img" aria-hidden>★</span>
    );
  }
  return (
    <span className={`inline-block ${filled ? "text-amber-500 dark:text-amber-400" : "text-gray-300 dark:text-gray-600"} ${className}`} role="img" aria-hidden>
      {filled ? "★" : "☆"}
    </span>
  );
}
