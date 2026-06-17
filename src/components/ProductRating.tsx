"use client";

type ProductRatingProps = {
  rating?: number;
};

export default function ProductRating({ rating = 4 }: ProductRatingProps) {
  const normalizedRating = Number.isFinite(rating) ? rating : 4;
  const safeRating = Math.min(5, Math.max(1, Math.round(normalizedRating)));
  const filledStars = "★".repeat(safeRating);
  const emptyStars = "☆".repeat(5 - safeRating);

  return (
    <div
      aria-label={`Product rating: ${safeRating} out of 5`}
      style={{
        color: "#111827",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 700,
      }}
    >
      <span style={{ color: "#b45309", letterSpacing: 1 }}>
        {filledStars}
        {emptyStars}
      </span>
      <span style={{ color: "#111827" }}>{safeRating}/5</span>
    </div>
  );
}
