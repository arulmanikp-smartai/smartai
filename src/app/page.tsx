"use client";

import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("Phone");
  const [budget, setBudget] = useState("");
  const [country, setCountry] = useState("USA");
  const [priority, setPriority] = useState("Best Value for Money");
  const [recommendation, setRecommendation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [debugMessage, setDebugMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitted(true);
    setRecommendation("");
    setErrorMessage("");
    setDebugMessage("");

    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        budget,
        country,
        priority,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      setErrorMessage(data.error || "Unknown error from API.");
      setDebugMessage(JSON.stringify(data.debug || data, null, 2));
      return;
    }

    setRecommendation(data.result || "No recommendation available");
    if (data.debug) {
      setDebugMessage(JSON.stringify(data.debug, null, 2));
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

        {recommendation && (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-bold mb-2">
              AI Recommendation
            </h2>

            <pre className="whitespace-pre-wrap">
              {recommendation}
            </pre>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 border-t pt-4 text-red-700">
            <h2 className="font-bold mb-2">Error</h2>
            <pre className="whitespace-pre-wrap">{errorMessage}</pre>
          </div>
        )}

        {debugMessage && (
          <div className="mt-6 border-t pt-4 text-sm text-slate-600">
            <h2 className="font-bold mb-2">Debug Details</h2>
            <pre className="whitespace-pre-wrap bg-slate-100 p-3 rounded">
              {debugMessage}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
