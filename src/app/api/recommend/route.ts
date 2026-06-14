import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey ?? "",
});

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
Return ONLY valid JSON. Do not include markdown. Do not include explanations. Do not wrap the JSON in code fences.

Return exactly this structure with three recommendations:

{
  "recommendations": [
    {
      "name": "Product name",
      "price": "Price with currency",
      "reason": "Short reason",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "merchants": []
    },
    {
      "name": "Product name",
      "price": "Price with currency",
      "reason": "Short reason",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "merchants": []
    },
    {
      "name": "Product name",
      "price": "Price with currency",
      "reason": "Short reason",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "merchants": []
    }
  ]
}

Provide recommendations for: ${category} under ${budget} ${currency} for country ${country}. Priority: ${priority}.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Debug details removed
    return NextResponse.json({
      result: response.text,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : String(error ?? "Unknown error");

    return NextResponse.json(
      { error: `Unable to generate recommendation: ${message}` },
      { status: 500 }
    );
  }
}
