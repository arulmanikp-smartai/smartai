"use client";

import type { CSSProperties, ReactNode } from "react";

interface Product {
  name: string;
  price: string;
  reason: string;
  pros: string[];
  cons: string[];
  rating?: number;
}

interface ProductComparisonProps {
  products: Product[];
}

const sectionStyle: CSSProperties = {
  marginTop: 24,
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  padding: 16,
  backgroundColor: "#ffffff",
  color: "#111827",
};

const comparisonCardStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  backgroundColor: "#ffffff",
  color: "#111827",
  minWidth: 0,
  overflowWrap: "break-word",
  padding: 16,
};

const badgeStyle: CSSProperties = {
  backgroundColor: "#dcfce7",
  border: "1px solid #86efac",
  borderRadius: "999px",
  color: "#166534",
  display: "inline-block",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 8,
  padding: "4px 10px",
};

const summaryStyle: CSSProperties = {
  marginTop: 20,
  border: "1px solid #86efac",
  borderRadius: "12px",
  padding: 16,
  backgroundColor: "#ecfdf5",
  color: "#111827",
};

function extractPrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, ""));
}

function formatList(items: string[]): ReactNode {
  if (items.length === 0) {
    return "None listed";
  }

  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export default function ProductComparison({ products }: ProductComparisonProps) {
  if (products.length === 0) {
    return null;
  }

  const bestValueIndex = products.reduce((lowestIndex, product, index) => {
    const currentPrice = extractPrice(product.price);
    const lowestPrice = extractPrice(products[lowestIndex].price);

    return currentPrice < lowestPrice ? index : lowestIndex;
  }, 0);

  const bestValueProduct = products[bestValueIndex];

  return (
    <section
      style={sectionStyle}
      aria-labelledby="product-comparison-title"
    >
      <h2 id="product-comparison-title" className="text-xl font-bold" style={{ color: "#111827" }}>
        Product Comparison
      </h2>

      <div className="product-comparison-grid mt-4">
        {products.map((product, index) => (
          <article
            key={`${product.name}-${index}`}
            style={comparisonCardStyle}
          >
            {index === bestValueIndex && (
              <span style={badgeStyle}>
                🏆 Best Value
              </span>
            )}

            <h3 className="text-lg font-bold" style={{ color: "#111827" }}>
              {product.name}
            </h3>

            <div className="mt-4 space-y-3">
              <p style={{ color: "#111827" }}>
                <strong>Price:</strong> {product.price}
              </p>

              <p style={{ color: "#111827" }}>
                <strong>Rating:</strong> {product.rating ?? 4}/5
              </p>

              <div>
                <p className="font-bold" style={{ color: "#111827" }}>
                  Recommendation Reason
                </p>
                <p style={{ color: "#4b5563" }}>
                  {product.reason || "No reason provided"}
                </p>
              </div>

              <div>
                <p className="font-bold" style={{ color: "#111827" }}>
                  Pros
                </p>
                <div style={{ color: "#111827" }}>
                  {formatList(product.pros)}
                </div>
              </div>

              <div>
                <p className="font-bold" style={{ color: "#111827" }}>
                  Cons
                </p>
                <div style={{ color: "#111827" }}>
                  {formatList(product.cons)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={summaryStyle}>
        <h3 className="font-bold" style={{ color: "#111827" }}>Comparison Summary</h3>

        <div className="mt-3 space-y-2">
          <p>
            <strong>Best Value:</strong> {bestValueProduct.name}
          </p>
          <p>
            <strong>Price:</strong> {bestValueProduct.price}
          </p>
          <p>
            <strong>Recommended By AI Because:</strong>{" "}
            {bestValueProduct.reason || "No reason provided"}
          </p>
        </div>
      </div>
    </section>
  );
}
