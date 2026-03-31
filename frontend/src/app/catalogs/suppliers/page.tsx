"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react"
import { suppliersApi } from "@/lib/api"
import type { Supplier } from "@/types"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [newSupplier, setNewSupplier] = useState("")
  const [newContactName, setNewContactName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newEmail, setNewEmail] = useState("")

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = () => {
    suppliersApi.list().then((data) => {
      setSuppliers(data)
      setLoading(false)
    })
  }

  const handleCreate = async () => {
    if (!newSupplier.trim()) return
    
    await suppliersApi.create({ 
      name: newSupplier, 
      contact_name: newContactName || undefined,
      phone: newPhone || undefined,
      email: newEmail || undefined
    })
    
    setNewSupplier("")
    setNewContactName("")
    setNewPhone("")
    setNewEmail("")
    loadSuppliers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proveedor?')) return
    await suppliersApi.delete(id)
    loadSuppliers()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Catálogos</span>
        </div>
        <h1 className="text-4xl font-serif text-foreground">Proveedores</h1>
        <p className="text-muted-foreground mt-1">Gestiona tus proveedores de calzado</p>
      </div>

      {/* Create Form */}
      <Card className="border-border/50 card-luxury animate-fade-in-up stagger-1 opacity-0">
        <div className="p-6 border-b border-border/30">
          <h2 className="text-lg font-serif">Nuevo Proveedor</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <Input 
              placeholder="Nombre del proveedor"
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              className="max-w-xs h-11 bg-secondary/30 border-border/50 rounded-lg input-luxury"
            />
            <Input 
              placeholder="Nombre de contacto"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              className="max-w-xs h-11 bg-secondary/30 border-border/50 rounded-lg input-luxury"
            />
            <Input 
              placeholder="Teléfono"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="max-w-xs h-11 bg-secondary/30 border-border/50 rounded-lg input-luxury"
            />
            <Input 
              placeholder="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
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
      ) : suppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier, idx) => (
            <Card 
              key={supplier.id}
              className={`border-border/50 card-luxury stagger-${Math.min(idx + 2, 8)} opacity-0 animate-fade-in-up`}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">{supplier.name}</h3>
                    {supplier.contact_name && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        Contacto: {supplier.contact_name}
                      </p>
                    )}
                    {supplier.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Tel: {supplier.phone}
                      </p>
                    )}
                    {supplier.email && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Email: {supplier.email}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleDelete(supplier.id)}>
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
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No hay proveedores. ¡Crea el primero!</p>
        </div>
      )}
    </div>
  )
}
