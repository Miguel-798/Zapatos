export interface DashboardSummary {
  total_products: number;
  low_stock_count: number;
  category_counts: { category_id: string; category_name: string; count: number }[];
  gender_counts: { gender_id: string; gender_name: string; count: number }[];
  recent_products: { id: string; name: string; sku: string; brand?: string; category?: string }[];
}

export interface LowStockShoe {
  id: string;
  sku: string;
  name: string;
  brand_name?: string;
  category_name?: string;
  total_stock: number;
  min_stock: number;
  sizes_low: { size_number: number; stock: number }[];
}
