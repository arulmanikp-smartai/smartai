import { addAmazonAffiliate } from "./affiliateLinks";

describe("addAmazonAffiliate", () => {
  it("adds BuySmart AI tag to Amazon search URL", () => {
    const result = addAmazonAffiliate(
      "https://www.amazon.com/s?k=Acer%20Nitro%205"
    );

    expect(result).toContain("tag=buysmartai0d-20");
  });

  it("uses & when Amazon URL already has query params", () => {
    const result = addAmazonAffiliate(
      "https://www.amazon.com/s?k=Acer%20Nitro%205&ref=abc"
    );

    expect(result).toBe(
      "https://www.amazon.com/s?k=Acer%20Nitro%205&ref=abc&tag=buysmartai0d-20"
    );
  });

  it("replaces old Amazon tag", () => {
    const result = addAmazonAffiliate(
      "https://www.amazon.com/s?k=Acer&tag=oldtag-20"
    );

    expect(result).toBe(
      "https://www.amazon.com/s?k=Acer&tag=buysmartai0d-20"
    );
  });

  it("does not change non-Amazon links", () => {
    const result = addAmazonAffiliate("https://www.bestbuy.com/site/test");

    expect(result).toBe("https://www.bestbuy.com/site/test");
  });
});
