/**
 * The five-star mark on a review.
 *
 * Drawn rather than typed: the literal ★ character renders differently in every
 * font and turns into emoji on some Android builds. `role="img"` is what makes the
 * label count, since an `aria-label` on a bare element with no role is ignored by
 * most screen readers.
 *
 * Amber on white is only 2.08:1, so the rating is drawn in flame on light grounds.
 */
export function Stars({ className = "text-flame" }: { className?: string }) {
  return (
    <span role="img" aria-label="Rated 5 out of 5" className={`inline-flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9L12 2.6z" />
        </svg>
      ))}
    </span>
  );
}
