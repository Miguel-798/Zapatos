"use client"
import { ShoeCard } from "./shoe-card"
import type { ShoeDetail } from "@/types"
import { Package } from "lucide-react"

interface ShoeGridProps {
  shoes: ShoeDetail[]
  onShoeClick?: (shoe: ShoeDetail) => void
}

export function ShoeGrid({ shoes, onShoeClick }: ShoeGridProps) {
  if (shoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No se encontraron productos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {shoes.map((shoe, idx) => (
        <div 
          key={shoe.id}
          className={`stagger-${Math.min(idx + 1, 8)} opacity-0 animate-fade-in-up`}
        >
          <ShoeCard 
            shoe={shoe} 
            onClick={() => onShoeClick?.(shoe)}
          />
        </div>
      ))}
    </div>
  )
}
