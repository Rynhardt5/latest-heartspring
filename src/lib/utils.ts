import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// write a function that takes in a name or full name and returns initials
export function getInitials(name: string) {
  const names = name.split(" ");
  const initials = names.map((name) => name[0]);
  return initials.join("");
}

// write a function that takes in a name or full name and capitalizes it
export function autoCapitalize(name: string) {
  const names = name.split(" ");
  const capitalizedNames = names.map((name) => {
    if (name) {
      return name[0]?.toUpperCase() + name.slice(1);
    }
    return "";
  });
  return capitalizedNames.join(" ");
}

export const AUDollar = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});
