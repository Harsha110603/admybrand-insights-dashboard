import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Used for conditional Tailwind class merging (used in shadcn/ui components)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Formats a number to currency
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return value.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ✅ Adds commas to numbers
export function formatNumber(value: number, locale: string = "en-US"): string {
  return value.toLocaleString(locale);
}

// ✅ Capitalizes the first letter of a string
export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
