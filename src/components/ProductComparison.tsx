"use client";

import type { CSSProperties, ReactNode } from "react";

interface Product {
  name: string;
  price: string;
  reason: string;
  pros: string[];
  cons: string[];
}

interface ProductComparisonProps {
  products: Product[];
}

const sectionStyle: CSSProperties = {
  marginTop: 20,
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  padding: 16,
  backgroundColor: "#ffffff",
  color: "#111827",
};

const headerCellStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  backgroundColor: "#f3f4f6",
  color: "#111827",
  fontWeight: 700,
  padding: 12,
};

const cellStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#111827",
  padding: 12,
};

const bestValueCellStyle: CSSProperties = {
  ...cellStyle,
  backgroundColor: "#ecfdf5",
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

      <div className="mt-4 overflow-x-auto">
        <table
          className="w-full min-w-[720px] border-collapse text-left text-sm"
          style={{ backgroundColor: "#ffffff", color: "#111827" }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>
                Feature
              </th>
              {products.map((product, index) => (
                <th
                  key={`${product.name}-${index}`}
                  style={{
                    ...headerCellStyle,
                    backgroundColor: index === bestValueIndex ? "#ecfdf5" : "#f3f4f6",
                  }}
                >
                  Product {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            <tr>
              <td className="font-medium" style={cellStyle}>
                Product Name
              </td>
              {products.map((product, index) => (
                <td
                  key={`${product.name}-name-${index}`}
                  style={index === bestValueIndex ? bestValueCellStyle : cellStyle}
                >
                  {index === bestValueIndex && (
                    <span
                      className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #86efac",
                      }}
                    >
                      🏆 Best Value
                    </span>
                  )}
                  <p className="font-semibold">{product.name}</p>
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-medium" style={cellStyle}>
                Price
              </td>
              {products.map((product, index) => (
                <td
                  key={`${product.name}-price-${index}`}
                  style={index === bestValueIndex ? bestValueCellStyle : cellStyle}
                >
                  {product.price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-medium" style={cellStyle}>
                Recommendation Reason
              </td>
              {products.map((product, index) => (
                <td
                  key={`${product.name}-reason-${index}`}
                  style={index === bestValueIndex ? bestValueCellStyle : cellStyle}
                >
                  {product.reason || "No reason provided"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-medium" style={cellStyle}>
                Pros
              </td>
              {products.map((product, index) => (
                <td
                  key={`${product.name}-pros-${index}`}
                  style={index === bestValueIndex ? bestValueCellStyle : cellStyle}
                >
                  {formatList(product.pros)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-medium" style={cellStyle}>
                Cons
              </td>
              {products.map((product, index) => (
                <td
                  key={`${product.name}-cons-${index}`}
                  style={index === bestValueIndex ? bestValueCellStyle : cellStyle}
                >
                  {formatList(product.cons)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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
