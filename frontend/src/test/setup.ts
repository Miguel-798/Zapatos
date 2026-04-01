import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'

// Configure global timeout for tests
jest.setTimeout(10000)

// Mock server setup for MSW (can be extended with actual handlers)
// export const server = setupServer()

// Cleanup after each test
afterEach(() => {
  // Clean up any mocks or timers
})

// Global teardown
afterAll(() => {
  // Cleanup global state
})