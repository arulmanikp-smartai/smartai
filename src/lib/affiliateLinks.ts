export function addAmazonAffiliate(url: string): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG;

  if (!url || !url.includes("amazon.")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}tag=${tag}`;
}
