"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import {
  useFinanceKPIs,
  useFinanceAnalysis,
  useBreakEven,
  useCashFlow,
  useSalesChart,
  useTopProducts,
  useSetting,
  useUpdateSetting
} from "@/lib/hooks/use-queries"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

// Currency formatter for COP
const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Date range presets
const datePresets = [
  { label: 'Este mes', value: 'this_month' },
  { label: 'Mes anterior', value: 'last_month' },
  { label: 'Últimos 3 meses', value: 'last_3_months' },
  { label: 'Este año', value: 'this_year' },
  { label: 'Todo', value: 'all' },
]

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6']

type TabType = 'analisis' | 'equilibrio' | 'flujo' | 'graficos'

export default function FinanzasPage() {
  const [activeTab, setActiveTab] = useState<TabType>('analisis')
  const [period, setPeriod] = useState('all')
  const [fixedCosts, setFixedCosts] = useState<string>('0')
  const [fixedCostsMonthly, setFixedCostsMonthly] = useState<string>('0')

  // Fetch fixed costs from database
  const { data: fixedCostsData } = useSetting('fixed_costs')
  const updateSettingMutation = useUpdateSetting()

  // Set initial value from database
  useEffect(() => {
    if (fixedCostsData?.value) {
      setFixedCosts(fixedCostsData.value)
      setFixedCostsMonthly(fixedCostsData.value)
    }
  }, [fixedCostsData])

  // Save fixed costs to database when they change
  const handleFixedCostsChange = (value: string) => {
    setFixedCosts(value)
    setFixedCostsMonthly(value)
    // Save to backend
    updateSettingMutation.mutate({ settingId: 'fixed_costs', value })
  }

  // Calculate date range based on preset
  const getDateRange = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    
    switch (period) {
      case 'this_month':
        return {
          startDate: new Date(year, month, 1).toISOString(),
          endDate: new Date(year, month + 1, 0).toISOString()
        }
      case 'last_month':
        return {
          startDate: new Date(year, month - 1, 1).toISOString(),
          endDate: new Date(year, month, 0).toISOString()
        }
      case 'last_3_months':
        return {
          startDate: new Date(year, month - 3, 1).toISOString(),
          endDate: new Date(year, month + 1, 0).toISOString()
        }
      case 'this_year':
        return {
          startDate: new Date(year, 0, 1).toISOString(),
          endDate: new Date(year, 11, 31).toISOString()
        }
      default:
        return { startDate: undefined, endDate: undefined }
    }
  }

  const dateRange = getDateRange()

  // Fetch data using hooks
  const { data: kpisData, isLoading: kpisLoading } = useFinanceKPIs(dateRange.startDate, dateRange.endDate)
  const { data: analysisData, isLoading: analysisLoading } = useFinanceAnalysis(
    parseFloat(fixedCosts) || 0, 
    dateRange.startDate, 
    dateRange.endDate
  )
  const { data: breakEvenData, isLoading: breakEvenLoading } = useBreakEven(parseFloat(fixedCosts) || 0)
  const { data: cashFlowData, isLoading: cashFlowLoading } = useCashFlow(6, parseFloat(fixedCostsMonthly) || 0)
  const { data: salesChartData, isLoading: salesChartLoading } = useSalesChart(12)
  const { data: topProductsData, isLoading: topProductsLoading } = useTopProducts(5)

  const tabs: { id: TabType; label: string }[] = [
    { id: 'analisis', label: 'Análisis' },
    { id: 'equilibrio', label: 'Equilibrio' },
    { id: 'flujo', label: 'Flujo' },
    { id: 'graficos', label: 'Gráficos' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Finanzas</h1>
        
        <div className="flex gap-4">
          {/* Fixed Costs Input */}
          <div className="w-48">
            <Label className="text-xs text-muted-foreground">Costos fijos mensuales</Label>
            <Input
              type="number"
              value={fixedCosts}
              onChange={(e) => handleFixedCostsChange(e.target.value)}
              placeholder="0"
            />
          </div>
          
          {/* Period Selector */}
          <div className="w-48">
            <Label className="text-xs text-muted-foreground">Período</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {datePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Facturación Total</CardTitle>
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            ) : (
              <p className="text-2xl font-bold text-amber-600">
                {formatCOP(kpisData?.facturacion_total || 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cantidad de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            ) : (
              <p className="text-2xl font-bold">{kpisData?.cantidad_ventas || 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            ) : (
              <p className="text-2xl font-bold">{formatCOP(kpisData?.ticket_promedio || 0)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Margen Bruto</CardTitle>
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            ) : (
              <p className={`text-2xl font-bold ${(Number(kpisData?.margen_bruto_porcentaje) || 0) > 50 ? 'text-green-600' : 'text-amber-600'}`}>
                {Number(kpisData?.margen_bruto_porcentaje || 0).toFixed(1)}%
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'analisis' && (
        <Card>
          <CardHeader>
            <CardTitle>Análisis Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                  <p className="text-xl font-bold text-green-600">{formatCOP(analysisData?.ingresos || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Costo Mercancía</p>
                  <p className="text-xl font-bold text-red-500">{formatCOP(analysisData?.costo_mercancia || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margen Bruto</p>
                  <p className="text-xl font-bold text-amber-600">{formatCOP(analysisData?.margen_bruto || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Costos Fijos</p>
                  <p className="text-xl font-bold text-red-500">{formatCOP(analysisData?.costos_fijos || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margen Neto</p>
                  <p className={`text-xl font-bold ${(analysisData?.margen_neto || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCOP(analysisData?.margen_neto || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilidad Neta</p>
                  <p className={`text-xl font-bold ${(analysisData?.utilidad_neta || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCOP(analysisData?.utilidad_neta || 0)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'equilibrio' && (
        <Card>
          <CardHeader>
            <CardTitle>Punto de Equilibrio</CardTitle>
          </CardHeader>
          <CardContent>
            {breakEvenLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Precio Promedio Venta</p>
                    <p className="text-lg font-bold">{formatCOP(breakEvenData?.precio_promedio_venta || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Costo Unitario</p>
                    <p className="text-lg font-bold">{formatCOP(breakEvenData?.costo_promedio_unitario || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Margen Contribución</p>
                    <p className="text-lg font-bold text-green-600">{formatCOP(breakEvenData?.margen_contribucion_unitario || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Costos Fijos</p>
                    <p className="text-lg font-bold">{formatCOP(breakEvenData?.costos_fijos || 0)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Necesitas vender para cubrir costos:</p>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-3xl font-bold text-amber-600">{breakEvenData?.unidades_equilibrio || 0}</p>
                      <p className="text-sm text-muted-foreground">pares</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-amber-600">{formatCOP(breakEvenData?.ventas_minimas_cop || 0)}</p>
                      <p className="text-sm text-muted-foreground">ventas mínimas</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'flujo' && (
        <Card>
          <CardHeader>
            <CardTitle>Flujo de Caja</CardTitle>
          </CardHeader>
          <CardContent>
            {cashFlowLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Período</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Ingresos</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Costo Mercancía</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Costos Fijos</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Balance Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlowData?.data?.map((item: any) => (
                      <tr key={item.periodo} className="border-b">
                        <td className="py-2 font-medium">{item.periodo}</td>
                        <td className="text-right text-green-600">{formatCOP(item.ingresos)}</td>
                        <td className="text-right text-red-500">{formatCOP(item.costo_mercancia)}</td>
                        <td className="text-right text-red-500">{formatCOP(item.costos_fijos)}</td>
                        <td className={`text-right font-bold ${item.balance_neto >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {formatCOP(item.balance_neto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'graficos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              {salesChartLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[...(salesChartData?.data || [])].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes_nombre" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatCOP(value)} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => formatCOP(Number(value))} />
                    <Bar dataKey="facturacion" fill="#f59e0b" name="Facturación" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Productos</CardTitle>
            </CardHeader>
            <CardContent>
              {topProductsLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProductsData?.data || []}
                      dataKey="facturacion"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {(topProductsData?.data || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCOP(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}