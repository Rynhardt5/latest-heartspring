import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function autoCapitalize(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}
