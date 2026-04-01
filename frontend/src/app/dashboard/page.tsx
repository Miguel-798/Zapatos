"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboardSummary, useLowStock } from "@/lib/hooks/use-queries"
import { Package, AlertTriangle, TrendingUp, Clock, ArrowRight, Sparkles } from "lucide-react"
import type { LowStockShoe } from "@/types"
import Link from "next/link"

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()
  const { data: lowStockData, isLoading: lowStockLoading } = useLowStock()
  
  const loading = summaryLoading || lowStockLoading
  const lowStock = lowStockData || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Productos",
      value: summary?.total_products || 0,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Stock Bajo",
      value: summary?.low_stock_count || 0,
      icon: AlertTriangle,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      title: "Categorías",
      value: summary?.category_counts?.length || 0,
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Géneros",
      value: summary?.gender_counts?.length || 0,
      icon: Clock,
      color: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-500/10",
      iconColor: "text-sky-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Panel de Control</span>
        </div>
        <h1 className="text-4xl font-serif text-foreground">Resumen del Negocio</h1>
        <p className="text-muted-foreground mt-2">Bienvenido a tu boutique de zapatos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title}
            className={`p-5 border-border/50 card-luxury stagger-${index + 1} opacity-0 animate-fade-in-up`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-semibold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="border-border/50 card-luxury stagger-5 opacity-0 animate-fade-in-up">
          <div className="p-6 border-b border-border/30">
            <h2 className="text-xl font-serif">Productos por Categoría</h2>
          </div>
          <div className="p-6">
            {summary?.category_counts && summary.category_counts.length > 0 ? (
              <div className="space-y-4">
                {summary.category_counts.map((cat, idx) => (
                  <div key={cat.category_id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{cat.category_name}</span>
                      <span className="text-muted-foreground">{cat.count} productos</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${['from-amber-500', 'from-emerald-500', 'from-sky-500', 'from-purple-500', 'from-rose-500'][idx % 5]} to-transparent`}
                        style={{ width: `${(cat.count / (summary?.total_products || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No hay categorías disponibles</p>
            )}
          </div>
        </Card>

        {/* Genders */}
        <Card className="border-border/50 card-luxury stagger-6 opacity-0 animate-fade-in-up">
          <div className="p-6 border-b border-border/30">
            <h2 className="text-xl font-serif">Productos por Género</h2>
          </div>
          <div className="p-6">
            {summary?.gender_counts && summary.gender_counts.length > 0 ? (
              <div className="space-y-4">
                {summary.gender_counts.map((gen, idx) => (
                  <div key={gen.gender_id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="font-medium">{gen.gender_name}</span>
                    <Badge variant="secondary" className="rounded-full">
                      {gen.count} productos
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No hay géneros disponibles</p>
            )}
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-serif">Productos con Stock Bajo</h2>
              <p className="text-sm text-muted-foreground">Requiere atención inmediata</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-muted-foreground">¡Excelente! No hay productos con stock bajo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStock.map((shoe, idx) => (
                <div 
                  key={shoe.id} 
                  className={`flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors stagger-${idx + 1} opacity-0 animate-fade-in-up`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{shoe.name}</p>
                      <p className="text-sm text-muted-foreground">{shoe.sku} · {shoe.brand_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant="destructive" className="rounded-full">
                        Stock: {shoe.total_stock}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">Mínimo: {shoe.min_stock}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              <Link 
                href="/inventory" 
                className="flex items-center justify-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Ver inventario completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
