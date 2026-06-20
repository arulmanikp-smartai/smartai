"use client";

import ProductControls from "@/components/ProductControls";
import ProductDetailModal from "@/components/ProductDetailModal";
import ProductComparison from "@/components/ProductComparison";
import ProductRating from "@/components/ProductRating";
import ProductScore from "@/components/ProductScore";
import { addAmazonAffiliate } from "@/lib/affiliateLinks";
import SavedRecommendations from "@/components/SavedRecommendations";
import SearchHistory from "@/components/SearchHistory";
import {
  getPrioritiesForCategory,
  productCategories,
} from "@/data/productOptions";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type Merchant = { name: string; url: string };

type Recommendation = {
  name: string;
  price: string;
  reason: string;
  pros: string[];
  cons: string[];
  merchants?: Merchant[];
  rating?: number;
  score?: number;
};

type RecommendationItem = Recommendation;

type SearchHistoryItem = {
  category: string;
  budget: string;
  currency: string;
  country: string;
  priority: string;
  createdAt: string;
};

type SavedProduct = Recommendation & {
  savedAt: string;
};

type SortOption =
  | "bestMatch"
  | "priceLowHigh"
  | "priceHighLow"
  | "ratingHighLow"
  | "scoreHighLow";

const SEARCH_HISTORY_STORAGE_KEY = "buysmart_search_history";
const SAVED_PRODUCTS_STORAGE_KEY = "buysmart_saved_products";
const GEMINI_BUSY_ERROR =
  "Gemini is temporarily busy. Please wait a few seconds and try again.";

function extractPrice(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

function getDefaultRating(index: number) {
  if (index === 0) {
    return 5;
  }

  if (index === 1) {
    return 4;
  }

  return 4;
}

function getDefaultScore(index: number) {
  if (index === 0) {
    return 95;
  }

  if (index === 1) {
    return 88;
  }

  return 84;
}

function isMerchant(value: unknown): value is Merchant {
  if (!value || typeof value !== "object") {
    return false;
  }

  const merchant = value as Partial<Merchant>;

  return typeof merchant.name === "string" && typeof merchant.url === "string";
}

function getCleanErrorMessage(error: unknown) {
  const message = typeof error === "string" ? error : "Unknown error from API.";
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("503") ||
    lowerMessage.includes("high demand") ||
    lowerMessage.includes("unavailable") ||
    lowerMessage.includes("temporarily unavailable")
  ) {
    return GEMINI_BUSY_ERROR;
  }

  if (message.includes("{") || message.includes("}")) {
    return "Unable to generate recommendation. Please try again.";
  }

  return message.replace(/^Unable to generate recommendation:\s*/i, "");
}

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

const formGroupStyle: CSSProperties = {
  marginBottom: "14px",
};

const headingStyle: CSSProperties = {
  color: "#111827",
};

const labelStyle: CSSProperties = {
  color: "#374151",
  fontWeight: 600,
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

const viewDetailsButtonStyle: CSSProperties = {
  backgroundColor: "#111827",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "8px 12px",
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
};

export default function Home() {
  const [category, setCategory] = useState("Phone");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("USA");
  const [priority, setPriority] = useState("Best Camera");
  const [recommendation, setRecommendation] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<RecommendationItem | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("bestMatch");
  const [showBestValueOnly, setShowBestValueOnly] = useState(false);
  const [hasLoadedLocalStorage, setHasLoadedLocalStorage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [parseFailed, setParseFailed] = useState(false);

  useEffect(() => {
    const loadStorage = window.setTimeout(() => {
      try {
        const storedHistory = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
        const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];

        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory);
        }
      } catch {
        setSearchHistory([]);
      }

      try {
        const storedSavedProducts = localStorage.getItem(SAVED_PRODUCTS_STORAGE_KEY);
        const parsedSavedProducts = storedSavedProducts ? JSON.parse(storedSavedProducts) : [];

        if (Array.isArray(parsedSavedProducts)) {
          setSavedProducts(parsedSavedProducts);
        }
      } catch {
        setSavedProducts([]);
      }

      setHasLoadedLocalStorage(true);
    }, 0);

    return () => window.clearTimeout(loadStorage);
  }, []);

  useEffect(() => {
    if (!hasLoadedLocalStorage) {
      return;
    }

    if (searchHistory.length === 0) {
      localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
      return;
    }

    localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(searchHistory));
  }, [hasLoadedLocalStorage, searchHistory]);

  useEffect(() => {
    if (!hasLoadedLocalStorage) {
      return;
    }

    if (savedProducts.length === 0) {
      localStorage.removeItem(SAVED_PRODUCTS_STORAGE_KEY);
      return;
    }

    localStorage.setItem(SAVED_PRODUCTS_STORAGE_KEY, JSON.stringify(savedProducts));
  }, [hasLoadedLocalStorage, savedProducts]);

  function addSearchToHistory() {
    const newHistoryItem: SearchHistoryItem = {
      category,
      budget,
      currency,
      country,
      priority,
      createdAt: new Date().toLocaleString(),
    };

    setSearchHistory((prev) => {
      const withoutDuplicate = prev.filter((item) => (
        item.category !== category ||
        item.budget !== budget ||
        item.currency !== currency ||
        item.country !== country ||
        item.priority !== priority
      ));

      return [newHistoryItem, ...withoutDuplicate].slice(0, 10);
    });
  }

  function handleSelectHistory(item: SearchHistoryItem) {
    const priorities = getPrioritiesForCategory(item.category);

    setCategory(item.category);
    setBudget(item.budget);
    setCurrency(item.currency);
    setCountry(item.country);
    setPriority(priorities.includes(item.priority) ? item.priority : priorities[0]);
  }

  function handleClearHistory() {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
  }

  function handleSaveProduct(product: Recommendation) {
    const savedProduct: SavedProduct = {
      ...product,
      savedAt: new Date().toLocaleString(),
    };

    setSavedProducts((prev) => {
      const withoutDuplicate = prev.filter((item) => item.name !== product.name);
      return [savedProduct, ...withoutDuplicate].slice(0, 20);
    });
  }

  function handleRemoveSaved(productName: string) {
    setSavedProducts((prev) => prev.filter((item) => item.name !== productName));
  }

  const handleSubmit = async () => {
    setSubmitted(true);
    setRecommendation("");
    setRecommendations([]);
    setSelectedProduct(null);
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
      setErrorMessage(getCleanErrorMessage(data.error));
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

      recs = recs.map((r: unknown, index) => {
        const rr = r as {
          name?: string;
          price?: string;
          reason?: string;
          pros?: unknown;
          cons?: unknown;
          merchants?: unknown;
          rating?: unknown;
          score?: unknown;
        };

        const item: RecommendationItem = {
          name: rr.name || "",
          price: rr.price || "",
          reason: rr.reason || "",
          pros: Array.isArray(rr.pros) ? (rr.pros as string[]) : [],
          cons: Array.isArray(rr.cons) ? (rr.cons as string[]) : [],
          merchants: Array.isArray(rr.merchants)
            ? rr.merchants.filter(isMerchant)
            : [],
          rating: typeof rr.rating === "number" ? rr.rating : getDefaultRating(index),
          score: typeof rr.score === "number" ? rr.score : getDefaultScore(index),
        };

        if (!item.merchants || item.merchants.length === 0) {
          const encoded = encodeURIComponent(item.name);
          const amazonUrl = addAmazonAffiliate(
            `https://www.amazon.com/s?k=${encoded}`
          );
          const amazonIndiaUrl = addAmazonAffiliate(
            `https://www.amazon.in/s?k=${encoded}`
          );

          if (country === "India" || country === "IN") {
            item.merchants = [
              { name: "Amazon India", url: amazonIndiaUrl },
              { name: "Flipkart", url: `https://www.flipkart.com/search?q=${encoded}` },
              { name: "Croma", url: `https://www.croma.com/searchB?q=${encoded}` },
            ];
          } else {
            item.merchants = [
              { name: "Amazon", url: amazonUrl },
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
        addSearchToHistory();
      } else {
        setRecommendations([]);
        setRecommendation(data.result || "No recommendation available");
        setParseFailed(false);
      }
    } catch {
      setParseFailed(true);
      setRecommendations([]);
      setRecommendation(data.result || "No recommendation available");
    }
  };

  const normalizedRecommendations = recommendations.map((item, index) => ({
    ...item,
    rating: item.rating ?? getDefaultRating(index),
    score: item.score ?? getDefaultScore(index),
  }));

  const bestValueProductName = normalizedRecommendations.reduce<string>((bestName, item, index) => {
    if (index === 0) {
      return item.name;
    }

    const currentPrice = extractPrice(item.price);
    const bestProduct = normalizedRecommendations.find((product) => product.name === bestName);
    const bestPrice = bestProduct ? extractPrice(bestProduct.price) : 0;

    if (currentPrice === 0 && bestPrice === 0) {
      return bestName;
    }

    if (bestPrice === 0) {
      return item.name;
    }

    if (currentPrice > 0 && currentPrice < bestPrice) {
      return item.name;
    }

    return bestName;
  }, "");

  let displayedRecommendations = [...normalizedRecommendations];

  if (showBestValueOnly) {
    displayedRecommendations = displayedRecommendations.filter(
      (item) => item.name === bestValueProductName
    );
  }

  if (sortOption === "priceLowHigh") {
    displayedRecommendations.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
  } else if (sortOption === "priceHighLow") {
    displayedRecommendations.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
  } else if (sortOption === "ratingHighLow") {
    displayedRecommendations.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (sortOption === "scoreHighLow") {
    displayedRecommendations.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  const priorityOptions = getPrioritiesForCategory(category);

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={pageStyle}
    >
      <div
        className="p-8 rounded-lg w-full max-w-6xl"
        style={appCardStyle}
      >
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6" style={headingStyle}>
            BuySmart AI
          </h1>

          <div className="space-y-4">

            <div style={formGroupStyle}>
              <label className="block mb-1 font-medium" style={labelStyle}>
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  const selectedCategory = e.target.value;
                  setCategory(selectedCategory);
                  setPriority(getPrioritiesForCategory(selectedCategory)[0]);
                }}
                style={fieldStyle}
              >
                {productCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div style={formGroupStyle}>
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

            <div style={formGroupStyle}>
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

            <div style={formGroupStyle}>
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

            <div style={formGroupStyle}>
              <label className="block mb-1 font-medium" style={labelStyle}>
                Shopping Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={fieldStyle}
              >
                {priorityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <p className="mt-1" style={{ fontSize: "12px", color: "#4b5563" }}>
                Priority options change based on selected category.
              </p>
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
        </div>

        {normalizedRecommendations.length > 0 ? (
          <div className="mt-6 border-t pt-4" style={{ borderColor: "#d1d5db" }}>
            <ProductControls
              sortOption={sortOption}
              onSortChange={setSortOption}
              showBestValueOnly={showBestValueOnly}
              onBestValueOnlyChange={setShowBestValueOnly}
            />

            <h2 className="font-bold mb-2" style={headingStyle}>AI Recommendation</h2>

            {displayedRecommendations.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                style={recommendationCardStyle}
              >
                {item.name === bestValueProductName && (
                  <span className="buysmart-badge">
                    🏆 Best Value
                  </span>
                )}

                <h3 className="text-lg font-semibold" style={headingStyle}>{index + 1}. {item.name}</h3>

                <p className="mt-2" style={normalTextStyle}><strong>Price:</strong> {item.price}</p>
                <div className="mt-2">
                  <ProductRating rating={item.rating} />
                </div>
                <ProductScore score={item.score} />
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

                <div className="mt-4">
                  <p className="font-semibold mb-2">Buy Links:</p>

                  <div className="flex flex-wrap gap-3">
                    {item.merchants?.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={addAmazonAffiliate(link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Buy on {link.name || "Amazon"}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    style={viewDetailsButtonStyle}
                    onClick={() => setSelectedProduct(item)}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    className="buysmart-button-success"
                    onClick={() => handleSaveProduct(item)}
                  >
                    Save Product
                  </button>
                </div>
              </div>
            ))}

            {normalizedRecommendations.length === 3 && (
              <ProductComparison products={normalizedRecommendations} />
            )}
          </div>
        ) : recommendation && parseFailed ? (
          <div className="mt-6 border-t pt-4" style={{ borderColor: "#d1d5db" }}>
            <h2 className="font-bold mb-2" style={headingStyle}>AI Recommendation</h2>
            <p style={normalTextStyle}>Unable to display recommendation.</p>
          </div>
        ) : null}

        <SearchHistory
          history={searchHistory}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
        />

        <SavedRecommendations
          savedProducts={savedProducts}
          onRemoveSaved={handleRemoveSaved}
        />

        {errorMessage && (
          <div className="mt-6 border-t pt-4" style={{ borderColor: "#d1d5db", color: "#991b1b" }}>
            <h2 className="font-bold mb-2" style={{ color: "#991b1b" }}>Error</h2>
            <p>{errorMessage}</p>
            <p className="mt-2" style={{ color: "#4b5563" }}>
              Try again in 30 seconds.
            </p>
          </div>
        )}
      </div>
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
