export const AMAZON_ASSOCIATE_TAG = "buysmartai0d-20";

export function addAmazonAffiliate(url: string): string {
  if (!url) return url;

  const isAmazonUrl =
    url.includes("amazon.com") ||
    url.includes("amazon.in");

  if (!isAmazonUrl) return url;

  const urlWithoutOldTag = url
    .replace(/([?&])tag=[^&]+/g, "")
    .replace(/[?&]$/, "");

  const separator = urlWithoutOldTag.includes("?") ? "&" : "?";

  return `${urlWithoutOldTag}${separator}tag=${AMAZON_ASSOCIATE_TAG}`;
}
