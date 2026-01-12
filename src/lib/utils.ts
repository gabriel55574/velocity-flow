import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatCompactValue(value: number, divisor: number, suffix: string, maximumFractionDigits: number) {
  const raw = value / divisor;
  const formatted = raw.toFixed(maximumFractionDigits).replace(".", ",");
  return `${formatted.replace(/,0$/, "")}${suffix}`;
}

export function formatCompactNumber(value: number, maximumFractionDigits = 1) {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return formatCompactValue(value, 1_000_000_000, "B", maximumFractionDigits);
  }
  if (abs >= 1_000_000) {
    return formatCompactValue(value, 1_000_000, "M", maximumFractionDigits);
  }
  if (abs >= 1_000) {
    return formatCompactValue(value, 1_000, "K", maximumFractionDigits);
  }

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number, maximumFractionDigits = 1) {
  if (Math.abs(value) < 1_000) {
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `R$ ${formatCompactNumber(value, maximumFractionDigits)}`;
}
