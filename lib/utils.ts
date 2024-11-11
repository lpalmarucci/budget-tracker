import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, formatStr?: string) {
  return format(date, formatStr ?? "PPP", {
    locale: it,
  });
}

export function formatCurrency(value: string | number, currency?: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: currency ?? "EUR",
    currencyDisplay: "symbol",
    currencySign: "accounting",
  }).format(Number(value));
}
