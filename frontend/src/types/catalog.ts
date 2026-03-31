export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  created_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Color {
  id: string;
  name: string;
  hex_code?: string;
  created_at?: string;
}

export interface Material {
  id: string;
  name: string;
  created_at?: string;
}

export interface Size {
  id: string;
  number: number;
  created_at?: string;
}

export interface Season {
  id: string;
  name: string;
  created_at?: string;
}

export interface Gender {
  id: string;
  name: string;
  created_at?: string;
}
