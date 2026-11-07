import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to 2-digit string
 */
export function formatTwoDigits(n: number): string {
  return n.toString().padStart(2, "0");
}

