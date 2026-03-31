-- =====================================================
-- SALES BATCH MIGRATION (Invoice-like)
-- Run this SQL in Supabase SQL Editor
-- Currency: Colombian Pesos (COP) - Format: $X.XXX
-- Timezone: UTC-5 (America/Bogota)
-- =====================================================

-- Sale batches table (headers/invoices)
CREATE TABLE IF NOT EXISTS sale_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    total_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add batch_id to sales table (nullable for backward compatibility)
ALTER TABLE sales ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES sale_batches(id);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12, 2);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sale_batches_invoice ON sale_batches(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sale_batches_date ON sale_batches(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_batch ON sales(batch_id);

-- Enable row-level security (optional - uncomment if needed)
-- ALTER TABLE sale_batches ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
