"use client";

import ProductRating from "@/components/ProductRating";
import type { CSSProperties, ReactNode } from "react";

type Merchant = {
  name: string;
  url: string;
};

type Product = {
  name: string;
  price: string;
  reason: string;
  pros: string[];
  cons: string[];
  merchants?: Merchant[];
  rating?: number;
};

type ProductDetailModalProps = {
  product: Product | null;
  onClose: () => void;
};

const titleStyle: CSSProperties = {
  color: "#111827",
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.2,
};

const sectionHeadingStyle: CSSProperties = {
  color: "#111827",
  fontWeight: 700,
  marginBottom: 6,
};

const textStyle: CSSProperties = {
  color: "#111827",
};

const secondaryTextStyle: CSSProperties = {
  color: "#4b5563",
};

function renderList(items: string[]): ReactNode {
  if (items.length === 0) {
    return <p style={secondaryTextStyle}>None listed</p>;
  }

  return (
    <ul className="list-disc space-y-1 pl-5" style={textStyle}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  if (!product) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 style={titleStyle}>{product.name}</h2>
            <p className="mt-2 text-lg font-bold" style={textStyle}>
              {product.price}
            </p>
            <div className="mt-2">
              <ProductRating rating={product.rating} />
            </div>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close product details"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <section>
            <h3 style={sectionHeadingStyle}>AI Recommendation Reason</h3>
            <p style={secondaryTextStyle}>
              {product.reason || "No reason provided"}
            </p>
          </section>

          <section>
            <h3 style={sectionHeadingStyle}>Pros</h3>
            {renderList(product.pros)}
          </section>

          <section>
            <h3 style={sectionHeadingStyle}>Cons</h3>
            {renderList(product.cons)}
          </section>

          <section>
            <h3 style={sectionHeadingStyle}>Merchant Links</h3>
            {product.merchants && product.merchants.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {product.merchants.map((merchant, index) => (
                  <a
                    key={`${merchant.name}-${index}`}
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
            ) : (
              <p style={secondaryTextStyle}>No merchant links available</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
