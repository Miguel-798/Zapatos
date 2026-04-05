"use client"

import { useState } from "react"
import { ShoeDetail } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useShoesWithStock, useSaleBatches, useRegisterSaleBatch, useDeleteSaleBatch } from "@/lib/hooks/use-queries"
import { Loader2, ShoppingCart, Package, DollarSign, Trash2, Search, Plus, X } from "lucide-react"

interface CartItem {
  shoe_id: string
  shoe_name: string
  shoe_sku: string
  quantity: number
  stock_available: number
  sale_price: number
}

export default function VentasPage() {
  const { toast } = useToast()
  
  // Use React Query hooks
  const { data: shoesData, isLoading: loading } = useShoesWithStock()
  const { data: batchesData, isLoading: batchesLoading } = useSaleBatches(1, 10)
  const registerSale = useRegisterSaleBatch()
  const deleteSaleBatch = useDeleteSaleBatch()
  
  const shoes = shoesData || []
  const salesBatches = batchesData?.data || []
  
  const [submitting, setSubmitting] = useState(false)
  
  // Delete confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingBatch, setDeletingBatch] = useState<any>(null)
  
  // Search
  const [searchQuery, setSearchQuery] = useState("")
  
  // Cart
  const [cart, setCart] = useState<CartItem[]>([])
  
  // Expanded batch details
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)
  
  // Product selection modal
  const [showProductSelect, setShowProductSelect] = useState(false)
  const [selectedShoe, setSelectedShoe] = useState<ShoeDetail | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [customPrice, setCustomPrice] = useState<string>("")
  
  // Format COP currency
  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = dateStr.endsWith('Z') 
      ? new Date(dateStr) 
      : new Date(dateStr + 'Z');
    return date.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      dateStyle: 'short',
      timeStyle: 'short'
    })
  }

  // Filtered shoes by search
  const filteredShoes = shoes.filter(shoe => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return shoe.name.toLowerCase().includes(query) || 
           shoe.sku.toLowerCase().includes(query) ||
           (shoe.brand_name && shoe.brand_name.toLowerCase().includes(query))
  })
  
  // Get available stock for selected shoe
  const availableStock = (selectedShoe?.stock || 0)
  
  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.sale_price * item.quantity), 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  // Add to cart
  const handleAddToCart = () => {
    if (!selectedShoe) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selecciona un producto",
      })
      return
    }
    
    const price = customPrice ? parseFloat(customPrice) : (selectedShoe.price_sale || 0)
    const available = selectedShoe.stock || 0
    
    // Check if already in cart
    const existingIndex = cart.findIndex(
      item => item.shoe_id === selectedShoe.id
    )
    
    if (existingIndex >= 0) {
      // Update quantity
      const newCart = [...cart]
      newCart[existingIndex].quantity += quantity
      setCart(newCart)
    } else {
      // Add new item
      setCart([...cart, {
        shoe_id: selectedShoe.id,
        shoe_name: selectedShoe.name,
        shoe_sku: selectedShoe.sku,
        quantity: quantity,
        stock_available: available,
        sale_price: price
      }])
    }
    
    // Reset selection
    setSelectedShoe(null)
    setQuantity(1)
    setCustomPrice("")
    setShowProductSelect(false)
    
    toast({
      title: "Agregado al carrito",
      description: `${selectedShoe.name} x${quantity}`,
    })
  }
  
  // Remove from cart
  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }
  
  // Update cart item quantity
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const newCart = [...cart]
    newCart[index].quantity = newQuantity
    setCart(newCart)
  }
  
  // Submit sale
  const handleSubmitSale = async () => {
    if (cart.length === 0) return
    
    setSubmitting(true)
    try {
      // Register batch of sales
      const items = cart.map(item => ({
        shoe_id: item.shoe_id,
        quantity: item.quantity,
        sale_price: item.sale_price,
      }))
      
      await registerSale.mutateAsync({ items })
      
      toast({
        title: "Venta registrada",
        description: `${cart.length} productos vendidos`,
      })
      
      // Clear cart
      setCart([])
      
    } catch (error: any) {
      console.error("Error registering sale:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al registrar venta",
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Selection & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Seleccionar Producto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, SKU o marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                {filteredShoes.map(shoe => (
                  <button
                    key={shoe.id}
                    onClick={() => {
                      setSelectedShoe(shoe)
                      setShowProductSelect(true)
                    }}
                    className={`p-3 rounded-lg border text-left transition-all hover:border-amber-500 ${
                      selectedShoe?.id === shoe.id ? 'border-amber-500 bg-amber-50' : 'border-border'
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{shoe.name}</p>
                    <p className="text-xs text-muted-foreground">{shoe.sku}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-bold text-amber-600">
                        {formatCOP(shoe.price_sale || 0)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Stock: {shoe.stock || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredShoes.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No hay productos disponibles
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Carrito de Ventas
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {cartItemsCount} items
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  El carrito está vacío
                </p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.shoe_name}</p>
                        <p className="text-sm text-muted-foreground">{item.shoe_sku}</p>
                        <p className="text-sm text-muted-foreground">
                          Disponible: {item.stock_available}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                            disabled={item.quantity >= item.stock_available}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="font-bold text-amber-600 w-24 text-right">
                          {formatCOP(item.sale_price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="text-2xl font-bold text-amber-600">
                      {formatCOP(cartTotal)}
                    </span>
                  </div>
                  
                  <Button
                    className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
                    onClick={handleSubmitSale}
                    disabled={submitting || cart.length === 0}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <DollarSign className="h-4 w-4 mr-2" />
                    )}
                    Registrar Venta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Sales History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Historial de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {batchesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                </div>
              ) : salesBatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay ventas registradas
                </p>
              ) : (
                <div className="space-y-3">
                  {salesBatches.map(batch => (
                    <div key={batch.batch_id} className="border rounded-lg overflow-hidden">
                      <button
                        className="w-full p-3 text-left hover:bg-muted/50 flex justify-between items-center"
                        onClick={() => setExpandedBatchId(
                          expandedBatchId === batch.batch_id ? null : batch.batch_id
                        )}
                      >
                        <div>
                          <p className="font-medium">{batch.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(batch.sale_date)}
                          </p>
                        </div>
                        <span className="font-bold text-amber-600">
                          {formatCOP(batch.total_amount)}
                        </span>
                      </button>
                      
                      {/* Expanded Details */}
                      {expandedBatchId === batch.batch_id && batch.items && (
                        <div className="p-3 border-t bg-muted/30">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium">Detalles:</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setDeletingBatch(batch)
                                setShowDeleteConfirm(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {batch.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <div>
                                  <span className="font-medium">{item.shoe_name}</span>
                                  <span className="text-muted-foreground"> x{item.quantity}</span>
                                </div>
                                <span className="font-medium">{formatCOP(item.subtotal)}</span>
                              </div>
                            ))}
                          </div>
                          {batch.notes && batch.notes.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Nota: {batch.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Product Selection Modal */}
      {showProductSelect && selectedShoe && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setShowProductSelect(false)}
          />
          <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-background rounded-xl shadow-2xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Agregar al Carrito</h3>
              <button 
                onClick={() => setShowProductSelect(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Producto</p>
                <p className="font-medium">{selectedShoe.name}</p>
                <p className="text-sm text-muted-foreground">SKU: {selectedShoe.sku}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={selectedShoe.price_sale?.toString() || "0"}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cantidad (Stock: {availableStock})</Label>
                  <Input
                    type="number"
                    min="1"
                    max={availableStock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(availableStock, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-xl font-bold text-amber-600">
                    {formatCOP((customPrice ? parseFloat(customPrice) : (selectedShoe.price_sale || 0)) * quantity)}
                  </span>
                </div>
              </div>
              
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && deletingBatch && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-background rounded-xl shadow-2xl border p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <Trash2 className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Eliminar Venta</h3>
              </div>
              
              <p className="text-muted-foreground">
                ¿Estás seguro de que deseas eliminar la venta <strong>{deletingBatch.invoice_number}</strong>?
              </p>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Detalles:</p>
                <p className="text-sm text-muted-foreground">
                  {deletingBatch.items?.length || 0} productos - Total: {formatCOP(deletingBatch.total_amount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Se restaurará el stock de los productos
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={async () => {
                    try {
                      await deleteSaleBatch.mutateAsync(deletingBatch.batch_id)
                      toast({
                        title: "Venta eliminada",
                        description: `Se eliminó ${deletingBatch.invoice_number} y se restauró el stock`,
                      })
                      setShowDeleteConfirm(false)
                      setDeletingBatch(null)
                    } catch (error: any) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.message || "Error al eliminar la venta",
                      })
                    }
                  }}
                  disabled={deleteSaleBatch.isPending}
                >
                  {deleteSaleBatch.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}