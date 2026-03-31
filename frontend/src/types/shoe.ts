export interface Shoe {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category_id?: string;
  brand_id?: string;
  gender_id?: string;
  supplier_id?: string;
  location_id?: string;
  season_id?: string;
  image_url?: string;
  min_stock: number;
  price_cost?: number;
  price_sale?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShoeDetail extends Shoe {
  category_name?: string;
  brand_name?: string;
  gender_name?: string;
  supplier_name?: string;
  location_name?: string;
  season_name?: string;
  colors: string[];
  materials: string[];
  sizes?: { size_id?: string; size_number: number; stock_quantity: number }[];
}

export interface CreateShoeDTO {
  sku: string;
  name: string;
  description?: string;
  category_id?: string;
  brand_id?: string;
  gender_id?: string;
  supplier_id?: string;
  location_id?: string;
  season_id?: string;
  image_url?: string;
  min_stock?: number;
  price_cost?: number;
  price_sale?: number;
  color_ids: string[];
  material_ids: string[];
  sizes: { size_id: string; stock_quantity: number }[];
}

export interface UpdateShoeDTO {
  sku?: string;
  name?: string;
  description?: string;
  category_id?: string;
  brand_id?: string;
  gender_id?: string;
  supplier_id?: string;
  location_id?: string;
  season_id?: string;
  image_url?: string;
  min_stock?: number;
  price_cost?: number;
  price_sale?: number;
  is_active?: boolean;
  sizes?: { size_number: number; stock_quantity: number }[];
}

export interface ShoeFilters {
  category_id?: string;
  brand_id?: string;
  gender_id?: string;
  size_id?: string;
  color_id?: string;
  material_id?: string;
  supplier_id?: string;
  location_id?: string;
  season_id?: string;
  search?: string;
  low_stock?: boolean;
}

export interface ShoeListResponse {
  data: ShoeDetail[];
  total: number;
  page: number;
  limit: number;
}
