import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import { shoesApi, dashboardApi, categoriesApi, brandsApi, suppliersApi, locationsApi, colorsApi, materialsApi, sizesApi, seasonsApi, gendersApi, salesApi } from '../api'
import type { ShoeFilters, CreateShoeDTO, UpdateShoeDTO } from '@/types'

// ============ SHOES ============

export function useShoes(filters: any = {}, page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.shoes(filters),
    queryFn: () => shoesApi.list(filters, page, limit),
  })
}

export function useShoe(id: string) {
  return useQuery({
    queryKey: queryKeys.shoe(id),
    queryFn: () => shoesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateShoe() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateShoeDTO) => shoesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoes'] })
    },
  })
}

export function useUpdateShoe() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShoeDTO }) => 
      shoesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['shoes'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.shoe(id) })
    },
  })
}

export function useDeleteShoe() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => shoesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoes'] })
    },
  })
}

// ============ DASHBOARD ============

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: () => dashboardApi.getSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useLowStock() {
  return useQuery({
    queryKey: queryKeys.dashboardLowStock,
    queryFn: () => dashboardApi.getLowStock(),
    staleTime: 1000 * 60 * 5,
  })
}

// ============ FINANCE ============

export function useFinanceKPIs(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['finance', 'kpis', startDate, endDate],
    queryFn: () => dashboardApi.getFinanceKPIs(startDate, endDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useFinanceAnalysis(fixedCosts: number = 0, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['finance', 'analysis', fixedCosts, startDate, endDate],
    queryFn: () => dashboardApi.getFinanceAnalysis(fixedCosts, startDate, endDate),
    staleTime: 1000 * 60 * 5,
  })
}

export function useBreakEven(fixedCosts: number) {
  return useQuery({
    queryKey: ['finance', 'break-even', fixedCosts],
    queryFn: () => dashboardApi.getBreakEven(fixedCosts),
    staleTime: 1000 * 60 * 5,
    enabled: fixedCosts > 0,
  })
}

export function useCashFlow(months: number = 6, fixedCostsMonthly: number = 0) {
  return useQuery({
    queryKey: ['finance', 'cash-flow', months, fixedCostsMonthly],
    queryFn: () => dashboardApi.getCashFlow(months, fixedCostsMonthly),
    staleTime: 1000 * 60 * 5,
  })
}

export function useSalesChart(months: number = 12) {
  return useQuery({
    queryKey: ['finance', 'sales-chart', months],
    queryFn: () => dashboardApi.getSalesChart(months),
    staleTime: 1000 * 60 * 5,
  })
}

export function useTopProducts(limit: number = 5) {
  return useQuery({
    queryKey: ['finance', 'top-products', limit],
    queryFn: () => dashboardApi.getTopProducts(limit),
    staleTime: 1000 * 60 * 5,
  })
}

// ============ SETTINGS ============

export function useSetting(settingId: string) {
  return useQuery({
    queryKey: ['settings', settingId],
    queryFn: () => dashboardApi.getSetting(settingId),
    staleTime: 1000 * 60 * 30, // Settings rarely change
  })
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ settingId, value }: { settingId: string; value: string }) => 
      dashboardApi.updateSetting(settingId, value),
    onSuccess: (_, { settingId }) => {
      queryClient.invalidateQueries({ queryKey: ['settings', settingId] })
    },
  })
}

// ============ CATALOGS ============

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesApi.list(),
    staleTime: 1000 * 60 * 30, // 30 minutes - rarely change
  })
}

export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands,
    queryFn: () => brandsApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useSuppliers() {
  return useQuery({
    queryKey: queryKeys.suppliers,
    queryFn: () => suppliersApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useLocations() {
  return useQuery({
    queryKey: queryKeys.locations,
    queryFn: () => locationsApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useColors() {
  return useQuery({
    queryKey: queryKeys.colors,
    queryFn: () => colorsApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useMaterials() {
  return useQuery({
    queryKey: queryKeys.materials,
    queryFn: () => materialsApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useSizes() {
  return useQuery({
    queryKey: queryKeys.sizes,
    queryFn: () => sizesApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useSeasons() {
  return useQuery({
    queryKey: queryKeys.seasons,
    queryFn: () => seasonsApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useGenders() {
  return useQuery({
    queryKey: queryKeys.genders,
    queryFn: () => gendersApi.list(),
    staleTime: 1000 * 60 * 30,
  })
}

// ============ SALES ============

export function useShoesWithStock() {
  return useQuery({
    queryKey: queryKeys.shoesWithStock,
    queryFn: async () => {
      const response = await shoesApi.list({}, 1, 100)
      return response.data.filter((shoe: any) => (shoe.stock || 0) > 0)
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - stock changes more often
  })
}

export function useSaleBatches(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.saleBatches(page, limit),
    queryFn: () => salesApi.listBatches(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useRegisterSaleBatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { items: any[]; notes?: string }) => salesApi.registerBatch(data),
    onSuccess: () => {
      // Invalidate shoe cache to refresh stock
      queryClient.invalidateQueries({ queryKey: ['shoes'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.saleBatches() })
    },
  })
}

export function useDeleteSaleBatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (batchId: string) => salesApi.deleteBatch(batchId),
    onSuccess: () => {
      // Invalidate sale batches cache to refresh list
      queryClient.invalidateQueries({ queryKey: queryKeys.saleBatches() })
      // Also invalidate shoes cache to refresh stock
      queryClient.invalidateQueries({ queryKey: ['shoes'] })
    },
  })
}

// Pre-fetch helper for catalogs
export function usePrefetchCatalogs() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories,
      queryFn: () => categoriesApi.list(),
    })
    queryClient.prefetchQuery({
      queryKey: queryKeys.brands,
      queryFn: () => brandsApi.list(),
    })
    queryClient.prefetchQuery({
      queryKey: queryKeys.sizes,
      queryFn: () => sizesApi.list(),
    })
  }
}