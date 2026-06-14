"use client";

import { useState } from "react";

type Merchant = { name: string; url: string };

type RecommendationItem = {
  name: string;
  price: string;
  reason?: string;
  pros?: string[];
  cons?: string[];
  merchants?: Merchant[];
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
      const parsed = data.result ? JSON.parse(data.result) : null;
      let recs: RecommendationItem[] = [];

      if (parsed && Array.isArray(parsed.recommendations)) {
        recs = parsed.recommendations;
      } else if (Array.isArray(parsed)) {
        recs = parsed;
      } else if (parsed && parsed.name) {
        recs = [parsed];
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
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          BuySmart AI
        </h1>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>Phone</option>
              <option>Laptop</option>
              <option>TV</option>
              <option>Refrigerator</option>
              <option>Washing Machine</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Budget
            </label>

            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Currency
            </label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Country
            </label>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>USA</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>Best Value for Money</option>
              <option>Best Performance</option>
              <option>Best Battery Life</option>
              <option>Best Camera</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Get Recommendations
          </button>
        </div>

        {submitted && (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-bold mb-2">
              User Selection
            </h2>

            <p>Category: {category}</p>
            <p>Budget: {budget}</p>
            <p>Country: {country}</p>
            <p>Priority: {priority}</p>
          </div>
        )}

        {recommendations.length > 0 ? (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-bold mb-2">AI Recommendation</h2>

            {recommendations.map((item, index) => (
              <div
                key={index}
                style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 16, backgroundColor: "#fff" }}
              >
                <h3 className="text-lg font-semibold">{index + 1}. {item.name}</h3>

                <p className="mt-2"><strong>Price:</strong> {item.price}</p>
                {item.reason && (
                  <p className="mt-1"><strong>Reason:</strong> {item.reason}</p>
                )}

                {item.pros && item.pros.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Pros</p>
                    <ul className="list-disc list-inside">
                      {item.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.cons && item.cons.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Cons</p>
                    <ul className="list-disc list-inside">
                      {item.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <p className="font-medium">Buy Links:</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {item.merchants?.map((m, i) => (
                      <a
                        key={i}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mr-2"
                      >
                        {m.name} - {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendation && parseFailed ? (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-bold mb-2">AI Recommendation</h2>
            <p>Unable to display recommendation.</p>
          </div>
        ) : null}

        {errorMessage && (
          <div className="mt-6 border-t pt-4 text-red-700">
            <h2 className="font-bold mb-2">Error</h2>
            <pre className="whitespace-pre-wrap">{errorMessage}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
