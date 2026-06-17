"use client";

type SortOption =
  | "bestMatch"
  | "priceLowHigh"
  | "priceHighLow"
  | "ratingHighLow"
  | "scoreHighLow";

type ProductControlsProps = {
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  showBestValueOnly: boolean;
  onBestValueOnlyChange: (value: boolean) => void;
};

export default function ProductControls({
  sortOption,
  onSortChange,
  showBestValueOnly,
  onBestValueOnlyChange,
}: ProductControlsProps) {
  return (
    <section className="buysmart-section">
      <h2 className="text-xl font-bold" style={{ color: "#111827" }}>
        Filters & Sorting
      </h2>

      <div className="mt-4 buysmart-controls-grid">
        <label className="block">
          <span className="mb-1 block font-bold" style={{ color: "#374151" }}>
            Sort By
          </span>
          <select
            value={sortOption}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#111827",
            }}
          >
            <option value="bestMatch">Best Match</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="ratingHighLow">Rating: High to Low</option>
            <option value="scoreHighLow">BuySmart Score: High to Low</option>
          </select>
        </label>

        <label
          className="flex items-center gap-3"
          style={{ color: "#111827", fontWeight: 700 }}
        >
          <input
            type="checkbox"
            checked={showBestValueOnly}
            onChange={(event) => onBestValueOnlyChange(event.target.checked)}
            style={{
              height: 18,
              width: 18,
            }}
          />
          Show Best Value Only
        </label>
      </div>
    </section>
  );
}
