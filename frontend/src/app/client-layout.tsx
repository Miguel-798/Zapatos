"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DrawerContent, DrawerContent as MobileDrawer } from "@/components/ui/dialog"
import { Providers } from "@/components/providers"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Providers>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar - always visible on lg+ */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r bg-card">
          <Sidebar />
        </aside>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with mobile menu button */}
          <header className="lg:hidden h-14 border-b bg-card flex items-center px-4 gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-accent rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-serif text-lg">Luxe Footwear</span>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:flex h-16 border-b bg-card items-center justify-between px-6">
            <div className="relative w-full max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <button className="relative p-2 hover:bg-accent rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full" />
            </button>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed left-0 top-0 z-50 h-screen w-[280px] max-w-[85vw] bg-background border-r animate-in slide-in-from-left duration-300 lg:hidden">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}
      </div>
    </Providers>
  )
}
