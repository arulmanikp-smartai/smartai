"use client";

import ProductComparison from "@/components/ProductComparison";
import type { CSSProperties } from "react";
import { useState } from "react";

type Merchant = { name: string; url: string };

type RecommendationItem = {
  name: string;
  price: string;
  reason: string;
  pros: string[];
  cons: string[];
  merchants?: Merchant[];
};

const pageStyle: CSSProperties = {
  backgroundColor: "#f5f7fb",
  color: "#111827",
};

const appCardStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#111827",
};

const headingStyle: CSSProperties = {
  color: "#111827",
};

const labelStyle: CSSProperties = {
  color: "#374151",
};

const normalTextStyle: CSSProperties = {
  color: "#111827",
};

const secondaryTextStyle: CSSProperties = {
  color: "#4b5563",
};

const recommendationCardStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  padding: 16,
  marginTop: 16,
};

export default function Home() {
  const [category, setCategory] = useState("Phone");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("USA");
  const [priority, setPriority] = useState("Best Value for Money");
  const [recommendation, setRecommendation] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  // Merchant links are generated per-item during parsing (see handleSubmit)

  // parsing handled after fetch; keep parseFailed flag in state to show fallback
  const [parseFailed, setParseFailed] = useState(false);
  const handleSubmit = async () => {
    setSubmitted(true);
    setRecommendation("");
    setRecommendations([]);
    setErrorMessage("");

    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        budget,
        currency,
        country,
        priority,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      setErrorMessage(data.error || "Unknown error from API.");
      return;
    }

    try {
      const parsedData = data.result ? JSON.parse(data.result) : null;
      const recommendations = parsedData?.recommendations || [];
      let recs: RecommendationItem[] = [];

      if (Array.isArray(recommendations)) {
        recs = recommendations;
      } else if (Array.isArray(parsedData)) {
        recs = parsedData;
      } else if (parsedData && parsedData.name) {
        recs = [parsedData];
      }

      // Normalize merchants and limit to 3
      recs = recs.map((r: unknown) => {
        const rr = r as {
          name?: string;
          price?: string;
          reason?: string;
          pros?: unknown;
          cons?: unknown;
          merchants?: unknown;
        };

        const item: RecommendationItem = {
          name: rr.name || "",
          price: rr.price || "",
          reason: rr.reason || "",
          pros: Array.isArray(rr.pros) ? (rr.pros as string[]) : [],
          cons: Array.isArray(rr.cons) ? (rr.cons as string[]) : [],
          merchants: Array.isArray(rr.merchants) ? (rr.merchants as Merchant[]) : [],
        };

        if (!item.merchants || item.merchants.length === 0) {
          const encoded = encodeURIComponent(item.name);
          if (country === "India" || country === "IN") {
            item.merchants = [
              { name: "Amazon India", url: `https://www.amazon.in/s?k=${encoded}` },
              { name: "Flipkart", url: `https://www.flipkart.com/search?q=${encoded}` },
              { name: "Croma", url: `https://www.croma.com/searchB?q=${encoded}` },
            ];
          } else {
            item.merchants = [
              { name: "Amazon", url: `https://www.amazon.com/s?k=${encoded}` },
              { name: "Best Buy", url: `https://www.bestbuy.com/site/searchpage.jsp?st=${encoded}` },
              { name: "Walmart", url: `https://www.walmart.com/search?q=${encoded}` },
            ];
          }
        }

        return item;
      }).filter(Boolean).slice(0, 3);

      if (recs.length > 0) {
        setRecommendations(recs);
        setRecommendation("");
        setParseFailed(false);
      } else {
        setRecommendations([]);
        setRecommendation(data.result || "No recommendation available");
        setParseFailed(false);
      }
    } catch {
      // suppress noisy console messages from bad AI output
      setParseFailed(true);
      setRecommendations([]);
      setRecommendation(data.result || "No recommendation available");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={pageStyle}
    >
      <div
        className="p-8 rounded-lg w-full max-w-md"
        style={appCardStyle}
      >
        <h1 className="text-3xl font-bold text-center mb-6" style={headingStyle}>
          BuySmart AI
        </h1>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 font-medium" style={labelStyle}>
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={fieldStyle}
            >
              <option>Phone</option>
              <option>Laptop</option>
              <option>TV</option>
              <option>Refrigerator</option>
              <option>Washing Machine</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium" style={labelStyle}>
              Budget
            </label>

            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget"
              style={fieldStyle}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={labelStyle}>
              Currency
            </label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={fieldStyle}
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium" style={labelStyle}>
              Country
            </label>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={fieldStyle}
            >
              <option>USA</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium" style={labelStyle}>
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={fieldStyle}
            >
              <option>Best Value for Money</option>
              <option>Best Performance</option>
              <option>Best Battery Life</option>
              <option>Best Camera</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-2 rounded"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "1px solid #1d4ed8",
              fontWeight: 700,
            }}
          >
            Get Recommendations
          </button>
        </div>

        {submitted && (
          <div className="mt-6 border-t pt-4" style={{ borderColor: "#d1d5db" }}>
            <h2 className="font-bold mb-2" style={headingStyle}>
              User Selection
            </h2>

            <p style={normalTextStyle}>Category: {category}</p>
            <p style={normalTextStyle}>Budget: {budget}</p>
            <p style={normalTextStyle}>Country: {country}</p>
            <p style={normalTextStyle}>Priority: {priority}</p>
          </div>
        )}

        {recommendations.length > 0 ? (
          <div className="mt-6 border-t pt-4" style={{ borderColor: "#d1d5db" }}>
            <h2 className="font-bold mb-2" style={headingStyle}>AI Recommendation</h2>

            {recommendations.map((item, index) => (
              <div
                key={index}
                style={recommendationCardStyle}
              >
                <h3 className="text-lg font-semibold" style={headingStyle}>{index + 1}. {item.name}</h3>

                <p className="mt-2" style={normalTextStyle}><strong>Price:</strong> {item.price}</p>
                {item.reason && (
                  <p className="mt-1" style={secondaryTextStyle}><strong>Reason:</strong> {item.reason}</p>
                )}

                {item.pros && item.pros.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium" style={headingStyle}>Pros</p>
                    <ul className="list-disc list-inside" style={normalTextStyle}>
                      {item.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.cons && item.cons.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium" style={headingStyle}>Cons</p>
                    <ul className="list-disc list-inside" style={normalTextStyle}>
                      {item.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <p className="font-medium" style={headingStyle}>Buy Links:</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {item.merchants?.map((m, i) => (
                      <a
                        key={i}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline mr-2"
                        style={{ color: "#2563eb" }}
                      >
                        {m.name} - {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {recommendations.length === 3 && (
              <ProductComparison products={recommendations} />
            )}
          </div>
        ) : recommendation && parseFailed ? (
          <div className="mt-6 border-t pt-4" style={{ borderColor: "#d1d5db" }}>
            <h2 className="font-bold mb-2" style={headingStyle}>AI Recommendation</h2>
            <p style={normalTextStyle}>Unable to display recommendation.</p>
          </div>
        ) : null}

        {errorMessage && (
          <div className="mt-6 border-t pt-4 text-red-700">
            <h2 className="font-bold mb-2" style={{ color: "#991b1b" }}>Error</h2>
            <pre className="whitespace-pre-wrap">{errorMessage}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
