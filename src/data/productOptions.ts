export const productCategories = [
  "Phone",
  "Laptop",
  "TV",
  "Refrigerator",
  "Washing Machine",
  "Microwave",
  "Air Conditioner",
  "Headphones",
  "Tablet",
  "Smartwatch",
];

export const categoryPriorities: Record<string, string[]> = {
  Phone: [
    "Best Camera",
    "Best Battery Life",
    "Best Performance",
    "Best Budget Phone",
    "Best Overall",
  ],
  Laptop: [
    "Best for Coding",
    "Best for Students",
    "Best Battery Life",
    "Best Performance",
    "Best Overall",
  ],
  TV: [
    "Best Picture Quality",
    "Best Smart TV",
    "Best Gaming TV",
    "Best Budget TV",
    "Best Overall",
  ],
  Refrigerator: [
    "Energy Efficient",
    "Best Capacity",
    "Best Warranty",
    "Best Value",
    "Best Overall",
  ],
  "Washing Machine": [
    "Energy Efficient",
    "Best Capacity",
    "Best Warranty",
    "Best Value",
    "Best Overall",
  ],
  Microwave: [
    "Best Value",
    "Best Capacity",
    "Best Warranty",
    "Compact Size",
    "Best Overall",
  ],
  "Air Conditioner": [
    "Energy Efficient",
    "Best Cooling",
    "Lowest Noise",
    "Best Warranty",
    "Best Overall",
  ],
  Headphones: [
    "Best Noise Cancellation",
    "Best Sound Quality",
    "Best Battery Life",
    "Best Value",
    "Best Overall",
  ],
  Tablet: [
    "Best for Students",
    "Best Battery Life",
    "Best Performance",
    "Best Value",
    "Best Overall",
  ],
  Smartwatch: [
    "Best Fitness Tracking",
    "Best Battery Life",
    "Best Display",
    "Best Value",
    "Best Overall",
  ],
};

export function getPrioritiesForCategory(category: string) {
  return categoryPriorities[category] || ["Best Overall"];
}
