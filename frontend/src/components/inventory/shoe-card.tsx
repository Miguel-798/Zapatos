"use client"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { formatCurrency, getStockStatus } from "@/lib/utils"
import { Package, ArrowUpRight } from "lucide-react"
import type { ShoeDetail } from "@/types"

interface ShoeCardProps {
  shoe: ShoeDetail
  onClick?: () => void
}

export function ShoeCard({ shoe, onClick }: ShoeCardProps) {
  const totalStock = shoe.sizes?.reduce((acc, s) => acc + s.stock_quantity, 0) || 0
  const stockStatus = getStockStatus(totalStock, shoe.min_stock)

  const statusConfig = {
    ok: { label: 'En Stock', class: 'badge-success' },
    low: { label: 'Stock Bajo', class: 'badge-warning' },
    out: { label: 'Sin Stock', class: 'badge-error' }
  }

  const status = statusConfig[stockStatus]

  return (
    <Card 
      className="group overflow-hidden cursor-pointer card-luxury border-border/50"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-secondary/50 to-secondary/30">
        {shoe.image_url ? (
          <Image 
            src={shoe.image_url} 
            alt={shoe.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge-luxury ${status.class} shadow-sm`}>
            {status.label}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
            <span className="text-white text-sm font-medium flex items-center gap-1">
              Ver detalles
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* SKU */}
        <p className="text-xs text-muted-foreground font-mono tracking-wider">{shoe.sku}</p>
        
        {/* Name & Brand */}
        <div>
          <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {shoe.name}
          </h3>
          {shoe.brand_name && (
            <p className="text-sm text-muted-foreground mt-0.5">{shoe.brand_name}</p>
          )}
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(shoe.price_sale)}
          </span>
          <div className="text-right">
            <span className="text-sm font-medium text-muted-foreground">
              {totalStock} unidades
            </span>
          </div>
        </div>

        {/* Sizes Preview */}
        {shoe.sizes && shoe.sizes.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2">
            <span className="text-xs text-muted-foreground">Tallas:</span>
            <div className="flex flex-wrap gap-1">
              {shoe.sizes.slice(0, 5).map((s) => (
                <span 
                  key={s.size_number}
                  className="text-xs px-2 py-0.5 bg-secondary rounded-md text-muted-foreground"
                >
                  {s.size_number}
                </span>
              ))}
              {shoe.sizes.length > 5 && (
                <span className="text-xs text-muted-foreground">+{shoe.sizes.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
