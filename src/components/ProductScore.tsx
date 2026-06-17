"use client";

type ProductScoreProps = {
  score?: number;
};

export default function ProductScore({ score = 85 }: ProductScoreProps) {
  const normalizedScore = Number.isFinite(score) ? score : 85;
  const safeScore = Math.min(100, Math.max(0, Math.round(normalizedScore)));

  return (
    <div className="buysmart-score">
      <p className="font-bold" style={{ color: "#111827" }}>
        BuySmart Score: {safeScore}/100
      </p>
      <div className="buysmart-score-bar" aria-hidden="true">
        <div
          className="buysmart-score-fill"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
}
