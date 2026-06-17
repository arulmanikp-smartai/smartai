"use client";

type SearchHistoryItem = {
  category: string;
  budget: string;
  currency: string;
  country: string;
  priority: string;
  createdAt: string;
};

type SearchHistoryProps = {
  history: SearchHistoryItem[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
};

export default function SearchHistory({
  history,
  onSelectHistory,
  onClearHistory,
}: SearchHistoryProps) {
  return (
    <section className="buysmart-section">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold" style={{ color: "#111827" }}>
          Search History
        </h2>

        <button
          type="button"
          className="buysmart-button-danger"
          onClick={onClearHistory}
        >
          Clear History
        </button>
      </div>

      {history.length === 0 ? (
        <p className="mt-4" style={{ color: "#4b5563" }}>
          No search history yet.
        </p>
      ) : (
        <div className="buysmart-grid-2 mt-4">
          {history.map((item, index) => (
            <article
              key={`${item.category}-${item.budget}-${item.currency}-${item.country}-${item.priority}-${item.createdAt}-${index}`}
              className="buysmart-item-card"
            >
              <h3 className="font-bold" style={{ color: "#111827" }}>
                {item.category}
              </h3>

              <div className="mt-3 space-y-1" style={{ color: "#111827" }}>
                <p>
                  <strong>Budget:</strong> {item.budget} {item.currency}
                </p>
                <p>
                  <strong>Country:</strong> {item.country}
                </p>
                <p>
                  <strong>Priority:</strong> {item.priority}
                </p>
                <p style={{ color: "#4b5563" }}>
                  <strong>Created:</strong> {item.createdAt}
                </p>
              </div>

              <button
                type="button"
                className="buysmart-button-secondary mt-4"
                onClick={() => onSelectHistory(item)}
              >
                Use Again
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
