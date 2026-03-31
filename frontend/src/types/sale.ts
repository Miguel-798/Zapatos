export interface Sale {
  id: string;
  shoe_id: string;
  size_id: string;
  quantity: number;
  sale_price: number;
  sale_date: string;
  created_at: string;
}

export interface SaleWithDetails {
  id: string;
  shoe_id: string;
  shoe_name: string;
  shoe_sku: string;
  size_id: string;
  size_number: number;
  quantity: number;
  sale_price: number;
  total: number;
  sale_date: string;
  created_at: string;
}

export interface CreateSaleDTO {
  shoe_id: string;
  size_id: string;
  quantity: number;
  sale_price: number;
}

export interface SaleBatchItem {
  shoe_id: string;
  shoe_name: string;
  shoe_sku: string;
  size_id: string;
  size_number: number;
  quantity: number;
  sale_price: number;
  subtotal: number;
}

export interface SaleBatch {
  batch_id: string;
  invoice_number: string;
  sale_date: string;
  total_amount: number;
  items: SaleBatchItem[];
}
