"use client";

import ProductRating from "@/components/ProductRating";

type Merchant = {
  name: string;
  url: string;
};

type SavedProduct = {
  name: string;
  price: string;
  reason: string;
  pros: string[];
  cons: string[];
  merchants?: Merchant[];
  rating?: number;
  savedAt: string;
};

type SavedRecommendationsProps = {
  savedProducts: SavedProduct[];
  onRemoveSaved: (productName: string) => void;
};

export default function SavedRecommendations({
  savedProducts,
  onRemoveSaved,
}: SavedRecommendationsProps) {
  return (
    <section className="buysmart-section">
      <h2 className="text-xl font-bold" style={{ color: "#111827" }}>
        Saved Recommendations
      </h2>

      {savedProducts.length === 0 ? (
        <p className="mt-4" style={{ color: "#4b5563" }}>
          No saved recommendations yet.
        </p>
      ) : (
        <div className="buysmart-grid-2 mt-4">
          {savedProducts.map((product) => (
            <article key={product.name} className="buysmart-item-card">
              <h3 className="text-lg font-bold" style={{ color: "#111827" }}>
                {product.name}
              </h3>

              <div className="mt-3 space-y-2" style={{ color: "#111827" }}>
                <p>
                  <strong>Price:</strong> {product.price}
                </p>
                <ProductRating rating={product.rating} />
                <p style={{ color: "#4b5563" }}>
                  <strong>Reason:</strong> {product.reason || "No reason provided"}
                </p>
                <p style={{ color: "#4b5563" }}>
                  <strong>Saved:</strong> {product.savedAt}
                </p>
              </div>

              {product.merchants && product.merchants.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold" style={{ color: "#111827" }}>
                    Merchant Links
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {product.merchants.map((merchant, index) => (
                      <a
                        key={`${product.name}-${merchant.name}-${index}`}
                        href={merchant.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: "#2563eb", fontWeight: 700 }}
                      >
                        {merchant.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                className="buysmart-button-danger mt-4"
                onClick={() => onRemoveSaved(product.name)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
