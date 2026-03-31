"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Sparkles, Factory } from "lucide-react"
import { brandsApi } from "@/lib/api"
import type { Brand } from "@/types"

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [newBrand, setNewBrand] = useState("")
  const [newLogoUrl, setNewLogoUrl] = useState("")

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = () => {
    brandsApi.list().then((data) => {
      setBrands(data)
      setLoading(false)
    })
  }

  const handleCreate = async () => {
    if (!newBrand.trim()) return
    
    await brandsApi.create({ name: newBrand, logo_url: newLogoUrl || undefined })
    
    setNewBrand("")
    setNewLogoUrl("")
    loadBrands()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta marca?')) return
    await brandsApi.delete(id)
    loadBrands()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Catálogos</span>
        </div>
        <h1 className="text-4xl font-serif text-foreground">Marcas</h1>
        <p className="text-muted-foreground mt-1">Gestiona las marcas de tus productos</p>
      </div>

      {/* Create Form */}
      <Card className="border-border/50 card-luxury animate-fade-in-up stagger-1 opacity-0">
        <div className="p-6 border-b border-border/30">
          <h2 className="text-lg font-serif">Nueva Marca</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <Input 
              placeholder="Nombre de la marca"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className="max-w-xs h-11 bg-secondary/30 border-border/50 rounded-lg input-luxury"
            />
            <Input 
              placeholder="URL del logo (opcional)"
              value={newLogoUrl}
              onChange={(e) => setNewLogoUrl(e.target.value)}
              className="max-w-xs h-11 bg-secondary/30 border-border/50 rounded-lg input-luxury"
            />
            <Button 
              onClick={handleCreate}
              className="btn-luxury gap-2 h-11 px-5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            >
              <Plus className="w-4 h-4" />
              Crear
            </Button>
          </div>
        </div>
      </Card>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : brands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand, idx) => (
            <Card 
              key={brand.id}
              className={`border-border/50 card-luxury stagger-${Math.min(idx + 2, 8)} opacity-0 animate-fade-in-up`}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Factory className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-lg">{brand.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleDelete(brand.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Factory className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No hay marcas. ¡Crea la primera!</p>
        </div>
      )}
    </div>
  )
}
