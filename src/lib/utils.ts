import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  options: {
    currency?: string;
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "USD", notation = "standard" } = options;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getDiscountPercentage(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function parseProductImages(images: string): string[] {
  try {
    return JSON.parse(images);
  } catch {
    return [images];
  }
}

export function parseProductSizes(sizes: string | null | undefined): string[] {
  if (!sizes) return [];
  try {
    return JSON.parse(sizes);
  } catch {
    return [];
  }
}

export function parseProductColors(colors: string | null | undefined): string[] {
  if (!colors) return [];
  try {
    return JSON.parse(colors);
  } catch {
    return [];
  }
}

export function calculateOrderTotal(
  subtotal: number,
  shippingCost: number = 0,
  taxRate: number = 0.08
) {
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;
  return {
    subtotal,
    shipping: shippingCost,
    tax,
    total,
  };
}

export function getShippingCost(subtotal: number): number {
  if (subtotal >= 50) return 0; // Free shipping over $50
  return 9.99;
}
