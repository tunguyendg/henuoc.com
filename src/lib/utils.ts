import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gộp className: clsx xử lý điều kiện, twMerge loại class Tailwind trùng (class sau thắng). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
