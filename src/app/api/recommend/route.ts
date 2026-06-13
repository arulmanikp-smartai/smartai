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
    const { category, budget, country, priority } = body ?? {};

    if (!category || !budget || !country || !priority) {
      return NextResponse.json(
        { error: "Missing required fields: category, budget, country, priority." },
        { status: 400 }
      );
    }

    const prompt = `
You are BuySmart AI.

Category: ${category}
Budget: ${budget}
Country: ${country}
Priority: ${priority}

Recommend the top 3 products.

For each product provide:
- Product Name
- Score out of 100
- Estimated Price
- Why it is recommended

Keep the answer concise.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log(response);
    console.log(response.text);

    return NextResponse.json({
      result: response.text,
      debug: {
        modelVersion: response.modelVersion,
        responseId: response.responseId,
      },
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    const debug = error && typeof error === "object" ? { ...error } : { error: message };

    return NextResponse.json(
      { error: `Unable to generate recommendation: ${message}`, debug },
      { status: 500 }
    );
  }
}
