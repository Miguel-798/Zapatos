"use client"
import { useState, useEffect } from "react"
import { ShoeGrid } from "@/components/inventory/shoe-grid"
import { ShoeFilters } from "@/components/inventory/shoe-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { shoesApi } from "@/lib/api"
import { useShoes, useCategories, useBrands, useGenders, useColors, useMaterials, useCreateShoe, useUpdateShoe, useDeleteShoe } from "@/lib/hooks/use-queries"
import { Plus, Sparkles, X, Pencil, Trash2 } from "lucide-react"
import type { ShoeDetail, ShoeFilters as ShoeFiltersType, Category, Brand, Gender, Color, Material } from "@/types"

export default function InventoryPage() {
  const [filters, setFilters] = useState<ShoeFiltersType>({})
  const [page, setPage] = useState(1)
  
  // Use React Query hooks for data fetching
  const { data: shoesData, isLoading: loading } = useShoes(filters, page, 20)
  const { data: categoriesData } = useCategories()
  const { data: brandsData } = useBrands()
  const { data: gendersData } = useGenders()
  const { data: colorsData } = useColors()
  const { data: materialsData } = useMaterials()
  
  const shoes = shoesData?.data || []
  const total = shoesData?.total || 0
  
  // Set data from hooks
  const categories = categoriesData || []
  const brands = brandsData || []
  const genders = gendersData || []
  const colors = colorsData || []
  const materials = materialsData || []
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedShoe, setSelectedShoe] = useState<ShoeDetail | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    brand_id: "",
    gender_id: "",
    price_cost: "",
    price_sale: "",
    stock: "0",
  })
  
  // Selected colors and materials
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleShoeClick = (shoe: ShoeDetail) => {
    setSelectedShoe(shoe)
  }
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingShoe, setEditingShoe] = useState<ShoeDetail | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    brand_id: "",
    gender_id: "",
    price_cost: "",
    price_sale: "",
  })
  const [editSelectedSizes, setEditSelectedSizes] = useState<{ stock: number }>({ stock: 0 })
  const [editSelectedColors, setEditSelectedColors] = useState<string[]>([])
  const [editSelectedMaterials, setEditSelectedMaterials] = useState<string[]>([])
  const [updating, setUpdating] = useState(false)
  
  const handleEditShoe = (shoe: ShoeDetail) => {
    // Close detail modal and open edit modal
    setSelectedShoe(null)
    setEditingShoe(shoe)
    setEditFormData({
      name: shoe.name,
      description: shoe.description || "",
      category_id: shoe.category_id || "",
      brand_id: shoe.brand_id || "",
      gender_id: shoe.gender_id || "",
      price_cost: shoe.price_cost?.toString() || "",
      price_sale: shoe.price_sale?.toString() || "",
    })
    // Initialize stock from shoe
    setEditSelectedSizes({ stock: shoe.stock || 0 })
    // Initialize colors and materials
    setEditSelectedColors([])
    setEditSelectedMaterials([])
    setShowEditModal(true)
  }
  
  // Mutations
  const createShoe = useCreateShoe()
  const updateShoe = useUpdateShoe()
  const deleteShoe = useDeleteShoe()
  
  const handleUpdateShoe = async () => {
    if (!editingShoe || !editFormData.name.trim()) return
    
    setUpdating(true)
    try {
      await updateShoe.mutateAsync({
        id: editingShoe.id,
        data: {
          name: editFormData.name,
          description: editFormData.description || undefined,
          category_id: editFormData.category_id || undefined,
          brand_id: editFormData.brand_id || undefined,
          gender_id: editFormData.gender_id || undefined,
          price_cost: editFormData.price_cost ? parseFloat(editFormData.price_cost) : undefined,
          price_sale: editFormData.price_sale ? parseFloat(editFormData.price_sale) : undefined,
          stock: editSelectedSizes.stock || 0,
        }
      })
      
      setShowEditModal(false)
      setEditingShoe(null)
    } catch (err: any) {
      console.error("Error updating shoe:", err)
      alert(err.message || "Error al actualizar el zapato")
    }
    setUpdating(false)
  }
  
  const handleDeleteShoe = async (shoeId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return
    
    try {
      await deleteShoe.mutateAsync(shoeId)
      setSelectedShoe(null)
    } catch (err: any) {
      console.error("Error deleting shoe:", err)
      alert(err.message || "Error al eliminar el zapato")
    }
  }

  const handleCreateShoe = async () => {
    if (!formData.name.trim()) return
    
    setSaving(true)
    try {
      console.log("Creating shoe with data:", formData, "colors:", selectedColors, "materials:", selectedMaterials)
      await createShoe.mutateAsync({
        sku: "",  // Se generará automáticamente en el backend
        name: formData.name,
        description: formData.description || undefined,
        category_id: formData.category_id || undefined,
        brand_id: formData.brand_id || undefined,
        gender_id: formData.gender_id || undefined,
        price_cost: formData.price_cost ? parseFloat(formData.price_cost) : undefined,
        price_sale: formData.price_sale ? parseFloat(formData.price_sale) : undefined,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        color_ids: selectedColors,
        material_ids: selectedMaterials,
      })
      
      // Close modal and reset form
      closeModal()
    } catch (err: any) {
      console.error("Error creating shoe:", err)
      setError(err.message || "Error al crear el zapato")
    }
    setSaving(false)
  }
   
  const closeModal = () => {
    setShowModal(false)
    setFormData({
      sku: "",
      name: "",
      description: "",
      category_id: "",
      brand_id: "",
      gender_id: "",
      price_cost: "",
      price_sale: "",
      stock: "0",
    })
    setSelectedColors([])
    setSelectedMaterials([])
    setError("")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Catálogo</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-foreground">Inventario</h1>
            <p className="text-muted-foreground mt-1">
              {total > 0 ? `${total} productos disponibles` : 'Gestiona tu colección'}
            </p>
          </div>
          <Button 
            className="btn-luxury gap-2 h-11 px-5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-900/20"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nuevo Zapato
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-in-up stagger-1 opacity-0">
        <ShoeFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <ShoeGrid shoes={shoes} onShoeClick={handleShoeClick} />
          
          {total > 20 && (
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {Math.ceil(total / 20)}
              </span>
              <Button 
                variant="outline"
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {showModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-50 bg-black/60"
            onClick={closeModal}
          />
          {/* Modal */}
          <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:w-full sm:max-w-lg bg-background rounded-xl shadow-2xl border flex flex-col sm:max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
              <h2 className="text-xl font-serif">Nuevo Zapato</h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del producto *</Label>
                <Input 
                  id="name"
                  placeholder="Air Max 90"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input 
                  id="description"
                  placeholder="Descripción del producto"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select 
                    id="category"
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Seleccionar</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <select 
                    id="brand"
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={formData.brand_id}
                    onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                  >
                    <option value="">Seleccionar</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <select 
                    id="gender"
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={formData.gender_id}
                    onChange={(e) => setFormData({...formData, gender_id: e.target.value})}
                  >
                    <option value="">Seleccionar</option>
                    {genders.map(gender => (
                      <option key={gender.id} value={gender.id}>{gender.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_cost">Precio Costo</Label>
                  <Input 
                    id="price_cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price_cost}
                    onChange={(e) => setFormData({...formData, price_cost: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_sale">Precio Venta</Label>
                  <Input 
                    id="price_sale"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price_sale}
                    onChange={(e) => setFormData({...formData, price_sale: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Colors Section */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-medium">Colores</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setSelectedColors(prev => 
                          prev.includes(color.id)
                            ? prev.filter(id => id !== color.id)
                            : [...prev, color.id]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedColors.includes(color.id)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
                {colors.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No hay colores disponibles.
                  </p>
                )}
              </div>
              
              {/* Materials Section */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-medium">Materiales</Label>
                <div className="flex flex-wrap gap-2">
                  {materials.map(material => (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => {
                        setSelectedMaterials(prev => 
                          prev.includes(material.id)
                            ? prev.filter(id => id !== material.id)
                            : [...prev, material.id]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedMaterials.includes(material.id)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      {material.name}
                    </button>
                  ))}
                </div>
                {materials.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No hay materiales disponibles.
                  </p>
                )}
              </div>
              
              {/* Stock Section */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-medium">Stock</Label>
                <p className="text-sm text-muted-foreground">
                  Ingresa la cantidad total en inventario
                </p>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t bg-muted/30 shrink-0">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateShoe}
                disabled={saving || !formData.name}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {saving ? "Guardando..." : "Guardar Zapato"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedShoe && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setSelectedShoe(null)}
          />
          <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-background rounded-xl shadow-2xl border flex flex-col sm:max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
              <h2 className="text-xl font-serif">{selectedShoe.name}</h2>
              <button 
                onClick={() => setSelectedShoe(null)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-medium">{selectedShoe.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precio Venta</p>
                  <p className="font-medium text-amber-600">${selectedShoe.price_sale?.toLocaleString() || '0'}</p>
                </div>
              </div>
              
              {selectedShoe.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p>{selectedShoe.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Marca</p>
                  <p className="font-medium">{selectedShoe.brand_name || 'Sin marca'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium">{selectedShoe.category_name || 'Sin categoría'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Género</p>
                  <p className="font-medium">{selectedShoe.gender_name || 'Sin género'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precio Costo</p>
                  <p className="font-medium">${selectedShoe.price_cost?.toLocaleString() || '0'}</p>
                </div>
              </div>
              
              {/* Colors Section */}
              {selectedShoe.colors && selectedShoe.colors.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Colores</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedShoe.colors.map((color, idx) => (
                      <span key={idx} className="px-2 py-1 bg-secondary rounded-md text-sm">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Materials Section */}
              {selectedShoe.materials && selectedShoe.materials.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Materiales</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedShoe.materials.map((material, idx) => (
                      <span key={idx} className="px-2 py-1 bg-secondary rounded-md text-sm">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Stock Section */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">Stock</p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Cantidad total</span>
                  <span className={`text-lg font-bold ${
                    (selectedShoe.stock || 0) <= 2 ? 'text-red-500' : 'text-amber-600'
                  }`}>
                    {selectedShoe.stock || 0} unidades
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-3 p-4 sm:p-6 border-t bg-muted/30 shrink-0">
              <Button 
                variant="destructive"
                onClick={() => handleDeleteShoe(selectedShoe.id)}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedShoe(null)}>
                  Cerrar
                </Button>
                <Button 
                  onClick={() => handleEditShoe(selectedShoe)}
                  className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Edit Modal */}
      {showEditModal && editingShoe && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setShowEditModal(false)}
          />
          <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-background rounded-xl shadow-2xl border flex flex-col sm:max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
              <h2 className="text-xl font-serif">Editar Zapato</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre del producto *</Label>
                <Input 
                  id="edit-name"
                  placeholder="Air Max 90"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Input 
                  id="edit-description"
                  placeholder="Descripción del producto"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <select 
                    id="edit-category"
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={editFormData.category_id}
                    onChange={(e) => setEditFormData({...editFormData, category_id: e.target.value})}
                  >
                    <option value="">Seleccionar</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Marca</Label>
                  <select 
                    id="edit-brand"
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={editFormData.brand_id}
                    onChange={(e) => setEditFormData({...editFormData, brand_id: e.target.value})}
                  >
                    <option value="">Seleccionar</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Género</Label>
                  <select 
                    id="edit-gender"
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={editFormData.gender_id}
                    onChange={(e) => setEditFormData({...editFormData, gender_id: e.target.value})}
                  >
                    <option value="">Seleccionar</option>
                    {genders.map(gender => (
                      <option key={gender.id} value={gender.id}>{gender.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price_cost">Precio Costo</Label>
                  <Input 
                    id="edit-price_cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editFormData.price_cost}
                    onChange={(e) => setEditFormData({...editFormData, price_cost: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price_sale">Precio Venta</Label>
                  <Input 
                    id="edit-price_sale"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editFormData.price_sale}
                    onChange={(e) => setEditFormData({...editFormData, price_sale: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Stock Section */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-medium">Stock</Label>
                <p className="text-sm text-muted-foreground">
                  Actualiza la cantidad total en inventario
                </p>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={editSelectedSizes.stock || 0}
                  onChange={(e) => setEditSelectedSizes({ stock: Math.max(0, parseInt(e.target.value) || 0) })}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t bg-muted/30 shrink-0">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateShoe}
                disabled={updating || !editFormData.name}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {updating ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
