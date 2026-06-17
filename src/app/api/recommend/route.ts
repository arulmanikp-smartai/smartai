import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey ?? "",
});

const GEMINI_BUSY_ERROR =
  "Gemini is temporarily busy. Please wait a few seconds and try again.";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

function getErrorStatus(error: unknown) {
  if (error && typeof error === "object") {
    const maybeStatus = error as {
      status?: unknown;
      statusCode?: unknown;
      code?: unknown;
    };

    if (typeof maybeStatus.status === "number") {
      return maybeStatus.status;
    }

    if (typeof maybeStatus.statusCode === "number") {
      return maybeStatus.statusCode;
    }

    if (typeof maybeStatus.code === "number") {
      return maybeStatus.code;
    }
  }

  return undefined;
}

function isGeminiBusyError(error: unknown) {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error).toLowerCase();

  return (
    status === 503 ||
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("unavailable") ||
    message.includes("temporarily unavailable")
  );
}

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env.local." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { category, budget, currency, country, priority } = body ?? {};

    if (!category || !budget || !currency || !country || !priority) {
      return NextResponse.json(
        { error: "Missing required fields: category, budget, currency, country, priority." },
        { status: 400 }
      );
    }

    const prompt = `
You are BuySmart AI, a shopping recommendation assistant.

User selected:
- Category: ${category}
- Budget: ${budget} ${currency}
- Country: ${country}
- Priority: ${priority}

Recommend exactly 3 real products that match the selected category, budget, country, and priority.

Rules:
- Products must be relevant to the selected category.
- Respect the selected country.
- Respect the selected budget.
- Focus strongly on the selected priority.
- Use realistic current market prices.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.
- Do not wrap response in \`\`\`json.

Return exactly this JSON structure:

{
  "recommendations": [
    {
      "name": "Product name",
      "price": "Price with currency",
      "reason": "Short reason focused on the selected priority",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "merchants": [],
      "rating": 4,
      "score": 90
    },
    {
      "name": "Product name",
      "price": "Price with currency",
      "reason": "Short reason focused on the selected priority",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "merchants": [],
      "rating": 4,
      "score": 88
    },
    {
      "name": "Product name",
      "price": "Price with currency",
      "reason": "Short reason focused on the selected priority",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "merchants": [],
      "rating": 4,
      "score": 85
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      result: response.text,
    });
  } catch (error) {
    if (isGeminiBusyError(error)) {
      return NextResponse.json(
        { error: GEMINI_BUSY_ERROR },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Unable to generate recommendation. Please try again." },
      { status: 500 }
    );
  }
}
