"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { categoriesApi, brandsApi, gendersApi, colorsApi, materialsApi } from "@/lib/api"
import type { Category, Brand, Gender, Color, Material, ShoeFilters } from "@/types"

interface ShoeFiltersProps {
  filters: ShoeFilters
  onFiltersChange: (filters: ShoeFilters) => void
}

export function ShoeFilters({ filters, onFiltersChange }: ShoeFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [genders, setGenders] = useState<Gender[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    Promise.all([
      categoriesApi.list(),
      brandsApi.list(),
      gendersApi.list(),
      colorsApi.list(),
      materialsApi.list(),
    ]).then(([cats, brds, gnds, clrs, mtrls]) => {
      setCategories(cats)
      setBrands(brds)
      setGenders(gnds)
      setColors(clrs)
      setMaterials(mtrls)
    })
  }, [])

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  const clearFilter = (key: keyof ShoeFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Buscar por nombre, SKU o referencia..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-11 h-11 bg-secondary/30 border-border/50 focus:bg-secondary/50 input-luxury rounded-lg"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-11 w-11 rounded-lg border-border/50 hover:bg-secondary/80 ${showFilters ? 'bg-secondary' : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="animate-scale-in">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-5 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-border/30">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</label>
              <Select 
                value={filters.category_id || ""} 
                onValueChange={(v) => onFiltersChange({ ...filters, category_id: v || undefined })}
              >
                <SelectTrigger className="h-10 bg-card/50 border-border/50 rounded-lg">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Marca</label>
              <Select 
                value={filters.brand_id || ""} 
                onValueChange={(v) => onFiltersChange({ ...filters, brand_id: v || undefined })}
              >
                <SelectTrigger className="h-10 bg-card/50 border-border/50 rounded-lg">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Género</label>
              <Select 
                value={filters.gender_id || ""} 
                onValueChange={(v) => onFiltersChange({ ...filters, gender_id: v || undefined })}
              >
                <SelectTrigger className="h-10 bg-card/50 border-border/50 rounded-lg">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender.id} value={gender.id}>{gender.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color</label>
              <Select 
                value={filters.color_id || ""} 
                onValueChange={(v) => onFiltersChange({ ...filters, color_id: v || undefined })}
              >
                <SelectTrigger className="h-10 bg-card/50 border-border/50 rounded-lg">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Material */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Material</label>
              <Select 
                value={filters.material_id || ""} 
                onValueChange={(v) => onFiltersChange({ ...filters, material_id: v || undefined })}
              >
                <SelectTrigger className="h-10 bg-card/50 border-border/50 rounded-lg">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>{material.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null
            const labelMap: Record<string, string> = {
              search: 'Búsqueda',
              category_id: 'Categoría',
              brand_id: 'Marca',
              gender_id: 'Género',
              color_id: 'Color',
              material_id: 'Material',
            }
            return (
              <Badge 
                key={key} 
                variant="secondary" 
                className="cursor-pointer gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors"
                onClick={() => clearFilter(key as keyof ShoeFilters)}
              >
                {labelMap[key] || key}: {value}
                <X className="h-3 w-3" />
              </Badge>
            )
          })}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpiar todo
          </Button>
        </div>
      )}
    </div>
  )
}
