"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Factory, 
  Truck, 
  MapPin,
  Palette,
  Layers,
  Ruler,
  Sun,
  User,
  ChevronLeft,
  ChevronRight,
  Footprints,
  ShoppingCart
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventario", href: "/inventory", icon: Package },
  { name: "Ventas", href: "/ventas", icon: ShoppingCart },
  { name: "Categorías", href: "/catalogs/categories", icon: Tags },
  { name: "Marcas", href: "/catalogs/brands", icon: Factory },
  { name: "Proveedores", href: "/catalogs/suppliers", icon: Truck },
  { name: "Ubicaciones", href: "/catalogs/locations", icon: MapPin },
  { name: "Colores", href: "/catalogs/colors", icon: Palette },
  { name: "Materiales", href: "/catalogs/materials", icon: Layers },
  { name: "Tallas", href: "/catalogs/sizes", icon: Ruler },
  { name: "Temporadas", href: "/catalogs/seasons", icon: Sun },
  { name: "Géneros", href: "/catalogs/genders", icon: User },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleNavClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <aside 
      className={cn(
        "relative h-screen flex flex-col bg-card border-r border-border transition-all duration-300 ease-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "p-6 border-b border-border transition-all duration-300",
        collapsed ? "px-4 justify-center" : ""
      )}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-serif text-foreground leading-tight">Luxe</h1>
              <p className="text-xs text-muted-foreground">Footwear</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto transition-all duration-300",
        collapsed ? "px-2" : "px-4"
      )}>
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.href} 
                style={{ animationDelay: `${index * 0.03}s` }}
                className="animate-fade-in-up opacity-0"
              >
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "sidebar-link",
                    isActive && "active",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )} />
                  {!collapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Button - Solo visible en desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border items-center justify-center shadow-sm hover:bg-secondary transition-all duration-200",
          collapsed && "-right-3"
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Footer */}
      <div className={cn(
        "p-4 border-t border-border transition-all duration-300",
        collapsed ? "px-2" : ""
      )}>
        {!collapsed && (
          <p className="text-xs text-muted-foreground text-center animate-fade-in">
            © 2026 Luxe Footwear
          </p>
        )}
      </div>
    </aside>
  )
}
