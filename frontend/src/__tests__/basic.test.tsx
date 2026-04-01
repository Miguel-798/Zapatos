import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Simple component for testing
function TestComponent() {
  return (
    <div>
      <h1>Test Component</h1>
      <p>Hello from test</p>
    </div>
  )
}

describe('Basic Component Tests', () => {
  it('renders test component', () => {
    render(<TestComponent />)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
    expect(screen.getByText('Hello from test')).toBeInTheDocument()
  })

  it('math works correctly', () => {
    expect(1 + 1).toBe(2)
    expect(10 * 5).toBe(50)
  })

  it('string operations work', () => {
    const text = 'inventarioZapatos'
    expect(text.toUpperCase()).toBe('INVENTARIOZAPATOS')
    expect(text.length).toBe(16)
  })
})