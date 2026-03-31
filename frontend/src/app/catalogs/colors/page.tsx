"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Sparkles, Palette } from "lucide-react"
import { colorsApi } from "@/lib/api"
import type { Color } from "@/types"

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [newColor, setNewColor] = useState("")
  const [newHexCode, setNewHexCode] = useState("")

  useEffect(() => {
    loadColors()
  }, [])

  const loadColors = () => {
    colorsApi.list().then((data) => {
      setColors(data)
      setLoading(false)
    })
  }

  const handleCreate = async () => {
    if (!newColor.trim()) return
    
    await colorsApi.create({ name: newColor, hex_code: newHexCode || undefined })
    
    setNewColor("")
    setNewHexCode("")
    loadColors()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este color?')) return
    await colorsApi.delete(id)
    loadColors()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Catálogos</span>
        </div>
        <h1 className="text-4xl font-serif text-foreground">Colores</h1>
        <p className="text-muted-foreground mt-1">Gestiona los colores disponibles</p>
      </div>

      {/* Create Form */}
      <Card className="border-border/50 card-luxury animate-fade-in-up stagger-1 opacity-0">
        <div className="p-6 border-b border-border/30">
          <h2 className="text-lg font-serif">Nuevo Color</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <Input 
              placeholder="Nombre del color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="max-w-xs h-11 bg-secondary/30 border-border/50 rounded-lg input-luxury"
            />
            <Input 
              placeholder="Código hex (ej: #FF0000)"
              value={newHexCode}
              onChange={(e) => setNewHexCode(e.target.value)}
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
      ) : colors.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {colors.map((color, idx) => (
            <Card 
              key={color.id}
              className={`border-border/50 card-luxury stagger-${Math.min(idx + 2, 8)} opacity-0 animate-fade-in-up`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {color.hex_code && (
                      <div 
                        className="w-8 h-8 rounded-lg border shadow-sm"
                        style={{ backgroundColor: color.hex_code }}
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{color.name}</h3>
                      {color.hex_code && (
                        <p className="text-xs text-muted-foreground font-mono">{color.hex_code}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => handleDelete(color.id)}>
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
            <Palette className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No hay colores. ¡Crea el primero!</p>
        </div>
      )}
    </div>
  )
}
