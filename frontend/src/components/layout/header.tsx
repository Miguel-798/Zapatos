"use client"
import { Input } from "@/components/ui/input"
import { Search, Bell, Plus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick?: () => void
  onClose?: () => void
}

export function Header({ onMenuClick, onClose }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group flex items-center gap-3">
          {(onMenuClick || onClose) && (
            <button 
              onClick={onMenuClick || onClose} 
              className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
            >
              {onMenuClick ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
          )}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Buscar por nombre, SKU o referencia..." 
              className="pl-11 pr-4 h-10 bg-secondary/30 border-border/50 focus:bg-secondary/50 input-luxury rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-6">
        <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/50 hover:bg-secondary/80">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="relative rounded-lg hover:bg-secondary/80">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full ring-2 ring-card" />
        </Button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-sky-500/20">
          L
        </div>
      </div>
    </header>
  )
}
