"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categoriesApi, brandsApi, gendersApi, colorsApi, materialsApi, suppliersApi, locationsApi, seasonsApi } from "@/lib/api"
import type { CreateShoeDTO, Category, Brand, Gender, Color, Material, Supplier, Location, Season } from "@/types"

interface ShoeFormProps {
  onSubmit: (data: CreateShoeDTO) => Promise<void>
}

export function ShoeForm({ onSubmit }: ShoeFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [genders, setGenders] = useState<Gender[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    brand_id: "",
    gender_id: "",
    supplier_id: "",
    location_id: "",
    season_id: "",
    image_url: "",
    stock: 0,
    min_stock: 5,
    price_cost: "",
    price_sale: "",
    color_ids: [] as string[],
    material_ids: [] as string[],
  })

  useEffect(() => {
    Promise.all([
      categoriesApi.list(),
      brandsApi.list(),
      gendersApi.list(),
      colorsApi.list(),
      materialsApi.list(),
      suppliersApi.list(),
      locationsApi.list(),
      seasonsApi.list(),
    ]).then(([cats, brds, gnds, clrs, mtrls, supps, locs, seas]) => {
      setCategories(cats)
      setBrands(brds)
      setGenders(gnds)
      setColors(clrs)
      setMaterials(mtrls)
      setSuppliers(supps)
      setLocations(locs)
      setSeasons(seas)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const dto: CreateShoeDTO = {
      sku: formData.sku,
      name: formData.name,
      description: formData.description || undefined,
      category_id: formData.category_id || undefined,
      brand_id: formData.brand_id || undefined,
      gender_id: formData.gender_id || undefined,
      supplier_id: formData.supplier_id || undefined,
      location_id: formData.location_id || undefined,
      season_id: formData.season_id || undefined,
      image_url: formData.image_url || undefined,
      stock: formData.stock,
      min_stock: formData.min_stock,
      price_cost: formData.price_cost ? parseFloat(formData.price_cost) : undefined,
      price_sale: formData.price_sale ? parseFloat(formData.price_sale) : undefined,
      color_ids: formData.color_ids,
      material_ids: formData.material_ids,
    }
    
    await onSubmit(dto)
    setLoading(false)
  }

  const toggleArrayItem = (field: "color_ids" | "material_ids", id: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(id) 
        ? prev[field].filter(i => i !== id)
        : [...prev[field], id]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">SKU *</label>
            <Input 
              placeholder="DEP-NIKE-001"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value.toUpperCase()})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nombre *</label>
            <Input 
              placeholder="Nombre del modelo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Descripción</label>
            <Input 
              placeholder="Descripción del producto"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clasificación</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Categoría</label>
            <Select value={formData.category_id} onValueChange={(v) => setFormData({...formData, category_id: v})}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Marca</label>
            <Select value={formData.brand_id} onValueChange={(v) => setFormData({...formData, brand_id: v})}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Género</label>
            <Select value={formData.gender_id} onValueChange={(v) => setFormData({...formData, gender_id: v})}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {genders.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Proveedor</label>
            <Select value={formData.supplier_id} onValueChange={(v) => setFormData({...formData, supplier_id: v})}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Ubicación</label>
            <Select value={formData.location_id} onValueChange={(v) => setFormData({...formData, location_id: v})}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Temporada</label>
            <Select value={formData.season_id} onValueChange={(v) => setFormData({...formData, season_id: v})}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {seasons.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precios y Stock</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Precio Costo</label>
            <Input type="number" step="0.01" placeholder="0.00" value={formData.price_cost} onChange={(e) => setFormData({...formData, price_cost: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">Precio Venta</label>
            <Input type="number" step="0.01" placeholder="0.00" value={formData.price_sale} onChange={(e) => setFormData({...formData, price_sale: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">Stock</label>
            <Input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} />
          </div>
          <div>
            <label className="text-sm font-medium">Stock Mínimo</label>
            <Input type="number" min="0" value={formData.min_stock} onChange={(e) => setFormData({...formData, min_stock: parseInt(e.target.value)})} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colores y Materiales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Colores</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <Button
                  key={color.id}
                  type="button"
                  variant={formData.color_ids.includes(color.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayItem("color_ids", color.id)}
                >
                  {color.hex_code && (
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: color.hex_code }}
                    />
                  )}
                  {color.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Materiales</label>
            <div className="flex flex-wrap gap-2">
              {materials.map(material => (
                <Button
                  key={material.id}
                  type="button"
                  variant={formData.material_ids.includes(material.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayItem("material_ids", material.id)}
                >
                  {material.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Zapato"}
        </Button>
      </div>
    </form>
  )
}