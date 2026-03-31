-- =============================================================================
-- Schema de Base de Datos para Inventario de Zapatos (Supabase)
-- =============================================================================
-- Este script crea todas las tablas, índices y datos iniciales necesarios
-- para el sistema de inventario de zapatos.
-- =============================================================================

-- =============================================================================
-- SECCIÓN 1: TABLAS BASE (CATÁLOGOS)
-- =============================================================================

-- Tabla de categorías de zapatos
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de marcas
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proveedores
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ubicaciones en el almacén
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de colores
CREATE TABLE colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    hex_code VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de materiales
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tallas europeas
CREATE TABLE sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de temporadas
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de géneros
CREATE TABLE genders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SECCIÓN 2: TABLA PRINCIPAL DE ZAPATOS
-- =============================================================================

CREATE TABLE shoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    gender_id UUID REFERENCES genders(id),
    supplier_id UUID REFERENCES suppliers(id),
    location_id UUID REFERENCES locations(id),
    season_id UUID REFERENCES seasons(id),
    image_url TEXT,
    min_stock INTEGER DEFAULT 5,
    price_cost DECIMAL(10, 2),
    price_sale DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SECCIÓN 3: TABLAS PIVOT (RELACIONES MUCHOS A MUCHOS)
-- =============================================================================

-- Relación zapatos-colores
CREATE TABLE shoe_colors (
    shoe_id UUID REFERENCES shoes(id) ON DELETE CASCADE,
    color_id UUID REFERENCES colors(id),
    PRIMARY KEY (shoe_id, color_id)
);

-- Relación zapatos-materiales
CREATE TABLE shoe_materials (
    shoe_id UUID REFERENCES shoes(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    PRIMARY KEY (shoe_id, material_id)
);

-- Relación zapatos-tallas con inventario (stock por talla)
CREATE TABLE shoe_sizes (
    shoe_id UUID REFERENCES shoes(id) ON DELETE CASCADE,
    size_id UUID REFERENCES sizes(id),
    stock_quantity INTEGER DEFAULT 0,
    PRIMARY KEY (shoe_id, size_id)
);

-- =============================================================================
-- SECCIÓN 4: ÍNDICES PARA OPTIMIZACIÓN
-- =============================================================================

-- Índices para búsquedas frecuentes en zapatos
CREATE INDEX idx_shoes_category ON shoes(category_id);
CREATE INDEX idx_shoes_brand ON shoes(brand_id);
CREATE INDEX idx_shoes_gender ON shoes(gender_id);
CREATE INDEX idx_shoes_sku ON shoes(sku);
CREATE INDEX idx_shoes_active ON shoes(is_active);
CREATE INDEX idx_shoes_supplier ON shoes(supplier_id);
CREATE INDEX idx_shoes_location ON shoes(location_id);

-- Índices para consultas de inventario
CREATE INDEX idx_shoe_sizes_stock ON shoe_sizes(stock_quantity);
CREATE INDEX idx_shoe_sizes_shoe ON shoe_sizes(shoe_id);
CREATE INDEX idx_shoe_sizes_size ON shoe_sizes(size_id);

-- =============================================================================
-- SECCIÓN 5: DATOS INICIALES (SEED DATA)
-- =============================================================================

-- Insertar géneros
INSERT INTO genders (name) VALUES 
  ('Hombre'), ('Mujer'), ('Niño'), ('Unisex');

-- Insertar tallas europeas
INSERT INTO sizes (number) VALUES 
  (35), (36), (37), (38), (39), (40), (41), (42), (43), (44), (45), (46);

-- Insertar categorías
INSERT INTO categories (name, description) VALUES 
  ('Zapatillas Deportivas', 'Zapatillas para ejercicio y uso casual'),
  ('Botas', 'Calzado que cubre el tobillo'),
  ('Sandalias', 'Calzado abierto'),
  ('Tacones', 'Zapatos con tacón elevado'),
  ('Mocasines', 'Calzado formal casual'),
  ('Flip-flops', 'Sandalias de playa');

-- Insertar colores básicos
INSERT INTO colors (name, hex_code) VALUES 
  ('Negro', '#000000'), ('Blanco', '#FFFFFF'), ('Gris', '#808080'),
  ('Azul', '#0000FF'), ('Rojo', '#FF0000'), ('Marrón', '#8B4513'),
  ('Beige', '#F5F5DC'), ('Rosa', '#FFC0CB'), ('Verde', '#008000');

-- Insertar materiales
INSERT INTO materials (name) VALUES 
  ('Cuero'), ('Sintético'), ('Tela'), ('Gamuza'), ('Plástico'), ('Mixtos');

-- Insertar temporadas
INSERT INTO seasons (name) VALUES 
  ('Primavera'), ('Verano'), ('Otoño'), ('Invierno'), ('Todo el año');

-- Insertar ubicaciones de ejemplo
INSERT INTO locations (name, description) VALUES 
  ('Pasillo A - Estante 1', 'Entrada principal'),
  ('Pasillo A - Estante 2', 'Junto a probadores'),
  ('Pasillo B - Estante 1', 'Sección deportiva'),
  ('Pasillo B - Estante 2', 'Sección formal');

-- =============================================================================
-- FIN DEL SCHEMA
-- =============================================================================
