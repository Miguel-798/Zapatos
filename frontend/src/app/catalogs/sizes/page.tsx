"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react"
import { sizesApi } from "@/lib/api"
import type { Size } from "@/types"

export default function SizesPage() {
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [newSizeNumber, setNewSizeNumber] = useState("")

  useEffect(() => {
    loadSizes()
  }, [])

  const loadSizes = () => {
    sizesApi.list().then((data) => {
      setSizes(data)
      setLoading(false)
    })
  }

  const handleCreate = async () => {
    if (!newSizeNumber.trim()) return
    
    await sizesApi.create({ number: parseInt(newSizeNumber) })
    
    setNewSizeNumber("")
    loadSizes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta talla?')) return
    await sizesApi.delete(id)
    loadSizes()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Catálogos</span>
        </div>
        <h1 className="text-4xl font-serif text-foreground">Tallas</h1>
        <p className="text-muted-foreground mt-1">Gestiona las tallas disponibles</p>
      </div>

      {/* Create Form */}
      <Card className="border-border/50 card-luxury animate-fade-in-up stagger-1 opacity-0">
        <div className="p-6 border-b border-border/30">
          <h2 className="text-lg font-serif">Nueva Talla</h2>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <Input 
              placeholder="Número de talla (ej: 42)"
              type="number"
              value={newSizeNumber}
              onChange={(e) => setNewSizeNumber(e.target.value)}
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
      ) : sizes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {sizes.map((size, idx) => (
            <Card 
              key={size.id}
              className={`border-border/50 card-luxury stagger-${Math.min(idx + 2, 8)} opacity-0 animate-fade-in-up`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">#{size.number}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => handleDelete(size.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No hay tallas. ¡Crea la primera!</p>
        </div>
      )}
    </div>
  )
}
