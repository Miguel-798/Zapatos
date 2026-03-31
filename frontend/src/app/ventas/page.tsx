"use client"

import { useState, useEffect } from "react"
import { salesApi, shoesApi } from "@/lib/api"
import { CreateSaleDTO, SaleWithDetails, ShoeDetail, SaleBatch, SaleBatchItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ShoppingCart, Package, DollarSign, Trash2, Search, Plus, X } from "lucide-react"

interface CartItem {
  shoe_id: string
  size_id: string
  size_number: number
  shoe_name: string
  shoe_sku: string
  quantity: number
  stock_quantity: number
  sale_price: number
}

export default function VentasPage() {
  const { toast } = useToast()
  
  const [shoes, setShoes] = useState<ShoeDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Search
  const [searchQuery, setSearchQuery] = useState("")
  
  // Cart
  const [cart, setCart] = useState<CartItem[]>([])
  
  // Sales batches (invoices)
  const [salesBatches, setSalesBatches] = useState<SaleBatch[]>([])
  const [batchesLoading, setBatchesLoading] = useState(true)
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)
  
  // Product selection modal
  const [showProductSelect, setShowProductSelect] = useState(false)
  const [selectedShoe, setSelectedShoe] = useState<ShoeDetail | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
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
  
  // Load shoes
  useEffect(() => {
    const loadShoes = async () => {
      try {
        const response = await shoesApi.list({}, 1, 100)
        // Filter shoes with stock > 0
        const shoesWithStock = response.data.filter(
          shoe => shoe.sizes && shoe.sizes.some(s => s.stock_quantity > 0)
        )
        setShoes(shoesWithStock)
      } catch (error) {
        console.error("Error loading shoes:", error)
      } finally {
        setLoading(false)
      }
    }
    loadShoes()
  }, [])
  
  // Load sales batches
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const response = await salesApi.listBatches(1, 10)
        setSalesBatches(response.data)
      } catch (error) {
        console.error("Error loading batches:", error)
      } finally {
        setBatchesLoading(false)
      }
    }
    loadBatches()
  }, [])
  
  // Filtered shoes by search
  const filteredShoes = shoes.filter(shoe => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return shoe.name.toLowerCase().includes(query) || 
           shoe.sku.toLowerCase().includes(query) ||
           (shoe.brand_name && shoe.brand_name.toLowerCase().includes(query))
  })
  
  // Get available sizes for selected shoe
  const availableSizes = selectedShoe?.sizes?.filter(s => s.stock_quantity > 0) || []
  
  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.sale_price * item.quantity), 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  // Add to cart
  const handleAddToCart = () => {
    if (!selectedShoe || !selectedSize) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selecciona un producto y talla",
      })
      return
    }
    
    const sizeInfo = selectedShoe.sizes?.find(s => s.size_number === selectedSize)
    if (!sizeInfo || !sizeInfo.size_id) return
    
    const price = customPrice ? parseFloat(customPrice) : (selectedShoe.price_sale || 0)
    
    // Check if already in cart
    const existingIndex = cart.findIndex(
      item => item.shoe_id === selectedShoe.id && item.size_id === sizeInfo.size_id
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
        size_id: sizeInfo.size_id,
        size_number: selectedSize,
        shoe_name: selectedShoe.name,
        shoe_sku: selectedShoe.sku,
        quantity,
        stock_quantity: sizeInfo.stock_quantity,
        sale_price: price,
      }])
    }
    
    // Reset selection
    setSelectedShoe(null)
    setSelectedSize(null)
    setQuantity(1)
    setCustomPrice("")
    setShowProductSelect(false)
  }
  
  // Remove from cart
  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }
  
  // Submit sale
  const handleSubmitSale = async () => {
    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Agrega productos al carrito",
      })
      return
    }
    
    setSubmitting(true)
    
    try {
      const items = cart.map(item => ({
        shoe_id: item.shoe_id,
        size_id: item.size_id,
        quantity: item.quantity,
        sale_price: item.sale_price,
      }))
      
      const result = await salesApi.registerBatch({ items })
      
      toast({
        title: "Venta registrada",
        description: `${result.invoice_number} - ${formatCOP(result.total_amount)}`,
        className: "bg-green-50 border-green-200",
      })
      
      // Clear cart
      setCart([])
      
      // Reload batches
      const response = await salesApi.listBatches(1, 10)
      setSalesBatches(response.data)
      
      // Reload shoes to update stock
      const shoesResponse = await shoesApi.list({}, 1, 100)
      const shoesWithStock = shoesResponse.data.filter(
        shoe => shoe.sizes && shoe.sizes.some(s => s.stock_quantity > 0)
      )
      setShoes(shoesWithStock)
      
    } catch (error: any) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-amber-600" />
        <h1 className="text-2xl font-serif">Punto de Venta</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cart / New Sale */}
        <div className="space-y-4">
          {/* Cart */}
          <Card className="border-amber-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent border-b">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito de Venta
                </span>
                {cart.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {cartItemsCount} productos
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Add Product Button */}
              <Button 
                onClick={() => setShowProductSelect(true)}
                className="w-full mb-4 bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
              
              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No hay productos en el carrito</p>
                  <p className="text-sm">Agrega productos para comenzar una venta</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.shoe_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Talla {item.size_number} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-700">
                          {formatCOP(item.sale_price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total */}
                  {cart.length > 0 && (
                    <div className="pt-4 border-t border-amber-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Total:</span>
                        <span className="text-2xl font-bold text-amber-700">
                          {formatCOP(cartTotal)}
                        </span>
                      </div>
                      
                      <Button 
                        onClick={handleSubmitSale}
                        disabled={submitting}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Registrar Venta
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right: Sales History */}
        <div className="space-y-4">
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Historial de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {batchesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : salesBatches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No hay ventas registradas</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {salesBatches.map((batch) => (
                    <div key={batch.batch_id}>
                      <div 
                        className="p-3 rounded-lg bg-green-50 border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                        onClick={() => setExpandedBatchId(expandedBatchId === batch.batch_id ? null : batch.batch_id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{batch.invoice_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(batch.sale_date)}
                            </p>
                          </div>
                          <span className="font-bold text-green-700">
                            {formatCOP(batch.total_amount)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>{batch.items.length} producto(s)</span>
                          <span className="text-green-600">
                            {expandedBatchId === batch.batch_id ? '▲ Ocultar' : '▼ Ver detalles'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Expanded Items */}
                      {expandedBatchId === batch.batch_id && batch.items && (
                        <div className="mt-2 p-3 bg-white rounded-lg border border-green-200">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-muted-foreground border-b">
                                <th className="pb-2 font-medium">Producto</th>
                                <th className="pb-2 font-medium">Talla</th>
                                <th className="pb-2 font-medium text-right">Cant.</th>
                                <th className="pb-2 font-medium text-right">Precio</th>
                                <th className="pb-2 font-medium text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {batch.items.map((item, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                  <td className="py-2">
                                    <p className="font-medium">{item.shoe_name}</p>
                                    <p className="text-xs text-muted-foreground">{item.shoe_sku}</p>
                                  </td>
                                  <td className="py-2">{item.size_number}</td>
                                  <td className="py-2 text-right">{item.quantity}</td>
                                  <td className="py-2 text-right">{formatCOP(item.sale_price)}</td>
                                  <td className="py-2 text-right font-medium">{formatCOP(item.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
      {showProductSelect && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setShowProductSelect(false)}
          />
          <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-background rounded-xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <h2 className="text-lg font-semibold">Agregar Producto</h2>
              <button 
                onClick={() => setShowProductSelect(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, SKU o marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Product List */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {filteredShoes.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    No se encontraron productos
                  </p>
                ) : (
                  filteredShoes.map(shoe => (
                    <button
                      key={shoe.id}
                      onClick={() => {
                        setSelectedShoe(shoe)
                        setSelectedSize(null)
                        setCustomPrice(shoe.price_sale?.toString() || "")
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedShoe?.id === shoe.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <p className="font-medium">{shoe.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {shoe.sku} • {shoe.brand_name || 'Sin marca'}
                      </p>
                      {shoe.price_sale && (
                        <p className="text-sm font-medium text-amber-700 mt-1">
                          {formatCOP(shoe.price_sale)}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
              
              {/* Size & Quantity Selection */}
              {selectedShoe && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label>Talla</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableSizes.map(size => (
                        <button
                          key={size.size_number}
                          onClick={() => setSelectedSize(size.size_number)}
                          className={`px-3 py-1.5 rounded-md border text-sm transition-all ${
                            selectedSize === size.size_number
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'hover:border-amber-300'
                          }`}
                        >
                          {size.size_number} ({size.stock_quantity})
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        max={selectedSize ? availableSizes.find(s => s.size_number === selectedSize)?.stock_quantity : 1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                    <div>
                      <Label>Precio Unit.</Label>
                      <Input
                        type="number"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder={selectedShoe.price_sale?.toString() || "0"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t bg-muted/30 shrink-0">
              <Button variant="outline" onClick={() => setShowProductSelect(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddToCart}
                disabled={!selectedShoe || !selectedSize}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
