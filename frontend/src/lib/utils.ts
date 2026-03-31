import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return '-';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getStockStatus(stock: number, minStock: number): 'low' | 'ok' | 'out' {
  if (stock === 0) return 'out';
  if (stock < minStock) return 'low';
  return 'ok';
}
