import type { 
  Shoe, ShoeDetail, CreateShoeDTO, UpdateShoeDTO, ShoeFilters, ShoeListResponse,
  Category, Brand, Supplier, Location, Color, Material, Size, Season, Gender,
  DashboardSummary, LowStockShoe,
  SaleWithDetails, CreateSaleDTO
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Shoes API
export const shoesApi = {
  list: async (filters: ShoeFilters = {}, page = 1, limit = 20): Promise<ShoeListResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    params.append('page', String(page));
    params.append('limit', String(limit));
    
    const response = await fetch(`${API_URL}/api/shoes?${params}`);
    return response.json();
  },
  
  getById: async (id: string): Promise<ShoeDetail> => {
    const response = await fetch(`${API_URL}/api/shoes/${id}`);
    return response.json();
  },
  
  create: async (dto: CreateShoeDTO): Promise<ShoeDetail> => {
    const response = await fetch(`${API_URL}/api/shoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return response.json();
  },
  
  update: async (id: string, dto: UpdateShoeDTO): Promise<ShoeDetail> => {
    const response = await fetch(`${API_URL}/api/shoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/shoes/${id}`, { method: 'DELETE' });
  },
};

// Dashboard API
export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await fetch(`${API_URL}/api/dashboard/summary`);
    return response.json();
  },
  
  getLowStock: async (): Promise<LowStockShoe[]> => {
    const response = await fetch(`${API_URL}/api/dashboard/low-stock`);
    return response.json();
  },
};

// Categories API
export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/api/categories`);
    return response.json();
  },
  create: async (data: { name: string; description?: string }): Promise<Category> => {
    const response = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string; description?: string }): Promise<Category> => {
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/categories/${id}`, { method: 'DELETE' });
  },
};

// Brands API
export const brandsApi = {
  list: async (): Promise<Brand[]> => {
    const response = await fetch(`${API_URL}/api/brands`);
    return response.json();
  },
  create: async (data: { name: string; logo_url?: string }): Promise<Brand> => {
    const response = await fetch(`${API_URL}/api/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string; logo_url?: string }): Promise<Brand> => {
    const response = await fetch(`${API_URL}/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/brands/${id}`, { method: 'DELETE' });
  },
};

// Suppliers API
export const suppliersApi = {
  list: async (): Promise<Supplier[]> => {
    const response = await fetch(`${API_URL}/api/suppliers`);
    return response.json();
  },
  create: async (data: { name: string; contact_name?: string; phone?: string; email?: string }): Promise<Supplier> => {
    const response = await fetch(`${API_URL}/api/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string; contact_name?: string; phone?: string; email?: string }): Promise<Supplier> => {
    const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/suppliers/${id}`, { method: 'DELETE' });
  },
};

// Locations API
export const locationsApi = {
  list: async (): Promise<Location[]> => {
    const response = await fetch(`${API_URL}/api/locations`);
    return response.json();
  },
  create: async (data: { name: string; description?: string }): Promise<Location> => {
    const response = await fetch(`${API_URL}/api/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string; description?: string }): Promise<Location> => {
    const response = await fetch(`${API_URL}/api/locations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/locations/${id}`, { method: 'DELETE' });
  },
};

// Colors API
export const colorsApi = {
  list: async (): Promise<Color[]> => {
    const response = await fetch(`${API_URL}/api/colors`);
    return response.json();
  },
  create: async (data: { name: string; hex_code?: string }): Promise<Color> => {
    const response = await fetch(`${API_URL}/api/colors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string; hex_code?: string }): Promise<Color> => {
    const response = await fetch(`${API_URL}/api/colors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/colors/${id}`, { method: 'DELETE' });
  },
};

// Materials API
export const materialsApi = {
  list: async (): Promise<Material[]> => {
    const response = await fetch(`${API_URL}/api/materials`);
    return response.json();
  },
  create: async (data: { name: string }): Promise<Material> => {
    const response = await fetch(`${API_URL}/api/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string }): Promise<Material> => {
    const response = await fetch(`${API_URL}/api/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/materials/${id}`, { method: 'DELETE' });
  },
};

// Sizes API
export const sizesApi = {
  list: async (): Promise<Size[]> => {
    const response = await fetch(`${API_URL}/api/sizes`);
    return response.json();
  },
  create: async (data: { number: number }): Promise<Size> => {
    const response = await fetch(`${API_URL}/api/sizes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { number?: number }): Promise<Size> => {
    const response = await fetch(`${API_URL}/api/sizes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/sizes/${id}`, { method: 'DELETE' });
  },
};

// Seasons API
export const seasonsApi = {
  list: async (): Promise<Season[]> => {
    const response = await fetch(`${API_URL}/api/seasons`);
    return response.json();
  },
  create: async (data: { name: string }): Promise<Season> => {
    const response = await fetch(`${API_URL}/api/seasons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string }): Promise<Season> => {
    const response = await fetch(`${API_URL}/api/seasons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/seasons/${id}`, { method: 'DELETE' });
  },
};

// Genders API
export const gendersApi = {
  list: async (): Promise<Gender[]> => {
    const response = await fetch(`${API_URL}/api/genders`);
    return response.json();
  },
  create: async (data: { name: string }): Promise<Gender> => {
    const response = await fetch(`${API_URL}/api/genders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  update: async (id: string, data: { name?: string }): Promise<Gender> => {
    const response = await fetch(`${API_URL}/api/genders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/api/genders/${id}`, { method: 'DELETE' });
  },
};

// Sales API
export const salesApi = {
  list: async (page: number = 1, limit: number = 20): Promise<{ data: SaleWithDetails[]; total: number; page: number; limit: number }> => {
    const response = await fetch(`${API_URL}/api/sales?page=${page}&limit=${limit}`);
    return response.json();
  },
  
  listBatches: async (page: number = 1, limit: number = 20): Promise<{ data: any[]; total: number; page: number; limit: number }> => {
    const response = await fetch(`${API_URL}/api/sales/batches?page=${page}&limit=${limit}`);
    return response.json();
  },
  
  registerBatch: async (dto: { items: any[]; notes?: string }): Promise<any> => {
    const response = await fetch(`${API_URL}/api/sales/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error registering sale');
    }
    return response.json();
  },
  
  register: async (dto: CreateSaleDTO): Promise<SaleWithDetails> => {
    const response = await fetch(`${API_URL}/api/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error registering sale');
    }
    return response.json();
  },
};
