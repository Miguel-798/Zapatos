import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - shoes/dashboard
      gcTime: 1000 * 60 * 30, // 30 minutes - garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Cache keys for API data
export const queryKeys = {
  // Shoes
  shoes: (filters?: Record<string, string>) => ['shoes', filters] as const,
  shoe: (id: string) => ['shoes', id] as const,
  
  // Dashboard
  dashboardSummary: ['dashboard', 'summary'] as const,
  dashboardLowStock: ['dashboard', 'low-stock'] as const,
  
  // Catalogs - longer cache (rarely change)
  categories: ['catalog', 'categories'] as const,
  brands: ['catalog', 'brands'] as const,
  suppliers: ['catalog', 'suppliers'] as const,
  locations: ['catalog', 'locations'] as const,
  colors: ['catalog', 'colors'] as const,
  materials: ['catalog', 'materials'] as const,
  sizes: ['catalog', 'sizes'] as const,
  seasons: ['catalog', 'seasons'] as const,
  genders: ['catalog', 'genders'] as const,
  
  // Sales
  sales: ['sales'] as const,
  saleBatches: ['sales', 'batches'] as const,
}