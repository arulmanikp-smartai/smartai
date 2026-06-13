import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      hasKey: false,
      keyLength: 0,
      looksValid: false,
      warning: "OPENROUTER_API_KEY is not configured in .env.local.",
    });
  }

  const keyLength = apiKey.length;
  const looksPlaceholder =
    apiKey.includes("...") ||
    apiKey.startsWith("sk-or-") && keyLength < 45 ||
    apiKey.toLowerCase().includes("placeholder");

  return NextResponse.json({
    hasKey: true,
    keyLength,
    looksValid: !looksPlaceholder,
    looksPlaceholder,
    warning: looksPlaceholder
      ? "The API key looks like a placeholder or invalid secret. Replace it with a real OpenRouter key."
      : undefined,
  });
}
